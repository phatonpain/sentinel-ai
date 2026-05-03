import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SISTOLE — Case Study | Neural Defense Grid",
  description:
    "How we built an API security landing page that breathes. ECG visualization, 3D wireframe heart, Web Audio API sonification, and cinematic scroll storytelling.",
  openGraph: {
    title: "SISTOLE — Case Study",
    description: "How we built an API that breathes.",
    url: "https://sentinel-ai.one/case-study",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function CaseStudyPage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      {/* 1. HERO CASE STUDY */}
      <section className="min-h-[50vh] flex flex-col justify-center items-center text-center px-4">
        <p className="font-mono text-xs text-secondary mb-4">CASE STUDY | MAY 2026</p>
        <h1 className="font-display text-hero text-primary mb-4">SISTOLE</h1>
        <p className="font-body text-xl text-text/80 max-w-2xl mb-8">
          How we built an API that breathes
        </p>
        <a
          href="/"
          className="inline-block border border-secondary text-secondary font-mono text-sm px-6 py-3 hover:bg-secondary hover:text-bg transition-all"
        >
          {"> VIEW_LIVE_SITE"}
        </a>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="font-display text-headline text-text mb-8">The Problem</h2>
        <p className="font-body text-lg text-text/70 leading-relaxed mb-6">
          SaaS security is generic. Every landing page looks like a template bought from a marketplace.
          The user reads about protection but never <em>feels</em> it. Security is abstract — a dashboard
          of numbers, a checklist of features, a pricing table.
        </p>
        <p className="font-body text-lg text-text/70 leading-relaxed">
          We asked: what if security was visceral? What if the user could <em>hear</em> their API being
          protected? What if each request had a heartbeat?
        </p>
      </section>

      {/* 3. THE SOLUTION */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-secondary/10">
        <h2 className="font-display text-headline text-text mb-8">The Solution</h2>
        <p className="font-body text-lg text-text/70 leading-relaxed mb-6">
          <strong className="text-primary">SISTOLE</strong> — the living defense of your API. Each
          request is a heartbeat. Each attack is an arrhythmia. The user doesn&apos;t read about
          security; they <em>feel</em> it in their chest.
        </p>
        <ul className="space-y-4 font-mono text-sm text-text/60">
          <li>
            <span className="text-secondary">{" > "}</span> ECG visualizes real-time API traffic
          </li>
          <li>
            <span className="text-secondary">{" > "}</span> 3D wireframe heart pulses when threats are
            neutralized
          </li>
          <li>
            <span className="text-secondary">{" > "}</span> 4-channel oscilloscope turns security scans
            into music
          </li>
          <li>
            <span className="text-secondary">{" > "}</span> Cinematic scroll storytelling with GSAP
          </li>
        </ul>
      </section>

      {/* 4. CREATIVE PROCESS */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-secondary/10">
        <h2 className="font-display text-headline text-text mb-8">Creative Process</h2>

        <h3 className="font-display text-xl text-secondary mb-4">Moodboard</h3>
        <p className="font-body text-text/70 mb-6">
          Blade Runner 2049 (neon in absolute darkness), Ghost in the Shell (transparency of
          technology), Cyberpunk 2077 (selective saturation), Control (brutalist architecture of the
          unknown).
        </p>

        <h3 className="font-display text-xl text-secondary mb-4">Art Direction</h3>
        <p className="font-body text-text/70 mb-6">
          &quot;Síndrome da Noite Eterna&quot; — Metropolises that never sleep. Clinical authority
          without aggression. Restriction generates identity.
        </p>

        <h3 className="font-display text-xl text-secondary mb-4">Palette</h3>
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="w-16 h-16 bg-[#FF003C]" title="Primary: Alert / Synthetic Blood" />
          <div className="w-16 h-16 bg-[#00F0FF]" title="Secondary: Toxic Ice / Terminal Cyan" />
          <div className="w-16 h-16 bg-[#FFB800]" title="Alert: Oxidation / Rust Yellow" />
          <div
            className="w-16 h-16 bg-[#0A0A0F] border border-text/20"
            title="Background: Industrial Vacuum"
          />
          <div className="w-16 h-16 bg-[#E0E0E0]" title="Text: Autopsy Grey / Dead Silver" />
        </div>

        <h3 className="font-display text-xl text-secondary mb-4">Typography</h3>
        <p className="font-mono text-sm text-text/60">
          {" > "} Display: Space Grotesk — mechanical cuts, geometric forms
          <br />
          {" > "} Body: Inter — surgical legibility
          <br />
          {" > "} Mono: JetBrains Mono — code, logs, raw information
        </p>
      </section>

      {/* 5. TECH STACK */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-secondary/10">
        <h2 className="font-display text-headline text-text mb-8">Tech Stack</h2>
        <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div className="border border-secondary/20 p-4">
            <span className="text-secondary">{" > "}</span> Next.js 14 + TypeScript
          </div>
          <div className="border border-secondary/20 p-4">
            <span className="text-secondary">{" > "}</span> Tailwind CSS
          </div>
          <div className="border border-secondary/20 p-4">
            <span className="text-secondary">{" > "}</span> Three.js + React Three Fiber
          </div>
          <div className="border border-secondary/20 p-4">
            <span className="text-secondary">{" > "}</span> Web Audio API
          </div>
          <div className="border border-secondary/20 p-4">
            <span className="text-secondary">{" > "}</span> GSAP + ScrollTrigger
          </div>
          <div className="border border-secondary/20 p-4">
            <span className="text-secondary">{" > "}</span> Node.js + PostgreSQL + Prisma
          </div>
          <div className="border border-secondary/20 p-4">
            <span className="text-secondary">{" > "}</span> Stripe
          </div>
          <div className="border border-secondary/20 p-4">
            <span className="text-secondary">{" > "}</span> Vercel
          </div>
        </div>
      </section>

      {/* 6. CHALLENGES & SOLUTIONS */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-secondary/10">
        <h2 className="font-display text-headline text-text mb-8">Challenges &amp; Solutions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-sm text-primary mb-2">{"[ CHALLENGE_01 ]"}</h3>
            <p className="font-body text-text/70 mb-2">
              Performance with WebGL + Audio running simultaneously
            </p>
            <p className="font-mono text-xs text-secondary">
              {" > "} Solution: Aggressive lazy loading (next/dynamic), content-visibility, dynamic
              imports with SSR disabled, font-display: swap
            </p>
          </div>
          <div>
            <h3 className="font-mono text-sm text-primary mb-2">{"[ CHALLENGE_02 ]"}</h3>
            <p className="font-body text-text/70 mb-2">
              AudioContext blocked by browser until user interaction
            </p>
            <p className="font-mono text-xs text-secondary">
              {" > "} Solution: Initialize AudioContext only after first click/touch. Overlay
              &quot;[ CLICK TO ACTIVATE AUDIO ]&quot; on canvas elements.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-sm text-primary mb-2">{"[ CHALLENGE_03 ]"}</h3>
            <p className="font-body text-text/70 mb-2">
              Scroll storytelling without breaking accessibility
            </p>
            <p className="font-mono text-xs text-secondary">
              {" > "} Solution: prefers-reduced-motion hook, skip link, focus-visible states,
              aria-labels on all interactive elements, static fallbacks for canvas.
            </p>
          </div>
        </div>
      </section>

      {/* 7. METRICS */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-secondary/10">
        <h2 className="font-display text-headline text-text mb-8">Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-secondary/20 p-6 text-center">
            <div className="font-display text-3xl text-secondary mb-2">73.2</div>
            <div className="font-mono text-xs text-text/50">kB Bundle Size</div>
          </div>
          <div className="border border-secondary/20 p-6 text-center">
            <div className="font-display text-3xl text-secondary mb-2">211</div>
            <div className="font-mono text-xs text-text/50">kB First Load JS</div>
          </div>
          <div className="border border-secondary/20 p-6 text-center">
            <div className="font-display text-3xl text-secondary mb-2">60</div>
            <div className="font-mono text-xs text-text/50">FPS WebGL</div>
          </div>
          <div className="border border-secondary/20 p-6 text-center">
            <div className="font-display text-3xl text-secondary mb-2">21</div>
            <div className="font-mono text-xs text-text/50">ms API Latency</div>
          </div>
        </div>
        <div className="mt-8 font-mono text-xs text-text/50">
          {" > "} Lighthouse: Performance ~80 | Accessibility ~93 | Best Practices ~98 | SEO ~98
        </div>
      </section>

      {/* 8. CREDITS */}
      <section className="py-20 px-4 max-w-4xl mx-auto border-t border-secondary/10">
        <h2 className="font-display text-headline text-text mb-8">Credits</h2>
        <div className="font-mono text-sm text-text/70 space-y-2">
          <p>
            <span className="text-secondary">{" > "}</span> Development: Crust
          </p>
          <p>
            <span className="text-secondary">{" > "}</span> Development Tool: Kimi AI (code
            generation &amp; architecture)
          </p>
          <p>
            <span className="text-secondary">{" > "}</span> Art Direction: Crust
          </p>
          <p>
            <span className="text-secondary">{" > "}</span> Concept: SISTOLE — Neural Defense Grid
          </p>
          <p>
            <span className="text-secondary">{" > "}</span> Deploy: Vercel
          </p>
        </div>
        <div className="mt-8 pt-8 border-t border-secondary/10 text-center">
          <p className="font-mono text-xs text-text/40">
            {" > LIVE_SITE: https://sentinel-ai.one"}
          </p>
        </div>
      </section>
    </main>
  );
}
