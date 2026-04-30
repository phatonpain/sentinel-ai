# Sentinel API Landing Page

Landing page premium para o Sentinel API — AI-Powered API Security & Threat Detection.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animações)
- **Lucide React** (ícones)

## Scripts

```bash
# Desenvolvimento (localhost:3002)
npm run dev

# Build de produção
npm run build

# Type checking
npm run typecheck

# Lint
npm run lint
```

## Estrutura

```
app/
  layout.tsx      # Layout principal com SEO e meta tags
  page.tsx        # Página principal (composição de seções)
  globals.css     # Estilos globais e Tailwind
components/
  navbar.tsx              # Navegação fixa com mobile menu
  hero-section.tsx        # Hero com gradiente e animações
  social-proof.tsx        # Contadores animados e logos
  features-grid.tsx       # Grid 3x2 de recursos
  interactive-demo.tsx    # Demo com input e resultados mock
  pricing-section.tsx     # 3 planos com card Pro destacado
  code-snippet.tsx        # Blocos de código com syntax highlight
  testimonials.tsx        # Cards de depoimentos
  footer.tsx              # CTA final + links + copyright
  animated-counter.tsx    # Componente de contador animado
```

## SEO

- Meta tags Open Graph configuradas
- Schema.org JSON-LD (SoftwareApplication)
- Meta tags Twitter Card
- Favicon SVG inline

## Deploy

Otimizado para **Vercel** e **Railway**:

```bash
npm run build
```

O build gera páginas estáticas otimizadas.
