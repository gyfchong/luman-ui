import { z } from 'zod';
import * as api from '@repo/cli/api';

export const addComponentSchema = z.object({
  components: z.array(z.string()).describe('Array of component names to add'),
  overwrite: z.boolean().optional().describe('Overwrite existing files'),
  cwd: z.string().optional().describe('Working directory path'),
});

export async function addComponent(args: z.infer<typeof addComponentSchema>) {
  const result = await api.addComponent(args.components, {
    overwrite: args.overwrite,
    cwd: args.cwd,
  });

  return result;
}

export const addComponentMetadata = {
  name: 'add_component',
  description: 'Add one or more components to the project. Resolves dependencies, installs component files, and npm packages. Returns structured JSON with installed components and dependencies.',
  inputSchema: addComponentSchema,
};
