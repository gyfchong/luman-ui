# Execution Planning Prompt: AI-Native Design System

You are an expert software architect and project manager. Create a comprehensive, detailed execution plan for building an AI-native design system based on the architecture specification below.

## Project Overview

Build an AI-native design system platform that bridges design and development for enterprise product teams. The system enables developers to scaffold UI components and pages using natural language with LLMs like Claude, while maintaining design-code consistency.

**Core Value Propositions:**

1. **Brownfield Migration**: Help teams escape inconsistent existing design systems through systematic migration
2. **Iteration Velocity**: Enable shipping design changes in minutes rather than sprints through AI-assisted workflows
3. **Code Mode First**: Optimize for LLMs writing TypeScript code rather than making direct tool calls

## Architectural Foundation

### Technology Stack

**Monorepo Structure:**

- **Tool**: Turborepo + pnpm workspaces
- **Versioning**: Changesets for linked package releases
- **Why**: Tightly coupled packages (CLI, MCP, components) benefit from atomic commits and shared tooling

**Component Framework:**

- React with TypeScript
- Tailwind CSS for styling
- Radix UI primitives as foundation
- shadcn/ui distribution model (copy to user codebase, not npm install)

**CLI Stack:**

- Framework: Citty (TypeScript-first, ESM-native)
- Prompts: @clack/prompts
- Styling: Picocolors
- Package managers: nypm (unified API for npm/pnpm/yarn/bun)

**Backend (when needed):**

- Language: TypeScript/Node.js
- Auth: OAuth 2.0
- Database: TBD based on requirements
- Hosting: TBD based on requirements

### Repository Structure

```
ai-design-system/
├── apps/
│   ├── docs/                  # Next.js documentation site
│   └── playground/            # Component demos + code mode testing
├── packages/
│   ├── ui/                    # Component library (published, MIT)
│   │   ├── src/components/
│   │   ├── registry/          # Component source for distribution
│   │   └── components.json
│   ├── cli/                   # CLI tool (published, MIT)
│   │   ├── src/
│   │   │   ├── commands/      # CLI commands
│   │   │   ├── api.ts         # Programmatic API (exported)
│   │   │   └── utils/
│   │   └── package.json       # exports: { ".": "index.ts", "./api": "api.ts" }
│   ├── mcp-server/            # MCP server (published, MIT)
│   │   ├── src/
│   │   │   ├── tools/         # Imports from @repo/cli/api
│   │   │   └── server.ts
│   │   └── README.md          # TypeScript API documentation
│   ├── registry/              # Component metadata JSON (internal)
│   └── config/                # Shared ESLint/TS/Tailwind (internal)
├── .changeset/config.json
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Core Architectural Principles

### 1. Capability-Based Architecture

Design capabilities as independent, composable units that can be mixed and matched. Business logic (quotas, permissions, tier checks) lives in the backend API, not the CLI or MCP server.

**Client-Side Capabilities** (no infrastructure required):

- Discovery & Documentation
- Installation & Management
- Composition & Generation
- Theming & Customization
- Analysis & Migration

**Backend-Dependent Capabilities** (require infrastructure):

- Team Collaboration
- Analytics & Tracking
- Private Registry
- Authentication & Authorization

### 2. Code Mode First Design

**Critical principle**: LLMs are significantly better at writing TypeScript code than making direct tool calls. Design the MCP server to be consumed via "code mode" where:

1. LLM writes TypeScript code using the design system's API
2. Code executes in a sandbox on the user's machine
3. Results return to the LLM without round-trip overhead

**Implications:**

- All MCP tools must return structured JSON, never markdown prose
- Design tools for composition, not just atomic operations
- MCP server wraps CLI's programmatic API (no logic duplication)
- Include comprehensive TypeScript API documentation in README

### 3. Component Distribution Model (shadcn-style)

Components are **copied into the user's codebase**, not installed as npm dependencies:

**Registry Schema:**

```json
{
  "name": "button",
  "type": "registry:ui",
  "dependencies": ["class-variance-authority"],
  "registryDependencies": ["utils"],
  "files": [{ "path": "ui/button.tsx", "type": "registry:component" }]
}
```

**Key features:**

- `components.json` configuration in user's project
- Components installed via `npx yourds add button`
- Users get full ownership and customization
- Registry served from CDN (public) or authenticated API (private)

### 4. Integration Pattern

```
MCP Server (wraps) → CLI API (implements) → Capabilities
                                ↓
                         Backend API (optional)
