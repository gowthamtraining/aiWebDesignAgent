# 🔥 Forge — AI Web Design Agent

> **Forge** is a full-stack, AI-powered web design platform that turns plain-text descriptions into fully functional, multi-page website designs in seconds. Think of it as your senior developer + designer, available 24/7, backed by state-of-the-art LLMs.

---

## ✨ Features at a Glance

| Feature | Description |
|---|---|
| 🤖 **AI-Powered Generation** | Generates complete HTML/CSS pages from a single prompt |
| 🎨 **Live Canvas Preview** | Rendered output in a zoomable, pannable canvas, updated in real-time |
| 💬 **Conversational Editor** | Iterate on your designs via chat — regenerate, modify, or add pages |
| 📄 **Multi-Page Support** | Generate and manage multiple pages per project |
| 🔑 **Google OAuth** | One-click sign-in via Google |
| 🗂️ **Project Dashboard** | View, open, and delete all your recent projects |
| 🌙 **Dark / Light Mode** | Full system-aware theme toggle |
| ⚡ **Streaming Responses** | Real-time token streaming so you see content appear as it's generated |
| 🧩 **Intent Classification** | Forge understands whether you want to chat, generate, or regenerate |

---

## 🗂️ Application Architecture

```
app/
├── (routes)/
│   ├── page.tsx                  → Home dashboard (new project chat)
│   ├── auth/                     → Login / OAuth sign-in pages
│   └── project/[slugId]/         → Project editor page
│
├── api/
│   ├── project/
│   │   ├── route.ts              → GET (list projects) + POST (AI generation pipeline)
│   │   └── [slugId]/route.ts     → GET (project detail) + DELETE (delete project)
│   └── action/
│       └── action.ts             → generateProjectTitle() server action (AI)
│
components/
├── Chat/
│   ├── index.tsx                 → Root editor layout (sidebar + canvas)
│   ├── new-project-chat.tsx      → Home page UI (hero, suggestions, project grid)
│   ├── chat-panel.tsx            → Left sidebar chat thread + input
│   ├── chat-input.tsx            → Multi-modal input (text + file upload)
│   └── canvas/
│       ├── index.tsx             → Zoomable canvas with page frame management
│       ├── page-frame.tsx        → Individual page iframe renderer with live edit
│       └── canvas-controls.tsx   → Zoom in/out + tool mode switcher
│
lib/
├── insforge-server.ts            → Server-side InsForge SDK client (with JWT/session handling)
├── prompt.ts                     → All AI system prompts (intent, generation, chat, summary)
└── utils.ts                      → Helpers: slugId generator, cn(), etc.
```

---

## 🔄 Generation Pipeline (How It Works)

When you send a message on a project, the `POST /api/project` handler runs through this pipeline:

```
1. Authenticate user (JWT session from InsForge)
2. Look up or CREATE a new project in the database
   └─ If new → generateProjectTitle() via AI (gpt-4o-mini with retry backoff)
3. Save the user message to the messages table
4. Run INTENT CLASSIFICATION
   └─ Model: anthropic/claude-sonnet-4.5
   └─ Result: "chat" | "generate" | "regenerate"
5. Branch by intent:
   ├─ CHAT → Stream a conversational response
   ├─ GENERATE → Run full page generation worker
   │   ├─ Analyze request & plan pages
   │   ├─ Generate HTML/CSS for each page (streamed)
   │   ├─ Save each page to the `pages` table
   │   └─ Generate a summary message
   └─ REGENERATE → Re-generate a specific selected page
6. Save the assistant message with parts (text + generation card)
7. Stream everything back to the client via UIMessageStream
```

---

## 🧠 AI Models Used

| Task | Model |
|---|---|
| Intent Classification | `anthropic/claude-sonnet-4.5` |
| Title Generation | `openai/gpt-4o-mini` (with retry + exponential backoff) |
| Conversational Chat | `google/gemini-2.5-pro` |
| Page Generation | `google/gemini-3.1-pro-preview` |
| Summary Writing | `google/gemini-2.5-flash-lite` |
| Page Regeneration | `google/gemini-3-flash-preview` |

All AI calls are routed through the **InsForge AI integration** (OpenAI-compatible API).

---

## 🗄️ Database Schema

Powered by **InsForge** (PostgreSQL + PostgREST).

### `projects`
| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `title` | TEXT | AI-generated project name |
| `slugId` | TEXT (UNIQUE) | URL-safe identifier, e.g. `Uy01EXVTQBWm` |
| `userId` | UUID | Owner's user ID |
| `createdAt` | TIMESTAMPTZ | Creation timestamp |

