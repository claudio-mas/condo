Status: resolved

# Goldfish Annotated Review Report

**Target:** [desenho formal](../../designs/plataforma-comercial-hoteleira-beta.md) (`full file`; 1000 linhas após as alterações).

**Data:** 2026-11-15. **FindingsList:** [A-01–A-05 da segunda revisão](consolidated_review_report.md). **Skill:** egm-resolve.

**Autorização:** instruções direcionadas do solicitante para aplicar os cinco ajustes, inclusive os dois Nits. Aplicado o ramo “Custom instruction / Out-of-band edit”: “If the user provides targeted instructions, apply them and proceed.” O solicitante também confirmou: “Manter obrigatória nos dois modos de pool”, quanto à política de prejuízo. Não houve nova votação sobre alterações já autorizadas.

**Resultado:** 5 correções aceitas, classificadas como PROPOSE FIX e aplicadas (3 Major e 2 Nit); 0 CONTEST, 0 ESCALATE, 0 DECLINE e 0 itens sem tratamento. Severidades preservadas. A-01–A-05 encerrados documentalmente.

**Sequência de fechamento:** A-02 → A-01 → A-03 → A-04/A-05. O catálogo é uma entrega de P01; as alterações desta resolução são exclusivamente documentais.

**SHA-256 anterior:** `0d4712ad2080484f3673acdb1dbbf353b617d016b65410c2a631d91f1f46bce6`.

**SHA-256 atualizado:** `a0cf4512a26ad376a86642d0b4d4de0a542b165118c6def105acc07bad739d59`.

O [diff](resolution_changes.diff) registra as alterações. O manifesto e os pareceres da auditoria conservam a referência à versão anterior; este registro acompanha a resolução sem declarar nova auditoria independente ou execução do produto.

## Prioritized Findings & AI Suggestions

### A-02 — Antecipar o catálogo de mensagens ou enumerar a migração completa [`R9-02 e B9-01, deduplicados`] - Severity: Major

* **Affected Scope:** versão original indicada no consolidado; localização atual: convenções a partir de 515; P01 em 555; P10 em 745; P13 em 817 (P01/P06–P13/P15 e convenções de dependência).
* **Discrepancy Description:** O catálogo único `src/i18n/pt-BR.ts` e seu acesso tipado só são criados em P10. Telas com textos funcionais precisam compilar antes, em P01/P06–P09. P10 não modifica consumidores anteriores; P13 modifica apenas parte deles. Oito páginas nunca recebem Modify posterior: entrada, recuperação, troca de senha, empresa, equipe, listagem de empreendimentos, listagem de simulações e nova simulação.
* **Rationale:** o implementador precisa importar módulos futuros, antecipar arquivos fora do manifesto ou deixar textos locais sem migração autorizada. A conferência mecânica de Create/Modify passa, mas não comprova dependências entregues nem centralização completa dos textos.

**Ação e critério de encerramento:** antecipar os dois módulos para antes dos primeiros consumidores, registrando Modify nas fases que acrescentam mensagens e ajustando P10; ou manter a criação em P10 e listar a migração de todos os consumidores anteriores, além das atualizações posteriores do catálogo. Cada checkpoint deve importar somente arquivos já entregues; todas as telas abrangidas pelo catálogo único devem passar a usá-lo. Não é necessário predeterminar cada chave ou frase.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido e ajuste expressamente autorizado pelo solicitante. A mudança fecha a regra ou integração indicada sem ampliar o escopo da beta.
* ***Proposed Edit:*** aplicada.
  * Location: P01/P06–P13/P15 e convenções de dependência.
  * Change: P01 cria os dois módulos antes das telas; P06–P13 e P15 registram Modify nos dois. P10 passa a complementar o catálogo. P13 enumera a revisão dos 23 consumidores TSX anteriores e dos novos componentes. Critério final: nenhum texto funcional local, sem reformatar dados do usuário ou apresentação histórica.

Trecho resultante:

