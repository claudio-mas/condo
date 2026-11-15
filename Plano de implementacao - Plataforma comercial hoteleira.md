# Plataforma comercial hoteleira — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar um piloto operacional para substituir gradualmente a planilha nos atendimentos comerciais, com modelos individual e pool e propostas imutáveis por link e PDF.

**Architecture:** Aplicação web modular com interface e servidor no mesmo projeto, banco relacional e armazenamento privado de arquivos. Um motor puro de cálculo recebe premissas versionadas; os serviços autenticados persistem simulações e emitem retratos imutáveis, compartilhados por link exclusivo. Todos os dados comerciais são vinculados à empresa, embora o piloto disponibilize somente uma.

**Tech Stack:** Proposta técnica do responsável pelo plano: TypeScript, React/Next.js App Router em runtime Node, PostgreSQL, Drizzle ORM, Better Auth com adaptador Drizzle, Zod, decimal.js, pdf-lib, Vitest e Playwright. Adaptador de arquivos local no desenvolvimento e compatível com S3 na operação. Fixar versões estáveis compatíveis no início da execução e registrar o lockfile; não pressupor APIs de versões antigas.

**Revisão:** 1, em 08/11/2026, alinhada à revisão 1 do desenho. Mudanças listadas em “Registro de alterações” ao final.

**Spec:** `C:/Users/Claudio/Documents/Codex/2026-10-26/a/outputs/Desenho do piloto - Plataforma comercial hoteleira.md`, aprovado pelo solicitante (revisão 1). Ler também `Relatorio de analise - Calculadora investidores.md` na mesma pasta para entender os defeitos da origem.

## Global Constraints

- “O piloto atende uma empresa com vários empreendimentos de operação hoteleira.”
- “A implantação será gradual, começando por um empreendimento”.
- “Modelos de resultado individual e pool hoteleiro disponíveis no piloto.”
- “Configuração das regras por empreendimento.”
- “O cálculo deve ser determinístico e executado de forma autoritativa no servidor.”
- “Toda simulação usa uma versão publicada de premissas.”
- “Zero é um valor válido quando permitido e não equivale a dado ausente.”
- “Não anualizar automaticamente.” Indicadores anuais e payback indisponíveis com horizonte parcial.
- “Preço negociado e participação contratual são parâmetros independentes.”
- “A proposta não reserva a unidade.”
- “Nova versão substitui a anterior.” Propostas emitidas preservam conteúdo e premissas.
- “Links vencidos ou revogados mostram o estado e o contato, sem expor os valores nem liberar o PDF.”
- “Não haverá envio automático de comunicações aos clientes.”
- Sem autocadastro de empresas: o operador da plataforma cria a empresa parceira e as empresas beta por convite (revisão 1).
- Modelo, critério de participação e regra de payback são escolhidos entre regras registradas e versionadas; nunca fórmulas livres (revisão 1).
- Primeiro empreendimento: pool com pesos pelo valor de venda de referência, congelados na versão de premissas; payback com 24 meses descontados, rotulado e acompanhado do payback simples (revisão 1).
- BRL e interface pt-BR; datas de operação são datas civis e validade utiliza o fuso do empreendimento.
- Sem CRM, assinatura de contratos, cobrança SaaS, operação de hospedagem, TIR, VPL ou fórmulas livres no piloto.
- Não editar o XLSX original. Dados comerciais reais só entram em operação depois da homologação descrita na especificação.

## Review Focus

1. Duplo clique ou repetição de emissão: uma chave de idempotência deve produzir uma única versão pronta e um único link; testar na tarefa 11.
2. Mudança de preço, disponibilidade ou premissas durante a emissão: falhar com conflito e preservar a versão anterior; testar nas tarefas 9 e 11.
3. Falha no armazenamento do PDF: nenhuma proposta incompleta fica acessível e a tentativa pode ser retomada; testar nas tarefas 10 e 11.
4. Expiração em mudança de dia/fuso e caches: link e PDF obedecem à mesma validade, com respostas sem cache; testar na tarefa 12.
5. Arredondamento, pesos e participantes fora da oferta comercial: o pool concilia com o inventário completo sem redistribuição acidental; testar nas tarefas 1 e 4.

---

## Organização e execução

Raiz proposta do código, a criar somente na execução: `C:/Users/Claudio/Documents/Codex/2026-10-26/a/work/plataforma-hoteleira`. Os caminhos abaixo são relativos a essa raiz. Os documentos aprovados permanecem em `outputs`; copiar suas versões para `docs/specs/` ao iniciar o repositório. O pacote final de fonte e instruções será entregue em `outputs`.

Não existe código de aplicação no workspace inspecionado nem diretório `.codegraph`. Não indexar por iniciativa própria. Na execução, verificar novamente o contexto; se aparecer `.codegraph`, consultar CodeGraph antes de localizar ou compreender código.

Esta é uma aplicação integrada, não vários produtos independentes. As etapas têm limites testáveis e compartilham contratos explícitos. A ordem é: motor puro (1–4), persistência e gestão (5–8), atendimento e emissão (9–12), experiência completa e implantação (13–15).

As decisões de biblioteca e hospedagem não foram escolhas expressas do solicitante. A proposta técnica acima atende à portabilidade e aos acessos independentes descritos no desenho. Sites foi consultado: seu fluxo hospedado utiliza identidade ChatGPT e Workers/D1/R2. Este plano utiliza uma aplicação Node independente; uma mudança para Sites exige adaptar autenticação, banco e publicação antes de executar as tarefas dependentes. Nenhum Site, conta ou serviço pago foi criado.

### Arquivos e responsabilidades

