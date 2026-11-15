# Brief de conceito — beta da Plataforma Comercial Hoteleira

Autor: Cláudio Más.  
Data: 2026-11-11.  
Estado: finalizado após revisão independente BRAINSTORM e aprovação das recomendações pelo solicitante em 2026-11-11.

## Overview

A hipótese confirmada é entregar uma beta operacional com o escopo funcional documentado, começando por um empreendimento da primeira empresa e substituindo gradualmente a planilha. A empresa participa da homologação, dos atendimentos acompanhados e do feedback. O investimento no SaaS já está decidido; a beta orienta sua evolução pelo uso, sem reabrir a decisão de investir. Não há novas necessidades conhecidas da empresa.

A disponibilidade total da empresa está confirmada. Responsáveis, consultores participantes, agenda, canal, empreendimento inicial e critérios do primeiro balanço ainda serão combinados. Um ou dois consultores e encontros semanais de 30 minutos são sugestões, não compromissos firmados. Fonte: [hipótese, L7–27](docs/brainstorm/hipotese-beta.md) e [acompanhamento, L13–21 e L76–78](docs/brainstorm/proposta-acompanhamento-beta.md).

A revisão sustenta o conceito e não identificou bloqueador para construir com dados controlados. Os principais ajustes recomendados são uma contingência clara após a troca de referência, recuperação que preserve restrições dos links e demonstração de que emissão e histórico continuam utilizáveis após falhas e atualizações. Não há código de produto analisado nem defeito implementado comprovado.

## Analysis

### Base e decisões preservadas

- O [desenho, revisão 1](<Desenho do piloto - Plataforma comercial hoteleira.md>) é a base funcional: administração, consultores, modelos individual e pool, cenários, regras predefinidas por empreendimento, premissas versionadas, propostas por link e PDF e separação entre empresas (seções 2, 4–9).
- O primeiro empreendimento usa pool com pesos pelos valores de venda de referência, congelados na versão publicada. Descontos ou mudanças de preço não alteram automaticamente a participação (desenho, L147–166).
- O primeiro cliente usa payback com 24 meses descontados, identificado e acompanhado do prazo simples. No caso comparativo, `73,69` e `97,69` são esperados; a revisão 1 substitui a antiga classificação de erro. A comparação legada individual não homologa o pool ([plano, tarefa 14, L277–279](<Plano de implementacao - Plataforma comercial hoteleira.md>)).
- TypeScript/Next.js, PostgreSQL e demais bibliotecas são propostas do responsável técnico, não escolhas expressas do solicitante. O plano contém trabalho futuro, não serviços existentes (plano, L9, L49–55 e L336).

Já há proteções importantes: cálculo autoritativo e determinístico, decimais, dados ausentes distintos de zero, inventário do pool separado da oferta comercial, versões imutáveis, permissões por empresa, emissão idempotente, PDF pronto antes de liberar o link, histórico preservado, backup e restauração. Os riscos abaixo complementam essas proteções; não as apresentam como funcionalidades esquecidas.

### Revisores e rastreabilidade

As sete lentes concluíram seus pareceres. Cada uma recebeu contexto de conversa novo (`fork_turns: "none"`), sua persona exata e os mesmos quatro insumos, sem receber achados das demais. O limite era de quatro agentes incluindo raiz e sintetizador; houve no máximo dois revisores simultâneos, em ondas, e o sétimo executou sozinho. Não houve falha nem repetição.

| Lente | ID nativo do agente | Estado e leitura declarada | Relatório bruto |
|---|---|---|---|
| egm-design | `/root/egm_synthesizer/egm_design` | Concluído; persona + 4 insumos integrais | [design](docs/brainstorm/reviews/egm-design.md) |
| egm-codebase-details | `/root/egm_synthesizer/egm_codebase_details` | Concluído; persona + 4 insumos integrais | [detalhes](docs/brainstorm/reviews/egm-codebase-details.md) |
| egm-zoom-out | `/root/egm_synthesizer/egm_zoom_out` | Concluído; persona + 4 insumos integrais | [zoom-out](docs/brainstorm/reviews/egm-zoom-out.md) |
| egm-comprehension | `/root/egm_synthesizer/egm_comprehension` | Concluído; persona + 4 insumos integrais | [compreensão](docs/brainstorm/reviews/egm-comprehension.md) |
| egm-implementation-readiness | `/root/egm_synthesizer/egm_implementation_readiness` | Concluído; persona + 4 insumos integrais | [prontidão](docs/brainstorm/reviews/egm-implementation-readiness.md) |
| egm-structural | `/root/egm_synthesizer/egm_structural` | Concluído; persona + 4 insumos integrais | [estrutura](docs/brainstorm/reviews/egm-structural.md) |
| egm-inventive-catalyst | `/root/egm_synthesizer/egm_inventive_catalyst` | Concluído; persona com catálogo + 4 insumos integrais | [inventividade](docs/brainstorm/reviews/egm-inventive-catalyst.md) |

