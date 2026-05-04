'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Observer',
    price: '$0',
    period: '/month',
    annual: null,
    features: [
      '100 requests/month',
      'Basic threat scan',
      'Email alerts',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/register',
    highlight: false,
    border: 'border-white/10',
    glow: '',
    badge: null,
    priceColor: 'text-white',
    ctaStyle: 'border border-white/20 text-white hover:bg-white/5',
  },
  {
    name: 'Guardian',
    price: '$19',
    period: '/month',
    annual: '$190/year (2 months free)',
    features: [
      '5,000 requests/month',
      'Advanced threat detection',
      'Email + Slack alerts',
      '1 project',
      'Priority support',
    ],
    cta: 'Start Guardian',
    href: '#checkout',
    planId: 'GUARDIAN',
    highlight: true,
    border: 'border-2 border-[#FF003C]',
    glow: 'shadow-[0_0_40px_rgba(255,0,60,0.15)]',
    badge: 'MOST POPULAR',
    priceColor: 'text-white',
    ctaStyle: 'bg-[#FF003C] text-white font-semibold hover:bg-[#FF003C]/90',
  },
  {
    name: 'Sentinel',
    price: '$49',
    period: '/month',
    annual: '$490/year',
    features: [
      '25,000 requests/month',
      'Webhook notifications',
      'Multi-tenant (5 projects)',
      'Custom rules',
      'Priority support',
    ],
    cta: 'Start Sentinel',
    href: '#checkout',
    planId: 'SENTINEL',
    highlight: false,
    border: 'border border-white/10',
    glow: '',
    badge: null,
    priceColor: 'text-white',
    ctaStyle: 'border border-white/20 text-white hover:bg-white/5',
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    annual: null,
    features: [
      'Unlimited requests',
      'SLA guarantee',
      'Dedicated support',
      'Custom integrations',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    href: 'mailto:contact@sentinel-ai.one',
    highlight: false,
    border: 'border border-[#FFB800]/30',
    glow: '',
    badge: null,
    priceColor: 'text-[#FFB800]',
    ctaStyle: 'border border-[#FFB800]/30 text-[#FFB800] hover:bg-[#FFB800]/10',
  },
];

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session. Please try again.');
      }
    } catch {
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <h2
          className="text-white text-[36px] font-bold"
          style={{ fontFamily: 'var(--font-space), sans-serif' }}
        >
          Simple pricing. No surprises.
        </h2>
        <p
          className="text-[#E0E0E0]/60 text-[16px] mt-4"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Start free. Upgrade when you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col bg-white/[0.02] rounded-xl p-6 ${plan.border} ${plan.glow} ${plan.highlight ? '' : 'opacity-90'}`}
          >
            {plan.badge && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF003C] text-white text-[11px] font-bold px-3 py-1 rounded-full"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {plan.badge}
              </span>
            )}
            <h3
              className="text-white text-[20px] font-semibold mb-4"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span
                className={`text-[48px] font-bold ${plan.priceColor}`}
                style={{ fontFamily: 'var(--font-space), sans-serif' }}
              >
                {plan.price}
              </span>
              <span
                className="text-[16px] text-[#E0E0E0]/40"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {plan.period}
              </span>
            </div>
            {plan.annual && (
              <p
                className="text-[13px] text-[#FF003C] mb-5"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {plan.annual}
              </p>
            )}
            {!plan.annual && <div className="mb-5" />}
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-[14px] text-[#E0E0E0]/80"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  <Check className="w-4 h-4 text-[#00F0FF] mt-0.5 flex-shrink-0" strokeWidth={2} />
                  {f}
                </li>
              ))}
            </ul>
            {'planId' in plan && plan.planId ? (
              <button
                onClick={() => handleCheckout(plan.planId as string)}
                disabled={loading === plan.planId}
                className={`block w-full text-center py-3 rounded-lg transition-colors ${plan.ctaStyle}`}
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {loading === plan.planId ? 'Loading...' : plan.cta}
              </button>
            ) : (
              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-lg transition-colors ${plan.ctaStyle}`}
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
