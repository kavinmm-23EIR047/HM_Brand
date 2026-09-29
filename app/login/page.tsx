"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore } from "@/components/store";
import { Lotus } from "@/components/illustrations";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/account");
    } else {
      setErrorMessage(result.message || "Failed to log in.");
    }
  };

  return (
    <InnerPage
      eyebrow="MEMBER AUTHENTICATION"
      title="Welcome Back Devotee"
      subtitle="Sign in to access your orders, sacred mandir addresses, and personalized fragrance recommendations."
    >
      <div className="mx-auto max-w-md px-4 sm:px-6 py-12">
        <div className="bg-[#FFF8E7] p-8 rounded-3xl border-2 border-[#C89B3C]/40 shadow-xl space-y-6 relative overflow-hidden">
          {/* Header Icon */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#FFF4D6] border-2 border-[#F5C84C] flex items-center justify-center text-[#A90C35] shadow-inner">
              <Lotus className="h-10 w-10" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-[#6B4226]">Sign In to Your Account</h2>
            <p className="text-xs text-[#292524]/70">Enter your registered email and password</p>
          </div>

          {/* Toggle Switch */}
          <div className="grid grid-cols-2 p-1 bg-[#F4D35E]/20 rounded-xl border border-[#C89B3C]/30 text-xs font-extrabold">
            <button
              type="button"
              className="py-2.5 rounded-lg bg-[#A90C35] text-white shadow-sm transition"
            >
              Sign In
            </button>
            <Link
              href="/signup"
              className="py-2.5 rounded-lg text-center text-[#6B4226] hover:bg-[#F4D35E]/40 transition"
            >
              Register New
            </Link>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-[#FDF2F2] border border-[#F87171] text-[#991B1B] text-xs font-semibold rounded-xl flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-[#DC2626]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#6B4226] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A90C35]/60" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-xs text-[#183C31] font-semibold rounded-xl border border-[#C89B3C]/40 focus:outline-none focus:border-[#A90C35] focus:ring-1 focus:ring-[#A90C35] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B4226]">
                  Password
                </label>
                <a href="#forgot" className="text-[10px] font-bold text-[#A90C35] hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A90C35]/60" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-xs text-[#183C31] font-semibold rounded-xl border border-[#C89B3C]/40 focus:outline-none focus:border-[#A90C35] focus:ring-1 focus:ring-[#A90C35] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#A90C35] hover:bg-[#870B2B] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="p-3 bg-white/80 rounded-xl border border-[#C89B3C]/30 text-[11px] text-[#292524]/70 space-y-1">
            <span className="font-extrabold text-[#6B4226] block">Default Admin Login:</span>
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span>admin@hmagarbattis.com</span>
              <span className="font-bold text-[#A90C35]">AdminPass123!</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#292524]/60">
              Don't have an account yet?{" "}
              <Link href="/signup" className="font-bold text-[#A90C35] hover:underline">
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </InnerPage>
  );
}