| Área | Arquivos principais |
|---|---|
| Contratos e precisão | `src/domain/contracts.ts`, `schemas.ts`, `money.ts` |
| Calendário e cálculos | `src/domain/calendar.ts`, `costs.ts`, `individual.ts`, `pool.ts`, `metrics.ts`, `calculate.ts` |
| Banco | `src/server/db/client.ts`, `src/server/db/schema/{auth,company,catalog,premises,simulations,proposals}.ts`, `drizzle/` |
| Identidade | `src/server/auth/{config,context,users}.ts`, `src/app/api/auth/[...all]/route.ts` |
| Administração | `src/server/catalog/service.ts`, `src/server/premises/service.ts`, `src/app/(staff)/admin/` |
| Simulações | `src/server/simulations/{service,payments}.ts`, `src/app/(staff)/simulacoes/` |
| Propostas | `src/server/proposals/{snapshot,pdf,issue,links,repository}.ts`, `src/app/p/[token]/page.tsx`, `src/app/p/[token]/pdf/route.ts` |
| Arquivos e auditoria | `src/server/storage/{contract,local,s3}.ts`, `src/server/audit.ts` |
| Interface comum | `src/components/{app-shell,scenario-comparison,money-field,proposal-content}.tsx`, `src/app/globals.css` |
| Qualidade e operação | `tests/{unit,integration,e2e}/`, `fixtures/reference/`, `scripts/`, `docs/runbooks/` |

Não criar um arquivo único com todas as regras ou todas as telas. O domínio não importa banco, servidor, autenticação ou componentes React.

### Contratos compartilhados

Definir e exportar na tarefa 1:

- `DecimalText = string`: decimal canônico com ponto, sem separador de milhar; JSON nunca transporta `Decimal` de biblioteca ou dinheiro em ponto flutuante.
- `CivilDate = string`: data válida `YYYY-MM-DD`.
- `Role = 'ADMIN' | 'CONSULTANT'`; `Model = 'INDIVIDUAL' | 'POOL'`.
- `Period`: `{ id, startDate, endDate, included }`; limites inclusivos, períodos sem sobreposição.
- `CalendarRuleSet`: `{ year, weekendDays, holidays, specialDates, seasons }`; dias da semana 0=domingo até 6=sábado; precedência especial > feriado > final de semana > útil.
- `CostRule`: `{ id, order, stage, kind, amount, rate, base, periodIds }`; `stage` = `OPERATING` ou `RETENTION`; `kind` = `FIXED` ou `PERCENT`; `base` = `GROSS` ou `POSITIVE_BALANCE`. Apenas os campos aplicáveis ficam preenchidos, definidos por união discriminada no schema.
- `ScenarioInput`: `{ id, label, occupancyByPeriod, tariffOverrides? }`; taxas na fração de 0 a 1.
- `InvestmentInput`: `{ listPrice, discountRate, acquisitionCosts, incompleteCostLabels }`; investimento total positivo necessário para indicadores, pendências de custos conservadas na apresentação.
- `IndividualInput`: `{ unitId, calendar, periods, availableNights, tariffs, costs, investment, scenarios }`. Tarifas identificadas por temporada e categoria; noites disponíveis por data, com limite de uma noite por unidade/dia.
- `PoolInput`: `{ selectedParticipantId, calendar, periods, inventory, tariffs, costs, participation, lossPolicy, investorCosts, investment, scenarios }`. Inventário por categoria e data; participantes não dependem do status de venda; `lossPolicy` = `PROPORTIONAL` ou `ABSORBED`.
- `Participation`: união entre `FIXED_PERCENT` com percentuais somando 1 e `WEIGHTS` com pesos não negativos e soma positiva. Participação desconhecida é erro, não peso zero implícito. `WEIGHTS` inclui `basis` = `LIST_PRICE` | `AREA` | `IDEAL_FRACTION` | `MANUAL` e os valores de referência usados, gravados na versão de premissas; o motor nunca lê preço atual do catálogo para obter pesos (revisão 1).
- `PaybackRule`: união entre `{ kind: 'SIMPLE' }` e `{ kind: 'DEDUCTED_MONTHS', months }`, com `months` inteiro positivo. Obrigatória em `CalculationInput`; sem valor padrão implícito (revisão 1).
- `CalculationInput`: união discriminada por `model` contendo `IndividualInput` ou `PoolInput`.
- `Metric`: `{ value: DecimalText | null, reason: 'PARTIAL_YEAR' | 'NON_POSITIVE_RESULT' | 'INVALID_INVESTMENT' | 'RECOVERED_WITHIN_DEDUCTION' | null }`. `RECOVERED_WITHIN_DEDUCTION` aplica-se só ao payback com meses descontados quando o payback simples não ultrapassa `months` (revisão 1).
- `PeriodResult`: `{ periodId, grossRevenue, operatingCosts, retentions, operatingResult, distributableResult, participation, investorCosts, investorResult, costBreakdown }`.
- `ScenarioResult`: `{ scenarioId, periods, totals, annualReturn, monthlyAverageReturn, paybackMonths, simplePaybackMonths, paybackRule }`. `paybackMonths` segue a regra do empreendimento; `simplePaybackMonths` é sempre calculado para exibição secundária (revisão 1).
- `CalculationResult`: `{ engineVersion, fullYear, horizon, scenarios, warnings }`; `engineVersion` inicia em `1` e acompanha snapshots.
- `DomainError`: código estável e lista de campos, incluindo `MISSING_INPUT`, `INVALID_RATE`, `INVALID_CALENDAR`, `POOL_NOT_RECONCILED`, `UNSUPPORTED_TERMS`.

Contratos auxiliares produzidos pelas tarefas proprietárias: `CalendarResult` (tarefa 2) contém `dates`, `countsByPeriod`, `horizon` e `fullYear`; cada data contém data civil, período, temporada e categoria. `CostResult` (tarefa 3) contém `items`, `operatingCosts`, `retentions` e `remainingBalance`; `Metrics` contém os três `Metric` anuais/mensais/prazo. `SnapshotSource` (tarefa 10) contém entradas e resultados validados, identificações resolvidas do banco, condições, contatos e dados de emissão; nunca recebe HTML enviado pelo navegador. `ImmutableAssets` é um mapa de chave para bytes e MIME já validados. `ProposalPresentation` contém seções e valores formatados extraídos do snapshot, incluindo estado dos indicadores e textos obrigatórios; ambos os renderizadores usam essa mesma representação. DTOs administrativos são definidos na tarefa proprietária e retornam somente campos necessários ao papel.

