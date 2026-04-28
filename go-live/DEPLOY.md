# EXECUTE AGORA — Deploy de Produção

> Nada mais de planejamento. Só ação.
> ⚠️ Você precisa executar manualmente (requer cartão/contas).

---

## 1.1 Comprar Domínio

- **Namecheap** (namecheap.com)
- Comprar: `sentinel-ai.app` (ou `sentinel-ai.com` se disponível)
- Configurar DNS:
  - `A` record `@` → `76.76.21.21` (Vercel IP)
  - `CNAME` `app` → `cname.vercel-dns.com`
  - `CNAME` `api` → Railway domain (será gerado após deploy)

---

## 1.2 Deploy API Proxy (Railway)

1. Criar projeto no Railway (railway.app)
2. Conectar GitHub repo (`sentinel-ai`)
3. **Root Directory:** `apps/api-proxy`
4. Add **PostgreSQL** + **Redis** addons
5. **Environment Variables:**

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
JWT_SECRET=<gerar com: openssl rand -base64 32>
CLERK_SECRET_KEY=sk_live_...
DASHBOARD_URL=https://app.sentinel-ai.app
ENABLE_E2E=false
PORT=3001
```

6. Deploy: Railway faz deploy automático no git push

---

## 1.3 Deploy Dashboard (Vercel)

1. Criar projeto no Vercel (vercel.com)
2. **Root Directory:** `apps/dashboard`
3. **Environment Variables:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
SENTINEL_API_URL=https://api.sentinel-ai.app
SENTINEL_API_KEY=sk_live_...(chave de serviço do dashboard)
NEXT_PUBLIC_WS_URL=wss://api.sentinel-ai.app/alerts
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

4. Deploy: `vercel --prod`
5. Domínio custom: `app.sentinel-ai.app`

---

## 1.4 Deploy Landing (Vercel)

1. Criar projeto no Vercel
2. **Root Directory:** `apps/landing`
3. **Environment Variables:** (nenhuma necessária)
4. Deploy: `vercel --prod`
5. Domínio custom: `sentinel-ai.app`

---

## 1.5 Configurar Stripe Webhook

Stripe Dashboard → Developers → Webhooks → Add endpoint

- **Endpoint URL:** `https://api.sentinel-ai.app/v1/webhooks/stripe`
- **Events to listen:**
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`

Copiar **Signing Secret** → colar em `STRIPE_WEBHOOK_SECRET` no Railway

---

## 1.6 Testar End-to-End

### Healthcheck
```bash
curl https://api.sentinel-ai.app/health
```
Esperado: `{"status":"healthy","services":{"database":"ok","redis":"ok"}}`

### Landing page
```bash
curl -I https://sentinel-ai.app
```
Esperado: `200 OK`

### Dashboard
```bash
curl -I https://app.sentinel-ai.app
```
Esperado: `200 OK`

### Teste de ataque (PowerShell)
```powershell
$body = '{"method":"POST","path":"/api/login","body":{"username":"admin'\'' OR '\''1'\''='\''1"}}'
Invoke-RestMethod -Uri "https://api.sentinel-ai.app/v1/inspect" -Method Post -Headers @{"X-API-Key"="SUA_CHAVE"} -Body $body
```
Esperado: `BLOCK`

### Teste de pagamento — Pagar $1 e Refund (5 min)
1. Abra: https://app.sentinel-ai.app → Signup → criar tenant → copiar API key
2. Dashboard → Upgrade to Pro → pagar $1 com cartão real
3. Stripe Dashboard → Verificar pagamento → Refund imediatamente
