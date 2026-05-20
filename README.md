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

## Desenvolvimento local

### 1. Site estático

Abra com qualquer servidor local na raiz do repositório:

```bash
npx serve .
```

Ou use a extensão **Live Server** do VS Code apontando para `index.html`.

### 2. Chatbot com API (Cloudflare)

O chat em produção chama `POST /api/chat`. Localmente, use o Wrangler:

```bash
npm install -g wrangler
cp .env.example .env
# Edite .env e preencha GEMINI_API_KEY

npx wrangler pages dev .
```

Acesse a URL indicada pelo Wrangler (geralmente `http://localhost:8788`).

> **Segurança:** nunca commite o arquivo `.env`. A chave deve existir apenas localmente e como **secret** na Cloudflare.

## Deploy (Cloudflare Pages)

1. Conecte o repositório em **Workers & Pages → Create → Pages → Connect to Git**.
2. Build settings:
   - **Build command:** (vazio)
   - **Build output directory:** `/` (raiz)
3. Em **Settings → Environment variables**, adicione o secret:
   - `GEMINI_API_KEY` = sua chave Gemini
4. Faça deploy. A rota `/api/chat` será servida automaticamente por `functions/api/chat.js`.

Deploy manual via CLI:

```bash
npx wrangler pages deploy .
```

## Assets

| Arquivo | Uso |
|---------|-----|
| `Curriculo_Matheus_Araujo_Macedo.pdf` | CV linkado no botão "Baixar CV" |
| `matheusaraujo.jpeg` | Foto do hero |
| `Matheus-curriculo.pdf` | Cópia alternativa (não referenciada no HTML) |

## Checklist de testes

- [ ] Scroll suave (Lenis) e botão "voltar ao topo"
- [ ] Troca de idioma (PT/EN) e modo contraste
- [ ] Filtros e modal de projetos
- [ ] Flip de cards no mobile
- [ ] Envio do formulário de contato
- [ ] Chatbot: envio de mensagem e resposta da IA
- [ ] Links externos (GitHub, LinkedIn, WhatsApp)

## Licença

Uso pessoal — © Matheus Araújo Macedo
