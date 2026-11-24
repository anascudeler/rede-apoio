# Validação local das Fases 1 e 2

## Status

O banco MySQL local foi provisionado, as quatro migrations estão aplicadas, e um cadastro de smoke
pela API mobile passou. O build TypeScript também passou. Ainda faltam validação manual de login,
perfil, rede de apoio e dos critérios da TASK-002 (detalhes em `memory/problems.md`).

## Próximos passos

1. Validar manualmente login e perfil pela API TypeScript.
2. Validar o fluxo de rede de apoio com dois usuários e os critérios da TASK-002.
3. Testar o cadastro pelo navegador do Codespaces com a porta 3001 encaminhada.
4. Registrar cada resultado em `memory/` e só então atualizar o status das fases.

## Código da Fase 2 já presente

- Model `SupportRelationship` e migrations no Prisma.
- Solicitar, aceitar, recusar, listar e remover relações por rotas protegidas.
- Busca autenticada por e-mail em `GET /users/search?email=...`.

## Critérios de validação pendentes

- Uma solicitação `PENDING` duplicada no mesmo sentido deve ser rejeitada.
- Apenas o `supporterId` deve aceitar/recusar e somente enquanto a relação estiver `PENDING`.
- `GET /support` deve retornar ambas as direções com seus status.
- Remoção deve respeitar BR-AUTH-02.
- `GET /users/search` deve exigir autenticação e retornar somente dados mínimos.
- O fluxo Maria → João deve funcionar com dois usuários reais no banco local.

## Próxima integração mobile

O app em `src/mobile/` usa atualmente `src/api/server.js`, uma API mobile separada da API
TypeScript descrita acima. O cadastro foi smoke-testado localmente; não considerar a Fase 3
integrada à API TypeScript até alinhar os contratos.
