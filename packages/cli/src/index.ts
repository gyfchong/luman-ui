#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import colors from 'picocolors'
import initCommand from './commands/init'
import listCommand from './commands/list'
import addCommand from './commands/add'
import removeCommand from './commands/remove'

const main = defineCommand({
  meta: {
    name: 'luman',
    version: '0.0.0',
    description: 'AI-native design system CLI',
  },
  subCommands: {
    init: initCommand,
    list: listCommand,
    add: addCommand,
    remove: removeCommand,
  },
  async run() {
    console.log(colors.bold('\n✨ Luman UI\n'))
    console.log('AI-native design system for React\n')
    console.log('Commands:')
    console.log(`  ${colors.cyan('init')}    Initialize luman-ui in your project`)
    console.log(`  ${colors.cyan('list')}    List available components`)
    console.log(`  ${colors.cyan('add')}     Add a component to your project`)
    console.log(`  ${colors.cyan('remove')}  Remove a component from your project`)
    console.log()
  },
})

runMain(main)
