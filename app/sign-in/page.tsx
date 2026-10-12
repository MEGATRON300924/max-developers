import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

const errors: Record<string, string> = {
  missing_client: "MAX Account sign-in is not configured yet. Add the developer OAuth client ID to the deployment environment.",
  invalid_oauth_response: "The MAX Account sign-in response could not be verified. Please try again.",
  token_exchange_failed: "MAX Account could not complete the sign-in. Please try again.",
  missing_access_token: "MAX Account did not return a valid session. Please try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ? errors[params.error] || "Sign-in could not be completed. Please try again." : null;
  const next = params.next && params.next.startsWith("/") && !params.next.startsWith("//") ? params.next : "/onboarding";
  const signInHref = `/auth/start?next=${encodeURIComponent(next)}`;\n  const returnTo = "https://developers.max-ai.name.ng/sign-in?next=%2Fonboarding";\n  const signUpHref = `https://api.max-ai.name.ng/create-account?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--bg)" }}>
      <section style={{ width: "100%", maxWidth: 430, textAlign: "center" }}>
        <div className="logo" style={{ margin: "0 auto 18px", width: 48, height: 48, borderRadius: 15, fontSize: 20 }}>M</div>
        <div className="eyebrow">MAX Developer Platform</div>
        <h1 style={{ fontSize: 30 }}>Sign in to build with MAX</h1>
        <p className="lead" style={{ margin: "12px auto 26px" }}>
          Use your MAX Account to manage applications, credentials and developer access.
        </p>
        {error ? (
          <div className="auth-error" role="alert">{error}</div>
        ) : null}
        <a href={signInHref} className="primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Continue with MAX Account <ArrowRight size={16} />
        </a>
        <p style={{ marginTop: 20, color: "var(--muted)", fontSize: 12 }}>New to MAX? <a href={signUpHref} style={{ color: "var(--blue-strong)", fontWeight: 700 }}>Create a MAX Account</a></p>\n        <div style={{ marginTop: 22, color: "var(--muted)", fontSize: 11, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
          <ShieldCheck size={14} /> Secure authentication through MAX Auth
        </div>
        <div className="footer"><Link href="/">Return to Developer Platform</Link></div>
      </section>
    </main>
  );
}
