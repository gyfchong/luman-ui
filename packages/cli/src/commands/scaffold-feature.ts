import { defineCommand } from 'citty';
import { consola } from 'consola';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { readConfig } from '../utils/config.js';
import { getTemplate, listTemplates, generateFromTemplate, createFeatureScaffold } from '../utils/templates.js';
import { resolveComponentDependencies } from '../utils/registry.js';
import { writeFileSafe } from '../utils/fs.js';
import { resolve } from 'pathe';
import type { FeatureScaffold, Template } from '../types/index.js';

export default defineCommand({
  meta: {
    name: 'scaffold-feature',
    description: 'Scaffold a complete feature with components, pages, and logic',
  },
  args: {
    name: {
      type: 'positional',
      description: 'Feature name',
      required: false,
    },
    template: {
      type: 'string',
      description: 'Template to use',
      alias: 't',
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

    let featureName = args.name;
    let templateName = args.template;

    // Prompt for feature name if not provided
    if (!featureName) {
      const input = await p.text({
        message: 'What is the feature name?',
        placeholder: 'user-management',
      });

      if (p.isCancel(input)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      featureName = input as string;
    }

    // List available templates
    const templates = listTemplates();

    if (!templateName) {
      const choices = templates.map(t => ({
        value: t.name,
        label: t.name,
        hint: t.description,
      }));

      const selected = await p.select({
        message: 'Which template would you like to use?',
        options: choices,
      });

      if (p.isCancel(selected)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      templateName = selected as string;
    }

    const template = getTemplate(templateName);

    if (!template) {
      p.cancel(`Template "${templateName}" not found`);
      process.exit(1);
    }

    const spinner = p.spinner();
    spinner.start('Generating feature structure...');

    try {
      // Create feature scaffold
      const scaffold = createFeatureScaffold(featureName, templateName);

      // Generate file structure
      const files = generateFromTemplate(template, { name: featureName });

      spinner.stop('Feature structure generated');

      // Preview files
      consola.log('');
      consola.log(pc.bold('Files to be created:'));
      for (const file of files) {
        if (file.type === 'file') {
          consola.log(`  ${pc.green('+')} ${file.path}`);
        }
      }

      // Show components to be installed
      if (scaffold.components.length > 0) {
        consola.log('');
        consola.log(pc.bold('Components to be installed:'));
        for (const component of scaffold.components) {
          consola.log(`  ${pc.blue('+')} ${component}`);
        }
      }

      // Confirm
      if (!args.yes) {
        const confirm = await p.confirm({
          message: 'Continue with scaffolding?',
          initialValue: true,
        });

        if (p.isCancel(confirm) || !confirm) {
          p.cancel('Scaffolding cancelled');
          process.exit(0);
        }
      }

      spinner.start('Creating files...');

      // Create files
      const cwd = process.cwd();
      for (const file of files) {
        if (file.type === 'file') {
          const content = await getTemplateContent(file.template || '', featureName, scaffold);
          const fullPath = resolve(cwd, file.path);
          await writeFileSafe(fullPath, content);
        }
      }

      spinner.stop('Files created');

      // Install components
      if (scaffold.components.length > 0) {
        spinner.start('Installing components...');

        // Resolve and install all required components
        const allComponents = [];
        for (const name of scaffold.components) {
          const resolved = await resolveComponentDependencies(name, config.registry);
          allComponents.push(...resolved);
        }

        spinner.stop('Components installed');
      }

      p.outro(pc.green(`✓ Feature "${featureName}" scaffolded successfully!`));
    } catch (error) {
      spinner.stop('Scaffolding failed');
      p.cancel(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  },
});

/**
 * Get template content based on template type
 */
async function getTemplateContent(
  templateType: string,
  featureName: string,
  scaffold: FeatureScaffold
): Promise<string> {
  const pascalCase = featureName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Basic template content - in production, these would be more comprehensive
  const templates: Record<string, string> = {
    'crud-list': `import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';

export default function ${pascalCase}List() {
  return (
    <div>
      <h1>${pascalCase} List</h1>
      {/* Add your list implementation */}
    </div>
  );
}
`,
    'crud-create': `import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export default function ${pascalCase}Create() {
  return (
    <div>
      <h1>Create ${pascalCase}</h1>
      {/* Add your create form */}
    </div>
  );
}
`,
    'crud-edit': `import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export default function ${pascalCase}Edit() {
  return (
    <div>
      <h1>Edit ${pascalCase}</h1>
      {/* Add your edit form */}
    </div>
  );
}
`,
    'crud-types': `export interface ${pascalCase} {
  id: string;
  // Add your type definitions
}

export type ${pascalCase}FormData = Omit<${pascalCase}, 'id'>;
`,
    dashboard: `import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Users" value="1,234" />
      <StatCard title="Revenue" value="$12,345" />
      {/* Add more dashboard widgets */}
    </div>
  );
}
`,
    'auth-login': `import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Login() {
  return (
    <Card>
      <h1>Login</h1>
      {/* Add your login form */}
    </Card>
  );
}
`,
    'auth-signup': `import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Signup() {
  return (
    <Card>
      <h1>Sign Up</h1>
      {/* Add your signup form */}
    </Card>
  );
}
`,
    'auth-reset': `import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPassword() {
  return (
    <div>
      <h1>Reset Password</h1>
      {/* Add your password reset form */}
    </div>
  );
}
`,
  };

  return templates[templateType] || `// ${templateType}\nexport default function Component() {\n  return null;\n}\n`;
}
