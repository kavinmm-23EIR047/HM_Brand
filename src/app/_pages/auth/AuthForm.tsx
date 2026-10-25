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

  const fieldClass = "w-full rounded-xl border border-[#E2D2B9] bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-[#253B3E] outline-none transition placeholder:text-[#9B8E81] focus:border-[#A7193D] focus:ring-4 focus:ring-[#A7193D]/10";
  const labelClass = "mb-1.5 block text-xs font-bold text-[#423A34]";

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF6EB] text-[#263B3D]">
      <Navigation />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,211,137,0.32),_transparent_54%)]" />
        <section className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-[#E9D9BB] bg-[#FFFDFA] shadow-[0_24px_70px_rgba(69,51,29,0.12)]">
          <div className="h-1.5 bg-gradient-to-r from-[#173F3D] via-[#A7193D] to-[#E0B64E]" />
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="mx-auto mb-7 grid h-14 w-14 place-items-center rounded-2xl border border-[#E9D9BB] bg-[#FFF6E8] text-[#A7193D] shadow-sm">
              {registering ? <UserRound size={25} /> : <Lock size={24} />}
            </div>
            <div className="mb-8 text-center">
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#A7193D]">HM Brand · Devotee Account</p>
              <h1 className="font-brand text-3xl font-bold uppercase text-[#173F3D] sm:text-4xl">{registering ? "Create your account" : "Welcome back"}</h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6D716D]">
                {registering ? "Join the HM family for faster checkout and easy order updates." : "Sign in to view your orders, saved addresses, and account details."}
              </p>
            </div>

            {user && !registering && (
              <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#DDE9E3] bg-[#F1F8F4] px-4 py-3 text-xs">
                <span className="text-[#35594C]">Signed in as <strong>{user.fullName}</strong></span>
                <Link href={user.role === "ADMIN" ? "/admin" : "/account"} className="shrink-0 font-bold text-[#A7193D] hover:underline">Open account</Link>
              </div>
            )}

            {error && <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#F1B9C2] bg-[#FFF1F3] p-3.5 text-xs font-semibold text-[#8E1834]"><AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{error}</span></div>}
            {success && <div role="status" className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#B9DDCB] bg-[#EFFAF3] p-3.5 text-xs font-semibold text-[#216345]"><CheckCircle2 size={16} className="mt-0.5 shrink-0" /><span>{success}</span></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {registering && <div>
                <label htmlFor="auth-name" className={labelClass}>Full name</label>
                <div className="relative"><UserRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8177]" /><input id="auth-name" required minLength={2} autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Ramesh Kumar" className={fieldClass} /></div>
              </div>}

              <div>
                <label htmlFor="auth-email" className={labelClass}>Email address</label>
                <div className="relative"><Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8177]" /><input id="auth-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={fieldClass} /></div>
              </div>

              {registering && <div>
                <label htmlFor="auth-phone" className={labelClass}>Mobile phone <span className="font-normal text-[#8A8177]">(optional)</span></label>
                <div className="relative"><Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8177]" /><input id="auth-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" className={fieldClass} /></div>
              </div>}

              <div>
                <label htmlFor="auth-password" className={labelClass}>Password</label>
                <div className="relative"><Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8177]" /><input id="auth-password" type={showPassword ? "text" : "password"} required minLength={registering ? 6 : 1} autoComplete={registering ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={registering ? "Create a password" : "Enter your password"} className={`${fieldClass} pr-12`} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#81786F] hover:text-[#173F3D]">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
              </div>

              {registering && <div>
                <label htmlFor="auth-confirm-password" className={labelClass}>Confirm password</label>
                <div className="relative"><Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8177]" /><input id="auth-confirm-password" type={showConfirmPassword ? "text" : "password"} required minLength={6} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" className={`${fieldClass} pr-12`} /><button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#81786F] hover:text-[#173F3D]">{showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
              </div>}

              <button type="submit" disabled={loading} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#A7193D] px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-md shadow-[#A7193D]/15 transition hover:bg-[#86132F] disabled:cursor-wait disabled:opacity-60">
                {loading ? (registering ? "Creating account…" : "Signing in…") : <>{registering ? "Create account" : "Sign in"}<ArrowRight size={17} /></>}
              </button>
            </form>

            <div className="mt-7 border-t border-[#EEE5D8] pt-5 text-center text-sm text-[#6D716D]">
              {registering ? <>Already have an account? <Link href="/login" className="font-bold text-[#A7193D] hover:underline">Sign in here</Link></> : <>Don&apos;t have an account? <Link href="/register" className="font-bold text-[#A7193D] hover:underline">Create a new account</Link></>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
