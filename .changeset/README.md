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

## Questions?

See the [Changesets documentation](https://github.com/changesets/changesets/blob/main/docs/common-questions.md) for more details.