Na tarefa 6, definir `ActorContext = { userId, companyId, role }`, obtido da sessão e do vínculo no banco. Na tarefa 9, definir `DraftCommand` com `{ developmentId, unitId, expectedCatalogRevision, expectedPremiseVersionId, discountRate, paymentPlanId, customer, customScenario?, horizon? }` e `DraftDTO` com IDs, dono, revisão de rascunho, entradas, resultado e sinalização de desatualização.

Na tarefa 10, definir `ProposalSnapshot = { schemaVersion: 1, engineVersion, company, development, unit, consultant, customer, commercialTerms, premiseVersionId, catalogRevision, calculationInput, calculationResult, number, version, issuedAt, expiresAt, timezone, contact, disclaimers, immutableAssetKeys }`. Dados e imagens usados pelo documento devem estar congelados ou identificados por objetos imutáveis.

Valores de dinheiro armazenados em PostgreSQL `numeric`, transportados como texto. Precisão de cálculo: decimal.js com 40 dígitos significativos; apresentação monetária com 2 casas e `ROUND_HALF_UP`; retorno com 4 casas percentuais e prazo com 2 casas. Rateios preservam precisão interna; eventual diferença de centavos na apresentação coletiva deve aparecer como ajuste de arredondamento identificado, sem alterar uma participação contratual.

Proposta para armazenamento: dinheiro e pesos em `numeric(30,12)` e taxas em `numeric(20,12)`. Os limites dos schemas devem impedir estouro dessas colunas. Se a soma das linhas monetárias arredondadas diferir do total arredondado a partir da precisão interna, a apresentação deve mostrar um ajuste de arredondamento explícito, aplicável tanto à operação individual quanto ao pool. Não introduzir divergência silenciosa entre detalhe, total, PDF e página.

### Comandos do projeto

Definir scripts: `test` = Vitest run unitário; `test:integration` = Vitest com banco exclusivo de teste; `test:e2e` = Playwright; `typecheck` = TypeScript sem emissão; `build` = Next build; `db:generate`, `db:migrate`, `seed:demo`, `bootstrap:admin`, `invite:company` (revisão 1), `backup`, `restore:check`.

Não executar testes de integração, seeds ou restauração contra banco operacional. O guard de ambiente deve rejeitar `DATABASE_URL` igual a `TEST_DATABASE_URL` e exigir confirmação específica no script operacional de restauração. Dependências e serviços locais são configurados na execução conforme o ambiente disponível; não instalar Docker ou criar serviços externos silenciosamente.

## Tarefa 1 — Contratos, validação de entrada e precisão decimal

