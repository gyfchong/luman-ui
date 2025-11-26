import { defineCommand } from 'citty';
import { consola } from 'consola';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { readConfig } from '../utils/config.js';
import { fetchComponent, resolveComponentDependencies, fetchComponentSource } from '../utils/registry.js';
import { resolveComponentPath, writeFileSafe } from '../utils/fs.js';
import { installDependencies } from '../utils/install.js';

export default defineCommand({
  meta: {
    name: 'add',
    description: 'Add a component to your project',
  },
  args: {
    components: {
      type: 'positional',
      description: 'Component name(s) to add',
      required: false,
    },
    yes: {
      type: 'boolean',
      description: 'Skip confirmation prompts',
      alias: 'y',
    },
    overwrite: {
      type: 'boolean',
      description: 'Overwrite existing files',
      alias: 'o',
    },
  },
  async run({ args }) {
    const config = await readConfig();

    if (!config) {
      p.cancel('components.json not found. Run `luman init` first.');
      process.exit(1);
    }

    p.intro(pc.bgCyan(pc.black(' luman-ui ')));

    const componentNames = args.components ? [args.components] : [];

    // If no components specified, prompt user
    if (componentNames.length === 0) {
      const input = await p.text({
        message: 'Which component(s) would you like to add?',
        placeholder: 'button, card, dialog',
      });

      if (p.isCancel(input)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      componentNames.push(...(input as string).split(',').map(s => s.trim()));
    }

    const spinner = p.spinner();
    spinner.start('Resolving dependencies...');

    try {
      // Resolve all dependencies
      const allComponents = [];
      for (const name of componentNames) {
        const resolved = await resolveComponentDependencies(name, config.registry);
        allComponents.push(...resolved);
      }

      // Remove duplicates
      const uniqueComponents = Array.from(
        new Map(allComponents.map(c => [c.name, c])).values()
      );

      spinner.stop('Dependencies resolved');

      // Show what will be installed
      consola.log('');
      consola.log(pc.bold('The following components will be installed:'));
      for (const component of uniqueComponents) {
        consola.log(`  ${pc.green('+')} ${component.name}`);
      }

      // Collect all npm dependencies
      const npmDeps = new Set<string>();
      for (const component of uniqueComponents) {
        component.dependencies?.forEach(dep => npmDeps.add(dep));
      }

      if (npmDeps.size > 0) {
        consola.log('');
        consola.log(pc.bold('npm dependencies:'));
        for (const dep of npmDeps) {
          consola.log(`  ${pc.blue('+')} ${dep}`);
        }
      }

      // Confirm installation
      if (!args.yes) {
        const confirm = await p.confirm({
          message: 'Continue with installation?',
          initialValue: true,
        });

        if (p.isCancel(confirm) || !confirm) {
          p.cancel('Installation cancelled');
          process.exit(0);
        }
      }

      spinner.start('Installing components...');

      // Install each component
      for (const component of uniqueComponents) {
        const sources = await fetchComponentSource(component, config.registry);

        for (const file of component.files) {
          const content = sources.get(file.path);
          if (!content) continue;

          const targetPath = resolveComponentPath(component, file, config);
          await writeFileSafe(targetPath, content);
        }
      }

      spinner.stop('Components installed');

      // Install npm dependencies
      if (npmDeps.size > 0) {
        spinner.start('Installing npm dependencies...');
        await installDependencies(Array.from(npmDeps));
        spinner.stop('Dependencies installed');
      }

      p.outro(pc.green('✓ Installation complete!'));
    } catch (error) {
      spinner.stop('Installation failed');
      p.cancel(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  },
});
