export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center rounded-full border border-sentinel-500/30 bg-sentinel-500/10 px-3 py-1 text-sm font-medium text-sentinel-500 mb-6">
          Now live on Product Hunt
        </div>
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Your API&apos;s{' '}
          <span className="text-sentinel-500">Immune System</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          AI-powered security that learns what &quot;normal&quot; looks like for your API — so it can spot the abnormal before it becomes a breach. Zero-config. &lt;50ms overhead.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="https://app.sentinel-ai.app"
            className="rounded-lg bg-sentinel-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sentinel-500 transition"
          >
            Get Started Free
          </a>
          <a
            href="https://github.com/sentinel-ai/sentinel-ai"
            className="rounded-lg border border-slate-700 bg-slate-900 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <Stat value="99.2%" label="Detection precision" />
            <Stat value="&lt;50ms" label="Overhead per request" />
            <Stat value="0.3%" label="False positive rate" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-3xl font-bold tracking-tight text-white text-center">How it works</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Step number="1" title="Install" description="npm install sentinel-ai — 2 lines of code. No regex, no IP lists, no config files." />
          <Step number="2" title="Learn" description="Behavioral AI builds a fingerprint of your API's normal traffic patterns per endpoint, per user." />
          <Step number="3" title="Detect & Block" description="4-layer ensemble scores every request. Zero-day attacks, SQLi, XSS, SSRF, exfiltration — blocked in real time." />
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-3xl font-bold tracking-tight text-white text-center">What you get</h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Feature title="Real-time threat dashboard" description="See every blocked attack, anomaly score, and forensic detail in one place." />
            <Feature title="DLP engine" description="Detect exfiltration of PII, health records, API keys, and secrets automatically." />
            <Feature title="Honeypot auto-deployment" description="Fake endpoints that trap attackers and fingerprint their behavior." />
            <Feature title="Compliance reports" description="SOC2, GDPR, HIPAA reports generated in 1 click." />
            <Feature title="Fail-closed design" description="If our service goes down, your traffic is blocked — never left exposed." />
            <Feature title="Self-serve pricing" description="Start free (1K requests/mo). Pro at $49/mo. Upgrade instantly." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-3xl font-bold tracking-tight text-white text-center">Pricing</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <PricingCard
            name="Free"
            price="$0"
            period="/mo"
            description="Perfect for side projects and early validation."
            features={['1,000 requests/mo', 'Basic threat detection', 'Community support']}
            cta="Start Free"
            href="https://app.sentinel-ai.app"
          />
          <PricingCard
            name="Pro"
            price="$49"
            period="/mo"
            description="For SaaS startups with APIs in production."
            features={['100,000 requests/mo', '4-layer AI ensemble', 'DLP engine', 'Slack alerts', 'Compliance reports']}
            cta="Get Pro"
            href="https://app.sentinel-ai.app"
            highlighted
          />
          <PricingCard
            name="Business"
            price="$199"
            period="/mo"
            description="For teams handling sensitive data at scale."
            features={['1M requests/mo', 'Everything in Pro', 'Priority support', 'Custom rules', 'SSO']}
            cta="Contact Sales"
            href="mailto:hello@sentinel-ai.app"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Stop configuring WAFs that don&apos;t understand APIs.</h2>
        <p className="mt-4 text-lg text-slate-400">
          Join developers who are replacing static rules with behavioral AI. First 1,000 requests free every month.
        </p>
        <a
          href="https://app.sentinel-ai.app"
          className="mt-8 inline-block rounded-lg bg-sentinel-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sentinel-500 transition"
        >
          Deploy Sentinel AI in 2 Minutes
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Sentinel AI. Built by a solo founder who got tired of WAFs.</p>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white" dangerouslySetInnerHTML={{ __html: value }} />
      <div className="mt-1 text-slate-400">{label}</div>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sentinel-600 text-sm font-bold text-white">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sentinel-500" />
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlighted
          ? 'border-sentinel-500 bg-sentinel-900/20'
          : 'border-slate-800 bg-slate-900'
      }`}
    >
      <h3 className="text-sm font-medium text-slate-400">{name}</h3>
      <div className="mt-2 flex items-baseline">
        <span className="text-3xl font-bold text-white">{price}</span>
        <span className="ml-1 text-sm text-slate-400">{period}</span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-sentinel-500">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={href}
        className={`mt-6 block w-full rounded-lg px-4 py-2 text-center text-sm font-semibold transition ${
          highlighted
            ? 'bg-sentinel-600 text-white hover:bg-sentinel-500'
            : 'border border-slate-700 text-white hover:bg-slate-800'
        }`}
      >
        {cta}
      </a>
    </div>
  );
}
