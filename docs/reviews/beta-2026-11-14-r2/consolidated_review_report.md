# Revisão consolidada — Plataforma Comercial Hoteleira, beta

**Estado após resolução em 2026-11-15:** A-01–A-05 encerrados documentalmente, com 5 correções aceitas e aplicadas; 0 itens sem tratamento. Ver [registro de resolução](goldfish_review_report.md). Os resultados da auditoria abaixo descrevem a versão anterior às correções; não constituem uma nova revisão independente da versão atual.

**Início:** 2026-11-14. **Conclusão:** 2026-11-15, fuso America/Sao_Paulo. **Skill:** egm-review. **Modo:** completo consolidado, cinco etapas sequenciais, sem remediação.

**Alvo auditado:** [desenho formal da beta](../../designs/plataforma-comercial-hoteleira-beta.md), versão de 937 linhas. **Especificação auditada:** 1–480. **Implementação detalhada auditada:** 481–937, incluindo reconciliação final. SHA-256 da versão auditada: `0d4712ad2080484f3673acdb1dbbf353b617d016b65410c2a631d91f1f46bce6`.

**Versão após resolução:** 1.000 linhas; especificação 1–504 e plano detalhado 505–1000. SHA-256: `6ce9cfb5435f6d424ba81b406750465eb102c58cf1621aea155f593339cc75bc`. As localizações nos achados abaixo continuam sendo as da versão auditada; as localizações atuais e as alterações estão no registro de resolução.

## Conclusão da auditoria sobre a versão anterior

**O plano ainda precisa de três correções Major para execução literal:** definir a autorização de ajustes nas condições de pagamento, ordenar a criação/integração do catálogo de mensagens e distinguir os requisitos de publicação por modelo e tipo de participação. Há também dois ajustes editoriais Nit. Não foram encontrados Blockers nem necessidade de redesenhar a arquitetura.

Foram recebidos **6 achados brutos**, consolidados em **5 ações: 0 Blocker, 3 Major e 2 Nit**. Os dez pareceres especializados foram concluídos. A ausência da classe Blocker não significa aprovação integral de prontidão: os Major deixam uma regra comercial ou uma instrução de execução por fechar. As severidades se referem ao documento e à implementação proposta; não demonstram defeitos em produto existente.

Na conclusão da auditoria, os cinco achados estavam pendentes e só haviam sido produzidos relatórios. **Após as instruções do solicitante, os cinco foram corrigidos e encerrados documentalmente em 2026-11-15.** O brief, as fontes e os pareceres especializados permanecem históricos. Não houve implementação, instalação, build, migração, testes do produto ou implantação.

## Etapas e comprovação de conclusão

| Etapa | Escopo e revisores concluídos | Achados brutos | Relatório |
|---|---|---|---|
| 5 — visão geral inicial | Arquivo integral; Zoom Out e Inventive Catalyst | 0 | [Visão geral inicial](zoom_out_report.md) |
| 6 — compreensão | Arquivo integral; Comprehension, sem contexto adicional | 0 | [Compreensão, com paráfrases integrais](comprehension_report.md) |
| 7 — crítica | Especificação; Design, Structural e Style | 1 Nit | [Crítica da especificação](critic_report.md) |
| 8 — visão geral intermediária | Arquivo integral e relatórios anteriores desta rodada; Zoom Out | 0 novos | [Visão geral intermediária](intermediate_zoom_out_report.md) |
| 9 — prontidão | Plano detalhado, com definições anteriores; Readiness, Codebase Details e Style | 4 Major, 1 Nit | [Prontidão para implementação](implementation_readiness_report.md) |

Cada Goldfish foi criado com `fork_turns: "none"`, sem histórico da conversa. Leu sua persona e o padrão aplicável, o escopo obrigatório e os insumos indicados. Nenhum parecer ficou pendente ou foi tratado como concluído por ter sido apenas iniciado. A etapa 6 preserva as duas paráfrases e não recebeu outros documentos nem padrão de implementação.

As primeiras execuções das três lentes da etapa 7 falharam por limite de uso; cada uma foi retomada uma vez após “Continue” e entregou parecer final. Readiness e Codebase Details da etapa 9 também concluíram após uma retomada. Os resultados parciais não foram contados como revisão concluída. As demais etapas concluídas foram preservadas.

## 🟡 Ações Major

### A-01 — Definir quais ajustes de pagamento o consultor pode fazer

