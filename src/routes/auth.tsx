import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SITE_URL } from "@/lib/format";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | MTDGC" },
      { name: "description", content: "Sign in to your MTDGC account to see your orders, wishlist and support requests." },
      { property: "og:title", content: "Sign in to MTDGC" },
      { property: "og:description", content: "Access your MTDGC orders, wishlist and support requests." },
      { property: "og:url", content: `${SITE_URL}/auth` },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/auth` }],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/account` },
        });
        if (signUpError) throw signUpError;
        setMessage("Check your email to confirm the account, then sign in.");
      } else if (mode === "reset") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account`,
        });
        if (resetError) throw resetError;
        setMessage("If that email has an account, a reset link is on its way.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await navigate({ to: "/account" });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setError(result.error.message);
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
          <label className="block">
            <span className="font-display text-xs text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary"
            />
          </label>
          {mode !== "reset" && (
            <label className="block">
              <span className="font-display text-xs text-muted-foreground">Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 font-display text-sm outline-none focus:border-primary"
              />
            </label>
          )}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-success">{message}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? "Working" : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}
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