> **Catálogo de mensagens e ordem de dependências:** `src/i18n/pt-BR.ts` e o acesso tipado em `src/i18n/index.ts` são criados no P01, antes dos primeiros estados de interface. São módulos simples de TypeScript, sem importar domínio, banco, autenticação ou apresentação de fases futuras; os tipos de chaves derivam do catálogo já existente. O domínio devolve códigos e dados, sem importar o catálogo. Cada fase que acrescenta mensagens registra Modify nos dois módulos e inclui suas chaves antes de integrar os consumidores no mesmo pacote. Rótulos, instruções, erros apresentados, textos de acessibilidade, e-mails de identidade e textos de novas propostas vêm desse catálogo desde a primeira entrega. Dados inseridos por usuários e textos históricos já congelados em `ProposalPresentation` permanecem dados; não são traduzidos novamente na consulta. Ao final do P13, nenhuma tela prevista mantém textos funcionais locais, e nenhum checkpoint importa arquivo criado por fase posterior.

### A-01 — Definir quais ajustes de pagamento o consultor pode fazer [`R9-01`] - Severity: Major

* **Affected Scope:** versão original indicada no consolidado; localização atual: pagamento a partir de 241; contratos em 533; P07 em 684; P09 em 727; P11 em 767 (Condições de pagamento, contratos, P05/P07/P09/P11).
* **Discrepancy Description:** Uma condição administrativa é um plano versionado de valores e datas fixos. O desenho exige ajuste explícito e autorizado quando o preço líquido diverge do plano, mas permite que o consultor informe datas e entrada na divisão assistida. Não declara quais campos ele pode alterar, quais deve preservar e quando precisa de nova versão administrativa.

**Exemplo:** uma condição soma R$ 100.000,00 e o consultor aplica desconto autorizado de 5%. Distribuir R$ 95.000,00 pode envolver mudar somente valores, mudar também datas/entrada/quantidade ou exigir outra condição cadastrada. Todos esses cronogramas podem satisfazer o schema e a soma exata; eles não concedem a mesma autonomia comercial. Uma parcela dez anos depois pode ser civilmente válida sem ser comercialmente autorizada.
* **Rationale:** formulário, serviço e testes precisam inventar a comparação que decide se a alteração é permitida. A validação aritmética não substitui a autorização.

**Ação e critério de encerramento:** declarar campos preservados e ajustáveis, limites e necessidade ou dispensa de nova versão administrativa. Identificar a versão selecionada no comando e representar apenas os ajustes permitidos. Incluir dois casos com o mesmo líquido, um autorizado e outro recusado por alteração de datas, entrada ou parcelas. Isso não exige criar fluxo de aprovação de exceções nem mudar o algoritmo de resíduo.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido e ajuste expressamente autorizado pelo solicitante. A mudança fecha a regra ou integração indicada sem ampliar o escopo da beta.
* ***Proposed Edit:*** aplicada.
  * Location: Condições de pagamento, contratos, P05/P07/P09/P11.
  * Change: Somente valores das parcelas existentes são ajustáveis; datas, entrada e quantidade/IDs ficam preservados. Outra estrutura exige nova versão administrativa. O comando identifica a versão e desconto; o registro efetivo preserva valores e autor autenticado. Exceção explícita por unidade substitui limite do empreendimento; ausência de ambos equivale a zero. Resíduo assistido vai somente à primeira parcela. Casos de aceitação/recusa foram atualizados.

Trecho resultante:

