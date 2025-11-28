import * as api from "@repo/cli/api"
import { z } from "zod"

export const analyzeProjectSchema = z.object({
  cwd: z.string().optional().describe("Working directory path"),
})

export async function analyzeProject(args: z.infer<typeof analyzeProjectSchema>) {
  try {
    const result = await api.analyzeProject(args.cwd)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export const analyzeProjectMetadata = {
  name: "analyze_project",
  description:
    "Analyze project to detect framework, package manager, and configuration. Returns structured JSON with project analysis results.",
  inputSchema: analyzeProjectSchema,
}
