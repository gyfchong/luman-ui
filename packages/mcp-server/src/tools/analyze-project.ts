import { z } from 'zod';
import * as api from '@repo/cli/api';

export const analyzeProjectSchema = z.object({
  cwd: z.string().optional().describe('Working directory path'),
});

export async function analyzeProject(args: z.infer<typeof analyzeProjectSchema>) {
  const result = await api.analyze(args.cwd);

  return result;
}

export const analyzeProjectMetadata = {
  name: 'analyze_project',
  description: 'Analyze project to detect framework, package manager, and configuration. Returns structured JSON with project analysis results.',
  inputSchema: analyzeProjectSchema,
};
