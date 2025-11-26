#!/usr/bin/env node

import { defineCommand, runMain } from 'citty';
import pc from 'picocolors';

// Import commands
import list from './commands/list.js';
import add from './commands/add.js';
import scaffoldFeature from './commands/scaffold-feature.js';
import scaffoldPage from './commands/scaffold-page.js';
import previewComposition from './commands/preview-composition.js';
import updateComponent from './commands/update-component.js';

const main = defineCommand({
  meta: {
    name: 'luman',
    version: '0.1.0',
    description: 'AI-native design system CLI',
  },
  subCommands: {
    list,
    add,
    'scaffold-feature': scaffoldFeature,
    'scaffold-page': scaffoldPage,
    'preview-composition': previewComposition,
    'update-component': updateComponent,
  },
});

runMain(main);
