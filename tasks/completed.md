# Completed

## TASK-001 — Backend básico (Fase 1)

**Status:** Código implementado. A validação manual do desenvolvedor continua pendente; não há
evidência registrada de execução bem-sucedida dos endpoints.

**Escopo entregue:**

- Projeto Node + Express + TypeScript inicializado em `src/api`.
- `schema.prisma` com model `User` (id, name, email único, passwordHash, timestamps).
- `POST /auth/register`: valida entrada com Zod, verifica e-mail duplicado (409), gera hash com
  `bcryptjs`, cria usuário, retorna JWT.
- `POST /auth/login`: valida credenciais, retorna JWT. Mensagem de erro genérica para credenciais
  inválidas (BR-SEC-05).
- `authMiddleware`: valida JWT do header `Authorization`, injeta `req.userId`.
- `GET /users/me`: rota protegida, retorna dados do usuário autenticado (sem `passwordHash`).
- `errorMiddleware` central, tratando erros do Zod e erros de negócio com `statusCode`.

**Referências:** `spec/use-cases/uc-01-cadastro-login.md`, `decisions/ADR-001.md`,
`decisions/ADR-002.md`.

## Observação de status

Este arquivo registra escopo de implementação, não certifica validação em ambiente real. A
compilação e o fluxo de cadastro/login devem ser confirmados conforme `tasks/current.md`.
