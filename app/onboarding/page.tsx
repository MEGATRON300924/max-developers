"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Check, Code2, Rocket, ShieldCheck, SkipForward, Sparkles } from "lucide-react";

const STORAGE_KEY = "max-developers:onboarding";
const COMPLETE_KEY = "max-developers:onboarding-complete";

const purposes = [
  { value: "web", label: "Web application", detail: "A website or web app" },
  { value: "mobile", label: "Mobile app", detail: "Android or iOS" },
  { value: "desktop", label: "Desktop app", detail: "Windows, macOS or Linux" },
  { value: "backend", label: "Backend or API", detail: "Services and integrations" },
  { value: "game", label: "Game", detail: "A game or game service" },
  { value: "other", label: "Something else", detail: "Tell us about it below" },
];
const projectTypes = [
  { value: "personal", label: "Personal project" },
  { value: "startup", label: "Startup or small team" },
  { value: "business", label: "Established business" },
  { value: "learning", label: "Learning or school project" },
  { value: "client", label: "Building for a client" },
];
const capabilities = [
  { value: "signin", label: "Let people sign in with MAX", detail: "MAX Account authentication" },
  { value: "profile", label: "Use account profile details", detail: "Name, username and approved profile data" },
  { value: "offline", label: "Keep access when users return", detail: "Offline access where supported" },
  { value: "manage", label: "Manage multiple applications", detail: "Organize and configure OAuth clients" },
];
const helpOptions = [
  { value: "guides", label: "Step-by-step guides" },
  { value: "examples", label: "Code examples and SDKs" },
  { value: "oauth", label: "OAuth and security help" },
  { value: "none", label: "I’ll explore on my own" },
];

type Answers = { purposes: string[]; projectType: string; capabilities: string[]; help: string[]; description: string };

const emptyAnswers: Answers = { purposes: [], projectType: "", capabilities: [], help: [], description: "" };

