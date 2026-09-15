"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, FileKey2, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";

type OAuthClient = {
  id: string;
  clientId: string;
  name: string;
  isConfidential: boolean;
  isActive: boolean;
  createdAt?: string;
};

export default function CredentialsPage() {
  const [clients, setClients] = useState<OAuthClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function loadClients(showRefresh = false) {
    if (showRefresh) setRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/applications", { cache: "no-store" });
      const data = await response.json() as { clients?: OAuthClient[]; message?: string };
      if (!response.ok) throw new Error(data.message || "Unable to load credentials.");
      setClients(data.clients || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load credentials.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { void loadClients(); }, []);

  const active = useMemo(() => clients.filter((client) => client.isActive), [clients]);
  const confidential = active.filter((client) => client.isConfidential).length;

  async function copyClientId(clientId: string) {
    await navigator.clipboard?.writeText(clientId);
    setCopied(clientId);
    window.setTimeout(() => setCopied(null), 1600);
  }

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
          <div className="hero">
            <div><div className="eyebrow">Developer security</div><h1>Credentials</h1><p className="lead">Manage the credentials that let your applications connect to MAX.</p></div>
            <button className="secondary" onClick={() => void loadClients(true)} disabled={loading || refreshing}><RefreshCw size={14} className={refreshing ? "spin" : ""}/>{refreshing ? "Refreshing…" : "Refresh"}</button>
          </div>

          {error ? <div className="auth-error" role="alert">{error}</div> : null}

          <section className="grid" style={{marginTop:28}}>
            <div className="card"><KeyRound color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>OAuth clients</h2><p className="card-desc">Client IDs and OAuth configuration issued by MAX Auth.</p><div className="metric" style={{fontSize:22}}>{loading ? "—" : active.length}</div><div className="metric-note">active applications</div></div>
            <div className="card"><ShieldCheck color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Confidential clients</h2><p className="card-desc">Server-side OAuth clients that use a protected client secret.</p><div className="metric" style={{fontSize:22}}>{loading ? "—" : confidential}</div><div className="metric-note">secrets stored as hashes</div></div>
            <div className="card"><FileKey2 color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>MAX API keys</h2><p className="card-desc">Standalone MAX service API keys are not issued by the current MAX Auth API.</p><div className="metric" style={{fontSize:22}}>Not available</div><div className="metric-note">no mock credentials are shown</div></div>
          </section>

          <section className="section">
            <div className="section-head"><div><h2 className="section-title">OAuth credentials</h2><p className="section-desc">MAX Auth is the source of truth. Client secrets are never returned by the client list API and can only be revealed once immediately after rotation.</p></div></div>
            <div className="card list">
              {loading ? <div className="list-row"><div className="row-main"><div className="row-sub">Loading credentials…</div></div></div> : active.length ? active.map((client) => (
                <div className="list-row" key={client.id}>
                  <div className="icon-box"><KeyRound size={18}/></div>
                  <div className="row-main"><div className="row-title">{client.name}</div><div className="row-sub" style={{fontFamily:"monospace"}}>{client.clientId}</div><div className="row-sub">{client.isConfidential ? "Confidential · client secret enabled" : "Public · S256 PKCE"}</div></div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <button className="icon-button" onClick={() => void copyClientId(client.clientId)} title="Copy client ID" aria-label="Copy client ID">{copied === client.clientId ? <Check size={15}/> : <KeyRound size={15}/>}</button>
                    <Link className="secondary" href={`/applications/${encodeURIComponent(client.id)}`}>Manage <ArrowRight size={13} style={{verticalAlign:"-2px",marginLeft:5}}/></Link>
                  </div>
                </div>
              )) : <div style={{padding:"28px 18px",color:"var(--muted)",fontSize:12}}>No active OAuth applications. <Link href="/applications/new" style={{color:"var(--blue)",fontWeight:700}}>Manage applications in MAX Auth</Link>.</div>}
            </div>
          </section>

          <section className="card" style={{marginTop:16}}>
            <div className="notice" style={{border:0,padding:0,background:"transparent"}}><ShieldCheck size={18}/><div><strong>Credential security</strong><p>Public clients should use Authorization Code + S256 PKCE. Confidential client secrets belong only on trusted servers. MAX Auth stores client secrets as hashes, so the portal cannot display an existing secret. Rotating a secret invalidates the previous one immediately.</p></div></div>
          </section>

          <section className="card" style={{marginTop:16}}>
            <div className="section-heading"><div><h2>API keys are not being faked</h2><p>The MAX service API-key system does not exist in MAX Auth yet, so this portal intentionally does not generate, store, or display placeholder keys. When the service authentication layer is implemented, this section can be connected to the real backend.</p></div></div>
          </section>

          <div className="footer"><Link href="/">← Back to dashboard</Link><Link href="/applications">View applications <ArrowRight size={13}/></Link></div>
        </main>
      </div>
    </div>
  );
}
