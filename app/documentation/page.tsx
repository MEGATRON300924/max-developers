import Link from "next/link";
import { ArrowRight, BookOpen, Code2, KeyRound, ShieldCheck } from "lucide-react";

const guides = [
  { title: "Build your first MAX integration", text: "Create an application, configure OAuth, and connect MAX Account to your product." },
  { title: "MAX Auth with PKCE", text: "Understand the Authorization Code flow and why public clients should use S256 PKCE." },
  { title: "Configure redirect URIs", text: "Register the exact callback URLs MAX Auth is allowed to use after authorization." },
];

export default function DocumentationPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><BookOpen/><span>Home</span></Link><Link href="/applications" className="nav-item"><Code2/><span>Applications</span></Link><Link href="/credentials" className="nav-item"><KeyRound/><span>Credentials</span></Link></div><div className="nav-group"><div className="nav-label">Build</div><Link href="/apis" className="nav-item"><Code2/><span>APIs</span></Link><Link href="/documentation" className="nav-item active"><BookOpen/><span>Documentation</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Documentation</div><div className="avatar">M</div></header>
        <main className="content">
          <div className="eyebrow">Developer documentation</div>
          <h1>Build with MAX.</h1>
          <p className="lead">Guides and reference material for connecting your applications to the MAX AI Ecosystem.</p>

          <section className="section" style={{marginTop:32}}>
            <div className="section-head"><div><h2 className="section-title">Start here</h2><p className="section-desc">A short path from your first application to a working MAX integration.</p></div></div>
            <div className="card list">
              {guides.map((guide, index) => <div className="list-row" key={guide.title}><div className="icon-box"><span style={{fontSize:12,fontWeight:700}}>{index + 1}</span></div><div className="row-main"><div className="row-title">{guide.title}</div><div className="row-sub" style={{whiteSpace:"normal"}}>{guide.text}</div></div><ArrowRight size={17} color="var(--faint)" /></div>)}
            </div>
          </section>

          <section className="grid" style={{marginTop:16}}>
            <div className="card"><Code2 color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>API reference</h2><p className="card-desc">Browse available MAX API surfaces and their authentication requirements.</p><Link className="secondary" href="/apis" style={{marginTop:16}}>Browse APIs <ArrowRight size={13} style={{marginLeft:6}}/></Link></div>
            <div className="card"><KeyRound color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>MAX Auth</h2><p className="card-desc">OAuth 2.0 Authorization Code with S256 PKCE for MAX Account sign-in.</p><Link className="secondary" href="/applications/new" style={{marginTop:16}}>Create application <ArrowRight size={13} style={{marginLeft:6}}/></Link></div>
            <div className="card"><ShieldCheck color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Security</h2><p className="card-desc">Keep client credentials, redirect URIs, tokens and application access protected.</p></div>
          </section>

          <section className="card" style={{marginTop:16}}><div className="notice" style={{border:0,padding:0,background:"transparent"}}><BookOpen size={18}/><div><strong>Documentation is being expanded</strong><p>The current release focuses on MAX Auth and the developer platform foundation. API-specific guides, SDK examples and webhook documentation will be added as those services become available.</p></div></div></section>
          <div className="footer"><Link href="/">← Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
