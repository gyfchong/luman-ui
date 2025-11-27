#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use jiti to import TypeScript hash utilities
const jiti = require('jiti')(__filename);
const { hashFiles } = jiti(resolve(__dirname, '../packages/cli/src/utils/hash.ts'));

const REPO_ROOT = resolve(__dirname, '..');

const CONFIG = {
  ignoredPackages: ['@repo/eslint-config', '@repo/typescript-config', '@repo/ui'],
  fixedGroups: [['@repo/cli', '@repo/mcp-server']],
  packagePaths: {
    'packages/cli/src': '@repo/cli',
    'packages/mcp-server/src': '@repo/mcp-server',
    'apps/playground/src': 'playground',
    'apps/docs/src': 'docs'
  },
  registryPath: 'packages/ui/src/registry',
  conventionalTypes: {
    feat: { bump: 'minor', display: 'Features' },
    fix: { bump: 'patch', display: 'Fixes' },
    perf: { bump: 'patch', display: 'Performance' },
    build: { bump: 'patch', display: 'Build' },
    // Ignored types (no version bump)
    docs: null,
    test: null,
    chore: null,
    style: null,
    ci: null,
  }
};

/**
 * Get commits since main branch
 */
function getCommitsSinceMain() {
  try {
    execSync('git fetch origin main', { stdio: 'pipe', cwd: REPO_ROOT });
    const output = execSync('git log origin/main..HEAD --format=%s', {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: REPO_ROOT
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.log('No commits found or error fetching:', error.message);
    return [];
  }
}

/**
 * Parse a conventional commit message
 * Format: type(scope)?!?: subject
 */
function parseConventionalCommit(message) {
  const regex = /^(feat|fix|perf|build|docs|test|chore|style|ci)(\(.+?\))?(!)?:\s*(.+)$/;
  const match = message.match(regex);

  if (!match) return null;

  const [, type, scope, breaking, subject] = match;

  // Check for breaking change in body
  const hasBreakingInBody = message.includes('BREAKING CHANGE:');

  return {
    type,
    scope: scope ? scope.slice(1, -1) : undefined,
    breaking: !!breaking || hasBreakingInBody,
    subject,
    raw: message
  };
}

/**
 * Get changed files since main
 */
function getChangedFiles() {
  try {
    const output = execSync('git diff --name-only origin/main..HEAD', {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: REPO_ROOT
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.log('Error getting changed files:', error.message);
    return [];
  }
}

/**
 * Detect which packages are affected by file changes
 */
function detectAffectedPackages(changedFiles) {
  const packages = new Set();

  for (const file of changedFiles) {
    for (const [pathPrefix, packageName] of Object.entries(CONFIG.packagePaths)) {
      if (file.startsWith(pathPrefix)) {
        packages.add(packageName);
      }
    }
  }

  return Array.from(packages);
}

/**
 * Apply fixed package groups - if one package in a group changes, all must be versioned together
 */
function applyFixedGroups(packages) {
  const result = new Set(packages);

  for (const fixedGroup of CONFIG.fixedGroups) {
    const hasAny = packages.some(pkg => fixedGroup.includes(pkg));
    if (hasAny) {
      fixedGroup.forEach(pkg => result.add(pkg));
    }
  }

  // Filter out ignored packages
  return Array.from(result).filter(
    pkg => !CONFIG.ignoredPackages.includes(pkg)
  );
}

/**
 * Determine version bump type from commits (major > minor > patch)
 */
function determineBumpType(commits) {
  let hasBreaking = false;
  let hasMinor = false;

  for (const commit of commits) {
    const parsed = parseConventionalCommit(commit);
    if (!parsed) continue;

    const typeConfig = CONFIG.conventionalTypes[parsed.type];
    if (!typeConfig) continue; // Ignored type

    if (parsed.breaking) {
      hasBreaking = true;
    } else if (typeConfig.bump === 'minor') {
      hasMinor = true;
    }
  }

  if (hasBreaking) return 'major';
  if (hasMinor) return 'minor';
  return 'patch';
}

/**
 * Generate changeset file for packages
 */
function generateChangesetFile(packages, bumpType, commits) {
  if (packages.length === 0) return;

  const timestamp = Date.now();
  const filename = `auto-${timestamp}.md`;
  const filepath = join(REPO_ROOT, '.changeset', filename);

  // Generate frontmatter
  const frontmatter = packages
    .map(pkg => `"${pkg}": ${bumpType}`)
    .join('\n');

  // Group commits by type
  const grouped = {};
  for (const commit of commits) {
    const parsed = parseConventionalCommit(commit);
    if (!parsed) continue;

    const typeConfig = CONFIG.conventionalTypes[parsed.type];
    if (!typeConfig) continue;

    const section = typeConfig.display;
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(`- ${parsed.raw}`);
  }

  // Generate body
  const body = Object.entries(grouped)
    .map(([section, items]) => `## ${section}\n\n${items.join('\n')}`)
    .join('\n\n');

  // Write file
  const content = `---\n${frontmatter}\n---\n\n${body}\n`;
  writeFileSync(filepath, content, 'utf-8');

  console.log(`✓ Generated changeset: ${filename}`);
  console.log(`  Packages: ${packages.join(', ')}`);
  console.log(`  Bump type: ${bumpType}`);
}

/**
 * Load registry index to get list of all components
 */
function loadRegistryIndex() {
  const indexPath = join(REPO_ROOT, CONFIG.registryPath, 'index.json');
  if (!existsSync(indexPath)) {
    console.log('Registry index not found, skipping component versioning');
    return [];
  }

  const content = JSON.parse(readFileSync(indexPath, 'utf-8'));
  return content.items || [];
}

/**
 * Load a registry item
 */
function loadRegistryItem(componentName) {
  const itemPath = join(REPO_ROOT, CONFIG.registryPath, 'items', `${componentName}.json`);
  if (!existsSync(itemPath)) {
    return null;
  }

  return {
    path: itemPath,
    data: JSON.parse(readFileSync(itemPath, 'utf-8'))
  };
}

/**
 * Detect which UI components are affected by file changes
 */
function detectAffectedComponents(changedFiles, componentNames) {
  const affectedComponents = new Map(); // component -> array of changed files

  const uiPrefix = 'packages/ui/src/';
  const changedInUI = changedFiles.filter(f => f.startsWith(uiPrefix));

  if (changedInUI.length === 0) return affectedComponents;

  // For each component, check if any of its files changed
  for (const componentName of componentNames) {
    const item = loadRegistryItem(componentName);
    if (!item) continue;

    const componentFiles = item.data.files.map(f => `${uiPrefix}${f.path}`);
    const changedComponentFiles = componentFiles.filter(f => changedInUI.includes(f));

    if (changedComponentFiles.length > 0) {
      affectedComponents.set(componentName, changedComponentFiles);
    }
  }

  return affectedComponents;
}

/**
 * Increment semantic version
 */
function incrementVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid bump type: ${bumpType}`);
  }
}

/**
 * Update registry item with new version, hash, and changelog
 */
async function updateComponentVersion(componentName, bumpType, commits) {
  const item = loadRegistryItem(componentName);
  if (!item) {
    console.log(`  ⚠ Registry item not found for ${componentName}, skipping`);
    return;
  }

  const registryItem = item.data;

  // Calculate new version
  const currentVersion = registryItem.version;
  const newVersion = incrementVersion(currentVersion, bumpType);

  // Compute new contentHash
  const componentFiles = registryItem.files.map(f =>
    join(REPO_ROOT, 'packages/ui/src', f.path)
  );
  const newHash = await hashFiles(componentFiles);

  // Create changelog entry
  const changelogEntry = {
    version: newVersion,
    date: new Date().toISOString().split('T')[0],
    changes: commits
      .map(c => parseConventionalCommit(c))
      .filter(Boolean)
      .map(c => c.subject)
  };

  // Update registry item
  registryItem.version = newVersion;
  registryItem.contentHash = newHash;
  registryItem.publishedAt = new Date().toISOString();
  registryItem.changelog = [changelogEntry, ...registryItem.changelog];

  // Write back to file
  writeFileSync(item.path, JSON.stringify(registryItem, null, 2) + '\n', 'utf-8');

  console.log(`✓ Updated component: ${componentName}`);
  console.log(`  Version: ${currentVersion} → ${newVersion}`);
  console.log(`  Changes: ${changelogEntry.changes.length} items`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Auto-changeset: Analyzing commits...\n');

  const commits = getCommitsSinceMain();
  if (commits.length === 0) {
    console.log('No commits found. Exiting.');
    return;
  }

  console.log(`Found ${commits.length} commit(s):\n`);
  commits.forEach(c => console.log(`  - ${c}`));
  console.log();

  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log('No file changes detected. Exiting.');
    return;
  }

  console.log(`Found ${changedFiles.length} changed file(s)\n`);

  // Handle package-level changes
  let packages = detectAffectedPackages(changedFiles);
  console.log(`📦 Detected packages: ${packages.length > 0 ? packages.join(', ') : 'none'}`);

  packages = applyFixedGroups(packages);
  if (packages.length > 0) {
    console.log(`   After applying fixed groups: ${packages.join(', ')}`);

    const bumpType = determineBumpType(commits);
    console.log(`   Determined bump type: ${bumpType}\n`);

    generateChangesetFile(packages, bumpType, commits);
  } else {
    console.log(`   No publishable packages affected\n`);
  }

  // Handle component-level changes
  const componentNames = loadRegistryIndex();
  if (componentNames.length === 0) {
    console.log('No components in registry. Exiting.');
    return;
  }

  const affectedComponents = detectAffectedComponents(changedFiles, componentNames);

  if (affectedComponents.size === 0) {
    console.log('🎨 No UI components affected\n');
  } else {
    console.log(`🎨 Detected affected components: ${Array.from(affectedComponents.keys()).join(', ')}\n`);

    // Update each affected component
    for (const [componentName, files] of affectedComponents) {
      // Get commits that touched this component's files
      const componentCommits = commits.filter(commit => {
        // Check if commit message mentions the component or if any of the component's files were modified
        const lowerCommit = commit.toLowerCase();
        return lowerCommit.includes(componentName) || files.some(f => lowerCommit.includes(f));
      });

      // If no specific commits mention the component, use all commits
      const relevantCommits = componentCommits.length > 0 ? componentCommits : commits;

      const bumpType = determineBumpType(relevantCommits);
      console.log(`Updating ${componentName} (${bumpType})...`);
      await updateComponentVersion(componentName, bumpType, relevantCommits);
      console.log();
    }
  }

  console.log('✅ Auto-changeset completed successfully!');
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