Os finais efetivamente recebidos e os manifestos sustentam esses estados. Os quatro insumos têm 42, 312, 336 e 78 linhas, respectivamente: hipótese, desenho, plano e acompanhamento. Nenhum revisor adotou padrão adicional, navegou externamente ou leu a planilha, o relatório histórico ausente ou os outros pareceres. A lente estrutural aplicou manutenção/acoplamento do modo BRAINSTORM, sem auditoria estrutural de plano. O contexto novo não comprova exclusão de instruções do host.

### Riscos práticos consolidados

Severidades editoriais após deduplicação: **0 Blocker, 5 Major e 3 Nit**. Major indica consequência material a prevenir na etapa indicada, não defeito comprovado ou veto ao início da construção. Nit indica refinamento proporcional de implementação ou condução. Os relatórios brutos preservam suas próprias classificações.

| ID | Severidade / etapa | Risco e proteção já existente | Recomendação da revisão |
|---|---|---|---|
| R1 | Major / antes da adoção como referência | Interrupção após a troca pode incentivar retorno a uma planilha histórica desatualizada. Adoção gradual, retirada de premissas e revogação já existem no desenho. | Acordar quem pausa e retoma, o que fica suspenso e como conferir dados antes de usar uma contingência. Não assumir retorno automático à planilha. |
| R2 | Major / antes de usar links reais | Restaurar backup anterior a uma revogação/substituição pode tornar um link novamente ativo. O teste já previsto confere snapshot e PDF, mas não explicita esse retrocesso temporal. | Ensaiar esse cenário. Manter consulta pública suspensa após restauração até reconciliar ou invalidar estados de acesso afetados. |
| R3 | Major / emissão e homologação | Queda entre banco, geração e armazenamento pode deixar tentativa pendente ou exigir intervenção recorrente. Idempotência, estados persistidos e retomada já estão previstos. | Concentrar recuperação numa responsabilidade; distinguir execução em andamento de tentativa interrompida, permitir retomada segura e conferir falha após upload e antes da confirmação final. |
| R4 | Major / antes de alterar formato persistido | Novo código/schema/texto pode deixar propostas antigas ilegíveis ou reinterpretadas. Snapshots, PDF armazenado e versões já protegem conteúdo. | Verificar leitura e significado de uma proposta anterior; preferir mudanças aditivas e declarar limites de retorno da atualização, sem recalcular documentos históricos. |
| R5 | Major / ensaio de administração e atendimento | Usuários podem confundir oferta comercial, inventário operacional e participantes; conflitos podem interromper o atendimento sem próximo passo claro. O motor já separa conjuntos e impede mudanças silenciosas. | Distinguir os três conjuntos na administração; explicar motivo/ação dos conflitos, conservar dados válidos e destacar mudanças antes da reemissão. Exercitar isso no ensaio existente. |
| R6 | Nit / preparação operacional | Feedback pode ser difícil de localizar; agendamento/healthcheck sem destinatário pode deixar falha despercebida. Logs, versões, auditoria e backup já estão previstos. | Ligar registro manual a horário e referência interna quando disponíveis; usar logs sem dados pessoais/tokens e avisos simples do ambiente. |
| R7 | Nit / homologação e expansão | Sem dados de uso, não há capacidade, custo ou gargalo medido. PDFs, ativos, histórico e backups crescem. A aplicação modular e os limites de upload já reduzem complexidade. | Medir emissão/cálculo com inventário e concorrência representativos; estimar armazenamento e transferência e acompanhar consumo, sem prometer escala ou adicionar infraestrutura antecipada. |
| R8 | Nit / início do acompanhamento | “Atendimento concluído” e primeiro balanço podem ter leituras diferentes. Evidências e pontos a combinar já constam na proposta. | Definir no registro manual início, conclusão, interrupção, emissão e envio; combinar amostra e momento do balanço sem inventar metas nesta revisão. |