**Files:** criar `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `src/domain/{contracts,schemas,money}.ts`, `tests/unit/money.test.ts` e `tests/unit/schemas.test.ts`.

**Interfaces:** produz os tipos acima; `parseBrazilianDecimal(text: string): DecimalText`, `roundMoney(value: DecimalText): DecimalText` e schemas Zod de `CalculationInput`.

- [ ] Escrever testes `parses_pt_br_without_accepting_ambiguous_input` (`1.234,56` → `1234.56`; `abc` → erro) e `preserves_decimal_precision` (`0.1 + 0.2` → `0.30`; `1.005` → `1.01`). Testar ausência distinta de zero e ocupação `1.01` rejeitada.
- [ ] Rodar `npm run test -- tests/unit/money.test.ts tests/unit/schemas.test.ts`; confirmar falha pelos contratos ainda não implementados, após o setup mínimo do runner.
- [ ] Implementar contratos, schemas e funções, sem dependências de framework no domínio. Inicializar Git apenas no diretório do projeto caso ainda não seja repositório e copiar os documentos aprovados para `docs/specs/`.
- [ ] Repetir os testes e `npm run typecheck`; esperar sucesso.
- [ ] Commit dos arquivos desta tarefa: `feat: define validated financial contracts`.

## Tarefa 2 — Calendário, temporadas e horizonte

**Files:** criar `src/domain/calendar.ts`, `fixtures/reference/calendar.ts`, `tests/unit/calendar.test.ts`.

**Interfaces:** consome `Period`, `CalendarRuleSet`, `CivilDate`; produz `buildCalendar(rules, periods): CalendarResult`, com datas classificadas, contagens por período e `fullYear`.

- [ ] Escrever testes: 2026 tem 365 dias; 2024 tem 366; categorias são exclusivas; especial prevalece sobre feriado; fim de semana configurável; março 1–15 e 16–31 concilia; lacuna/exclusão produz horizonte parcial; sobreposição e data inválida são rejeitadas. Ano completo com noites indisponíveis continua ano completo.
- [ ] Rodar `npm run test -- tests/unit/calendar.test.ts`; esperar falha pela função ausente.
- [ ] Implementar geração por datas civis, sem somar milissegundos sujeitos a horário de verão; cada tarifa necessária deve ter temporada e categoria resolvidas.
- [ ] Repetir o teste; esperar sucesso e totais conciliados.
- [ ] Commit: `feat: add explicit hotel calendar`.

## Tarefa 3 — Custos, operação individual e indicadores

**Files:** criar `src/domain/{costs,individual,metrics}.ts`, `fixtures/reference/individual.ts`, `tests/unit/{costs,individual,metrics}.test.ts`.

**Interfaces:** `calculateCosts(gross: DecimalText, rules: CostRule[]): CostResult`; `calculateIndividual(input: IndividualInput): CalculationResult`; `calculateMetrics(investment: DecimalText, annualResult: DecimalText, fullYear: boolean, paybackRule: PaybackRule): Metrics` (revisão 1: `Metrics` inclui também o payback simples).

- [ ] Escrever o caso completo de 2026: diária `500`, ocupação `0.8`, 365 noites, condomínio `1500` em cada um dos 12 meses (anual `18000`), administração `0.15` sobre receita, investimento `600000`. Afirmar receita `146000.00`, custos `39900.00`, resultado `106100.00`, payback exibido `67.86`. Com ocupação zero, resultado `-18000.00` e payback indisponível. Horizonte parcial não anualiza. Despesa de 10% sobre saldo positivo após custo anterior deve seguir a ordem configurada; IDs/ordens duplicados são rejeitados.
- [ ] Revisão 1 — testes da regra de payback no mesmo caso: `SIMPLE` → `67.86`; `DEDUCTED_MONTHS` 24 → `43.86`, com `simplePaybackMonths` `67.86` e diferença exata de 24 antes do arredondamento. Investimento `150000` com a mesma regra → `value` nulo e `reason` `RECOVERED_WITHIN_DEDUCTION` (simples `16.97`). Resultado `-18000.00` → `NON_POSITIVE_RESULT` nas duas regras. Horizonte parcial → `PARTIAL_YEAR` nas duas. `months` zero, negativo ou fracionário é rejeitado pelo schema.
- [ ] Rodar `npm run test -- tests/unit/costs.test.ts tests/unit/individual.test.ts tests/unit/metrics.test.ts`; esperar falha pelos módulos ausentes.
- [ ] Implementar resultados por período e custos por estágio; `POSITIVE_BALANCE` usa `max(saldo após itens anteriores, 0)`. Retenções são aplicadas depois dos custos operacionais. Inputs incompletos produzem erros de campo; zero não apaga custos fixos.
- [ ] Repetir testes; esperar sucesso e saldo conciliado. Testar investimento crescente sem qualquer referência circular.
- [ ] Commit: `feat: calculate individual hotel returns`.

## Tarefa 4 — Pool, perdas e conciliação de participantes

**Files:** criar `src/domain/{pool,calculate}.ts`, `fixtures/reference/pool.ts`, `tests/unit/pool.test.ts`.

**Interfaces:** `calculatePool(input: PoolInput): CalculationResult`; `calculate(input: CalculationInput): CalculationResult`, dispatcher público do domínio.

- [ ] Escrever caso de 10 unidades operacionais, 365 noites/unidade, diária `500`, ocupação `0.8`, custos fixos `15000` por mês (anual `180000`), administração `0.15`, participante de `0.1`: receita coletiva `1460000.00`, distribuível `1061000.00`, parcela `106100.00`. Pesos 1 e 3 produzem participações `0.25` e `0.75`. Percentuais incompletos são rejeitados. Alterar status de venda ou unidade selecionada não altera o total do pool. Resultado coletivo `-100` produz parcela `-10` em PROPORTIONAL e zero em ABSORBED, preservando déficit e custos exclusivos.
- [ ] Revisão 1 — pesos pelo valor de venda: com `basis` `LIST_PRICE` e valores de referência `498000` e `628000` (duas unidades), participações `498000/1126000` e `628000/1126000` com precisão interna preservada. Desconto na unidade selecionada não altera participações. O motor não aceita pesos sem os valores de referência gravados. Incluir caso com unidade do inventário sem oferta comercial participando do denominador.
- [ ] Rodar `npm run test -- tests/unit/pool.test.ts`; esperar falha pelo módulo ausente.
- [ ] Implementar inventário coletivo separado do catálogo comercial, retenções, participação e resultado do investidor. Rejeitar soma de pesos zero e denominador incompleto. Testar diferença de centavos de um rateio em terços sem alteração dos pesos.
- [ ] Rodar `npm run test` e `npm run typecheck`; esperar ambos os modelos e calendário passando.
- [ ] Commit: `feat: calculate pooled hotel distributions`.

## Tarefa 5 — Persistência e isolamento por empresa

**Files:** criar `src/server/db/client.ts`, `src/server/db/schema/{company,catalog,premises,simulations,proposals}.ts`, `drizzle.config.ts`, `drizzle/`, `src/server/audit.ts`, `tests/integration/schema.test.ts`, `tests/support/database.ts`, `compose.yaml`, `.env.example`.

**Interfaces:** `db`, transações; `appendAudit(tx, actor, event): Promise<void>`. Repositórios futuros consomem esta instância e o contexto de empresa.

- [ ] Escrever testes: código de unidade único por empreendimento; referências entre empresas rejeitadas por chaves compostas; snapshot emitido não pode ser atualizado; número/versão e chave idempotente são únicos por empresa; banco de teste não pode ser o operacional. Dados de duas empresas somente nos testes.
- [ ] Rodar `npm run test:integration -- tests/integration/schema.test.ts`; confirmar falha pelas tabelas/constraints ausentes, com PostgreSQL de teste disponível.
- [ ] Implementar schema e migrações, com UUIDs, `numeric`, JSON validado por schema/versionamento, datas civis e timestamps UTC. Premissas publicadas e snapshots são imutáveis por constraints/triggers; arquivar entidades referenciadas. Incluir logs, versões de catálogo e campo de estado de emissão `PENDING | READY | FAILED`. Revisão 1: empreendimento com `product_type` (CHECK somente `CONDO_HOTEL`); colunas monetárias acompanhadas de `currency` (CHECK somente `BRL`); premissas com `payback_rule` e `participation_basis` validados por schema.
- [ ] Aplicar em banco novo e repetir os testes; esperar sucesso. Inspecionar SQL gerado e confirmar que nenhum dado operacional foi alterado.
- [ ] Commit: `feat: persist tenant-scoped commercial records`.

## Tarefa 6 — Login, vínculos e gestão dos usuários

**Files:** criar `src/server/db/schema/auth.ts`, `src/server/auth/{config,context,users}.ts`, `src/app/api/auth/[...all]/route.ts`, `src/app/(auth)/entrar/page.tsx`, `src/app/(staff)/layout.tsx`, `scripts/bootstrap-admin.ts`, `tests/integration/auth.test.ts`.

**Interfaces:** `requireActor(request): Promise<ActorContext>`; `requireRole(actor, role): void`; `createStaffUser(actor, command): Promise<UserDTO>`; `disableStaffUser(actor, userId): Promise<void>`. O bootstrap da primeira empresa/admin ocorre em script, sem cadastro público. Revisão 1: `scripts/invite-company.ts` (`npm run invite:company`) cria cada empresa beta e seu primeiro administrador com senha inicial de troca obrigatória, executado somente pelo operador da plataforma; não há tela pública nem endpoint de criação de empresas.

- [ ] Escrever testes: sessão inexistente → 401; consultor administrando usuários → 403; vínculo inativo impede qualquer escrita; `companyId` forjado no payload não muda contexto; administrador não acessa empresa de teste alheia; desativação revoga sessões; recuperação não concede role adicional. Revisão 1: `invite:company` cria empresa isolada; administrador de empresa beta não lista, lê nem altera usuários, empreendimentos, premissas ou propostas da empresa parceira, e vice-versa; o script recusa execução sem confirmação explícita do ambiente.
- [ ] Rodar `npm run test:integration -- tests/integration/auth.test.ts`; esperar falha pelos serviços ausentes.
- [ ] Implementar Better Auth com sessões de banco e e-mail/senha, adaptador Drizzle e cadastro público desativado. Gestão de contas passa por serviços próprios com escopo de empresa; não expor endpoints genéricos de administração global. Prever redefinição assistida pelo administrador, com senha inicial/redefinida exigindo troca e revogação das sessões, sem envio automático de e-mail. Cookies seguros, verificação de origem e limitação de tentativas em login. Scripts não imprimem segredos.
- [ ] Repetir testes e verificar login, logout e troca de senha na interface local; esperar sucesso. Preparar shell inicial responsivo com navegação por papel.
- [ ] Commit: `feat: secure staff access and provisioning`.

## Tarefa 7 — Catálogo, identidade e condições comerciais

**Files:** criar `src/server/catalog/service.ts`, `src/server/storage/{contract,local,s3}.ts`, `src/app/(staff)/admin/empreendimentos/page.tsx`, `src/app/(staff)/admin/empreendimentos/[id]/page.tsx`, `src/app/(staff)/admin/equipe/page.tsx`, `tests/integration/catalog.test.ts`.

**Interfaces:** `saveDevelopment(actor, command): Promise<DevelopmentDTO>`; `saveUnit(actor, command): Promise<UnitDTO>`; `listAvailableUnits(actor, developmentId): Promise<UnitDTO[]>`; `FileStore.putImmutable(key, bytes, contentType)`, `.get(key)`, `.deleteOrphan(key)`.

- [ ] Escrever testes: consultor não altera preço/premissas; unidade arquivada mantém histórico; alteração de preço ou disponibilidade incrementa `catalogRevision`; condição de pagamento fecha com preço negociado; limite de desconto ausente é zero. Upload aceita apenas PNG/JPEG/WebP dentro do limite de 5 MB e valida o conteúdo, não só a extensão.
- [ ] Rodar `npm run test:integration -- tests/integration/catalog.test.ts`; esperar falha pelos serviços ausentes.
- [ ] Implementar cadastro, disponibilidade, condição por percentuais e datas determináveis, limite por empreendimento com exceção por unidade, validade padrão obrigatória e identidade da empresa. Imagens têm chaves imutáveis; não buscar URLs arbitrárias enviadas pelo usuário no servidor. Adicionar telas administrativas com mensagens de campo.
- [ ] Repetir os testes; conferir persistência ao reiniciar o servidor e acesso pelos papéis corretos.
- [ ] Commit: `feat: manage hotel catalog and commercial terms`.

## Tarefa 8 — Premissas oficiais e publicação de versões

**Files:** criar `src/server/premises/service.ts`, `src/app/(staff)/admin/empreendimentos/[id]/premissas/page.tsx`, `tests/integration/premises.test.ts`.

**Interfaces:** `savePremiseDraft(actor, developmentId, input): Promise<PremiseDraftDTO>`; `publishPremises(actor, draftId, expectedRevision): Promise<PublishedPremiseDTO>`; `withdrawPremises(actor, versionId, reason): Promise<void>`.

- [ ] Escrever testes: calendário sobreposto, tarifa obrigatória ausente, participação incompleta e perda do pool indefinida impedem publicação; zero explícito permitido conserva significado; publicação concorrente com revisão antiga → 409; retirada bloqueia novas emissões e conserva histórico. Tarifas e temporadas atualizadas afetam somente seu empreendimento. Revisão 1: publicação sem regra de payback escolhida, ou com pesos sem base e valores de referência, é rejeitada com indicação do campo; nova tabela de preços não altera participações da versão publicada.
- [ ] Rodar `npm run test:integration -- tests/integration/premises.test.ts`; esperar falha pelos serviços ausentes.
- [ ] Implementar rascunho e publicação administrativa com validação do domínio, versão incremental por empreendimento e trilha de auditoria. Interface agrupa calendário, cenários, tarifas, custos e pool. Somente versão publicada vigente entra em nova emissão; o arquivo histórico da versão fica imutável.
- [ ] Repetir os testes; demonstrar salvar incompleto como rascunho e impedir sua publicação com indicação precisa das pendências.
- [ ] Commit: `feat: publish validated hotel assumptions`.

## Tarefa 9 — Atendimento, rascunhos e cálculo no servidor

**Files:** criar `src/server/simulations/{service,payments}.ts`, `src/app/(staff)/simulacoes/nova/page.tsx`, `src/app/(staff)/simulacoes/[id]/page.tsx`, `tests/integration/simulations.test.ts`.

**Interfaces:** `createDraft(actor, command: DraftCommand): Promise<DraftDTO>`; `updateDraft(actor, id, expectedRevision, command): Promise<DraftDTO>`; `rebaseDraft(actor, id): Promise<DraftDTO>`; `calculatePayments(price, plan, referenceDates): PaymentSchedule`.

- [ ] Escrever testes: consultor B não abre rascunho de A; atualização concorrente rejeita revisão antiga; troca de unidade não reutiliza custos/participação da anterior; desconto afeta investimento, não fração contratual; faixas de cenário personalizado são obrigatórias e não sobrescrevem cenários oficiais. Parcelas têm datas explícitas e total igual ao preço negociado; eventual centavo residual vai para a última parcela identificada. Não presumir juros/correção.
- [ ] Rodar `npm run test:integration -- tests/integration/simulations.test.ts`; esperar falha pelos serviços ausentes.
- [ ] Implementar rascunhos persistidos, cálculo autoritativo por `calculate`, comparações e condições de pagamento. Consultar versões/preços do banco; rejeitar tentativa de enviar resultados prontos pelo navegador. Exibir desatualização após mudanças de catálogo ou premissas; rebase explícito preserva histórico do rascunho. Unidade vendida impede emissão, mas rascunho histórico pode ser consultado.
- [ ] Repetir os testes; reiniciar servidor e confirmar recuperação do rascunho e mensagens de horizonte parcial, custos pendentes e ausência de recuperação.
- [ ] Commit: `feat: support guided commercial simulations`.

## Tarefa 10 — Retrato da proposta e PDF legível

**Files:** criar `src/server/proposals/{snapshot,pdf}.ts`, `src/components/proposal-content.tsx`, `tests/unit/proposal-pdf.test.ts`, `fixtures/reference/proposal.ts`.

**Interfaces:** `buildSnapshot(input: SnapshotSource): ProposalSnapshot`; `renderProposalPdf(snapshot: ProposalSnapshot, assets: ImmutableAssets): Promise<Uint8Array>`; `buildProposalPresentation(snapshot): ProposalPresentation` consumido pelo PDF e pela página externa.

- [ ] Escrever testes: snapshot valida schema e inclui regra, investimento, parcela do pool, cenários, número/versão/validade e aviso de estimativa. Extrair texto do PDF e conferir preço, resultado e payback iguais ao modelo de apresentação. Testar nomes longos, acentos, dois cenários mais personalizado, custos pendentes e múltiplas páginas. Revisão 1: com `DEDUCTED_MONTHS`, página e PDF exibem o rótulo da regra junto ao valor e o payback simples como informação secundária; o estado `RECOVERED_WITHIN_DEDUCTION` aparece como texto, nunca como número negativo. Textos vêm do catálogo de mensagens pt-BR.
- [ ] Rodar `npm run test -- tests/unit/proposal-pdf.test.ts`; esperar falha pelas funções ausentes.
- [ ] Implementar PDF A4 com paginação, fonte compatível com português, cabeçalhos e contato. O PDF não depende de Chromium. Dados obrigatórios ausentes impedem emissão; falha de imagem opcional mantém o documento legível e registrada para diagnóstico. As páginas usam os mesmos textos e valores formatados do modelo de apresentação.
- [ ] Repetir os testes e renderizar PDFs de referência para inspeção visual: sem cortes, sobreposição ou números truncados. Simular falha do FileStore para que a tarefa 11 possa garantir atomicidade de publicação.
- [ ] Commit: `feat: generate versioned proposal documents`.

## Tarefa 11 — Emissão idempotente, revisões e histórico

**Files:** criar `src/server/proposals/{issue,repository,links}.ts`, `src/app/(staff)/propostas/page.tsx`, `src/app/(staff)/propostas/[id]/page.tsx`, `tests/integration/issuance.test.ts`.

**Interfaces:** `issueProposal(actor, { draftId, expectedDraftRevision, idempotencyKey, replacesVersionId? }): Promise<IssuedProposalDTO>`; `revokeProposalLink(actor, versionId): Promise<void>`; `getShareLink(actor, versionId): Promise<string>`; DTO inclui número, versão, estado e link apenas se READY.

- [ ] Escrever testes concorrentes: duas chamadas com a mesma chave retornam a mesma emissão; chave reaproveitada com payload diferente → 409; preço/premissa/unidade alterados antes da conclusão → conflito, versão anterior continua válida; falha no PDF/storage não expõe link; retry retoma PENDING/FAILED de forma controlada; nova versão só substitui a anterior quando pronta. Forjar `replacesVersionId` de outro cliente, dono ou empresa é rejeitado.
- [ ] Rodar `npm run test:integration -- tests/integration/issuance.test.ts`; esperar falha pelo serviço ausente.
- [ ] Implementar protocolo: reservar emissão PENDING com chave única e snapshot calculado; gerar PDF e salvar objeto imutável; em transação final, conferir novamente revisões, vigência, permissão e disponibilidade, tornar READY e substituir a versão anterior. Nenhuma transação fica aberta durante upload. Falhas conservam estado recuperável e objetos órfãos são removíveis pelo serviço. Recalcular no servidor; custo pendente aparece no documento, sem virar zero silencioso.
- [ ] Criar token com 32 bytes aleatórios, armazenar SHA-256 para busca e cópia cifrada com AES-GCM para recuperação autenticada do link. Chave somente no servidor; nenhum token em logs. Repetir todos os testes de emissão e autorização, incluindo revogação pelo dono e administrador.
- [ ] Commit: `feat: issue immutable proposals safely`.

## Tarefa 12 — Consulta externa, validade e download

**Files:** criar `src/app/p/[token]/page.tsx`, `src/app/p/[token]/pdf/route.ts`, `src/server/proposals/public.ts`, `tests/integration/public-proposal.test.ts`.

**Interfaces:** `resolvePublicProposal(token, now): Promise<PublicProposalResult>`, união `ACTIVE` com apresentação ou estado restrito `EXPIRED | REVOKED | SUPERSEDED | NOT_FOUND`. O PDF usa a mesma função de autorização, sem URL de arquivo permanente exposta.

- [ ] Escrever testes: token inválido não revela cliente/empresa; token ativo funciona sem sessão; expirado/revogado/substituído não contém valores ou bytes do PDF; validade 23:59:59 no fuso do empreendimento respeita mudança de dia; resposta após revogação não pode ser recuperada de cache. O contato de propostas conhecidas pode ser mostrado; inexistentes retornam mensagem genérica.
- [ ] Rodar `npm run test:integration -- tests/integration/public-proposal.test.ts`; esperar falha pelo resolvedor ausente.
- [ ] Implementar página externa responsiva e download com `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex, nofollow` e metadados sem dados pessoais. Página dinâmica, sem analytics nem confirmação de leitura. Restringir download ao PDF do snapshot; não redirecionar automaticamente versão antiga à nova.
- [ ] Repetir os testes; validar no celular e desktop e com acesso anônimo. Configuração de logs do proxy deve omitir tokens em caminhos; nenhuma proposta ativa é indexada em sitemap.
- [ ] Commit: `feat: share controlled proposal links`.

## Tarefa 13 — Experiência completa de administração e atendimento

**Files:** criar/ajustar `src/components/{app-shell,scenario-comparison,money-field}.tsx`, `src/app/{layout,globals.css}`, `src/app/(staff)/page.tsx`, componentes das telas criadas nas tarefas 6–12; criar `tests/e2e/commercial-flow.spec.ts`, `tests/e2e/admin-flow.spec.ts`, `playwright.config.ts`.

**Interfaces:** usa apenas DTOs dos serviços anteriores; não recria cálculo financeiro na interface. Componentes exibem `Metric.reason` e pendências de campo em português.

- [ ] Escrever fluxo E2E: administrador cadastra e publica; consultor seleciona unidade, compara cenários, aplica desconto permitido, salva, emite, copia link e baixa PDF; anônimo consulta o mesmo resultado. Outro consultor não acessa a proposta. Nova versão e revogação apresentam os estados corretos.
- [ ] Rodar `npm run test:e2e -- tests/e2e/commercial-flow.spec.ts tests/e2e/admin-flow.spec.ts`; identificar falhas reais de integração/interface.
- [ ] Completar navegação, filtros por empreendimento, dados do interessado, históricos, estados vazios, carregamento, falhas recuperáveis e confirmações de substituição/revogação. Visual sóbrio, legível em atendimento, campos acessíveis por teclado e comparação de cenários com unidades claras. Marca da empresa é configurável; dados de demonstração devem estar identificados.
- [ ] Repetir E2E em 1440 px, tablet e 390 px; revisar visualmente telas e PDF, incluindo textos longos, cenário deficitário, proposta vencida e ausência de imagem. Controles de administração não aparecem como ações disponíveis ao consultor.
- [ ] Commit: `feat: complete hotel sales workflows`.

## Tarefa 14 — Referências da planilha e homologação do piloto

**Files:** criar `fixtures/reference/legacy-comparison.json`, `scripts/prepare-initial-data.ts`, `tests/integration/reference-cases.test.ts`, `docs/runbooks/{homologacao,implantacao-gradual}.md`.

**Interfaces:** `prepareInitialData(source: InitialCatalogInput): InitialDataReview` valida dados sem publicar; fixture comparativa não é seed operacional.

- [ ] Escrever comparação controlada do FINAL 07: mesmas tarifas proporcionais e períodos, receita realista `93145.03`, resultado `61173.28`, payback simples corrigido `97.69`. Para representar os 366 dias de origem, usar calendário sintético de teste em 2024, explicitamente marcado como escolha de teste e não como ano real do empreendimento. As diárias são premissas fixas do caso de comparação; não reproduzir dependência circular por MAX. Resultado antigo `73.69` deve constar somente como valor incorreto documentado.
- [ ] Revisão 1 — substitui a última frase do item anterior: com `DEDUCTED_MONTHS` 24, o `paybackMonths` esperado do caso é `73.69`, igual ao da planilha, e `simplePaybackMonths` é `97.69`. O valor antigo deixa de ser “incorreto”; o defeito da planilha era a falta de rótulo. Esse caso de comparação reproduz a aritmética legada em operação individual com diárias proporcionais fixas; ele não valida o pool. Acrescentar um caso de pool do primeiro empreendimento com pesos pelo valor de venda, usando inventário e despesas coletivas fornecidos pela empresa, marcado como pendente até a homologação.
- [ ] Revisão 1 — o roteiro de homologação inclui: dias de fim de semana (os dados indicam sexta a domingo em 2026), contagem de fevereiro, diárias do FINAL 03 (QUARTOS!I8:P8) e revisão jurídica do texto do payback com meses descontados.
- [ ] Rodar `npm run test:integration -- tests/integration/reference-cases.test.ts`; esperar falha até inserir o caso e o preparador. Conferir também o caso independente de pool da tarefa 4.
- [ ] Implementar carga inicial assistida com revisão de IDs, preços, unidades e pendências; jamais copiar fórmulas da planilha nem publicar dados incompletos automaticamente. Redigir roteiro de homologação para os dois modelos, cadastro administrativo e atendimento real, indicando responsáveis e evidências a registrar.
- [ ] Repetir referências e ensaiar o roteiro com dados controlados. Registrar claramente quais validações comerciais dependem da empresa e ainda não ocorreram; não marcar adoção como concluída com dados de demonstração.
- [ ] Commit: `test: document and reconcile pilot reference cases`.

## Tarefa 15 — Operação, restauração e entrega

**Files:** criar `Dockerfile`, `.dockerignore`, `scripts/{backup,restore-check,seed-demo}.ts`, `docs/runbooks/{operacao,restauracao,publicacao}.md`, `README.md`, `tests/integration/restore.test.ts`; ajustar `.env.example`.

**Interfaces:** aplicação Node com banco e FileStore configuráveis. `backup` exporta banco e manifesto de arquivos privados; `restore:check` restaura apenas em destino isolado validado. Seeds de demonstração nunca rodam automaticamente em produção.

- [ ] Escrever teste de restauração: dados e PDF de uma proposta emitida recuperados em banco/storage isolados; hash do snapshot e bytes do PDF conferem; script rejeita destino operacional. Validar falta de chave de links como erro explícito de configuração, não corrupção silenciosa.
- [ ] Rodar `npm run test:integration -- tests/integration/restore.test.ts`; esperar falha pelos scripts ausentes.
- [ ] Implementar backup com retenção configurável e agendamento pelo ambiente de operação, documentando chave cifrada de links separadamente dos dados e recuperação. Preparar healthcheck sem segredos, logs sem dados pessoais/tokens, ambiente de homologação separado e migrações versionadas. Definir domínio, serviço de banco, armazenamento e contas antes de publicar operacionalmente; nenhuma contratação é feita por este plano.
- [ ] Rodar `npm run test`, `npm run test:integration`, `npm run typecheck`, `npm run build` e os E2E afetados; confirmar saídas e limites. Executar restauração isolada. Registrar verificação de persistência, PDF e acessos no ambiente efetivo. Incluir instruções locais, configuração, bootstrap, testes, backup e carga inicial no README.
- [ ] Commit: `chore: prepare pilot operations and handoff`. Entregar código-fonte, instruções e evidências em `outputs`; identificar a aplicação como pronta para homologação ou operacional apenas conforme as verificações realmente realizadas. A adesão definitiva é validada pela empresa, empreendimento a empreendimento.

## Autorrevisão do plano

- [x] Objetivo e adoção gradual: tarefas 14–15, com aceite funcional integrado na 13.
- [x] Dois modelos, calendário, custos e indicadores corrigidos: tarefas 1–4.
- [x] Usuários, empresa e isolamento: tarefas 5–6 e testes de autorização em 7–12.
- [x] Catálogo, identidade, imagens, condições e versões de premissas: tarefas 7–8.
- [x] Simulações personalizadas, rascunhos e condições de pagamento: tarefa 9.
- [x] Snapshots, PDF, histórico, link e estados: tarefas 10–12.
- [x] Interface, responsividade, dados ausentes e mensagens: tarefa 13, com regras testadas no domínio.
- [x] Referências da planilha sem legitimar erros nem presumir o ano original: tarefa 14.
- [x] Backups, restauração, ambientes e implantação: tarefa 15.
- [x] Os cinco riscos do Review Focus possuem tarefas e testes específicos.
- [x] Contratos compartilhados usam os mesmos nomes nas tarefas consumidoras; implementadores podem dividir DTOs em arquivos menores mantendo a API.
- [x] Dados reais e credenciais são requisitos para homologação/publicação, não valores inventados para desbloquear a construção.
- [x] Revisão 1: regra de payback e base de pesos nos contratos (tarefa 1), no motor (3–4), no banco (5), na publicação (8), na apresentação (10) e nos casos de referência (14); convites de empresas beta na tarefa 6.

## Registro de alterações

| Revisão | Data | Tarefas | Alteração |
|---|---|---|---|
| 0 | 26/10/2026 | — | Plano original |
| 1 | 08/11/2026 | Restrições globais, 6, comandos | Empresas beta por convite pelo operador da plataforma (`invite:company`), sem cadastro público; testes de isolamento entre empresa parceira e beta |
| 1 | 08/11/2026 | Contratos, 3, 8, 10, 14 | `PaybackRule` (`SIMPLE`, `DEDUCTED_MONTHS`); `simplePaybackMonths` sempre calculado; motivo `RECOVERED_WITHIN_DEDUCTION`; rótulo obrigatório; caso FINAL 07 passa a esperar `73.69` com 24 meses descontados e `97.69` simples |
| 1 | 08/11/2026 | Contratos, 4, 8 | `WEIGHTS.basis` com valores de referência congelados na versão de premissas; primeiro empreendimento com `LIST_PRICE` |
| 1 | 08/11/2026 | 5 | `product_type` (somente `CONDO_HOTEL`) e `currency` (somente `BRL`) como preparação para o SaaS |
| 1 | 08/11/2026 | 14 | Caso de pool do primeiro empreendimento pendente de dados da empresa; roteiro de homologação com fim de semana, fevereiro, FINAL 03 e revisão jurídica do texto do payback |

## Referências técnicas consultadas

As referências sustentam as decisões propostas; o lockfile e as APIs devem ser conferidos na execução.

- [Next.js: autenticação e autorização em serviços de servidor](https://nextjs.org/docs/app/guides/authentication).
- [Next.js: operação em infraestrutura própria](https://nextjs.org/docs/app/guides/self-hosting).
- [Better Auth: adaptador Drizzle](https://better-auth.com/docs/adapters/drizzle).
- [Drizzle: tipos PostgreSQL, incluindo numeric](https://orm.drizzle.team/docs/column-types).
- [decimal.js: precisão e arredondamento](https://mikemcl.github.io/decimal.js/).
- [pdf-lib: criação de documentos, fontes e páginas](https://pdf-lib.js.org/docs/api/classes/pdfdocument).
- [Vitest: configuração e execução](https://vitest.dev/guide/).

O próximo passo é revisar este plano e escolher o modo de execução. Nenhum código de produto, ambiente operacional ou serviço externo foi criado nesta etapa.
