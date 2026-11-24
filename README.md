# Rede de Apoio — Alerta de Emergência

Aplicativo mobile de rede de apoio pessoal. Um usuário cadastra pessoas de confiança na sua rede de
apoio; em uma emergência, ele aciona um alerta e todas essas pessoas são notificadas.

> Hipótese que o MVP precisa validar: uma pessoa realmente usaria um app simples para manter uma
> rede de contatos que podem ser avisados rapidamente quando ela precisar de ajuda?

## Status atual

O backend TypeScript contém código para as Fases 1 e 2. O schema MySQL foi migrado no banco local e
o cadastro foi smoke-testado; os demais fluxos ainda precisam de validação. O app Expo em
JavaScript usa a API mobile `src/api/server.js` (separada da API TypeScript). Veja
`tasks/current.md` e `memory/pending.md`.

```text
[x] Fase 1 — Backend básico; migrations aplicadas e cadastro smoke-testado
[~] Fase 2 — Código da rede de apoio; critérios ainda precisam de validação
[~] Fase 3 — App integrado à API mobile legada; integração com a API TypeScript pendente
[ ] Fase 4 — Alerta via botão no app
[ ] Fase 5 — Push notification real
[ ] Fase 6 — Localização no alerta
[ ] Fase 7 — Acionamento por botão físico (Volume Up)
```

Detalhe de cada fase em `spec/architecture/overview.md`.

## Stack

```text
Backend:   Node.js + Express + TypeScript + Prisma + MySQL + JWT + bcryptjs + Zod
Mobile:    App Expo/React Native existente em JavaScript; stack TypeScript/Paper planejado
```

## Como este projeto está organizado

Este projeto usa uma estrutura de **engenharia de contexto** pensada para ser trabalhada por agentes
de IA (Claude, Copilot Agent, etc.) além de humanos. Cada pasta responde a uma pergunta diferente:

| Pasta | Responde a |
|---|---|
| [`AI.md`](./AI.md) | Como um agente de IA deve trabalhar neste projeto |
| [`spec/`](./spec) | O que o sistema deve ser (produto, requisitos, domínios, regras de negócio, casos de uso, arquitetura) |
| [`decisions/`](./decisions) | Por que as decisões técnicas foram tomadas (ADRs) |
| [`tasks/`](./tasks) | O que está sendo feito agora, o que falta, o que já foi concluído |
| [`memory/`](./memory) | O que aconteceu durante o desenvolvimento (estado, problemas, pendências, sessões) |
| [`src/`](./src) | O código: `src/api` (backend) e `src/mobile` (app Expo iniciado, integração pendente) |
| [`tests/`](./tests) | O que foi comprovado que funciona |

**Se você (humano ou agente) for continuar o desenvolvimento, comece por `AI.md`.** Ele descreve o
processo a seguir antes de tocar em qualquer código.

## Rodando o backend localmente

```bash
cd src/api
pnpm install --frozen-lockfile
# consulte .env.example para as variáveis necessárias; não sobrescreva um .env existente
pnpm run prisma:generate
pnpm run prisma:migrate
pnpm run dev
```

Servidor sobe em `http://localhost:3333` (ou na porta definida em `PORT` no `.env`).
`src/api/.env` aparece versionado neste repositório; revise isso antes de adicionar credenciais
reais. Veja `memory/pending.md`.
O schema Prisma e as migrations em `src/api/prisma/` são a fonte de verdade da API TypeScript.
`src/api/server.js` oferece as rotas usadas pelo app mobile e lê `.env.local` antes de `.env`.
Use `pnpm run dev:mobile-api` para iniciá-lo. No Codespaces, a API mobile usa a porta encaminhada
3001; o app detecta a porta e envia credenciais do navegador. Em desenvolvimento local, o padrão é
a porta 3000. Mantenha a porta privada, exceto durante teste autorizado e temporário.
`src/api/schema.sql` continua sendo um protótipo legado; o schema atual é `src/api/prisma/schema.prisma`.

### Endpoints implementados no backend TypeScript

```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria","email":"maria@email.com","password":"123456"}'

curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","password":"123456"}'

curl http://localhost:3333/users/me \
  -H "Authorization: Bearer <token retornado no login>"

curl http://localhost:3333/support \
  -H "Authorization: Bearer <token retornado no login>"
```

Esses comandos descrevem um roteiro; os fluxos ainda não estão registrados como validados. O app
mobile usa atualmente outra base de URL, endpoints e nomes de campos. Não há testes automatizados
implementados; consulte `tests/README.md`.

## Princípios do projeto

- MVP primeiro: nada fora do escopo descrito em `spec/product/overview.md` deve ser implementado
  sem decisão explícita.
- Backend é a autoridade: toda regra de segurança e autorização é validada no backend, nunca só na
  interface.
- Uma fase por vez: não adiantar tecnologia ou funcionalidade de uma fase futura antes da atual
  estar validada (`decisions/ADR-003.md`).
- Nenhuma decisão importante deve existir só em uma conversa: se for uma decisão técnica, vira ADR;
  se for uma regra, vai para `spec/business-rules/`; se for progresso ou descoberta, vai para
  `memory/`.
