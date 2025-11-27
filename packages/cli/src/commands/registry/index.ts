import { defineCommand } from 'citty'
import { bumpCommand } from './bump.js'

export const registryCommand = defineCommand({
  meta: {
    name: 'registry',
    description: 'Manage component registry',
  },
  subCommands: {
    bump: bumpCommand,
  },
})
