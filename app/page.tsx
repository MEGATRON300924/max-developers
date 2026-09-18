import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, Code2, ShieldCheck, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Link href="/" className="landing-brand">
          <span className="logo">M</span>
          <span><strong>MAX</strong><small>Developer Platform</small></span>
        </Link>
        <div className="landing-nav-actions">
          <Link href="/documentation" className="landing-link">Documentation</Link>
          <Link href="/sign-in" className="secondary">Sign in</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-badge"><Sparkles size={14}/> Build with the MAX AI Ecosystem</div>
        <h1>Build the future with <span>MAX.</span></h1>
        <p>One developer platform for building secure applications and integrations across the MAX AI Ecosystem.</p>
        <div className="landing-actions">
          <Link href="/sign-in" className="primary">Start building <ArrowRight size={16}/></Link>
          <Link href="/documentation" className="secondary">Read the docs</Link>
        </div>
        <div className="landing-code">
          <span>MAX Developer Platform</span>
          <code>OAuth 2.0 · PKCE · APIs · SDKs · Webhooks</code>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-head"><div><div className="eyebrow">Everything you need</div><h2 className="section-title">From account to integration.</h2><p className="section-desc">Use your MAX Account, register an application, and build on the platform.</p></div></div>
        <div className="landing-grid">
          <article className="landing-card"><div className="landing-icon"><ShieldCheck size={19}/></div><h3>Secure by default</h3><p>Authenticate with MAX Account and use modern OAuth authorization with PKCE.</p></article>
          <article className="landing-card"><div className="landing-icon"><Code2 size={19}/></div><h3>Developer APIs</h3><p>Explore the MAX API surface and build experiences that connect to MAX.</p></article>
          <article className="landing-card"><div className="landing-icon"><Boxes size={19}/></div><h3>SDKs & tools</h3><p>Discover SDK support, webhooks, credentials, and tools as the platform grows.</p></article>
        </div>
      </section>

      <section className="landing-cta">
        <div><div className="eyebrow">Ready when you are</div><h2>Start building with MAX.</h2><p>Create your developer session with your MAX Account.</p></div>
        <Link href="/sign-in" className="primary">Continue with MAX <ArrowRight size={16}/></Link>
      </section>

      <footer className="landing-footer">MAX Developer Platform · The MAX AI Ecosystem · <Link href="https://max-ai.name.ng" target="_blank">MAX AI</Link></footer>
    </main>
  );
}