> Datas de todos os pagamentos, quantidade e IDs das parcelas e a entrada completa (presença, ID, data e valor) permanecem iguais aos da versão selecionada. Alterar qualquer um desses campos exige que o administrador publique uma nova condição versionada e que ela seja selecionada no atendimento. O consultor não pode contornar essa regra usando a divisão assistida. Se a entrada fixa não couber no líquido, ou não restarem centavos suficientes para parcelas positivas, recusar o ajuste e orientar a revisão do desconto ou a seleção de nova condição administrativa; não reduzir entrada nem remover parcela automaticamente.
>
> `PaymentSchedule` acrescenta `conditionVersionId`, preço de tabela resolvido no servidor, taxa e valor de desconto, valor líquido, cronograma resultante, eventual ajuste de centavos e `adjustedByUserId`. O comando de atendimento identifica a versão selecionada, o desconto e os valores propostos por ID de parcela; não aceita datas, entrada ou quantidade alternativas. O servidor completa o registro efetivo do comando com o usuário responsável obtido de `ActorContext`, sem confiar em um autor enviado pelo navegador, e registra o horário na auditoria. Condição, desconto, valores resultantes e responsável são persistidos no rascunho e no snapshot. Custos de aquisição do investimento não são embutidos nas parcelas do preço do imóvel.

### A-03 — Separar os requisitos de publicação por modelo e participação [`T9-01`] - Severity: Major

* **Affected Scope:** versão original indicada no consolidado; localização atual: matriz em 225; P08 em 710 (Matriz de publicação, CUJ 1, persistência/motor e P08).
* **Discrepancy Description:** “Sem regra de payback, pesos completos, calendário ou política de prejuízo não há publicação” apresenta requisitos do pool como condição geral. O modelo individual não exige participantes/prejuízo do pool; mesmo o pool admite percentuais contratuais em vez de pesos.
* **Rationale:** executar a lista local literalmente pode rejeitar premissas válidas ou exigir dados sem aplicação ao modelo escolhido. A regra local contradiz a discriminação dos contratos.

**Ação e critério de encerramento:** exigir calendário/payback em ambos os modelos; no pool, política de prejuízo e participação completa; pesos/base/valores de referência apenas no modo por pesos; percentuais conciliados no modo contratual. Prever publicação individual sem campos de pool, pool por percentuais sem pesos e pool por pesos completos, com recusas por ausência apenas dos requisitos aplicáveis.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido e ajuste expressamente autorizado pelo solicitante. A mudança fecha a regra ou integração indicada sem ampliar o escopo da beta.
* ***Proposed Edit:*** aplicada.
  * Location: Matriz de publicação, CUJ 1, persistência/motor e P08.
  * Change: Substituir o critério geral pela matriz individual / pool por percentuais / pool por pesos; manter política de prejuízo obrigatória em ambos os modos de pool, conforme resposta do solicitante. Conferir campos e casos de publicação somente do modelo/modalidade aplicável.

Trecho resultante:

> | Modelo | Modalidade | Requisitos aplicáveis |
> |---|---|---|
> | Individual | — | Calendário e payback; não exige participantes, pesos ou política de prejuízo do pool. |
> | Pool | Percentuais contratuais | Calendário, payback, percentuais conciliados para todo o conjunto elegível e política de prejuízo. Não exige pesos. |
> | Pool | Por pesos | Calendário, payback, pesos completos para todo o conjunto elegível, base/valores de referência e política de prejuízo. |

### A-04 — Precisar a unicidade da rota raiz [`T7-01`] - Severity: Nit

* **Affected Scope:** versão original indicada no consolidado; localização atual: rotas em 412 (Contratos internos e rotas propostas).
* **Discrepancy Description:** “`/` como única entrada pública/redirecionador” pode sugerir que não existem outras entradas públicas, embora o mesmo parágrafo enumere páginas de autenticação e propostas externas.
* **Rationale:** escrever “`/` como entrada pública/redirecionador, implementada exclusivamente em `src/app/page.tsx`”. A lista de rotas e o destino `/dashboard` já tornam a implementação dedutível; não há nova colisão de rotas. A etapa 8 confirmou esse alcance e não duplicou o achado.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido e ajuste expressamente autorizado pelo solicitante. A correção editorial foi solicitada, portanto não foi classificada como DECLINE.
* ***Proposed Edit:*** aplicada.
  * Location: Contratos internos e rotas propostas.
  * Change: Substituir a expressão de unicidade da entrada pública pela exclusividade da implementação da URL raiz, preservando as outras rotas públicas.

