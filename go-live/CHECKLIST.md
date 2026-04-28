# EXECUTE AGORA — Último Checklist

> Nada mais de planejamento. Só ação.

---

## PASSO 1 — COMPRAR DOMÍNIO (5 min)
- [ ] Acesse: https://namecheap.com
- [ ] Busque: `sentinel-ai.app`
- [ ] Compre. Confirme no email.

## PASSO 2 — CRIAR CONTA STRIPE LIVE (10 min)
- [ ] Acesse: https://dashboard.stripe.com
- [ ] Ative modo LIVE (switch no canto superior)
- [ ] Copie:
  - `STRIPE_SECRET_KEY=sk_live_...`
  - `STRIPE_PUBLISHABLE_KEY=pk_live_...`

## PASSO 3 — CRIAR CONTA CLERK (5 min)
- [ ] Acesse: https://dashboard.clerk.com
- [ ] Novo projeto → Copie:
  - `CLERK_SECRET_KEY=sk_live_...`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...`

## PASSO 4 — DEPLOY API PROXY (Railway)
- [ ] Acesse: https://railway.app
- [ ] New Project → Deploy from GitHub → Selecione repo `sentinel-ai`
- [ ] Root Directory: `apps/api-proxy`
- [ ] Add PostgreSQL + Redis (botão "Create" em cada)
- [ ] Environment Variables (cole TODAS as chaves do Passo 2 e 3):

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=(vai gerar depois)
JWT_SECRET=qualquer-string-longa-aleatoria
CLERK_SECRET_KEY=sk_live_...
DASHBOARD_URL=https://app.sentinel-ai.app
ENABLE_E2E=false
```

- [ ] Deploy

## PASSO 5 — DEPLOY DASHBOARD + LANDING (Vercel)
- [ ] Terminal:

```bash
cd D:\sentinel-ai\apps\dashboard
vercel --prod

cd D:\sentinel-ai\apps\landing
vercel --prod
```

- [ ] No Vercel Dashboard → Settings → Domains:
  - Dashboard: `app.sentinel-ai.app`
  - Landing: `sentinel-ai.app`

## PASSO 6 — CONFIGURAR DNS (Namecheap)
- [ ] Namecheap → Domain List → Manage → Advanced DNS:
  - `A Record @` → `76.76.21.21` (Vercel IP)
  - `CNAME Record app` → `cname.vercel-dns.com`
  - `CNAME Record api` → (Railway fornece)

## PASSO 7 — CONFIGURAR STRIPE WEBHOOK
- [ ] Stripe Dashboard → Developers → Webhooks:
  - Endpoint URL: `https://api.sentinel-ai.app/v1/webhooks/stripe`
  - Events: `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`
- [ ] Copie `whsec_...` → cole no Railway como `STRIPE_WEBHOOK_SECRET`

## PASSO 8 — TESTAR (5 min)
- [ ] Abra: https://sentinel-ai.app → deve carregar landing
- [ ] Abra: https://app.sentinel-ai.app → signup → criar tenant → copiar API key
- [ ] PowerShell:

```powershell
$body = '{"method":"POST","path":"/api/login","body":{"username":"admin'\'' OR '\''1'\''='\''1"}}'
Invoke-RestMethod -Uri "https://api.sentinel-ai.app/v1/inspect" -Method Post -Headers @{"X-API-Key"="SUA_CHAVE"} -Body $body
```

- [ ] Deve retornar: `BLOCK`

> 💡 Também disponível como script: `go-live/test-attack.ps1`

## PASSO 9 — PAGAR $1 E REFUND (5 min)
- [ ] Dashboard → Upgrade to Pro → pagar $1 com cartão real
- [ ] Stripe Dashboard → Verificar pagamento → Refund imediatamente

## PASSO 10 — ENVIAR 3 LINKEDIN DMs (15 min)
- [ ] Abra `go-live/assets/phase2-linkedin-dms.md`
- [ ] Copie. Cole no LinkedIn. Envie para:
  1. Madhu Nadig (Flagright)
  2. Richard Scappaticci (Routefusion)
  3. Kristy Gao (Cenote)

## PASSO 11 — DORMIR
- [ ] Você lançou um produto hoje.

---

## AMANHÃ (04:00 BRT)
- [ ] **Product Hunt:** https://producthunt.com → Submit → copiar de `go-live/assets/phase3-product-hunt.md`
- [ ] **Hacker News:** https://news.ycombinator.com/submit → copiar de `go-live/assets/phase4-hacker-news.md`
- [ ] **Twitter:** copiar thread de `go-live/assets/phase5-twitter-thread.md`
- [ ] **Indie Hackers:** https://indiehackers.com → copiar de `go-live/assets/phase6-indie-hackers.md`
- [ ] **Dev.to:** https://dev.to/new → copiar de `go-live/assets/phase7-dev-to.md`

---

## NÃO FAÇA MAIS ISSO
- ❌ Não peça mais código pro Kimi Code
- ❌ Não peça mais prompts
- ❌ Não peça mais planejamento
- ❌ Não peça mais "e se…"

## FAÇA ISSO
- ✅ Compre o domínio
- ✅ Cole as chaves
- ✅ Clique em deploy
- ✅ Envie os DMs
- ✅ Durma
- ✅ Amanhã lance

---

O Kimi Code fez a parte dele. Agora é sua vez.

**Bora.**
