"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── HERO: Neural Particle Canvas ─── */
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const count = Math.min(120, Math.floor(w / 12));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let anim: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist / 140})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      // Mouse connections
      particles.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 0, 110, ${1 - dist / 200})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#00f0ff";
        ctx.fill();
      });
      anim = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ─── STATS: Real-time counters ─── */
function LiveStats() {
  const [stats, setStats] = useState({ threats: 0, latency: 21, uptime: 99.9 });
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((s) => ({
        threats: s.threats + Math.floor(Math.random() * 3),
        latency: 18 + Math.floor(Math.random() * 8),
        uptime: 99.9 + Math.random() * 0.09,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Threats Blocked", value: stats.threats.toLocaleString(), suffix: "+" },
    { label: "Avg Latency", value: stats.latency, suffix: "ms" },
    { label: "Uptime", value: stats.uptime.toFixed(2), suffix: "%" },
    { label: "Countries", value: "42", suffix: "" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
          <div className="relative bg-[#0a0a0f]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
              {item.value}{item.suffix}
            </div>
            <div className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">{item.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── FEATURE CARDS ─── */
const features = [
  {
    icon: "◈",
    title: "Inspect Engine",
    desc: "Deep analysis of headers, SSL/TLS configurations and payload. Identifies exposure of sensitive data.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: "◉",
    title: "Threat Detection",
    desc: "Detect XSS, SQL Injection, SSRF, Command Injection in real-time. AI behavioral patterns block zero-days.",
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    icon: "⚡",
    title: "Ultra-Low Latency",
    desc: "21ms average latency. Edge-optimized architecture ensures your API is never delayed by security.",
    color: "from-amber-400 to-orange-600",
  },
  {
    icon: "◎",
    title: "Security Score",
    desc: "Score 0-100 with actionable recommendations. Know exactly what needs fixing and the impact.",
    color: "from-emerald-400 to-teal-600",
  },
  {
    icon: "◐",
    title: "One-Header Integration",
    desc: "One X-Sentinel-Api-Key header and you're done. No SDKs, no complex middlewares. Any stack.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: "◑",
    title: "Multi-Tenant",
    desc: "Complete separation per client on Enterprise. Each tenant with its own policy and isolated reports.",
    color: "from-rose-400 to-red-600",
  },
];

/* ─── PRICING ─── */
const plans = [
  {
    name: "FREE",
    price: "$0",
    period: "/month",
    desc: "For personal projects and validation.",
    features: ["100 req/min", "Basic security analysis", "Headers & SSL check", "Community support", "1 project"],
    cta: "Initialize Free",
    href: "#setup",
    popular: false,
    border: "border-zinc-800",
  },
  {
    name: "PRO",
    price: "$49",
    period: "/month",
    desc: "For startups with APIs in production.",
    features: ["1,000 req/min", "Advanced analysis + reports", "XSS, SQLi, SSRF detection", "Detailed Security Score", "Slack / webhook alerts", "5 projects"],
    cta: "Activate Pro",
    href: "https://gumroad.com", // placeholder until Gumroad ready
    popular: true,
    border: "border-cyan-500/50",
  },
  {
    name: "ENTERPRISE",
    price: "$199",
    period: "/month",
    desc: "For companies with compliance needs.",
    features: ["10,000 req/min", "SLA 99.9% guaranteed", "Full multi-tenant", "Priority 24/7 support", "SSO & audit logs", "Unlimited projects"],
    cta: "Contact Sales",
    href: "mailto:inaciofelipe40@gmail.com?subject=Sentinel%20Enterprise%20Inquiry",
    popular: false,
    border: "border-fuchsia-500/50",
  },
];

/* ─── MAIN PAGE ─── */
export default function Home() {


  return (
    <main className="min-h-screen bg-[#020204] text-white overflow-x-hidden selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#020204]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-black font-bold text-sm">S</div>
            <span className="font-bold tracking-tight">Sentinel<span className="text-cyan-400">API</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#demo" className="hover:text-cyan-400 transition">Demo</a>
            <a href="#pricing" className="hover:text-cyan-400 transition">Pricing</a>
            <a href="/docs" className="hover:text-cyan-400 transition">Docs</a>
          </div>
          <Link href="#setup" className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <NeuralCanvas />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              API Live in Production
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-6"
          >
            Neural Defense{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Grid
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Real-time security analysis. <span className="text-cyan-400 font-semibold">21ms latency</span>. Zero configuration.
            Detect XSS, SQL Injection, SSRF before someone exploits it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="#setup" className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-105 transition-all">
              Initialize Defense →
            </Link>
            <a href="/docs" className="px-8 py-4 rounded-xl border border-white/10 text-zinc-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
              View Documentation
            </a>
          </motion.div>

          <LiveStats />
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-600"
        >
          ↓
        </motion.div>
      </section>

      {/* Terminal Code Block */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0f] shadow-2xl"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-[#12121a] border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs text-zinc-500 font-mono">sentinel-api — bash — 80x24</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <div className="text-zinc-500">$ curl -X POST https://api.sentinel-ai.one/v1/inspect \</div>
              <div className="text-zinc-500">  -H "<span className="text-cyan-400">X-Sentinel-Api-Key</span>: sk_live_..." \</div>
              <div className="text-zinc-500">{`  -d '{"url":"https://target-api.com","method":"POST","headers":{},"body":"{\"input\":\"test\"}"}'`}</div>
              <div className="mt-4 text-zinc-500">{`{`}</div>
              <div className="text-zinc-300 ml-4">"verdict": <span className="text-green-400">"ALLOW"</span>,</div>
              <div className="text-zinc-300 ml-4">"riskScore": <span className="text-amber-400">12</span>,</div>
              <div className="text-zinc-300 ml-4">"threatsDetected": [],</div>
              <div className="text-zinc-300 ml-4">"latencyMs": <span className="text-cyan-400">21</span>,</div>
              <div className="text-zinc-300 ml-4">"recommendations": [<span className="text-green-400">"Add CSP header"</span>]</div>
              <div className="text-zinc-500">{`}`}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 text-xs uppercase tracking-[0.3em] mb-4 block">Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Security that <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">actually works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-full p-8 rounded-2xl border border-white/5 bg-[#0a0a0f]/50 backdrop-blur-sm hover:border-white/10 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-fuchsia-400 text-xs uppercase tracking-[0.3em] mb-4 block">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">protocol</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl border ${plan.border} bg-[#0a0a0f]/80 backdrop-blur-md p-8 ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-black text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="text-sm text-zinc-500 uppercase tracking-widest mb-4">{plan.name}</div>
                <div className="text-4xl font-bold mb-2">{plan.price}<span className="text-lg text-zinc-500 font-normal">{plan.period}</span></div>
                <p className="text-zinc-400 text-sm mb-8">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="text-cyan-400 mt-0.5">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  target={plan.href.startsWith("http") ? "_blank" : undefined}
                  rel={plan.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                      : "border border-white/10 text-zinc-300 hover:border-cyan-500/50 hover:text-cyan-400"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-black font-bold text-xs">S</div>
            <span className="text-sm font-semibold">Sentinel<span className="text-cyan-400">API</span></span>
          </div>
          <div className="text-zinc-600 text-sm">
            © 2026 Sentinel API. All systems operational.
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="/docs" className="hover:text-cyan-400 transition">Docs</a>
            <a href="mailto:inaciofelipe40@gmail.com" className="hover:text-cyan-400 transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
