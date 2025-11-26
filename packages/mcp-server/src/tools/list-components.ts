import { z } from 'zod';
import * as api from '@repo/cli/api';

export const listComponentsSchema = z.object({
  category: z.string().optional().describe('Filter components by category'),
  tag: z.string().optional().describe('Filter components by tag'),
  registry: z.string().optional().describe('Custom registry URL'),
});

export async function listComponents(args: z.infer<typeof listComponentsSchema>) {
  const result = await api.list({
    category: args.category,
    tag: args.tag,
    registry: args.registry,
  });

  return result;
}

export const listComponentsMetadata = {
  name: 'list_components',
  description: 'List all available components from the registry. Returns structured JSON with component metadata including name, type, description, dependencies, and tags.',
  inputSchema: listComponentsSchema,
};
