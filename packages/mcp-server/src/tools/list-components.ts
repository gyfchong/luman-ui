import { z } from 'zod';
import * as api from '@repo/cli/api';

export const listComponentsSchema = z.object({});

export async function listComponents(args: z.infer<typeof listComponentsSchema>) {
  const result = await api.listComponents();
  return { success: true, data: result };
}

export const listComponentsMetadata = {
  name: 'list_components',
  description: 'List all available components from the registry. Returns structured JSON with component names.',
  inputSchema: listComponentsSchema,
};