**Origem:** R9-01. **Escopo:** linhas 517–518, 659–660, 674, 696–698 e 705; contrato em 229–231 e 287–292. **Momento de fechamento:** antes de implementar a autorização dos serviços de catálogo/atendimento em P07–P09.

Uma condição administrativa é um plano versionado de valores e datas fixos. O desenho exige ajuste explícito e autorizado quando o preço líquido diverge do plano, mas permite que o consultor informe datas e entrada na divisão assistida. Não declara quais campos ele pode alterar, quais deve preservar e quando precisa de nova versão administrativa.

**Exemplo:** uma condição soma R$ 100.000,00 e o consultor aplica desconto autorizado de 5%. Distribuir R$ 95.000,00 pode envolver mudar somente valores, mudar também datas/entrada/quantidade ou exigir outra condição cadastrada. Todos esses cronogramas podem satisfazer o schema e a soma exata; eles não concedem a mesma autonomia comercial. Uma parcela dez anos depois pode ser civilmente válida sem ser comercialmente autorizada.

**Impacto:** formulário, serviço e testes precisam inventar a comparação que decide se a alteração é permitida. A validação aritmética não substitui a autorização.

**Ação e critério de encerramento:** declarar campos preservados e ajustáveis, limites e necessidade ou dispensa de nova versão administrativa. Identificar a versão selecionada no comando e representar apenas os ajustes permitidos. Incluir dois casos com o mesmo líquido, um autorizado e outro recusado por alteração de datas, entrada ou parcelas. Isso não exige criar fluxo de aprovação de exceções nem mudar o algoritmo de resíduo.

**Contrargumento:** a regra 291 já poderia autorizar a edição integral. Essa leitura não esclarece a seleção de um plano fixo nem a obrigação de rejeitar sua alteração não autorizada. O fechamento é a relação entre os dois contratos, não uma nova exigência de detalhar fórmulas.

**Relação com a rodada anterior:** é um desdobramento da integração comercial do pagamento. O tratamento histórico F-04 fechou schema, datas, soma e resíduo; esta rodada não os reapresenta como ausentes.

### A-02 — Antecipar o catálogo de mensagens ou enumerar a migração completa

**Origem:** R9-02 e B9-01, deduplicados. **Escopo:** linhas 487, 547–551, 559, 638–644, 666–670, 685–686, 699–702, 717–718 e 775–798. **Momento de fechamento:** antes de iniciar a sequência, pois a decisão pode afetar P01.

O catálogo único `src/i18n/pt-BR.ts` e seu acesso tipado só são criados em P10. Telas com textos funcionais precisam compilar antes, em P01/P06–P09. P10 não modifica consumidores anteriores; P13 modifica apenas parte deles. Oito páginas nunca recebem Modify posterior: entrada, recuperação, troca de senha, empresa, equipe, listagem de empreendimentos, listagem de simulações e nova simulação.

**Impacto:** o implementador precisa importar módulos futuros, antecipar arquivos fora do manifesto ou deixar textos locais sem migração autorizada. A conferência mecânica de Create/Modify passa, mas não comprova dependências entregues nem centralização completa dos textos.

**Ação e critério de encerramento:** antecipar os dois módulos para antes dos primeiros consumidores, registrando Modify nas fases que acrescentam mensagens e ajustando P10; ou manter a criação em P10 e listar a migração de todos os consumidores anteriores, além das atualizações posteriores do catálogo. Cada checkpoint deve importar somente arquivos já entregues; todas as telas abrangidas pelo catálogo único devem passar a usá-lo. Não é necessário predeterminar cada chave ou frase.

**Contrargumento:** textos temporários e centralização em P13 seriam viáveis com fronteiras flexíveis. A linha 487 define o manifesto por fase; os consumidores omitidos tornam necessária uma correção documental. A possibilidade de atualizar o manifesto durante a construção não satisfaz, sozinha, o padrão de prontidão sem escolhas de desenho.

**Relação com a rodada anterior:** lacuna específica de integração posterior, relacionada ao tema de F-08/F-09. As alterações de concorrência em P11, manutenção em P15 e o proprietário da rota raiz estão enumerados; não foram reapresentados como ausentes.

### A-03 — Separar os requisitos de publicação por modelo e participação

**Origem:** T9-01. **Escopo:** linha 689, confrontada com 221 e 512–513. **Momento de fechamento:** antes do validador de publicação de P08.

