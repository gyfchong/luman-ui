#!/usr/bin/env tsx
import { execSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
} from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import semver from "semver";
import { hashFiles } from "../packages/cli/src/utils/hash.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

interface ChangesetConfig {
  changelog?: string;
  commit?: boolean;
  fixed?: string[][];
  linked?: string[][];
  access?: string;
  baseBranch?: string;
  updateInternalDependencies?: string;
  ignore?: string[];
}

function loadChangesetConfig(): ChangesetConfig {
  const configPath = join(REPO_ROOT, ".changeset", "config.json");
  if (!existsSync(configPath)) {
    console.warn("⚠ .changeset/config.json not found, using defaults");
    return {};
  }

  try {
    return JSON.parse(readFileSync(configPath, "utf-8")) as ChangesetConfig;
  } catch (error) {
    console.warn("⚠ Failed to parse .changeset/config.json:", error);
    return {};
  }
}

function scanPublishablePackages(
  ignoreList: string[] = []
): Record<string, string> {
  const packagesDir = join(REPO_ROOT, "packages");
  const publishablePackages: Record<string, string> = {};

  if (!existsSync(packagesDir)) {
    console.warn("⚠ packages directory not found");
    return publishablePackages;
  }

  const packageDirs = readdirSync(packagesDir).filter((name) => {
    const fullPath = join(packagesDir, name);
    return statSync(fullPath).isDirectory();
  });

  for (const packageDir of packageDirs) {
    const packagePath = join(packagesDir, packageDir);
    const srcPath = join(packagePath, "src");
    const packageJsonPath = join(packagePath, "package.json");

    if (!existsSync(srcPath) || !statSync(srcPath).isDirectory()) {
      continue;
    }

    if (!existsSync(packageJsonPath)) {
      console.warn(`⚠ No package.json found for ${packageDir}`);
      continue;
    }

    try {
      const packageJson = JSON.parse(
        readFileSync(packageJsonPath, "utf-8")
      ) as { name?: string };

      if (!packageJson.name) {
        console.warn(`⚠ No name field in package.json for ${packageDir}`);
        continue;
      }

      if (ignoreList.includes(packageJson.name)) {
        continue;
      }

      const pathPrefix = `packages/${packageDir}/src`;
      publishablePackages[pathPrefix] = packageJson.name;
    } catch (error) {
      console.warn(`⚠ Failed to read package.json for ${packageDir}:`, error);
    }
  }

  return publishablePackages;
}

type BumpType = "major" | "minor" | "patch";

interface ConventionalTypeConfig {
  bump: BumpType;
  display: string;
}

interface ConventionalCommit {
  type: string;
  scope?: string;
  breaking: boolean;
  subject: string;
  raw: string;
}

