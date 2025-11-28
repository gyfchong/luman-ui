#!/usr/bin/env node
import { defineCommand, runMain } from "citty"
import colors from "picocolors"
import addCommand from "./commands/add.js"
import initCommand from "./commands/init.js"
import listCommand from "./commands/list.js"
import removeCommand from "./commands/remove.js"
import { statusCommand } from "./commands/status.js"
import { updateCommand } from "./commands/update.js"
import { versionCommand } from "./commands/version.js"

const main = defineCommand({
  meta: {
    name: "luman",
    version: "0.1.0",
    description: "AI-native design system CLI",
  },
  subCommands: {
    init: initCommand,
    list: listCommand,
    add: addCommand,
    remove: removeCommand,
    status: statusCommand,
    update: updateCommand,
    version: versionCommand,
  },
  async run() {
    console.log(colors.bold("\n✨ Luman UI\n"))
    console.log("AI-native design system for React\n")
    console.log("Commands:")
    console.log(`  ${colors.cyan("init")}      Initialize luman-ui in your project`)
    console.log(`  ${colors.cyan("list")}      List available components`)
    console.log(`  ${colors.cyan("add")}       Add a component to your project`)
    console.log(`  ${colors.cyan("remove")}    Remove a component from your project`)
    console.log(`  ${colors.cyan("status")}    Check status of installed components`)
    console.log(`  ${colors.cyan("update")}    Update component to latest version`)
    console.log(`  ${colors.cyan("version")}   Display CLI version`)
    console.log()
    console.log("Phase 2 commands (scaffold-feature, scaffold-page, etc.) available via API")
    console.log()
  },
})

runMain(main)