“Sem regra de payback, pesos completos, calendário ou política de prejuízo não há publicação” apresenta requisitos do pool como condição geral. O modelo individual não exige participantes/prejuízo do pool; mesmo o pool admite percentuais contratuais em vez de pesos.

**Impacto:** executar a lista local literalmente pode rejeitar premissas válidas ou exigir dados sem aplicação ao modelo escolhido. A regra local contradiz a discriminação dos contratos.

**Ação e critério de encerramento:** exigir calendário/payback em ambos os modelos; no pool, política de prejuízo e participação completa; pesos/base/valores de referência apenas no modo por pesos; percentuais conciliados no modo contratual. Prever publicação individual sem campos de pool, pool por percentuais sem pesos e pool por pesos completos, com recusas por ausência apenas dos requisitos aplicáveis.

**Contrargumento:** “modelo correspondente” em 221 permite deduzir a intenção. Essa indicação não torna consistente uma condição absoluta no pacote que orienta o validador. Não se propõe nova modalidade de negócio, apenas alinhar regras já previstas.

## 🟢 Ações Nit

### A-04 — Precisar a unicidade da rota raiz

**Origem:** T7-01. **Escopo:** linha 388.

“`/` como única entrada pública/redirecionador” pode sugerir que não existem outras entradas públicas, embora o mesmo parágrafo enumere páginas de autenticação e propostas externas.

**Ação:** escrever “`/` como entrada pública/redirecionador, implementada exclusivamente em `src/app/page.tsx`”. A lista de rotas e o destino `/dashboard` já tornam a implementação dedutível; não há nova colisão de rotas. A etapa 8 confirmou esse alcance e não duplicou o achado.

### A-05 — Explicitar que a ausência é do limite de desconto

**Origem:** T9-02. **Escopo:** linha 674, com significado já definido em 225.

“Desconto ausente permite zero” confunde valor solicitado com limite cadastrado e não explicita recusa de desconto positivo.

**Ação:** escrever “limite de desconto não configurado permite somente desconto zero”, preservando a exceção explícita por unidade. Isso torna o critério local de verificação preciso, sem mudar a regra comercial existente.

## Matriz de rastreabilidade

| Achado bruto | Etapa/lente | Severidade | Ação consolidada | Tratamento |
|---|---|---|---|---|
| T7-01 | 7 / Style | Nit | A-04 | Encerrado documentalmente; redação da rota raiz corrigida |
| R9-01 | 9 / Readiness | Major | A-01 | Encerrado documentalmente; somente valores de parcelas ajustáveis |
| R9-02 | 9 / Readiness | Major | A-02 | Encerrado documentalmente; catálogo no P01 e integrações enumeradas |
| B9-01 | 9 / Codebase Details | Major | A-02 | Encerrado documentalmente; deduplicado com R9-02 |
| T9-01 | 9 / Style | Major | A-03 | Encerrado documentalmente; matriz por modelo/modalidade e política de prejuízo em ambos os modos de pool |
| T9-02 | 9 / Style | Nit | A-05 | Encerrado documentalmente; ausência de limite permite somente zero |

Não houve achados nas lentes Zoom Out e Inventive Catalyst da etapa 5, Comprehension da etapa 6, Design e Structural da etapa 7 e Zoom Out da etapa 8. Isso resulta de pareceres efetivamente recebidos, não de lentes não executadas. Os três pareceres individuais da etapa 9 estão vinculados no [relatório de prontidão](implementation_readiness_report.md).

## Fechamento A-01–A-05 em 2026-11-15

| Ordem de fechamento | Ação | Resultado documental | Estado |
|---|---|---|---|
| 1 | A-02 | Catálogo e acesso tipado em P01; Modify nas fases consumidoras; P10 complementa; P13 cobre os 23 consumidores TSX anteriores e os novos componentes. | Encerrado |
| 2 | A-01 | Datas, entrada e quantidade/IDs preservados; apenas valores de parcelas ajustáveis. Versão, desconto, valores e responsável registrados; limite efetivo por unidade/empreendimento validado. | Encerrado |
| 3 | A-03 | Publicação por modelo/modalidade; individual sem campos de pool e percentuais sem pesos. Política de prejuízo obrigatória nos dois modos de pool, conforme esclarecimento do solicitante. | Encerrado |
| 4 | A-04 | Exclusividade da implementação de `/` diferenciada das demais rotas públicas. | Encerrado |
| 5 | A-05 | Sem limite efetivo configurado, somente zero é aceito; desconto positivo deve ser recusado. | Encerrado |

