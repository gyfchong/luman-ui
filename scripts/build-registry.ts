import { createHash } from "node:crypto"
import { existsSync } from "node:fs"
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import type { RegistryItem } from "../registry/schema.ts"

const REGISTRY_DIR = resolve(process.cwd(), "registry")
const ITEMS_DIR = join(REGISTRY_DIR, "items")
const OUTPUT_DIR = resolve(process.cwd(), "dist/registry")
const OUTPUT_ITEMS_DIR = join(OUTPUT_DIR, "items")

interface BuildStats {
  totalItems: number
  successfulBuilds: number
  failedBuilds: number
  errors: Array<{ item: string; error: string }>
}

/**
 * Generate SHA-256 hash of content
 */
function generateContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex")
}

/**
 * Read and embed file content for a registry item
 */
async function embedFileContent(item: RegistryItem): Promise<RegistryItem> {
  const updatedFiles = await Promise.all(
    item.files.map(async (file) => {
      const filePath = resolve(process.cwd(), file.path)

      // Check if file exists
      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${file.path}`)
      }

      // Read file content
      const content = await readFile(filePath, "utf-8")

      return {
        ...file,
        content,
      }
    })
  )

  // Generate content hash from all file contents
  const allContent = updatedFiles.map((f) => f.content).join("\n")
  const contentHash = generateContentHash(allContent)

  return {
    ...item,
    files: updatedFiles,
    contentHash,
    publishedAt: new Date().toISOString(),
  }
}

/**
 * Build a single registry item
 */
async function buildRegistryItem(itemName: string): Promise<RegistryItem> {
  const itemPath = join(ITEMS_DIR, `${itemName}.json`)

  // Read metadata
  const metadataContent = await readFile(itemPath, "utf-8")
  const metadata = JSON.parse(metadataContent) as RegistryItem

  // Embed file content
  const itemWithContent = await embedFileContent(metadata)

  // Write to output directory
  const outputPath = join(OUTPUT_ITEMS_DIR, `${itemName}.json`)
  await writeFile(outputPath, JSON.stringify(itemWithContent, null, 2), "utf-8")

  console.log(`✓ Built ${itemName}`)
  return itemWithContent
}

/**
 * Generate registry index catalog
 */
async function generateIndex(items: RegistryItem[]): Promise<void> {
  const index = {
    $schema: "./schema.json",
    items: items.map((item) => item.name),
    catalog: items.reduce(
      (acc, item) => {
        acc[item.name] = {
          name: item.name,
          type: item.type,
          version: item.version,
          description: item.description,
          dependencies: item.dependencies,
          registryDependencies: item.registryDependencies,
          meta: item.meta,
        }
        return acc
      },
      {} as Record<string, any>
    ),
  }

  const indexPath = join(OUTPUT_DIR, "index.json")
  await writeFile(indexPath, JSON.stringify(index, null, 2), "utf-8")

  console.log(`✓ Generated index.json with ${items.length} items`)
}

/**
 * Main build function
 */
async function buildRegistry(): Promise<void> {
  console.log("🔨 Building registry...")

  const stats: BuildStats = {
    totalItems: 0,
    successfulBuilds: 0,
    failedBuilds: 0,
    errors: [],
  }

  try {
    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true })
    await mkdir(OUTPUT_ITEMS_DIR, { recursive: true })

    // Read all item files
    const itemFiles = await readdir(ITEMS_DIR)
    const itemNames = itemFiles
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""))

    stats.totalItems = itemNames.length

    console.log(`Found ${itemNames.length} items to build\n`)

    // Build each item
    const builtItems: RegistryItem[] = []
    for (const itemName of itemNames) {
      try {
        const item = await buildRegistryItem(itemName)
        builtItems.push(item)
        stats.successfulBuilds++
      } catch (error) {
        stats.failedBuilds++
        stats.errors.push({
          item: itemName,
          error: error instanceof Error ? error.message : String(error),
        })
        console.error(`✗ Failed to build ${itemName}: ${error}`)
      }
    }

    // Generate index
    if (builtItems.length > 0) {
      await generateIndex(builtItems)
    }

    // Print summary
    console.log("\n" + "=".repeat(50))
    console.log("Build Summary:")
    console.log("=".repeat(50))
    console.log(`Total items:       ${stats.totalItems}`)
    console.log(`Successful builds: ${stats.successfulBuilds}`)
    console.log(`Failed builds:     ${stats.failedBuilds}`)

    if (stats.errors.length > 0) {
      console.log("\nErrors:")
      for (const error of stats.errors) {
        console.log(`  - ${error.item}: ${error.error}`)
      }
    }

    console.log("=".repeat(50))

    if (stats.failedBuilds > 0) {
      process.exit(1)
    }

    console.log("\n✨ Registry build complete!")
  } catch (error) {
    console.error("Fatal error during build:", error)
    process.exit(1)
  }
}

// Run the build
buildRegistry()
