export function SocialProof() {
  const logos = [
    { name: 'Stripe' },
    { name: 'Vercel' },
    { name: 'Railway' },
    { name: 'Supabase' },
    { name: 'GitHub' },
  ];

  return (
    <section className="bg-[#0A0A0F] border-y border-white/5 py-8">
      <p
        className="text-center text-[14px] text-[#E0E0E0]/40 mb-6"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Trusted by developers at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="text-[#E0E0E0]/30 text-[16px] font-semibold tracking-wide"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
          >
            {logo.name}
          </div>
        ))}
      </div>
    </section>
  );
}