```

- MCP server has **zero business logic**, just wraps CLI API
- CLI exports programmatic `api` module for scripting
- Backend handles auth, quotas, permissions, analytics
- This separation enables flexible business models later

## Six-Phase Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Goal**: Basic component installation working

**Tasks:**

- Monorepo setup (Turborepo + pnpm)
- Shared configs (TypeScript, ESLint, Tailwind)
- Component registry build system
- Public CDN hosting for registry
- CLI: `listComponents`, `getComponentDetails`, `addComponent`, `removeComponent`, `updateTokens`

**Deliverable**: `npx yourds add button` installs components from public registry

### Phase 2: Composition & Generation (Weeks 3-4)

**Goal**: LLM-orchestrated component composition working via code mode

**Core Principle**: LLMs are better at writing TypeScript code than making tool calls. The CLI provides primitives, the LLM orchestrates them.

**Tasks:**

- ✅ CLI primitives: `previewComposition`, `updateComponent`, `getPattern`
- ✅ Pattern documentation system for LLM guidance
  - Accessibility patterns (WCAG 2.1 AA compliance)
  - Composition patterns (how to use components together)
  - Stored in `packages/cli/patterns/` directory
- ✅ MCP server wrapping CLI primitives (zero business logic)
- ✅ Comprehensive TypeScript API documentation with code examples
- ✅ Example workflows showing LLM orchestration patterns
- ❌ Removed: Template-based scaffolding (contradicts code-mode-first)
- ❌ Removed: `scaffoldFeature`, `scaffoldPage`, `getTemplates`

**Pattern Structure:**

```
packages/cli/patterns/
├── accessibility/
│   └── form-accessibility.md    # WCAG patterns, aria attributes
└── composition/
    └── form-composition.md      # Component usage examples
