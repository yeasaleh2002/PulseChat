"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, User as UserIcon, Shield, Lock, Loader2, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { APP_CONFIG } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const { loginAction, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Security: Debounce & UI Rate-Limiter State
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [attemptTimestamps, setAttemptTimestamps] = useState<number[]>([]);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat");
    }
  }, [isAuthenticated, router]);

  // Lockout countdown handler
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    // 1. Check Rate-Limiter Lockout
    if (lockoutTimer > 0) {
      setFormError(`Rate limit exceeded. Please wait ${lockoutTimer}s before retrying.`);
      return;
    }

    // 2. Check Submit Debounce
    if (isDebouncing) {
      return;
    }

    // 3. Validation
    if (!phone.trim() || !name.trim()) {
      setFormError("Please enter both your phone number and name.");
      return;
    }

    if (phone.trim().length < 6) {
      setFormError("Please enter a valid phone number (at least 6 digits).");
      return;
    }

    // 4. Rate-Limiting Calculation (Max 4 attempts in rolling 30 seconds)
    const now = Date.now();
    const recentAttempts = [...attemptTimestamps.filter((ts) => now - ts < 30000), now];
    setAttemptTimestamps(recentAttempts);

    if (recentAttempts.length >= 4) {
      setLockoutTimer(12); // Lock out for 12 seconds
      setFormError("Security Rate Limit: Too many login attempts. Locked for 12 seconds.");
      return;
    }

    // 5. Apply Submit Debounce (1000ms delay window)
    setIsDebouncing(true);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setIsDebouncing(false);
    }, 1000);

    // 6. Execute Login
    const success = await loginAction(phone.trim(), name.trim());
    if (success) {
      setSuccessMessage("Login successful! Redirecting to PulseChat...");
      setTimeout(() => {
        router.push("/chat");
      }, 1000);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 blur-3xl rounded-full" />

      {/* Toast Notifications */}
      {(error || formError) && (
        <Toast
          type="error"
          message={formError || error || "Authentication error."}
          onClose={() => {
            setFormError(null);
            clearError();
          }}
        />
      )}

      {successMessage && (
        <Toast
          type="success"
          message={successMessage}
        />
      )}

      <Card className="w-full max-w-md p-8 glass-panel shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to {APP_CONFIG.name}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Enter your phone number and display name to start real-time messaging.
          </p>
        </div>

        {/* Rate Limiter Warning Banner */}
        {lockoutTimer > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Form locked due to rapid requests. Wait {lockoutTimer}s.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199 or 01711223344"
                disabled={isLoading || lockoutTimer > 0}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Display Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                disabled={isLoading || lockoutTimer > 0}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isDebouncing || lockoutTimer > 0}
            className="w-full py-3 text-sm font-semibold rounded-xl gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : isDebouncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Debouncing...
              </>
            ) : lockoutTimer > 0 ? (
              <>Locked ({lockoutTimer}s)</>
            ) : (
              <>
                Continue to Chat <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Security Footer Info */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Protected with rate limiting & Bearer token encryption</span>
        </div>
      </Card>
    </div>
  );
}