function toggleValue(current: string[], value: string) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(COMPLETE_KEY) === "1") {
        router.replace("/dashboard");
        return;
      }
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Answers>;
        setAnswers({
          purposes: Array.isArray(parsed.purposes) ? parsed.purposes.filter((value): value is string => typeof value === "string") : [],
          projectType: typeof parsed.projectType === "string" ? parsed.projectType : "",
          capabilities: Array.isArray(parsed.capabilities) ? parsed.capabilities.filter((value): value is string => typeof value === "string") : [],
          help: Array.isArray(parsed.help) ? parsed.help.filter((value): value is string => typeof value === "string") : [],
          description: typeof parsed.description === "string" ? parsed.description : "",
        });
      }
    } catch {
      // Onboarding is optional; storage issues must never block the developer dashboard.
    }
  }, [router]);

  function finish(skip = false) {
    setSaving(true);
    try {
      if (!skip) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      window.localStorage.setItem(COMPLETE_KEY, "1");
    } catch {
      // Continue even when browser storage is unavailable.
    }
    router.replace("/dashboard");
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "28px 18px 56px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 42 }}>
          <Link href="/" className="landing-brand">
            <span className="logo">M</span>
            <span><strong>MAX</strong><small>Developer Platform</small></span>
          </Link>
          <button className="secondary" type="button" onClick={() => finish(true)} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <SkipForward size={15} /> Skip for now
          </button>
        </header>

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="landing-badge"><Sparkles size={14} /> A quick introduction</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 46px)", lineHeight: 1.08, letterSpacing: "-.04em", margin: "18px 0 14px" }}>Let’s set up your developer space.</h1>
          <p className="lead" style={{ maxWidth: 620, marginBottom: 28 }}>Tell us a little about what you’re building. This helps us tailor the getting-started experience. You can skip any question, and you can still change your app permissions later.</p>

          <section className="card" style={{ padding: "clamp(18px, 4vw, 30px)", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <div className="icon-box"><Code2 size={19} /></div>
              <div><h2 style={{ fontSize: 17, margin: 0 }}>1. What are you building with MAX Auth?</h2><p className="card-desc" style={{ marginTop: 5 }}>Choose any that apply.</p></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))", gap: 10 }}>
              {purposes.map((item) => {
                const selected = answers.purposes.includes(item.value);
                return <button key={item.value} type="button" aria-pressed={selected} onClick={() => setAnswers((current) => ({ ...current, purposes: toggleValue(current.purposes, item.value) }))} className="card" style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 14, textAlign: "left", borderColor: selected ? "var(--accent, #3b82f6)" : "var(--border)", background: selected ? "var(--surface-soft)" : "var(--surface)", cursor: "pointer" }}>
                  <span style={{ width: 19, height: 19, borderRadius: 6, border: "1px solid var(--border)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1, background: selected ? "#3b82f6" : "transparent", color: "white" }}>{selected ? <Check size={13} /> : null}</span>
                  <span><strong style={{ display: "block", fontSize: 13 }}>{item.label}</strong><span style={{ display: "block", color: "var(--muted)", fontSize: 12, marginTop: 3 }}>{item.detail}</span></span>
                </button>;
              })}
            </div>
          </section>

          <section className="card" style={{ padding: "clamp(18px, 4vw, 30px)", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <div className="icon-box"><Rocket size={19} /></div>
              <div><h2 style={{ fontSize: 17, margin: 0 }}>2. What kind of project is it?</h2><p className="card-desc" style={{ marginTop: 5 }}>Pick the closest fit. It’s okay if your project doesn’t fit perfectly.</p></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {projectTypes.map((item) => <button key={item.value} type="button" aria-pressed={answers.projectType === item.value} onClick={() => setAnswers((current) => ({ ...current, projectType: item.value }))} className={answers.projectType === item.value ? "primary" : "secondary"} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>{answers.projectType === item.value ? <Check size={14} /> : null}{item.label}</button>)}
            </div>
          </section>

          <section className="card" style={{ padding: "clamp(18px, 4vw, 30px)", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <div className="icon-box"><ShieldCheck size={19} /></div>
              <div><h2 style={{ fontSize: 17, margin: 0 }}>3. What do you want MAX Auth to help with?</h2><p className="card-desc" style={{ marginTop: 5 }}>These are interests, not permissions. You’ll explicitly configure scopes for each client.</p></div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {capabilities.map((item) => {
                const selected = answers.capabilities.includes(item.value);
                return <label key={item.value} style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: 13, border: "1px solid var(--border)", borderRadius: 12, cursor: "pointer", background: selected ? "var(--surface-soft)" : "transparent" }}>
                  <input type="checkbox" checked={selected} onChange={() => setAnswers((current) => ({ ...current, capabilities: toggleValue(current.capabilities, item.value) }))} style={{ marginTop: 3, accentColor: "#3b82f6" }} />
                  <span><strong style={{ display: "block", fontSize: 13 }}>{item.label}</strong><span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{item.detail}</span></span>
                </label>;
              })}
            </div>
          </section>

          <section className="card" style={{ padding: "clamp(18px, 4vw, 30px)", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <div className="icon-box"><BookOpen size={19} /></div>
              <div><h2 style={{ fontSize: 17, margin: 0 }}>4. What kind of help would be useful?</h2><p className="card-desc" style={{ marginTop: 5 }}>Select any that sound useful.</p></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {helpOptions.map((item) => <button key={item.value} type="button" aria-pressed={answers.help.includes(item.value)} onClick={() => setAnswers((current) => ({ ...current, help: toggleValue(current.help, item.value) }))} className={answers.help.includes(item.value) ? "primary" : "secondary"} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>{answers.help.includes(item.value) ? <Check size={14} /> : null}{item.label}</button>)}
            </div>
          </section>

          <section className="card" style={{ padding: "clamp(18px, 4vw, 30px)", marginBottom: 22 }}>
            <h2 style={{ fontSize: 17, margin: 0 }}>5. Anything else we should know? <span style={{ color: "var(--muted)", fontWeight: 400 }}>Optional</span></h2>
            <p className="card-desc" style={{ marginTop: 6, marginBottom: 12 }}>A short description of your project is enough. Don’t include secrets, passwords, or private user data.</p>
            <textarea value={answers.description} onChange={(event) => setAnswers((current) => ({ ...current, description: event.target.value.slice(0, 600) }))} maxLength={600} rows={4} placeholder="I’m building…" style={{ width: "100%", resize: "vertical", border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)", color: "var(--text)", padding: 13, font: "inherit", fontSize: 13 }} />
            <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 11, marginTop: 5 }}>{answers.description.length}/600</div>
          </section>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ color: "var(--muted)", fontSize: 12, maxWidth: 390, margin: 0 }}>Your answers are saved in this browser on this device. This setup doesn’t grant or change any OAuth permissions.</p>
            <button type="button" className="primary" onClick={() => finish(false)} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{saving ? "Opening your dashboard…" : "Finish setup"} <ArrowRight size={16} /></button>
          </div>
        </div>
        <footer className="landing-footer" style={{ marginTop: 48 }}>MAX Developer Platform · The MAX AI Ecosystem</footer>
      </div>
    </main>
  );
}
