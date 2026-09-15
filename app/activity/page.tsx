"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowLeft, CheckCircle2, Clock3, LogIn, ShieldCheck, Smartphone, UserRound, XCircle } from "lucide-react";

type AuditLog = {
  id: string;
  action: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

const labels: Record<string, string> = {
  REGISTER: "Account created",
  LOGIN_SUCCESS: "Signed in",
  LOGIN_FAILED: "Failed sign-in",
  LOGOUT: "Signed out",
  TOKEN_REFRESH: "Session refreshed",
  PASSWORD_CHANGED: "Password changed",
  PASSWORD_RESET_REQUESTED: "Password reset requested",
  PASSWORD_RESET_COMPLETED: "Password reset completed",
  EMAIL_VERIFIED: "Email verified",
  EMAIL_VERIFICATION_SENT: "Verification email sent",
  DEVICE_TRUSTED: "Device trusted",
  DEVICE_REVOKED: "Device revoked",
  SESSION_REVOKED: "Session revoked",
  TWO_FA_ENABLED: "Two-factor authentication enabled",
  TWO_FA_DISABLED: "Two-factor authentication disabled",
  RECOVERY_CODES_GENERATED: "Recovery codes generated",
  CONNECTED_ACCOUNT_LINKED: "Connected account linked",
  CONNECTED_ACCOUNT_UNLINKED: "Connected account unlinked",
  OAUTH_CLIENT_CREATED: "OAuth application created",
  OAUTH_CONSENT_GRANTED: "OAuth access approved",
  OAUTH_CONSENT_REVOKED: "OAuth access revoked",
  PROFILE_UPDATED: "Profile updated",
  ADMIN_ACTION: "Account administration action",
};

function formatAction(action: string) {
  return labels[action] ?? action.replaceAll("_", " ").toLowerCase().replace(/^./, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function iconFor(action: string) {
  if (action.includes("LOGIN")) return <LogIn size={18} />;
  if (action.includes("OAUTH")) return <ShieldCheck size={18} />;
  if (action.includes("DEVICE") || action.includes("SESSION")) return <Smartphone size={18} />;
  if (action.includes("PROFILE")) return <UserRound size={18} />;
  if (action.includes("FAILED")) return <XCircle size={18} />;
  return <CheckCircle2 size={18} />;
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/activity", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error(body?.message || "Unable to load activity.");
        return body;
      })
      .then((body) => {
        if (active) setLogs(Array.isArray(body?.data?.logs) ? body.data.logs : []);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load activity.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const total = useMemo(() => logs.length, [logs]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><ShieldCheck/><span>Home</span></Link><Link href="/applications" className="nav-item"><Activity/><span>Applications</span></Link><Link href="/activity" className="nav-item active"><Activity/><span>Activity</span></Link></div></nav>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Activity</div><div className="avatar">M</div></header>
        <main className="content">
          <div className="eyebrow">Developer activity</div><h1>Activity</h1><p className="lead">A secure history of important MAX account and developer authorization events.</p>
          <div className="stats-grid" style={{ marginTop: 28 }}><div className="card"><div className="eyebrow">Events</div><div className="stat-value">{loading ? "—" : total}</div><div className="card-desc">Recent audit events available to this account</div></div><div className="card"><div className="eyebrow">Source</div><div className="stat-value">MAX Auth</div><div className="card-desc">Activity is read directly from the identity platform</div></div></div>
          <section className="card" style={{ marginTop: 20 }}>
            <div className="section-heading"><div><h2 className="card-title">Recent activity</h2><p className="card-desc">The newest security and OAuth events appear first.</p></div><Clock3 size={20}/></div>
            {loading && <div className="empty-state"><Activity size={22}/><strong>Loading activity…</strong><span>Fetching the latest events from MAX Auth.</span></div>}
            {!loading && error && <div className="notice"><XCircle size={18}/><div><strong>Could not load activity</strong><p>{error}</p></div></div>}
            {!loading && !error && logs.length === 0 && <div className="empty-state"><Activity size={22}/><strong>No activity yet</strong><span>Developer and security events will appear here as they happen.</span></div>}
            {!loading && !error && logs.length > 0 && <div className="activity-list">{logs.map((log) => <div className="activity-row" key={log.id}><div className="icon-box">{iconFor(log.action)}</div><div className="activity-copy"><strong>{formatAction(log.action)}</strong><span>{formatDate(log.createdAt)}</span></div><div className="activity-meta"><span>{log.ipAddress || "IP unavailable"}</span>{log.userAgent && <span className="activity-agent">{log.userAgent}</span>}</div></div>)}</div>}
          </section>
          <div className="notice" style={{ marginTop: 18 }}><ShieldCheck size={18}/><div><strong>Privacy by design</strong><p>Access tokens, refresh tokens and client secrets are never displayed in activity history.</p></div></div>
          <div className="footer"><Link href="/"><ArrowLeft size={16}/> Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
