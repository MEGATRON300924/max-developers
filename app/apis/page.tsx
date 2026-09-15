import Link from "next/link";
import { ArrowRight, BookOpen, Code2, KeyRound, LockKeyhole, ExternalLink } from "lucide-react";

const oauthEndpoints = [
  { method: "GET", path: "/oauth/authorize", description: "Start the Authorization Code + S256 PKCE flow." },
  { method: "POST", path: "/oauth/token", description: "Exchange an authorization code or refresh a token." },
  { method: "GET / POST", path: "/oauth/introspect", description: "Inspect whether an OAuth access token is active." },
  { method: "POST", path: "/oauth/revoke", description: "Revoke an OAuth access or refresh token." },
  { method: "GET", path: "/oauth/userinfo", description: "Return claims allowed by the granted OAuth scopes." },
];

const publicEndpoints = [
  { method: "GET", path: "/.well-known/openid-configuration", description: "OpenID Connect discovery metadata." },
  { method: "GET", path: "/.well-known/jwks.json", description: "Public signing keys for MAX Auth OIDC ID tokens." },
  { method: "GET", path: "/docs", description: "Interactive Swagger/OpenAPI documentation." },
];

const futureApis = [
  { name: "MAX AI", description: "AI capabilities for the MAX AI Ecosystem.", items: ["Generation", "Conversations", "Personalisation"] },
  { name: "MAX Cloud", description: "Cloud services for MAX-connected applications.", items: ["Storage", "Files", "Sync"] },
  { name: "Webhooks", description: "Signed event delivery from MAX services.", items: ["Subscriptions", "Delivery", "Signing"] },
];

export default function APIsPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><Code2/><span>Home</span></Link><Link href="/applications" className="nav-item"><Code2/><span>Applications</span></Link><Link href="/credentials" className="nav-item"><KeyRound/><span>Credentials</span></Link></div><div className="nav-group"><div className="nav-label">Build</div><Link href="/apis" className="nav-item active"><Code2/><span>APIs</span></Link><Link href="/documentation" className="nav-item"><BookOpen/><span>Documentation</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">APIs</div><div className="avatar">M</div></header>
        <main className="content">
          <div className="eyebrow">API catalogue</div><h1>MAX APIs</h1><p className="lead">The current developer platform exposes MAX Auth as the production API surface. Other MAX services remain clearly marked until their APIs are actually available.</p>

          <section className="section" style={{marginTop:32}}>
            <div className="section-head"><div><h2 className="section-title">MAX Auth</h2><p className="section-desc">Base URL: <code>https://auth.max-ai.name.ng/api/v1</code></p></div><span className="status">Available</span></div>
            <div className="card list">
              {oauthEndpoints.map((endpoint) => <div className="list-row" key={`${endpoint.method}-${endpoint.path}`}><div className="icon-box"><LockKeyhole size={18}/></div><div className="row-main"><div className="row-title"><code>{endpoint.method}</code> <code>{endpoint.path}</code></div><div className="row-sub" style={{whiteSpace:"normal"}}>{endpoint.description}</div></div></div>)}
            </div>
          </section>

          <section className="section">
            <div className="section-head"><div><h2 className="section-title">Discovery & public metadata</h2><p className="section-desc">These endpoints live at the MAX Auth host rather than under <code>/api/v1</code>.</p></div></div>
            <div className="card list">
              {publicEndpoints.map((endpoint) => <div className="list-row" key={endpoint.path}><div className="icon-box"><Code2 size={18}/></div><div className="row-main"><div className="row-title"><code>{endpoint.method}</code> <code>{endpoint.path}</code></div><div className="row-sub" style={{whiteSpace:"normal"}}>{endpoint.description}</div></div></div>)}
            </div>
          </section>

          <section className="grid" style={{marginTop:16}}>
            {futureApis.map((api) => <article className="card" key={api.name}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}><div className="icon-box"><Code2 size={19}/></div><span className="status status-muted">Coming soon</span></div><h2 className="card-title" style={{fontSize:17,marginTop:18}}>{api.name}</h2><p className="card-desc">{api.description}</p><div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:14}}>{api.items.map((item) => <code key={item} style={{padding:"7px 9px",border:"1px solid var(--border)",borderRadius:8,background:"var(--surface-soft)",fontSize:9,color:"var(--muted)"}}>{item}</code>)}</div></article>)}
          </section>

          <section className="grid" style={{marginTop:16}}>
            <div className="card"><LockKeyhole color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Authentication</h2><p className="card-desc">Use OAuth 2.0 Authorization Code with S256 PKCE. Confidential clients additionally authenticate with their client secret at the token endpoint.</p></div>
            <div className="card"><KeyRound color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Credentials</h2><p className="card-desc">Client IDs and confidential-client secrets are managed through MAX Auth. Standalone API keys are not available yet.</p><Link className="secondary" href="/credentials" style={{marginTop:16}}>View credentials <ArrowRight size={13}/></Link></div>
            <div className="card"><BookOpen color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>API reference</h2><p className="card-desc">The MAX Auth service publishes its OpenAPI/Swagger reference directly.</p><a className="secondary" href="https://auth.max-ai.name.ng/docs" target="_blank" rel="noreferrer" style={{marginTop:16}}>Open MAX Auth docs <ExternalLink size={13}/></a></div>
          </section>

          <div className="footer"><Link href="/">← Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