R1: desenho, L37, L203 e L271; acompanhamento, L35–41; lentes design, detalhes, zoom-out e prontidão. R2: plano, tarefas 12 e 15, L249–256 e L289–294; lente prontidão. R3: plano, L239–244; lentes design, detalhes e estrutura. R4: plano, L94–105 e L169–171; lentes prontidão e estrutura.

R5: desenho, L106, L147–166 e L199–203; plano, L215–220 e L263–268; lente compreensão. R6: acompanhamento, L43–53; plano, L94–101 e L293; lentes detalhes/compreensão. R7: plano, L227–243 e L289–293; desenho, L273; lente design. R8: acompanhamento, L39–41 e L66–78; lentes detalhes/zoom-out. Os relatórios vinculados detalham salvaguardas, evidência e justificativa de cada proposta.

### Condições já documentadas de liberação

Não são novas lacunas: escolher empreendimento e homologador; conferir inventário completo, pesos, despesas, retenções e prejuízo do pool; homologar calendário, fevereiro, fim de semana e diárias do FINAL 03; definir condições comerciais; revisar texto jurídico do payback e tratamento de dados; escolher ambiente/contas; demonstrar permissões, persistência, backup e restauração. Fontes: desenho, seções 10–11, L249–289; plano, tarefas 14–15, L278–295.

Essas condições devem ser comprovadas antes do uso correspondente. Não foram declaradas cumpridas nem falhas nesta revisão. A ausência de dados reais e contas operacionais não impede construir com dados controlados (desenho, L275–277; plano, L310). Os dois modelos precisam de referências aprovadas antes da conclusão do piloto; o modelo ainda não utilizado comercialmente pode ser validado inicialmente com dados controlados (desenho, L249–251).

### Lente inventiva

**Nenhum falso compromisso detectado — “No false compromise detected”.** A revisão não encontrou contradição técnica válida que exija novo padrão arquitetural. Evoluir premissas e conservar propostas já está conciliado por versões e retratos imutáveis; consistência entre banco e arquivos já tem protocolo de emissão; preparação SaaS já convive com aplicação integrada modular.

Não há padrão novo recomendado nem custo secundário de uma transformação inventiva a aceitar. Os mecanismos existentes têm custos normais de testes, armazenamento e recuperação, tratados em R3, R4 e R7. Como direção de resultado final ideal, a equipe conclui o atendimento com proposta consistente, histórico estável e investigação simples, usando o mínimo de operação adicional. Isso não promete operação sem manutenção. Fonte: [parecer inventivo integral](docs/brainstorm/reviews/egm-inventive-catalyst.md).

## Goals vs. Non-Goals

| Objetivos preservados | Fora desta beta |
|---|---|
| Substituir gradualmente a planilha, empreendimento a empreendimento, com adoção validada pela empresa. | Reavaliar a disposição de investir no SaaS ou exigir validação de mercado como saída da beta. |
| Entregar os dois modelos e regras aprovadas, administração, atendimento, link/PDF e separação entre empresas. | Reduzir modelos/regras sem decisão explícita ou construir necessidades ainda desconhecidas. |
| Observar uso real, corrigir defeitos e avaliar novas necessidades caso apareçam. | Transformar todo pedido em compromisso automático ou condicionar a saída da beta à entrega de todo backlog. |
| Manter infraestrutura e acompanhamento compatíveis com um desenvolvedor independente. | CRM, cobrança SaaS, assinatura/contratação, marketing, analytics novos ou rastreamento de abertura. |

Também permanecem fora do cálculo inicial TIR, VPL e payback datado com obra/parcelas. O produto não reserva unidade nem comunica automaticamente revisões aos investidores. São limites do desenho, não cortes feitos por esta revisão (desenho, L81, L193, L201, L203 e L227).

## Alternatives Weighed

