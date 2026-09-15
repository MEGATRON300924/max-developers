import Link from "next/link";
import { AppWindow, ArrowLeft, Plus } from "lucide-react";

export default function ApplicationsPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav">
          <div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><AppWindow /><span>Home</span></Link><Link href="/applications" className="nav-item active"><AppWindow /><span>Applications</span></Link><Link href="/credentials" className="nav-item"><AppWindow /><span>Credentials</span></Link></div>
        </nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Applications</div><div className="avatar">Z</div></header>
        <main className="content">
          <div className="hero">
            <div><div className="eyebrow">MAX Auth</div><h1>Applications</h1><p className="lead">Manage the applications that use MAX Auth to sign people in.</p></div>
            <Link className="primary" href="/applications/new"><Plus size={16} style={{verticalAlign:"-3px", marginRight:7}} />Create application</Link>
          </div>
          <section className="card" style={{padding:"48px 24px", textAlign:"center"}}>
            <div className="icon-box" style={{margin:"0 auto 16px", width:48, height:48}}><AppWindow size={21}/></div>
            <h2 style={{margin:0, fontSize:17}}>No applications yet</h2>
            <p className="card-desc" style={{maxWidth:430, margin:"8px auto 20px"}}>Create your first MAX application to receive an OAuth client ID and configure secure sign-in with MAX.</p>
            <Link className="primary" href="/applications/new">Create your first application</Link>
          </section>
          <div className="footer"><Link href="/">← Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
