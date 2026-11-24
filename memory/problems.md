# Problemas Encontrados

## 2026-09-03 — Ambiente de geração sem acesso à rede

O código da Fase 1 (`src/api`) foi gerado em um ambiente sandbox sem acesso à rede. Naquele
momento, não foi possível rodar `npm install`, `prisma generate`/`migrate` nem `tsc`. A necessidade
de validação local permaneceu registrada; veja o status atual em `tasks/current.md` e
`memory/pending.md`.

## 2026-09-03 — Diretório residual por expansão de chaves no shell

Ao criar a estrutura de pastas inicial com `mkdir -p api/src/{controllers,services,...}`, o shell do
ambiente de geração não expandiu as chaves corretamente, criando um diretório literal com nome
`{controllers,services,...}` dentro de `src/`. Foi identificado e removido antes do empacotamento
final. Não afeta o projeto atual, mas fica registrado como um lembrete: sempre validar a listagem de
arquivos (`find`) depois de comandos de criação em lote, antes de empacotar/entregar.

## 2026-11-24 — Validação local ponta a ponta pendente

- `pnpm install --frozen-lockfile` restaurou as dependências, mas interrompeu os scripts de
  instalação por política de aprovação do pnpm. O Prisma Client foi gerado explicitamente depois.
- `pnpm run build`, validação do schema e export web passaram. As quatro migrations MySQL foram
  aplicadas no banco local, e um cadastro smoke via API mobile passou; o usuário de teste foi
  removido.
- A porta 3000 já era usada pela API TypeScript e rejeitava o formato de cadastro do app. A API
  mobile foi iniciada na porta 3001, e o app agora detecta essa porta no Codespaces.
- CORS preflight da origem Codespaces passou. A chamada real pelo navegador ainda precisa ser
  confirmada; uma chamada curl sem a sessão autenticada do Codespaces recebeu 401 do encaminhador.
- A porta encaminhada privada 3001 devolveu `401` no preflight do navegador. A pedido do usuário,
  a porta foi tornada pública temporariamente; após reiniciar a API, o preflight devolveu `204` e
  o cadastro no navegador funcionou. A tentativa de restringir novamente a porta foi negada; ela
  permanece pública e deve ser alterada para privada na aba Ports após o teste.
- No Expo Web, `Alert.alert` do React Native Web é um no-op; por isso a confirmação do botão Ajuda
  não chamava o envio. A tela Home passou a usar `window.confirm`/`window.alert` na web e manteve
  `Alert.alert` no nativo. O export web passou após o ajuste.
- A tela de lista também usava `Alert.alert` para erros ao adicionar amigos e não mostrava feedback
  em caso de sucesso. A tela passou a mostrar o resultado inline, normalizar espaços do e-mail e
  evitar envios duplicados enquanto a requisição está em andamento. O backend só vincula e-mails
  que já possuem conta; não envia convite por e-mail.
- A rota mobile `POST /alerts` grava registros no banco, mas não envia push notification. O app
  mostra alertas recebidos na lista; notificações push reais ainda não estão implementadas.
- Não há suíte automatizada para API. Login, perfil e os critérios de rede de apoio ainda precisam
  de validação manual.
- `src/api/.env` aparece entre os arquivos versionados. Seu conteúdo não foi lido nem copiado; o
  desenvolvedor deve verificar localmente se contém credenciais e tratar o arquivo adequadamente.
