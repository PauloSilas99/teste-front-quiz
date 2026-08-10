# front-quiz

Front do **Quiz Diagnóstico ENEM**: quiz público com perguntas da API, captura de lead, resultado (score e faixa vindo do backend) e área admin protegida para leads e métricas.

## Deploy (produção)

| Recurso | URL |
|---------|-----|
| **Front** | https://teste-front-quiz.vercel.app |
| **API** | https://teste-back-quiz.onrender.com |

Na Vercel, `VITE_API_URL` = URL da API na Render.  
No back (Render), `CORS_ORIGIN` deve incluir `https://teste-front-quiz.vercel.app`.

**Build (Vercel):** `npm run build` (`tsc -b && vite build` → pasta `dist`).

Admin em produção: https://teste-front-quiz.vercel.app/admin/login  

---

## Stack

- **React 19** + **TypeScript** + **Vite**  
- **React Router** (rotas públicas + admin)  
- **TanStack Query** (cache e dados da API)  
- **React Hook Form** + **Zod** (formulários)  
- **Tailwind CSS** + componentes no estilo **shadcn/ui**  
- **Framer Motion**, **Recharts** (dashboard)  
- **Embla** (carousel)

---

## Como rodar localmente

### Pré-requisitos

- **Node.js 20+** e npm  
- Uma API acessível em uma destas formas:  
  - **local:** `back-quiz` com `npm run start:dev` em `http://localhost:3333`  
  - **ou produção:** https://teste-back-quiz.onrender.com (útil se só quiser rodar o front localmente)

### Passo a passo

#### 1. Instalar

```bash
cd front-quiz
npm install
```

#### 2. Arquivo `.env`

```bash
cp .env.example .env
```

Única variável de ambiente:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_API_URL` | Recomendada | Base da API, **sem** barra no final |

**Desenvolvimento com back local:**

```env
VITE_API_URL=http://localhost:3333
```

**Front local apontando para a API de produção:**

```env
VITE_API_URL=https://teste-back-quiz.onrender.com
```

No código (`shared/api` e `api-client`), se `VITE_API_URL` não existir, o fallback é `http://localhost:3333`.

> Variáveis `VITE_*` são embutidas no build. Depois de mudar o `.env`, **pare e suba de novo** o `npm run dev` (ou rode um build novo).

#### 3. Subir o Vite

```bash
npm run dev
```

- Dev server: **http://localhost:5173** (porta padrão do Vite; se ocupada, o Vite mostra outra)  
- Hot reload ativo  

Não há proxy no `vite.config.ts`: o browser chama a API direto em `VITE_API_URL` (CORS precisa liberar a origin do front no back).

#### 4. Stack completo (recomendado)

Dois terminais:

```bash
# terminal 1 — API (pasta back-quiz, com .env + DB + seed já ok)
cd back-quiz
npm install
# (primeira vez: prisma generate, migrate, seed — ver README do back)
npm run start:dev
```

```bash
# terminal 2 — front
cd front-quiz
npm install
# .env → VITE_API_URL=http://localhost:3333
npm run dev
```

Abra http://localhost:5173  

| Uso | URL |
|-----|-----|
| Quiz | http://localhost:5173/ |
| Admin | http://localhost:5173/admin/login |

Credenciais do admin = seed do back (`ADMIN_EMAIL` / `ADMIN_PASSWORD`; no exemplo: `comercial@hotmail.com` / `admin123`).

#### 5. Build e preview local

```bash
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve o dist (útil para validar build)
```

### Scripts npm

| Script | O que faz |
|--------|-----------|
| `npm run dev` | Vite em modo desenvolvimento |
| `npm run build` | Typecheck + build de produção |
| `npm run preview` | Serve o `dist` localmente |
| `npm run lint` | ESLint |

### Problemas comuns

| Sintoma | Causa provável |
|---------|----------------|
| Quiz não carrega perguntas | API desligada ou `VITE_API_URL` errada |
| Erro de CORS no browser | Back sem a origin do front em `CORS_ORIGIN` (ex.: `http://localhost:5173`) |
| 401 no admin | Token ausente/expirado ou API/JWT diferentes do esperado |
| Produção lenta na 1ª chamada | Cold start da Render (free tier) |

---

## Rotas da aplicação

| Ambiente | Base |
|----------|------|
| Local | http://localhost:5173 |
| Produção | https://teste-front-quiz.vercel.app |