interface RegistryFile {
  path: string;
  content?: string;
  type: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

interface RegistryItem {
  name: string;
  version: string;
  contentHash: string;
  publishedAt: string;
  changelog: ChangelogEntry[];
  files: RegistryFile[];
}

interface RegistryItemWithPath {
  path: string;
  data: RegistryItem;
}

interface RegistryIndex {
  items: string[];
}

const CHANGESET_CONFIG = loadChangesetConfig();

const CONFIG = {
  get publishablePackages(): Record<string, string> {
    return scanPublishablePackages(CHANGESET_CONFIG.ignore || []);
  },
  get fixedGroups(): string[][] {
    return CHANGESET_CONFIG.fixed || [];
  },
  get baseBranch(): string {
    return CHANGESET_CONFIG.baseBranch || "main";
  },
  registryPath: "packages/ui/src/registry",
  conventionalTypes: {
    feat: { bump: "minor", display: "Features" },
    fix: { bump: "patch", display: "Fixes" },
    perf: { bump: "patch", display: "Performance" },
    build: { bump: "patch", display: "Build" },
    docs: null,
    test: null,
    chore: null,
    style: null,
    ci: null,
  } as Record<string, ConventionalTypeConfig | null>,
};

function getCommitsSinceMain(): string[] {
  const baseBranch = CONFIG.baseBranch;
  try {
    execSync(`git fetch origin ${baseBranch}`, {
      stdio: "pipe",
      cwd: REPO_ROOT,
    });
    const output = execSync(`git log origin/${baseBranch}..HEAD --format=%s`, {
      encoding: "utf-8",
      stdio: "pipe",
      cwd: REPO_ROOT,
    });
    return output.trim().split("\n").filter(Boolean);
  } catch (error) {
    console.log("No commits found or error fetching:", error);
    return [];
  }
}

function parseConventionalCommit(message: string): ConventionalCommit | null {
  const regex =
    /^(feat|fix|perf|build|docs|test|chore|style|ci)(\(.+?\))?(!)?:\s*(.+)$/;
  const match = message.match(regex);

  if (!match) return null;

  const [, type, scope, breaking, subject] = match;

  return {
    type,
    scope: scope ? scope.slice(1, -1) : undefined,
    breaking: !!breaking || message.includes("BREAKING CHANGE:"),
    subject,
    raw: message,
  };
}

function getChangedFiles(): string[] {
  const baseBranch = CONFIG.baseBranch;
  try {
    const output = execSync(
      `git diff --name-only origin/${baseBranch}..HEAD`,
      {
        encoding: "utf-8",
        stdio: "pipe",
        cwd: REPO_ROOT,
      }
    );
    return output.trim().split("\n").filter(Boolean);
  } catch (error) {
    console.log("Error getting changed files:", error);
    return [];
  }
}

function detectAffectedPackages(changedFiles: string[]): string[] {
  const packages = new Set<string>();

  for (const file of changedFiles) {
    for (const [pathPrefix, packageName] of Object.entries(
      CONFIG.publishablePackages
    )) {
      if (file.startsWith(pathPrefix)) {
        packages.add(packageName);
      }
    }
  }

  return Array.from(packages);
}

function applyFixedGroups(packages: string[]): string[] {
  const result = new Set(packages);

  for (const fixedGroup of CONFIG.fixedGroups) {
    const hasAny = packages.some((pkg) => fixedGroup.includes(pkg));
    if (hasAny) {
      fixedGroup.forEach((pkg) => result.add(pkg));
    }
  }

  return Array.from(result);
}

function getAllowedScopes(): Set<string> {
  const scopes = new Set<string>();

  for (const packageName of Object.values(CONFIG.publishablePackages)) {
    const scope = packageName.replace("@repo/", "");
    scopes.add(scope);
  }

  scopes.add("ui");

  return scopes;
}

function filterVersionableCommits(commits: string[]): string[] {
  const allowedScopes = getAllowedScopes();

  return commits.filter((commit) => {
    const parsed = parseConventionalCommit(commit);
    if (!parsed) return false;

    const typeConfig = CONFIG.conventionalTypes[parsed.type];
    if (!typeConfig) return false;

    if (parsed.scope && !allowedScopes.has(parsed.scope)) {
      return false;
    }

    return true;
  });
}

function determineBumpType(commits: string[]): BumpType {
  let hasBreaking = false;
  let hasMinor = false;

  for (const commit of commits) {
    const parsed = parseConventionalCommit(commit);
    if (!parsed) continue;

    const typeConfig = CONFIG.conventionalTypes[parsed.type];
    if (!typeConfig) continue;

    if (parsed.breaking) {
      hasBreaking = true;
    } else if (typeConfig.bump === "minor") {
      hasMinor = true;
    }
  }

  if (hasBreaking) return "major";
  if (hasMinor) return "minor";
  return "patch";
}

function incrementVersion(currentVersion: string, bumpType: BumpType): string {
  const newVersion = semver.inc(currentVersion, bumpType);
  if (!newVersion) {
    throw new Error(
      `Failed to increment version ${currentVersion} with bump type ${bumpType}`
    );
  }
  return newVersion;
}

function generateChangesetFile(
  packages: string[],
  bumpType: BumpType,
  commits: string[]
): void {
  if (packages.length === 0) return;

  const timestamp = Date.now();
  const filename = `auto-${timestamp}.md`;
  const filepath = join(REPO_ROOT, ".changeset", filename);

  const frontmatter = packages.map((pkg) => `"${pkg}": ${bumpType}`).join("\n");

  const grouped: Record<string, string[]> = {};
  for (const commit of commits) {
    const parsed = parseConventionalCommit(commit);
    if (!parsed) continue;

    const typeConfig = CONFIG.conventionalTypes[parsed.type];
    if (!typeConfig) continue;

    const section = typeConfig.display;
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(`- ${parsed.raw}`);
  }

  const body = Object.entries(grouped)
    .map(([section, items]) => `## ${section}\n\n${items.join("\n")}`)
    .join("\n\n");

  const content = `---\n${frontmatter}\n---\n\n${body}\n`;
  writeFileSync(filepath, content, "utf-8");

  console.log(`✓ Generated changeset: ${filename}`);
  console.log(`  Packages: ${packages.join(", ")}`);
  console.log(`  Bump type: ${bumpType}`);
}

function loadRegistryIndex(): string[] {
  const indexPath = join(REPO_ROOT, CONFIG.registryPath, "index.json");
  if (!existsSync(indexPath)) {
    console.log("Registry index not found, skipping component versioning");
    return [];
  }

  const content = JSON.parse(readFileSync(indexPath, "utf-8")) as RegistryIndex;
  return content.items || [];
}

function loadRegistryItem(componentName: string): RegistryItemWithPath | null {
  const itemPath = join(
    REPO_ROOT,
    CONFIG.registryPath,
    "items",
    `${componentName}.json`
  );
  if (!existsSync(itemPath)) {
    return null;
  }

  return {
    path: itemPath,
    data: JSON.parse(readFileSync(itemPath, "utf-8")) as RegistryItem,
  };
}

function detectAffectedComponents(
  changedFiles: string[],
  componentNames: string[]
): Map<string, string[]> {
  const affectedComponents = new Map<string, string[]>();

  const uiPrefix = "packages/ui/src/";
  const changedInUI = changedFiles.filter((f) => f.startsWith(uiPrefix));

  if (changedInUI.length === 0) return affectedComponents;

  for (const componentName of componentNames) {
    const item = loadRegistryItem(componentName);
    if (!item) continue;

    const componentFiles = item.data.files.map((f) => `${uiPrefix}${f.path}`);
    const changedComponentFiles = componentFiles.filter((f) =>
      changedInUI.includes(f)
    );

    if (changedComponentFiles.length > 0) {
      affectedComponents.set(componentName, changedComponentFiles);
    }
  }

  return affectedComponents;
}

async function updateComponentVersion(
  componentName: string,
  bumpType: BumpType,
  commits: string[]
): Promise<void> {
  const item = loadRegistryItem(componentName);
  if (!item) {
    console.log(`  ⚠ Registry item not found for ${componentName}, skipping`);
    return;
  }

  const registryItem = item.data;
  const currentVersion = registryItem.version;
  const newVersion = incrementVersion(currentVersion, bumpType);

  const componentFiles = registryItem.files.map((f) =>
    join(REPO_ROOT, "packages/ui/src", f.path)
  );
  const newHash = await hashFiles(componentFiles);

  const changelogEntry: ChangelogEntry = {
    version: newVersion,
    date: new Date().toISOString().split("T")[0],
    changes: commits
      .map((c) => parseConventionalCommit(c))
      .filter((c): c is ConventionalCommit => c !== null)
      .map((c) => c.subject),
  };

  registryItem.version = newVersion;
  registryItem.contentHash = newHash;
  registryItem.publishedAt = new Date().toISOString();
  registryItem.changelog = [changelogEntry, ...registryItem.changelog];

  writeFileSync(
    item.path,
    JSON.stringify(registryItem, null, 2) + "\n",
    "utf-8"
  );

  console.log(`✓ Updated component: ${componentName}`);
  console.log(`  Version: ${currentVersion} → ${newVersion}`);
  console.log(`  Changes: ${changelogEntry.changes.length} items`);
}

async function main(): Promise<void> {
  console.log("🚀 Auto-changeset: Analyzing commits...\n");

  const commits = getCommitsSinceMain();
  if (commits.length === 0) {
    console.log("No commits found. Exiting.");
    return;
  }

  console.log(`Found ${commits.length} commit(s):\n`);
  commits.forEach((c) => console.log(`  - ${c}`));
  console.log();

  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log("No file changes detected. Exiting.");
    return;
  }

