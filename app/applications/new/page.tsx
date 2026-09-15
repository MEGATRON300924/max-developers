import Link from "next/link";
import { ArrowLeft, CircleHelp, KeyRound, ShieldCheck } from "lucide-react";

export default function NewApplicationPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><ShieldCheck/><span>Home</span></Link><Link href="/applications" className="nav-item active"><KeyRound/><span>Applications</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">Applications / New</div><div className="avatar">Z</div></header>
        <main className="content">
          <div style={{marginBottom:28}}><Link href="/applications" style={{display:"inline-flex",alignItems:"center",gap:7,color:"var(--muted)",fontSize:12,fontWeight:700}}><ArrowLeft size={15}/>Applications</Link></div>
          <div className="eyebrow">MAX Auth</div><h1>Create application</h1><p className="lead">Register an application that can securely authenticate users with their MAX Account.</p>
          <section className="card" style={{marginTop:28,maxWidth:760}}>
            <div style={{display:"grid",gap:18}}>
              <label style={{fontSize:12,fontWeight:700}}>Application name<input aria-label="Application name" placeholder="My MAX App" style={inputStyle}/></label>
              <label style={{fontSize:12,fontWeight:700}}>Description<span style={{fontWeight:400,color:"var(--muted)",display:"block",marginTop:5}}>Tell developers what this application does.</span><textarea aria-label="Description" placeholder="A short description" style={{...inputStyle,minHeight:90,resize:"vertical"}}/></label>
              <label style={{fontSize:12,fontWeight:700}}>Website URL<input aria-label="Website URL" placeholder="https://example.com" style={inputStyle}/></label>
              <label style={{fontSize:12,fontWeight:700}}>Redirect URI<span style={{fontWeight:400,color:"var(--muted)",display:"block",marginTop:5}}>The exact URL MAX Auth returns users to after sign-in.</span><input aria-label="Redirect URI" placeholder="https://example.com/auth/callback" style={inputStyle}/></label>
              <div style={{padding:"15px 16px",border:"1px solid var(--border)",borderRadius:14,background:"var(--surface-soft)",display:"flex",gap:12,alignItems:"flex-start"}}><KeyRound size={18} color="var(--blue)"/><div><strong style={{fontSize:12}}>Public PKCE application</strong><p style={{margin:"4px 0 0",fontSize:11,color:"var(--muted)",lineHeight:1.6}}>Recommended for browser and mobile applications. No client secret is stored in your app.</p></div></div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:4}}><Link href="/applications" style={{padding:"11px 17px",fontSize:12,fontWeight:700,color:"var(--muted)"}}>Cancel</Link><button className="primary">Create application</button></div>
            </div>
          </section>
          <div style={{marginTop:16,color:"var(--muted)",fontSize:11,display:"flex",gap:7,alignItems:"center"}}><CircleHelp size={14}/> You can change application details and redirect URIs later.</div>
        </main>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display:"block", width:"100%", marginTop:7, border:"1px solid var(--border)", borderRadius:12,
  background:"var(--surface)", color:"var(--text)", padding:"12px 13px", outline:"none", fontSize:12,
};
