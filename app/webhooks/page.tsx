"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Check, Copy, Plus, RefreshCw, Send, ShieldCheck, Trash2, Webhook, X } from "lucide-react";

type Subscription = { eventType: string; active: boolean };
type Endpoint = { id: string; name: string; url: string; active: boolean; subscriptions: Subscription[]; delivery_count: number };

const EVENT_LABELS: Record<string, string> = {
  "webhook.test": "Test events",
  "user.created": "User created",
  "user.login": "User login",
  "oauth.consent.granted": "OAuth consent granted",
  "oauth.consent.revoked": "OAuth consent revoked",
  "oauth.client.created": "OAuth app created",
  "oauth.client.revoked": "OAuth app revoked",
  "oauth.token.revoked": "OAuth token revoked",
};

const events = Object.keys(EVENT_LABELS);

export default function WebhooksPage() {
  const [items, setItems] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<string[]>(["webhook.test"]);
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/webhooks", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Unable to load webhooks");
      setItems(data.webhooks || []);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load webhooks"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function createWebhook(e: React.FormEvent) {
    e.preventDefault(); setBusy("create"); setError(""); setMessage(""); setSecret("");
    try {
      const response = await fetch("/api/webhooks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, url, events: selected }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Unable to create webhook");
      setSecret(data.secret); setName(""); setUrl(""); setSelected(["webhook.test"]); await load(); setMessage("Webhook created. Save the signing secret now; MAX will not show it again.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create webhook"); }
    finally { setBusy(""); }
  }

  async function action(id: string, path: string, method: string, success: string) {
    setBusy(id + path); setError("");
    try {
      const response = await fetch(`/api/webhooks/${id}${path}`, { method });
      const data = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(data?.message || "Request failed");
      if (data?.secret) { setSecret(data.secret); setMessage("New signing secret generated. Save it now; it will not be shown again."); }
      else setMessage(success);
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Request failed"); }
    finally { setBusy(""); }
  }

  function toggleEvent(event: string) { setSelected((current) => current.includes(event) ? current.filter((item) => item !== event) : [...current, event]); }

  return <div className="shell">
    <aside className="sidebar"><div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div><nav className="nav"><div className="nav-group"><div className="nav-label">Build</div><Link href="/apis" className="nav-item"><Webhook/><span>APIs</span></Link><Link href="/documentation" className="nav-item"><BookOpen/><span>Documentation</span></Link><Link href="/webhooks" className="nav-item active"><Webhook/><span>Webhooks</span></Link></div></nav></aside>
    <div className="main"><header className="topbar"><div className="breadcrumb">Webhooks</div><div className="avatar">M</div></header>
      <main className="content"><div className="eyebrow">MAX events</div><div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}><div><h1>Webhooks</h1><p className="lead">Receive signed events from MAX services in your backend.</p></div><button className="primary" onClick={() => { setShowCreate(true); setSecret(""); setMessage(""); }}><Plus size={16}/> Add endpoint</button></div>
        {message && <div className="card" style={{marginTop:20,border:"1px solid rgba(16,185,129,.35)"}}><div style={{display:"flex",gap:10,alignItems:"center"}}><Check size={18}/><span>{message}</span></div>{secret && <div style={{marginTop:14,display:"flex",gap:8,alignItems:"center"}}><code style={{flex:1,overflow:"auto",padding:10,borderRadius:10,background:"rgba(127,127,127,.1)"}}>{secret}</code><button className="secondary" onClick={() => void navigator.clipboard.writeText(secret)}><Copy size={14}/> Copy</button></div>}</div>}
        {error && <div className="card" style={{marginTop:20,border:"1px solid rgba(239,68,68,.35)"}}>{error}</div>}
        {loading ? <div className="card" style={{marginTop:28}}>Loading webhook endpoints…</div> : items.length === 0 ? <section className="card" style={{marginTop:28}}><div className="icon-box"><Webhook size={20}/></div><h2 className="card-title" style={{marginTop:16}}>No webhook endpoints yet</h2><p className="card-desc">Create an endpoint to start receiving signed MAX events. Endpoint secrets are shown only when created or rotated.</p><button className="secondary" style={{marginTop:18}} onClick={() => setShowCreate(true)}><Plus size={14}/> Create endpoint</button></section> : <div style={{display:"grid",gap:14,marginTop:28}}>{items.map((item) => <section className="card" key={item.id}><div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start"}}><div><h2 className="card-title">{item.name}</h2><div style={{marginTop:6,fontFamily:"monospace",fontSize:13,overflowWrap:"anywhere"}}>{item.url}</div></div><span style={{fontSize:12,fontWeight:700}}>{item.active ? "Active" : "Disabled"}</span></div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:16}}>{item.subscriptions.map((s) => <span key={s.eventType} style={{fontSize:12,padding:"6px 9px",borderRadius:999,background:"rgba(127,127,127,.1)"}}>{EVENT_LABELS[s.eventType] || s.eventType}</span>)}</div><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:18}}><button className="secondary" disabled={!!busy} onClick={() => void action(item.id,"/test","POST","Test delivery sent.")}><Send size={14}/> Test</button><Link className="secondary" href={`/webhooks/${encodeURIComponent(item.id)}/deliveries`}>Deliveries</Link><button className="secondary" disabled={!!busy} onClick={() => void action(item.id,"/rotate-secret","POST","")}><ShieldCheck size={14}/> Rotate secret</button><button className="secondary" disabled={!!busy} onClick={() => void action(item.id,"","DELETE","Endpoint deleted.")}><Trash2 size={14}/> Delete</button><button className="secondary" onClick={() => void load()}><RefreshCw size={14}/> Refresh</button></div><div style={{marginTop:14,fontSize:12,opacity:.7}}>{item.delivery_count} delivery attempt{item.delivery_count === 1 ? "" : "s"} recorded</div></section>)}</div>}
        <div className="card" style={{marginTop:24}}><div style={{display:"flex",gap:10,alignItems:"center"}}><ShieldCheck size={18}/><strong>Webhook security</strong></div><p className="card-desc" style={{marginTop:10}}>MAX sends HTTPS POST requests with an event ID, timestamp and HMAC-SHA256 signature. Endpoint URLs are validated against local/private destinations and redirects are not followed.</p></div>
        <div className="footer"><Link href="/">← Back to dashboard</Link></div>
      </main>
    </div>
    {showCreate && <div style={{position:"fixed",inset:0,zIndex:50,background:"rgba(0,0,0,.45)",display:"grid",placeItems:"center",padding:20}}><form onSubmit={createWebhook} className="card" style={{width:"min(680px,100%)",maxHeight:"90vh",overflow:"auto",background:"var(--background,white)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h2 className="card-title">Add webhook endpoint</h2><p className="card-desc">Use an HTTPS endpoint you control.</p></div><button type="button" className="secondary" onClick={() => setShowCreate(false)}><X size={16}/></button></div><label style={{display:"block",marginTop:20,fontSize:13,fontWeight:700}}>Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="My backend" style={{display:"block",width:"100%",marginTop:8,padding:12,borderRadius:10,border:"1px solid rgba(127,127,127,.3)",background:"transparent"}}/></label><label style={{display:"block",marginTop:16,fontSize:13,fontWeight:700}}>Endpoint URL<input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/webhooks/max" style={{display:"block",width:"100%",marginTop:8,padding:12,borderRadius:10,border:"1px solid rgba(127,127,127,.3)",background:"transparent"}}/></label><div style={{marginTop:18,fontSize:13,fontWeight:700}}>Events</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8,marginTop:8}}>{events.map((event) => <button type="button" key={event} onClick={() => toggleEvent(event)} style={{textAlign:"left",padding:11,borderRadius:10,border:"1px solid rgba(127,127,127,.25)",background:selected.includes(event)?"rgba(59,130,246,.12)":"transparent"}}>{selected.includes(event)?"✓ ":""}{EVENT_LABELS[event]}</button>)}</div><div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:22}}><button type="button" className="secondary" onClick={() => setShowCreate(false)}>Cancel</button><button className="primary" disabled={busy === "create"}>{busy === "create" ? "Creating…" : "Create endpoint"}</button></div></form></div>}
  </div>;
}
