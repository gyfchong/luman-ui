import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import type { DesignTokens } from "../schema.ts";
import type { ResolvedConfigWithPaths } from "../config.ts";
import { generateComponentTypes } from "../generators/generate-types.ts";
import { generateTailwindConfig } from "../generators/generate-tailwind.ts";
import { generateCVA } from "../generators/generate-cva.ts";
import { toPascalCase } from "../utils/formatting.ts";

export interface BuildResult {
  success: boolean;
  filesGenerated: string[];
  errors?: string[];
}

/**
 * Build design tokens and generate outputs
 */
export async function build(config: ResolvedConfigWithPaths): Promise<BuildResult> {
  const filesGenerated: string[] = [];
  const errors: string[] = [];

  try {
    console.log("🎨 Building design tokens...\n");

    // 1. Read tokens
    const tokensJson = readFileSync(config.tokenSchemaPath, "utf-8");
    const tokens: DesignTokens = JSON.parse(tokensJson);

    // 2. Generate TypeScript types
    try {
      const types = generateComponentTypes(tokens);
      const typesOutput = config.componentTypesPath;

      // Ensure directory exists
      mkdirSync(dirname(typesOutput), { recursive: true });

      writeFileSync(typesOutput, types, "utf-8");
      console.log(`✅ Generated component types → ${typesOutput}`);
      filesGenerated.push(typesOutput);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to generate types: ${message}`);
      console.error(`❌ Failed to generate types: ${message}`);
    }

    // 3. Generate CSS theme (if styleSystem is tailwind)
    if (config.styleSystem === "tailwind") {
      try {
        const tailwindTheme = generateTailwindConfig(tokens);
        const cssOutput = config.cssOutputPath;

        // Ensure directory exists
        mkdirSync(dirname(cssOutput), { recursive: true });

        const cssContent = `/* Auto-generated from design-tokens.json - DO NOT EDIT */
/* Last updated: ${new Date().toISOString()} */

${tailwindTheme}`;
        writeFileSync(cssOutput, cssContent, "utf-8");
        console.log(`✅ Generated Tailwind theme → ${cssOutput}`);
        filesGenerated.push(cssOutput);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to generate Tailwind theme: ${message}`);
        console.error(`❌ Failed to generate Tailwind theme: ${message}`);
      }
    }

    // 4. Generate CVA variants
    try {
      const cvaFiles = generateCVA(tokens, config.cva);
      const cvaOutputBaseDir = config.componentDirPath;

      for (const [componentName, cvaCode] of cvaFiles) {
        // Assume component subdirectory exists (e.g., Button/, Input/)
        const componentDir = toPascalCase(componentName);
        const componentPath = resolve(cvaOutputBaseDir, componentDir);
        const outputPath = resolve(componentPath, `${componentName}.variants.ts`);

        try {
          // Write variant file in existing component directory
          writeFileSync(outputPath, cvaCode, "utf-8");
          console.log(`✅ Generated CVA variants → ${outputPath}`);
          filesGenerated.push(outputPath);
        } catch (writeError) {
          // If directory doesn't exist, provide helpful error
          const errMsg = writeError instanceof Error ? writeError.message : String(writeError);
          if (errMsg.includes("ENOENT") || errMsg.includes("no such file")) {
            const helpfulMsg = `Component directory not found: ${componentPath}\nCreate the directory first: mkdir -p ${componentPath}`;
            errors.push(helpfulMsg);
            console.error(`❌ ${helpfulMsg}`);
          } else {
            throw writeError;
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to generate CVA variants: ${message}`);
      console.error(`❌ Failed to generate CVA variants: ${message}`);
    }

    if (errors.length === 0) {
      console.log("\n✨ Build complete!\n");
      return { success: true, filesGenerated };
    } else {
      console.log(`\n⚠️  Build completed with ${errors.length} error(s)\n`);
      return { success: false, filesGenerated, errors };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Build failed: ${message}`);
    return { success: false, filesGenerated, errors: [message] };
  }
}
