export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold tracking-tight text-sentinel-500">
        Sentinel AI
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Your API&apos;s Immune System
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card title="Threats Blocked" value="12,402" />
        <Card title="Requests Inspected" value="1.2M" />
        <Card title="False Positive Rate" value="0.4%" />
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="text-sm font-medium text-slate-400">{title}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}
