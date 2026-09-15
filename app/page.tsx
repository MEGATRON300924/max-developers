import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, AppWindow, BookOpen, Boxes, ChevronRight, Code2, ExternalLink, FileKey2, Gauge, LayoutDashboard, LifeBuoy, LockKeyhole, Settings, ShieldCheck, Webhook } from "lucide-react";
import { getMaxUser } from "./lib/auth";

const nav = [
  { label: "Home", href: "/", icon: LayoutDashboard, active: true },
  { label: "Applications", href: "/applications", icon: AppWindow },
  { label: "Credentials", href: "/credentials", icon: FileKey2 },
  { label: "Activity", href: "/activity", icon: Activity },
];

const buildNav = [
  { label: "APIs", href: "/apis", icon: Code2 },
  { label: "Documentation", href: "/documentation", icon: BookOpen },
  { label: "Webhooks", href: "/webhooks", icon: Webhook },
  { label: "SDKs", href: "/sdks", icon: Boxes },
];

const manageNav = [
  { label: "Security", href: "/security", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

function Sidebar() {
  return <aside className="sidebar"><div className="brand"><div className="logo">M</div><div className="brand-copy"><div className="brand-name">MAX</div><div className="brand-sub">Developer Platform</div></div></div><nav className="nav" aria-label="Developer Platform"><div className="nav-group"><div className="nav-label">Platform</div>{nav.map(({label,href,icon:Icon,active})=><Link key={href} href={href} className={`nav-item${active?" active":""}`}><Icon strokeWidth={1.8}/><span>{label}</span></Link>)}</div><div className="nav-group"><div className="nav-label">Build</div>{buildNav.map(({label,href,icon:Icon})=><Link key={href} href={href} className="nav-item"><Icon strokeWidth={1.8}/><span>{label}</span></Link>)}</div><div className="nav-group"><div className="nav-label">Manage</div>{manageNav.map(({label,href,icon:Icon})=><Link key={href} href={href} className="nav-item"><Icon strokeWidth={1.8}/><span>{label}</span></Link>)}</div></nav><div className="sidebar-foot"><strong>MAX AI Ecosystem</strong><br/>Build experiences that connect to MAX.</div></aside>;
}

function Topbar({ user }: { user: NonNullable<Awaited<ReturnType<typeof getMaxUser>>> }) {
  const displayName = user.name || user.preferred_username || user.email || "MAX Account";
  const initial = displayName.trim().charAt(0).toUpperCase() || "M";
  return <header className="topbar"><div className="breadcrumb">Developer Platform</div><div className="account"><div className="avatar">{initial}</div><div className="account-copy"><strong>{displayName}</strong>{user.email?<span>{user.email}</span>:null}</div><Link href="/auth/logout" className="account-action" aria-label="Sign out">Sign out</Link></div></header>;
}

export default async function DeveloperHome() {
  const user = await getMaxUser();
  if (!user) redirect("/sign-in");
  return <div className="shell"><Sidebar/><div className="main"><Topbar user={user}/><main className="content"><section className="hero"><div><div className="eyebrow">MAX Developer Platform</div><h1>Build with MAX.</h1><p className="lead">Create applications, manage MAX Auth integrations, and build on the MAX AI Ecosystem.</p></div><Link className="primary" href="/applications/new">Create application</Link></section>

  <section className="grid" aria-label="Developer overview"><div className="card"><p className="card-title">Applications</p><p className="card-desc">OAuth applications connected to MAX Auth.</p><div className="metric">—</div><div className="metric-note">Manage your applications</div></div><div className="card"><p className="card-title">API access</p><p className="card-desc">MAX APIs available to your developer account.</p><div className="metric">Explore</div><div className="metric-note">Browse the API catalogue</div></div><div className="card"><p className="card-title">Platform status</p><p className="card-desc">Core MAX developer services.</p><div className="metric" style={{fontSize:22,marginTop:27}}>Operational</div><div className="metric-note">MAX Developer Platform</div></div></section>

  <section className="section"><div className="section-head"><div><h2 className="section-title">Get started</h2><p className="section-desc">Everything you need to create your first MAX integration.</p></div></div><div className="card list"><Link href="/applications/new" className="list-row"><div className="icon-box"><AppWindow size={19}/></div><div className="row-main"><div className="row-title">Create a MAX application</div><div className="row-sub">Register an OAuth client and configure your redirect URI.</div></div><ChevronRight size={17} color="var(--faint)"/></Link><Link href="/documentation" className="list-row"><div className="icon-box"><KeyRoundIcon/></div><div className="row-main"><div className="row-title">Learn about MAX Auth</div><div className="row-sub">Use Authorization Code + PKCE to let people sign in with MAX.</div></div><ChevronRight size={17} color="var(--faint)"/></Link><Link href="/documentation" className="list-row"><div className="icon-box"><BookOpen size={19}/></div><div className="row-main"><div className="row-title">Read the developer documentation</div><div className="row-sub">Guides, API references, examples and integration notes.</div></div><ChevronRight size={17} color="var(--faint)"/></Link></div></section>

  <section className="section"><div className="section-head"><div><h2 className="section-title">Developer tools</h2><p className="section-desc">Explore the foundation of the wider MAX platform.</p></div></div><div className="quick-grid"><Link href="/apis" className="quick"><Gauge/><div><strong>APIs</strong><span>Explore available API surfaces</span></div></Link><Link href="/applications" className="quick"><AppWindow/><div><strong>Applications</strong><span>OAuth clients and app settings</span></div></Link><Link href="/credentials" className="quick"><FileKey2/><div><strong>Credentials</strong><span>Keys and authentication credentials</span></div></Link><Link href="/documentation" className="quick"><LifeBuoy/><div><strong>Developer docs</strong><span>Guides and integration references</span></div></Link></div></section>

  <div className="footer">MAX Developer Platform · The MAX AI Ecosystem · <Link href="https://max-ai.name.ng" target="_blank">MAX AI <ExternalLink size={10} style={{display:"inline"}}/></Link></div></main></div></div>;
}

function KeyRoundIcon(){ return <KeyRound size={19}/>; }
