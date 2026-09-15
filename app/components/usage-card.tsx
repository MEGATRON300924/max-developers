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

  return (
    <section className="dashboard-panel compact-panel">
      <div className="panel-head">
        <div><h2>API usage</h2><p>Real MAX Auth API activity for the last 30 days.</p></div>
      </div>
      {error ? <div className="coming-card"><AlertTriangle size={18}/><div><strong>Usage unavailable</strong><span>Analytics could not be loaded right now.</span></div></div> : !data ? <div className="coming-card"><Activity size={18}/><div><strong>Loading usage</strong><span>Fetching live request metrics.</span></div></div> : <div className="usage-mini-grid">
        <div><Gauge size={16}/><strong>{data.totalRequests.toLocaleString()}</strong><span>Requests</span></div>
        <div><AlertTriangle size={16}/><strong>{data.errorRate}%</strong><span>Error rate</span></div>
        <div><Activity size={16}/><strong>{data.averageLatencyMs} ms</strong><span>Avg latency</span></div>
      </div>}
    </section>
  );
}
