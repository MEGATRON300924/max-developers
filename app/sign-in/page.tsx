import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

const errors: Record<string, string> = {
  missing_client: "MAX Account sign-in is not configured yet. Add the developer OAuth client ID to the deployment environment.",
  invalid_oauth_response: "The MAX Account sign-in response could not be verified. Please try again.",
  token_exchange_failed: "MAX Account could not complete the sign-in. Please try again.",
  token_exchange_server_error: "MAX Auth encountered a server error while completing sign-in. Try again shortly.",
  token_exchange_endpoint_missing: "The MAX Auth token endpoint could not be found. Check the MAX Auth API URL configured for MAX Developers.",
  token_exchange_unreachable: "MAX Auth could not be reached to finish sign-in. Please try again in a moment.",
  token_exchange_invalid_client: "MAX Auth rejected this developer application's credentials. Check the deployed client ID and OAuth client configuration.",
  token_exchange_invalid_grant: "The sign-in code expired or was already used. Start sign-in again and complete it in one attempt.",
  token_exchange_redirect_mismatch: "The callback URL does not match the redirect URL registered in MAX Auth. It must exactly match https://developers.max-ai.name.ng/auth/callback.",
  token_exchange_pkce_failed: "MAX Auth could not verify the sign-in challenge. Restart sign-in so a fresh security challenge is created.",
  missing_access_token: "MAX Account did not return a valid session. Please try again.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string; request_id?: string }> }) {
  const params = await searchParams;
  const error = params.error ? errors[params.error] || "Sign-in could not be completed. Please try again." : null;
  const requestId = params.request_id && /^[A-Za-z0-9._:-]{1,100}$/.test(params.request_id) ? params.request_id : null;
  const next = params.next && params.next.startsWith("/") && !params.next.startsWith("//") && !params.next.includes("\\") ? params.next : "/dashboard";
  const signInHref = `/auth/start?next=${encodeURIComponent(next)}`;
  const returnTo = "https://developers.max-ai.name.ng/sign-in?next=%2Fdashboard";
  const signUpHref = `https://api.max-ai.name.ng/create-account?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className="auth-page auth-page-max">
      <div className="auth-ambient" aria-hidden="true" />
      <div className="auth-brand-wrap">
        <Link href="/" className="auth-brand auth-brand-light" aria-label="MAX AI for Developers home">
          <img src="https://www.max-ai.name.ng/favicon.png" alt="MAX AI" width="42" height="42" />
          <span><strong>MAX <em>Developers</em></strong><small>THE MAX AI ECOSYSTEM</small></span>
        </Link>
      </div>
      <div className="auth-center">
        <section className="auth-card auth-card-max">
          <div className="auth-card-logo"><img src="https://www.max-ai.name.ng/favicon.png" alt="MAX AI" width="44" height="44" /></div>
          <h1>{error ? "Let's get you signed in" : "Sign in with MAX Account"}</h1>
          <p className="auth-card-copy">Use your MAX Account to continue to MAX for Developers and manage your applications securely.</p>
          {error ? <div className="auth-error" role="alert">{error}{requestId ? <div className="auth-request-id">Request ID: <code>{requestId}</code></div> : null}</div> : null}
          <a href={signInHref} className="auth-continue">Continue with MAX Account <ArrowRight size={17}/></a>
          <div className="auth-divider"><span>NEW TO MAX?</span></div>
          <p className="auth-create"><span>Don&apos;t have a MAX Account?</span><a href={signUpHref}>Create account <ArrowRight size={13}/></a></p>
          <p className="auth-card-footer">You’ll be redirected to MAX Auth to verify your identity. After sign-in, you’ll return to your developer dashboard.</p>
        </section>
        <Link href="/" className="auth-back auth-back-centered"><ArrowLeft size={14}/> Back to MAX Developers</Link>
      </div>
      <footer className="auth-footer auth-footer-max">
        <span>© The MAX AI Ecosystem</span>
        <span><Link href="/privacy-policy">Privacy</Link> · <Link href="/terms-of-service">Terms</Link></span>
      </footer>
    </main>
  );
}