| Alternativa | Avaliação e estado |
|---|---|
| Implantação gradual ou troca simultânea | Gradual já foi escolhida pelo solicitante: reduz concentração de preparação e permite validar antes de ampliar. A simultânea permanece alternativa histórica com maior carga inicial (desenho, L35–43). |
| Link com PDF ou somente PDF | Link com PDF já foi escolhido. A alternativa só em PDF não atende essa decisão; esta revisão preserva ambas as formas (desenho, L45–47). |
| Manter escopo aprovado ou adiar modelo/regras | Manter é a base vigente. Adiamento seria proposta de mudança de escopo, exigindo justificativa e decisão expressa; não foi tratado como escolha do usuário. Nenhuma lente encontrou motivo para esse corte. |
| Aplicação modular integrada ou operação distribuída | Manter a proposta integrada: não há carga medida ou contradição que justifique custo operacional adicional. Processamento separado só se ensaio evidenciar necessidade. Recomendação técnica, não escolha expressa do usuário. |
| Registro externo manual ou feedback/analytics no produto | Manual é o padrão recomendado e já permitido: atende o acompanhamento sem criar um novo módulo. A revisão não conhece demanda que justifique automação. |
| Ampliar já para um SaaS genérico | Não recomendado nesta etapa: não há novas necessidades conhecidas. Preservar apenas a preparação delimitada na R1 e avaliar evidências futuras; isso não reabre o investimento decidido. |
| Sincronizar continuamente planilha e plataforma ou declarar referência única | Preservar referência única; sincronização permanente acrescentaria regras e risco de divergência. Contingência exige conferência explícita, não duas bases silenciosamente oficiais. |

As recomendações desta tabela não foram apresentadas como rejeições do solicitante. Apenas implantação gradual e link com PDF têm escolha histórica explícita entre as alternativas descritas.

## Key Decisions & Staging for Next Steps

### Alinhamento final

O solicitante informou não ver necessidade de ajustes nas recomendações. O brief fica finalizado com o escopo funcional preservado e as recomendações R1–R8 aceitas para orientar a próxima etapa. Responsáveis, agenda, empreendimento e demais definições operacionais abaixo continuam em aberto. A aprovação do brief não equivale à homologação comercial. O solicitante escolheu publicar este brief como RFC no repositório e, em seguida, iniciar o documento formal com a skill egm-draft.

### Decisões abertas e padrões recomendados

| Decisão ainda aberta | Padrão recomendado para combinar ou implementar | Momento |
|---|---|---|
| Empreendimento inicial, homologador, participantes e aprovadores de premissas | Nomear responsáveis e preparar um empreendimento representativo; não presumir que será o da planilha. | Antes da preparação real. |
| Agenda, canal e primeiro balanço | Canal único externo e registro manual; conversa semanal de 30 minutos e um ou dois consultores seguem sugestões ajustáveis. | Antes dos primeiros atendimentos observados. |
| Evidência suficiente para adoção e expansão | Usar os critérios funcionais já aprovados e definir com a empresa janela/amostra, tarefas necessárias e dificuldades impeditivas. | Preparação e primeiro balanço. |
| Continuidade, suporte e tolerância a perda/tempo de recuperação | Acordo curto com contatos, horários e autoridade de pausa/retomada, sem supor plantão permanente; medir o ensaio de restauração. | Antes de assumir referência oficial. |
| Ambiente, contas e orçamento operacional | Confirmar opções e limites com consumo representativo; acompanhar banco, arquivos, transferência e backups. | Antes da publicação operacional. |

Retomada de emissão, código de ocorrência, proteção após restauração e leitura de formatos antigos são detalhamentos do responsável pela implementação, com os resultados verificáveis descritos em R2–R6. Não exigem que o usuário escolha agora filas, locks, formatos de logs ou mecanismos de migração.

### Sequência recomendada, ainda sem execução autorizada por este brief

1. Incorporar as recomendações aprovadas à documentação da próxima etapa escolhida e registrar os ajustes correspondentes no desenho ou no plano. Os documentos-fonte ainda não foram alterados.
2. Ao autorizar construção, manter o escopo e a ordem geral do plano, usando dados controlados. Adaptar caminhos e conferir versões/APIs no ambiente efetivo; nenhuma compatibilidade atual foi verificada aqui.
3. Preparar o empreendimento com a empresa e reunir os dados/aprovações já exigidos. Incorporar os cenários de falha, recuperação de acesso e compreensão aos roteiros existentes, sem criar subsistemas adicionais por padrão.
4. Ensaiar administração e atendimento completos, incluindo conflitos, nova versão, link/PDF e contingência. Comprovar condições de liberação e identificar claramente a referência vigente.
5. Acompanhar atendimentos reais e registrar dificuldades, contornos e evidências. Erros de cálculo, acesso ou emissão recebem triagem antes do encontro periódico.
6. Fazer o primeiro balanço combinado, decidir correções e pedidos com justificativa e formalizar adoção por empreendimento quando os critérios forem atendidos. Expandir depois dessa validação; demandas novas continuam avaliadas individualmente.

Este brief e os sete relatórios são os únicos artefatos produzidos pela síntese. Os documentos-fonte e a planilha permanecem como base de referência, sem implementação do produto nesta etapa.
