import { z } from 'zod';
import * as api from '@repo/cli/api';

export const updateComponentSchema = z.object({
  components: z.array(z.string()).describe('Array of component names to update'),
  backup: z.boolean().optional().default(true).describe('Create backup of existing files'),
  cwd: z.string().optional().describe('Working directory path'),
});

export async function updateComponent(args: z.infer<typeof updateComponentSchema>) {
  const result = await api.updateComponent(args.components, {
    backup: args.backup,
    cwd: args.cwd,
  });

  return result;
}

export const updateComponentMetadata = {
  name: 'update_component',
  description: 'Update existing components from the registry. Optionally creates backups of existing files. Returns structured JSON with updated component names.',
  inputSchema: updateComponentSchema,
};
