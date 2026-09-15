"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, Eye, EyeOff, ExternalLink, KeyRound, Save, ShieldCheck, Trash2 } from "lucide-react";

type OAuthClient = {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  scopes: string[];
  isConfidential: boolean;
  isActive: boolean;
};

const scopeLabels: Record<string, string> = {
  openid: "OpenID Connect",
  profile: "Basic profile",
  email: "Email address",
  offline_access: "Refresh tokens",
  "profile:read": "Profile read access",
  "email:read": "Email read access",
  "account:read": "Account read access",
};

export default function ApplicationDetailsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const [client, setClient] = useState<OAuthClient | null>(null);
  const [name, setName] = useState("");
  const [redirectUris, setRedirectUris] = useState<string[]>([]);
  const [scopes, setScopes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    let mounted = true;
    void params.then(({ clientId: id }) => {
      if (!mounted) return;
      setClientId(id);
      return fetch(`/api/applications/${encodeURIComponent(id)}`, { cache: "no-store" })
        .then(async (response) => {
          const data = await response.json() as { client?: OAuthClient; message?: string };
          if (!response.ok) throw new Error(data.message || "Unable to load application.");
          if (!data.client) throw new Error("Application not found.");
          if (!mounted) return;
          setClient(data.client);
          setName(data.client.name);
          setRedirectUris(data.client.redirectUris || []);
          setScopes(data.client.scopes || []);
        })
        .catch((err) => { if (mounted) setError(err instanceof Error ? err.message : "Unable to load application."); })
        .finally(() => { if (mounted) setLoading(false); });
    });
    return () => { mounted = false; };
  }, [params]);

  const availableScopes = useMemo(() => client?.scopes || [], [client]);

  async function save() {
    if (!client) return;
    const cleanName = name.trim();
    const cleanRedirects = redirectUris.map((uri) => uri.trim()).filter(Boolean);
    if (cleanName.length < 2) return setError("Enter an application name.");
    if (!cleanRedirects.length) return setError("Add at least one redirect URI.");
    try { cleanRedirects.forEach((uri) => new URL(uri)); } catch { return setError("Every redirect URI must be a valid URL."); }
    if (cleanRedirects.some((uri) => !uri.startsWith("https://") && !uri.startsWith("http://localhost") && !uri.startsWith("http://127.0.0.1"))) return setError("Production redirect URIs must use HTTPS, except localhost during development.");

    setSaving(true); setError(null);
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(client.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, redirectUris: cleanRedirects, scopes }),
      });
      const data = await response.json() as { client?: OAuthClient; message?: string };
      if (!response.ok) throw new Error(data.message || "Unable to save application.");
      if (data.client) {
        setClient((current) => current ? { ...current, ...data.client } : data.client!);
        setName(data.client.name || cleanName);
        setRedirectUris(data.client.redirectUris || cleanRedirects);
        setScopes(data.client.scopes || scopes);
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save application."); }
    finally { setSaving(false); }
  }

  async function revoke() {
    if (!client || !window.confirm(`Revoke “${client.name}”? Existing access and refresh tokens will also be revoked.`)) return;
    setRevoking(true); setError(null);
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(client.id)}`, { method: "DELETE" });
      const data = await response.json() as { message?: string; client?: OAuthClient };
      if (!response.ok) throw new Error(data.message || "Unable to revoke application.");
      setClient((current) => current ? { ...current, isActive: false } : current);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to revoke application."); }
    finally { setRevoking(false); }
  }

  async function rotateSecret() {
    if (!client?.isConfidential || !client.isActive) return;
    if (!window.confirm("Rotate this client secret? The current secret will stop working immediately.")) return;
    setRotating(true); setError(null); setNewSecret(null); setShowSecret(false);
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(client.id)}`, { method: "POST" });
      const data = await response.json() as { clientSecret?: string; message?: string };
      if (!response.ok || !data.clientSecret) throw new Error(data.message || "Unable to rotate client secret.");
      setNewSecret(data.clientSecret);
      setShowSecret(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to rotate client secret."); }
    finally { setRotating(false); }
  }

  async function copyValue(value?: string) {
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function addRedirect() { setRedirectUris((items) => [...items, ""]); }
  function removeRedirect(index: number) { setRedirectUris((items) => items.filter((_, itemIndex) => itemIndex !== index)); }
  function updateRedirect(index: number, value: string) { setRedirectUris((items) => items.map((item, itemIndex) => itemIndex === index ? value : item)); }
  function toggleScope(scope: string) { setScopes((items) => items.includes(scope) ? items.filter((item) => item !== scope) : [...items, scope]); }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><ShieldCheck/><span>Home</span></Link><Link href="/applications" className="nav-item active"><KeyRound/><span>Applications</span></Link><Link href="/credentials" className="nav-item"><KeyRound/><span>Credentials</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Applications / {client?.name || "Details"}</div><div className="account"><div className="avatar">M</div></div></header>
        <main className="content">
          <div style={{marginBottom:24}}><Link href="/applications" style={{display:"inline-flex",alignItems:"center",gap:7,color:"var(--muted)",fontSize:12,fontWeight:700}}><ArrowLeft size={15}/>Applications</Link></div>
          {error ? <div className="auth-error" role="alert">{error}</div> : null}
          {loading ? <section className="card" style={{height:220}} /> : client ? (
            <>
              <div className="hero">
                <div><div className="eyebrow">Application</div><h1>{client.name}</h1><p className="lead">Configure how this application connects to MAX Account.</p></div>
                <span className="status" style={{opacity:client.isActive ? 1 : .55}}>{client.isActive ? "Active" : "Revoked"}</span>
              </div>

              <section className="card" style={{marginTop:24}}>
                <div className="section-heading"><div><h2>OAuth configuration</h2><p>These settings are used by MAX Auth when authorizing your application.</p></div></div>
                <div className="credential" style={{marginTop:18}}><code>{client.clientId}</code><button className="icon-button" onClick={() => void copyValue(client.clientId)} title="Copy client ID" aria-label="Copy client ID">{copied ? <Check size={15}/> : <Copy size={15}/>}</button></div>
                <div className="field-help" style={{marginTop:8}}>Client ID is safe to include in your public OAuth application.</div>

                <div style={{display:"grid",gap:18,marginTop:24}}>
                  <label className="field-label">Application name<input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} disabled={!client.isActive}/></label>

                  <div className="field-label">Redirect URIs<span className="field-help">MAX Auth only redirects to URLs registered here. Production URLs must use HTTPS.</span>
                    <div style={{display:"grid",gap:9,marginTop:8}}>
                      {redirectUris.map((uri, index) => <div key={`${index}-${uri}`} style={{display:"flex",gap:8}}><input value={uri} onChange={(e) => updateRedirect(index, e.target.value)} style={inputStyle} disabled={!client.isActive}/>{redirectUris.length > 1 ? <button className="icon-button" type="button" onClick={() => removeRedirect(index)} disabled={!client.isActive} title="Remove redirect URI" aria-label="Remove redirect URI"><Trash2 size={15}/></button> : null}</div>)}
                    </div>
                    {client.isActive ? <button className="secondary" type="button" onClick={addRedirect} style={{marginTop:9}}>+ Add redirect URI</button> : null}
                  </div>

                  <div className="field-label">Allowed scopes<span className="field-help">Scopes can only be reduced from the permissions already registered for this application.</span>
                    <div className="scope-grid">
                      {availableScopes.map((scope) => <label className="scope-option" key={scope}><input type="checkbox" checked={scopes.includes(scope)} onChange={() => toggleScope(scope)} disabled={!client.isActive}/><span><strong>{scope}</strong><small>{scopeLabels[scope] || "MAX OAuth permission"}</small></span></label>)}
                    </div>
                  </div>

                  <div className="notice"><ShieldCheck size={18}/><div><strong>{client.isConfidential ? "Confidential OAuth client" : "Public PKCE OAuth client"}</strong><p>{client.isConfidential ? "This application uses a client secret and should keep it on a trusted server." : "This application does not use a client secret. Use Authorization Code + S256 PKCE for browser and mobile apps."}</p></div></div>

                  {client.isConfidential ? <div className="card" style={{padding:16,background:"var(--surface-2)"}}>
                    <div className="section-heading"><div><h2>Client secret</h2><p>Secrets are never stored or displayed by the developer portal. Rotate one only when you can update your trusted backend immediately.</p></div></div>
                    {newSecret ? <div style={{marginTop:14}}><div className="field-label">New client secret <span className="field-help">This is the only time this value is shown.</span></div><div className="credential"><code>{showSecret ? newSecret : "•".repeat(Math.min(newSecret.length, 40))}</code><button className="icon-button" onClick={() => setShowSecret((value) => !value)} aria-label="Toggle secret visibility">{showSecret ? <EyeOff size={15}/> : <Eye size={15}/>}</button><button className="icon-button" onClick={() => void copyValue(newSecret)} aria-label="Copy client secret"><Copy size={15}/></button></div></div> : null}
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}><button className="secondary" onClick={() => void rotateSecret()} disabled={!client.isActive || rotating}>{rotating ? "Rotating…" : "Rotate client secret"}</button></div>
                  </div> : null}
                </div>
                {client.isActive ? <div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}><button className="primary" onClick={() => void save()} disabled={saving}><Save size={15} style={{verticalAlign:"-2px",marginRight:7}}/>{saving ? "Saving…" : "Save changes"}</button></div> : null}
              </section>

              <section className="card danger-card" style={{marginTop:16}}>
                <div><h2>Danger zone</h2><p>Revoking this application immediately disables new authorization and invalidates its active access and refresh tokens.</p></div>
                <button className="danger-button" onClick={() => void revoke()} disabled={!client.isActive || revoking}><Trash2 size={15}/>{revoking ? "Revoking…" : "Revoke application"}</button>
              </section>

              <div className="footer"><Link href="/applications">← Back to applications</Link>{clientId ? <Link href={`/applications/${encodeURIComponent(clientId)}`}><ExternalLink size={13}/> Permalink</Link> : null}</div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { display:"block", width:"100%", marginTop:7, border:"1px solid var(--border)", borderRadius:12, background:"var(--surface)", color:"var(--text)", padding:"12px 13px", outline:"none", fontSize:12 };