```

**LLM Workflow:**

1. Read relevant patterns (`getPattern()`)
2. Preview composition (`previewComposition()`)
3. Install components (`addComponent()`)
4. Generate code following patterns (LLM synthesizes from pattern docs)
5. Write files (standard fs operations)

**Deliverable**: LLMs can build accessible, well-composed features by orchestrating primitives and following pattern documentation

### Phase 3: Component Library & Registry (Weeks 5-6)

**Goal**: Core component library with working registry

**Note**: Phase 3 previously focused on migration features, which have been backlogged. This phase now focuses on building out the component library and registry infrastructure.

**Tasks:**

- Build core UI components (button, input, label, form, card, dialog, etc.)
- Registry metadata for each component
- Component documentation
- Example usage for each component
- Testing infrastructure
- Storybook or similar for component preview

**Deliverable**: Production-ready component library with registry

### Phase 4: Backend Infrastructure (Weeks 7-8)

**Goal**: Authentication and backend foundation ready

**Tasks:**

- OAuth 2.0 authentication service
- User and organization management
- Token storage and refresh logic
- API rate limiting and monitoring
- CLI: `login`, `logout`, backend communication helpers

**Deliverable**: Authentication infrastructure operational

### Phase 5: Team Features (Weeks 9-10)

**Goal**: Team collaboration working

**Tasks:**

- Backend: Team database schema, invitations, permissions
- CLI: `getTeamMembers`, `inviteMember`, `shareProject`, `syncTeamConfig`
- MCP: Team collaboration tools

**Deliverable**: Teams can collaborate on shared configurations

### Phase 6: Analytics & Private Registry (Weeks 11-12)

**Goal**: Enterprise features operational

**Tasks:**

- Backend: Analytics data warehouse, usage tracking, private registry hosting
- CLI: `getComponentAnalytics`, `getAdoptionMetrics`, `addFromPrivateRegistry`, `publishToPrivateRegistry`
- MCP: Analytics and private registry tools

**Deliverable**: Full enterprise feature set

## Capability Composition Matrix

| Capability       | CLI        | MCP       | Backend | Notes                  |
| ---------------- | ---------- | --------- | ------- | ---------------------- |
| Discovery        | ✅ Core    | ✅ Expose | ❌ No   | Component metadata     |
| Installation     | ✅ Core    | ✅ Expose | ❌ No   | Registry + npm deps    |
| Composition      | ✅ Core    | ✅ Expose | ❌ No   | Templates + generation |
| Theming          | ✅ Core    | ✅ Expose | ❌ No   | Token files            |
| Analysis         | ✅ Core    | ✅ Expose | ❌ No   | AST parsing            |
| Migration        | ✅ Core    | ✅ Expose | ❌ No   | Mapping configs        |
| Team             | 🔌 Wrapper | ✅ Expose | ✅ Core | Database + API         |
| Analytics        | 🔌 Wrapper | ✅ Expose | ✅ Core | Data warehouse         |
| Private Registry | 🔌 Wrapper | ✅ Expose | ✅ Core | CDN + auth             |
| Auth             | ✅ Core    | ❌ No     | ✅ Core | OAuth provider         |

## Key Technical Requirements

### CLI Requirements

1. Must export programmatic `api` module for scripting
2. Must detect framework (Next.js, Vite, Remix, Astro)
3. Must detect package manager (npm, pnpm, yarn, bun)
4. Must work offline for client-side capabilities
5. Must handle authentication gracefully (optional for core features)
6. Must preserve user customizations during updates
7. Must use AST manipulation for non-destructive file edits

### MCP Server Requirements

1. Must wrap CLI API without adding business logic
2. All tool responses must be structured JSON
3. README must include comprehensive TypeScript API documentation
4. Must support both code mode and traditional tool calling
5. Must handle errors gracefully with clear capability requirements
6. Must work with or without backend (graceful degradation)

### Component Library Requirements

1. Follow shadcn patterns (forwardRef, CVA variants, Radix primitives)
2. Include comprehensive registry metadata
3. Support design tokens via CSS variables (OKLCH color space)
4. Support light/dark themes via `.dark` class
5. Include `cn()` utility for class composition
6. Document all props, variants, and examples

### Registry Requirements

1. Support multiple item types (ui, component, block, page, hook)
2. Declare npm dependencies and registry dependencies explicitly
3. Support namespaced registries for ecosystem extensibility
4. Support both public (CDN) and private (authenticated) registries
5. Include versioning and changelog information

## Business Model Flexibility

The architecture supports multiple business models without code changes:

**Option 1: Fully Open Source**

- All capabilities free and open
- Monetize via consulting/support

**Option 2: Freemium SaaS**

- Core capabilities free
- Backend capabilities paid

**Option 3: Enterprise Only**

- Core open source
- Backend enterprise-only

**Option 4: Hybrid**

- Core free
- Team features Pro tier
- Analytics/private registry Enterprise

**Key insight**: Business logic lives in backend API, enabling model evolution without changing CLI/MCP.

## Your Task

Based on this architecture specification, create a comprehensive execution plan that includes:

1. **Phase-by-phase breakdown** with specific milestones and deliverables
2. **Technical task lists** for each phase with time estimates
3. **Dependency mapping** showing what must be built before what
4. **Testing strategy** for each capability and integration point
5. **Documentation requirements** for each deliverable
6. **Risk assessment** identifying technical risks and mitigation strategies
7. **Resource requirements** (engineering hours, infrastructure needs)
8. **Success metrics** for each phase
9. **Decision points** where business model choices affect implementation
10. **Deployment strategy** for phased rollout

The plan should be:

- **Actionable**: Specific enough for a team to start building
- **Realistic**: Account for complexity and dependencies
- **Incremental**: Each phase delivers standalone value
- **Flexible**: Enable business model decisions to be deferred

Focus on Phases 1-3 first (Foundation, Composition, Migration) as these provide core value without requiring backend infrastructure.
