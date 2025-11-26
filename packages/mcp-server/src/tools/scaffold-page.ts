import { z } from 'zod';
import * as api from '@repo/cli/api';

export const scaffoldPageSchema = z.object({
  name: z.string().describe('Name of the page to scaffold'),
  path: z.string().describe('Route path for the page (e.g., "/dashboard")'),
  components: z.array(z.string()).describe('Array of component names to include in the page'),
  layout: z.string().optional().describe('Layout component to use'),
  cwd: z.string().optional().describe('Working directory path'),
  installComponents: z.boolean().optional().default(true).describe('Whether to install required components'),
});

export async function scaffoldPage(args: z.infer<typeof scaffoldPageSchema>) {
  try {
    const result = await api.scaffoldPage(args.name, args.path, args.components, {
      layout: args.layout,
      cwd: args.cwd,
      installComponents: args.installComponents,
    });
    return result;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export const scaffoldPageMetadata = {
  name: 'scaffold_page',
  description: 'Scaffold a new page with specified components. Creates page file with imports and basic structure. Returns structured JSON with created file and components.',
  inputSchema: scaffoldPageSchema,
};
