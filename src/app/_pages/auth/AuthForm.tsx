"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, UserRound } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useStore } from "@/components/store";

type AuthMode = "login" | "register";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { loginUser, registerUser, user } = useStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const registering = mode === "register";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (registering && password !== confirmPassword) {
      setError("Your passwords do not match. Please check and try again.");
      return;
    }

    setLoading(true);
    try {
      if (registering) {
        const result = await registerUser(fullName, email, password, phone.trim() || undefined);
        if (!result.success) {
          setError(result.message || "We could not create your account. Please try again.");
          return;
        }
        setSuccess("Your account is ready. Taking you to your account page…");
        window.setTimeout(() => router.push("/account"), 700);
      } else {
        const result = await loginUser(email, password);
        if (!result.success) {
          setError(result.message || "The email or password was not recognized.");
          return;
        }
        router.push(result.role === "ADMIN" ? "/admin" : "/account");
      }
    } catch {
      setError("Could not connect to the account service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "w-full rounded-[10px] border border-brand-border bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-brand-ink outline-none transition placeholder:text-brand-slate/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary";
  const labelClass = "mb-1.5 block text-xs font-semibold text-brand-heading";

  return (
    <div className="flex min-h-screen flex-col bg-brand-surface text-brand-ink font-sans">
      <Navigation />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
        <section className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-brand-border bg-white shadow-card">
          <div className="h-1 bg-brand-primary" />
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto mb-7 grid h-14 w-14 place-items-center rounded-xl border border-brand-border bg-brand-surface-warm/50 text-brand-primary shadow-2xs">
              {registering ? <UserRound size={25} /> : <Lock size={24} />}
            </div>
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">HM Brand · Devotee Account</p>
              <h1 className="font-brand text-2xl font-bold uppercase text-brand-heading sm:text-3xl">{registering ? "Create your account" : "Welcome back"}</h1>
              <p className="mx-auto mt-2.5 max-w-sm text-xs sm:text-sm leading-relaxed text-brand-slate font-normal">
                {registering ? "Join the HM family for faster checkout and easy order updates." : "Sign in to view your orders, saved addresses, and account details."}
              </p>
            </div>

            {user && !registering && (
              <div className="mb-5 flex items-center justify-between gap-3 rounded-[10px] border border-brand-border bg-brand-positive-soft px-4 py-3 text-xs">
                <span className="text-brand-positive-dark font-medium">Signed in as <strong>{user.fullName}</strong></span>
                <Link href={user.role === "ADMIN" ? "/admin" : "/account"} className="shrink-0 font-bold text-brand-primary hover:underline">Open account</Link>
              </div>
            )}

            {error && <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-[10px] border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-brand-danger"><AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{error}</span></div>}
            {success && <div role="status" className="mb-5 flex items-start gap-2.5 rounded-[10px] border border-brand-positive-dark/20 bg-brand-positive-soft p-3.5 text-xs font-semibold text-brand-positive-dark"><CheckCircle2 size={16} className="mt-0.5 shrink-0" /><span>{success}</span></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {registering && <div>
                <label htmlFor="auth-name" className={labelClass}>Full name</label>
                <div className="relative"><UserRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" /><input id="auth-name" required minLength={2} autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Ramesh Kumar" className={fieldClass} /></div>
              </div>}

              <div>
                <label htmlFor="auth-email" className={labelClass}>Email address</label>
                <div className="relative"><Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" /><input id="auth-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={fieldClass} /></div>
              </div>

              {registering && <div>
                <label htmlFor="auth-phone" className={labelClass}>Mobile phone <span className="font-normal text-brand-slate">(optional)</span></label>
                <div className="relative"><Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" /><input id="auth-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" className={fieldClass} /></div>
              </div>}

              <div>
                <label htmlFor="auth-password" className={labelClass}>Password</label>
                <div className="relative"><Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" /><input id="auth-password" type={showPassword ? "text" : "password"} required minLength={registering ? 6 : 1} autoComplete={registering ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={registering ? "Create a password" : "Enter your password"} className={`${fieldClass} pr-12`} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-slate hover:text-brand-heading">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
              </div>

              {registering && <div>
                <label htmlFor="auth-confirm-password" className={labelClass}>Confirm password</label>
                <div className="relative"><Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" /><input id="auth-confirm-password" type={showConfirmPassword ? "text" : "password"} required minLength={6} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" className={`${fieldClass} pr-12`} /><button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-slate hover:text-brand-heading">{showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
              </div>}

              <button type="submit" disabled={loading} className="btn-primary mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand-primary px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider text-white border border-brand-accent/40 shadow-sm transition-all duration-250 hover:bg-brand-hover hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60">
                {loading ? (registering ? "Creating account…" : "Signing in…") : <>{registering ? "Create account" : "Sign in"}<ArrowRight size={17} /></>}
              </button>
            </form>

            <div className="mt-7 border-t border-brand-border pt-5 text-center text-xs sm:text-sm text-brand-slate">
              {registering ? <>Already have an account? <Link href="/login" className="font-semibold text-brand-primary hover:underline">Sign in here</Link></> : <>Don&apos;t have an account? <Link href="/register" className="font-semibold text-brand-primary hover:underline">Create a new account</Link></>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
