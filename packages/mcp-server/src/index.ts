#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { listComponents, listComponentsMetadata } from './tools/list-components.js';
import { getComponentDetails, getComponentDetailsMetadata } from './tools/get-component-details.js';
import { addComponent, addComponentMetadata } from './tools/add-component.js';
import { previewComposition, previewCompositionMetadata } from './tools/preview-composition.js';
import { getPattern, getPatternMetadata } from './tools/get-pattern.js';
import { analyzeProject, analyzeProjectMetadata } from './tools/analyze-project.js';

// Create server instance
const server = new Server(
  {
    name: 'luman-ui-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: listComponentsMetadata.name,
        description: listComponentsMetadata.description,
        inputSchema: {
          type: 'object',
          properties: listComponentsMetadata.inputSchema.shape,
        },
      },
      {
        name: getComponentDetailsMetadata.name,
        description: getComponentDetailsMetadata.description,
        inputSchema: {
          type: 'object',
          properties: getComponentDetailsMetadata.inputSchema.shape,
          required: ['name'],
        },
      },
      {
        name: addComponentMetadata.name,
        description: addComponentMetadata.description,
        inputSchema: {
          type: 'object',
          properties: addComponentMetadata.inputSchema.shape,
          required: ['name'],
        },
      },
      {
        name: previewCompositionMetadata.name,
        description: previewCompositionMetadata.description,
        inputSchema: {
          type: 'object',
          properties: previewCompositionMetadata.inputSchema.shape,
          required: ['components'],
        },
      },
      {
        name: getPatternMetadata.name,
        description: getPatternMetadata.description,
        inputSchema: {
          type: 'object',
          properties: getPatternMetadata.inputSchema.shape,
          required: ['patternName'],
        },
      },
      {
        name: analyzeProjectMetadata.name,
        description: analyzeProjectMetadata.description,
        inputSchema: {
          type: 'object',
          properties: analyzeProjectMetadata.inputSchema.shape,
        },
      },
    ],
  };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'list_components':
        result = await listComponents(args as any);
        break;
      case 'get_component_details':
        result = await getComponentDetails(args as any);
        break;
      case 'add_component':
        result = await addComponent(args as any);
        break;
      case 'preview_composition':
        result = await previewComposition(args as any);
        break;
      case 'get_pattern':
        result = await getPattern(args as any);
        break;
      case 'analyze_project':
        result = await analyzeProject(args as any);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('luman-ui MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
