# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Whale Dashboard is a Next.js task management dashboard that integrates with Notion API. It displays, filters, and manages task records from a Notion database with support for dark/light themes.

## Development Commands

```bash
pnpm dev      # Start development server (http://localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

**Package manager**: pnpm (v9.15.0)

## Architecture

### Server-Client Hybrid Pattern

- **Server Components**: Data fetching in `src/app/record/[id]/page.tsx`
- **Server Actions**: All Notion API calls in `src/app/actions.ts` (marked with `'use server'`)
- **Client Components**: Interactive UI marked with `'use client'` directive
- **State Management**: React hooks (useState, useEffect, useMemo) - no external state library

### Key Directories

```
src/
├── app/
│   ├── actions.ts          # Server actions for Notion API operations
│   ├── page.tsx            # Home page (renders Dashboard)
│   ├── layout.tsx          # Root layout with fonts and metadata
│   └── record/[id]/        # Dynamic route for task detail pages
├── components/             # React UI components (all 'use client')
└── lib/
    └── notion.ts           # Notion API utilities and types
```

### Notion Integration

Uses direct REST API calls to Notion (not the SDK client methods) via native fetch. The `@notionhq/client` package is installed but not actively used due to issues encountered.

**API endpoints used:**
- `POST /v1/databases/{id}/query` - List records
- `GET /v1/pages/{id}` - Fetch single page
- `GET /v1/blocks/{id}/children` - Fetch page content blocks
- `PATCH /v1/pages/{id}` - Update page properties
- `PATCH /v1/blocks/{id}/children` - Update page content
- `DELETE /v1/blocks/{id}` - Delete content blocks

**Notion database properties mapped:**
- `Task` (title) - Task name
- `Status` (select) - Task status
- `Assignee` (multi_select/people) - Assigned person
- `1Depth`, `2Depth` (select/rich_text) - Categorization fields

### Environment Variables

Required in `.env.local`:
```
NOTION_API_KEY=<your-notion-integration-token>
NOTION_DATABASE_ID=<your-database-id>
```

Both `NEXT_PUBLIC_` prefixed variants are also supported.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2 with React Compiler (babel-plugin-react-compiler)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Markdown**: @uiw/react-md-editor, @uiw/react-markdown-preview
- **TypeScript**: 5.x with strict mode
- **Path aliases**: `@/*` maps to `./src/*`

## Testing

No testing framework is currently configured.
