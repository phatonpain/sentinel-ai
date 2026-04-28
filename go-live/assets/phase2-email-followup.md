# Fase 2 — Email Follow-up (enviar amanhã se não responderem)

## Email Madhu

**Assunto:** Flagright + API attacks que WAFs não detectam

Madhu,

Parabéns pelo #1 rating da Flagright no G2 em AML compliance. Processar milhões de transações via API para KYC/AML em escala global é um feito técnico enorme.

Pergunta rápida: como vocês detectam hoje ataques comportamentais em APIs que ferramentas WAF tradicionais não conseguem pegar?

Exemplos do que passa despercebido:
- Um cliente fazendo 1 request a cada 73 segundos por 8 horas (reconnaissance lenta)
- Credenciais testadas em sequência, mas de IPs diferentes a cada vez (credential stuffing distribuído)
- Requests com headers perfeitamente formados, mas behavioral pattern errado (bot sofisticado)

Construí uma ferramenta — Sentinel AI — que usa behavioral AI + ensemble de ML para detectar exatamente esses padrões em tempo real. Zero regras estáticas. Zero falsos positivos. <50ms de overhead.

Funciona como middleware Node.js (2 linhas de código). Pensei que poderia fazer sentido para a Flagright dado o volume e a criticidade das APIs de vocês.

Quer ver uma demo de 5 minutos esta semana?

[Seu nome]
Founder, Sentinel AI
https://sentinel-ai.app

---

## Email Richard

**Assunto:** Routefusion + ataques comportamentais em APIs de FX

Rick,

Parabéns pelo $26.7M Series A da Routefusion. Conectar bancos em 5 mercados via API — EUA, UE, UK, México, Brasil — é um feito técnico e comercial impressionante.

Pergunta direta: com 30+ clientes integrados e volume crescendo de FX cross-border, como vocês garantem que nenhum agente malicioso está explorando padrões de comportamento nas chamadas da API de FX e compliance?

O que WAFs tradicionais não detectam:
- Reconnaissance lenta: 1 request a cada X segundos por horas, mapeando endpoints
- Credential stuffing distribuído: testando credenciais de múltiplos IPs para evitar rate limit
- Bots sofisticados: headers perfeitos, mas behavioral pattern estatisticamente anômalo

Construí uma ferramenta — Sentinel AI — que usa behavioral fingerprinting + ensemble de ML + LLM semântico para detectar exatamente isso em tempo real.

- Zero regras estáticas (não precisa manter regex ou IP blocklists)
- <50ms de overhead por request
- 99.2% precisão, 0.3% falsos positivos
- Middleware Node.js: npm install sentinel-ai (2 linhas de config)

Funciona especialmente bem para APIs financeiras com alto volume e múltiplas jurisdições — exatamente o caso da Routefusion.

Quer ver uma demo de 10 minutos? Tenho disponibilidade esta semana.

[Seu nome]
Founder, Sentinel AI
https://sentinel-ai.app

P.S.: Se não for prioridade agora, sem problema. Posso mandar um relatório técnico sobre behavioral AI para APIs financeiras que escrevi — sem compromisso.

---

## Email Kristy

**Assunto:** Cenote + HIPAA compliance nas APIs sem security engineer

Kristy,

Li sua história na University of Waterloo — como a experiência no ER te levou a fundar a Cenote para resolver o caos de back-office em clínicas. Muito inspirador.

Como CTO de uma equipe de 3 pessoas conectando clínicas a insurance e EHR via API, tenho uma pergunta direta:

Como vocês garantem HIPAA compliance nas APIs que processam PHI (Protected Health Information)?

Dados de pacientes circulando por endpoints = superfície de ataque que regulators não perdoam. E com 3 pessoas, é impossível ter um engenheiro de segurança dedicado.

Construí uma ferramenta — Sentinel AI — que resolve exatamente esse gap:

- Monitora APIs em tempo real com IA behavioral (aprende o normal, detecta o anormal)
- DLP Engine detecta exfiltração de PHI automaticamente (CPF, SSN, health records)
- Gera relatórios de compliance SOC2/GDPR/HIPAA em 1 clique
- Zero regras para configurar, zero manutenção
- Middleware Node.js: npm install sentinel-ai (2 linhas)

E é free para startups YC enquanto vocês estão em seed.

Quer testar? Posso fazer onboarding em 10 minutos.

[Seu nome]
Founder, Sentinel AI
https://sentinel-ai.app

P.S.: Sei que a Cenote está em crescimento rápido (YC W25). Segurança é o tipo de coisa que founders deixam para depois — até que um auditor ou um breach forçam a parar tudo. Quer evitar isso antes que aconteça?
