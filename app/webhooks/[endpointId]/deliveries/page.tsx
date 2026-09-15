"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, RefreshCw, ShieldCheck, XCircle } from "lucide-react";

type Delivery = {
  id: string;
  eventType: string;
  eventId: string;
  attemptCount: number;
  status: string;
  responseStatus?: number | null;
  responseBody?: string | null;
  nextAttemptAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function WebhookDeliveriesPage({ params }: { params: Promise<{ endpointId: string }> }) {
  const { endpointId } = use(params);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/webhooks/${encodeURIComponent(endpointId)}/deliveries`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Unable to load webhook deliveries.");
      setDeliveries(Array.isArray(data?.deliveries) ? data.deliveries : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load webhook deliveries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [endpointId]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Build</div><Link href="/webhooks" className="nav-item active"><ShieldCheck/><span>Webhooks</span></Link><Link href="/documentation" className="nav-item"><ShieldCheck/><span>Documentation</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Webhooks / Deliveries</div><div className="avatar">M</div></header>
        <main className="content">
          <Link href="/webhooks" style={{display:"inline-flex",alignItems:"center",gap:7,color:"var(--muted)",fontSize:12,fontWeight:700}}><ArrowLeft size={15}/> Webhooks</Link>
          <div className="hero" style={{marginTop:22}}>
            <div><div className="eyebrow">Delivery history</div><h1>Webhook deliveries</h1><p className="lead">Inspect the latest signed delivery attempts, responses and retry state for this endpoint.</p></div>
            <button className="secondary" onClick={() => void load()} disabled={loading}><RefreshCw size={14}/>{loading ? "Refreshing…" : "Refresh"}</button>
          </div>

          {error ? <div className="auth-error" role="alert">{error}</div> : null}
          <section className="card" style={{marginTop:24}}>
            <div className="notice" style={{marginBottom:18}}><ShieldCheck size={18}/><div><strong>Delivery security</strong><p>Payloads and response bodies are shown for debugging. Never paste secrets or access tokens into webhook payloads.</p></div></div>
            {loading ? <div className="empty-state"><Clock3 size={22}/><strong>Loading deliveries…</strong><span>Fetching the latest delivery attempts.</span></div> : deliveries.length === 0 ? <div className="empty-state"><Clock3 size={22}/><strong>No deliveries yet</strong><span>Send a test event or wait for a subscribed MAX event.</span></div> : <div className="list">{deliveries.map((delivery) => { const ok = delivery.status === "delivered"; const failed = delivery.status === "failed"; return <div className="list-row" key={delivery.id}><div className="icon-box">{ok ? <CheckCircle2 size={18}/> : failed ? <XCircle size={18}/> : <Clock3 size={18}/>}</div><div className="row-main"><div className="row-title">{delivery.eventType} <span className="status" style={{marginLeft:8,background:ok?"#ecfdf3":failed?"var(--danger-soft)":"var(--surface-soft)",color:ok?"var(--success)":failed?"var(--danger)":"var(--muted)"}}>{delivery.status}</span></div><div className="row-sub" style={{whiteSpace:"normal"}}>Event {delivery.eventId} · Attempt {delivery.attemptCount} · HTTP {delivery.responseStatus ?? "—"}</div><div className="row-sub" style={{whiteSpace:"normal"}}>Created {formatDate(delivery.createdAt)} · Delivered {formatDate(delivery.deliveredAt)}{delivery.nextAttemptAt ? ` · Next retry ${formatDate(delivery.nextAttemptAt)}` : ""}</div>{delivery.responseBody ? <details style={{marginTop:8}}><summary style={{fontSize:11,cursor:"pointer"}}>Response</summary><pre style={{marginTop:7,padding:10,overflowX:"auto",borderRadius:9,background:"var(--surface-soft)",fontSize:10,whiteSpace:"pre-wrap"}}>{delivery.responseBody}</pre></details> : null}</div></div>; })}</div>}
          </section>
          <div className="footer"><Link href="/webhooks">← Back to webhooks</Link></div>
        </main>
      </div>
    </div>
  );
}
