# Pendências

## Validação das Fases 1 e 2

- Validar login/perfil e o fluxo da rede de apoio com dois usuários. O cadastro foi smoke-testado,
  mas os critérios da TASK-002 ainda não foram comprovados.
- Revisar `src/api/.env`, que está versionado. Confirmar localmente se contém credenciais; se houver
  segredos reais, removê-los do controle de versão e rotacioná-los. Nenhum valor foi copiado para
  estes documentos.

## Decisões em aberto (não implementar sem decidir)

- BR-AUTH-02 (`spec/business-rules/authorization.md`): o `supporterId` também deveria poder remover
  a relação (deixar de apoiar alguém), ou só o `requesterId` remove? Precisa de decisão antes da
  TASK-006.
- Solução de push notification (Expo Notifications, FCM, outra) — a decidir antes da Fase 5
  (TASK-016 no backlog).
- Estratégia de armazenamento seguro do JWT no mobile — o app atual usa `expo-secure-store` em
  nativo e `localStorage` na web; a decisão final ainda precisa ser registrada (TASK-010).

## Integração mobile pendente

- O app Expo usa `src/api/server.js` na porta encaminhada 3001, enquanto a API TypeScript é um
  serviço separado. Decidir posteriormente se os contratos serão unificados.
- A porta encaminhada 3001 está pública temporariamente para o teste do app; voltar para privada
  pela aba Ports do Codespaces.
- O botão Ajuda grava alertas e eles podem ser vistos na lista, mas ainda não há envio de push
  notification para os apoiadores.
- Confirmar se `GET /users/search?email=...` deve aceitar busca parcial; a implementação atual usa
  `contains` e retorna apenas o primeiro resultado encontrado.
