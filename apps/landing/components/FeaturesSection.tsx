import { Shield, Zap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Real-Time Detection',
    text: 'Every request scanned in 21ms. XSS, SQL injection, and BOLA attacks blocked before they hit your server.',
  },
  {
    icon: Zap,
    title: 'One-Header Integration',
    text: 'Add one HTTP header. No SDK. No code changes. Works with any framework — Next.js, Laravel, Django, Rails.',
  },
  {
    icon: BarChart3,
    title: 'Threat Intelligence',
    text: 'See exactly who is attacking, from where, and how. Export logs to SIEM or Slack in one click.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="border border-white/10 bg-white/[0.02] rounded-xl p-8 hover:bg-white/[0.04] transition-colors"
          >
            <f.icon className="w-8 h-8 text-[#00F0FF] mb-5" strokeWidth={1.5} />
            <h3
              className="text-white text-[18px] font-semibold mb-3"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {f.title}
            </h3>
            <p
              className="text-[#E0E0E0]/60 text-[14px] leading-relaxed"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {f.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
