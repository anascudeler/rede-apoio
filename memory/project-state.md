# Estado do Projeto

_Última atualização: 2026-11-24_

## API TypeScript (`src/api/src/`)

- Fase 1: cadastro/login, JWT, `GET /users/me`, hash com bcryptjs e validação Zod.
- Fase 2: `SupportRelationship`, migrations, solicitação, aceite, recusa, listagem em ambas as
  direções, remoção pelo solicitante e busca por e-mail em `/users/search`.
- Rotas da API: `/auth/*`, `/users/me`, `/users/search` e `/support/*`.
- As relações são modeladas por FKs nomeadas `Requester` e `Supporter`; o service rejeita uma
  relação `PENDING` existente antes de criar outra.
- `GET /users/search` está implementado diretamente no controller, acessando Prisma fora da camada
  service; a busca usa correspondência parcial (`contains`) e retorna o primeiro resultado.
- `pnpm run build` passou após a geração explícita do Prisma Client; `prisma validate` também passou
  com uma URL fictícia.
- As migrations MySQL estão aplicadas no banco local; o cadastro foi smoke-testado pela API mobile.
- Login, perfil e os critérios de rede de apoio ainda precisam de validação manual.

## Mobile (`src/mobile/`)

- Há um app Expo/React Native em JavaScript com telas de Login, Cadastro, Home, listas e Perfil.
- O token usa `expo-secure-store` em nativo; na web é guardado em `localStorage`.
- O app também contém código de localização, perfil/foto e acionamento por botão/chaveiro.
- O app usa a API mobile em `src/api/server.js`, separada da API TypeScript, com rotas `/me`,
  `/me/location`, `/links` e `/alerts`. O endereço é configurado por `EXPO_PUBLIC_API_URL` ou
  detectado a partir da porta encaminhada no Codespaces.
- No Codespaces, a API mobile está rodando na porta 3001; o banco MySQL local está em Docker,
  limitado a `127.0.0.1:3306`. Credenciais estão em `src/api/.env.local`, ignorado pelo Git.
- O app não usa TypeScript, React Native Paper nem `AuthContext`.
- O script `test` mobile é um placeholder, não uma suíte de testes.

## Verificações técnicas

- Build TypeScript da API: passou em 2026-11-24.
- Validação do schema Prisma e build web Expo: passaram em 2026-11-24.
- Migrations MySQL aplicadas e cadastro smoke-testado; registro de teste removido.
- Preflight CORS da origem Codespaces passou; teste manual no navegador continua pendente.
- Testes automatizados e validação manual dos fluxos: pendentes.

## Ainda não implementado na API TypeScript

- `EmergencyAlert`, `Device`, notificações push e rotas `/alerts` e `/devices`.
- Testes automatizados de API.

## Próxima atividade

Validar login/perfil e os critérios da rede de apoio em `tasks/current.md`. Depois, decidir se a API
mobile legada será mantida ou migrada para a API TypeScript.

## Fontes e legado

`src/api/prisma/schema.prisma` é compartilhado pelas APIs TypeScript (`src/api/src/`) e mobile
(`src/api/server.js`), que ainda têm contratos diferentes. `src/api/schema.sql` é um protótipo
antigo. `src/api/.env` permanece versionado; revisar seu tratamento localmente, sem copiar valores
para a documentação.

## Ambiente de desenvolvimento

O desenvolvedor decidiu trabalhar localmente via VS Code, usando o Copilot Pro com o agente Claude
Sonnet 5 para codificação. Este pacote de contexto (`AI.md`, `spec/`, `decisions/`, `tasks/`,
`memory/`) foi criado para que esse agente (e qualquer outro que venha a trabalhar no projeto) tenha
o contexto necessário sem depender de uma conversa anterior.
