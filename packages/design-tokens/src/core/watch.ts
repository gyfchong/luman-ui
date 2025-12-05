import { watch as chokidarWatch } from "chokidar";
import type { ResolvedConfigWithPaths } from "../config.ts";
import { build } from "./build.ts";

/**
 * Watch tokens file and rebuild on changes
 */
export async function watch(config: ResolvedConfigWithPaths): Promise<void> {
  console.log(`👀 Watching for changes to ${config.tokenSchemaPath}...\n`);

  // Initial build
  await build(config);

  // Watch for changes
  const watcher = chokidarWatch(config.tokenSchemaPath, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", async () => {
    console.log("📝 Tokens changed, rebuilding...\n");
    await build(config);
  });

  watcher.on("error", (error) => {
    console.error("❌ Watcher error:", error);
  });

  // Keep process alive
  process.on("SIGINT", () => {
    console.log("\n👋 Stopping watcher...");
    watcher.close();
    process.exit(0);
  });
}
