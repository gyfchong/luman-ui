import { z } from 'zod';
import * as api from '@repo/cli/api';

export const scaffoldFeatureSchema = z.object({
  name: z.string().describe('Name of the feature to scaffold'),
  template: z.string().describe('Template name to use (e.g., "crud-feature", "auth-feature")'),
  cwd: z.string().optional().describe('Working directory path'),
  installComponents: z.boolean().optional().default(true).describe('Whether to install required components'),
});

export async function scaffoldFeature(args: z.infer<typeof scaffoldFeatureSchema>) {
  const result = await api.scaffoldFeature(args.name, args.template, {
    cwd: args.cwd,
    installComponents: args.installComponents,
  });

  return result;
}

export const scaffoldFeatureMetadata = {
  name: 'scaffold_feature',
  description: 'Scaffold a complete feature using a template. Creates directory structure, files, and optionally installs required components. Returns structured JSON with created files and components.',
  inputSchema: scaffoldFeatureSchema,
};
