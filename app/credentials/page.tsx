"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, FileKey2, KeyRound, ShieldCheck } from "lucide-react";

type OAuthClient = { id: string; clientId: string; name: string; isConfidential: boolean; isActive: boolean };

export default function CredentialsPage() {
  const [clients, setClients] = useState<OAuthClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/applications", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as { clients?: OAuthClient[]; message?: string };
        if (!response.ok) throw new Error(data.message || "Unable to load credentials.");
        setClients(data.clients || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load credentials."))
      .finally(() => setLoading(false));
  }, []);

  const active = clients.filter((client) => client.isActive);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><ShieldCheck/><span>Home</span></Link><Link href="/applications" className="nav-item"><FileKey2/><span>Applications</span></Link><Link href="/credentials" className="nav-item active"><KeyRound/><span>Credentials</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Credentials</div><div className="avatar">M</div></header>
        <main className="content">
          <div className="eyebrow">Developer security</div><h1>Credentials</h1><p className="lead">Your MAX OAuth credentials are managed through your applications.</p>
          {error ? <div className="auth-error" role="alert">{error}</div> : null}

          <section className="grid" style={{marginTop:28}}>
            <div className="card"><KeyRound color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>OAuth applications</h2><p className="card-desc">Client IDs and OAuth configuration for MAX Auth applications.</p><div className="metric" style={{fontSize:22}}>{loading ? "—" : active.length}</div><div className="metric-note">active applications</div></div>
            <div className="card"><FileKey2 color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>API keys</h2><p className="card-desc">API credentials for MAX services will be managed here.</p><div className="metric" style={{fontSize:22}}>Coming soon</div></div>
            <div className="card"><ShieldCheck color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Webhook secrets</h2><p className="card-desc">Signing secrets for trusted MAX events will be managed here.</p><div className="metric" style={{fontSize:22}}>Coming soon</div></div>
          </section>

          <section className="section">
            <div className="section-head"><div><h2 className="section-title">OAuth client IDs</h2><p className="section-desc">Client IDs are public identifiers. Public PKCE clients do not have a client secret.</p></div></div>
            <div className="card list">
              {loading ? <div className="list-row"><div className="row-main"><div className="row-sub">Loading credentials…</div></div></div> : active.length ? active.map((client) => (
                <div className="list-row" key={client.id}>
                  <div className="icon-box"><KeyRound size={18}/></div>
                  <div className="row-main"><div className="row-title">{client.name}</div><div className="row-sub" style={{fontFamily:"monospace"}}>{client.clientId}</div></div>
                  <Link className="secondary" href={`/applications/${encodeURIComponent(client.id)}`}>Manage <ArrowRight size={13} style={{verticalAlign:"-2px",marginLeft:5}}/></Link>
                </div>
              )) : <div style={{padding:"28px 18px",color:"var(--muted)",fontSize:12}}>No active OAuth applications. <Link href="/applications/new" style={{color:"var(--blue)",fontWeight:700}}>Create one</Link>.</div>}
            </div>
          </section>

          <section className="card" style={{marginTop:16}}>
            <div className="notice" style={{border:0,padding:0,background:"transparent"}}><ShieldCheck size={18}/><div><strong>Keep your OAuth flow secure</strong><p>Browser and mobile applications should use Authorization Code + S256 PKCE. Never put a confidential client secret in frontend code, source control, or a mobile bundle.</p></div></div>
          </section>
          <div className="footer"><Link href="/">← Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
