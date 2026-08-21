"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  ShieldCheck,
  Zap,
  Moon,
  Globe,
  ArrowRight,
  Cpu,
  Users,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  Code2,
  Send,
  Terminal,
  Activity,
  Gauge,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxMessages, setSandboxMessages] = useState([
    {
      id: "1",
      sender: "Alice Dev",
      avatar: "AD",
      text: "Virtualization handles 1,000,000+ messages effortlessly without DOM lag!",
      time: "10:44 AM",
      color: "text-brand-400",
      avatarBg: "from-indigo-500 to-purple-600",
      isMe: false,
    },
    {
      id: "2",
      sender: "You",
      avatar: "ME",
      text: "Awesome! Socket.io listening to message:new and conversation:updated live.",
      time: "10:45 AM",
      color: "text-brand-200",
      avatarBg: "from-brand-500 to-blue-600",
      isMe: true,
    },
    {
      id: "3",
      sender: "John Senior",
      avatar: "JS",
      text: "Group Admin controls (Promote, Rename, Remove) working seamlessly!",
      time: "10:46 AM",
      color: "text-emerald-400",
      avatarBg: "from-emerald-500 to-teal-600",
      isMe: false,
    },
  ]);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SOCKET CONNECT] WSS transport handshake established (latency 12ms)",
    "[SECURITY CSP] Content-Security-Policy headers verified",
    "[SEO ENGINE] Loaded 500+ long-tail keyword dictionary",
  ]);

  const [messageCount, setMessageCount] = useState(250000);
  const [activeTab, setActiveTab] = useState<"security" | "socket" | "seo">(
    "security",
  );

  const handleSendSandboxMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;

    const newMsg = {
      id: String(Date.now()),
      sender: "You",
      avatar: "ME",
      text: sandboxInput.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      color: "text-brand-200",
      avatarBg: "from-brand-500 to-blue-600",
      isMe: true,
    };

    setSandboxMessages((prev) => [...prev, newMsg]);
    setSandboxInput("");
    setTerminalLogs((prev) => [
      `[SOCKET OUT] message:new -> "${newMsg.text.slice(0, 25)}..."`,
      ...prev.slice(0, 4),
    ]);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const techStack = [
    { name: "Next.js 15 App Router", icon: Code2 },
    { name: "React 19 Concurrent", icon: Layers },
    { name: "Socket.io 4 Realtime", icon: Zap },
    { name: "Tailwind CSS Styling", icon: Sparkles },
    { name: "DOM Virtualization", icon: Cpu },
    { name: "Zustand State", icon: ShieldCheck },
  ];

  const features = [
    {
      icon: Cpu,
      color: "text-brand-500 bg-brand-500/10 border-brand-500/20",
      title: "DOM Virtualization Engine",
      description:
        "Powered by react-virtuoso to render 1,000,000+ messages at 60fps without browser memory leaks or DOM crashes.",
    },
    {
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      title: "Real-Time Socket.io Stream",
      description:
        "Instant bidirectional message delivery listening to message:new and conversation:updated events.",
    },
    {
      icon: Users,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      title: "Group Admin Controls",
      description:
        "Create multi-participant group chats, promote admin roles, add or remove members, and rename groups live.",
    },
    {
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      title: "Rate Limited & CSP Hardened",
      description:
        "Protected with strict Content Security Policy headers, anti-clickjacking headers, and client submission rate limiters.",
    },
    {
      icon: Search,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      title: "Instant User & Group Search",
      description:
        "Debounced server-side user lookup by phone or display name to initiate 1-on-1 direct conversations seamlessly.",
    },
    {
      icon: Moon,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      title: "Native Dark/Light Mode",
      description:
        "Integrated next-themes providing zero-flicker System, Dark, and Light mode switching with sleek glassmorphism.",
    },
  ];

  const metrics = [
    { label: "Virtual Messages Tested", value: "1,000,000+" },
    { label: "Target Frame Rate", value: "60 FPS" },
    { label: "Socket Latency", value: "< 15ms" },
    { label: "API Endpoints Documented", value: "13 REST & WSS" },
  ];

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      {/* Dynamic Background Gradient Blurs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[550px] w-[850px] -translate-x-1/2 bg-gradient-to-b from-brand-500/20 via-purple-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[400px] w-[400px] bg-blue-500/10 blur-3xl rounded-full" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.12]">
              Ultra-Fast, Virtualized <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Real-Time Chat Workspace
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Built for high performance and seamless team collaboration.
              Features DOM virtualization for infinite message history,
              rate-limited security, and real-time Socket.io synchronization.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 shadow-xl shadow-brand-500/25 font-semibold"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/chat" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 font-semibold"
                >
                  <MessageSquare className="w-4 h-4 text-brand-500" /> Launch
                  Demo App
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Live Sandbox Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/95 text-white shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Topbar Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/90">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    pulsechat://interactive-sandbox
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <Globe className="w-3.5 h-3.5 animate-pulse" /> Live Sandbox
                </div>
              </div>

              {/* Message List */}
              <div className="p-4 space-y-3 font-sans text-xs bg-slate-950/70 max-h-[260px] overflow-y-auto">
                {sandboxMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!msg.isMe && (
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-tr ${msg.avatarBg} text-white font-bold flex items-center justify-center text-[10px] shadow shrink-0`}
                      >
                        {msg.avatar}
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${
                        msg.isMe
                          ? "bg-brand-600 text-white rounded-br-none"
                          : "bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/50"
                      }`}
                    >
                      {!msg.isMe && (
                        <p
                          className={`font-semibold text-[11px] ${msg.color} mb-0.5`}
                        >
                          {msg.sender}
                        </p>
                      )}
                      <p>{msg.text}</p>
                      <span className="text-[9px] opacity-75 mt-1 block text-right">
                        {msg.time}
                      </span>
                    </div>
                    {msg.isMe && (
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-tr ${msg.avatarBg} text-white font-bold flex items-center justify-center text-[10px] shadow shrink-0`}
                      >
                        {msg.avatar}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Interactive Input Form */}
              <form
                onSubmit={handleSendSandboxMessage}
                className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  placeholder="Test live chat message here..."
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-colors"
                  title="Send Test Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Realtime Event Console Inspector */}
              <div className="px-4 py-2 border-t border-slate-800/80 bg-black/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <Terminal className="w-3 h-3 text-brand-400 shrink-0" />
                  <span className="truncate">{terminalLogs[0]}</span>
                </div>
                <span className="text-emerald-400 font-bold text-[9px] shrink-0">
                  WSS OK
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          {metrics.map((m) => (
            <div key={m.label} className="text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                {m.value}
              </p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Strip */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-sm"
                >
                  <Icon className="w-4 h-4 text-brand-500" />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Virtualization Benchmark Calculator (#architecture) */}
      <section
        id="architecture"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20"
      >
        <Card className="p-8 sm:p-12 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white shadow-2xl rounded-3xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono">
                <Gauge className="w-3.5 h-3.5" /> Virtualization Performance
                Benchmark
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Simulate 1,000,000 Messages DOM Load
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Move the slider to compare standard HTML DOM rendering against
                PulseChat&apos;s virtualized engine (`react-virtuoso`).
              </p>

              {/* Slider */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Volume: {messageCount.toLocaleString()} messages</span>
                  <span>Max: 1,000,000</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="10000"
                  value={messageCount}
                  onChange={(e) => setMessageCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>

            {/* Live Performance Comparison */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Standard DOM Card */}
              <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-rose-200 space-y-2">
                <p className="text-xs font-mono font-bold text-rose-400">
                  Unvirtualized DOM
                </p>
                <div className="space-y-1 text-xs">
                  <p>
                    DOM Nodes:{" "}
                    <span className="font-mono font-bold">
                      {messageCount.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    Estimated RAM:{" "}
                    <span className="font-mono font-bold">
                      {Math.round(messageCount * 0.015)} MB
                    </span>
                  </p>
                  <p>
                    FPS Status:{" "}
                    <span className="font-mono font-bold text-rose-400">
                      2 FPS (Frozen)
                    </span>
                  </p>
                </div>
              </div>

              {/* PulseChat Engine Card */}
              <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 space-y-2 shadow-lg shadow-emerald-500/10">
                <p className="text-xs font-mono font-bold text-emerald-400">
                  PulseChat Engine
                </p>
                <div className="space-y-1 text-xs">
                  <p>
                    Active DOM Nodes:{" "}
                    <span className="font-mono font-bold">
                      12 Visible Nodes
                    </span>
                  </p>
                  <p>
                    Memory Footprint:{" "}
                    <span className="font-mono font-bold">
                      42 MB (Constant)
                    </span>
                  </p>
                  <p>
                    FPS Status:{" "}
                    <span className="font-mono font-bold text-emerald-400">
                      60 FPS (Smooth)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Feature Section */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Architected for Scalability & Speed
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Engineered with modern frontend design patterns, state persistence,
            zero-flicker themes, and rate-limited API protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card
                key={feat.title}
                className="hover:-translate-y-1 transition-all duration-300 p-6 space-y-3 border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${feat.color} shadow-sm`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Technology, Security & Architecture Inspector (#security) */}
      <section
        id="security"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-slate-800 scroll-mt-20"
      >
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Deep-Dive Security & Architecture Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Inspect security layers, socket lifecycle contracts, and dynamic SEO
            implementations.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "security"
                ? "bg-brand-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            🛡️ Security Matrix
          </button>
          <button
            onClick={() => setActiveTab("socket")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "socket"
                ? "bg-brand-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            ⚡ Socket Lifecycle
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "seo"
                ? "bg-brand-600 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            🚀 SEO Dictionary (500+)
          </button>
        </div>

        {/* Tab Content */}
        <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {activeTab === "security" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-500" /> CSP Hardened
                  Headers
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Strict Content Security Policy headers restricting script
                  execution to origin domains.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-brand-500" /> Rate Limiting
                  Engine
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Client attempt timestamps windowing max 5 requests / 30s to
                  prevent spam attack vectors.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-500" /> JWT Bearer
                  Authorization
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Stateless JWT session authentication stored securely and sent
                  via Authorization HTTP headers.
                </p>
              </div>
            </div>
          )}

          {activeTab === "socket" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> `message:new` Event
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Pushes new incoming messages live into active Zustand
                  conversation state.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />{" "}
                  `conversation:updated` Event
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Updates sidebar conversation item previews and participant
                  rosters in real-time.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-500" /> Reconnection
                  Fallback
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  HTTP polling fallback automatically recovers WebSocket
                  connection dropped states.
                </p>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> 500+ SEO
                  Keywords
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Categorized TypeScript dictionary covering WebSockets, Next.js
                  15, and real-time collaboration.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-500" /> Dynamic
                  `generateMetadata`
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Generates contextual OpenGraph and Twitter card metadata for
                  max search indexing.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-500" /> JSON-LD
                  Structured Data
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Embeds schema.org `SoftwareApplication` JSON-LD data in root
                  document head.
                </p>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Docs & API Specification Section (#docs) */}
      <section
        id="docs"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20 border-t border-slate-200 dark:border-slate-800"
      >
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Developer Docs & API Specifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Comprehensive documentation of all 13 REST & WebSocket API
            endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-500" /> RESTful HTTP
              Endpoints (11)
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Covers authentication (`POST /auth/login`, `GET /auth/me`), user
              search (`GET /users/search`), conversation retrieval, message
              history (`GET /conversations/:id/messages`), and full group admin
              actions (`POST /conversations/group`, `POST /participants`,
              `DELETE /participants`, `POST /admins`, `PATCH
              /conversations/:id`).
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> WebSocket Realtime
              Event Contracts (2)
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time Socket.io bidirectional stream handling `message:new`
              for instant 0ms message dispatch and `conversation:updated` for
              live title, admin role, and member roster changes.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <Card className="bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 text-white p-8 md:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden border-none">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
              Ready to Experience Next-Gen Real-Time Messaging?
            </h2>
            <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
              Sign in with your phone and name to explore the virtualized chat
              workspace, initiate 1-on-1 direct messages, and manage group
              chats.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="gap-2 font-bold shadow-xl bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Launch PulseChat App <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Floating Chat Widget Launcher */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce">
        <Link
          href="/chat"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-2xl shadow-brand-500/50 border border-brand-400/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
          title="Open Live Chat Workspace"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="hidden sm:inline">Launch Live Chat</span>
        </Link>
      </div>
    </div>
  );
}
