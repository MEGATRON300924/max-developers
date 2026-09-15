"use client";

import Link from "next/link";
import { ArrowLeft, Bell, ExternalLink, ShieldCheck, UserRound } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Manage</div><Link href="/" className="nav-item"><UserRound/><span>Dashboard</span></Link><Link href="/security" className="nav-item"><ShieldCheck/><span>Security</span></Link><Link href="/settings" className="nav-item active"><Bell/><span>Settings</span></Link></div></nav>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Settings</div><div className="avatar">M</div></header>
        <main className="content">
          <div className="eyebrow">Developer preferences</div><h1>Settings</h1><p className="lead">Manage your developer account through the MAX identity platform.</p>
          <section className="grid" style={{ marginTop: 28 }}>
            <div className="card"><UserRound color="var(--blue)" size={20}/><h2 className="card-title" style={{ marginTop: 14 }}>MAX account</h2><p className="card-desc">Your developer identity, profile, password and account details are managed by MAX Auth.</p><a className="button secondary" href="https://api.max-ai.name.ng" target="_blank" rel="noreferrer" style={{ display: "inline-flex", marginTop: 16, textDecoration: "none" }}>Open MAX Auth <ExternalLink size={15}/></a></div>
            <div className="card"><ShieldCheck color="var(--blue)" size={20}/><h2 className="card-title" style={{ marginTop: 14 }}>Security</h2><p className="card-desc">Review OAuth access and security activity from the Developer Platform.</p><Link className="button secondary" href="/security" style={{ display: "inline-flex", marginTop: 16, textDecoration: "none" }}>Open Security</Link></div>
            <div className="card"><Bell color="var(--blue)" size={20}/><h2 className="card-title" style={{ marginTop: 14 }}>Notifications</h2><p className="card-desc">Notification preferences will be added when MAX notification controls are available.</p><div className="badge" style={{ display: "inline-flex", marginTop: 16 }}>Coming soon</div></div>
          </section>
          <div className="notice" style={{ marginTop: 18 }}><ShieldCheck size={18}/><div><strong>Single source of truth</strong><p>MAX Developers does not duplicate account credentials or security settings. Authentication and account security remain controlled by MAX Auth.</p></div></div>
          <div className="footer"><Link href="/"><ArrowLeft size={16}/> Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
