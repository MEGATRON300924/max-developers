import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"var(--bg)"}}>
      <section style={{width:"100%",maxWidth:430,textAlign:"center"}}>
        <div className="logo" style={{margin:"0 auto 18px",width:48,height:48,borderRadius:15,fontSize:20}}>M</div>
        <div className="eyebrow">MAX Developer Platform</div>
        <h1 style={{fontSize:30}}>Sign in to build with MAX</h1>
        <p className="lead" style={{margin:"12px auto 26px"}}>Use your MAX Account to manage applications, credentials and developer access.</p>
        <a href="/auth/start" className="primary" style={{display:"inline-flex",alignItems:"center",gap:8}}>Continue with MAX Account <ArrowRight size={16}/></a>
        <div style={{marginTop:22,color:"var(--muted)",fontSize:11,display:"flex",justifyContent:"center",gap:6,alignItems:"center"}}><ShieldCheck size={14}/> Secure authentication through MAX Auth</div>
        <div className="footer"><Link href="/">Return to Developer Platform</Link></div>
      </section>
    </main>
  );
}