### `messages`
| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `projectId` | UUID (FK) | References `projects.id` (cascade delete) |
| `role` | TEXT | `"user"` or `"assistant"` |
| `parts` | JSONB | Array of message parts (text, data-generation, file) |
| `createdAt` | TIMESTAMPTZ | Creation timestamp |

### `pages`
| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `projectId` | UUID (FK) | References `projects.id` (cascade delete) |
| `name` | TEXT | Page name (e.g., "Home", "Pricing") |
| `htmlContent` | TEXT | Full generated HTML/CSS string |
| `rootStyles` | JSONB | Root-level style tokens |
| `createdAt` | TIMESTAMPTZ | Creation timestamp |

---

## 🔐 Authentication

- Provided by **InsForge Auth** with **Google OAuth**
- Session stored in an `insforge-session` cookie (JWT, 15-min expiry with server-side refresh)
- Server-side auth handled in `lib/insforge-server.ts`:
  - Tries `auth()` from `@insforge/nextjs` first
  - Falls back to cookie parsing if needed
  - Validates JWT expiry before sending to the database to prevent 401 errors
  - `INSFORGE_API_KEY` used as a privileged server-side key

---

## 🖼️ Canvas System

The **right-side canvas** is a powerful preview environment:

- **Zoom & Pan** — `react-zoom-pan-pinch` for fluid navigation
- **Tool Modes** — Select mode (click to inspect) and Hand mode (drag to pan)
- **Multi-Page Tabs** — Switch between generated pages; each renders in an isolated `<iframe>`
- **Live Edit** — In-place text editing directly on the canvas
- **Streaming Updates** — Page content appears progressively as the AI streams HTML tokens
- **Resize** — Pages can be resized using `react-rnd`

---

## 💬 Message Parts System

Each message consists of typed **parts**, enabling rich UI:

| Part Type | Rendered As |
|---|---|
| `text` | Markdown text via Streamdown renderer |
| `data-generation` | Generation progress card (with per-page status) |
| `file` | Image attachment preview grid |
| `data-project-title` | Triggers project title update in the header |
| `data-pages-skeleton` | Adds loading page tabs to the canvas |
| `data-page-loading` | Sets a specific page to loading state |
| `data-page-created` | Finalizes a page tab with real content |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An [InsForge](https://insforge.app) account with a project set up

### 1. Clone & Install

```bash
git clone https://github.com/your-username/forge-ai-webdesign
cd forge-ai-webdesign
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root:

```env
# InsForge Backend URL
NEXT_PUBLIC_INSFORGE_BASE_URL=https://your-project.region.insforge.app

# JWT-based Anon Key (from InsForge MCP: get-anon-key)
NEXT_PUBLIC_INSFORGE_ANON_KEY=eyJhbGci...

# Management API Key (from InsForge Dashboard)
INSFORGE_API_KEY=ik_xxxxxxxxxxxxxxxxxxxx
```

### 3. Initialize the Database

Run this SQL in your InsForge SQL editor (or via MCP `run-raw-sql`):

```sql
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    "slugId" TEXT UNIQUE NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    parts JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    "rootStyles" JSONB DEFAULT '{}',
    "htmlContent" TEXT DEFAULT '',
    "createdAt" TIMESTAMPTZ DEFAULT now()
);
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **AI SDK** | Vercel AI SDK (`ai`, `@ai-sdk/react`) |
| **Backend / DB / Auth** | InsForge (PostgreSQL + PostgREST + JWT Auth) |
| **State Management** | TanStack Query v5 + React useState |
| **Animations** | Motion (Framer Motion v12) |
| **Canvas Zoom** | react-zoom-pan-pinch |
| **Resize** | react-rnd |
| **Markdown Streaming** | Streamdown |
| **Notifications** | Sonner |
| **Icons** | Lucide React |
| **URL State** | nuqs |

---

## 📁 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/project` | List all projects for the authenticated user |
| `POST` | `/api/project` | Start/continue a conversation and trigger AI generation |
| `GET` | `/api/project/:slugId` | Fetch a project's messages and pages (for hydration) |
| `DELETE` | `/api/project/:slugId` | Delete a project and all its data (cascade) |

---

## 🔧 Development Tips

- **AI timeout** is set to **180 seconds** for large page generations — do not reduce this
- **Token expiry**: InsForge sessions expire in 15 minutes. The app gracefully handles this by detecting expired JWTs and falling back to the anonymous key
- **Model availability**: Only use models listed in `get-backend-metadata` from InsForge MCP — others will 404
- **CSS column names**: All database columns use camelCase with quoted identifiers (`"slugId"`, `"userId"`, etc.) — this is required for PostgREST compatibility

---

## 🙌 Credits

Built with ❤️ using [InsForge](https://insforge.app), [Next.js](https://nextjs.org), and the [Vercel AI SDK](https://sdk.vercel.ai).
