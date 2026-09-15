import Link from "next/link";
import {
  Activity,
  AppWindow,
  BookOpen,
  Boxes,
  ChevronRight,
  Code2,
  ExternalLink,
  FileKey2,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LockKeyhole,
  Settings,
  ShieldCheck,
  Webhook,
} from "lucide-react";

const nav = [
  { label: "Home", href: "/", icon: LayoutDashboard, active: true },
  { label: "Applications", href: "/applications", icon: AppWindow },
  { label: "Credentials", href: "/credentials", icon: FileKey2 },
  { label: "Activity", href: "/activity", icon: Activity },
];

const buildNav = [
  { label: "APIs", icon: Code2 },
  { label: "Documentation", icon: BookOpen },
  { label: "Webhooks", icon: Webhook },
  { label: "SDKs", icon: Boxes },
];

const manageNav = [
  { label: "Security", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">M</div>
        <div className="brand-copy">
          <div className="brand-name">MAX</div>
          <div className="brand-sub">Developer Platform</div>
        </div>
      </div>

      <nav className="nav" aria-label="Developer Platform">
        <div className="nav-group">
          <div className="nav-label">Platform</div>
          {nav.map(({ label, href, icon: Icon, active }) => (
            <Link key={href} href={href} className={`nav-item${active ? " active" : ""}`}>
              <Icon strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-group">
          <div className="nav-label">Build</div>
          {buildNav.map(({ label, icon: Icon }) => (
            <Link key={label} href="#" className="nav-item" aria-label={`${label} coming soon`}>
              <Icon strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-group">
          <div className="nav-label">Manage</div>
          {manageNav.map(({ label, icon: Icon }) => (
            <Link key={label} href="#" className="nav-item">
              <Icon strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="sidebar-foot">
        <strong>MAX AI Ecosystem</strong><br />
        Build experiences that connect to MAX.
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumb">Developer Platform</div>
      <div className="account">
        <div className="avatar">Z</div>
        <div className="account-copy">
          <strong>MAX Account</strong>
        </div>
      </div>
    </header>
  );
}

export default function DeveloperHome() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="content">
          <section className="hero">
            <div>
              <div className="eyebrow">MAX Developer Platform</div>
              <h1>Build with MAX.</h1>
              <p className="lead">
                Create applications, manage MAX Auth integrations, and get ready to build on the MAX AI Ecosystem.
              </p>
            </div>
            <Link className="primary" href="/applications/new">Create application</Link>
          </section>

          <section className="grid" aria-label="Developer overview">
            <div className="card">
              <p className="card-title">Applications</p>
              <p className="card-desc">OAuth applications connected to MAX Auth.</p>
              <div className="metric">0</div>
              <div className="metric-note">No applications yet</div>
            </div>
            <div className="card">
              <p className="card-title">API access</p>
              <p className="card-desc">MAX APIs available to your developer account.</p>
              <div className="metric">Coming soon</div>
              <div className="metric-note">The API catalogue is being prepared</div>
            </div>
            <div className="card">
              <p className="card-title">Platform status</p>
              <p className="card-desc">Core MAX developer services.</p>
              <div className="metric" style={{ fontSize: 22, marginTop: 27 }}>Operational</div>
              <div className="metric-note">MAX Developer Platform</div>
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <div>
                <h2 className="section-title">Get started</h2>
                <p className="section-desc">Everything you need to create your first MAX integration.</p>
              </div>
            </div>
            <div className="card list">
              <Link href="/applications/new" className="list-row">
                <div className="icon-box"><AppWindow size={19} /></div>
                <div className="row-main">
                  <div className="row-title">Create a MAX application</div>
                  <div className="row-sub">Register an OAuth client and configure your redirect URI.</div>
                </div>
                <ChevronRight size={17} color="var(--faint)" />
              </Link>
              <Link href="#" className="list-row">
                <div className="icon-box"><KeyRound size={19} /></div>
                <div className="row-main">
                  <div className="row-title">Learn about MAX Auth</div>
                  <div className="row-sub">Use Authorization Code + PKCE to let people sign in with MAX.</div>
                </div>
                <ChevronRight size={17} color="var(--faint)" />
              </Link>
              <Link href="#" className="list-row">
                <div className="icon-box"><BookOpen size={19} /></div>
                <div className="row-main">
                  <div className="row-title">Read the developer documentation</div>
                  <div className="row-sub">Guides, API references, examples and integration notes.</div>
                </div>
                <ChevronRight size={17} color="var(--faint)" />
              </Link>
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <div>
                <h2 className="section-title">Developer tools</h2>
                <p className="section-desc">The foundation for the wider MAX platform.</p>
              </div>
            </div>
            <div className="quick-grid">
              <Link href="/applications" className="quick"><Gauge /><div><strong>Applications</strong><span>OAuth clients and app settings</span></div></Link>
              <Link href="/credentials" className="quick"><FileKey2 /><div><strong>Credentials</strong><span>Keys and authentication credentials</span></div></Link>
              <Link href="#" className="quick"><LockKeyhole /><div><strong>Security</strong><span>Protect your integrations</span></div></Link>
              <Link href="#" className="quick"><LifeBuoy /><div><strong>Developer support</strong><span>Get help building with MAX</span></div></Link>
            </div>
          </section>

          <div className="footer">
            MAX Developer Platform · The MAX AI Ecosystem · <Link href="https://max-ai.name.ng" target="_blank">MAX AI <ExternalLink size={10} style={{ display: "inline" }} /></Link>
          </div>
        </main>
      </div>
    </div>
  );
}
