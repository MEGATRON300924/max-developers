import Link from "next/link";
import { ArrowLeft, ExternalLink, KeyRound, ShieldCheck } from "lucide-react";

export default function NewApplicationPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><ShieldCheck/><span>Home</span></Link><Link href="/applications" className="nav-item active"><KeyRound/><span>Applications</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Applications / New</div><div className="account"><div className="avatar">M</div></div></header>
        <main className="content">
          <div style={{marginBottom:28}}><Link href="/applications" style={{display:"inline-flex",alignItems:"center",gap:7,color:"var(--muted)",fontSize:12,fontWeight:700}}><ArrowLeft size={15}/>Applications</Link></div>
          <div className="eyebrow">MAX Auth</div>
          <h1>Create application</h1>
          <p className="lead">OAuth applications are created and registered in MAX Auth. The Developer Platform automatically reads your registered MAX Auth clients.</p>

          <section className="card" style={{marginTop:28,maxWidth:760}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div className="icon-box"><KeyRound size={19}/></div>
              <div>
                <h2 style={{margin:0,fontSize:17}}>Create your OAuth client in MAX Auth</h2>
                <p className="card-desc" style={{marginTop:8}}>Register the application name, redirect URI, scopes, and client type there. Once it is created, return here and it will appear automatically under Applications.</p>
              </div>
            </div>
            <div className="notice" style={{marginTop:20}}><ShieldCheck size={18}/><div><strong>MAX Auth is the source of truth</strong><p>The Developer Platform does not create a second OAuth client. It uses the client registration already owned by your MAX Account.</p></div></div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <a className="primary" href="https://auth.max-ai.name.ng/developer" target="_blank" rel="noreferrer"><ExternalLink size={15} style={{verticalAlign:"-2px",marginRight:6}}/>Open MAX Auth Developer</a>
              <Link className="secondary" href="/applications">Back to applications</Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
