import { defineCommand } from 'citty';
import { consola } from 'consola';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { readConfig } from '../utils/config.js';
import { fetchComponent, fetchComponentSource } from '../utils/registry.js';
import { resolveComponentPath, writeFileSafe, backupFile, readFileIfExists } from '../utils/fs.js';
import { existsSync } from 'node:fs';

export default defineCommand({
  meta: {
    name: 'update-component',
    description: 'Update an existing component from the registry',
  },
  args: {
    components: {
      type: 'positional',
      description: 'Component name(s) to update',
      required: false,
    },
    yes: {
      type: 'boolean',
      description: 'Skip confirmation prompts',
      alias: 'y',
    },
    backup: {
      type: 'boolean',
      description: 'Create backup of existing files',
      alias: 'b',
      default: true,
    },
  },
  async run({ args }) {
    const config = await readConfig();

    if (!config) {
      p.cancel('components.json not found. Run `luman init` first.');
      process.exit(1);
    }

    p.intro(pc.bgCyan(pc.black(' luman-ui ')));

    let componentNames = args.components?.split(',').map(s => s.trim()) || [];

    // Prompt for components if not provided
    if (componentNames.length === 0) {
      const input = await p.text({
        message: 'Which component(s) would you like to update?',
        placeholder: 'button, card, dialog',
      });

      if (p.isCancel(input)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      componentNames = (input as string).split(',').map(s => s.trim());
    }

    const spinner = p.spinner();
    spinner.start('Checking components...');

    try {
      // Fetch components and check if they exist locally
      const updates: Array<{
        name: string;
        files: Array<{ path: string; exists: boolean; hasChanges: boolean }>;
      }> = [];

      for (const name of componentNames) {
        const component = await fetchComponent(name, config.registry);

        if (!component) {
          consola.warn(`Component "${name}" not found in registry`);
          continue;
        }

        const sources = await fetchComponentSource(component, config.registry);
        const files: Array<{ path: string; exists: boolean; hasChanges: boolean }> = [];

        for (const file of component.files) {
          const targetPath = resolveComponentPath(component, file, config);
          const exists = existsSync(targetPath);
          const newContent = sources.get(file.path) || '';
          const existingContent = await readFileIfExists(targetPath);
          const hasChanges = newContent !== existingContent;

          files.push({
            path: targetPath,
            exists,
            hasChanges,
          });
        }

        updates.push({ name, files });
      }

      spinner.stop('Components checked');

      // Filter to only components with changes
      const componentsWithChanges = updates.filter(u =>
        u.files.some(f => f.exists && f.hasChanges)
      );

      if (componentsWithChanges.length === 0) {
        p.outro('All components are already up to date');
        return;
      }

      // Show what will be updated
      consola.log('');
      consola.log(pc.bold('Components to be updated:'));
      for (const update of componentsWithChanges) {
        consola.log(`  ${pc.yellow('~')} ${update.name}`);
        for (const file of update.files) {
          if (file.exists && file.hasChanges) {
            consola.log(`    ${pc.yellow('~')} ${file.path}`);
          }
        }
      }

      // Confirm update
      if (!args.yes) {
        const confirm = await p.confirm({
          message: 'Continue with update?',
          initialValue: true,
        });

        if (p.isCancel(confirm) || !confirm) {
          p.cancel('Update cancelled');
          process.exit(0);
        }
      }

      spinner.start('Updating components...');

      // Update each component
      for (const update of componentsWithChanges) {
        const component = await fetchComponent(update.name, config.registry);
        if (!component) continue;

        const sources = await fetchComponentSource(component, config.registry);

        for (const file of component.files) {
          const targetPath = resolveComponentPath(component, file, config);
          const content = sources.get(file.path);
          if (!content) continue;

          // Create backup if requested
          if (args.backup && existsSync(targetPath)) {
            await backupFile(targetPath);
          }

          await writeFileSafe(targetPath, content);
        }
      }

      spinner.stop('Components updated');

      if (args.backup) {
        p.note(
          'Original files backed up with .backup extension',
          'Backup Created'
        );
      }

      p.outro(pc.green('✓ Update complete!'));
    } catch (error) {
      spinner.stop('Update failed');
      p.cancel(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  },
});
