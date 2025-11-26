import { z } from 'zod';
import * as api from '@repo/cli/api';

export const getTemplatesSchema = z.object({});

export async function getTemplates(_args: z.infer<typeof getTemplatesSchema>) {
  const result = await api.getTemplates();

  return result;
}

export const getTemplatesMetadata = {
  name: 'get_templates',
  description: 'Get list of available feature templates. Returns structured JSON with template names, types, descriptions, and dependencies.',
  inputSchema: getTemplatesSchema,
};
