import Link from "next/link";
import { ArrowLeft, FileKey2, KeyRound, ShieldCheck } from "lucide-react";

export default function CredentialsPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><ShieldCheck/><span>Home</span></Link><Link href="/applications" className="nav-item"><FileKey2/><span>Applications</span></Link><Link href="/credentials" className="nav-item active"><KeyRound/><span>Credentials</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Credentials</div><div className="avatar">Z</div></header>
        <main className="content">
          <div className="eyebrow">Developer security</div><h1>Credentials</h1><p className="lead">Manage authentication credentials used by your MAX integrations.</p>
          <section className="grid" style={{marginTop:28}}>
            <div className="card"><KeyRound color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>OAuth clients</h2><p className="card-desc">Client IDs and OAuth configuration for MAX Auth applications.</p><div className="metric" style={{fontSize:22}}>0</div></div>
            <div className="card"><FileKey2 color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>API keys</h2><p className="card-desc">API credentials for MAX services.</p><div className="metric" style={{fontSize:22}}>Coming soon</div></div>
            <div className="card"><ShieldCheck color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Webhook secrets</h2><p className="card-desc">Signing secrets for trusted MAX events.</p><div className="metric" style={{fontSize:22}}>Coming soon</div></div>
          </section>
          <div className="footer"><Link href="/">← Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
