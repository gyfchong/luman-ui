import * as api from "@repo/cli/api"
import { z } from "zod"

export const previewCompositionSchema = z.object({
  components: z.array(z.string()).describe("Array of component names to preview"),
})

export async function previewComposition(args: z.infer<typeof previewCompositionSchema>) {
  try {
    const result = await api.previewComposition(args.components)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export const previewCompositionMetadata = {
  name: "preview_composition",
  description:
    "Preview what files and dependencies will be installed for a composition without actually installing. Returns structured JSON with files, dependencies, and component hierarchy.",
  inputSchema: previewCompositionSchema,
}
