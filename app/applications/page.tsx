"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppWindow, KeyRound, Plus, Settings2, ShieldCheck, Trash2 } from "lucide-react";

type OAuthClient = {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  scopes: string[];
  isActive: boolean;
};

type ApiResponse = { clients?: OAuthClient[]; message?: string };

export default function ApplicationsPage() {
  const [clients, setClients] = useState<OAuthClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/applications", { cache: "no-store" });
      const data = await response.json() as ApiResponse;
      if (!response.ok) throw new Error(data.message || "Unable to load applications.");
      setClients(data.clients || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load applications.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function revoke(client: OAuthClient) {
    if (!window.confirm(`Revoke “${client.name}”? Users will no longer be able to authorize this application.`)) return;
    setRevoking(client.id);
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(client.id)}`, { method: "DELETE" });
      const data = await response.json() as { message?: string };
      if (!response.ok) throw new Error(data.message || "Unable to revoke application.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to revoke application.");
    } finally { setRevoking(null); }
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav">
          <div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><AppWindow/><span>Home</span></Link><Link href="/applications" className="nav-item active"><AppWindow/><span>Applications</span></Link><Link href="/credentials" className="nav-item"><KeyRound/><span>Credentials</span></Link><Link href="/activity" className="nav-item"><ShieldCheck/><span>Activity</span></Link></div>
        </nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Applications</div><div className="account"><div className="avatar">M</div></div></header>
        <main className="content">
          <div className="hero">
            <div><div className="eyebrow">MAX Auth</div><h1>Applications</h1><p className="lead">Register and manage the applications that use MAX Account for sign-in.</p></div>
            <Link className="primary" href="/applications/new"><Plus size={16} style={{verticalAlign:"-3px", marginRight:7}} />Create application</Link>
          </div>

          {error ? <div className="auth-error" role="alert">{error}</div> : null}
          {loading ? (
            <section className="card"><div style={{height:72, borderRadius:14, background:"var(--surface-soft)"}} /></section>
          ) : clients.length ? (
            <section className="card list">
              {clients.map((client) => (
                <div className="list-row" key={client.id}>
                  <div className="icon-box"><KeyRound size={19}/></div>
                  <div className="row-main">
                    <div className="row-title">{client.name}</div>
                    <div className="row-sub" style={{fontFamily:"monospace"}}>{client.clientId}</div>
                    <div className="row-sub">Redirect: {client.redirectUris[0] || "—"}</div>
                  </div>
                  <span className="status" style={{opacity:client.isActive ? 1 : .55}}>{client.isActive ? "Active" : "Revoked"}</span>
                  <Link className="icon-button" href={`/applications/${encodeURIComponent(client.id)}`} title="Manage application" aria-label={`Manage ${client.name}`}><Settings2 size={16}/></Link>
                  {client.isActive ? <button className="icon-button" onClick={() => void revoke(client)} disabled={revoking === client.id} title="Revoke application" aria-label={`Revoke ${client.name}`}><Trash2 size={16}/></button> : null}
                </div>
              ))}
            </section>
          ) : (
            <section className="card" style={{padding:"48px 24px", textAlign:"center"}}>
              <div className="icon-box" style={{margin:"0 auto 16px", width:48, height:48}}><AppWindow size={21}/></div>
              <h2 style={{margin:0, fontSize:17}}>No applications yet</h2>
              <p className="card-desc" style={{maxWidth:430, margin:"8px auto 20px"}}>Create your first MAX application to receive an OAuth client ID and configure secure sign-in with MAX.</p>
              <Link className="primary" href="/applications/new">Create your first application</Link>
            </section>
          )}

          <div className="footer"><Link href="/">← Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
