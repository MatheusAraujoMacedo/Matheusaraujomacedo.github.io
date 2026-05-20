# Portfólio — Matheus Araújo Macedo

Site pessoal com animações, formulário de contato (Formspree), chatbot com Gemini e deploy em **Cloudflare Pages**.

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
│       ├── effects.js     # Partículas e cursor glow
│       ├── i18n.js        # Idioma PT/EN e contraste
│       ├── animations.js  # GSAP, typewriter, mobile
│       ├── chat.js        # Chatbot
│       └── main.js        # Navegação, modal, formulário, init
├── functions/api/chat.js  # API do chatbot (Gemini)
├── wrangler.toml
└── .env.example
```

