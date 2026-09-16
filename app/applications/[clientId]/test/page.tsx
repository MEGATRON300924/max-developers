"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";

type OAuthClient = {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  scopes: string[];
  isActive: boolean;
};

const labels: Record<string, [string, string]> = {
  "identity:read": ["User ID", "Identify the signed-in MAX account."],
  "profile:read": ["Basic profile", "Read the user's basic MAX profile."],
  "email:read": ["Email address", "Read the user's email and verification state."],
  "memory:read": ["MAX Memory", "Request the MAX Memory data approved by the user."],
  offline_access: ["Stay signed in", "Request a refresh token for longer sessions."],
  openid: ["MAX account identity", "Request OpenID-compatible identity claims."],
  profile: ["Basic profile", "Request basic profile claims."],
  email: ["Email address", "Request email claims."],
};

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function createPkce() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const verifier = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return { verifier, challenge };
}

export default function OAuthTestPage({ params }: { params: Promise<{ clientId: string }> }) {
  const [client, setClient] = useState<OAuthClient | null>(null);
  const [id, setId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [redirectUri, setRedirectUri] = useState("");
  const [testUrl, setTestUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void params.then(({ clientId }) => {
      setId(clientId);
      return fetch(`/api/applications/${encodeURIComponent(clientId)}`, { cache: "no-store" })
        .then(async (response) => {
          const data = await response.json() as { client?: OAuthClient; message?: string };
          if (!response.ok || !data.client) throw new Error(data.message || "Unable to load application.");
          if (!mounted) return;
          setClient(data.client);
          setSelected((data.client.scopes || []).filter((scope) => ["identity:read", "profile:read", "email:read", "memory:read", "offline_access", "openid", "profile", "email"].includes(scope)));
          setRedirectUri(data.client.redirectUris?.[0] || "");
        })
        .catch((e) => mounted && setError(e instanceof Error ? e.message : "Unable to load application."))
        .finally(() => mounted && setLoading(false));
    });
    return () => { mounted = false; };
  }, [params]);

  const selectedScopes = useMemo(() => selected.filter((scope) => client?.scopes.includes(scope)), [selected, client]);

  async function buildUrl() {
    if (!client || !redirectUri) return setError("Select a registered redirect URI first.");
    if (!selectedScopes.length) return setError("Select at least one registered permission.");
    setError("");
    const { challenge } = await createPkce();
    const state = randomState();
    const query = new URLSearchParams({
      response_type: "code",
      client_id: client.clientId,
      redirect_uri: redirectUri,
      scope: selectedScopes.join(" "),
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });
    setTestUrl(`https://auth.max-ai.name.ng/api/v1/oauth/authorize?${query.toString()}`);
  }

  async function copy() {
    if (!testUrl) return;
    await navigator.clipboard?.writeText(testUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  if (loading) return <main className="content"><section className="card" style={{ height: 260 }} /></main>;
  if (!client) return <main className="content"><div className="auth-error">{error || "Application not found."}</div></main>;

  return <div className="shell"><aside className="sidebar"><div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div><nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item">Home</Link><Link href="/applications" className="nav-item active">Applications</Link></div></nav><div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br/>Build experiences that connect to MAX.</div></aside><div className="main"><header className="topbar"><div className="breadcrumb">Applications / OAuth test</div></header><main className="content"><div style={{ marginBottom: 20 }}><Link href={`/applications/${encodeURIComponent(id)}/configuration`} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 12, fontWeight: 700 }}><ArrowLeft size={15}/>Full configuration</Link></div>{error ? <div className="auth-error" role="alert">{error}</div> : null}<div className="hero"><div><div className="eyebrow">OAuth testing</div><h1>Test {client.name}</h1><p className="lead">Run the real MAX Auth authorization flow with this application's registered configuration.</p></div><span className="status">{client.isActive ? "Active" : "Revoked"}</span></div>
<section className="card" style={{ marginTop: 20 }}><div className="section-heading"><div><h2>Authorization request</h2><p>Only permissions already registered for this application can be selected.</p></div></div><div style={{ display: "grid", gap: 16, marginTop: 16 }}><label className="field-label">Redirect URI<select value={redirectUri} onChange={(e) => { setRedirectUri(e.target.value); setTestUrl(""); }} style={inputStyle}>{client.redirectUris.map((uri) => <option key={uri} value={uri}>{uri}</option>)}</select></label><div className="field-label">Permissions<div className="scope-grid" style={{ marginTop: 8 }}>{client.scopes.map((scope) => { const [title, description] = labels[scope] || [scope, "MAX OAuth permission."]; const active = selected.includes(scope); return <button type="button" key={scope} className="scope-option" onClick={() => { setSelected((current) => active ? current.filter((item) => item !== scope) : [...current, scope]); setTestUrl(""); }} style={{ textAlign: "left", border: active ? "1px solid var(--brand)" : undefined }}><span><strong>{title}</strong><small>{description}</small><code style={{ display: "block", marginTop: 5, fontSize: 10 }}>{scope}</code></span>{active ? <Check size={16}/> : null}</button>; })}</div></div><div className="notice"><ShieldCheck size={18}/><div><strong>User consent is always required</strong><p>This test opens the same MAX Auth sign-in and consent flow a real integration uses. The developer portal does not receive a user's MAX Memory or other protected data.</p></div></div><div style={{ display: "flex", justifyContent: "flex-end" }}><button className="primary" onClick={() => void buildUrl()} disabled={!client.isActive}>Generate test authorization URL</button></div></div></section>
{testUrl ? <section className="card" style={{ marginTop: 16 }}><div className="section-heading"><div><h2>Test request ready</h2><p>Open this URL to start the authorization flow. Your app must handle the registered redirect URI.</p></div></div><div className="credential" style={{ marginTop: 16 }}><code style={{ overflowWrap: "anywhere", whiteSpace: "normal" }}>{testUrl}</code><button className="icon-button" onClick={() => void copy()} aria-label="Copy test URL">{copied ? <Check size={15}/> : <Copy size={15}/>}</button></div><div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}><button className="secondary" onClick={() => void copy()}>{copied ? "Copied" : "Copy URL"}</button><a className="primary" href={testUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>Open MAX Auth <ExternalLink size={14}/></a></div></section> : null}
<section className="card" style={{ marginTop: 16 }}><div className="section-heading"><div><h2>MAX Memory</h2><p>When <code>memory:read</code> is registered and approved, the access token can call the scoped memory endpoint.</p></div></div><div className="credential" style={{ marginTop: 14 }}><code>GET https://auth.max-ai.name.ng/api/v1/oauth/memory</code><button className="icon-button" onClick={() => void navigator.clipboard?.writeText("https://auth.max-ai.name.ng/api/v1/oauth/memory")} aria-label="Copy memory endpoint"><Copy size={15}/></button></div><div className="field-help" style={{ marginTop: 8 }}>{client.scopes.includes("memory:read") ? "Registered for this application. The user must approve this permission before the token can access the endpoint." : "Not registered for this application. Add memory:read in Full configuration before requesting it."}</div></section><div className="footer"><Link href={`/applications/${encodeURIComponent(id)}/configuration`}>← Full configuration</Link><Link href="https://auth.max-ai.name.ng/developer" target="_blank">MAX Auth <ExternalLink size={12}/></Link></div></main></div></div>;
}

const inputStyle: React.CSSProperties = { width: "100%", marginTop: 7, border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)", color: "var(--text)", padding: "12px 13px", outline: "none", fontSize: 12 };
