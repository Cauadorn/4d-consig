# 4D Consig — landing page

Landing page da **4D Consig**, a frente da 4D de captação de clientes para Corbans e promotoras de crédito consignado.
Substitui a página atual em https://4dimensoes.com/4d-consig/ (mesma estrutura e mesmos textos do briefing, com visual novo).

> **Endereço local:** http://localhost:5200 · **Comando:** `npm run dev`

---

## Qual código o site usa

| Linguagem / ferramenta | Para quê | Onde fica |
|---|---|---|
| **HTML** | estrutura e textos da página | `site/index.html`, `site/obrigado.html` |
| **CSS** | visual: cores, fontes, layout, animações, versão para celular | `site/assets/css/style.css` |
| **JavaScript** | interações: menu, animações, funil, planos mensal/anual, formulário em 2 etapas | `site/assets/js/` |
| **Node.js + Vite** | só na máquina de quem desenvolve: roda o `localhost` e gera a versão final otimizada | `package.json`, `vite.config.js` |

Não usa React, WordPress nem Elementor. O resultado final é um site estático (HTML + CSS + JS) que funciona em qualquer hospedagem.

---

## Estrutura de pastas

```
LP 4D Consig [4D]/
│
├── site/                      ← CÓDIGO DO SITE (tudo o que vira a página)
│   ├── index.html             página principal
│   ├── obrigado.html          página de obrigado (depois do formulário)
│   ├── assets/
│   │   ├── css/style.css      visual (cores e fontes no topo, em :root)
│   │   ├── js/config.js       ⚙️ CONFIGURAÇÕES: WhatsApp, formulário, plano mensal/anual
│   │   ├── js/main.js         interações da página principal
│   │   ├── js/cookies.js      aviso de cookies
│   │   ├── js/obrigado.js     script da página de obrigado
│   │   └── img/               imagens do site (.webp), logos e favicon
│   └── public/                arquivos copiados como estão (vazio por enquanto)
│
├── _materiais/                ← MATERIAIS DE APOIO (não vão para o site)
│   ├── logos/                 logo 4D Consig (branco e escuro) e logos da 4D
│   ├── imagens/
│   │   ├── geradas-ia/        originais em alta das imagens (Higgsfield)
│   │   └── fotos-reais/       coloque aqui fotos reais para substituir as de IA
│   ├── videos/                vídeos brutos, se houver
│   └── briefing/              copy aprovada (PDF original + resumo em .md)
│
├── LOGO/                      logo original enviado (não mexer)
├── scripts/empacotar.mjs      gera o .zip de publicação
├── .vscode/                   atalhos (tarefas) do Antigravity/VS Code
├── package.json               comandos do projeto e dependências
├── vite.config.js             servidor local (porta 5200) e build
├── .nvmrc                     versão do Node (22)
├── .editorconfig              padrão de formatação do código
│
├── node_modules/              (gerada pelo npm install; não mexer, não enviar)
└── dist/                      (gerada pelo npm run build; é o que vai para a hospedagem)
```

---

## 1. Instalar (uma vez só por computador)

1. Instale o **Node.js 22 LTS**: https://nodejs.org → botão "LTS".
2. Abra esta pasta (`LP 4D Consig [4D]`) no **Antigravity** ou no VS Code: *File → Open Folder*.
3. Abra o terminal integrado (`Ctrl + '`) e rode:

```bash
npm install
```

## 2. Rodar o site (localhost)

```bash
npm run dev
```

O navegador abre em **http://localhost:5200**. A página se atualiza sozinha a cada arquivo salvo. Para parar, `Ctrl + C` no terminal.

**Sem terminal:** `Ctrl + Shift + P` → *Tasks: Run Task* → **▶ Rodar site (localhost:5200)**.

### Portas: cada projeto tem a sua

| Projeto | Porta |
|---|---|
| 4D Eventos | 5173 |
| X3 | 4173 |
| Projetos de vídeo (Remotion) | 3000 |
| 4D Travel | 5180 |
| 4D Hotelaria e Turismo | 5190 |
| **4D Consig** | **5200** (conferência do build: 4200) |

A porta é fixa (`strictPort`). Se aparecer *"Port 5200 is already in use"*, o site já está rodando em outro terminal. Para mudar a porta, edite `server.port` no `vite.config.js`.

## 3. Antes de publicar: configurações

Tudo fica em **[`site/assets/js/config.js`](site/assets/js/config.js)**:

| Campo | O que colocar | Situação |
|---|---|---|
| `whatsapp` | número com DDI + DDD, só números (ex.: `5531999998888`) | ⚠️ provisório |
| `whatsappMessage` | mensagem que já vem escrita no WhatsApp | ✅ |
| `formEndpoint` | URL que recebe os dados do formulário (ver seção 5) | ⚠️ vazio = modo demonstração, não envia os dados |
| `thankYouPage` | página exibida após o envio | ✅ `obrigado.html` |
| `defaultBilling` | `'annual'` ou `'monthly'`: qual preço aparece primeiro nos planos | ✅ anual |

Preços dos planos: atributos `data-monthly` e `data-annual` de cada `<article class="plan">` no `index.html`. A economia anual e o preço riscado são calculados sozinhos.

