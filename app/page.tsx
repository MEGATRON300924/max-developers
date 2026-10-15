import Link from "next/link";
import { ArrowRight, ArrowUpRight, Blocks, Braces, Check, Code2, Fingerprint, Gauge, LockKeyhole, ShieldCheck, Sparkles, Workflow } from "lucide-react";

const features = [
  { icon: Fingerprint, title: "One MAX Account", text: "A familiar identity for developers building across the MAX AI Ecosystem." },
  { icon: ShieldCheck, title: "Security built in", text: "Use OAuth 2.0 authorization and PKCE to protect sign-in flows and integrations." },
  { icon: Blocks, title: "One place to build", text: "Register applications, manage OAuth clients, and keep your developer setup organized." },
];

const steps = [
  { number: "01", title: "Sign in with MAX", text: "Use your existing MAX Account to access the developer workspace." },
  { number: "02", title: "Create an application", text: "Set up an OAuth application and configure its redirect URLs and scopes." },
  { number: "03", title: "Build your integration", text: "Use the available APIs and documentation to connect your product to MAX." },
];

export default function LandingPage() {
  return (
    <main className="landing landing-redesign">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link href="/" className="landing-brand" aria-label="MAX AI For Developers home">
          <img src="/logo.svg" alt="MAX AI logo" width="40" height="40" />
          <span><strong>MAX AI</strong><small>FOR DEVELOPERS</small></span>
        </Link>
        <div className="landing-nav-actions">
          <Link href="/documentation" className="landing-link">Documentation</Link>
          <Link href="/sign-in" className="landing-link">Sign in</Link>
          <Link href="/sign-in?next=%2Fonboarding" className="primary nav-cta">Open developer portal <ArrowUpRight size={15}/></Link>
        </div>
      </nav>

      <section className="landing-hero redesign-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="landing-badge"><span className="status-dot" /> THE MAX AI ECOSYSTEM <span className="badge-divider">/</span> DEVELOPER PLATFORM</div>
        <div className="hero-lockup"><img src="/logo.svg" alt="" width="58" height="58" /><span>MAX AI <span className="lockup-muted">FOR DEVELOPERS</span></span></div>
        <h1>Build what’s next.<br/><span>Connect it to MAX.</span></h1>
        <p className="hero-description">The developer workspace for building applications and integrations across the MAX AI Ecosystem — from your first OAuth client to your next big idea.</p>
        <div className="landing-actions">
          <Link href="/sign-in?next=%2Fonboarding" className="primary hero-primary">Get started <ArrowRight size={17}/></Link>
          <Link href="/documentation" className="secondary hero-secondary"><Code2 size={16}/> Explore the docs</Link>
        </div>
        <div className="hero-trust"><span><Check size={14}/> MAX Account</span><span><Check size={14}/> OAuth 2.0 + PKCE</span><span><Check size={14}/> Built for developers</span></div>

        <div className="platform-preview" aria-label="Developer platform preview">
          <div className="preview-topbar"><div className="preview-brand"><img src="/logo.svg" alt="" width="22" height="22"/><strong>MAX Developers</strong></div><div className="preview-dots"><i/><i/><i/></div></div>
          <div className="preview-body">
            <aside className="preview-sidebar"><div className="preview-nav active"><Gauge size={14}/> Overview</div><div className="preview-nav"><Blocks size={14}/> Applications</div><div className="preview-nav"><LockKeyhole size={14}/> Credentials</div><div className="preview-nav"><Workflow size={14}/> Integrations</div><div className="preview-sidebar-label">BUILD</div><div className="preview-nav"><Braces size={14}/> API reference</div></aside>
            <div className="preview-main"><div className="preview-eyebrow">YOUR WORKSPACE</div><h3>Good things start here.</h3><p>Everything you need to build with MAX, in one place.</p><div className="preview-metrics"><div><span>Applications</span><strong>Manage</strong><small>OAuth clients</small></div><div><span>Authentication</span><strong>Protected</strong><small>MAX Auth + PKCE</small></div><div><span>Documentation</span><strong>Explore</strong><small>Guides and APIs</small></div></div><div className="preview-code"><div><span className="code-dot blue"/><span className="code-dot purple"/><span className="code-dot green"/><small>integration.ts</small></div><code><span className="syntax-purple">const</span> ecosystem = <span className="syntax-blue">"MAX AI"</span>;<br/><span className="syntax-purple">await</span> ecosystem.connect(app);<br/><span className="syntax-green">// Your next idea starts here.</span></code></div></div>
          </div>
        </div>
        <div className="preview-caption"><span>YOUR TOOLS. YOUR IDEAS. ONE ECOSYSTEM.</span><span>MAX AI DEVELOPER PLATFORM <ArrowUpRight size={12}/></span></div>
      </section>

      <section className="landing-section redesign-section">
        <div className="redesign-section-heading"><div><div className="eyebrow">THE FOUNDATION</div><h2 className="section-title">A better place to build.</h2></div><p className="section-desc">Less friction between your idea and a working integration. Keep the essentials together and focus on what you’re making.</p></div>
        <div className="landing-grid redesign-grid">
          {features.map(({ icon: Icon, title, text }, index) => <article className="landing-card redesign-card" key={title}><div className="feature-top"><div className="landing-icon"><Icon size={20}/></div><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="workflow-section">
        <div className="eyebrow">YOUR NEXT STEPS</div><h2>From first login to first integration.</h2><p className="workflow-intro">A straightforward path to getting your project connected.</p>
        <div className="workflow-grid">{steps.map((step) => <article className="workflow-step" key={step.number}><span className="workflow-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>

      <section className="landing-cta redesign-cta"><div className="cta-mark"><img src="/logo.svg" alt="" width="42" height="42"/></div><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Your next build starts with MAX.</h2><p>Sign in to open your developer workspace.</p></div><Link href="/sign-in?next=%2Fonboarding" className="primary">Open developer portal <ArrowRight size={16}/></Link></section>

      <footer className="redesign-footer"><Link href="/" className="footer-brand"><img src="/logo.svg" alt="" width="27" height="27"/><span>MAX AI FOR DEVELOPERS</span></Link><span>Part of The MAX AI Ecosystem</span><div><Link href="/documentation">Documentation</Link><Link href="https://max-ai.name.ng" target="_blank" rel="noreferrer">MAX AI <ArrowUpRight size={12}/></Link></div></footer>
    </main>
  );
}
