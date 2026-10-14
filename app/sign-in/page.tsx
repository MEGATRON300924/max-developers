import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

const errors: Record<string, string> = {
  missing_client: "MAX Account sign-in is not configured yet. Add the developer OAuth client ID to the deployment environment.",
  invalid_oauth_response: "The MAX Account sign-in response could not be verified. Please try again.",
  token_exchange_failed: "MAX Account could not complete the sign-in. Please try again.",
  token_exchange_server_error: "MAX Auth encountered a server error while completing sign-in. Try again shortly. If it persists, share the request ID shown here with the MAX team.",
  token_exchange_endpoint_missing: "The MAX Auth token endpoint could not be found. Check the MAX Auth API URL configured for MAX Developers.",

  token_exchange_unreachable: "MAX Auth could not be reached to finish sign-in. Please try again in a moment.",
  token_exchange_invalid_client: "MAX Auth rejected this developer application's credentials. Check that the deployed client ID matches the registered MAX Auth client, and configure MAX_AUTH_CLIENT_SECRET if the client is confidential.",
  token_exchange_invalid_grant: "The sign-in code expired or was already used. Start sign-in again and complete it in one attempt.",
  token_exchange_redirect_mismatch: "The callback URL does not match the redirect URL registered in MAX Auth. It must exactly match https://developers.max-ai.name.ng/auth/callback.",
  token_exchange_pkce_failed: "MAX Auth could not verify the sign-in challenge. Restart sign-in so a fresh security challenge is created.",
  missing_access_token: "MAX Account did not return a valid session. Please try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ? errors[params.error] || "Sign-in could not be completed. Please try again." : null;
  const requestId = params.request_id && /^[A-Za-z0-9._:-]{1,100}$/.test(params.request_id) ? params.request_id : null;
  const next = params.next && params.next.startsWith("/") && !params.next.startsWith("//") ? params.next : "/onboarding";
  const signInHref = `/auth/start?next=${encodeURIComponent(next)}`;
  const returnTo = "https://developers.max-ai.name.ng/sign-in?next=%2Fonboarding";
  const signUpHref = `https://api.max-ai.name.ng/create-account?returnTo=${encodeURIComponent(returnTo)}`;

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
          <div className="auth-error" role="alert">{error}{requestId ? <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>Request ID: <code>{requestId}</code></div> : null}</div>
        ) : null}
        <a href={signInHref} className="primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Continue with MAX Account <ArrowRight size={16} />
        </a>
        <p style={{ marginTop: 20, color: "var(--muted)", fontSize: 12 }}>New to MAX? <a href={signUpHref} style={{ color: "var(--blue-strong)", fontWeight: 700 }}>Create a MAX Account</a></p>
        <div style={{ marginTop: 22, color: "var(--muted)", fontSize: 11, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
          <ShieldCheck size={14} /> Secure authentication through MAX Auth
        </div>
        <div className="footer"><Link href="/">Return to Developer Platform</Link></div>
      </section>
    </main>
  );
}
