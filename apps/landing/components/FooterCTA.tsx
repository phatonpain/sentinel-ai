import Link from 'next/link';

export function FooterCTA() {
  return (
    <section className="bg-[#FF003C]/10 border-y border-[#FF003C]/20 py-20 text-center">
      <h2
        className="text-white text-[36px] font-bold max-w-2xl mx-auto px-6"
        style={{ fontFamily: 'var(--font-space), sans-serif' }}
      >
        Your API is the front door. Lock it.
      </h2>
      <p
        className="text-[#E0E0E0]/60 text-[16px] mt-4 max-w-xl mx-auto px-6"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Start free. No credit card. 60 seconds to protect your API.
      </p>
      <Link
        href="/register"
        className="inline-block bg-[#FF003C] text-white text-[16px] font-bold px-10 py-4 rounded-lg mt-8 hover:bg-[#FF003C]/90 transition-colors"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Create Free Account
      </Link>
    </section>
  );
}
