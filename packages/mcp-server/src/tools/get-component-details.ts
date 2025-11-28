import * as api from "@repo/cli/api"
import { z } from "zod"

export const getComponentDetailsSchema = z.object({
  name: z.string().describe("Name of the component to get details for"),
})

export async function getComponentDetails(args: z.infer<typeof getComponentDetailsSchema>) {
  const result = await api.getComponentDetails(args.name)
  return { success: !!result, data: result }
}

export const getComponentDetailsMetadata = {
  name: "get_component_details",
  description:
    "Get detailed information about a specific component including files, dependencies, and metadata. Returns structured JSON.",
  inputSchema: getComponentDetailsSchema,
}
