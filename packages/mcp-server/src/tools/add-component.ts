import * as api from "@repo/cli/api"
import { z } from "zod"

export const addComponentSchema = z.object({
  name: z.string().describe("Component name to add"),
  cwd: z.string().optional().describe("Working directory path"),
})

export async function addComponent(args: z.infer<typeof addComponentSchema>) {
  try {
    const result = await api.addComponent(args.name, args.cwd)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export const addComponentMetadata = {
  name: "add_component",
  description:
    "Add a component to the project. Resolves dependencies, installs component files, and npm packages. Returns structured JSON with installed components and files.",
  inputSchema: addComponentSchema,
}
