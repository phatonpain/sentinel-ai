import { UserPlus, Link2, ShieldCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Sign up',
    text: 'Create account. No credit card required.',
    icon: UserPlus,
  },
  {
    number: '02',
    title: 'Add your API',
    text: 'Paste your endpoint. We scan automatically.',
    icon: Link2,
  },
  {
    number: '03',
    title: 'Stay protected',
    text: 'Monitor threats in real-time. Sleep better.',
    icon: ShieldCheck,
  },
];

export function HowItWorks() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <h2
        className="text-white text-[36px] font-bold text-center mb-16"
        style={{ fontFamily: 'var(--font-space), sans-serif' }}
      >
        Protect your API in 60 seconds
      </h2>
      <div className="relative flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Connector line - desktop */}
        <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[1px] bg-white/10" />
        {/* Connector line - mobile */}
        <div className="md:hidden absolute top-[40px] left-[24px] bottom-[40px] w-[1px] bg-white/10" />

        {steps.map((step) => (
          <div key={step.number} className="relative flex-1 flex md:flex-col items-start md:items-center gap-4 md:gap-6 z-10 pl-12 md:pl-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A0A0F] border border-white/10 md:mb-0">
              <step.icon className="w-5 h-5 text-[#00F0FF]" strokeWidth={1.5} />
            </div>
            <div className="md:text-center">
              <span
                className="block text-[#FF003C] text-[48px] font-bold leading-none mb-2"
                style={{ fontFamily: 'var(--font-space), sans-serif' }}
              >
                {step.number}
              </span>
              <h3
                className="text-white text-[18px] font-semibold mb-2"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {step.title}
              </h3>
              <p
                className="text-[#E0E0E0]/60 text-[14px]"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
