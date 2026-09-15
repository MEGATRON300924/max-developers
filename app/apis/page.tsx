import Link from "next/link";
import { ArrowRight, BookOpen, Code2, KeyRound, LockKeyhole } from "lucide-react";

const apiGroups = [
  { name: "MAX Auth", status: "Available", description: "Identity, OAuth authorization and account access for applications using MAX Account.", endpoints: ["GET /authorize", "POST /api/v1/oauth/token", "GET /api/v1/oauth/userinfo"], href: "/documentation" },
  { name: "MAX AI", status: "Coming soon", description: "Access the MAX AI capabilities that power the MAX AI Ecosystem.", endpoints: ["AI generation", "Conversations", "Personalisation"], href: "/documentation" },
  { name: "MAX Cloud", status: "Coming soon", description: "Cloud services for applications and MAX-connected experiences.", endpoints: ["Storage", "Files", "Sync"], href: "/documentation" },
  { name: "Webhooks", status: "Coming soon", description: "Receive signed events from MAX services in your backend.", endpoints: ["Event subscriptions", "Delivery", "Signing"], href: "/documentation" },
];

export default function APIsPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div>
        <nav className="nav"><div className="nav-group"><div className="nav-label">Platform</div><Link href="/" className="nav-item"><Code2/><span>Home</span></Link><Link href="/applications" className="nav-item"><Code2/><span>Applications</span></Link><Link href="/credentials" className="nav-item"><KeyRound/><span>Credentials</span></Link></div><div className="nav-group"><div className="nav-label">Build</div><Link href="/apis" className="nav-item active"><Code2/><span>APIs</span></Link><Link href="/documentation" className="nav-item"><BookOpen/><span>Documentation</span></Link></div></nav>
        <div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br />Build experiences that connect to MAX.</div>
      </aside>
      <div className="main">
        <header className="topbar"><div className="breadcrumb">APIs</div><div className="avatar">M</div></header>
        <main className="content">
          <div className="eyebrow">API catalogue</div><h1>MAX APIs</h1><p className="lead">Explore the services that will make up the MAX developer platform. Availability is shown per API surface.</p>

          <section className="section" style={{marginTop:32}}>
            <div style={{display:"grid",gap:12}}>
              {apiGroups.map((api) => <article className="card" key={api.name}>
                <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start"}}><div className="icon-box"><Code2 size={19}/></div><span className="status" style={{opacity:api.status === "Available" ? 1 : .6}}>{api.status}</span></div>
                <h2 style={{fontSize:17,margin:"18px 0 5px",letterSpacing:"-.02em"}}>{api.name}</h2><p className="card-desc" style={{maxWidth:760}}>{api.description}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:14}}>{api.endpoints.map((endpoint) => <code key={endpoint} style={{padding:"7px 9px",border:"1px solid var(--border)",borderRadius:8,background:"var(--surface-soft)",fontSize:9,color:"var(--muted)"}}>{endpoint}</code>)}</div>
                <div style={{marginTop:16}}><Link className="secondary" href={api.href}>View documentation <ArrowRight size={13} style={{marginLeft:6}}/></Link></div>
              </article>)}
            </div>
          </section>

          <section className="grid" style={{marginTop:16}}>
            <div className="card"><LockKeyhole color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Authentication</h2><p className="card-desc">MAX Auth handles OAuth authorization and tokens for supported applications.</p></div>
            <div className="card"><KeyRound color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Credentials</h2><p className="card-desc">Application credentials and future API keys will be managed from the Credentials area.</p><Link className="secondary" href="/credentials" style={{marginTop:16}}>View credentials</Link></div>
            <div className="card"><BookOpen color="var(--blue)" size={20}/><h2 className="card-title" style={{marginTop:14}}>Guides</h2><p className="card-desc">Follow integration guides before calling a production API.</p><Link className="secondary" href="/documentation" style={{marginTop:16}}>Open docs</Link></div>
          </section>
          <div className="footer"><Link href="/">← Back to dashboard</Link></div>
        </main>
      </div>
    </div>
  );
}
