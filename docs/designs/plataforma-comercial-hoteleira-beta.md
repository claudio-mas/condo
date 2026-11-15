# Plataforma Comercial Hoteleira — desenho formal da beta

* **Author:** Cláudio Más
* **Status:** Approved — desenho formal e plano detalhado aprovados pelo solicitante; homologação comercial pendente
* **Date:** 2026-11-11
* **Updated:** 2026-11-15

Documento iniciado a partir do [brief aprovado](../../concepts_brief.md), publicado como [RFC](plataforma-comercial-hoteleira-beta-rfc.md). O solicitante autorizou a publicação do RFC seguida da elaboração deste desenho, aprovou o primeiro bloco (Overview, The Problem, Goals e Non-Goals) e escolheu a opção TypeScript/Next.js e PostgreSQL. Em 2026-11-13, aprovou também o bloco técnico, incluindo jornadas e requisitos de operação, a seção de alternativas e o plano detalhado com suas dependências auxiliares. A versão formal é salva em `docs/designs/plataforma-comercial-hoteleira-beta.md`, no destino escolhido pelo solicitante.

O [desenho do piloto, revisão 1](<../../Desenho do piloto - Plataforma comercial hoteleira.md>) é a base funcional. O [plano de implementação, revisão 1](<../../Plano de implementacao - Plataforma comercial hoteleira.md>) é uma proposta técnica anterior; seus arquivos e serviços ainda não existem. Este documento incorpora as recomendações conceituais aprovadas e distingue as decisões já aprovadas das condições operacionais ainda por confirmar.

Em 2026-11-14, o solicitante autorizou a resolução dos 15 achados da [revisão consolidada](../../consolidated_review_report.md), com decisões explícitas de identidade, pagamento, imagens, infraestrutura e operação. Esta revisão incorpora essas decisões; o [relatório de resolução](../../goldfish_review_report.md) registra F-01–F-15. As fontes históricas e os pareceres originais permanecem preservados.

Em 2026-11-15, o solicitante autorizou os cinco ajustes A-01–A-05 da [segunda revisão consolidada](../reviews/beta-2026-11-14-r2/consolidated_review_report.md), começando pelo catálogo de mensagens. O [registro desta resolução](../reviews/beta-2026-11-14-r2/goldfish_review_report.md) documenta a ordem das fases, a autorização de ajustes de pagamento, a publicação por modelo e as correções editoriais. A política de prejuízo continua obrigatória nos dois modos de pool, conforme esclarecimento do solicitante.

## Overview

A Plataforma Comercial Hoteleira apoiará equipes que comercializam unidades de condo-hotéis no Brasil. O consultor conduz a simulação durante o atendimento e compartilha uma proposta por link e PDF. O investidor consulta o material sem criar conta. O administrador mantém os dados comerciais, as regras e as premissas oficiais de cada empreendimento.

O MVP será uma versão beta anterior à etapa SaaS. O investimento no SaaS já está decidido. A finalidade da beta é colocar o produto na rotina da primeira empresa parceira, substituir gradualmente a planilha e identificar necessidades adicionais a partir do uso real. A empresa confirmou disponibilidade total para preparação, homologação, atendimentos acompanhados e feedback; nenhuma necessidade adicional ao desenho atual foi relatada até aqui.

A entrada em uso começará por um empreendimento, com expansão após validação dos cálculos e do atendimento. A base documental permite outras empresas beta por convite do operador da plataforma, com dados separados. Isso não implica cadastro público nem cobrança de assinaturas nesta etapa.

Os modelos individual e pool permanecem no escopo. O primeiro empreendimento utilizará pool com participação proporcional aos valores de venda de referência, registrados nas premissas publicadas. Alterações de preço e descontos não mudarão automaticamente essa participação. O payback simples é o investimento dividido pelo resultado anual positivo, multiplicado por 12 meses. O payback ajustado subtrai desse prazo os meses definidos nas premissas publicadas; para o primeiro cliente, `payback ajustado = payback simples − 24 meses`. A apresentação identifica a regra e mostra também o prazo simples; quando a recuperação ocorre dentro da dedução, apresenta o motivo correspondente em vez de prazo negativo ou zero enganador. Essas são decisões existentes, não novas escolhas deste rascunho.

## The Problem

A planilha atual concentra cadastro de unidades, tarifas, despesas, ocupação e estimativas apresentadas ao investidor. A empresa precisa transformar essa função comercial em um fluxo que permita manter premissas oficiais, conduzir atendimentos e consultar o conteúdo exato de cada proposta emitida.

Essa substituição exige distinguir conceitos que podem parecer equivalentes durante uma venda: unidades disponíveis comercialmente, inventário da operação hoteleira e participantes do rateio do pool. Também exige separar o preço negociado do peso de participação e diferenciar uma previsão do ano completo de um resultado de período parcial. O sistema deve comunicar essas diferenças tanto a quem configura o empreendimento quanto a quem apresenta o resultado.

A aplicação deve preservar propostas já emitidas quando preços, disponibilidade, regras ou premissas forem atualizados. Emissão interrompida, conflito de atualização e restauração de backup precisam ter um caminho de recuperação que conserve o histórico e as restrições dos links. Uma falha não pode transformar uma tentativa incompleta em proposta acessível nem liberar novamente, sem conferência, um link revogado ou substituído.

A planilha será uma fonte histórica e de comparação, sujeita às pendências de homologação já identificadas no desenho do piloto. O objetivo é reproduzir as regras comerciais confirmadas, sem copiar fórmulas defeituosas ou presumir que seus dados representam o inventário completo do pool.

O sucesso da beta será demonstrado pela capacidade de a equipe executar os atendimentos necessários e adotar a plataforma como referência do empreendimento. O feedback orientará correções e evolução do produto; não se trata de reavaliar a decisão de investir no SaaS nem de entregar automaticamente todos os pedidos antes de concluir a beta.

## Goals

1. **Substituir gradualmente a planilha nos atendimentos comerciais.** Permitir que administrador e consultor concluam as tarefas documentadas; identificar uma única referência oficial por empreendimento e formalizar sua adoção após validação pela empresa.

2. **Administrar os dados e as condições oficiais.** Manter identidade da empresa, usuários, empreendimentos, unidades, preços, disponibilidade, condições de pagamento, limites de desconto e validade das propostas. Publicar versões verificadas de calendário, cenários, tarifas, despesas e regras de participação.

3. **Simular os dois modelos com resultados verificáveis.** Calcular operação individual e pool conforme regras predefinidas por empreendimento, incluindo despesas, retenções, custos exclusivos e tratamento de prejuízo quando aplicáveis. Conferir os resultados com referências independentes; não deduzir o inventário ou o denominador do pool somente das unidades à venda.

4. **Explicar resultados e suas limitações.** Comparar cenários otimista, realista e pessimista; permitir cenário personalizado apenas dentro das faixas autorizadas. Distinguir dado ausente de zero, total parcial de indicador anual e payback simples de payback com meses descontados. Apresentar as estimativas e as premissas relevantes em português, com valores em BRL.

5. **Concluir e recuperar o atendimento.** Permitir selecionar unidade, simular desconto autorizado, escolher condição de pagamento, identificar o interessado, salvar rascunho e emitir proposta. Explicar conflitos e próximos passos, preservar dados ainda válidos e destacar mudanças antes de uma nova emissão.

6. **Compartilhar propostas consistentes e preservar seu histórico.** Manter entradas, resultados, premissas e apresentação de cada versão emitida. Tela de consulta e PDF devem conciliar; validade, substituição e revogação devem restringir o acesso conforme o desenho existente. A proposta não reserva a unidade, e geração não equivale a envio pelo consultor.

7. **Respeitar permissões e separação entre empresas.** Administrador e consultor devem ter os acessos documentados. Convites de outras empresas não podem expor dados da parceira ou de outra beta. A consulta do investidor deve se limitar à versão vinculada ao link compartilhado.

8. **Preparar uma operação recuperável.** Demonstrar retomada segura de emissão, recuperação de dados e arquivos e preservação da leitura de propostas antigas após atualizações. Antes de reabrir acessos após restauração, invalidar todas as sessões restauradas, revalidar credenciais e vínculos e conferir ou invalidar os estados de links afetados. Definir contingência e autoridade de pausa e retomada antes de a plataforma se tornar referência oficial.

9. **Aprender com o uso real sem ampliar automaticamente o escopo.** Observar atendimentos, registrar dificuldades e contornos e avaliar separadamente defeitos, configuração, usabilidade e novas funcionalidades. Relacionar ocorrências a referências internas e horário quando disponíveis; o acompanhamento inicial pode ser manual e externo ao produto.

### Evidências de atendimento dos objetivos

A homologação deverá reunir cálculos de referência dos dois modelos, execução dos fluxos administrativos e comerciais, conferência de tela/link/PDF, verificação de permissões e recuperação e validação de atendimentos reais pela empresa. O modelo ainda não usado comercialmente pode ser validado inicialmente com dados controlados, conforme o desenho do piloto.

Os responsáveis combinarão a janela e a quantidade de atendimentos do primeiro balanço e as dificuldades que impedem a adoção. Este documento não presume metas, prazo, capacidade simultânea ou níveis de suporte ainda não acordados. A expansão ocorrerá por empreendimento após a validação; ideias novas poderão continuar no backlog.

## Non-Goals

- Cadastro público de empresas, cobrança de assinaturas SaaS ou ampliação imediata para produtos imobiliários além de condo-hotel no Brasil.
- CRM completo, integrações externas, gestão de comissões ou automação de comunicação aos investidores.
- Assinatura de contratos, aceite eletrônico com efeito de contratação, recebimento de pagamentos ou reserva automática de unidade.
- Gestão da operação de reservas de hospedagem.
- Fórmulas livres, importador genérico de planilhas ou busca automática de feriados externos.
- TIR, VPL, valorização do imóvel, reinvestimento ou payback datado que considere obra, parcelas e sazonalidade. Encargos de pagamento não serão presumidos sem regra definida.
- Novos módulos de analytics, rastreamento de abertura de propostas ou sistema próprio de feedback nesta beta.
- Reavaliar a decisão de investimento no SaaS ou condicionar a conclusão da beta à implementação de todas as sugestões da empresa.
- Sincronização permanente com a planilha ou uso de duas bases simultaneamente como referência oficial.

## Open Questions

| Ponto ainda aberto | Momento de definição |
|---|---|
| Empreendimento inicial, responsável pela homologação e aprovadores das premissas | Antes da preparação dos dados reais. |
| Consultores participantes, agenda, canal de feedback e primeiro balanço | Antes dos primeiros atendimentos acompanhados; a disponibilidade da empresa já está confirmada. |
| Inventário completo, despesas, calendário e demais parâmetros reais do primeiro pool | Na homologação, antes de publicar o empreendimento para uso comercial. |
| Critérios operacionais de pausa, retomada, suporte e tolerância a perda de dados e tempo de recuperação | Antes de assumir a referência oficial do empreendimento. |
| Ambiente, contas, orçamento e capacidade observada | Antes da publicação operacional, com ensaio representativo. |

## Critical User Journeys (CUJs)

### CUJ 1: preparar e publicar um empreendimento

- **Given:** administrador autenticado, empresa ativa e cadastros preparados; premissas ainda em rascunho.
- **When:** o administrador informa calendário, cenários, tarifas, despesas e regras e solicita publicação.
- **Then:** os dados obrigatórios são validados conforme modelo e modalidade na matriz de publicação: calendário/payback em ambos; inventário, participação e política de prejuízo apenas no pool; pesos apenas na modalidade correspondente. Pendências impedem publicação e indicam os campos aplicáveis. Uma publicação válida cria versão identificada e imutável, com autor e data. A administração distingue oferta comercial, inventário operacional e participantes do rateio.

### CUJ 2: concluir ou recuperar um atendimento

- **Given:** consultor autenticado, unidade comercialmente disponível e premissas vigentes publicadas.
- **When:** o consultor compara cenários, escolhe condições autorizadas, salva o atendimento e solicita emissão.
- **Then:** o servidor recalcula, valida acesso e condições e publica uma única versão pronta por solicitação idempotente. Link e PDF representam o mesmo conteúdo. Mudanças concorrentes indicam o que precisa ser revisto; falhas técnicas preservam o rascunho e permitem tentativa controlada. Uma emissão em andamento ou falha não marca a proposta anterior como substituída. Sua consulta continua sujeita, independentemente, à expiração, revogação e demais restrições de acesso.

### CUJ 3: consultar uma proposta compartilhada

- **Given:** investidor com o link de uma versão, sem conta na plataforma.
- **When:** abre a proposta ou solicita seu PDF.
- **Then:** versão ativa e válida permite consulta e download do documento emitido. Versão vencida, revogada ou substituída mostra apenas o estado e o contato previstos, sem valores ou PDF. Token inexistente recebe resposta genérica. O link anterior não redireciona automaticamente para o atual.

### CUJ 4: impedir acesso entre empresas ou consultores

- **Given:** duas empresas e usuários com vínculos e papéis distintos.
- **When:** um usuário tenta consultar ou alterar registros de outra empresa, ou um consultor tenta acessar atendimento de outro consultor.
- **Then:** o serviço recusa a operação antes de devolver dados ou produzir efeitos. O administrador conserva a consulta às propostas de sua empresa. Alterar identificadores no navegador não muda o contexto autorizado.

### CUJ 5: recuperar operação e preservar acesso histórico

- **Given:** emissão interrompida, atualização de formato persistido ou necessidade de restaurar backup.
- **When:** o responsável executa o procedimento correspondente em ambiente controlado antes da liberação operacional.
- **Then:** a emissão não publica versões duplicadas; propostas antigas continuam legíveis sem recálculo; restauração invalida todas as sessões e não reabre acesso autenticado antes de reconciliar credenciais e vínculos, nem consulta pública antes da conferência ou invalidação dos links afetados. Se não houver dados confiáveis para retomar o atendimento, novas emissões permanecem suspensas até a recuperação.

## Technical Plan (Architecture)

### 1. Base escolhida e dependências propostas

A [decisão DT-01](decisao-base-tecnologica-beta.md) define TypeScript, React/Next.js em Node.js e PostgreSQL. A aplicação será integrada, com módulos de domínio, serviços e apresentação no mesmo projeto. O cálculo autoritativo não depende do navegador.

As bibliotecas de apoio abaixo preservam a proposta do plano anterior e foram aprovadas com este bloco técnico. As versões serão fixadas no primeiro setup de implementação, depois de conferir APIs e executar a integração mínima. A consulta à documentação sustenta o uso proposto, não comprova uma aplicação já executada.

| Responsabilidade | Proposta deste bloco | Limite de responsabilidade |
|---|---|---|
| Interface e servidor | Next.js App Router em runtime Node, com React e TypeScript | Rotas, formulários e apresentação; serviços próprios validam as regras comerciais. |
| Banco e migrações | PostgreSQL, `pg` (node-postgres) e Drizzle via `drizzle-orm/node-postgres` | Pool de conexões explícito, transações e restrições; consultas recebem escopo de empresa validado. |
| Autenticação | `better-auth`, `@better-auth/drizzle-adapter` com provider `pg` e sessões persistidas | Identidade global e recuperação por e-mail do titular; vínculos, papéis e convites passam pelos serviços do produto. |
| Validação e cálculo | Zod e decimal.js | Entradas explícitas, decimais e regras determinísticas; não executam fórmulas livres. |
| Documentos | pdf-lib e apresentação comum à página externa | Gerar e armazenar os bytes do PDF, com paginação e fontes; não depender de um navegador para renderizar. |
| Imagens | `sharp` no runtime Node | Converter WebP em PNG antes de persistir; o PDF recebe apenas PNG/JPEG validados. |
| Verificação futura | Vitest e Playwright | Referências de domínio, integração e jornadas; comandos e arquivos serão enumerados na implementação detalhada. |

