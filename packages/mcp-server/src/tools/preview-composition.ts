import { z } from 'zod';
import * as api from '@repo/cli/api';

export const previewCompositionSchema = z.object({
  components: z.array(z.string()).describe('Array of component names to preview'),
  registry: z.string().optional().describe('Custom registry URL'),
  cwd: z.string().optional().describe('Working directory path'),
});

export async function previewComposition(args: z.infer<typeof previewCompositionSchema>) {
  const result = await api.previewComposition(args.components, {
    registry: args.registry,
    cwd: args.cwd,
  });

  return result;
}

export const previewCompositionMetadata = {
  name: 'preview_composition',
  description: 'Preview what files and dependencies will be installed for a composition without actually installing. Returns structured JSON with files, dependencies, and component hierarchy.',
  inputSchema: previewCompositionSchema,
};
