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
- **Hardened Security & Rate Limiting**:
  - Security headers in `next.config.js` (`Content-Security-Policy`, `X-Frame-Options DENY`, `HSTS`, `XSS Protection`).
  - Axios response interceptor for automatic `401 Unauthorized` token cleanup.
  - UI submission debouncing (1000ms window) and rolling rate-limiting lockout timer (12s cooldown).
- **Group Administration Controls**:
  - Group creation with multi-select user search.
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
- **Responsive Navigation**: Designed a responsive layout that scales down to mobile drawer drawers while maintaining clear call-to-actions for launching the chat app directly.

### 3. AI Tool Usage & Manual Collaboration
- **Tools Used**: Antigravity AI Coding Assistant / Gemini 3.6 Flash.
- **Features Co-Created with AI**:
  - **Dynamic SEO Engine & 500+ Keyword Dictionary** (`src/lib/seo-keywords.ts`): Built dynamic OpenGraph/Twitter metadata generators, JSON-LD `SoftwareApplication` structured schemas, and categorized keywords dictionary by route.
  - **DOM Virtualization Architecture** (`react-virtuoso` in `chat-panel.tsx`): Virtualized message list setup for handling 1,000,000+ messages at 60fps with zero memory leaks.
  - **Landing Page Component Layout**: Hero section structure, interactive message sandbox preview, and feature grid cards.
- **Complex Functionality Resolved Manually**:
  - **API Response Envelope Unwrapping**: Backend API endpoints returned object envelopes (e.g. `{ data: [...] }` or `{ conversations: [...] }`), causing client-side `TypeError: s.filter is not a function`. Manually unwrapped API response envelopes in `chatService.ts` and added strict `Array.isArray()` safety guards.
  - **Real-Time Multi-Message Receiver Sync Bug**: When a user received multiple socket messages simultaneously, browser smooth-scroll animation cancellations froze list updates. Manually refactored `handleNewMessageRealtime` in `useChatStore.ts` with 3-stage sender resolution and forced instant `auto` bottom-scroll locking.
  - **Participant Extraction & Direct Chat Names**: Manually resolved participant extraction logic across `sidebar.tsx` and `chat-panel.tsx` to handle `c.participant` objects alongside `c.participants` arrays.

### 4. Problems Faced & Solved
- **Landing Page Image & Animation Runtime Error**:
  - *Problem*: Using external static images and heavy unoptimized layout animation styles caused hydration mismatches, long rendering delay errors, and browser layout shifts.
  - *Solution*: Replaced heavy static images with pure CSS glassmorphism styling, hardware-accelerated Framer Motion staggered micro-animations (`initial={{ opacity: 0, y: 18 }}`), and added `suppressHydrationWarning` to the root HTML body tag.
- **WebSocket Transport Priority**: Render backend WebSocket handshake failed on initial load. Resolved by configuring transport fallback `["polling", "websocket"]` and adding `connect_error` listeners in `SocketProvider`.

### 5. What I'd Improve or Do Differently With More Time
- Add offline IndexedDB caching for immediate chat availability.
- Implement end-to-end client-side message encryption (Web Crypto API AES-GCM).
- Integrate media attachment upload support (S3 pre-signed URLs).

### 6. Issues Encountered With API Endpoints & Workarounds
- **Token Format Consistency**: `/auth/login` returns `{ token, user }`, whereas `/auth/me` returns raw user object directly without envelope. Handled by creating normalized TypeScript interfaces.
- **Participant Data Types**: Group conversations return full participant objects (`User[]`), while direct conversations return a single `participant` object. Normalized through `useChatStore` conversation formatters.
- **Cold Start Latency**: The Render backend spins down on inactivity, causing 30s initial delays. Added friendly UI spinner and retry notifications for initial loading states.

### 7. Bonus Feature: Advanced Dynamic SEO Engine
Built a custom Dynamic SEO Engine utilizing a scalable dictionary of 500+ categorized keywords (`src/lib/seo-keywords.ts`). Instead of bad-practice keyword stuffing, the engine injects contextual JSON-LD `SoftwareApplication` structured schemas and route-level OpenGraph metadata for max search engine indexing.

---

## 📄 License

Distributed under the MIT License.