Trecho resultante:

> `/` é a entrada pública/redirecionadora, implementada exclusivamente em `src/app/page.tsx`; as demais rotas públicas são as páginas de autenticação e propostas externas listadas abaixo. Rotas propostas: `/entrar`, `/recuperar-senha`, `/trocar-senha`, `/dashboard` (`src/app/(staff)/dashboard/page.tsx`) como início autenticado, áreas administrativas e comerciais sob sessão, `/api/auth/[...all]` para o mecanismo de identidade, `/p/[token]` para consulta externa e `/p/[token]/pdf` para download. Não haverá endpoint público para cadastrar empresas, confirmar contratação ou reservar unidade. A autenticação não concede autorização comercial por si só.

### A-05 — Explicitar que a ausência é do limite de desconto [`T9-02`] - Severity: Nit

* **Affected Scope:** versão original indicada no consolidado; localização atual: limite em 249; P07 em 684 (Edição do atendimento, validação de desconto e P07).
* **Discrepancy Description:** “Desconto ausente permite zero” confunde valor solicitado com limite cadastrado e não explicita recusa de desconto positivo.
* **Rationale:** escrever “limite de desconto não configurado permite somente desconto zero”, preservando a exceção explícita por unidade. Isso torna o critério local de verificação preciso, sem mudar a regra comercial existente.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido e ajuste expressamente autorizado pelo solicitante. A correção editorial foi solicitada, portanto não foi classificada como DECLINE.
* ***Proposed Edit:*** aplicada.
  * Location: Edição do atendimento, validação de desconto e P07.
  * Change: Nomear o limite configurado e exigir recusa de qualquer desconto positivo quando não houver limite efetivo; conservar precedência da exceção da unidade.

Trecho resultante:

> Quando o limite de desconto não estiver configurado, somente desconto zero será permitido; qualquer desconto positivo deverá ser recusado.

## Matriz de resolução

| Ação | Achados brutos | Severidade | Categoria | Estado |
|---|---|---|---|---|
| A-02 | R9-02, B9-01 | Major | PROPOSE FIX | Encerrado documentalmente |
| A-01 | R9-01 | Major | PROPOSE FIX | Encerrado documentalmente |
| A-03 | T9-01 | Major | PROPOSE FIX | Encerrado documentalmente |
| A-04 | T7-01 | Nit | PROPOSE FIX | Encerrado documentalmente |
| A-05 | T9-02 | Nit | PROPOSE FIX | Encerrado documentalmente |

## Esclarecimento posterior — vencimentos (2026-11-15)

Por orientação do solicitante, a regra 3, os exemplos de rejeição e o P09 agora distinguem entrada e parcelas: aceitar entrada e primeira parcela no mesmo dia quando previsto na condição selecionada; rejeitar vencimentos repetidos entre parcelas e entrada posterior à primeira parcela. O ajuste comercial continua sem autorização para alterar datas. As referências atuais são as linhas 311, 336 e 743 do desenho. Trata-se de precisão do contrato e de seus critérios de teste, sem novo achado ou alteração das cinco classificações encerradas.

## Verificação e alcance

A verificação documental conferiu a sintaxe dos dois JSON, o JSON Schema 2020-12 e o exemplo PaymentPlan/PaymentSchedule, inclusive formatos de UUID/data; recalculou a soma, desconto e resíduo com entrada preservada. O manifesto contém 230 ações (163 Create e 67 Modify), sem Create duplicado ou Modify prematuro. Os dois módulos de mensagens são criados em P01 e modificados nas nove fases consumidoras. P13 cobre os 23 consumidores TSX anteriores. A matriz exige política de prejuízo nos dois modos de pool, sem exigir pesos de percentuais. As redações contraditórias foram removidas.

O registro final das verificações de estrutura, links, hashes e rastreabilidade está em [resolution_verification.json](resolution_verification.json). Os casos de autorização e publicação foram especificados no plano; não foram executados testes de produto. Não houve nova auditoria Goldfish independente.
