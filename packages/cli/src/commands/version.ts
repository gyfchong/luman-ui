import { defineCommand } from 'citty'
import pc from 'picocolors'

export const versionCommand = defineCommand({
  meta: {
    name: 'version',
    description: 'Display CLI version',
  },
  run() {
    // Version is injected at build time from package.json
    // For now, hardcoded - will be replaced by build system
    const version = '0.1.0'
    console.log(`${pc.cyan('luman')} v${version}`)
  },
})
