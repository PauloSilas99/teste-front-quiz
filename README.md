# front-quiz

Front do **Quiz Diagnóstico ENEM**: quiz público (perguntas da API), captura de lead, resultado com pontuação/faixa e admin protegido para leads e métricas.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **React Router** (rotas públicas + admin)
- **TanStack Query** (dados da API)
- **React Hook Form** + **Zod** (formulários)
- **Tailwind CSS v4** + componentes no estilo **shadcn/ui**
- **Framer Motion**, **Recharts** (dashboard admin)
- **Embla** (carousel)

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- API `back-quiz` rodando (default `http://localhost:3333`)

### 1. Instalar

```bash
cd front-quiz
npm install
```

### 2. Variáveis de ambiente

Copie o exemplo e ajuste se a API não estiver na porta padrão:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_API_URL` | Não* | Base da API. Default no código: `http://localhost:3333` se omitida |

\*Recomendado definir explicitamente em `.env`:

```env
VITE_API_URL=http://localhost:3333
```

Reinicie o Vite após mudar `.env` (variáveis `VITE_*` são injetadas no build).

### 3. Desenvolvimento

```bash
npm run dev
```

App em `http://localhost:5173` (porta do Vite).

### Scripts

| Script | Comando |
|--------|---------|
| Dev | `npm run dev` |
| Build produção | `npm run build` |
| Preview do build | `npm run preview` |
| Lint | `npm run lint` |

### Ordem sugerida (full stack)

```bash
# terminal 1 — API
cd back-quiz && npm run start:dev

# terminal 2 — front
cd front-quiz && npm run dev
```

---

## Rotas da aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Home do diagnóstico |
| `/quiz` | Perguntas (API `GET /questions`) |
| `/captura` | Nome, e-mail, telefone → `POST /quiz/submit` |
| `/resultado` | Score, faixa, carousel de respostas |
| `/admin/login` | Login JWT |
| `/admin/leads` | Dashboard + lista paginada + export CSV |

Admin exige token no `localStorage` (contexto de auth).

---

## Funcionalidades do admin

- Card de **total de leads**
- **Pie chart** por faixa + **bar chart** etapa dos estudos + **area chart** fluxo de cadastros  
  (dados de `GET /leads/stats` — sem cálculo de agregação no front)
- Lista com busca/filtro, **10 por página**, detalhe em sheet
- Layout responsivo (cards no mobile, tabela no desktop)
- **Exportar CSV**: download de todos os leads do filtro (não só a página atual)

Credenciais: as mesmas do seed no back (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

---

## Decisões técnicas

1. **Sem dados mock no fluxo principal**  
   Perguntas, score, faixas e leads vêm da API. Placeholders de UI foram removidos.

2. **Sessão do quiz no client**  
   Respostas ficam em `QuizSessionProvider` (memória + result em `sessionStorage`) entre `/quiz` → `/captura` → `/resultado`. O score **não** é calculado no front.

3. **TanStack Query**  
   Cache de questions, leads, stats e mutations (login, submit, export).

4. **Validação no client + server**  
   Zod/RHF no form de lead e login; back revalida com class-validator. Telefone BR com máscara e dígitos no submit.

5. **Auth admin simples**  
   JWT no localStorage; `PrivateRoute` barra rotas sem token. Sem refresh token no MVP.

6. **Design system**  
   Tokens CSS “Pulse Teal”, componentes shadcn, tema claro/escuro.

7. **Dashboard**  
   Gráficos Recharts + wrappers shadcn `Chart`; carousel Embla no mobile para os widgets.

8. **Cliente HTTP**  
   `apiClient` central (`fetch` + Bearer opcional + erros Nest). Export CSV usa `fetch` com download de blob.

9. **Rate limit**  
   Tratado no back (429). UI de submit usa `isPending` para evitar clique duplo acidental.

10. **Feature folders**  
    `features/auth`, `quiz`, `lead`, `admin` + `app/` (router, layouts, providers) + `shared/`.

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

## Nota sobre testes no front

Não há Jest/Vitest configurado neste pacote. Lógica de formulário (Zod) e mapeamento de API são os principais candidatos a testes unitários se forem adicionados depois (preferível Vitest no ecossistema Vite).
