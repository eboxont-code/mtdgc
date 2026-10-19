import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SITE_URL } from "@/lib/format";

function safePath(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : undefined;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const redirect = safePath(search["redirect"]);
    return redirect ? { redirect } : {};
  },
  head: () => ({
    meta: [
      { title: "Sign in | MTDGC" },
      { name: "description", content: "Sign in to your MTDGC account to see your orders, wishlist and support requests." },
      { property: "og:title", content: "Sign in to MTDGC" },
      { property: "og:description", content: "Access your MTDGC orders, wishlist and support requests." },
      { name: "twitter:title", content: "Sign in to MTDGC"  },
      { name: "twitter:description", content: "Access your MTDGC orders, wishlist and support requests."  },
      { property: "og:url", content: `${SITE_URL}/auth` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/auth` }],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "reset" | "recover";

function friendly(caught: unknown): string {
  const text = caught instanceof Error ? caught.message.toLowerCase() : "";
  if (text.includes("invalid login")) return "That email or password is not right. Please try again.";
  if (text.includes("not confirmed")) return "Your email is not confirmed yet. Check your inbox for the link.";
  if (text.includes("rate") || text.includes("too many")) return "Too many attempts. Please wait a few minutes and try again.";
  if (text.includes("already registered") || text.includes("already exists")) return "An account with this email already exists. Sign in instead.";
  return "Something went wrong. Please try again.";
}

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const target = redirect ?? "/account";
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    if (isRecovery) setMode("recover");
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("recover");
    });
    if (!isRecovery) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session && !window.location.hash.includes("type=recovery")) void navigate({ to: target });
      });
    }
    return () => sub.subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${target}` },
        });
        if (signUpError) throw signUpError;
        if (data.session) await navigate({ to: target });
        else setMessage("Check your email to confirm your account. The link brings you back here signed in.");
      } else if (mode === "reset") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (resetError) throw resetError;
        setMessage("If that email has an account, a reset link is on its way.");
      } else if (mode === "recover") {
        if (password.length < 8) { setError("Use at least 8 characters."); return; }
        if (password !== confirm) { setError("The two passwords do not match."); return; }
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;
        await navigate({ to: "/account" });
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await navigate({ to: target });
      }
    } catch (caught) {
      setError(friendly(caught));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}` });
    if (result.error) setError("Google sign-in did not finish. Please try again.");
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="focus:outline-none mx-auto max-w-md px-4 pb-20 pt-10">
        <h1 className="font-display text-[26px] font-medium">
          {mode === "signup" ? "Create your MTDGC account" : mode === "reset" ? "Reset your password" : "Sign in to MTDGC"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An account is optional. You can order as a guest at any time.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3" noValidate>
          {mode !== "recover" && (
            <label htmlFor="auth-email" className="block">
              <span className="font-display text-xs text-muted-foreground">Email</span>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm focus:border-primary"
              />
            </label>
          )}
          {mode !== "reset" && (
            <label htmlFor="auth-password" className="block">
              <span className="font-display text-xs text-muted-foreground">{mode === "recover" ? "New password" : "Password"}</span>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm focus:border-primary"
              />
            </label>
          )}
          {mode === "recover" && (
            <label htmlFor="auth-confirm" className="block">
              <span className="font-display text-xs text-muted-foreground">Confirm new password</span>
              <input
                id="auth-confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm focus:border-primary"
              />
            </label>
          )}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-success">{message}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? "Working" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : mode === "recover" ? "Set a new password" : "Sign in"}
          </Button>
        </form>

        <Button variant="outline" className="mt-3 w-full" onClick={google}>
          Continue with Google
        </Button>

        <div className="mt-6 space-y-2 text-sm">
          {mode !== "signin" && (
            <button className="font-display text-primary" onClick={() => setMode("signin")}>Back to sign in</button>
          )}
          {mode === "signin" && (
            <>
              <p>
                New to MTDGC?{" "}
                <button className="font-display text-primary" onClick={() => setMode("signup")}>Create an account</button>
              </p>
              <p>
                Forgot your password?{" "}
                <button className="font-display text-primary" onClick={() => setMode("reset")}>Reset it</button>
              </p>
            </>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          MTDGC will never ask for your password, OTP or payment PIN over WhatsApp or email.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
