"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Gauge } from "lucide-react";

export default function UsageCard() {
  const [data, setData] = useState<{ totalRequests: number; errorRate: number; averageLatencyMs: number } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/usage", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("usage_failed");
        const body = await response.json();
        return body?.data;
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const boxStyle = { display: "grid", gap: 3, padding: "11px 9px", border: "1px solid var(--border)", borderRadius: 11, background: "var(--surface-soft)" } as const;
  const valueStyle = { display: "block", fontSize: 16, fontWeight: 700, letterSpacing: "-.03em" } as const;
  const labelStyle = { display: "block", color: "var(--muted)", fontSize: 9 } as const;

  return <section className="dashboard-panel compact-panel"><div className="panel-head"><div><h2>API usage</h2><p>Real MAX Auth API activity for the last 30 days.</p></div></div>{error ? <div className="coming-card"><AlertTriangle size={18}/><div><strong>Usage unavailable</strong><span>Analytics could not be loaded right now.</span></div></div> : !data ? <div className="coming-card"><Activity size={18}/><div><strong>Loading usage</strong><span>Fetching live request metrics.</span></div></div> : <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 7, padding: "0 16px 16px" }}><div style={boxStyle}><Gauge size={15}/><strong style={valueStyle}>{data.totalRequests.toLocaleString()}</strong><span style={labelStyle}>Requests</span></div><div style={boxStyle}><AlertTriangle size={15}/><strong style={valueStyle}>{data.errorRate}%</strong><span style={labelStyle}>Error rate</span></div><div style={boxStyle}><Activity size={15}/><strong style={valueStyle}>{data.averageLatencyMs} ms</strong><span style={labelStyle}>Avg latency</span></div></div>}</section>;
}
