'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Carlos Mendes',
    role: 'CTO',
    company: 'FintechPay',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content:
      'We implemented Sentinel API in 10 minutes. In one week, we blocked over 200 SQL Injection attempts that our old WAF didn\'t even detect.',
    rating: 5,
  },
  {
    name: 'Ana Souza',
    role: 'DevOps Lead',
    company: 'CloudScale',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    content:
      'The latency is incredible. 21ms is imperceptible to our users. And the Security Score helped us prioritize fixes much more efficiently.',
    rating: 5,
  },
  {
    name: 'Rafael Lima',
    role: 'Security Engineer',
    company: 'DataSafe',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content:
      'Finally an API security solution that doesn\'t require a dedicated team to maintain rules. The real-time threat detection is impressive.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-sentinel-cyan uppercase tracking-widest mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            What <span className="gradient-text">devs</span> say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-white/5 bg-[#0d0d12] p-6 hover:border-white/10 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sentinel-cyan text-sentinel-cyan" />
                ))}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
