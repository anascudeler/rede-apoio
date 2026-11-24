# Domínio — SupportRelationship

## Status

Implementado no schema Prisma, migrations, rotas e service da API TypeScript (Fase 2). A validação
dos critérios de aceite em execução continua pendente; veja `tasks/current.md`.

## Conceito

Representa uma relação de rede de apoio entre dois usuários. **Não deve ser modelada como duas
listas independentes** — é um relacionamento único com dois papéis.

```text
requesterId → pessoa que solicitou apoio (quem vai receber os alertas)
supporterId → pessoa que foi convidada para apoiar (quem vai receber a notificação)
```

Exemplo: `requesterId = Maria`, `supporterId = João` significa "Maria quer que João receba seus
alertas".

## Como isso aparece na interface

- Na tela de Maria (`requesterId`), João aparece em **Apoiando**.
- Na tela de João (`supporterId`), Maria aparece em **Apoiado por**.

## Entidade

```text
SupportRelationship
-------------------------
id            Int      PK
requesterId   Int      FK → User
supporterId   Int      FK → User
status        Enum     PENDING | ACCEPTED | REJECTED
createdAt     DateTime
updatedAt     DateTime
```

`status` é modelado como enum com espaço para evoluir (`BLOCKED` é um valor futuro considerado no
produto, mas não implementado no MVP — ver `spec/product/overview.md`).

O service verifica solicitações `PENDING` existentes antes de criar outra. O banco não possui
índice único por par; a proteção contra solicitações pendentes duplicadas ainda precisa ser
validada, inclusive sob requisições concorrentes.

## Regras de negócio

Ver `spec/business-rules/support-relationship-rules.md` para as regras de autorização e transição
de estado.
