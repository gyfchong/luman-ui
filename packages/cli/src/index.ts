#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import colors from 'picocolors'
import initCommand from './commands/init.js'
import listCommand from './commands/list.js'
import addCommand from './commands/add.js'
import removeCommand from './commands/remove.js'
import loginCommand from './commands/login.js'
import logoutCommand from './commands/logout.js'
import whoamiCommand from './commands/whoami.js'

const main = defineCommand({
  meta: {
    name: 'luman',
    version: '0.1.0',
    description: 'AI-native design system CLI',
  },
  subCommands: {
    init: initCommand,
    list: listCommand,
    add: addCommand,
    remove: removeCommand,
    login: loginCommand,
    logout: logoutCommand,
    whoami: whoamiCommand,
  },
  async run() {
    console.log(colors.bold('\n✨ Luman UI\n'))
    console.log('AI-native design system for React\n')
    console.log('Commands:')
    console.log(`  ${colors.cyan('init')}     Initialize luman-ui in your project`)
    console.log(`  ${colors.cyan('list')}     List available components`)
    console.log(`  ${colors.cyan('add')}      Add a component to your project`)
    console.log(`  ${colors.cyan('remove')}   Remove a component from your project`)
    console.log()
    console.log('Authentication:')
    console.log(`  ${colors.cyan('login')}    Login to Luman backend`)
    console.log(`  ${colors.cyan('logout')}   Logout from Luman backend`)
    console.log(`  ${colors.cyan('whoami')}   Show current user information`)
    console.log()
    console.log('Phase 2 commands (scaffold-feature, scaffold-page, etc.) available via API')
    console.log()
  },
})

runMain(main)
