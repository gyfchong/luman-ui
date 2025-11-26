import { defineCommand } from 'citty';
import { consola } from 'consola';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { readConfig } from '../utils/config.js';
import { createPageScaffold } from '../utils/templates.js';
import { resolveComponentDependencies } from '../utils/registry.js';
import { writeFileSafe } from '../utils/fs.js';
import { resolve } from 'pathe';

export default defineCommand({
  meta: {
    name: 'scaffold-page',
    description: 'Scaffold a new page with specified components',
  },
  args: {
    name: {
      type: 'positional',
      description: 'Page name',
      required: false,
    },
    path: {
      type: 'string',
      description: 'Page path/route',
      alias: 'p',
    },
    components: {
      type: 'string',
      description: 'Components to include (comma-separated)',
      alias: 'c',
    },
    layout: {
      type: 'string',
      description: 'Layout to use',
      alias: 'l',
    },
    yes: {
      type: 'boolean',
      description: 'Skip confirmation prompts',
      alias: 'y',
    },
  },
  async run({ args }) {
    const config = await readConfig();

    if (!config) {
      p.cancel('components.json not found. Run `luman init` first.');
      process.exit(1);
    }

    p.intro(pc.bgCyan(pc.black(' luman-ui ')));

    let pageName = args.name;
    let pagePath = args.path;
    let components = args.components?.split(',').map(s => s.trim()) || [];
    let layout = args.layout;

    // Prompt for page name if not provided
    if (!pageName) {
      const input = await p.text({
        message: 'What is the page name?',
        placeholder: 'dashboard',
      });

      if (p.isCancel(input)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      pageName = input as string;
    }

    // Prompt for page path if not provided
    if (!pagePath) {
      const input = await p.text({
        message: 'What is the page path?',
        placeholder: '/dashboard',
        initialValue: `/${pageName}`,
      });

      if (p.isCancel(input)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      pagePath = input as string;
    }

    // Prompt for components if not provided
    if (components.length === 0) {
      const input = await p.text({
        message: 'Which components would you like to include?',
        placeholder: 'button, card, table',
      });

      if (p.isCancel(input)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      components = (input as string).split(',').map(s => s.trim());
    }

    const spinner = p.spinner();
    spinner.start('Generating page structure...');

    try {
      // Create page scaffold
      const scaffold = createPageScaffold(pageName, pagePath, components, layout);

      spinner.stop('Page structure generated');

      // Preview what will be created
      consola.log('');
      consola.log(pc.bold('Page configuration:'));
      consola.log(`  Name: ${pc.cyan(scaffold.name)}`);
      consola.log(`  Path: ${pc.cyan(scaffold.path)}`);
      if (scaffold.layout) {
        consola.log(`  Layout: ${pc.cyan(scaffold.layout)}`);
      }

      consola.log('');
      consola.log(pc.bold('Components to be installed:'));
      for (const component of scaffold.components) {
        consola.log(`  ${pc.blue('+')} ${component}`);
      }

      // Confirm
      if (!args.yes) {
        const confirm = await p.confirm({
          message: 'Continue with page creation?',
          initialValue: true,
        });

        if (p.isCancel(confirm) || !confirm) {
          p.cancel('Page creation cancelled');
          process.exit(0);
        }
      }

      spinner.start('Creating page...');

      // Generate page content
      const pageContent = generatePageContent(scaffold);

      // Determine file path based on framework
      const framework = config.aliases.components.includes('app') ? 'next-app' : 'next-pages';
      const fileExtension = config.tsx ? 'tsx' : 'jsx';

      let filePath: string;
      if (framework === 'next-app') {
        // Next.js App Router
        filePath = resolve(process.cwd(), 'app', scaffold.path.slice(1), `page.${fileExtension}`);
      } else {
        // Next.js Pages Router or other
        filePath = resolve(process.cwd(), 'pages', `${scaffold.name}.${fileExtension}`);
      }

      await writeFileSafe(filePath, pageContent);

      spinner.stop('Page created');

      // Install components
      if (scaffold.components.length > 0) {
        spinner.start('Installing components...');

        for (const name of scaffold.components) {
          await resolveComponentDependencies(name, config.registry);
        }

        spinner.stop('Components installed');
      }

      p.outro(pc.green(`✓ Page "${pageName}" created successfully!`));
      consola.log(pc.gray(`  File: ${filePath}`));
    } catch (error) {
      spinner.stop('Page creation failed');
      p.cancel(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  },
});

/**
 * Generate page content
 */
function generatePageContent(scaffold: {
  name: string;
  path: string;
  components: string[];
  layout?: string;
}): string {
  const pascalCase = scaffold.name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const imports = scaffold.components
    .map(c => {
      const componentName = c
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      return `import { ${componentName} } from '@/components/ui/${c}';`;
    })
    .join('\n');

  return `${imports}

export default function ${pascalCase}Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">${pascalCase}</h1>
      {/* Add your page content here */}
    </div>
  );
}
`;
}
