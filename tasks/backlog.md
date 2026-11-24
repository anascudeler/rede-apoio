# Backlog

Tarefas ainda não iniciadas ou parcialmente implementadas, em ordem de fase (ver
`decisions/ADR-003.md`). Não iniciar uma tarefa daqui sem antes movê-la para `tasks/current.md` e
confirmar o escopo. A validação das Fases 1 e 2 está em `tasks/current.md`.

## Fase 2 — Rede de apoio

O escopo de TASK-002 a TASK-007 já está presente no código da API TypeScript. A validação manual e
a verificação dos critérios de aceite permanecem pendentes; não recriar essas tarefas como se o
código ainda não existisse.

## Fase 3 — Aplicativo mobile

- TASK-008: Alinhar/completar o app Expo existente ao stack acordado e à API TypeScript. O app atual
  é JavaScript, não usa React Native Paper e consome rotas do protótipo legado.
- TASK-009: Corrigir e validar Login/Cadastro com os contratos `password` e `POST /auth/*` da API.
- TASK-010: Unificar o estado de autenticação; SecureStore está implementado em nativo, mas a web
  usa `localStorage` e ainda não há `AuthContext`.
- TASK-011: Adaptar a Home existente aos endpoints atuais e validar seus contadores.
- TASK-012: Adaptar as listas existentes às respostas e ações de `GET /support` e demais rotas.

## Fase 4 — Alerta

- TASK-013: Modelar `EmergencyAlert` no Prisma e migrar.
- TASK-014: Implementar `POST /alerts` (criação do alerta + busca de apoiadores `ACCEPTED`, sem
  envio de push real ainda).
- TASK-015: Botão de emergência na Home + tela/diálogo de confirmação.

## Fase 5 — Push notification

- TASK-016: ADR de escolha da solução de push (a decidir).
- TASK-017: Modelar `Device` no Prisma e migrar.
- TASK-018: Implementar `POST /devices` e `DELETE /devices/:id`.
- TASK-019: Implementar envio real de notificação a partir de `POST /alerts`.

## Fase 6 — Localização

- TASK-020: Adicionar `latitude`/`longitude` (opcionais) ao `EmergencyAlert`.
- TASK-021: Capturar localização no mobile no momento do acionamento do alerta.

## Fase 7 — Volume Up

- TASK-022: Investigar limitações de interceptação de Volume Up por plataforma/versão.
- TASK-023: Implementar acionamento via Volume Up disparando o mesmo `EmergencyTrigger` do botão na
  tela.
