# Changesets Workflow

This repository uses [Changesets](https://github.com/changesets/changesets) to manage package versioning and publishing.

## Fixed Packages

The following packages are **fixed** (always versioned together):
- `@repo/cli`
- `@repo/mcp-server`

When you bump the version for one, both will be updated to the same version.

## Developer Workflow

### 1. Make Changes

Make your code changes to CLI, MCP server, or other packages.

### 2. Create a Changeset

When you're ready to document your changes:

```bash
pnpm changeset
```

This will prompt you to:
1. **Select packages**: Choose which packages changed (CLI and MCP will always be linked)
2. **Select bump type**:
   - `major` - Breaking changes (e.g., 1.0.0 → 2.0.0)
   - `minor` - New features (e.g., 1.0.0 → 1.1.0)
   - `patch` - Bug fixes (e.g., 1.0.0 → 1.0.1)
3. **Write summary**: Describe what changed (this goes in the changelog)

This creates a markdown file in `.changeset/` that tracks the intended version bump.

### 3. Commit the Changeset

Commit both your code changes and the changeset file:

```bash
git add .changeset/<changeset-name>.md
git commit -m "feat: add new feature"
```

### 4. Release (Maintainers Only)

When ready to release:

```bash
# Update package.json versions and generate changelogs
pnpm version-packages

# Commit version bumps
git add .
git commit -m "chore: version packages"

# Build and publish to npm
pnpm release
```

## Configuration

See `.changeset/config.json` for configuration:
- **Fixed packages**: CLI and MCP server
- **Ignored packages**: Config packages (`@repo/eslint-config`, `@repo/typescript-config`)
- **Access**: Public (for npm publishing)
- **Base branch**: main

## Auto-Changeset (Automated)

When you open a PR, our GitHub Actions will automatically generate a changeset based on your conventional commit messages.

### Conventional Commit Format

Use these commit message formats:

- `feat(scope): description` → minor version bump
- `fix(scope): description` → patch version bump
- `perf(scope): description` → patch version bump
- `build(scope): description` → patch version bump
- `feat(scope)!: description` → major version bump (breaking change)
- `fix(scope)!: description` → major version bump (breaking change)

The scope is optional but recommended. Use package names without `@repo/` prefix (cli, mcp-server, ui) or feature areas.

**Examples**:
```bash
git commit -m "feat(cli): add init command"
git commit -m "fix(ui): resolve button focus ring styling"
git commit -m "feat(cli)!: change config file format to YAML"
```

### Component Registry Versioning

For UI components, changes are tracked in two ways:

1. **Package-level**: @repo/cli and @repo/mcp-server are versioned via changesets
2. **Component-level**: Individual UI components (button, utils) are versioned in the registry

When you modify a component file, the auto-changeset workflow will:
- Update the component's version in `packages/ui/src/registry/items/{component}.json`
- Recompute the contentHash
- Add a changelog entry
- Update the publishedAt timestamp

### Skipping Auto-Changeset

Add `[skip changeset]` to your PR title if you want to create a changeset manually:

```
feat: add new feature [skip changeset]
```

### How It Works

1. You open a PR with conventional commits
2. GitHub Actions checks if a changeset exists
3. If not, it generates one based on your commits
4. The changeset and updated registry files are committed to your PR
5. A comment is posted showing what was generated
6. You can review and edit before merging

### Manual Override

You can still create changesets manually for more control:

```bash
pnpm changeset
```

This gives you full control over the description and affected packages.

### CI/CD Pipeline

All PRs run through:
- **Type checking** (`pnpm check-types`)
- **Linting** (`pnpm lint`)
- **Building** (`pnpm build`)

These checks must pass before merging.

### Release Process

When a PR with changesets is merged to main:

1. The release workflow detects the changesets
2. A "Version Packages" PR is automatically created with:
   - Updated package.json versions
   - Generated CHANGELOG files
   - Consumed changeset files
3. When you merge the "Version Packages" PR:
   - Packages are built
   - Published to NPM (requires NPM_TOKEN)
   - GitHub releases are created

## Questions?

See the [Changesets documentation](https://github.com/changesets/changesets/blob/main/docs/common-questions.md) for more details.
