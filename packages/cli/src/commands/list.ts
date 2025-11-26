import { defineCommand } from 'citty';
import { consola } from 'consola';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { readConfig } from '../utils/config.js';
import { listComponents } from '../utils/registry.js';
import type { Component } from '../types/index.js';

export default defineCommand({
  meta: {
    name: 'list',
    description: 'List all available components from the registry',
  },
  args: {
    category: {
      type: 'string',
      description: 'Filter by category',
      alias: 'c',
    },
    tag: {
      type: 'string',
      description: 'Filter by tag',
      alias: 't',
    },
  },
  async run({ args }) {
    const config = await readConfig();
    const registry = config?.registry || 'https://ui.luman.dev/registry';

    p.intro(pc.bgCyan(pc.black(' luman-ui ')));

    const spinner = p.spinner();
    spinner.start('Fetching components from registry...');

    try {
      let components = await listComponents(registry);

      // Apply filters
      if (args.category) {
        components = components.filter(c => c.category === args.category);
      }

      if (args.tag) {
        components = components.filter(c => c.tags?.includes(args.tag));
      }

      spinner.stop('Components fetched successfully');

      if (components.length === 0) {
        p.note('No components found', 'Empty Registry');
        p.outro('Try different filters or check the registry URL');
        return;
      }

      // Group by category
      const byCategory = groupByCategory(components);

      consola.log('');
      for (const [category, items] of Object.entries(byCategory)) {
        consola.log(pc.bold(pc.cyan(`${category}:`)));
        for (const component of items) {
          const deps = component.registryDependencies?.length || 0;
          const depsText = deps > 0 ? pc.gray(` (${deps} deps)`) : '';
          consola.log(`  ${pc.green('●')} ${component.name}${depsText}`);
          if (component.description) {
            consola.log(`    ${pc.gray(component.description)}`);
          }
        }
        consola.log('');
      }

      p.outro(`Found ${pc.bold(components.length)} components`);
    } catch (error) {
      spinner.stop('Failed to fetch components');
      p.cancel(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  },
});

function groupByCategory(components: Component[]): Record<string, Component[]> {
  const groups: Record<string, Component[]> = {};

  for (const component of components) {
    const category = component.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(component);
  }

  return groups;
}
