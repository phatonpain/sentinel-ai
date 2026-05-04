'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is Sentinel?',
    a: 'Sentinel is an API security layer that sits between your users and your API. It scans every request for threats in real-time.',
  },
  {
    q: 'How does the free plan work?',
    a: 'You get 100 requests per month forever. No credit card required. Upgrade when you need more.',
  },
  {
    q: 'Do I need to change my code?',
    a: 'No. Add one HTTP header to your requests. That is it. Works with any framework.',
  },
  {
    q: 'What threats do you detect?',
    a: 'XSS, SQL injection, BOLA, broken authentication, rate limit abuse, and more. We update our detection engine daily.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans can be cancelled anytime. Annual plans are refundable within 30 days.',
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-6 py-24">
      <h2
        className="text-white text-[36px] font-bold text-center mb-12"
        style={{ fontFamily: 'var(--font-space), sans-serif' }}
      >
        Questions?
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <span
                className="text-white text-[15px] font-medium"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {faq.q}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#E0E0E0]/40 transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-5">
                <p
                  className="text-[#E0E0E0]/60 text-[14px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
