# Etapa 9 — parecer de correspondência com o projeto

**Revisor:** `egm-codebase-details`, `/root/stage9_codebase`, criado com `fork_turns: "none"`. **Modo:** REVIEW. **Estado:** concluído após uma retomada. **Escopo:** linhas 481–937, com definições anteriores consultadas. **Resultado:** 0 Blocker, 1 Major e 0 Nit.

## B9-01 — Catálogo de mensagens posterior às telas sem migração autorizada — Major

**Linhas:** 487, 547–551, 559, 638–644, 666–670, 699–702, 717–718 e 775–798.

P10 cria `src/i18n/pt-BR.ts` e `src/i18n/index.ts` como catálogo único dos textos da interface/documentos e acesso tipado. Entretanto, as telas funcionais e seus textos surgem antes. A linha 559 exige build acumulado usando apenas dependências já entregues, e a linha 487 define fronteiras explícitas por pacote.

O revisor conferiu as 200 ações: 163 Create e 37 Modify. Os consumidores abaixo só têm Create, sem Modify posterior:

| Consumidor | Criação |
|---|---|
| `src/app/(auth)/entrar/page.tsx` | P06, 638 |
| `src/app/(auth)/recuperar-senha/page.tsx` | P06, 639 |
| `src/app/(auth)/trocar-senha/page.tsx` | P06, 640 |
| `src/app/(staff)/admin/empresa/page.tsx` | P07, 666 |
| `src/app/(staff)/admin/equipe/page.tsx` | P07, 667 |
| `src/app/(staff)/admin/empreendimentos/page.tsx` | P07, 668 |
| `src/app/(staff)/simulacoes/page.tsx` | P09, 699 |
| `src/app/(staff)/simulacoes/nova/page.tsx` | P09, 700 |

P10 não modifica telas anteriores. P13 modifica apenas parte delas e não autoriza modificar o catálogo para incorporar os textos da integração. Não existe catálogo anterior reutilizável no projeto.

**Impacto:** ao construir P06, o implementador precisa importar arquivo futuro, antecipar criações fora do manifesto ou manter textos locais sem autorização posterior para migrar vários consumidores. A execução literal não chega ao catálogo único com a sequência e fronteiras exigidas. Não se exige predeterminar cada frase; falta ordenar a dependência e listar suas alterações.

**Fechamento mínimo:** antecipar os dois arquivos para P01 e registrar Modify nas fases que adicionam mensagens, inclusive transformar suas ações em P10 para Modify. Alternativamente, manter a centralização em P10 e enumerar todos os consumidores anteriores a migrar, com autorização explícita para atualizar o catálogo depois.

**Contraponto:** textos temporários e centralização em P13 seriam suficientes com fronteiras flexíveis. O manifesto fechado de 487 e os oito consumidores omitidos não autorizam essa interpretação.

## Buscas, infraestrutura e entradas

Não existem aplicação planejada, dependências instaladas ou infraestrutura de testes de produto: `src/`, `tests/`, `fixtures/`, `assets/`, `node_modules/`, `package.json`, lockfile e configurações Vitest/Playwright/Drizzle ainda serão criados. Isso não foi classificado como defeito. A busca por `buildCalendar`, `calculateIndividual`, `ActorContext`, `FileStore`, `requireActor`, `appendAudit`, `putImmutable`, Drizzle e Better Auth não encontrou implementação local reutilizável. A landing é estática; ferramentas de oil-ui não são infraestrutura do produto. `.gitignore` existe e tem as exceções de arquivos versionados citadas.

Foram auditados os contratos de isolamento e conexões simultâneas do banco de testes, setup anterior à migração/limpeza, extração de PDF, armazenamento com falhas controladas e fixtures. Não houve outra lacuna material demonstrada. Compatibilidade de dependências não foi declarada verificada sem código instalado.

Persona, padrão de prontidão, manifesto, alvo 1–937 e sete Markdown de contexto foram lidos integralmente. O XLSX foi inspecionado estaticamente com ZIP/XML: 89 membros, 11 abas e fórmulas/valores representativos de FINAL 03/07, calendário, despesas, receitas e payback. Não houve recálculo da planilha.

Após a retomada, os nove hashes e tamanhos continuam correspondendo ao manifesto. Alvo: 937 linhas, 127.344 bytes, SHA-256 `0d4712ad2080484f3673acdb1dbbf353b617d016b65410c2a631d91f1f46bce6`. Nenhum insumo obrigatório inacessível; truncamentos foram recuperados. Não houve navegação, leitura dos relatórios desta rodada, memória, escrita de fontes, produto/build/testes/migrações ou remediação. O achado permanece pendente.
