# Sentinel AI — Deploy de Produção

## Arquitetura

```
Landing Page    →  Vercel  →  https://sentinel-ai.com
Dashboard       →  Vercel  →  https://app.sentinel-ai.com
API Proxy       →  Railway →  https://api.sentinel-ai.com
PostgreSQL      →  Railway Add-on
Redis           →  Railway Add-on / Upstash
ML Service      →  Railway / Render
```

## Pré-requisitos

- Conta Vercel (dashboard + landing)
- Conta Railway (api-proxy + db + redis)
- Domínio comprado (ex: Namecheap — sentinel-ai.app ~$15/ano)
- Stripe Live account
- OpenAI API key

## 1. API Proxy (Railway)

1. Criar projeto no Railway
2. Conectar GitHub repo
3. Adicionar PostgreSQL + Redis addons
4. Configurar variáveis de ambiente:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_BUSINESS=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
JWT_SECRET=<openssl rand -base64 32>
SENTINEL_API_KEY=sk_sentinel_...
DASHBOARD_URL=https://app.sentinel-ai.com
```

5. Deploy automático via Git push

## 2. Dashboard (Vercel)

1. Criar projeto no Vercel
2. Conectar GitHub repo
3. Root Directory: `apps/dashboard` (ou root se monorepo)
4. Environment variables:

```env
NEXTAUTH_URL=https://app.sentinel-ai.com
NEXTAUTH_SECRET=<min-32-chars>
SENTINEL_API_URL=https://api.sentinel-ai.com
SENTINEL_API_KEY=sk_sentinel_...
NEXT_PUBLIC_WS_URL=wss://api.sentinel-ai.com/alerts
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
```

## 3. Landing Page (Vercel)

1. Criar projeto no Vercel
2. Root Directory: `apps/landing` (ou root)
3. Domínio custom: `sentinel-ai.com`
4. Redirect www → non-www

## 4. DNS

```
A     sentinel-ai.com     → Vercel IP
CNAME app.sentinel-ai.com → cname.vercel-dns.com
CNAME api.sentinel-ai.com → Railway domain
```

## 5. SSL/TLS

- Vercel e Railway provisionam Let's Encrypt automaticamente
- Forçar redirect HTTP → HTTPS

## 6. Healthchecks

```bash
# Landing
curl -I https://sentinel-ai.com

# Dashboard
curl -I https://app.sentinel-ai.com

# API Health
curl https://api.sentinel-ai.com/health

# API Inspect
curl -X POST https://api.sentinel-ai.com/v1/inspect \
  -H "X-Sentinel-Api-Key: live-key" \
  -d '{"method":"GET","path":"/api/test","headers":{},"body":{}}'
```

## 7. Stripe Webhook

Configure no Stripe Dashboard:

```
Endpoint: https://api.sentinel-ai.com/v1/webhooks/stripe
Events:
  - invoice.payment_succeeded
  - invoice.payment_failed
  - customer.subscription.updated
  - customer.subscription.deleted
```

## 8. Monitoramento

- Railway: logs e métricas built-in
- Vercel: Analytics e Speed Insights
- Stripe: Dashboard de pagamentos
- Healthcheck: `/health` no API Proxy

## Checklist Final

- [ ] API Proxy responde `/health`
- [ ] Dashboard mostra dados reais
- [ ] WebSocket alerts funcionam
- [ ] Stripe checkout funciona (teste com $1)
- [ ] Webhook Stripe verifica signature
- [ ] Quota guard bloqueia quando excede
- [ ] Tenant isolation testada
- [ ] SSL válido em todos os domínios
- [ ] Zero erros 500 nos primeiros 100 requests