  console.log(`Found ${changedFiles.length} changed file(s)\n`);

  // Handle package-level changes (only publishable packages)
  let packages = detectAffectedPackages(changedFiles);
  console.log(
    `📦 Detected packages: ${packages.length > 0 ? packages.join(", ") : "none"}`
  );

  packages = applyFixedGroups(packages);

  if (packages.length > 0) {
    console.log(`   After applying fixed groups: ${packages.join(", ")}`);

    // Filter commits to only versionable types (not ci/docs/chore/etc)
    const versionableCommits = filterVersionableCommits(commits);

    if (versionableCommits.length === 0) {
      console.log(
        `   No versionable commits found (all are ci/docs/chore/etc)\n`
      );
      console.log(
        `   Skipping changeset generation - infrastructure changes only\n`
      );
    } else {
      const bumpType = determineBumpType(versionableCommits);
      console.log(
        `   Versionable commits: ${versionableCommits.length}/${commits.length}`
      );
      console.log(`   Determined bump type: ${bumpType}\n`);

      generateChangesetFile(packages, bumpType, versionableCommits);
    }
  } else {
    console.log(`   No publishable packages affected\n`);
  }

  // Handle component-level changes
  const componentNames = loadRegistryIndex();
  if (componentNames.length === 0) {
    console.log("No components in registry. Exiting.");
    return;
  }

  const affectedComponents = detectAffectedComponents(
    changedFiles,
    componentNames
  );

  if (affectedComponents.size === 0) {
    console.log("🎨 No UI components affected\n");
  } else {
    console.log(
      `🎨 Detected affected components: ${Array.from(affectedComponents.keys()).join(", ")}\n`
    );

    // Update each affected component
    for (const [componentName, files] of affectedComponents) {
      // Get commits that touched this component's files
      const componentCommits = commits.filter((commit) => {
        // Check if commit message mentions the component or if any of the component's files were modified
        const lowerCommit = commit.toLowerCase();
        return (
          lowerCommit.includes(componentName) ||
          files.some((f) => lowerCommit.includes(f))
        );
      });

      // If no specific commits mention the component, use all commits
      const relevantCommits =
        componentCommits.length > 0 ? componentCommits : commits;

      const bumpType = determineBumpType(relevantCommits);
      console.log(`Updating ${componentName} (${bumpType})...`);
      await updateComponentVersion(componentName, bumpType, relevantCommits);
      console.log();
    }
  }

  console.log("✅ Auto-changeset completed successfully!");
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  console.error(error.stack);
  process.exit(1);
});
