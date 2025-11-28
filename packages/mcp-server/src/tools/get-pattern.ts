import * as api from "@repo/cli/api"
import { z } from "zod"

export const getPatternSchema = z.object({
  patternName: z.string().describe('Pattern name (e.g., "form-accessibility", "form-composition")'),
})

export async function getPattern(args: z.infer<typeof getPatternSchema>) {
  try {
    const result = await api.getPattern(args.patternName)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export const getPatternMetadata = {
  name: "get_pattern",
  description:
    "Get pattern documentation for LLM guidance on accessibility and composition. Returns structured JSON with overview, principles (title, description, code examples), complete example, testing checklist, and WCAG compliance. Available patterns: form-accessibility, form-composition",
  inputSchema: getPatternSchema,
}
