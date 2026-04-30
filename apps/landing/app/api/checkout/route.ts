import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch('https://api-proxy-production-28ff.up.railway.app/v1/billing/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentinel-Api-Key': 'sentinel_sk_ZDUyYzk3N2ItNjdhYi00OWNmLWJjOGEtMTBjM2QwN2MyZjU5',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create checkout session', message: error?.message || String(error) },
      { status: 500 },
    );
  }
}
