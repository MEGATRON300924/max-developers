import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Fingerprint, ShieldCheck, Sparkles } from "lucide-react";

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

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string; request_id?: string }> }) {
  const params = await searchParams;
  const error = params.error ? errors[params.error] || "Sign-in could not be completed. Please try again." : null;
  const requestId = params.request_id && /^[A-Za-z0-9._:-]{1,100}$/.test(params.request_id) ? params.request_id : null;
  const next = params.next && params.next.startsWith("/") && !params.next.startsWith("//") ? params.next : "/onboarding";
  const signInHref = `/auth/start?next=${encodeURIComponent(next)}`;
  const returnTo = "https://developers.max-ai.name.ng/sign-in?next=%2Fonboarding";
  const signUpHref = `https://api.max-ai.name.ng/create-account?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className="auth-page">
      <div className="auth-ambient" aria-hidden="true" />
      <header className="auth-topbar">
        <Link href="/" className="auth-brand"><img src="/logo.svg" alt="MAX AI logo" width="38" height="38" /><span><strong>MAX AI</strong><small>FOR DEVELOPERS</small></span></Link>
        <Link href="/" className="auth-back"><ArrowLeft size={14}/> Back to website</Link>
      </header>
      <div className="auth-layout">
        <section className="auth-story">
          <div className="auth-kicker"><Sparkles size={14}/> THE MAX AI ECOSYSTEM</div>
          <h1>Your ideas deserve<br/><span>a bigger ecosystem.</span></h1>
          <p>Sign in once, then manage your MAX-connected applications and developer tools from one workspace.</p>
          <div className="auth-benefits">
            <div><span className="auth-benefit-icon"><Fingerprint size={17}/></span><span><strong>One MAX Account</strong><small>Your identity across the ecosystem.</small></span><Check size={15}/></div>
            <div><span className="auth-benefit-icon"><ShieldCheck size={17}/></span><span><strong>Security-first access</strong><small>Sign in through MAX Auth.</small></span><Check size={15}/></div>
          </div>
          <div className="auth-story-foot"><span className="auth-orb"/> Built for the next generation of MAX integrations</div>
        </section>
        <section className="auth-card">
          <div className="auth-card-logo"><img src="/logo.svg" alt="MAX AI" width="47" height="47"/></div>
          <div className="auth-card-kicker">DEVELOPER WORKSPACE</div>
          <h2>Welcome back.</h2>
          <p className="auth-card-copy">Use your MAX Account to continue to your developer workspace.</p>
          {error ? <div className="auth-error" role="alert">{error}{requestId ? <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>Request ID: <code>{requestId}</code></div> : null}</div> : null}
          <a href={signInHref} className="auth-continue">Continue with MAX Account <ArrowRight size={17}/></a>
          <div className="auth-secure"><ShieldCheck size={14}/> Secure authentication powered by MAX Auth</div>
          <div className="auth-or"><span/><small>NEW TO MAX?</small><span/></div>
          <p className="auth-create">Create your MAX Account <a href={signUpHref}>Get started <ArrowRight size={13}/></a></p>
          <div className="auth-card-footer">By continuing, you’ll be redirected to MAX Auth to securely sign in.</div>
        </section>
      </div>
      <footer className="auth-footer"><span>© The MAX AI Ecosystem</span><span>MAX AI For Developers</span><Link href="/documentation">Developer resources</Link></footer>
    </main>
  );
}
