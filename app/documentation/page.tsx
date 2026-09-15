import Link from "next/link";
import { ArrowRight, BookOpen, Code2, ExternalLink, KeyRound, ShieldCheck } from "lucide-react";

const baseUrl = "https://auth.max-ai.name.ng/api/v1";

const sections = [
  ["getting-started", "Getting Started"],
  ["authentication", "Authentication"],
  ["oauth", "OAuth"],
  ["api-reference", "API Reference"],
  ["errors", "Errors"],
  ["rate-limits", "Rate Limits"],
  ["security", "Security"],
  ["changelog", "Changelog"],
];

const scopes = [
  ["openid", "Request OpenID Connect identity information and an ID token."],
  ["profile", "Basic profile claims such as name, username and picture."],
  ["email", "Email address and email verification status."],
  ["offline_access", "Request a refresh token for continued access."],
  ["profile:read", "Read profile claims through UserInfo."],
  ["email:read", "Read email claims through UserInfo."],
  ["account:read", "Request account-level read access."],
];

function Code({ children }: { children: string }) {
  return (
    <pre style={{ margin: "14px 0 0", padding: 16, overflowX: "auto", borderRadius: 12, background: "var(--surface-2, #f6f7f9)", border: "1px solid var(--border)", fontSize: 12, lineHeight: 1.65, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
      <code>{children}</code>
    </pre>
  );
}

function Endpoint({ method, path, description }: { method: string; path: string; description: string }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".04em", padding: "4px 7px", borderRadius: 6, background: "var(--blue)", color: "white" }}>{method}</span>
        <code style={{ fontSize: 13 }}>{path}</code>
      </div>
      <p className="card-desc" style={{ marginTop: 7 }}>{description}</p>
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav">
          <div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><BookOpen/><span>Home</span></Link><Link href="/applications" className="nav-item"><Code2/><span>Applications</span></Link><Link href="/credentials" className="nav-item"><KeyRound/><span>Credentials</span></Link></div>
          <div className="nav-group"><div className="nav-label">Build</div><Link href="/apis" className="nav-item"><Code2/><span>APIs</span></Link><Link href="/documentation" className="nav-item active"><BookOpen/><span>Documentation</span></Link></div>
        </nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>

      <div className="main">
        <header className="topbar"><div className="breadcrumb">Documentation</div><div className="avatar">M</div></header>
        <main className="content">
          <div className="eyebrow">Developer documentation</div>
          <h1>Build with MAX.</h1>
          <p className="lead">Connect your application to MAX Account using the real OAuth 2.0 and OpenID Connect endpoints available today.</p>

          <div className="notice" style={{ marginTop: 24 }}>
            <BookOpen size={18}/>
            <div><strong>Current platform scope</strong><p>These docs cover MAX Auth, OAuth 2.0 Authorization Code + S256 PKCE, OpenID Connect, and the developer platform. MAX AI APIs, webhooks and SDKs are not documented as available until they are actually released.</p></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 220px", gap: 28, alignItems: "start", marginTop: 30 }}>
            <div>
              <section id="getting-started" className="card" style={{ scrollMarginTop: 90 }}>
                <div className="eyebrow">01 · Start here</div><h2 className="card-title" style={{ fontSize: 24, marginTop: 8 }}>Getting Started</h2>
                <p className="card-desc" style={{ whiteSpace: "normal" }}>The shortest path to a MAX Account integration is to register an OAuth application, use the authorization endpoint, exchange the returned code, and call UserInfo with the access token.</p>
                <div className="grid" style={{ marginTop: 18 }}>
                  <div className="card" style={{ boxShadow: "none" }}><strong>1. Register</strong><p className="card-desc">Create and configure your application in MAX Auth Developer settings. Choose public PKCE for clients that cannot safely keep a secret.</p></div>
                  <div className="card" style={{ boxShadow: "none" }}><strong>2. Authorize</strong><p className="card-desc">Redirect the user to <code>/oauth/authorize</code> with an exact registered redirect URI, state and S256 PKCE challenge.</p></div>
                  <div className="card" style={{ boxShadow: "none" }}><strong>3. Exchange</strong><p className="card-desc">Send the authorization code and verifier to <code>/oauth/token</code>. Confidential clients also authenticate with their client secret.</p></div>
                  <div className="card" style={{ boxShadow: "none" }}><strong>4. Use</strong><p className="card-desc">Send the returned Bearer access token to <code>/oauth/userinfo</code>, or use introspection when your backend needs token state.</p></div>
                </div>
                <p style={{ marginTop: 18 }}><Link className="secondary" href="/applications">Manage applications <ArrowRight size={13} style={{ marginLeft: 6 }}/></Link></p>
              </section>

              <section id="authentication" className="card" style={{ marginTop: 16, scrollMarginTop: 90 }}>
                <div className="eyebrow">02 · Authentication</div><h2 className="card-title" style={{ fontSize: 24, marginTop: 8 }}>MAX OAuth authentication</h2>
                <p className="card-desc" style={{ whiteSpace: "normal" }}>MAX Auth uses OAuth 2.0 Authorization Code with S256 PKCE. Access tokens are opaque Bearer tokens, not JWTs. Confidential clients additionally authenticate at the token endpoint with a client secret.</p>
                <div style={{ marginTop: 18, padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}><strong>Base URL</strong><div style={{ marginTop: 8 }}><code>{baseUrl}</code></div></div>
                <Code>{`Authorization: Bearer YOUR_ACCESS_TOKEN

GET ${baseUrl}/oauth/userinfo`}</Code>
                <p className="card-desc" style={{ marginTop: 12 }}>Never put an access token or confidential client secret in browser-visible source, URLs, screenshots or logs.</p>
              </section>

              <section id="oauth" className="card" style={{ marginTop: 16, scrollMarginTop: 90 }}>
                <div className="eyebrow">03 · OAuth</div><h2 className="card-title" style={{ fontSize: 24, marginTop: 8 }}>Authorization Code + S256 PKCE</h2>
                <p className="card-desc" style={{ whiteSpace: "normal" }}>MAX requires <code>response_type=code</code>, a non-empty <code>state</code>, and S256 PKCE. Redirect URIs must exactly match one registered on the application; production redirect URIs must use HTTPS.</p>
                <Code>{`GET ${baseUrl}/oauth/authorize?
  client_id=max_client_YOUR_CLIENT_ID&
  redirect_uri=https%3A%2F%2Fexample.com%2Fauth%2Fcallback&
  response_type=code&
  scope=openid%20profile%20email&
  state=YOUR_RANDOM_STATE&
  code_challenge=YOUR_S256_CODE_CHALLENGE&
  code_challenge_method=S256`}</Code>
                <h3 className="card-title" style={{ marginTop: 24 }}>Exchange the code</h3>
                <Code>{`POST ${baseUrl}/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTHORIZATION_CODE&
redirect_uri=https%3A%2F%2Fexample.com%2Fauth%2Fcallback&
client_id=max_client_YOUR_CLIENT_ID&
code_verifier=YOUR_CODE_VERIFIER`}</Code>
                <p className="card-desc" style={{ marginTop: 12 }}>For a confidential client, authenticate the token request with HTTP Basic using <code>client_id:client_secret</code>, or provide <code>client_id</code> and <code>client_secret</code> in the request body.</p>
                <Code>{`{
  "access_token": "opaque-access-token",
  "refresh_token": "opaque-refresh-token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile email",
  "id_token": "..."
}`}</Code>
                <h3 className="card-title" style={{ marginTop: 24 }}>Refresh</h3>
                <Code>{`POST ${baseUrl}/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=YOUR_REFRESH_TOKEN&
client_id=max_client_YOUR_CLIENT_ID`}</Code>
                <p className="card-desc" style={{ marginTop: 12 }}>Refresh token rotation is enabled: the previous refresh token is revoked when a new pair is issued.</p>

                <h3 className="card-title" style={{ marginTop: 24 }}>Scopes</h3>
                <div className="card list" style={{ marginTop: 10 }}>
                  {scopes.map(([name, description]) => <div className="list-row" key={name}><div className="row-main"><div className="row-title"><code>{name}</code></div><div className="row-sub" style={{ whiteSpace: "normal" }}>{description}</div></div></div>)}
                </div>
              </section>

              <section id="api-reference" className="card" style={{ marginTop: 16, scrollMarginTop: 90 }}>
                <div className="eyebrow">04 · Reference</div><h2 className="card-title" style={{ fontSize: 24, marginTop: 8 }}>API Reference</h2>
                <p className="card-desc" style={{ whiteSpace: "normal" }}>These are the OAuth and OpenID Connect endpoints currently exposed by MAX Auth.</p>
                <Endpoint method="GET" path="/oauth/authorize" description="Starts the Authorization Code flow. Requires an exact registered redirect URI, state and S256 PKCE challenge." />
                <Endpoint method="POST" path="/oauth/token" description="Exchanges an authorization code or refresh token for an access-token pair." />
                <Endpoint method="POST / GET" path="/oauth/introspect" description="Checks whether a Bearer access token is active. The token may be supplied as Authorization: Bearer or as the token request value." />
                <Endpoint method="POST" path="/oauth/revoke" description="Revokes an access or refresh token for the authenticated OAuth client." />
                <Endpoint method="GET" path="/oauth/userinfo" description="Returns the authenticated user's claims permitted by the access token scopes." />
                <Endpoint method="GET" path="/.well-known/openid-configuration" description="Public OpenID Connect discovery metadata, including authorization, token, UserInfo, introspection, revocation and JWKS endpoints." />
                <Endpoint method="GET" path="/.well-known/jwks.json" description="Public JSON Web Key Set when OIDC signing keys are configured." />
                <Endpoint method="GET" path="/docs" description="Interactive Swagger UI for the MAX Auth API." />
                <div style={{ marginTop: 18 }}><a className="secondary" href="https://auth.max-ai.name.ng/docs" target="_blank" rel="noreferrer">Open Swagger docs <ExternalLink size={13} style={{ marginLeft: 6 }}/></a></div>
              </section>

              <section id="errors" className="card" style={{ marginTop: 16, scrollMarginTop: 90 }}>
                <div className="eyebrow">05 · Errors</div><h2 className="card-title" style={{ fontSize: 24, marginTop: 8 }}>Error handling</h2>
                <p className="card-desc" style={{ whiteSpace: "normal" }}>MAX Auth returns structured errors for known application failures. The stable error code is the field your integration should use for programmatic handling.</p>
                <Code>{`{
  "success": false,
  "error": {
    "code": "INVALID_GRANT",
    "message": "Invalid or expired authorization code"
  }
}`}</Code>
                <div className="card list" style={{ marginTop: 16 }}>
                  {["INVALID_CLIENT — OAuth client is invalid or client authentication failed.", "INVALID_GRANT — Authorization or refresh token grant is invalid or expired.", "INVALID_REDIRECT_URI — Redirect URI does not exactly match the registered URI.", "PKCE_REQUIRED — S256 PKCE or its verifier is missing.", "INVALID_SCOPE — Requested scope is invalid or not allowed for the client.", "STATE_REQUIRED — Authorization request did not include state.", "UNSUPPORTED_GRANT_TYPE — Token request used an unsupported grant type.", "INVALID_TOKEN — Supplied OAuth access token is invalid.", "RATE_LIMITED — Too many requests were received during the rate-limit window."].map((item) => <div className="list-row" key={item}><div className="row-sub" style={{ whiteSpace: "normal" }}>{item}</div></div>)}
                </div>
              </section>

              <section id="rate-limits" className="card" style={{ marginTop: 16, scrollMarginTop: 90 }}>
                <div className="eyebrow">06 · Rate limits</div><h2 className="card-title" style={{ fontSize: 24, marginTop: 8 }}>Rate Limits</h2>
                <p className="card-desc" style={{ whiteSpace: "normal" }}>MAX Auth applies a global rate limiter to the API. The default configuration is <strong>100 requests per 15 minutes</strong>. Deployments can override these values through environment configuration, so treat the response headers as authoritative for the active deployment.</p>
                <p className="card-desc" style={{ marginTop: 12 }}>Login, registration and sensitive account actions also have stricter protection. When a limit is reached, the API returns HTTP <code>429</code> with the <code>RATE_LIMITED</code> or endpoint-specific error code.</p>
              </section>

              <section id="security" className="card" style={{ marginTop: 16, scrollMarginTop: 90 }}>
                <div className="eyebrow">07 · Security</div><h2 className="card-title" style={{ fontSize: 24, marginTop: 8 }}>Security requirements</h2>
                <div className="card list" style={{ marginTop: 14 }}>
                  {[
                    ["Use S256 PKCE", "Generate a high-entropy verifier and derive the S256 challenge. MAX Auth rejects authorization requests that do not use S256."],
                    ["Protect state", "Use a cryptographically random state value and verify it on your callback to prevent authorization-response injection."],
                    ["Match redirects exactly", "Register the full callback URI and send that same value during authorization and token exchange."],
                    ["Protect secrets", "Confidential client secrets are hashed server-side and are only returned when first created or rotated. Store them in a server-side secret manager."],
                    ["Use HTTPS", "Production redirect URIs must use HTTPS. Never send OAuth codes, tokens or client secrets over an insecure production connection."],
                    ["Treat tokens as credentials", "Keep access and refresh tokens out of URLs, client-side logs and public repositories. Revoke compromised credentials immediately."],
                  ].map(([title, text]) => <div className="list-row" key={title}><ShieldCheck size={18} color="var(--blue)"/><div className="row-main"><div className="row-title">{title}</div><div className="row-sub" style={{ whiteSpace: "normal" }}>{text}</div></div></div>)}
                </div>
              </section>

              <section id="changelog" className="card" style={{ marginTop: 16, scrollMarginTop: 90 }}>
                <div className="eyebrow">08 · Changelog</div><h2 className="card-title" style={{ fontSize: 24, marginTop: 8 }}>Developer platform changelog</h2>
                <div className="card list" style={{ marginTop: 14 }}>
                  <div className="list-row"><div className="row-main"><div className="row-title">September 2026 — Developer platform foundation</div><div className="row-sub" style={{ whiteSpace: "normal" }}>Added the MAX Developers dashboard, OAuth application management, credential visibility, API catalogue and this documentation experience.</div></div></div>
                  <div className="list-row"><div className="row-main"><div className="row-title">September 2026 — MAX Auth OAuth hardening</div><div className="row-sub" style={{ whiteSpace: "normal" }}>OAuth now documents and enforces exact redirect URI matching, S256 PKCE, confidential-client authentication, token rotation and structured OAuth errors.</div></div></div>
                  <div className="list-row"><div className="row-main"><div className="row-title">Coming next</div><div className="row-sub" style={{ whiteSpace: "normal" }}>Additional MAX AI API surfaces, SDKs and webhooks will be documented only when those services are available.</div></div></div>
                </div>
              </section>
            </div>

            <aside style={{ position: "sticky", top: 84, display: "grid", gap: 6 }}>
              <div className="nav-label" style={{ padding: "0 8px 8px" }}>On this page</div>
              {sections.map(([id, label], index) => <a key={id} href={`#${id}`} style={{ padding: "7px 8px", borderRadius: 8, color: "var(--muted)", fontSize: 12, textDecoration: "none" }}>{String(index + 1).padStart(2, "0")} · {label}</a>)}
            </aside>
          </div>

          <div className="footer"><Link href="/">← Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