## 4. Gerar a versão final e publicar

```bash
npm run build     # gera a versão final na pasta dist/
npm run preview   # confere a versão final em http://localhost:4200
npm run entrega   # faz o build e cria 4d-consig-publicar.zip
```

**Publicar = enviar o conteúdo da pasta `dist/`** (ou do `.zip`) para a pasta pública da hospedagem, por exemplo `public_html/4d-consig/`, o que resulta em `https://4dimensoes.com/4d-consig/`. Como os caminhos são relativos, funciona na raiz, numa subpasta ou num subdomínio.
Hoje essa URL é uma página do WordPress/Elementor: antes de subir, despublique (ou mude o slug) da página atual para não haver conflito.

## 5. Formulário: para onde vão os dados

Com `formEndpoint` vazio, o formulário valida os campos e leva à página de obrigado, **sem enviar os dados**. Para receber os pedidos, informe uma URL que aceite `POST` com `FormData`:

- **Contact Form 7 (WordPress):** `https://4dimensoes.com/wp-json/contact-form-7/v1/contact-forms/ID/feedback`. Crie o formulário no CF7 com os mesmos `name` da tabela abaixo. A partir da versão 5.8, o CF7 também exige um campo oculto `_wpcf7_unit_tag`.
- **Webhook de CRM** (RD Station, HubSpot, Make, Zapier…) ou **Formspree**.

| Campo | name | Obrigatório |
|---|---|---|
| Investimento mensal em marketing | `your-investment` | sim |
| Objetivo principal | `your-goal` | não |
| Nome | `your-name` | sim |
| Empresa | `your-company` | sim |
| E-mail | `your-email` | sim |
| WhatsApp | `your-phone` | sim |
| Plano escolhido (preenchido ao clicar em "Escolher…") | `your-plan` | não (oculto) |
| Aceite LGPD | `acceptance-lgpd` | sim |

O formulário tem 2 etapas (1: investimento e objetivo · 2: contato). Sem JavaScript, as duas aparecem juntas e o envio continua possível.

**Rastreamento:** todos os botões de ação têm `data-cta="…"` (hero, solucao, sobre, planos, validacao, final, sticky, faq, whatsapp-form) e os de plano têm `data-choose="Iniciante|Avançado|Premium"`. Use isso no Google Tag Manager para medir qual CTA converte mais.

## 6. Sequência das seções (segue o briefing, não alterar)

Hero (problema) → Dores → Solução (5 entregas) → Sobre → Planos → Validação → Formulário → FAQ → CTA final → rodapé da 4D principal → página de obrigado.
Briefing completo: [`_materiais/briefing/`](_materiais/briefing/briefing-4d-consig.md).

## 7. Identidade visual

- **Cores:** azul 4D `#003fff` (o mesmo do logo), escuro `#050818`, papel `#f4f1ea`, verde "aprovado" `#3ddc97` (só em sinais positivos). Ficam no topo do `style.css`.
- **Fontes:** Archivo e JetBrains Mono (Google Fonts), as mesmas das LPs 4D Eventos, Travel e Hotelaria.
- **Topo:** dois blocos separados com cantos arredondados (bege com a promessa + foto com os leads chegando), na linha da referência kit.com.
- **Logo:** `site/assets/img/logo-4d-consig-escuro.png` no topo claro e `logo-4d-consig.png` (4D branco) sobre fundo escuro. Originais em `_materiais/logos/`.

### Neuromarketing aplicado aos CTAs

| Recurso | Onde |
|---|---|
| Verbo em 1ª pessoa ("Quero…", "Escolher…") | todos os botões |
| Redução de risco logo abaixo do botão ("gratuito e sem compromisso") | hero, solução, validação, CTA final |
| Prova social perto do botão (+1200 ativos, Google Partner, Meta Blueprint, clientes) | hero e Sobre |
| Tira de leads: cartão "Novo lead qualificado" que troca sozinho e no clique | topo (ilustrativo) |
| Plano do meio em destaque ("Mais popular") + preço anual com o mensal riscado | Planos |
| "Para quem é" em cada plano: a pessoa se identifica e escolhe mais rápido | Planos |
| Plano escolhido já aparece marcado no formulário | Planos → Formulário |
| Formulário em 2 etapas, começando pelos cliques fáceis, com barra de progresso | Formulário |
| CTA fixo no celular | depois do hero, some no formulário |

## 8. Passar o projeto para outra pessoa

Compacte a pasta **sem** `node_modules/` e `dist/`. Quem receber abre a pasta no editor, roda `npm install` e depois `npm run dev`.

## 9. Pendências antes de ir ao ar

- [ ] Número oficial do WhatsApp (`config.js`)
- [ ] `formEndpoint` configurado e testado
- [ ] Revisar os textos novos que não estavam no briefing: "Se alguma destas soa familiar…" (dores), microcopies dos CTAs, frase do Sobre ("Seu Corban merece…"), frase do CTA final e o subtítulo do FAQ
- [ ] Confirmar os números do painel de Validação (hoje ilustrativos, marcados como "Exemplo ilustrativo")
- [ ] Trocar as imagens de IA por fotos reais, se houver
- [ ] Google Tag Manager / Meta Pixel no `<head>` das duas páginas, se for usar
