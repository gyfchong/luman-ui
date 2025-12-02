import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { watch } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateComponentTypes } from './builders/generate-types.ts'
import { generateTailwindConfig } from './builders/generate-tailwind.ts'
import type { DesignTokens } from './schema.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const TOKENS_PATH = resolve(__dirname, 'design-tokens.json')
const GENERATED_DIR = resolve(__dirname, 'generated')
const TYPES_OUTPUT = resolve(GENERATED_DIR, 'component-types.ts')
const TAILWIND_OUTPUT = resolve(__dirname, '../../tailwind.config.js')

async function build() {
  try {
    console.log('🎨 Building design tokens...\n')

    // 1. Read tokens
    const tokensJson = readFileSync(TOKENS_PATH, 'utf-8')
    const tokens: DesignTokens = JSON.parse(tokensJson)

    // 2. Create generated directory if it doesn't exist
    mkdirSync(GENERATED_DIR, { recursive: true })

    // 3. Generate TypeScript types
    const types = generateComponentTypes(tokens)
    writeFileSync(TYPES_OUTPUT, types, 'utf-8')
    console.log('✅ Generated component types → src/tokens/generated/component-types.ts')

    // 4. Generate Tailwind config
    const tailwindConfig = generateTailwindConfig(tokens)
    const tailwindConfigContent = `// Auto-generated from design-tokens.json - DO NOT EDIT
// Last updated: ${new Date().toISOString()}

export default ${JSON.stringify(tailwindConfig, null, 2)}
`
    writeFileSync(TAILWIND_OUTPUT, tailwindConfigContent, 'utf-8')
    console.log('✅ Generated Tailwind config → tailwind.config.js')

    console.log('\n✨ Build complete!\n')
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

// Run build
await build()

// Watch mode
if (process.argv.includes('--watch')) {
  console.log('👀 Watching for changes...\n')

  watch(TOKENS_PATH, async (eventType) => {
    if (eventType === 'change') {
      console.log('📝 Tokens changed, rebuilding...\n')
      await build()
    }
  })
}
