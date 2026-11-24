# Testes

## Status atual

Ainda não há testes automatizados do projeto. O script `test` do app mobile é apenas um placeholder
que termina com erro. A validação manual completa das Fases 1 e 2 continua pendente.

Validações executadas em 2026-11-24:

- `pnpm run build` em `src/api`: passou após gerar explicitamente o Prisma Client.
- `prisma validate --schema prisma/schema.prisma`: passou usando uma `DATABASE_URL` fictícia; não
  conectou a um banco nem validou migrations em execução.
- As quatro migrations MySQL foram aplicadas e `prisma migrate status` reportou o schema atualizado.
- Cadastro via `src/api/server.js` + MySQL local passou (HTTP 200); o usuário descartável foi removido.
- Preflight CORS da origem Codespaces foi verificado (HTTP 204). A chamada pelo navegador ainda
  precisa ser confirmada na sessão do desenvolvedor.

Consulte `memory/problems.md` para o bloqueio restante de validação ponta a ponta.

## Estratégia planejada

- Backend: testes de service com Jest, e testes de rota (Controller + Service + banco de teste) com
  Supertest, focados nas regras de negócio e autorização descritas em `spec/business-rules/` — não
  apenas "o endpoint responde 200".
- Todo novo `*.service.ts` deve ganhar um `*.service.test.ts` cobrindo pelo menos os critérios de
  aceite da tarefa que o originou (ver `tasks/`).
- Testes existentes servem como especificação executável — antes de alterar um comportamento já
  testado, leia o teste correspondente (ver `AI.md`, seção 5).

## Convenção de nomes (a partir do primeiro teste)

```text
src/api/src/services/auth.service.ts
src/api/src/services/__tests__/auth.service.test.ts
```

A ferramenta de execução (Jest) e a configuração serão adicionadas junto com o primeiro teste real,
não antes — para não introduzir dependência sem uso imediato.
