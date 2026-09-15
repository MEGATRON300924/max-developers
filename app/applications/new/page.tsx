"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Check, CheckCircle2, CircleHelp, Copy, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";

type CreatedClient = { client?: { clientId?: string; name?: string; redirectUris?: string[]; isConfidential?: boolean }; clientSecret?: string };

export default function NewApplicationPage() {
  const [name, setName] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [confidential, setConfidential] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedClient | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  async function createApplication(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setCreated(null);
    setShowSecret(false);
    const appName = name.trim();
    const redirect = redirectUri.trim();
    if (appName.length < 2) return setError("Enter an application name.");
    try { new URL(redirect); } catch { return setError("Enter a valid HTTPS redirect URI."); }
    if (!redirect.startsWith("https://") && !redirect.startsWith("http://localhost")) return setError("Redirect URIs must use HTTPS, except localhost during development.");

    setCreating(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: appName, redirectUris: [redirect], scopes: ["openid", "profile", "email"], isConfidential: confidential }),
      });
      const data = await response.json() as CreatedClient & { message?: string };
      if (!response.ok) throw new Error(data.message || "Unable to create application.");
      setCreated(data);
      setName(""); setRedirectUri("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create application.");
    } finally { setCreating(false); }
  }

  async function copyValue(value?: string) {
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><ShieldCheck/><span>Home</span></Link><Link href="/applications" className="nav-item active"><KeyRound/><span>Applications</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Applications / New</div><div className="account"><div className="avatar">M</div></div></header>
        <main className="content">
          <div style={{marginBottom:28}}><Link href="/applications" style={{display:"inline-flex",alignItems:"center",gap:7,color:"var(--muted)",fontSize:12,fontWeight:700}}><ArrowLeft size={15}/>Applications</Link></div>
          <div className="eyebrow">MAX Auth</div><h1>Create application</h1><p className="lead">Register an OAuth application that can securely authenticate users with their MAX Account.</p>

          {error ? <div className="auth-error" style={{maxWidth:760, marginTop:22}} role="alert">{error}</div> : null}
          {created ? (
            <section className="card" style={{marginTop:24,maxWidth:760}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}><div className="icon-box"><CheckCircle2 size={19}/></div><div><h2 style={{margin:0,fontSize:17}}>Application created</h2><p className="card-desc">Your {created.client?.isConfidential ? "confidential" : "public PKCE"} OAuth application is now registered with MAX Auth.</p></div></div>
              <div style={{marginTop:22,display:"grid",gap:12}}>
                <div><div className="field-label">Client ID</div><div className="credential"><code>{created.client?.clientId || "—"}</code><button className="icon-button" onClick={() => void copyValue(created.client?.clientId)} aria-label="Copy client ID">{copied ? <Check size={15}/> : <Copy size={15}/>}</button></div></div>
                <div><div className="field-label">Redirect URI</div><div className="credential"><code>{created.client?.redirectUris?.[0] || "—"}</code></div></div>
                {created.clientSecret ? <div><div className="field-label">Client secret <span className="field-help">Shown once. Store it securely.</span></div><div className="credential"><code>{showSecret ? created.clientSecret : "•".repeat(Math.min(created.clientSecret.length, 40))}</code><button className="icon-button" onClick={() => setShowSecret((value) => !value)} aria-label="Toggle client secret visibility">{showSecret ? <EyeOff size={15}/> : <Eye size={15}/>}</button><button className="icon-button" onClick={() => void copyValue(created.clientSecret)} aria-label="Copy client secret"><Copy size={15}/></button></div></div> : null}
                <div className="notice"><ShieldCheck size={17}/><span><strong>{created.client?.isConfidential ? "Confidential client" : "Public PKCE client"}</strong><br/>{created.client?.isConfidential ? "Keep the client secret on your trusted backend only. Never ship it in browser or mobile code." : "No client secret is required. Use Authorization Code + S256 PKCE."}</span></div>
              </div>
              <div style={{display:"flex",gap:10,marginTop:20}}><Link className="primary" href="/applications">View applications</Link><button className="secondary" onClick={() => { setCreated(null); setShowSecret(false); }}>Create another</button></div>
              {copied ? <div style={{marginTop:10,fontSize:10,color:"var(--success)"}}>Copied.</div> : null}
            </section>
          ) : (
            <form onSubmit={createApplication} className="card" style={{marginTop:28,maxWidth:760}}>
              <div style={{display:"grid",gap:18}}>
                <label className="field-label">Application name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="My MAX App" style={inputStyle} required /></label>
                <label className="field-label">Redirect URI<span className="field-help">MAX Auth returns users to this exact URL after authorization. Add HTTPS for production; localhost is allowed for development.</span><input value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} placeholder="https://example.com/auth/callback" style={inputStyle} required /></label>

                <div className="field-label">Client type
                  <div className="scope-grid" style={{marginTop:8}}>
                    <label className="scope-option"><input type="radio" name="clientType" checked={!confidential} onChange={() => setConfidential(false)} /><span><strong>Public PKCE</strong><small>Browser, mobile and desktop apps. No secret in the client.</small></span></label>
                    <label className="scope-option"><input type="radio" name="clientType" checked={confidential} onChange={() => setConfidential(true)} /><span><strong>Confidential</strong><small>Server-side applications that can safely protect a client secret.</small></span></label>
                  </div>
                </div>

                <div className="notice"><KeyRound size={18}/><div><strong>{confidential ? "Confidential OAuth application" : "Public PKCE application"}</strong><p>{confidential ? "MAX Auth will issue a client secret once. Store it in server-side environment variables or a secret manager and never expose it to the browser." : "Recommended for browser and mobile applications. Authorization Code + S256 PKCE is used, so no client secret is required in the app."}</p></div></div>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:4}}><Link href="/applications" className="secondary">Cancel</Link><button disabled={creating} className="primary" type="submit">{creating ? "Creating…" : "Create application"}</button></div>
              </div>
            </form>
          )}
          <div style={{marginTop:16,color:"var(--muted)",fontSize:11,display:"flex",gap:7,alignItems:"center"}}><CircleHelp size={14}/> Scopes enabled for this application: openid, profile, email.</div>
        </main>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { display:"block", width:"100%", marginTop:7, border:"1px solid var(--border)", borderRadius:12, background:"var(--surface)", color:"var(--text)", padding:"12px 13px", outline:"none", fontSize:12 };
