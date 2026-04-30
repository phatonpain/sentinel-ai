import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward para a API Railway (server-side, sem CORS)
    const response = await fetch('https://api-proxy-production-28ff.up.railway.app/v1/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Setup-Secret': 'sentinel-bootstrap-2026',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: 'Failed to connect to setup endpoint' },
      { status: 500 }
    );
  }
}
