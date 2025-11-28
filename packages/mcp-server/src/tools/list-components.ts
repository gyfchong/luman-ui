import * as api from "@repo/cli/api"
import { z } from "zod"

export const listComponentsSchema = z.object({})

export async function listComponents(_args: z.infer<typeof listComponentsSchema>) {
  const result = await api.listComponents()
  return { success: true, data: result }
}

export const listComponentsMetadata = {
  name: "list_components",
  description:
    "List all available components from the registry. Returns structured JSON with component names.",
  inputSchema: listComponentsSchema,
}
