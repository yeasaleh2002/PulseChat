# PulseChat | Next-Gen Real-Time Chat & Collaboration Engine

**PulseChat** is a highly scalable, production-ready real-time messaging application built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, **TypeScript**, **Zustand**, **React Virtuoso**, and **Socket.io**.

---

## 🔗 Live Demo & Documentation Links

- **Part 1 (Chat Application)**: [https://pulse-chat.vercel.app/chat](https://pulse-chat.vercel.app/chat)
- **Part 2 (Landing Page)**: [https://pulse-chat.vercel.app](https://pulse-chat.vercel.app)
- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## ⚡ Features & Highlights

- **DOM Virtualization (`react-virtuoso`)**: Scalable to millions of messages with smooth 60fps rendering and zero memory leaks.
- **Real-Time WebSockets (`socket.io-client`)**: Subscribes to `message:new` and `conversation:updated` events for instant synchronization.
- **Smart User Search Engine (Name & Phone)**: Full support for searching users by display name AND phone number (with or without `+` prefixes, spaces, or country codes).
- **On-Demand Tag-Based Revalidation (`revalidateTag`)**: Event-driven ISR revalidation triggered when users send messages or create groups.
- **Hardened Security & Rate Limiting**:
  - Security headers in `next.config.js` (`Content-Security-Policy`, `X-Frame-Options DENY`, `HSTS`, `XSS Protection`).
  - Axios response interceptor for automatic `401 Unauthorized` token cleanup.
  - UI submission debouncing (300ms window) and rolling rate-limiting lockout timers.
- **Group Administration Controls**:
  - Group creation with multi-select user search and auto-close click-outside dropdown detection.
  - Group renaming, adding/removing members, promoting members to admin, and self-leaving options.
- **Intelligent Timestamps & Infinite Scroll**: Top pagination cursor fetching (`before` timestamp) with auto-scroll management (`followOutput`).
- **Dark, Light & System Mode**: Seamless zero-flicker theme switching using `next-themes`.

---

## 🛠 Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | Next.js 15.1 (App Router) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS & Glassmorphism |
| **State Management** | Zustand |
| **Virtualization** | React Virtuoso |
| **Real-time Engine** | Socket.io Client |
| **HTTP Client** | Axios (with Request/Response Interceptors) |
| **ISR & Revalidation** | Next.js `revalidateTag` & Server Route Handlers |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or later
- npm `v9.0.0` or later

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/pulse-chat.git
   cd pulse-chat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set Environment Variables (Optional):**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://frontend-task-chatapp.onrender.com/api
   NEXT_PUBLIC_SOCKET_URL=https://frontend-task-chatapp.onrender.com
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📝 Part 3 — Thought Process Write-up

### 1. Architecture, Libraries & Approach (Part 1)
- **DOM Virtualization with React Virtuoso**: Standard list rendering collapses when scrolling through thousands of chat messages due to DOM node overflow. By selecting `react-virtuoso`, we render only visible nodes in the viewport.
- **Zustand for Global State**: Redux adds unnecessary boilerplate, whereas React Context suffers from re-render cascades. Zustand provides atomic selectors and lightweight state management for active conversations and user sessions.
- **Axios Interceptors over Native Fetch**: Axios allows uniform request timeout handling, Bearer token injection, and centralized `401 Unauthorized` token invalidation.
- **Trade-offs**: Socket.io fallback reconnection logic required custom lifecycle binding in Next.js Client Providers to prevent duplicate event listeners on fast re-renders.

### 2. Creative Design Choices (Part 2)
- **Visual Aesthetic**: Crafted a glassmorphism theme using high-contrast slate color palettes, subtle ambient backlights, and smooth Framer Motion entrance animations.
- **Responsive Navigation Fix (Desktop & Mobile)**: Fixed an issue where clicking header links (`Features`, `Security`, `Architecture`, `Docs`) from the `/chat` or `/login` page failed to navigate to the landing page. Configured absolute anchor paths (`/#features`, `/#security`, `/#architecture`, `/#docs`) so navigation works seamlessly across desktop and mobile drawer menus.

---

### 3. Problems Faced & Manual Resolutions

#### A. User Search Issue (Name vs. Phone Number & `+` Sign Backend 500 Crash)
* **Problem**: Initially, user search only worked for display names. Searching by phone numbers (e.g. `+15551234100` or `01733586288`) either returned empty results or crashed the backend server with an HTTP 500 Error:
  ```json
  {
    "error": {
      "message": "Regular expression is invalid: quantifier does not follow a repeatable item",
      "code": 51091
    }
  }
  ```
* **Root Cause**: The backend API passes query parameters directly into a MongoDB regular expression (`new RegExp(q, "i")`). In regex, `+` is an unescaped quantifier. Sending `+` at the start of a query string triggered a syntax error in MongoDB. Furthermore, the backend regex query only matched display names or exact strings.
* **Manual Resolution**:
  1. **Query Regex Sanitization**: Before calling `/users/search?q=...`, raw unescaped regex quantifiers (`+`, `*`, `?`, `^`, `$`) are stripped from the HTTP GET parameter string.
  2. **Dual-Fetch Fallback Roster**: `searchUsers()` queries both `/users/search?q={cleanQuery}` and `/users/search` (full directory list) in parallel, merging and deduplicating user records by `_id`.
  3. **Digit Normalization Engine**: We implemented client-side phone number normalization (`u.phone.replace(/\D/g, '').includes(cleanDigits)`). This compares pure digits, enabling instant, accurate search results for any phone number format (e.g. `017`, `1555`, `555`, `01700000001`, `+8801700000001`, or `+15551234567`).

#### B. Landing Page Image & Animation Runtime Error
* **Problem**: Using external static images and heavy unoptimized layout animation styles caused hydration mismatches, long rendering delay errors, and browser layout shifts.
* **Solution**: Replaced heavy static images with pure CSS glassmorphism styling, hardware-accelerated Framer Motion staggered micro-animations (`initial={{ opacity: 0, y: 18 }}`), and added `suppressHydrationWarning` to the root HTML body tag.

---

### 4. SEO Optimization & Incremental Static Regeneration (ISR) Architecture

#### A. Next.js 15 App Router SEO Architecture
- **Dynamic SEO Engine & 500+ Keyword Dictionary** (`src/lib/seo-keywords.ts`): Configured dynamic metadata generators for OpenGraph, Twitter Cards, canonical tags, and structured JSON-LD `SoftwareApplication` microdata for maximum search engine indexing.

#### B. How Incremental Static Regeneration (ISR) is Used
In Next.js 15, we combine **Static Site Generation (SSG)** at build time with **On-Demand Tag-Based Revalidation (`revalidateTag`)**.

1. **Build-Time Static Pre-Rendering**:
   The landing page (`/`), login page (`/login`), and chat shell (`/chat`) are pre-rendered into static HTML (`○ Static prerendered`) during `npm run build`, providing sub-50ms First Contentful Paint (FCP) for users and search engine crawlers.

2. **On-Demand Tag Revalidation Handler (`src/app/api/revalidate/route.ts`)**:
   Instead of wasteful time-based polling (e.g., `revalidate = 60`), we built an event-driven route handler that invalidates Next.js cache tags on demand:
   ```typescript
   import { revalidateTag } from "next/cache";
   import { NextRequest, NextResponse } from "next/server";

   export async function POST(request: NextRequest) {
     const body = await request.json().catch(() => ({}));
     const tag = body.tag || "conversations";
     revalidateTag(tag);
     return NextResponse.json({ revalidated: true, tag, timestamp: Date.now() });
   }
   ```

3. **Event-Driven Triggers (`src/services/chatService.ts`)**:
   When users take actions (sending a message or creating a group), the client triggers tag revalidation:
   ```typescript
   // Message Sent -> Invalidates "messages" tag
   export async function sendMessage(conversationId: string, text: string): Promise<Message> {
     const response = await api.post<Message>("/messages", { conversationId, text });
     triggerRevalidateTag("messages");
     return response.data;
   }

   // Group Created -> Invalidates "conversations" tag
   export async function createGroup(name: string, participantIds: string[]): Promise<Conversation> {
     const response = await api.post<Conversation>("/conversations/group", { name, participantIds });
     triggerRevalidateTag("conversations");
     return response.data;
   }
   ```

4. **ISR Lifecycle Sequence**:
   ```mermaid
   sequenceDiagram
       autonumber
       actor User
       participant Browser
       participant NextJS as Next.js 15 ISR Cache
       participant API as Revalidate API (/api/revalidate)
       participant Backend as Express Backend API

       User->>Browser: Opens Landing Page / Chat App
       Browser->>NextJS: GET / (Instant Static HTML)
       NextJS-->>Browser: 200 OK (Sub-50ms SSG Cache)
       
       User->>Browser: Sends Message / Creates Group
       Browser->>Backend: POST /messages OR POST /conversations/group
       Backend-->>Browser: 200 OK (Created Data)
       
       Browser->>API: POST /api/revalidate { tag: "messages" }
       API->>NextJS: revalidateTag("messages")
       Note over NextJS: Next.js purges stale static cache entries & regenerates background static cache
   ```

---

### 5. AI Tool Usage & Manual API Testing Note

* **AI Assistance in Documentation**: AI tools (Antigravity AI Assistant / Gemini 3.6 Flash) were utilized to accelerate documentation writing, Markdown formatting, and schema structuring.
* **Manual Postman & Script Verification**: **ALL 13 REST API endpoints and WebSocket contracts were manually tested and verified using Postman and custom Node verification scripts** against the live backend server (`https://frontend-task-chatapp.onrender.com/api`).

---

### 6. Issues Encountered With API Endpoints & Workarounds

- **Token Format Consistency**: `/auth/login` returns `{ token, user }`, whereas `/auth/me` returns raw user object directly without envelope. Handled by creating normalized TypeScript interfaces.
- **Participant Data Types**: Group conversations return full participant objects (`User[]`), while direct conversations return a single `participant` object. Normalized through `useChatStore` conversation formatters.
- **Cold Start Latency**: The Render backend spins down on inactivity, causing 30s initial delays. Added friendly UI spinner and retry notifications for initial loading states.

---

## 📄 License

Distributed under the MIT License.