O Next.js documenta [servidor Node.js](https://nextjs.org/docs/app/getting-started/deploying) e [autorização na camada de acesso aos dados](https://nextjs.org/docs/app/guides/authentication). Better Auth documenta um [adaptador para Drizzle](https://better-auth.com/docs/adapters/drizzle). Os nomes de pacotes e a configuração usados na implementação devem seguir as versões fixadas, sem copiar imports antigos por suposição.

### 2. Componentes e fluxo de dados

```mermaid
flowchart TD
    Staff["Administrador / consultor"] --> UI["Next.js: área autenticada"]
    UI --> Access["Sessão, vínculo e permissões"]
    Access --> Services["Serviços de catálogo, premissas e atendimentos"]
    Services --> Engine["Motor puro: calendário, individual, pool e indicadores"]
    Services --> DB[("PostgreSQL")]
    Services --> Issue["Serviço de emissão e recuperação"]
    Issue --> Engine
    Issue --> DB
    Issue --> PDF["Snapshot, apresentação congelada e PDF"]
    PDF --> Files["Armazenamento privado"]
    Investor["Investidor com link"] --> Public["Página pública / download"]
    Public --> Resolve["Resolver estado, validade e versão"]
    Resolve --> DB
    Resolve --> Files
```

O domínio recebe dados já resolvidos e devolve resultados; não importa autenticação, banco, armazenamento nem React. Os serviços coordenam permissões, revisões e transações. A interface usa os resultados dos serviços, sem uma segunda implementação dos cálculos. Página externa e PDF são derivados da apresentação congelada na emissão.

| Módulo futuro | Localização de referência | Responsabilidade |
|---|---|---|
| Contratos e cálculo | `src/domain/` | Schemas, calendário, despesas, modelos individual/pool, investimento e indicadores. |
| Identidade e banco | `src/server/auth/`, `src/server/db/`, `drizzle/` | Sessões, vínculos, repositórios, restrições e migrações. |
| Administração | `src/server/catalog/`, `src/server/premises/` | Cadastros, condições, rascunhos de premissas, publicação e retirada. |
| Atendimento | `src/server/simulations/` | Rascunhos, cálculo, parcelas e atualização explícita para versões vigentes. |
| Emissão e consulta | `src/server/proposals/` | Snapshot, PDF, links, estados, recuperação e resolução pública. |
| Arquivos e auditoria | `src/server/storage/`, `src/server/audit.ts` | Objetos privados, chaves imutáveis e registro de alterações. |
| Telas e mensagens | `src/app/`, `src/components/`, catálogo pt-BR | Fluxos por papel, estados recuperáveis e textos de interface/documentos. |
| Operação | `scripts/`, `docs/runbooks/` | Convites, carga assistida, diagnóstico, backup, restauração e contingência. |

Esses caminhos descrevem arquivos e módulos a criar. Não representam código existente. A lista exaustiva de arquivos e suas mudanças pertence à etapa de implementação detalhada. A raiz do projeto é este workspace; os caminhos Windows do plano anterior são apenas referências históricas.

### 3. Identidade, permissões e separação entre empresas

O servidor obtém `ActorContext = { userId, companyId, role }` da sessão e de um vínculo ativo. O identificador de empresa enviado num formulário não concede acesso. Cada serviço verifica papel, empresa e propriedade do registro; uma proteção apenas no menu ou no layout não substitui essa verificação.

O administrador mantém cadastros e premissas e consulta propostas da empresa. O consultor consulta o catálogo autorizado e administra seus próprios rascunhos e propostas dentro dos limites publicados. A identidade global (`userId`, e-mail verificado e credencial) é distinta do vínculo (`companyId`, papel e atividade). Administrar A permite criar/alterar/desativar somente vínculos de A e revogar somente sessões selecionadas para A. Não permite alterar e-mail, definir senha global, obter token de recuperação ou revogar sessões de B. Isso vale também para usuários com um único vínculo e impede redefinição unilateral quando a mesma identidade mantém vínculo ativo em B.

A redefinição de senha ocorre exclusivamente por recuperação enviada ao e-mail verificado do próprio titular, com token de uso único, validade limitada, respostas genéricas e limitação de tentativas. Ao concluir, revoga todas as sessões globais e tokens de recuperação anteriores; o usuário faz novo login e os vínculos são revalidados. A seleção de vínculo da sessão é controlada pelo servidor, sem promover uma sessão de A para B por alteração de payload. Alterações de papel/desativação revogam as sessões locais correspondentes e continuam sendo conferidas a cada operação.

O provisionamento não distribui senha conhecida pelo administrador. Para uma identidade nova, o serviço cria acesso pendente e envia ao e-mail do convidado um link de ativação para verificar a posse e definir a primeira senha; para identidade existente, cria somente o vínculo pendente e exige aceite pelo titular autenticado, sem tocar sua credencial. Os comandos do operador seguem a mesma regra. Ativação e recuperação são os únicos e-mails transacionais exigidos por esta decisão; envio de propostas ao investidor continua manual. `src/server/auth/email.ts` usa [SMTP via nodemailer](https://nodemailer.com/smtp), sem credenciais ou links em logs, com configuração e teste de entrega no ambiente efetivo. Falha no envio mantém a identidade/vínculo pendente e permite reenvio limitado, sem liberar acesso ou mostrar o token ao administrador. A configuração seguirá a [recuperação do Better Auth](https://better-auth.com/docs/authentication/email-password), com revogação de sessões explicitamente habilitada.

O operador provisiona empresas e seus primeiros administradores por comando de servidor, sem cadastro público ou endpoint genérico de administração global. Não recebe acesso normal aos dados comerciais das empresas. Eventual suporte com dados de cliente depende da autorização e do registro exigidos no desenho do piloto; esta beta não acrescenta um painel de impersonação.

Entidades comerciais carregam `companyId`. Restrições e referências compostas impedem relações entre registros de empresas distintas, além das verificações dos serviços. Os testes futuros devem tentar leitura e escrita cruzadas, inclusive com identificadores forjados e usuários desativados.

### 4. Persistência e versões

| Conjunto de dados | Conteúdo e regras |
|---|---|
| Empresa, usuário e vínculo | Identidade global separada do vínculo local, papel, atividade, aceite pendente e trilha de provisionamento; credenciais fora das propostas. Marcas de revalidação de credencial/vínculo bloqueiam o acesso após restauração até recuperação segura. |
| Empreendimento e unidade comercial | Identificadores estáveis, código único por empreendimento, preço, disponibilidade e condições; alterações relevantes incrementam a revisão do catálogo. |
| Inventário e participantes | Inventário operacional separado das unidades à venda; participantes e pesos abrangem todo o conjunto elegível. Vender uma unidade não retira sua participação automaticamente. |
| Premissas | Rascunho editável e versões publicadas imutáveis; calendário, cenários, tarifas, despesas e payback completos, com inventário/participação/prejuízo exigidos apenas no pool, conforme a matriz de publicação. |
| Interessado e simulação | Nome obrigatório apenas para emitir, telefone/e-mail opcionais; dono, entradas, versões usadas, revisão do rascunho e resultado recuperáveis. |
| Proposta e versão | Série de versões, snapshot e apresentação emitida imutáveis; estado de emissão e estado de acesso mantidos separadamente do conteúdo histórico. |
| Tentativa, link e auditoria | Chave idempotente, andamento recuperável, referência do PDF, token protegido e registro de ações com autor e horário. |

Identificadores de registros usam UUIDs. Datas de calendário são datas civis; emissão e eventos usam timestamps UTC, com o fuso do empreendimento preservado para a validade. Dados monetários são acompanhados da moeda BRL. Cadastros referenciados pelo histórico são arquivados.

As colunas monetárias e pesos seguem a proposta `numeric(30,12)` e taxas `numeric(20,12)`, com limites de entrada compatíveis. Valores decimais trafegam como texto canônico, sem conversão intermediária para ponto flutuante. O Drizzle oferece [tipos numeric/decimal para PostgreSQL](https://orm.drizzle.team/docs/column-types); a configuração concreta deve preservar essa representação.

Premissas publicadas e snapshots terão proteção contra alteração no banco. Estados de emissão, revogação e substituição continuam mutáveis por operações autorizadas e auditadas: preservar o conteúdo não pode impedir revogar um link.

O banco garante unicidade de versão por proposta e empresa e de chave idempotente por empresa. A reserva de número/versão e a confirmação da versão substituída são operações coordenadas no banco; duas emissões concorrentes não podem substituir silenciosamente a mesma versão atual.

### 5. Motor de cálculo e apresentação

O contrato `CalculationInput` seleciona `INDIVIDUAL` ou `POOL`, identifica a versão de regras e exige `PaybackRule`. A validação rejeita calendário sobreposto, percentuais fora de faixa, tarifas necessárias ausentes, participação incompleta quando aplicável ao pool e custos com bases ou ordens inválidas. Não exige pesos no modo de percentuais contratuais nem campos de pool no individual. Zero explícito permanece diferente de ausência.

O calendário classifica cada data uma única vez, com precedência de data especial, feriado, final de semana e dia útil. Temporadas, finais de semana e exceções são parâmetros do empreendimento. O ano-base deve conciliar com 365 ou 366 dias; períodos excluídos produzem horizonte parcial. Não se importam como regra as contagens legadas da planilha.

No modelo individual, receitas são derivadas de noites, tarifas e ocupação; custos fixos permanecem quando a receita é zero. No pool, o motor calcula a operação coletiva e as retenções e distribui a parcela conforme participantes publicados. Aplica o tratamento de prejuízo escolhido e os custos exclusivos do investidor. O valor de referência usado como peso não é substituído pelo preço negociado do atendimento.

O investimento total considera preço negociado e custos de aquisição explicitamente informados. O motor calcula retorno anual simples, média mensal simples, payback simples e payback conforme a regra publicada. Para `DEDUCTED_MONTHS`, mantém os dois prazos e a identificação dos meses descontados. Resultado não positivo, investimento inválido e horizonte parcial produzem os motivos de indisponibilidade previstos, em vez de números enganadores.

A precisão de cálculo proposta é de 40 dígitos significativos com decimal.js. A apresentação usa moeda com duas casas e `ROUND_HALF_UP`, retorno com quatro casas percentuais e prazo com duas casas, sempre acompanhado de “meses”. Ajustes de centavos são identificados na apresentação quando necessários; não modificam participações. A biblioteca permite [configurar precisão e arredondamento](https://mikemcl.github.io/decimal.js/); os limites e resultados continuam sujeitos às referências independentes do produto.

O resultado registra `engineVersion`, horizonte, cenários e alertas. A proposta preserva valores, textos relevantes e apresentação da emissão; mudanças futuras do catálogo de mensagens não reescrevem seu significado. Custos pendentes e limitações dos indicadores continuam visíveis.

### 6. Publicação de premissas e edição do atendimento

Salvar um rascunho incompleto é permitido; publicar exige validação completa do modelo correspondente. A publicação compara a revisão esperada e gera uma nova versão. Retirar uma versão impede novas emissões, preserva os documentos anteriores e permite localizar as propostas afetadas para decisão manual da equipe.

#### Matriz de publicação por modelo

| Modelo | Modalidade | Requisitos aplicáveis |
|---|---|---|
| Individual | — | Calendário e payback; não exige participantes, pesos ou política de prejuízo do pool. |
| Pool | Percentuais contratuais | Calendário, payback, percentuais conciliados para todo o conjunto elegível e política de prejuízo. Não exige pesos. |
| Pool | Por pesos | Calendário, payback, pesos completos para todo o conjunto elegível, base/valores de referência e política de prejuízo. |

Essa matriz discrimina os campos por modelo e modalidade; não dispensa tarifas, cenários, despesas, inventário e demais parâmetros de cálculo aplicáveis ao contrato correspondente. A política de prejuízo é obrigatória nos dois modos de pool e seleciona repasse proporcional ou absorção; o modo de participação não determina o tratamento das perdas. Validar ausência apenas dos campos aplicáveis, sem exigir pesos de um pool por percentuais ou campos de pool no individual. A publicação e seus testes usam esta matriz como referência única.

#### Edição do atendimento

Um rascunho comercial registra `expectedCatalogRevision`, `expectedPremiseVersionId` e sua própria revisão. O servidor resolve preços, participação, faixas e condições a partir da base autorizada. Alterações concorrentes não são absorvidas silenciosamente: o consultor recebe o motivo, atualiza explicitamente o atendimento e confere o que mudou antes de emitir. Campos ainda válidos são preservados.

O cronograma de pagamento segue o contrato de datas explícitas na seção “Condições de pagamento”. A soma da entrada e das parcelas deve ser exatamente o valor líquido após desconto; o resíduo da divisão assistida é identificado e somado à primeira parcela. A entrada e a estrutura da condição selecionada permanecem imutáveis no ajuste comercial. Não se presumem juros ou correção. Quando o limite de desconto não estiver configurado, somente desconto zero será permitido; qualquer desconto positivo deverá ser recusado. Faixas não configuradas desabilitam o cenário personalizado.

#### Condições de pagamento — schema e conciliação

`PaymentPlan` aceita somente valores fixos em BRL e vencimentos civis explícitos. Não aceita percentuais por parcela, datas relativas, recorrência, juros ou correção. A **condição administrativa** é o plano versionado publicado pelo administrador; seus valores e datas de referência não são reescritos pelo atendimento. O **ajuste comercial permitido** é um cronograma derivado dessa versão no qual o consultor altera somente os valores das parcelas existentes para conciliar o preço líquido. Esse ajuste não cria nem altera uma condição administrativa.

Datas de todos os pagamentos, quantidade e IDs das parcelas e a entrada completa (presença, ID, data e valor) permanecem iguais aos da versão selecionada. Alterar qualquer um desses campos exige que o administrador publique uma nova condição versionada e que ela seja selecionada no atendimento. O consultor não pode contornar essa regra usando a divisão assistida. Se a entrada fixa não couber no líquido, ou não restarem centavos suficientes para parcelas positivas, recusar o ajuste e orientar a revisão do desconto ou a seleção de nova condição administrativa; não reduzir entrada nem remover parcela automaticamente.

`PaymentSchedule` acrescenta `conditionVersionId`, preço de tabela resolvido no servidor, taxa e valor de desconto, valor líquido, cronograma resultante, eventual ajuste de centavos e `adjustedByUserId`. O comando de atendimento identifica a versão selecionada, o desconto e os valores propostos por ID de parcela; não aceita datas, entrada ou quantidade alternativas. O servidor completa o registro efetivo do comando com o usuário responsável obtido de `ActorContext`, sem confiar em um autor enviado pelo navegador, e registra o horário na auditoria. Condição, desconto, valores resultantes e responsável são persistidos no rascunho e no snapshot. Custos de aquisição do investimento não são embutidos nas parcelas do preço do imóvel.

O limite percentual é cadastrado por empreendimento e admite exceção explícita por unidade. O servidor usa a exceção da unidade quando configurada, inclusive zero; na ausência dela, usa o limite do empreendimento e, se também ausente, zero. Não soma os limites nem confunde exceção zero com ausência. O desconto deve ser não negativo e não exceder o limite efetivo; o preço líquido continua estritamente positivo. Alterar limites ou versões de condições incrementa a revisão comercial do catálogo e exige revalidação no salvamento, na reserva e na confirmação da emissão.

O JSON Schema abaixo define as formas de entrada e saída; as regras aritméticas, a existência das datas e a autorização são validações obrigatórias adicionais em Zod/serviço. `$ref` em `PaymentSchedule.plan` aponta para a mesma estrutura aceita por `PaymentPlan`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$defs": {
    "Money": { "type": "string", "pattern": "^(0|[1-9][0-9]{0,15})\\.[0-9]{2}$" },
    "Rate": { "type": "string", "pattern": "^(0(\\.[0-9]{1,12})?|1(\\.0{1,12})?)$" },
    "Payment": {
      "type": "object", "additionalProperties": false,
      "required": ["id", "dueDate", "amount"],
      "properties": {
        "id": { "type": "string", "minLength": 1, "maxLength": 64 },
        "dueDate": { "type": "string", "format": "date" },
        "amount": { "$ref": "#/$defs/Money" }
      }
    },
    "PaymentPlan": {
      "type": "object", "additionalProperties": false,
      "required": ["currency", "entry", "installments"],
      "properties": {
        "currency": { "const": "BRL" },
        "entry": { "anyOf": [{ "$ref": "#/$defs/Payment" }, { "type": "null" }] },
        "installments": { "type": "array", "items": { "$ref": "#/$defs/Payment" } }
      }
    },
    "PaymentSchedule": {
      "type": "object", "additionalProperties": false,
      "required": ["conditionVersionId", "adjustedByUserId", "listPrice", "discountRate", "discountAmount", "netPrice", "plan", "roundingAdjustment"],
      "properties": {
        "conditionVersionId": { "type": "string", "format": "uuid" },
        "adjustedByUserId": { "type": "string", "format": "uuid" },
        "listPrice": { "$ref": "#/$defs/Money" },
        "discountRate": { "$ref": "#/$defs/Rate" },
        "discountAmount": { "$ref": "#/$defs/Money" },
        "netPrice": { "$ref": "#/$defs/Money" },
        "plan": { "$ref": "#/$defs/PaymentPlan" },
        "roundingAdjustment": {
          "anyOf": [
            { "type": "null" },
            { "type": "object", "additionalProperties": false,
              "required": ["amount", "appliedTo"],
              "properties": {
                "amount": { "$ref": "#/$defs/Money" },
                "appliedTo": { "type": "string", "minLength": 1, "maxLength": 64 }
              }
            }
          ]
        }
      }
    }
  },
  "$ref": "#/$defs/PaymentPlan"
}
```

Regras obrigatórias:

1. Resolver preço e limite efetivo de desconto no servidor, aplicando exceção por unidade, limite do empreendimento ou zero, nessa ordem. `discountAmount = ROUND_HALF_UP(listPrice × discountRate, 2)` e `netPrice = listPrice − discountAmount`, ambos em centavos exatos. Preço e líquido devem ser positivos, desconto dentro da faixa autorizada; valor solicitado ausente equivale a zero. Sem limite efetivo configurado, qualquer desconto positivo é recusado.
2. Exigir pelo menos um pagamento: entrada ou parcela. Valores são positivos com duas casas; IDs são únicos inclusive entre entrada e parcelas. Sem entrada, usar `null`, nunca uma entrada fictícia de valor zero.
3. Validar cada `dueDate` como data gregoriana existente, inclusive ano bissexto; apenas `format: date` não basta. Na emissão nova, vencimentos não podem anteceder a data civil de emissão no fuso do empreendimento. Parcelas estão em ordem estritamente crescente; entrada, quando presente, vence antes ou na data da primeira parcela. Não derivar vencimentos adicionando meses.
4. Exigir `entry.amount (ou 0) + soma(installments.amount) = netPrice` com igualdade de centavos. Rejeitar totais menores/maiores; o validador não corrige dinheiro submetido. O desconto incide primeiro no preço e o cronograma distribui o líquido, sem aplicar outro desconto em cada parcela.
5. Na ferramenta de divisão assistida, datas, entrada e `n` parcelas são lidos da condição selecionada e exibidos sem edição pelo consultor. Dividir `netPrice − entry.amount (ou 0)` em centavos pelas `n` parcelas existentes usando quociente inteiro; somar todo o resto à primeira parcela e manter as demais no quociente. Cada parcela deve continuar positiva; não transferir resíduo à entrada nem alterar a estrutura para viabilizar o líquido. A interface exibe o ajuste e exige confirmação antes de salvar. Sem parcelas, a entrada única deve já ser exatamente igual ao líquido; divergência exige nova condição administrativa ou revisão do desconto, sem divisão ou alteração da entrada. O servidor reconstrói/confere a divisão e persiste o ajuste, sem confiar nos metadados do navegador. Na edição manual, somente os valores positivos das mesmas parcelas podem variar, sempre conciliando o líquido; não se registra resíduo de divisão assistida quando ela não foi usada.
6. Conferir a versão autorizada e comparar datas, quantidade/IDs das parcelas e entrada integral com ela antes de aceitar os valores resultantes. Congelar `conditionVersionId`, desconto, cronograma, ajuste e `adjustedByUserId` no snapshot. Revalidar autorização, revisão e total na emissão e na confirmação; nenhuma alteração posterior reescreve uma proposta pronta.

Exemplo completo: a condição administrativa selecionada prevê entrada de R$ 10.000,00 em `2026-12-01` e três parcelas de R$ 30.000,00 em `2027-01-15`, `2027-02-15` e `2027-03-15`, totalizando R$ 100.000,00. Preço de tabela R$ 100.000,00, desconto autorizado de 5% (`0.05`) = R$ 5.000,00, líquido R$ 95.000,00. Mantidas entrada, datas e quantidade, restam R$ 85.000,00 para as três parcelas. A divisão em centavos dá R$ 28.333,33 por parcela e sobra R$ 0,01. Aplicar à primeira: R$ 28.333,34 + R$ 28.333,33 + R$ 28.333,33 + entrada de R$ 10.000,00 = R$ 95.000,00.

```json
{
  "conditionVersionId": "00000000-0000-4000-8000-000000000101",
  "adjustedByUserId": "00000000-0000-4000-8000-000000000201",
  "listPrice": "100000.00", "discountRate": "0.05", "discountAmount": "5000.00", "netPrice": "95000.00",
  "plan": {
    "currency": "BRL",
    "entry": { "id": "entrada", "dueDate": "2026-12-01", "amount": "10000.00" },
    "installments": [
      { "id": "p1", "dueDate": "2027-01-15", "amount": "28333.34" },
      { "id": "p2", "dueDate": "2027-02-15", "amount": "28333.33" },
      { "id": "p3", "dueDate": "2027-03-15", "amount": "28333.33" }
    ]
  },
  "roundingAdjustment": { "amount": "0.01", "appliedTo": "p1" }
}
```

Os UUIDs do exemplo são identificadores fictícios; versão e responsável reais são resolvidos pelo servidor. Mesmo somando R$ 95.000,00, recusar ajuste comercial que mude uma data, a entrada para R$ 10.000,01 ou a quantidade de parcelas; esses casos exigem nova condição administrativa versionada. Recusar também três parcelas de R$ 28.333,33 com entrada de R$ 10.000,00 (falta R$ 0,01), `2027-02-29`, data repetida, valor negativo, recorrência, desconto acima do limite efetivo ou entrada fixa incompatível com o líquido. Testar o limite por empreendimento, exceção maior/menor por unidade, exceção zero e ausência de ambos os limites; um `adjustedByUserId` forjado não altera o autor efetivo.

### 7. Emissão consistente entre banco e PDF

Não existe uma transação única abrangendo PostgreSQL e armazenamento de arquivos. O serviço só libera acesso depois de preparar o documento e confirmar as condições comerciais numa transação final curta. O protocolo proposto é:

1. **Preparar.** Validar usuário, vínculo, propriedade, revisões, premissas vigentes, disponibilidade, desconto e condições. Recalcular no servidor e preparar o conteúdo e a validade da proposta.
2. **Reservar a tentativa.** Em transação curta, alocar número/versão, completar snapshot e apresentação imutáveis e persistir a emissão `PENDING`, chave idempotente e identidade da solicitação. A mesma chave e o mesmo conteúdo recuperam a mesma emissão para o usuário autorizado; conteúdo diferente gera conflito, sem reutilizar documentos indevidos.
3. **Produzir o PDF.** Renderizar a apresentação e gravar um objeto privado de chave imutável. Não manter transação aberta durante geração ou upload. Identificar o objeto pela tentativa para permitir diagnóstico e limpeza posterior.
4. **Confirmar.** Revalidar as revisões, o acesso, as condições e a versão atual da proposta numa transação final. Se continuarem válidos, associar o PDF, tornar a emissão `READY` e substituir a versão anterior de forma coordenada. Outra substituição concorrente ou mudança comercial gera conflito, conserva a versão vigente e exige revisão do atendimento.
5. **Entregar.** Devolver número, versão, estado e link somente para a emissão pronta. O PDF é preservado; downloads não o regeneram a partir de dados atuais.
6. **Recuperar.** Falha deixa estado consultável `PENDING` ou `FAILED`, com etapa e código de ocorrência. Uma nova tentativa autorizada retoma o trabalho conforme seu estado, sem publicar duplicatas. Objetos sem referência válida podem ser removidos pelo procedimento operacional.

A retomada proposta permanece no serviço da aplicação e pode ser acionada pelo usuário ou responsável autorizado. O banco controla a posse temporária da execução e identifica a tentativa atual; um executor que perdeu essa posse não pode concluir a emissão nem remover o arquivo de outro. O prazo de suspeita de interrupção e os limites de tentativa são configurações operacionais definidas a partir do ensaio. Não é necessário introduzir uma fila externa para esse protocolo na beta.

Erros técnicos não apagam os dados válidos do rascunho. Se uma condição comercial mudou, repetir a mesma chave não autoriza recalcular e sobrescrever o snapshot da tentativa antiga: a interface conduz a atualização explícita e uma nova solicitação. A recuperação conserva uma única responsabilidade pelo avanço dos estados.

#### Matriz normativa de emissão e retomada

O estado da emissão é somente `PENDING`, `READY` ou `FAILED`; revogação, vencimento e substituição são estados independentes de acesso de uma versão `READY`. Antes da reserva não existe emissão persistida. `FAILED` é terminal para a mesma chave: nova emissão exige nova intenção confirmada e nova chave; não altera o snapshot anterior. Cada aquisição de posse consome uma tentativa, inclusive a interrompida. Persistir `attemptCount`, limite aplicado na reserva, `leaseVersion`, `leaseExpiresAt`, etapa, `errorCode`, ocorrência e `nextRetryAt` quando cabível. O limite é inteiro positivo; seu valor de produção será definido no ensaio, sem alterar a semântica abaixo.

| Evento / condição | Transição persistida | Código / diagnóstico | Ação permitida |
|---|---|---|---|
| Preparação inválida antes da reserva (datas, soma, desconto, revisão ou autorização) | Sem emissão → sem emissão | `INPUT_INVALID`, `PAYMENT_MISMATCH`, `COMMERCIAL_CONFLICT` ou resposta genérica `ACCESS_DENIED` | Corrigir/revalidar o atendimento; nenhuma tentativa consumida. |
| Reserva válida e chave inédita | Sem emissão → `PENDING` | Sem erro; tentativa 1 com posse | Produzir PDF e confirmar. Link permanece indisponível. |
| Mesma chave, mesmo dono/conteúdo, executor com posse não vencida | `PENDING` → `PENDING` | `ISSUE_IN_PROGRESS` (informativo, sem substituir erro persistido) | Consultar andamento; não iniciar outro executor ou consumir tentativa. |
| Mesma chave com conteúdo diferente | Qualquer estado → inalterado | `IDEMPOTENCY_CONFLICT` na resposta | Revisar intenção e usar nova chave, sem mudar a emissão encontrada. |
| Repetição autorizada da chave pronta | `READY` → `READY` | Sem erro | Devolver referência original; acesso ao link ainda obedece expiração/revogação/substituição. |
| PDF gravado e confirmação final válida, posse atual | `PENDING` → `READY` | Limpar erro transitório; registrar referência/hash do PDF | Publicar e substituir atomicamente a versão anterior. |
| Falha transitória de rede, armazenamento, banco ou recurso temporário de renderização, com tentativa ainda abaixo do limite | `PENDING` → `PENDING` | `STORAGE_TRANSIENT`, `DATABASE_TRANSIENT` ou `PDF_TRANSIENT`; etapa e próxima tentativa | Liberar posse quando possível; retomar somente após liberação/vencimento e `nextRetryAt`, com revalidação e nova tentativa. |
| Processo interrompido / posse vencida, abaixo do limite | `PENDING` → `PENDING` | `LEASE_EXPIRED` | Aquisição atômica de nova posse/contador; nova chave de objeto da tentativa; revalidar antes de avançar. |
| Executor antigo tenta confirmar ou limpar após perder posse | Estado inalterado | `STALE_EXECUTOR` na ocorrência | Recusar efeito; executor antigo para. Nunca remove objeto de outro executor. |
| Mudança comercial ou de autorização detectada após reserva (preço, disponibilidade, vigência, rascunho, vínculo ou versão atual) | `PENDING` → `FAILED` | `COMMERCIAL_CONFLICT`, `ACCESS_REVOKED` ou `VERSION_CONFLICT` | Preservar rascunho e versão anterior não substituída; corrigir/revalidar e criar nova solicitação autorizada. |
| Snapshot inválido, PDF determinística e irreparavelmente inválido ou objeto com hash divergente | `PENDING` → `FAILED` | `SNAPSHOT_INVALID`, `PDF_RENDER_FAILED` ou `OBJECT_HASH_MISMATCH` | Diagnosticar/corrigir causa; nova solicitação após correção. Não repetir cegamente. |
| Falha transitória na última tentativa, ou posse da última tentativa expira | `PENDING` → `FAILED` | `ATTEMPTS_EXHAUSTED`, preservando também o código causal | Retomada da mesma chave bloqueada. Responsável diagnostica; usuário confirma nova solicitação após resolver a causa. |
| Mesma chave já falhou | `FAILED` → `FAILED` | Código terminal persistido | Consultar motivo e próximo passo; não reabrir estado, não recalcular snapshot. |
| Leitura de status sem sessão/vínculo/propriedade autorizados | Estado inalterado | `ACCESS_DENIED` genérico | Nenhum detalhe nem link. Reconciliação interna pode concluir `ACCESS_REVOKED`; uma chamada não autorizada não controla a emissão. |
| Manutenção operacional ativa | Sem nova reserva/posse/confirmação; estado persistido conservado | `MAINTENANCE` | Suspender execução; depois da liberação revalidar e seguir a regra de posse/limite. Posse pode expirar durante a pausa. |

A confirmação é idempotente: se a conexão cair após o commit, consultar o banco pela chave antes de classificar falha; `READY` nunca regride. Se o banco estiver indisponível, não inventar transição local: registrar ocorrência sem segredos e reconciliar o estado persistido quando voltar. Limpeza de objeto órfão é operação da tentativa, não transição de uma emissão pronta. Objetos de `FAILED` só são removidos após conferir ausência de referências e de posse ativa. A interface oferece “acompanhar”, “retomar” ou “revisar e emitir nova solicitação” conforme a matriz; nunca mostra “retomar” para `FAILED`.

O PDF usa paginação, acentos, fontes e imagens validadas, com tamanho de conteúdo considerado no ensaio. A API do [pdf-lib permite serializar o documento em bytes](https://pdf-lib.js.org/docs/api/classes/pdfdocument#save); o layout, a coerência dos valores e a integração com armazenamento são responsabilidades a verificar na aplicação.

### 8. Consulta pública, tokens e validade

O token usa 32 bytes aleatórios. O banco guarda hash SHA-256 para resolução e cópia cifrada com AES-GCM para recuperação autenticada do link. A chave de cifra fica no servidor e tem procedimento próprio de recuperação. O token completo não entra em logs, métricas ou registros manuais de feedback.

| Estado resolvido | Resposta externa |
|---|---|
| Ativa, pronta e dentro da validade | Apresentação emitida e download do PDF correspondente. |
| Vencida | Estado e contato, sem valores nem PDF. |
| Revogada | Estado e contato, sem valores nem PDF. |
| Substituída | Estado e contato, sem valores nem PDF e sem redirecionamento à nova versão. |
| Token inexistente ou inválido | Resposta genérica, sem revelar empresa, interessado ou documento. |

Página e download passam pelo mesmo resolvedor de autorização pública, e cada requisição captura o horário atual do servidor e revalida estado e validade antes de liberar conteúdo. O download não recebe nem reaproveita timestamp, autorização temporal ou decisão capturados na abertura da página. Um relógio injetado com o mesmo instante serve apenas a testes comparativos determinísticos; não é uma autorização compartilhada entre requisições. A validade é registrada como instante final derivado da data civil e do fuso do empreendimento. O arquivo privado não é exposto por URL permanente.

As respostas da proposta e do download são dinâmicas e usam `Cache-Control: no-store`, sem cache no proxy/CDN, com `Referrer-Policy: no-referrer` e `X-Robots-Tag: noindex, nofollow`. Não há analytics, preview com dados pessoais ou rastreamento de abertura. A equipe continua responsável pelo envio nos canais existentes. Revogar o link não remove PDFs já baixados.

### 9. Contratos internos e rotas propostas

Os contratos de serviço reaproveitam os nomes do plano anterior. São interfaces internas do produto, não uma API pública de integração SaaS.

| Contrato | Responsabilidade principal |
|---|---|
| `requireActor` | Resolver sessão, vínculo e contexto de acesso; recusar identidade ou vínculo inválido. |
| `saveDevelopment`, `saveUnit` | Manter catálogo e condições sob autorização administrativa e controle de revisão. |
| `savePremiseDraft`, `publishPremises`, `withdrawPremises` | Separar preparação, publicação imutável e retirada de vigência. |
| `calculate` | Validar e calcular os modelos por um contrato determinístico com versões identificadas. |
| `createDraft`, `updateDraft`, `rebaseDraft` | Persistir atendimento, controlar concorrência e atualizar explicitamente suas referências. |
| `buildSnapshot`, `buildProposalPresentation`, `renderProposalPdf` | Produzir conteúdo congelado e os mesmos valores para página e documento. |
| `issueProposal`, `revokeProposalLink`, `getShareLink` | Emitir com idempotência, controlar acesso e recuperar o link somente para quem tem permissão. |
| `resolvePublicProposal` | Resolver token, estado e validade para página e download. |

As telas autenticadas e suas mutações chamam serviços de servidor. Entradas são validadas e o resultado devolve apenas os campos necessários ao papel. Validações de formulário apontam os campos; conflitos explicam a atualização necessária; falhas inesperadas retornam código de ocorrência sem detalhes sensíveis.

`/` é a entrada pública/redirecionadora, implementada exclusivamente em `src/app/page.tsx`; as demais rotas públicas são as páginas de autenticação e propostas externas listadas abaixo. Rotas propostas: `/entrar`, `/recuperar-senha`, `/trocar-senha`, `/dashboard` (`src/app/(staff)/dashboard/page.tsx`) como início autenticado, áreas administrativas e comerciais sob sessão, `/api/auth/[...all]` para o mecanismo de identidade, `/p/[token]` para consulta externa e `/p/[token]/pdf` para download. Não haverá endpoint público para cadastrar empresas, confirmar contratação ou reservar unidade. A autenticação não concede autorização comercial por si só.

### 10. Atualizações e recuperação do histórico

Snapshots e apresentação emitida usam versão explícita de formato. Antes de uma alteração incompatível, será verificada a leitura de uma proposta da versão anterior e declarado se o código anterior ainda pode operar sobre os dados migrados. Preferir mudanças aditivas; não recalcular propostas antigas para adaptá-las a uma regra nova. O PDF emitido permanece o documento da sua versão.

O procedimento de restauração suspende acesso público, login normal, seleção de vínculo e todas as operações autenticadas antes de restaurar banco e arquivos. Esse bloqueio pertence ao ambiente de operação, e não pode depender de uma flag que volte ao valor antigo junto do backup. O ensaio deve incluir uma revogação e uma substituição posteriores ao ponto restaurado, além de conferir snapshot e bytes do PDF.

Antes de reabrir a consulta pública, reconciliar as restrições posteriores ao backup com registros confiáveis disponíveis. Se não for possível demonstrar o estado de um conjunto de links restaurados, invalidá-los antes de retomar; a equipe precisará compartilhar novas versões pelo fluxo normal. Essa alternativa tem custo de reemissão e comunicação manual, mas não exige presumir que o backup conserva alterações posteriores a sua criação.

Além dos links, invalidar incondicionalmente todas as sessões autenticadas restauradas e todos os tokens pendentes de ativação/recuperação antes de qualquer reabertura. Reconciliar identidades, e-mails verificados, vínculos, papéis e desativações com uma trilha confiável posterior ao backup. Uma senha antiga não pode voltar a autorizar login: marcar credenciais restauradas como exigindo recuperação pelo e-mail confirmado do titular e rejeitar o login com a senha restaurada até sua substituição. Mesmo uma identidade já recuperada não ganha autorização comercial até seu vínculo e papel serem revalidados.

Na ausência de trilha confiável, manter vínculos restaurados suspensos e exigir confirmação explícita da autoridade de cada empresa para reativá-los, sem conceder a essa autoridade poder sobre senha ou e-mail global. Se o e-mail atual de uma identidade não puder ser demonstrado, manter sua recuperação bloqueada até comprovação pelo procedimento operacional de identidade; não enviar recuperação a um e-mail antigo por presunção. Reabrir primeiro apenas o fluxo de recuperação para titulares com endereço reconciliado, ainda sob restrição comercial. Reabrir o acesso normal somente após relatório auditado de reconciliação e ensaio. Identidades/vínculos não confirmados continuam bloqueados, mesmo que os demais tenham sido liberados. O healthcheck e os comandos operacionais controlados são as únicas exceções durante o bloqueio total.

Na adoção por empreendimento, a empresa identifica a referência oficial e quem autoriza suspensão e retomada. O retorno temporário à planilha exige conferir dados atuais; quando ela não puder representar as condições vigentes, novas emissões ficam suspensas até a recuperação. Não se cria sincronização permanente entre as duas ferramentas.

## Alternatives Considered

Esta seção deriva de Alternatives Weighed no [brief aprovado](../../concepts_brief.md), das abordagens do [desenho do piloto](<../../Desenho do piloto - Plataforma comercial hoteleira.md>) e da [decisão DT-01](decisao-base-tecnologica-beta.md). Registra escolhas e avaliações já realizadas; não acrescenta alternativas para uma nova votação de arquitetura.

### A. Trocar todos os empreendimentos simultaneamente

- **Benefício:** padronizar a ferramenta em uma única transição, reduzindo o período em que empreendimentos diferentes usam referências diferentes.
- **Custo e limite:** concentrar cadastros, homologação de regras, treinamento e correções antes de qualquer entrada em uso. Um problema comum afeta toda a implantação de uma vez.
- **Decisão e motivo:** não selecionada pelo solicitante no desenho do piloto. A implantação gradual escolhida permite validar um empreendimento antes de ampliar e distribuir a preparação ao longo da adoção.

### B. Emitir propostas somente em PDF

- **Benefício:** reduzir o compartilhamento a um arquivo, sem página externa e resolução de estado por token.
- **Custo e limite:** o arquivo já enviado não acompanha revogação, substituição ou validade controlada pela plataforma. É necessário um canal consultável para aplicar os estados de acesso previstos ao link.
- **Decisão e motivo:** não selecionada, pois o solicitante escolheu expressamente link com PDF. O link aplica os controles de consulta, e o PDF preserva o documento da versão; cópias já baixadas continuam fora do alcance da revogação.

### C. Usar Python/Django e PostgreSQL

- **Benefício:** reaproveitar os mecanismos de autenticação e administração interna descritos em DT-01, mantendo a possibilidade de uma aplicação integrada e um domínio de cálculo independente.
- **Custo e limite:** adaptar a proposta anterior de módulos, contratos e testes para Python, definir outra integração de PDF e desenvolver as telas dos fluxos comerciais. O admin genérico, isoladamente, não atende às jornadas aprovadas.
- **Decisão e motivo:** alternativa não selecionada pelo autor em DT-01; a escolha expressa foi TypeScript/Next.js e PostgreSQL. O autor não informou justificativa adicional. A continuidade do plano anterior e o custo de adaptação são a avaliação técnica registrada, não um motivo atribuído ao autor.

### D. Separar interface, API e emissão em serviços publicados independentemente

- **Benefício:** permitir dimensionamento, publicação e manutenção separados quando houver necessidades distintas entre os componentes.
- **Custo e limite:** acrescentar comunicação entre serviços, configuração de acesso, coordenação de versões e recuperação operacional. Não há carga medida ou equipe separada que justifique esse custo nesta beta.
- **Decisão e motivo:** não adotada no bloco técnico aprovado. A aplicação integrada conserva limites internos entre domínio, serviços e apresentação, sem exigir serviços independentes. Uma separação futura depende de evidência operacional; não é requisito da primeira implantação.

### E. Construir feedback e analytics dentro do produto

- **Benefício:** centralizar relatos e automatizar parte das evidências de uso.
- **Custo e limite:** criar telas, permissões, armazenamento e manutenção para um processo que pode começar com um canal externo e registro manual. Não há demanda conhecida que exija essa automação. Rastreamento de abertura do investidor também não faz parte do escopo.
- **Decisão e motivo:** excluída desta beta pelo escopo aprovado. O acompanhamento usa referências internas e horários quando disponíveis, com classificação e retorno dos pedidos fora de um novo módulo do produto. A disponibilidade total da empresa permite essa dinâmica sem impor automação.

### F. Adiar um dos modelos ou suas regras para reduzir a beta

- **Benefício:** diminuir a quantidade inicial de caminhos de cálculo, cadastro e verificação.
- **Custo e limite:** retirar parte da cobertura funcional já confirmada pelo solicitante. Um primeiro empreendimento em pool não elimina o requisito do modelo individual nem autoriza remover regras documentadas.
- **Decisão e motivo:** não adotada; o brief e os blocos aprovados preservam ambos os modelos. A implantação gradual permite validar inicialmente o modelo ainda não usado comercialmente com dados controlados, sem confundir essa validação com homologação de dados reais.

### G. Ampliar a beta para um SaaS genérico desde o início

- **Benefício:** disponibilizar antecipadamente cadastro público, cobrança e maior variedade de produtos e integrações.
- **Custo e limite:** ampliar a superfície de implementação antes de aparecerem necessidades concretas do primeiro uso. Isso também dilui o trabalho de substituir a planilha e acompanhar atendimentos reais.
- **Decisão e motivo:** não adotada nesta etapa, conforme os limites aprovados. Preservam-se convites, separação entre empresas, moeda identificada, tipo de produto e regras versionadas; cobrança SaaS, integrações e outros produtos continuam fora da beta. Essa delimitação não reabre a decisão de investir no SaaS.

### H. Sincronizar permanentemente planilha e plataforma

- **Benefício:** permitir à equipe continuar usando ambas as ferramentas durante a transição.
- **Custo e limite:** precisar definir autoridade de cada campo, resolver alterações concorrentes e mapear versões e regras entre estruturas diferentes. Sem esses mecanismos, preço, disponibilidade ou premissas podem divergir e gerar duas referências concorrentes.
- **Decisão e motivo:** não adotada no escopo e na contingência aprovados. Cada empreendimento tem uma referência oficial identificada. Uso temporário da planilha exige conferência dos dados vigentes, e pode ser inviável até a recuperação da plataforma; não implica manter uma segunda base sincronizada.

As escolhas históricas e a aprovação do bloco técnico têm alcances distintos: não se atribuem ao autor justificativas que ele não informou, nem rejeições de bibliotecas ou provedores que não foram comparados. Hospedagem, contas e limites operacionais permanecem nas questões abertas. Nenhuma alternativa acima autoriza uma contratação ou alteração dos documentos históricos.

## Non-Functional Requirements

- **Segurança e privacidade:** validar permissões no servidor, proteger sessão/origem e limitar tentativas de login; segredos fora do código; uploads com validação de conteúdo e limite de tamanho; arquivos privados; logs e códigos de ocorrência sem dados pessoais, credenciais ou tokens públicos.
- **Diagnóstico:** registrar operação, horário, identificadores internos, versões, resultado e etapa de emissão quando aplicáveis. Tornar emissões interrompidas e último backup bem-sucedido consultáveis pelo responsável autorizado. Usar avisos simples do ambiente, sem exigir ferramentas de análise no produto ou plantão permanente.
- **Capacidade:** medir duração do cálculo e da emissão, memória, consultas e tamanho dos arquivos com inventário e concorrência representativos. Limites operacionais precisam produzir respostas recuperáveis. Hospedagem, orçamento, capacidade simultânea e metas de latência continuam sem valores inventados.
- **Persistência e restauração:** verificar banco, PDF e restrições de acesso no ambiente efetivo; manter homologação separada; executar testes e restauração apenas em destinos isolados. Tolerância a perda de dados, tempo de recuperação e agenda de backup serão combinados antes da adoção oficial.
- **Manutenção:** manter domínio independente e contratos versionados; preservar históricos e definir migrações antes de alterar formatos persistidos. Limpeza de órfãos não pode apagar PDFs ou ativos ainda referenciados por documentos históricos.

### Verificação prevista para as recomendações aprovadas

| Recomendação do brief | Evidência esperada no produto e na homologação |
|---|---|
| R1 — contingência | Ensaio de pausa/retomada com referência oficial, responsável e conferência dos dados. |
| R2 — restauração dos acessos | Backup anterior a revogação/substituição, desativação de vínculo ou troca de senha não reabre links, sessões, credenciais antigas ou permissões indevidas. |
| R3 — emissão recuperável | Interrupção após upload, retry concorrente e conflito comercial preservam uma versão pronta coerente e não substituem a anterior até a confirmação válida, sem suspender sua expiração ou revogação. |
| R4 — histórico legível | Proposta emitida antes de atualização conserva valores, textos relevantes e PDF. |
| R5 — clareza do fluxo | Administrador distingue os três conjuntos do pool; consultor compreende conflitos e continua com dados válidos preservados. |
| R6 — diagnóstico | Relato manual pode ser associado a uma ocorrência interna sem copiar dados do investidor ou o link público. |
| R7 — capacidade e custo | Ensaio registra tempos e consumo representativos; acompanhamento inclui arquivos, banco, transferência e backups. |
| R8 — acompanhamento | Registro manual diferencia atendimento, emissão, reemissão, envio e interrupção; primeiro balanço tem janela e amostra combinadas. |

Essas são verificações futuras, não resultados de testes executados. As condições comerciais e os dados reais continuam sujeitos à homologação documentada.

## Detailed Implementation Plan

### Alcance e convenções de execução

Este é um plano para construção posterior, na raiz deste workspace. Não autoriza executar a implementação, publicar o serviço ou contratar infraestrutura nesta etapa documental. O desenho original, o plano anterior, o RFC, o brief e o XLSX permanecem como fontes históricas; a aplicação não altera nem interpreta fórmulas do XLSX.

Os quinze pacotes abaixo constituem uma única sequência de implementação. Cada tabela enumera os arquivos do pacote e a finalidade de cada um. As ações **Create** identificam a primeira criação; **Modify** autoriza a alteração explícita de arquivo entregue por fase anterior. A lista de cada fase é seu manifesto de escrita, incluindo integrações posteriores. Não há exclusões previstas. O `.gitignore` já é entregue nesta resolução documental e aparece como **Modify** no P01. Ao executar um pacote, confirmar antes se algum arquivo passou a existir e preservar alterações legítimas; diferenças materiais exigem atualizar o manifesto. Excluir do versionamento `node_modules/`, `.next/`, `out/`, `dist/`, `build/`, arquivos `.env` e `.env.*` (exceto `.env.example`), PDFs gerados, armazenamento privado e backups. A regra não abrange todos os gerados: **versionar obrigatoriamente `package-lock.json`, migrações SQL e os metadados gerados de migração em `drizzle/meta/`**, inclusive snapshots e `_journal.json`. O `.gitignore` deve manter essas exceções explícitas; `npm ci` e a geração incremental de migrações dependem delas.

Os caminhos entre crases são relativos à raiz e representam arquivos futuros. Não são links para implementações existentes. Os nomes de migrações e metadados abaixo são os nomes planejados para a primeira migração; se a versão fixada do gerador produzir nomes diferentes, registrar os nomes efetivos no manifesto antes de aplicá-la. Não editar um snapshot gerado para simular uma migração que não ocorreu.

**Catálogo de mensagens e ordem de dependências:** `src/i18n/pt-BR.ts` e o acesso tipado em `src/i18n/index.ts` são criados no P01, antes dos primeiros estados de interface. São módulos simples de TypeScript, sem importar domínio, banco, autenticação ou apresentação de fases futuras; os tipos de chaves derivam do catálogo já existente. O domínio devolve códigos e dados, sem importar o catálogo. Cada fase que acrescenta mensagens registra Modify nos dois módulos e inclui suas chaves antes de integrar os consumidores no mesmo pacote. Rótulos, instruções, erros apresentados, textos de acessibilidade, e-mails de identidade e textos de novas propostas vêm desse catálogo desde a primeira entrega. Dados inseridos por usuários e textos históricos já congelados em `ProposalPresentation` permanecem dados; não são traduzidos novamente na consulta. Ao final do P13, nenhuma tela prevista mantém textos funcionais locais, e nenhum checkpoint importa arquivo criado por fase posterior.

Além das bibliotecas do bloco técnico, o detalhamento explicita auxiliares de implementação: `@aws-sdk/client-s3` para o adaptador de arquivos, `@pdf-lib/fontkit` para fontes incorporadas, `server-only` para proteger importações de servidor e `pdfjs-dist` apenas no desenvolvimento para conferir o conteúdo dos PDFs. Foram aprovadas com o plano em 2026-11-13; em 2026-11-14 foram acrescentados `pg`, `@better-auth/drizzle-adapter`, `sharp` e o transporte transacional `nodemailer`, com `@types/pg` e `@types/nodemailer` no desenvolvimento. Fixar versões compatíveis e registrar o lockfile; não pressupor que a documentação consultada comprova a integração.

O [pdf-lib exige fontkit para fontes personalizadas](https://pdf-lib.js.org/#embed-font-and-measure-text). As fontes propostas são Noto Sans regular e bold, com bytes e licença copiados de uma revisão identificada do [repositório de fontes](https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSans), sem download durante a emissão. O [PDF.js documenta uso como biblioteca e exemplos em Node](https://mozilla.github.io/pdf.js/examples/). Essas consultas sustentam os auxiliares propostos, não acrescentam funções para o usuário final.

#### Matriz fechada de pacotes diretos

| Uso | Pacotes / importações selecionadas |
|---|---|
| Runtime da aplicação | `next`, `react`, `react-dom`, `server-only` |
| Persistência e identidade | `pg` (`Pool`, `PoolClient`), `drizzle-orm` (`drizzle-orm/node-postgres`), `better-auth`, `@better-auth/drizzle-adapter` (provider `pg`) |
| Domínio e arquivos | `zod`, `decimal.js`, `pdf-lib`, `@pdf-lib/fontkit`, `@aws-sdk/client-s3`, `sharp` |
| E-mail de identidade | `nodemailer` com SMTP configurado no servidor |
| Desenvolvimento | `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/pg`, `@types/nodemailer`, `drizzle-kit`, `eslint`, `eslint-config-next`, `vitest`, `@playwright/test`, `pdfjs-dist` |

Fixar versões compatíveis no P01, incluindo pacotes de tipos necessários, e conservar o lockfile. `drizzle-orm/node-postgres` é uma importação de `drizzle-orm`, não um pacote separado. O cliente segue a [integração Drizzle com node-postgres](https://orm.drizzle.team/docs/get-started-postgresql); o adaptador de identidade segue o [pacote próprio do Better Auth](https://better-auth.com/docs/adapters/drizzle). A decisão não autoriza instalar ou contratar serviços nesta etapa documental.

### Contratos que a implementação deve preservar

| Contrato | Definição necessária |
|---|---|
| `DecimalText`, `CivilDate` | Texto decimal canônico e data civil válida `YYYY-MM-DD`; dinheiro nunca é transportado como `number`. Taxas usam frações entre zero e um. |
| `CalculationInput` | União por `model`, com calendário, períodos, cenários, investimento e `PaybackRule`; `INDIVIDUAL` acrescenta unidade/noites/tarifas/custos; `POOL` acrescenta inventário, participantes, perdas, retenções e custos do investidor. |
| `Participation` | Percentuais contratuais conciliados ou pesos com base e valores de referência publicados; bases `LIST_PRICE`, `AREA`, `IDEAL_FRACTION` e `MANUAL`. Pesos desconhecidos não viram zero. |
| `PaybackRule`, `Metric` | `SIMPLE` ou `DEDUCTED_MONTHS` com inteiro positivo; resultado disponível ou motivo `PARTIAL_YEAR`, `NON_POSITIVE_RESULT`, `INVALID_INVESTMENT` ou `RECOVERED_WITHIN_DEDUCTION`. |
| `CalculationResult` | `engineVersion`, horizonte, indicador de ano completo, cenários, períodos, totais, despesas discriminadas, participação, retorno, payback escolhido e simples e alertas. |
| `ActorContext` | `userId`, `companyId` e papel resolvidos pelo servidor a partir de sessão e vínculo ativo. |
| `PaymentPlan`, `PaymentSchedule` | Condição administrativa versionada e cronograma comercial que preserva entrada, datas e quantidade/IDs de parcelas; somente valores das parcelas podem mudar. Inclui `conditionVersionId`, desconto, líquido, valores resultantes, `adjustedByUserId` do servidor e resíduo assistido somente na primeira parcela, conforme seção 6. |
| `DraftCommand` | Empreendimento, unidade, revisões esperadas, `conditionVersionId`, `discountRate`, valores propostos das parcelas por ID, interessado, horizonte e cenário personalizado. Não aceita resultados financeiros prontos nem alterações de datas/entrada/quantidade. O registro efetivo acrescenta `adjustedByUserId` a partir de `ActorContext` e preserva os valores resultantes validados. |
| `DraftDTO` | Entradas, dono, revisão do rascunho, referências utilizadas, resultado e desatualização; inclui referência da emissão em andamento para recuperar uma tentativa após recarregar a tela. |
| `ProposalSnapshot` | Formato versionado com empresa, empreendimento, unidade, consultor, interessado, `conditionVersionId`, desconto, cronograma resultante, `adjustedByUserId`, versões de catálogo/premissas/motor, entradas e resultados, número, versão, emissão, validade, fuso, contatos e ativos imutáveis. |
| `ProposalPresentation` | Formato versionado com seções, textos e valores já preparados para exibição, inclusive motivos de indisponibilidade; persistido na emissão e consumido por página e PDF. |
| `IssueCommand`, `IssuedProposalDTO` | Rascunho, revisão esperada, chave idempotente e versão substituída; retorno com emissão, número, versão e estado. Link somente quando pronto e para usuário autorizado. |
| `FileStore` | `putImmutable`, `get` e `deleteOrphan`; o serviço decide a elegibilidade para apagar, o adaptador executa a operação. Bytes têm MIME, tamanho e hash conferíveis. |

Os comandos administrativos e DTOs correspondentes serão definidos no serviço proprietário, com schemas compartilhados entre ação de servidor e serviço. Erros têm código estável, campos e código de ocorrência quando aplicável. A integração não devolve stack, SQL, segredos ou token público no erro.

### Sequência única de implementação

#### P01 — configuração, contratos e precisão

Preparar ferramentas e contratos antes de importar regras em telas. Declarar em `package.json` os scripts indicados ao final desta seção. Configurar testes unitários sem banco e testes de integração com configuração separada. Criar já a estrutura mínima de App Router, antes das páginas funcionais do P06, e executar build a partir deste pacote. As verificações não exigem banco operacional nem acesso à rede para renderizar uma entrada mínima.

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Create | `package.json` | Dependências, versão de Node suportada pela combinação fixada e scripts reproduzíveis. |
| Create | `package-lock.json` | Fixar a resolução efetivamente instalada. |
| Create | `tsconfig.json` | Verificação estrita, aliases e fronteiras de compilação do projeto. |
| Create | `next-env.d.ts` | Declarações geradas pelo Next, sem edição manual de tipos. |
| Create | `next.config.ts` | Publicação Node e inclusão dos ativos locais necessários ao PDF. |
| Create | `eslint.config.mjs` | Regras compatíveis com Next/TypeScript e restrição de importações do domínio para servidor/UI. |
| Modify | `.gitignore` | Preservar exclusões explícitas de execução e exceções obrigatórias para `.env.example`, `package-lock.json` e `drizzle/meta/`. |
| Create | `.env.example` | Nomes das configurações, exemplos identificados como desenvolvimento e nenhum segredo real. |
| Create | `vitest.config.ts` | Descobrir somente testes unitários e seus aliases. |
| Create | `vitest.integration.config.ts` | Runner com banco de teste e setup separado; execução de integração explícita. |
| Create | `playwright.config.ts` | Servidor e projetos de navegador para jornadas responsivas controladas. |
| Create | `drizzle.config.ts` | Schema e diretório de migrações; não aplicar migrações automaticamente no carregamento da aplicação. |
| Create | `src/i18n/pt-BR.ts` | Catálogo único iniciado com textos dos estados mínimos, campos e erros apresentados; nenhuma dependência de fases futuras. |
| Create | `src/i18n/index.ts` | Acesso às mensagens com chaves tipadas a partir do catálogo; utilizável por servidor e navegador, sem importar módulos futuros. |
| Create | `src/app/layout.tsx` | Estrutura global mínima com `lang="pt-BR"` e importação de estilos. |
| Create | `src/app/globals.css` | Estilos mínimos para build e páginas iniciais; acabamento no P13. |
| Create | `src/app/page.tsx` | Único proprietário de `/`; entrada mínima sem importar autenticação ainda inexistente. |
| Create | `src/app/not-found.tsx` | Estado genérico mínimo. |
| Create | `src/app/error.tsx` | Limite mínimo de erro recuperável, sem detalhes sensíveis. |
| Create | `src/domain/contracts.ts` | Tipos compartilhados de entradas, regras e resultados descritos acima. |
| Create | `src/domain/schemas.ts` | Validação discriminada, limites numéricos e campos obrigatórios, distinguindo ausência de zero. |
| Create | `src/domain/errors.ts` | Erros de domínio e associação aos campos sem dependência de HTTP. |
| Create | `src/domain/money.ts` | Parse pt-BR, decimal canônico e apresentação com a política aprovada. |
| Create | `tests/unit/money.test.ts` | Precisão, arredondamento e rejeição de entrada ambígua. |
| Create | `tests/unit/schemas.test.ts` | Limites, regras incompletas e diferenças entre zero, ausência e valor inválido. |

**Verificação do pacote:** `1.234,56` vira `1234.56`; texto inválido é recusado; `0.1 + 0.2` apresenta `0.30` e `1.005` apresenta `1.01`. Ocupação maior que um e meses descontados não inteiros/positivos são recusados. Os estados mínimos da interface já obtêm textos pelo acesso tipado do catálogo, sem importar serviços futuros. Rodar os testes unitários afetados, typecheck e `npm run build` da estrutura mínima. Cada pacote posterior executa typecheck e build sobre a aplicação acumulada, usando apenas dependências já entregues, e confere que suas novas mensagens foram incluídas no catálogo antes dos consumidores. Isso inclui P06–P13 ao introduzir/alterar UI e P14–P15 ao integrar dados e operação. Acessos a banco/segredos de runtime são adiados para requisições, sem consultas na geração estática; os testes de integração usam configuração isolada.

#### P02 — calendário e horizonte

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Create | `src/domain/calendar.ts` | `buildCalendar`: datas civis, temporadas, precedência, contagens por período e ano completo. |
| Create | `fixtures/reference/calendar.ts` | Calendários controlados de anos comuns, bissextos e períodos divididos. |
| Create | `tests/unit/calendar.test.ts` | Exclusividade de classificação, sobreposição, lacunas e reconciliação das contagens. |

**Verificação do pacote:** 2026 totaliza 365 dias e 2024, 366; especial prevalece sobre feriado; fim de semana é configurável; março dividido concilia; período excluído impede indicadores anuais; indisponibilidade de noites não altera por si a duração do ano-base. Não somar milissegundos em horários locais para gerar datas civis.

#### P03 — despesas, operação individual e indicadores

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Create | `src/domain/costs.ts` | Custos fixos/percentuais, base explícita, ordem de aplicação e retenções. |
| Create | `src/domain/individual.ts` | Receitas por noites, tarifas e ocupação; resultados por período da unidade. |
| Create | `src/domain/metrics.ts` | Investimento, retornos e ambos os paybacks, com motivos de indisponibilidade. |
| Create | `fixtures/reference/individual.ts` | Referência independente com receitas e custos verificáveis. |
| Create | `tests/unit/costs.test.ts` | Bases, ordem, saldo positivo, despesas fixas e rejeição de dependências inválidas. |
| Create | `tests/unit/individual.test.ts` | Operação completa, receita zero, custos persistentes e horizonte parcial. |
| Create | `tests/unit/metrics.test.ts` | Retornos simples, regra de meses descontados e estados sem valor. |

**Verificação do pacote:** 365 noites, diária `500`, ocupação `0.8`, custo fixo anual `18000` e administração `0.15` geram receita `146000.00`, custos `39900.00` e resultado `106100.00`. Investimento `600000` produz payback simples de `67.86` meses e, descontando 24 meses, `43.86` meses. Ocupação zero conserva resultado `-18000.00`; ano parcial não anualiza. A diferença de 24 meses é conferida antes do arredondamento.

#### P04 — pool e distribuição

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Create | `src/domain/pool.ts` | Operação coletiva, retenções, participação e resultado do investidor. |
| Create | `src/domain/calculate.ts` | Entrada pública única do motor, escolhendo o modelo sem dependência de persistência. |
| Create | `fixtures/reference/pool.ts` | Inventário e participantes controlados, incluindo unidade fora da oferta comercial. |
| Create | `tests/unit/pool.test.ts` | Denominador completo, pesos, perdas, custos exclusivos e ajustes de apresentação. |

**Verificação do pacote:** dez unidades nas condições do P03, custo fixo coletivo anual `180000` e taxa `0.15` geram receita `1460000.00`, distribuível `1061000.00` e parcela de `106100.00` para participação `0.1`. Pesos `498000` e `628000` usam denominador `1126000`. Alterar desconto ou disponibilidade comercial não muda o rateio publicado. Percentuais incompletos e soma de pesos zero são recusados. Prejuízo `-100` gera parcela `-10` em repasse proporcional e distribuição zero em absorção, preservados déficit e custos exclusivos.

#### P05 — banco, revisões e isolamento

Criar schema relacional com conteúdos versionados validados como JSON quando forem agregados de premissas e propostas. Publicações e snapshots não são coleções de campos livremente editáveis após emissão. Separar o conteúdo imutável dos ponteiros e estados de acesso.

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Create | `compose.yaml` | PostgreSQL local de desenvolvimento/teste, sem apontar para dados operacionais. |
| Create | `src/server/env.ts` | Validar ambiente, origens, banco, armazenamento, chave de links e limites operacionais. |
| Create | `src/server/db/client.ts` | `pg.Pool` único por processo, `drizzle-orm/node-postgres`, transações no mesmo cliente e encerramento explícito em comandos/testes. |
| Create | `src/server/db/schema/auth.ts` | Identidade global, sessões com vínculo selecionado, tokens de ativação/recuperação e marca de credencial a recuperar após restauração. |
| Create | `src/server/db/schema/company.ts` | Empresa, vínculo/aceite/revalidação pendentes, papéis e contador de propostas por empresa. |
| Create | `src/server/db/schema/catalog.ts` | Empreendimentos, unidades, versões de condições administrativas, limites por empreendimento/exceção por unidade, disponibilidade e revisão de catálogo. |
| Create | `src/server/db/schema/premises.ts` | Rascunhos, versões publicadas, inventário/participantes e referência de vigência. |
| Create | `src/server/db/schema/simulations.ts` | Interessados, dono, entradas, resultado e revisão de rascunho. |
| Create | `src/server/db/schema/proposals.ts` | Série, versões, emissões, tentativas e links com restrições de unicidade e empresa. |
| Create | `src/server/db/schema/audit.ts` | Eventos de alteração com contexto e dados mínimos, sem segredos. |
| Create | `src/server/audit.ts` | `appendAudit` na mesma transação da mudança que será registrada. |
| Create | `drizzle/0000_beta.sql` | Primeira migração: tabelas, índices, referências compostas e proteção dos conteúdos imutáveis. |
| Create | `drizzle/meta/0000_snapshot.json` | Metadados gerados para reprodução da primeira migração. |
| Create | `drizzle/meta/_journal.json` | Registro de migrações compatível com a ferramenta fixada. |
| Create | `tests/support/database.ts` | Criar/limpar somente banco isolado, com guarda do destino e conexões independentes para concorrência. |
| Create | `tests/support/setup-integration.ts` | Verificar ambiente de teste antes de migrar ou limpar dados. |
| Create | `tests/integration/schema.test.ts` | Referências cruzadas, imutabilidade, unicidade e separação de bases. |

**Cliente e ciclo de conexões:** `client.ts` importa `Pool` de `pg` e `drizzle` de `drizzle-orm/node-postgres`; cria `new Pool({ connectionString, max, idleTimeoutMillis, connectionTimeoutMillis, ssl })` a partir de ambiente validado e `drizzle({ client: pool, schema })`. Validar `DATABASE_POOL_MAX`, `DATABASE_IDLE_TIMEOUT_MS` e `DATABASE_CONNECT_TIMEOUT_MS` como inteiros positivos e `DATABASE_SSL` conforme ambiente; os exemplos locais usam `max=10`, `idleTimeoutMillis=30000`, `connectionTimeoutMillis=5000`, sem representar capacidade contratada. TLS operacional valida certificado; não usar `rejectUnauthorized: false` como solução genérica. Uma instância por processo, reaproveitada no hot reload, sem criar pool por requisição. Em transação, reservar um cliente e executar todas as consultas nesse cliente; liberar em `finally`, com rollback antes de liberar após erro. `pool.on('error')` produz diagnóstico sem segredos. Comandos encerram com `await pool.end()` em `finally`; o runtime drena no desligamento controlado, não a cada requisição. Ver [ciclo do pool node-postgres](https://node-postgres.com/features/pooling).

`tests/support/database.ts` cria um pool exclusivo para o banco isolado, com pelo menos duas conexões para disputas. Em cada teste concorrente, adquirir dois `PoolClient` por `pool.connect()`, mantê-los reservados simultaneamente e conferir `pg_backend_pid()` distintos; envolver cada um no Drizzle sem compartilhamento de transação. Fazer rollback se necessário e `release()` em `finally` para ambos, inclusive quando uma asserção falhar; executar `await pool.end()` no teardown da suíte. Migração/limpeza só começa após a guarda do destino efetivo. Nenhum cliente ou pool de testes é o singleton operacional.

**Regras de schema:** referências comerciais incluem empresa e identificador. Unicidade de unidade é por empreendimento; de versão, por série/empresa; de chave idempotente, por empresa; de hash do token, global. A série guarda o ponteiro para a versão pronta atual. Emissões guardam dono, rascunho, fingerprint da solicitação e estado; tentativas guardam contador crescente, posse temporária, etapa, objeto e erro. Número e versão são reservados atomicamente e não reutilizados após falha; lacunas não significam proposta emitida.

**Verificação do pacote:** migrar banco vazio; recusar vínculos entre empresas; impedir alteração de conteúdo publicado e permitir operações autorizadas sobre estados separados. A guarda compara o destino efetivo do banco, e não somente a grafia de URLs, e impede usar a base operacional em integração. Testes concorrentes usam conexões reais distintas, não mocks das transações.

#### P06 — autenticação e provisionamento por convite

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Modify | `src/i18n/pt-BR.ts` | Acrescentar textos das telas de identidade, seleção de vínculo, navegação e e-mails antes dos consumidores. |
| Modify | `src/i18n/index.ts` | Manter o acesso tipado às mensagens de identidade, sem importações de módulos futuros. |
| Create | `src/server/auth/config.ts` | Better Auth, adaptador Drizzle `pg`, ativação/recuperação por e-mail e revogação global na troca de senha; cadastro público desativado. |
| Create | `src/server/auth/context.ts` | `requireActor` e autorização por papel/vínculo sem confiar no payload. |
| Create | `src/server/auth/users.ts` | Criar/ativar/desativar vínculos e revogar sessões locais; nunca definir senha ou alterar e-mail de identidade global. |
| Create | `src/server/auth/email.ts` | Transporte SMTP com `nodemailer` para ativação e recuperação, sem revelar token ao administrador ou aos logs. |
| Create | `src/server/auth/recovery.ts` | Recuperação exclusiva pelo titular, tokens de uso único, limitação e verificação da exigência pós-restauração. |
| Create | `src/app/api/auth/[...all]/route.ts` | Integração do mecanismo de identidade com o Next. |
| Create | `src/app/(auth)/entrar/page.tsx` | Entrada da equipe com mensagens recuperáveis. |
| Create | `src/app/(auth)/recuperar-senha/page.tsx` | Solicitar recuperação ao e-mail verificado com resposta genérica. |
| Create | `src/app/(auth)/trocar-senha/page.tsx` | Concluir ativação/recuperação com token do e-mail do titular; nunca senha escolhida pelo administrador. |
| Create | `src/app/(auth)/actions.ts` | Adaptação de formulários de identidade, sem regras comerciais no navegador. |
| Create | `src/app/(staff)/layout.tsx` | Exigir sessão/vínculo e compor navegação mínima antes das primeiras páginas comerciais. |
| Create | `src/app/(staff)/dashboard/page.tsx` | Início autenticado em `/dashboard`, sem referências a páginas/serviços ainda não entregues. |
| Create | `src/components/app-shell.tsx` | Navegação mínima por papel; links de cada módulo entram quando a fase os entregar. |
| Modify | `src/app/page.tsx` | Encaminhar anônimo a `/entrar` e sessão autorizada a `/dashboard`; vínculo pendente segue ativação/seleção. |
| Create | `scripts/bootstrap-admin.ts` | Provisionar a empresa parceira e seu primeiro administrador. |
| Create | `scripts/invite-company.ts` | Criar empresa beta e primeiro administrador por comando do operador. |
| Create | `tests/integration/auth.test.ts` | Identidade A/B, autoridade local, recuperação pelo titular, entrega simulada de e-mail, revogação de sessões e convites. |

**Contexto da sessão:** armazenar a referência do vínculo ativo na sessão e revalidá-la no servidor. Com um vínculo permitido, a entrada é direta; se houver mais de um, o próprio fluxo de entrada apresenta somente os vínculos retornados ao usuário autenticado e persiste a seleção após conferi-la. A escolha enviada pelo navegador nunca cria permissão. Enquanto houver ativação, recuperação de credencial ou revalidação de vínculo pendente, permitir somente o fluxo restrito necessário, sem acesso comercial. O papel de administrador de A não amplia a autoridade sobre a identidade global.

**Verificação do pacote:** sessão ausente recusa acesso; consultor não administra equipe; vínculo inativo impede operações; `companyId` forjado não troca empresa. A mesma identidade com vínculos ativos em A/B comprova que administrador de A não define senha, não altera e-mail, não obtém token nem afeta sessão de B. Desativar A bloqueia sessão de A e mantém B. Recuperação só conclui com token recebido no e-mail do titular e revoga todas as sessões; reutilização/expiração do token e falha de entrega são testadas. Identidade existente convidada conserva sua credencial. Scripts não recebem/imprimem senha do titular ou token. Testar `/` anônimo → `/entrar`, autenticado autorizado → `/dashboard`, e navegação mínima sem links quebrados. Rodar typecheck e build já nesta fase. A separação comercial de catálogo/premissas/propostas será ampliada nos pacotes que os criarem; não importar serviços futuros neste teste.

#### P07 — catálogo, identidade da empresa e arquivos

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Modify | `src/i18n/pt-BR.ts` | Acrescentar textos de empresa, equipe, catálogo, condições e arquivos usados nas telas desta fase. |
| Modify | `src/i18n/index.ts` | Integrar o acesso tipado às mensagens administrativas já presentes no catálogo. |
| Modify | `src/components/app-shell.tsx` | Acrescentar somente os links de navegação das telas entregues neste pacote. |
| Create | `src/server/catalog/contracts.ts` | Comandos/DTOs de empresa, empreendimento, unidade, limite de desconto e condição administrativa versionada; separar ajustes comerciais dos campos imutáveis. |
| Create | `src/server/catalog/service.ts` | Cadastro, identidade comercial, arquivo lógico, publicação de condições e limites por empreendimento/unidade com incremento de revisão. |
| Create | `src/server/catalog/images.ts` | Validar upload e converter WebP com sharp antes do armazenamento, produzindo referência PNG imutável. |
| Create | `src/server/storage/contract.ts` | Interface privada e tipos de objeto/hash/MIME. |
| Create | `src/server/storage/local.ts` | Adaptador de desenvolvimento com gravação exclusiva e caminhos confinados. |
| Create | `src/server/storage/s3.ts` | Adaptador S3 com bucket privado e proteção contra sobrescrita. |
| Create | `src/server/storage/index.ts` | Selecionar adaptador por configuração validada. |
| Create | `src/app/(staff)/admin/empresa/page.tsx` | Identidade, marca e contatos comerciais da empresa. |
| Create | `src/app/(staff)/admin/equipe/page.tsx` | Gestão administrativa de usuários e vínculos. |
| Create | `src/app/(staff)/admin/empreendimentos/page.tsx` | Listagem e criação de empreendimentos. |
| Create | `src/app/(staff)/admin/empreendimentos/[id]/page.tsx` | Unidades, preços, disponibilidade e condições do empreendimento. |
| Create | `src/app/(staff)/admin/actions.ts` | Ações finas de administração que resolvem o ator e delegam aos serviços. |
| Create | `tests/integration/catalog.test.ts` | Permissões, revisões, condições, arquivos e conservação do histórico. |
| Create | `tests/integration/storage.test.ts` | Imutabilidade de objeto, falhas de leitura/gravação e isolamento dos adaptadores. |

**Regras e verificação:** quando o limite de desconto não estiver configurado, somente desconto zero será permitido; qualquer desconto positivo deverá ser recusado. A exceção explícita por unidade substitui o limite do empreendimento, inclusive quando zero; sem exceção usa-se o limite do empreendimento e, sem ambos, zero. Conferir limites maior/menor por unidade e ausência de configuração. Condições administrativas preservam versões anteriores e só o administrador publica nova versão para mudar datas, entrada ou quantidade de parcelas. Alterações de preço, disponibilidade, limites ou condições incrementam a revisão de forma transacional. Upload aceita PNG/JPEG/WebP de até 5 MB na entrada, com validação dos bytes e sem buscar URLs arbitrárias. Para WebP estático, `images.ts` usa `sharp(input).png().toBuffer()` antes de persistir qualquer objeto; valida também o PNG derivado (até 5 MB e 25 milhões de pixels). Entradas de qualquer formato acima de 25 milhões de pixels e WebP animado são recusadas com mensagem explícita. Preservar transparência no PNG. Persistir somente o derivado PNG, com `contentType=image/png`, tamanho, dimensões, hash SHA-256 calculado sobre seus bytes e chave imutável; registrar `sourceMime=image/webp` apenas como proveniência. O snapshot referencia esse PNG/hash, e pdf-lib o incorpora diretamente com `embedPng`; não converter na emissão. PNG/JPEG validados seguem seus MIME/hashes próprios e `embedPng`/`embedJpg`. A API de [saída PNG do sharp](https://sharp.pixelplumbing.com/api-output/#png) sustenta a conversão.

Se decodificação/conversão falhar, retornar `IMAGE_CONVERSION_FAILED` com ocorrência e orientação para reenviar PNG/JPEG ou corrigir WebP; falhas de limite/formato usam `IMAGE_LIMIT_EXCEEDED`/`IMAGE_FORMAT_UNSUPPORTED`. Não persistir WebP bruto nem substituir a referência anterior, não salvar ativo incompleto e não omitir silenciosamente imagem aceita. Se upload do PNG falhar, devolver `IMAGE_STORAGE_FAILED`, manter o ativo anterior e tratar eventual objeto sem vínculo como órfão. Testar PNG, JPEG, WebP transparente convertido, bytes inválidos, WebP animado, PNG derivado acima do limite e indisponibilidade do sharp/storage; conferir MIME/hash do derivado e presença da imagem no PDF no P10. Objeto já existente não é sobrescrito: conferir hash para reconhecer repetição idêntica ou recusar diferença. A implementação S3 usa a precondição documentada de [gravação condicional](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html), cuja disponibilidade deve ser ensaiada no provedor efetivo. Não presumir que um mock prova compatibilidade de todo serviço S3.

#### P08 — publicação das premissas

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Modify | `src/i18n/pt-BR.ts` | Acrescentar mensagens de publicação por modelo/modalidade e pendências dos campos aplicáveis. |
| Modify | `src/i18n/index.ts` | Manter o acesso tipado aos textos do formulário de premissas. |
| Modify | `src/components/app-shell.tsx` | Acrescentar somente os links de navegação das telas entregues neste pacote. |
| Create | `src/server/premises/contracts.ts` | Schemas e DTOs de rascunho, publicação e retirada. |
| Create | `src/server/premises/service.ts` | Validar e publicar versões, controlar vigência e localizar propostas afetadas. |
| Create | `src/app/(staff)/admin/empreendimentos/[id]/premissas/page.tsx` | Preparar calendário, cenários, custos, inventário e participantes com revisão antes da publicação. |
| Create | `src/components/premises-form.tsx` | Campos e resumo que distinguem operação, participantes e oferta comercial. |
| Create | `tests/integration/premises.test.ts` | Publicação incompleta, concorrência, retirada e independência do catálogo. |

**Contratos:** `savePremiseDraft`, `publishPremises(actor, draftId, expectedRevision)` e `withdrawPremises(actor, versionId, reason)`. Publicação bloqueia a referência de vigência do empreendimento para impedir duas versões concorrentes com a mesma revisão. A retirada altera vigência e auditoria, não o conteúdo da versão histórica. Aplicar a matriz de publicação da seção 6: individual não exige campos de pool; percentuais contratuais conciliados não exigem pesos; modo por pesos exige conjunto completo e base/valores de referência. Ambos os modos de pool exigem política de prejuízo, e todos os modelos exigem calendário e payback, além dos dados de cálculo aplicáveis.

**Verificação do pacote:** publicar individual sem campos de pool; publicar pool por percentuais conciliados sem pesos; publicar pool por pesos completos. Recusar ausência de calendário/payback em todos, percentuais incompletos no modo contratual, pesos/base/valores incompletos no modo por pesos e política de prejuízo ausente nos dois modos de pool. Não exigir campos de outra modalidade. Testar que nova tabela de preços não altera participações já publicadas.

#### P09 — rascunhos e simulação do atendimento

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Modify | `src/i18n/pt-BR.ts` | Acrescentar textos de simulação, autorização de pagamento, desconto e recuperação de conflitos. |
| Modify | `src/i18n/index.ts` | Integrar acesso tipado às novas mensagens do atendimento. |
| Modify | `src/components/app-shell.tsx` | Acrescentar somente os links de navegação das telas entregues neste pacote. |
| Create | `src/server/simulations/contracts.ts` | Comandos/DTOs com versão da condição, desconto e valores de parcelas por ID; sem edição de datas/entrada/quantidade; registro efetivo do responsável, revisões e referência de emissão recuperável. |
| Create | `src/server/simulations/service.ts` | Criar/atualizar/recalcular rascunhos com versões verificadas; obter responsável de ActorContext, conferir limite efetivo e persistir cronograma e auditoria do ajuste. |
| Create | `src/server/simulations/payments.ts` | Comparar estrutura com a condição versionada, aceitar somente valores autorizados das parcelas, conferir desconto/soma e dividir resíduo somente na primeira parcela, sem alterar entrada. |
| Create | `src/app/(staff)/simulacoes/page.tsx` | Atendimentos acessíveis ao ator com estados de atualização. |
| Create | `src/app/(staff)/simulacoes/nova/page.tsx` | Seleção de empreendimento/unidade e início do atendimento. |
| Create | `src/app/(staff)/simulacoes/[id]/page.tsx` | Cenários, condições, interessado e recuperação do rascunho. |
| Create | `src/app/(staff)/simulacoes/actions.ts` | Validar comandos de formulário e chamar serviços autorizados. |
| Create | `tests/integration/simulations.test.ts` | Dono, concorrência, troca de unidade, faixas e condições. |

**Verificação do pacote:** outro consultor não abre o rascunho; revisão antiga gera conflito; troca de unidade refaz referências sem reaproveitar participação/custos indevidos. Cenário personalizado não sobrescreve oficiais. Atualização explícita destaca diferenças e preserva dados válidos. Aceitar desconto autorizado de 5% sobre R$ 100.000,00 mantendo datas, três parcelas e entrada de R$ 10.000,00, com parcelas R$ 28.333,34/R$ 28.333,33/R$ 28.333,33 e resíduo de R$ 0,01 na primeira. Recusar o mesmo líquido com data alterada, entrada diferente ou parcela acrescentada/removida; orientar nova condição administrativa versionada. Conferir versão selecionada, desconto, valores resultantes e responsável persistidos, ignorando autor forjado. Rejeitar soma divergente, datas inexistentes/repetidas/anteriores à emissão, recorrência, parcela não positiva, entrada incompatível e desconto acima do limite efetivo, sem presumir juros/correção. Sem parcelas, aceitar somente entrada já igual ao líquido. Reiniciar a aplicação conserva o atendimento.

#### P10 — snapshot, apresentação e PDF

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Create | `src/server/proposals/contracts.ts` | Comandos de emissão, snapshot, apresentação versionada e respostas públicas. |
| Create | `src/server/proposals/snapshot.ts` | Construir conteúdo a partir de fontes autorizadas e validar sua completude. |
| Create | `src/server/proposals/presentation.ts` | Preparar e congelar seções, valores e textos compartilhados pelos renderizadores. |
| Create | `src/server/proposals/pdf.ts` | PDF A4 paginado e independente de Chromium, com fontes e imagens incorporadas. |
| Create | `src/server/proposals/fonts.ts` | Carregar fontes locais e registrar fontkit sem chamadas de rede na emissão. |
| Create | `src/components/proposal-content.tsx` | Exibir a apresentação persistida, sem cálculo ou reformatação por regras atuais. |
| Modify | `src/i18n/pt-BR.ts` | Complementar/revisar o catálogo criado no P01 com textos de novas propostas, documentos e motivos de estado; preservar chaves consumidas pelas fases anteriores. |
| Modify | `src/i18n/index.ts` | Complementar o acesso tipado para preparar novas apresentações, sem reinterpretar apresentações históricas. |
| Create | `assets/fonts/NotoSans-Regular.ttf` | Fonte incorporada para texto legível e acentos. |
| Create | `assets/fonts/NotoSans-Bold.ttf` | Peso de destaque da mesma família. |
| Create | `assets/fonts/OFL.txt` | Preservar o texto da licença que acompanha os ativos. |
| Create | `assets/fonts/README.md` | Registrar origem, revisão e hashes das fontes incorporadas. |
| Create | `fixtures/reference/proposal.ts` | Propostas controladas com nomes longos, acentos, perdas e dados pendentes. |
| Create | `tests/support/pdf-text.ts` | Extração de texto do PDF com PDF.js, sem virar dependência da consulta pública. |
| Create | `tests/unit/proposal-pdf.test.ts` | Comparar conteúdo efetivo do PDF com a apresentação congelada. |

**Verificação do pacote:** conferir preço, três cenários oficiais e eventual quarto personalizado, resultado, investimento, participação, número, versão e validade extraindo texto dos bytes produzidos. Conferir `DEDUCTED_MONTHS`, prazo simples e mensagem de recuperação dentro dos meses descontados. Conferir que PNG/JPEG e o PNG derivado de WebP são incorporados pelos seus bytes/hash congelados. Revisar visualmente páginas com nomes extensos, acentos, ausência de imagem e quebra de página. Não gerar PDF a partir de HTML ou valores recebidos prontos do navegador. Futuras alterações de mensagens não mudam a apresentação já persistida.

#### P11 — emissão, recuperação e acesso autenticado às propostas

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Modify | `src/i18n/pt-BR.ts` | Acrescentar textos de histórico, emissão, retomada, revogação e estados recuperáveis. |
| Modify | `src/i18n/index.ts` | Manter o acesso tipado às mensagens de emissão antes da integração das telas. |
| Modify | `src/components/app-shell.tsx` | Acrescentar somente os links de navegação das telas entregues neste pacote. |
| Create | `src/server/proposals/repository.ts` | Reserva de número/versão, unicidade, bloqueios e transição final consistente. |
| Create | `src/server/proposals/issue.ts` | Coordenar preparação, reserva, PDF e confirmação conforme o protocolo aprovado. |
| Create | `src/server/proposals/recovery.ts` | Posse temporária, tentativas, retomada e identificação de órfãos. |
| Create | `src/server/proposals/links.ts` | Tokens aleatórios, hash, cifra, recuperação autorizada e revogação. |
| Create | `src/server/proposals/validity.ts` | Transformar a data final e o fuso em limite de validade persistido. |
| Create | `src/app/(staff)/propostas/page.tsx` | Histórico filtrado pela empresa e pelo papel/dono. |
| Create | `src/app/(staff)/propostas/[id]/page.tsx` | Versões, estado de emissão, cópia de link e revogação autorizada. |
| Create | `src/app/(staff)/propostas/actions.ts` | Adaptar emissão, retomada e revogação aos serviços. |
| Modify | `src/server/auth/users.ts` | Coordenar desativação/alteração de vínculo com os bloqueios e a ordem de registros da confirmação de emissão. |
| Modify | `src/server/catalog/service.ts` | Escritas de preço/disponibilidade, limites de desconto e condições usam os mesmos registros e ordem de locks da confirmação. |
| Modify | `src/server/premises/service.ts` | Publicar/retirar vigência coordena os mesmos registros da confirmação. |
| Modify | `src/server/simulations/service.ts` | Revisões de rascunho e referência de emissão coordenadas com reserva/confirmação. |
| Modify | `tests/integration/auth.test.ts` | Desativação concorrente com confirmação não publica indevidamente. |
| Modify | `tests/integration/catalog.test.ts` | Mudança comercial concorrente usa a coordenação entregue no P11. |
| Modify | `tests/integration/premises.test.ts` | Retirada/publicação concorrente impede confirmação com vigência antiga. |
| Modify | `tests/integration/simulations.test.ts` | Edição concorrente impede confirmação com revisão antiga. |
| Create | `tests/support/failing-store.ts` | Falhas e barreiras controladas no armazenamento para testar interrupções reais do protocolo. |
| Create | `tests/integration/issuance.test.ts` | Idempotência, disputas de versão, conflitos e confirmação final. |
| Create | `tests/integration/issuance-recovery.test.ts` | Reinício, posse vencida, executor antigo e limpeza protegida. |

**Reserva e concorrência:** calcular o fingerprint a partir do comando normalizado, contexto do dono e revisões solicitadas. Após verificar o direito de acesso, procurar a chave existente antes de recalcular: mesma chave e comando de uma emissão pronta devolvem sua referência original, mesmo que o rascunho ou catálogo tenham evoluído; isso não autoriza reemitir nem alterar o documento. Conteúdo diferente conflita. Na reserva nova, usar unicidade e transação para obter ou criar a emissão, alocar número/versão e congelar conteúdo. Na confirmação, bloquear os registros de autorização e estado relevantes numa ordem estável, com IDs ordenados dentro do mesmo grupo; conferir vínculo, catálogo, premissas, rascunho, série atual e tentativa antes de atualizar o ponteiro. Escritas de preços, vigência e desativação devem coordenar os mesmos registros para não contornar a conferência. Transação nenhuma atravessa geração ou upload.

Na reserva e na confirmação, revalidar também `conditionVersionId`, o limite efetivo de desconto e a estrutura preservada do cronograma: mesmos vencimentos, entrada integral e quantidade/IDs de parcelas. O responsável do ajuste vem do registro autenticado do atendimento; o navegador não troca sua autoria. Mudança de limite ou condição segue o conflito de revisão comercial, sem adaptar o snapshot antigo silenciosamente.

**Retomada:** implementar integralmente a matriz normativa da seção 7, incluindo códigos persistidos e distinção entre retomada de `PENDING` e nova solicitação após `FAILED`. Cada aquisição de posse incrementa um contador; a chave do objeto pertence à tentativa, cujo registro existe antes do upload. A confirmação exige o contador atual. Executor antigo não conclui depois de perder a posse. Recuperação não adota objeto já marcado para limpeza; cria outra tentativa e chave. Limpeza marca a tentativa de forma coordenada, confere referências e preserva objetos de versões prontas ou tentativas ativas. O armazenamento só apaga depois dessa decisão. Duração da posse, limite de tentativas e concorrência são configurações positivas validadas, com valores de produção definidos pelo ensaio, sem depender do relógio do navegador.

**Validade e links:** token de 32 bytes aleatórios em base64url, hash SHA-256 e cifra autenticada AES-256-GCM com IV aleatório; a cifra vincula empresa e versão para evitar troca de envelopes. A data final civil e o fuso são convertidos uma vez no servidor ao emitir, sem congelar o horário das consultas futuras. Internamente, `expiresAt` é o início exclusivo do dia seguinte à data final no fuso escolhido, e acesso exige `now < expiresAt`; a apresentação conserva a data final inclusiva. Usar a conversão de fuso do PostgreSQL e testar a fronteira, sem depender do fuso do processo Node. A documentação descreve [operações de datas e AT TIME ZONE](https://www.postgresql.org/docs/current/functions-datetime.html).

**Verificação do pacote:** duas chamadas da mesma chave retornam uma emissão; chave com outro conteúdo conflita. Dois comandos substituindo a mesma versão não tornam ambos atuais. Mudança de preço, venda, retirada de premissas, revisão do rascunho ou desativação antes da confirmação impede publicação. Falha após upload não libera link; retomada não duplica versão; executor com posse antiga é recusado; limpeza não apaga PDF referenciado. Cobrir todas as linhas da matriz, incluindo última tentativa transitória, posse expirada no limite, falha permanente de PDF, consulta de executor ativo e perda de resposta após commit; `READY` nunca regride e `FAILED` nunca retoma pela mesma chave. A versão anterior só é marcada como substituída na confirmação da substituta pronta; expiração ou revogação independentes continuam bloqueando seu acesso mesmo durante falha/retomada da reemissão.

#### P12 — página externa e download controlado

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Modify | `src/i18n/pt-BR.ts` | Acrescentar textos dos estados externos e download; conteúdo histórico continua vindo da apresentação congelada. |
| Modify | `src/i18n/index.ts` | Manter acesso tipado às mensagens externas já entregues. |
| Create | `src/server/proposals/public.ts` | Resolvedor único de token, prontidão, estado e validade. |
| Create | `src/app/p/[token]/page.tsx` | Consulta responsiva da apresentação emitida ou do estado restrito. |
| Create | `src/app/p/[token]/pdf/route.ts` | Download do objeto autorizado, sem URL permanente ou recálculo. |
| Create | `tests/integration/public-proposal.test.ts` | Token, estados, fuso, headers e ausência de conteúdo indevido. |

**Verificação do pacote:** token ativo funciona sem sessão; inexistente não revela identidade; vencido/revogado/substituído não contém valores nem bytes do PDF. Página e download usam o mesmo resolvedor, mas cada requisição valida seu próprio horário atual do servidor. Somente testes comparativos podem injetar o mesmo instante; é proibido reutilizar o timestamp da abertura da página para autorizar o download. Testar abertura antes de `expiresAt` seguida de download após esse limite, que deve recusar os bytes. Testar validade no último instante do dia e no início do seguinte, inclusive fuso diferente do processo. Aplicar `no-store`, `no-referrer` e `noindex, nofollow`; conferir também proxy e logs no ambiente efetivo. Versão antiga não redireciona à nova. Testar vencimento e revogação da proposta anterior enquanto sua reemissão permanece `PENDING` ou falha: o conteúdo anterior já não pode ser liberado. Não adicionar confirmação de leitura.

#### P13 — integração das telas e jornadas

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Modify | `src/i18n/pt-BR.ts` | Revisar/completar mensagens de todas as telas, componentes e estados pendentes; nenhuma duplicação funcional local ao final. |
| Modify | `src/i18n/index.ts` | Conferir acesso tipado e compatibilidade de todos os consumidores entregues. |
| Modify | `src/app/layout.tsx` | Acabamento da estrutura global criada no P01, conservando pt-BR. |
| Modify | `src/app/globals.css` | Completar estilos mínimos do P01: legibilidade, cenários e responsividade. |
| Modify | `src/app/page.tsx` | Conferir o redirecionador único de `/`: `/entrar` ou `/dashboard`. |
| Modify | `src/app/not-found.tsx` | Completar estado genérico de recurso não encontrado criado no P01. |
| Modify | `src/app/error.tsx` | Completar recuperação de erros criada no P01, sem detalhes sensíveis. |
| Modify | `src/app/(auth)/entrar/page.tsx` | Conferir mensagens e acessibilidade pelo catálogo existente, migrando eventual texto funcional local remanescente. |
| Modify | `src/app/(auth)/recuperar-senha/page.tsx` | Conferir textos e estados genéricos de recuperação pelo catálogo. |
| Modify | `src/app/(auth)/trocar-senha/page.tsx` | Conferir mensagens de ativação/troca, erros e orientações pelo catálogo. |
| Modify | `src/app/(staff)/layout.tsx` | Integrar navegação completa e estados da sessão já criada no P06. |
| Modify | `src/app/(staff)/dashboard/page.tsx` | Acesso autorizado aos empreendimentos e atendimentos em `/dashboard`, sem analytics. |
| Modify | `src/components/app-shell.tsx` | Concluir navegação/identidade comercial do shell criado no P06. |
| Modify | `src/app/(staff)/admin/empresa/page.tsx` | Conferir rótulos, instruções, erros e estados pelo catálogo único. |
| Modify | `src/app/(staff)/admin/equipe/page.tsx` | Conferir mensagens de vínculos/convites e estados pelo catálogo único. |
| Modify | `src/app/(staff)/admin/empreendimentos/page.tsx` | Conferir textos de listagem/criação e estados vazios pelo catálogo. |
| Modify | `src/app/(staff)/admin/empreendimentos/[id]/page.tsx` | Integrar campo monetário e mensagens finais sem alterar regras do serviço. |
| Modify | `src/app/(staff)/admin/empreendimentos/[id]/premissas/page.tsx` | Conferir mensagens por modelo/modalidade e migrar eventual texto funcional local remanescente. |
| Modify | `src/components/premises-form.tsx` | Finalizar comparação e distinção visual dos conjuntos do pool. |
| Modify | `src/app/(staff)/simulacoes/page.tsx` | Conferir listagem, estados e ações de atendimento pelo catálogo. |
| Modify | `src/app/(staff)/simulacoes/nova/page.tsx` | Conferir seleção e mensagens de início do atendimento pelo catálogo. |
| Modify | `src/app/(staff)/simulacoes/[id]/page.tsx` | Conectar formulário, comparação de cenários e controles recuperáveis aos serviços existentes. |
| Modify | `src/app/(staff)/simulacoes/actions.ts` | Ajustar DTOs de formulário para preservar entradas e comunicar conflitos na UI integrada. |
| Modify | `src/app/(staff)/propostas/page.tsx` | Conferir rótulos e estados do histórico pelo catálogo único. |
| Modify | `src/app/(staff)/propostas/[id]/page.tsx` | Integrar controles de emissão/retomada/revogação conforme a matriz normativa. |
| Modify | `src/app/(staff)/propostas/actions.ts` | Conservar chave idempotente e traduzir ações permitidas na UI integrada. |
| Modify | `src/app/p/[token]/page.tsx` | Conferir textos funcionais dos estados externos pelo catálogo, preservando o conteúdo histórico persistido. |
| Modify | `src/components/proposal-content.tsx` | Conferir que textos funcionais novos vêm do catálogo e conteúdo emitido permanece o da apresentação congelada. |
| Create | `src/components/money-field.tsx` | Entrada monetária pt-BR acessível, preservando texto validável. |
| Create | `src/components/scenario-comparison.tsx` | Comparar resultados com horizonte, unidades e motivos explícitos. |
| Create | `src/components/simulation-form.tsx` | Campos do atendimento e conservação de entradas após conflitos. |
| Create | `src/components/issue-controls.tsx` | Estado de emissão e chave idempotente estável durante uma solicitação e suas repetições. |
| Create | `tests/e2e/admin-flow.spec.ts` | Configurar, corrigir pendências e publicar premissas. |
| Create | `tests/e2e/commercial-flow.spec.ts` | Simular, salvar, emitir, copiar link, baixar PDF e recuperar conflitos. |
| Create | `tests/e2e/access-isolation.spec.ts` | Papéis, consultores distintos e empresas convidadas. |
| Create | `tests/e2e/public-proposal.spec.ts` | Consulta anônima e estados após revogação/substituição. |

**Verificação do pacote:** executar as cinco CUJs com dados controlados. Inventariar todas as telas e componentes entregues de P01 a P13 e concluir a migração de qualquer texto funcional local: rótulos, instruções, erros, estados e acessibilidade usam o catálogo, ressalvados dados de usuário e textos históricos congelados. As tabelas desta fase incluem todos os consumidores `.tsx` anteriores e os componentes novos; nenhum consumidor importa arquivo criado em fase futura. O navegador não inventa nova chave em cada retry da mesma intenção; após recarregar, recupera a emissão associada ao rascunho autorizado. Conferir viewports fixos em CSS pixels: `1440×900` (largura 1440 px), `768×1024` em retrato e `390×844` (largura 390 px), teclado, nomes extensos, erros de campo, perda do pool e ausência de imagem. O administrador distingue os três conjuntos do pool. Geração da proposta e envio efetivo continuam ações distintas. Rodar build, typecheck, lint e os E2E afetados após a integração.

#### P14 — referências legadas e homologação assistida

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Create | `fixtures/reference/legacy-comparison.json` | Aritmética legada controlada, com origem e limites explícitos. |
| Create | `fixtures/reference/pilot-pool-input.json` | Estrutura de coleta marcada como não homologada até receber os dados reais completos. |
| Create | `scripts/prepare-initial-data.ts` | Validar carga assistida de dados preparados sem interpretar XLSX nem publicar automaticamente. |
| Create | `tests/integration/reference-cases.test.ts` | Conferir referências individuais e do pool sem transformar pendência real em teste aprovado. |
| Create | `docs/runbooks/homologacao.md` | Responsáveis, dados, cálculos independentes e evidências antes do uso real. |
| Create | `docs/runbooks/implantacao-gradual.md` | Referência oficial, entrada de cada empreendimento, primeiro balanço e adoção. |
| Create | `docs/runbooks/feedback-beta.md` | Canal, registro manual, triagem, decisões e definições de atendimento/emissão/envio. |

**Origem e limite das referências:** `FINAL 03` e `FINAL 07` são códigos comerciais da aba QUARTOS do arquivo [Calculadora investidores.xlsx](<../../Calculadora investidores.xlsx>), não números de cenários de ocupação. O [desenho do piloto, revisão 1, seções 6 e 7](<../../Desenho do piloto - Plataforma comercial hoteleira.md>) registra suas discrepâncias. Os dados abaixo foram lidos dos valores e fórmulas persistidos, sem executar Excel. O caso aritmético não transforma a planilha em motor nem homologa tarifas, calendário ou rateio do pool real.

**FINAL 07 — comparação aritmética individual controlada:** QUARTOS!E12:P12 identifica unidade LUXO, investimento e venda de R$ 498.000,00. O comparativo reproduz CALCULADORA!B3, G6:J19 e K25:K30, usando tarifas proporcionais fixas de alta `1200 × 498000 / 628000 = 951.592356687898089…` BRL/noite e baixa `650 × 498000 / 628000 = 515.445859872611464…` BRL/noite, iguais nas quatro categorias em cada temporada. `1200` e `650` são as bases salvas do FINAL 09 em CALCULADORA!E33:F33; a razão é somente a origem dessa referência legada, não participação no pool. Registrar essas duas razões como entradas exatas da fixture e calcular com a precisão do motor, sem reproduzir dependência circular por MAX ou usar os valores de exibição arredondados como entrada.

Cada período está incluído (`Simulação=1`). A tabela transcreve CALCULADORA!K6:N19 e a ocupação realista D6:D19; K/L são os rótulos legados, cuja interpretação de fim de semana está pendente. A receita de cada linha é `(K+L+M+N) × tarifa da temporada × ocupação`. Como as quatro tarifas são iguais, a troca de rótulos K/L não altera esta referência monetária, mas continua relevante para as tarifas reais distintas.

| Período | Temporada | K (legado “Final de Semana”) | L (legado “Dias de Semana”) | M (feriados) | N (festivas) | Noites | Ocupação realista | Condomínio BRL |
|---|---|---|---|---|---|---|---|---|
| Janeiro | Alta | 16 | 14 | 1 | 0 | 31 | `0.8` | `1500.00` |
| Fevereiro | Alta | 13 | 12 | 4 | 0 | 29 | `0.8` | `1500.00` |
| Março 1 | Alta | 8 | 7 | 0 | 0 | 15 | `0.5` | `750.00` |
| Março 2 | Baixa | 6 | 10 | 0 | 0 | 16 | `0.2` | `750.00` |
| Abril | Baixa | 17 | 12 | 1 | 0 | 30 | `0.2` | `1500.00` |
| Maio | Baixa | 16 | 15 | 0 | 0 | 31 | `0.2` | `1500.00` |
| Junho | Baixa | 17 | 12 | 1 | 0 | 30 | `0.2` | `1500.00` |
| Julho | Baixa | 18 | 13 | 0 | 0 | 31 | `0.2` | `1500.00` |
| Agosto | Baixa | 17 | 14 | 0 | 0 | 31 | `0.2` | `1500.00` |
| Setembro | Baixa | 17 | 12 | 1 | 0 | 30 | `0.2` | `1500.00` |
| Outubro | Baixa | 16 | 14 | 1 | 0 | 31 | `0.2` | `1500.00` |
| Novembro | Baixa | 16 | 13 | 1 | 0 | 30 | `0.2` | `1500.00` |
| Dezembro 1 | Baixa | 11 | 9 | 0 | 0 | 20 | `0.5` | `750.00` |
| Dezembro 2 | Alta | 3 | 3 | 1 | 4 | 11 | `0.8` | `750.00` |

DESPESAS OPERACIONAIS!J5:L18 informa administração de `0.15` sobre receita em cada período e outras despesas `0.00`; o condomínio acima totaliza R$ 18.000,00. Não há custos de aquisição adicionais nesta fixture. Calcular `receita = soma(receitas dos períodos)`, `despesas = receita × 0.15 + 18000`, `resultado = receita − despesas`, `payback simples = 498000 × 12 / resultado` em meses e `payback ajustado = payback simples − 24 meses`. Saídas após arredondamento: receita R$ 93.145,03, despesas R$ 31.971,75, resultado R$ 61.173,28, payback simples de **97,69 meses** e ajustado de **73,69 meses**. As despesas e o resultado são calculados antes do arredondamento de exibição; subtrair os valores já exibidos pode diferir por um centavo. Esses resultados validam receita por período, administração sobre receita, despesas fixas, precisão e rótulo da dedução; não validam divisão coletiva de receitas. A fixture usa horizonte sintético bissexto de 2024, com as contagens legadas explicitadas como entradas de comparação; o calendário real de 2024 não é apresentado como origem das categorias K/L. Os testes civis do P02 geram as categorias de datas reais separadamente, sem importar as contagens legadas como regra. Para executar o motor neste comparativo, gerar as datas civis de `2024-01-01` a `2024-12-31`: Março 1 corresponde a `2024-03-01`–`2024-03-15`, Março 2 a `2024-03-16`–`2024-03-31`, Dezembro 1 a `2024-12-01`–`2024-12-20` e Dezembro 2 a `2024-12-21`–`2024-12-31`; os demais períodos são meses inteiros. Aplicar temporadas e ocupações da tabela. As categorias geradas pelo calendário de teste podem diferir de K/L/M/N da origem e não são comparadas como se fossem históricas; tarifas iguais por categoria preservam a receita e permitem validar as saídas monetárias sem burlar o contrato civil do motor.

**FINAL 03 — conferência de cadastro e bloqueio de homologação:** QUARTOS!E8:H8 identifica unidade LUXO, investimento/venda de R$ 599.000,00. Os oito valores exatos de QUARTOS!I8:P8, em BRL/noite, são:

| Temporada | Final de semana | Dia de semana | Feriado | Data festiva |
|---|---|---|---|---|
| Alta (I8:L8) | `500.00` | `400.00` | `500.00` | `600.00` |
| Baixa (M8:P8) | `300.00` | `200.00` | `300.00` | `500.00` |

Na mesma aba, FINAL 07 tem alta `1000/800/1000/900` e baixa `600/400/600/500` BRL/noite nessa ordem. FINAL 03 é o segundo maior investimento cadastrado, mas tem valores frequentemente pela metade e festivas acima de fim de semana. Esta saída de conferência valida transcrição, distinção entre ausência e valor explícito e identificação da divergência. Não existe resultado anual FINAL 03 homologado para usar como oráculo: nenhuma regra “corrige” as diárias automaticamente nem as substitui pelas tarifas proporcionais do FINAL 07. A publicação de dados reais fica pendente da confirmação/correção explícita pela empresa.

**Calendário e homologação real:** a origem soma 366 noites e fevereiro soma 29 (`13+12+4`). O desenho do piloto registra que L coincide com sextas a domingos de 2026 nos dez meses inteiros, indício de K/L trocadas; 2026 tem 365 dias e fevereiro, 28. Registrar essa divergência, confirmar o ano e os dias de fim de semana (sexta a domingo é hipótese da origem; sábado/domingo é apenas padrão inicial configurável), cadastrar feriados/especiais reais e gerar cada data uma única vez. Não transportar fevereiro com 29 dias para 2026 nem renomear colunas silenciosamente. Conferir os textos exigidos pelo desenho do piloto: dedução explícita de 24 meses e prazo simples ao lado, ausência de garantia de rentabilidade, estimativa sujeita a premissas/ocupação/despesas, custos de aquisição conhecidos ou pendentes e proposta que não reserva a unidade.

**Verificação do pacote:** o caso real do primeiro empreendimento continua pendente até receber inventário completo, despesas, pesos pelo valor de referência e regras aprovados; uma condição pendente não pode contar como aceite. A comparação FINAL 07, a pendência FINAL 03 e o pool real têm estados separados no roteiro. O script aceita dados estruturados revisados, com modo de prévia, e nunca modifica o XLSX. Em homologação visual/E2E, repetir os viewports `1440×900`, `768×1024` retrato e `390×844` em CSS pixels; 1440 px e 390 px são larguras.

#### P15 — operação, diagnóstico, backup e restauração

| Ação | Arquivo | Conteúdo e motivo |
|---|---|---|
| Modify | `src/i18n/pt-BR.ts` | Acrescentar mensagens de manutenção e recuperação restrita apresentadas nas telas existentes. |
| Modify | `src/i18n/index.ts` | Integrar acesso tipado aos novos estados sem alterar textos históricos congelados. |
| Create | `Dockerfile` | Imagem Node reproduzível com fontes, build e runtime da aplicação. |
| Create | `.dockerignore` | Excluir segredos, arquivos privados e material de teste da imagem. |
| Create | `src/server/diagnostics.ts` | Logs estruturados com correlação e supressão de dados sensíveis. |
| Create | `src/server/maintenance.ts` | Modos externos de bloqueio total, recuperação restrita e operação normal, sem regressão pelo backup. |
| Create | `src/app/api/health/route.ts` | Saúde sem dados comerciais ou segredos, para verificação do ambiente. |
| Create | `scripts/seed-demo.ts` | Criar apenas dados de demonstração identificados em ambiente permitido. |
| Create | `scripts/diagnose-issuance.ts` | Consultar andamento e falhas pelo identificador interno, sem devolver token ou interessado. |
| Create | `scripts/clean-orphans.ts` | Limpeza com prévia e seleção de tentativas elegíveis pelo serviço de recuperação. |
| Create | `scripts/backup.ts` | Exportar banco e manifesto consistente de objetos privados com hashes. |
| Create | `scripts/restore-check.ts` | Restaurar e ensaiar recuperação somente em banco e armazenamento isolados. |
| Create | `scripts/reconcile-restored-access.ts` | Invalidar todas as sessões/tokens, exigir recuperação de credenciais e reconciliar identidade, e-mail, vínculo e papel antes de liberar acesso. |
| Create | `scripts/reconcile-restored-links.ts` | Conferir ou invalidar links restaurados antes da reabertura, com auditoria e prévia. |
| Create | `scripts/measure-beta.ts` | Registrar tempos, memória e tamanho de artefatos em cenários controlados de homologação. |
| Create | `tests/integration/diagnostics.test.ts` | Assegurar localização de falhas sem credenciais, token ou dados pessoais nos registros. |
| Create | `tests/integration/restore.test.ts` | Conteúdo/PDF e backup anterior à revogação/substituição, troca de senha e desativação de vínculo; nenhuma autorização indevida revive. |
| Create | `tests/integration/historical-proposal.test.ts` | Leitura do formato emitido após mudanças de regras e mensagens. |
| Create | `tests/integration/maintenance.test.ts` | Bloqueio antes de acesso ao conteúdo e independência do estado restaurado. |
| Create | `docs/runbooks/operacao.md` | Contatos, horários, backups, consumo, diagnóstico e dependências do ambiente. |
| Create | `docs/runbooks/restauracao.md` | Sessões/tokens invalidados, recuperação de credenciais, reconciliação de vínculos e links e autorização documentada antes de reabrir. |
| Create | `docs/runbooks/contingencia.md` | Autoridade de pausa/retomada e condições para usar uma referência alternativa. |
| Create | `docs/runbooks/publicacao.md` | Migrações, homologação separada, bloqueios, logs/proxy e verificações do ambiente efetivo. |
| Modify | `src/server/env.ts` | Configuração externa de manutenção, reconciliação e fluxo restrito de recuperação. |
| Modify | `src/server/auth/config.ts` | Bloquear login/ativação no modo total e só permitir recuperação de identidade reconciliada no modo restrito. |
| Modify | `src/server/auth/context.ts` | Negar operação comercial em manutenção ou com credencial/vínculo aguardando revalidação. |
| Modify | `src/server/auth/recovery.ts` | Invalidar tokens restaurados e exigir recuperação para credenciais marcadas, sem aceitar senha antiga. |
| Modify | `src/server/auth/users.ts` | Aplicar confirmação auditada de vínculos restaurados sem autoridade sobre senha/e-mail global. |
| Modify | `src/server/proposals/issue.ts` | Conferir manutenção antes da reserva e novamente na confirmação. |
| Modify | `src/server/proposals/recovery.ts` | Impedir aquisição/avanço de posse enquanto houver manutenção. |
| Modify | `src/server/proposals/public.ts` | Conferir manutenção antes de resolver/devolver conteúdo ou permitir leitura do PDF. |
| Modify | `tests/integration/auth.test.ts` | Modos total/restrito/normal e credenciais/vínculos não reconciliados. |
| Create | `README.md` | Setup, execução, scripts, variáveis, limites e acesso aos documentos de operação. |

**Backup consistente:** obter um snapshot de leitura do banco para o dump e para coletar as referências de arquivos do mesmo ponto. Manter a conexão desse snapshot durante o dump; copiar os objetos imutáveis referenciados e conferir tamanho/hash antes de marcar o conjunto como concluído. Backup não concluído não conta como recuperável. Credenciais e chave de cifra são guardadas separadamente dos dados. As ferramentas de banco necessárias são pré-requisitos documentados; não instalar serviços nem contratar armazenamento por iniciativa da execução.

**Restauração:** bloquear tráfego público, login normal, seleção de vínculo e toda operação autenticada no ambiente antes de restaurar, inclusive em requisições já em andamento antes da confirmação. A configuração de manutenção é externa ao conjunto restaurado e deve ser verificada também na inicialização. Restaurar em destino isolado, conferir snapshot/PDF e testar backup anterior a uma revogação e a uma substituição. Se registros confiáveis permitirem reconciliar as restrições posteriores ao backup, reaplicá-las; caso contrário, invalidar os links cujo estado não pode ser demonstrado. O modo conservador é invalidar todos os links restaurados. Executar também `reconcile-restored-access`: invalidar todas as sessões autenticadas e tokens restaurados sem exceção; exigir recuperação de todas as credenciais restauradas pelo titular e reconciliar e-mails, vínculos, papéis e desativações. O modo conservador suspende todos os vínculos restaurados até confirmação auditada da empresa e bloqueia recuperação se o e-mail atual não for comprovado. Sessões novas só autorizam vínculos revalidados. O modo restrito permite apenas recuperação de titulares com e-mail reconciliado; não reabre uso comercial. Ensaiar backup anterior à desativação de vínculo e à redefinição de senha: sessão restaurada, senha antiga e vínculo desativado continuam recusados após a liberação parcial dos demais. Reabrir somente depois do relatório de reconciliação, verificação e autorização operacional; reenviar novas versões pelo fluxo normal quando necessário.

**Diagnóstico e capacidade:** comandos aceitam identificadores internos e usam os serviços autorizados; não são endpoints públicos. Conectar os modos de manutenção ao mecanismo de login/recuperação, `requireActor`, serviço de emissão, retomada e resolvedor público antes de ler ou publicar conteúdo; o healthcheck informa manutenção sem revelar dados. Acompanhar última execução bem-sucedida e falhas/ausência de backup, além de saúde e erros de emissão. Registrar a medição do ensaio antes de definir concorrência, duração da posse e tolerâncias de recuperação. Não prometer plantão, custo ou capacidade sem acordo. Testes não usam banco operacional, nem o script de ensaio aceita esse destino.

### Verification Plan

Os comandos abaixo são requisitos para a implementação futura. Não foram executados nesta etapa de redação e não há código de produto declarado aprovado por testes.

| Script previsto | Resultado necessário |
|---|---|
| `npm ci` | Instalação reproduzível após existir o lockfile validado. |
| `npm run test` | Unitários de domínio, precisão e PDF; exclui integração e E2E. |
| `npm run test:integration` | Banco isolado: autorização, revisões, emissão, armazenamento, histórico e restauração. |
| `npm run test:e2e` | Jornadas administrativas, comerciais e públicas nos tamanhos de tela previstos. |
| `npm run typecheck` | Sem erros TypeScript em domínio, serviços, telas e testes. |
| `npm run lint` | Sem violações das fronteiras e regras do projeto. |
| `npm run build` | Build Node completo com os ativos/fontes necessários incluídos. |
| `npm run db:generate`, `npm run db:migrate` | Migração registrada e aplicação em destino deliberadamente escolhido; sem migração automática ao iniciar a aplicação. |
| `npm run bootstrap:admin`, `npm run invite:company` | Provisionamento por vínculo e ativação pelo e-mail do titular, sem senha definida pelo operador, cadastro público ou tokens em logs. |
| `npm run prepare:initial-data` | Prévia da carga assistida, validação de pendências e nenhuma publicação automática. |
| `npm run seed:demo` | Dados identificados e recusa de ambiente operacional por padrão. |
| `npm run diagnose:issuance`, `npm run clean:orphans` | Diagnóstico mínimo e limpeza com prévia, preservando objetos referenciados/ativos. |
| `npm run backup`, `npm run restore:check` | Conjunto íntegro e restauração demonstrada em destino isolado. |
| `npm run reconcile:links` | Prévia e aplicação auditada das restrições públicas após restauração, com manutenção ativa. |
| `npm run reconcile:access` | Invalidar sessões/tokens, reconciliar identidade/vínculo/papel e exigir recuperação de credenciais antes de liberar acesso normal. |
| `npm run measure:beta` | Evidência representativa de tempos, memória e armazenamento antes da liberação real. |

Cada pacote implementa primeiro os casos que demonstram seu comportamento e executa as verificações apropriadas antes de avançar. Repetir a suíte completa quando houver integração transversal, antes da entrega, ou quando novas mudanças/falhas justificarem. Não criar uma meta percentual de cobertura sem relação com os riscos: a exigência é cobrir as regras, falhas e jornadas explicitadas neste documento.

A liberação comercial exige também os dados reais e responsáveis definidos, o ensaio no ambiente efetivo, a conferência independente dos cálculos e o aceite da empresa para o empreendimento. Resultado de teste com dados controlados não substitui essa homologação nem prova adoção. Este plano foi aprovado para compor o desenho formal em `docs/designs/plataforma-comercial-hoteleira-beta.md`, separado do RFC já publicado. A aprovação documental não declara testes de produto executados nem autoriza, por si, sua implantação operacional.

## Reconciliação final com o brief

Reconciliação realizada em 2026-11-13 pela mesma sessão que redigiu o documento, usando o [brief aprovado](../../concepts_brief.md). Não foram identificadas contradições de escopo ou decisões pendentes entre o brief e o desenho.

Permanecem preservados a finalidade de uso e feedback da beta, o investimento já decidido no SaaS, os dois modelos, o primeiro pool com pesos pelos valores de referência, o payback com 24 meses descontados e prazo simples, as propostas por link/PDF, a separação entre empresas e as recomendações R1–R8. Os dados reais, os responsáveis, a agenda e o ambiente continuam sujeitos às definições e à homologação indicadas no brief.

| Complemento em relação ao brief | Decisão e aprovação registradas |
|---|---|
| Base tecnológica e componentes | O brief tratava a stack como proposta. O solicitante escolheu TypeScript/Next.js e PostgreSQL em DT-01 e aprovou os componentes e dependências do bloco técnico. |
| Dependências auxiliares | SDK S3, fontkit, proteção de importações de servidor e PDF.js aprovados no plano; `pg`, adaptador Better Auth, `sharp`, SMTP com `nodemailer` e tipos diretos explicitados na resolução autorizada de 2026-11-14. |
| Detalhes de interfaces e operação | Seleção de vínculo permitido na entrada, limite de validade exclusivo, recuperação com posse temporária e procedimentos de manutenção foram detalhados nos blocos aprovados. Não criam API pública de integração, cadastro público ou automação de comunicação. |
| Ajustes A-01–A-05 da segunda revisão | Em 2026-11-15, o solicitante autorizou antecipar o catálogo ao P01, editar somente valores de parcelas no ajuste comercial, manter entrada/datas/quantidade na condição versionada e separar publicação por modelo. Confirmou política de prejuízo nos dois modos de pool. Rota raiz e limite de desconto receberam precisão editorial. |

As decisões de resolução de 2026-11-14 prevalecem sobre descrições históricas de redefinição administrativa e ausência de e-mail de identidade: senha global pertence ao titular e ativação/recuperação exige entrega ao seu endereço verificado. Isso não automatiza comunicação comercial. As alternativas preservam seus motivos e limites, sem atribuir ao autor justificativas que ele não informou.

A revisão formal em cinco etapas foi concluída em 2026-11-14; seus 15 achados estão mapeados no relatório de resolução. A presente atualização fecha os contratos e critérios documentais indicados, sem declarar implementação, execução de testes do produto ou homologação dos dados reais. O RFC, o brief, o rascunho anterior e os pareceres são registros históricos, não cópias sincronizadas deste desenho formal.

A segunda revisão em cinco etapas foi concluída em 2026-11-15. Os cinco ajustes A-01–A-05 foram aplicados conforme instruções do solicitante e são acompanhados no registro de resolução desta rodada. O fechamento é documental, com conferência de coerência, contratos e manifestos; não constitui nova auditoria Goldfish independente nem execução dos testes previstos para o produto.

*Drafted with EGM*
