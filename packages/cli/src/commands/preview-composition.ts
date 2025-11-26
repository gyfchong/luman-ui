import { defineCommand } from 'citty';
import { consola } from 'consola';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { readConfig } from '../utils/config.js';
import { resolveComponentDependencies, fetchComponentSource } from '../utils/registry.js';
import { resolveComponentPath } from '../utils/fs.js';
import type { CompositionPreview } from '../types/index.js';

export default defineCommand({
  meta: {
    name: 'preview-composition',
    description: 'Preview what files and dependencies will be installed for a composition',
  },
  args: {
    components: {
      type: 'positional',
      description: 'Component names (comma-separated)',
      required: false,
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
        message: 'Which components would you like to preview?',
        placeholder: 'button, card, dialog',
      });

      if (p.isCancel(input)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      componentNames = (input as string).split(',').map(s => s.trim());
    }

    const spinner = p.spinner();
    spinner.start('Analyzing composition...');

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

      // Build preview
      const preview: CompositionPreview = {
        files: [],
        dependencies: [],
        registryDependencies: [],
        structure: '',
      };

      const npmDeps = new Set<string>();
      const registryDeps = new Set<string>();

      for (const component of uniqueComponents) {
        // Add npm dependencies
        component.dependencies?.forEach(dep => npmDeps.add(dep));

        // Add registry dependencies
        component.registryDependencies?.forEach(dep => registryDeps.add(dep));

        // Get file paths
        for (const file of component.files) {
          const targetPath = resolveComponentPath(component, file, config);
          const sources = await fetchComponentSource(component, config.registry);
          const content = sources.get(file.path) || '';

          preview.files.push({
            path: targetPath,
            content,
            action: 'create',
          });
        }
      }

      preview.dependencies = Array.from(npmDeps);
      preview.registryDependencies = Array.from(registryDeps);

      spinner.stop('Analysis complete');

      // Display preview
      consola.log('');
      consola.log(pc.bold(pc.cyan('Composition Preview')));
      consola.log('');

      // Show component hierarchy
      consola.log(pc.bold('Component Hierarchy:'));
      for (const name of componentNames) {
        consola.log(`  ${pc.green('●')} ${name} ${pc.gray('(requested)')}`);
        const component = uniqueComponents.find(c => c.name === name);
        if (component?.registryDependencies) {
          for (const dep of component.registryDependencies) {
            consola.log(`    ${pc.blue('└─')} ${dep} ${pc.gray('(dependency)')}`);
          }
        }
      }

      // Show files
      consola.log('');
      consola.log(pc.bold('Files to be created:'));
      for (const file of preview.files) {
        consola.log(`  ${pc.green('+')} ${file.path}`);
      }

      // Show npm dependencies
      if (preview.dependencies.length > 0) {
        consola.log('');
        consola.log(pc.bold('npm dependencies:'));
        for (const dep of preview.dependencies) {
          consola.log(`  ${pc.blue('+')} ${dep}`);
        }
      }

      // Summary
      consola.log('');
      consola.log(pc.bold('Summary:'));
      consola.log(`  Components: ${pc.cyan(uniqueComponents.length)}`);
      consola.log(`  Files: ${pc.cyan(preview.files.length)}`);
      consola.log(`  npm dependencies: ${pc.cyan(preview.dependencies.length)}`);

      p.outro('Preview complete');
    } catch (error) {
      spinner.stop('Preview failed');
      p.cancel(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  },
});