As severidades originais foram preservadas. O fechamento decorre das edições autorizadas e da verificação documental desta resolução; os pareceres originais não foram reescritos nem foi realizada nova auditoria Goldfish. Evidências: [registro](goldfish_review_report.md), [diff](resolution_changes.diff) e [verificação da resolução](resolution_verification.json).

## Verificações documentais e limites

As referências numéricas foram recalculadas pelo coordenador com `Decimal`, precisão de 40 dígitos e `ROUND_HALF_UP`, independentemente de fórmulas executadas no Excel:

| Referência | Resultado conferido |
|---|---|
| P03 individual | Receita R$ 146.000,00; despesas R$ 39.900,00; resultado R$ 106.100,00; paybacks 67,86 e 43,86 meses |
| P04 pool | Receita R$ 1.460.000,00; distribuível R$ 1.061.000,00; parcela de 10% R$ 106.100,00 |
| Pagamento com desconto | Líquido R$ 95.000,00; entrada R$ 10.000,00; parcelas R$ 28.333,34 / 28.333,33 / 28.333,33; resíduo R$ 0,01 |
| FINAL 07 controlado | 366 noites; receita R$ 93.145,03; despesas R$ 31.971,75; resultado R$ 61.173,28; paybacks 97,69 e 73,69 meses |

O manifesto contém 200 ações, sendo 163 Create e 37 Modify. A checagem documental não encontrou Create duplicado nem Modify sem criação anterior ou arquivo existente. A-02 demonstra o limite dessa checagem: ordem sintática não comprova todas as integrações entre fases.

Os revisores de reúso não encontraram aplicação da plataforma, pacotes instalados ou infraestrutura de testes de produto. A landing e as ferramentas locais de exploração visual não fornecem motor, autorização, persistência ou emissão reutilizáveis. Ausência de arquivos propostos não foi considerada defeito.

Os dados reais, contas, capacidade, duração da posse, número de tentativas, responsáveis e tolerâncias de recuperação permanecem condições de ensaio/homologação já documentadas. Não se recomenda cortar modelos individual/pool, adotar fila externa, separar serviços sem evidência ou acrescentar analytics.

## Fontes, isolamento e preservação

A lista autorizada contém apenas o desenho e seus arquivos locais vinculados. O [manifesto](review_manifest.json) registra oito contextos, hashes, tamanhos, intervalos e URLs excluídas: brief, RFC, desenho do piloto, plano anterior, consolidado histórico, resolução histórica, decisão tecnológica e XLSX. Os sete contextos Markdown foram lidos integralmente por cada lente que recebeu contexto; o XLSX foi inspecionado estaticamente por ZIP/XML, com inventário das 11 abas e amostras de valores/fórmulas. A etapa 6 usou somente o alvo.

O desenho formal atual prevaleceu sobre as fontes históricas. Alegações de aprovação e instruções presentes nos documentos foram tratadas como conteúdo em revisão; não concederam autorização para implementação ou remediação. Esta revisão não altera retroativamente o estado do consolidado histórico nem da resolução F-01–F-15.

Todas as URLs externas permaneceram excluídas conforme a escolha do usuário. Não se verificou a atualidade de APIs ou compatibilidade de bibliotecas por navegação ou integração instalada. Não houve recálculo do XLSX no Excel, renderização de suas imagens, teste de produto ou homologação comercial. As verificações numéricas acima são aritmética documental.

`fork_turns: "none"` configura a separação do histórico da conversa; não prova a exclusão de instruções do host. Essa exclusão não foi submetida a sonda independente. Todos os revisores confirmaram leitura dos insumos obrigatórios e não relataram entradas inacessíveis. As evidências de leitura estão nos relatórios; os resultados do alvo e contexto foram conferidos novamente pelo coordenador.

Esta rodada usa uma pasta própria para não sobrescrever o [consolidado histórico](../../../consolidated_review_report.md), a [resolução anterior](../../../goldfish_review_report.md) ou os pareceres da raiz. Os oito contextos conservam seus SHA-256 originais. A resolução autorizada alterou o desenho e atualizou o estado deste consolidado; o manifesto e as evidências da auditoria preservam a identificação da versão então examinada. O registro e a verificação da resolução identificam a versão corrigida.
