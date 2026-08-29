# Portfólio — Matheus Araújo Macedo

Site pessoal de **ITOps e automação de processos**: resolução de incidentes técnicos e automação
dos chamados recorrentes (n8n, scripts, APIs e banco de dados).

Animações, formulário de contato (Formspree), chatbot com Gemini e deploy em **Cloudflare Pages**.

**Produção:** https://matheusaraujomacedo.pages.dev/

## Stack

| Camada | Tecnologia |
|--------|------------|
| Front-end | HTML5, CSS3, JavaScript (vanilla) |
| Animações | GSAP, ScrollTrigger, Lenis |
| Back-end | Cloudflare Pages Function (`/api/chat`) |
| IA | Google Gemini 2.5 Flash |
| Contato | Formspree |
| Acessibilidade | VLibras |

## Estrutura do projeto

```
├── index.html
├── static/
│   ├── style.css
│   └── js/
│       ├── utils.js       # Helpers e constantes
│       ├── scroll.js      # Lenis (smooth scroll)
│       ├── i18n.js        # Idioma PT/EN e contraste
│       ├── animations.js  # GSAP, typewriter, mobile
│       ├── main.js        # Navegação, modal, formulário, reveals
│       ├── chat.js        # Chatbot
│       └── init.js        # Bootstrap das animações
├── functions/api/chat.js  # API do chatbot (Gemini)
├── wrangler.toml
└── .env.example
```