| Path | Descrição |
|------|-----------|
| `/` | Home do diagnóstico |
| `/quiz` | Perguntas (`GET /questions`) |
| `/captura` | Nome, e-mail, telefone → `POST /quiz/submit` |
| `/resultado` | Score, faixa e resumo das respostas |
| `/admin/login` | Login JWT |
| `/admin/leads` | Dashboard, lista paginada e export CSV |

Atalhos produção:

- https://teste-front-quiz.vercel.app/  
- https://teste-front-quiz.vercel.app/admin/login  

Admin: token no `localStorage` + `PrivateRoute` no front; rotas `/leads*` protegidas com JWT no backend.

---

## Fluxo do usuário

```
Home → Quiz (1 pergunta por vez, pode voltar)
     → Captura de lead
     → Resultado (score + faixa + resumo)
```

Objetivo de UX: **um fluxo linear, curto e legível**, com feedback de carregamento/erro e mobile em primeiro plano (tráfego típico de quiz).

---

## Área administrativa

- Total de leads  
- Gráficos: distribuição por faixa, etapa dos estudos e cadastros no tempo (`GET /leads/stats`)  
- Lista com busca (nome/e-mail), filtro por faixa, **10 por página**  
- Detalhe em sheet (todas as respostas)  
- Export CSV do filtro completo (não só a página atual)  
- Layout responsivo (cards no mobile, tabela no desktop)

Credenciais: as mesmas do seed no back (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

---

## Decisões técnicas

1. **Sem mock no fluxo principal**  
   Perguntas, score, faixas e leads vêm da API.

2. **Sessão do quiz no client**  
   Respostas em `QuizSessionProvider` (memória + resultado em `sessionStorage`) entre `/quiz` → `/captura` → `/resultado`. O **score não é calculado no front**.

3. **TanStack Query**  
   Cache de questions, leads, stats e mutations (login, submit, export).

4. **Validação dupla**  
   Zod/RHF no client; backend revalida com class-validator. Telefone BR com máscara e envio só com dígitos.

5. **Auth admin: JWT access, sem refresh token**  
   Login grava um único `accessToken` (JWT) no `localStorage`, com `PrivateRoute` nas rotas `/admin/*`.  
   **Não usei refresh token de propósito:** a área admin é interna, com um usuário fixo de seed e uso pontual (consultar leads, filtrar, exportar). Sessão com JWT de prazo definido (1 dia no backend) e novo login ao expirar é suficiente neste contexto — refresh token traria complexidade (rota de renovação, rotação, armazenamento seguro) sem ganho relevante para o escopo do produto e do teste.

6. **Design system**  
   Tokens CSS, componentes shadcn-like, foco em legibilidade e hierarquia visual do fluxo.

7. **Dashboard**  
   Recharts; agregações já resolvidas no back.

8. **Cliente HTTP central**  
   `apiClient` (`fetch` + Bearer opcional + erros Nest). CSV via blob download.

9. **Feature folders**  
   `features/auth`, `quiz`, `lead`, `admin` + `app/` + `shared/`.

---

## Processo e produto

Comecei pela **referência visual**: exemplos no Dribbble e leitura das telas no Figma, para alinhar hierarquia, respiro e sensação de produto de aquisição (não de painel genérico).

Em seguida, **estrutura de pastas por feature** e o mapa do fluxo público (home → quiz → captura → resultado), priorizando:

- progresso claro (“pergunta N de M”)  
- volta e troca de resposta  
- formulário curto antes do resultado  
- estados de loading e erro compreensíveis  

O deploy do front ficou na **Vercel**, com `VITE_API_URL` apontando para a API na **Render**.

### Com mais tempo

- Testes (Vitest) nos schemas Zod e no cliente HTTP  
- Polimento extra de empty/error states e microinterações  
- Detalhe do lead com ainda mais contexto das perguntas/respostas do quiz (sem mudar o modelo de auth)

### Ferramentas no desenvolvimento

Durante o desenvolvimento usei o **Cursor** no código e o **Claude** em algumas dúvidas de UI, arquitetura de pastas e integração com a API.

---

## Estrutura (resumo)

```
src/
  app/           router, layouts, providers
  features/
    auth/        login, context, private route
    quiz/        home, steps, result, session
    lead/        captura + schema Zod
    admin/       leads list, stats charts
  shared/
    api/         types + funções HTTP
    components/  ui + quiz UI
    lib/         api-client, utils
```

---

## Testes no front

Não há suite unitária configurada neste pacote. Candidatos naturais: schemas Zod (lead/login) e mapeamento das respostas da API (Vitest no ecossistema Vite).
