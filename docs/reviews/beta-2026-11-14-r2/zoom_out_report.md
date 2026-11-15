# Etapa 5 — visão geral inicial

**Alvo:** `../../designs/plataforma-comercial-hoteleira-beta.md`, linhas 1–937. **Rodada:** 2026-11-14-r2. **Modo:** relatório consolidado, sem remediação.

## Estado dos revisores

| Revisor | Estado | Blocker | Major | Nit |
|---|---|---:|---:|---:|
| `egm-zoom-out` — `/root/stage5_zoom` | Concluído | 0 | 0 | 0 |
| `egm-inventive-catalyst` — `/root/stage5_catalyst` | Concluído | 0 | 0 | 0 |

Ambos foram iniciados com `fork_turns: "none"`, leram suas personas e `zoom-out-standard.md`, o alvo integral e os oito arquivos do contexto. Nenhum insumo obrigatório ficou inacessível. Os relatórios só foram sintetizados após as duas respostas finais.

## Parecer da lente de arquitetura e simplicidade

Sem achados. O problema de substituir a função comercial da planilha está definido nas linhas 14–60. A aplicação integrada, as fronteiras entre domínio, serviços e apresentação e a ausência de fila externa estão relacionadas ao escopo da beta (118–169, 314–327, 426–448). Oferta comercial, inventário e participantes são conceitos distintos do negócio, não abstrações especulativas (185–217).

Snapshots, confirmação curta, controle de posse e recuperação tratam riscos concretos de banco, arquivos e autorização (314–400). O schema de pagamento e a matriz de emissão são contratos verificáveis; sua extensão não demonstra complexidade sem consumidor. As pendências de dados reais e operação já têm momento de definição e não bloqueiam construção com dados controlados (74–82, 802–850, 919).

**Reúso:** o revisor executou `rg --files` e buscas por `calculatePool|calculateIndividual|requireActor|buildSnapshot|PaymentPlan|putImmutable|decimal\.js|better-auth|pdf-lib`, fora de relatórios e ferramentas locais. Não encontrou implementação reutilizável. Leu `landing-beta/README.md`: a landing é uma exploração estática em HTML/CSS, sem motor, persistência ou emissão da plataforma. Não há `src/`, `package.json`, `README.md` ou `context.md` na raiz.

## Parecer da lente de contradições

**Nenhum falso compromisso detectado.** Atualizar premissas sem reinterpretar propostas é atendido por conteúdo versionado (192–203, 217, 392, 520–521). A falta de transação única entre banco e arquivos é tratada por reserva, upload externo e confirmação idempotente (316–351, 754–760). Imutabilidade histórica e revogação são independentes (194–201, 331, 359–369). Falta de informação posterior ao backup leva à reconciliação ou bloqueio conservador, sem promessa de recuperação impossível (394–402, 888–892).

**Contrargumento mais forte:** renderização e recuperação no mesmo runtime podem disputar recursos; a restauração conservadora exige trabalho manual. O texto exige ensaio representativo antes da liberação (462, 756, 892) e permite separar componentes se houver evidência (428–430). Acrescentar worker ou fila agora imporia implantação, coordenação e observabilidade adicionais sem gargalo demonstrado.

Os custos existentes incluem armazenamento de versões/PDFs, manutenção de formatos, coordenação transacional e reconciliação. As duas lentes os relacionaram a requisitos concretos e não propuseram expansão arquitetural.

## Evidência das leituras

Os dois revisores confirmaram o SHA-256 do alvo e de todos os contextos contra `review_manifest.json`. Leram integralmente os sete contextos Markdown: brief (125 linhas), RFC (127), desenho do piloto (312), plano anterior (336), revisão anterior (187), resolução (254) e decisão tecnológica (43). O XLSX foi inspecionado estaticamente com Python 3, `zipfile` e XML, com inventário das 11 abas e fórmulas/valores representativos, sem executar Excel ou macros.

A inspeção conferiu FINAL 03/07/09, despesas, calendário, ocupações e fórmulas da calculadora. Exemplos: FINAL 03 com investimento `599000`, FINAL 07 com `498000`, tarifas-base `1200/650` e fevereiro legado `13+12+4=29`. Os valores salvos da comparação FINAL 07 incluem receita `93145.031847133752`, resultado `61173.277070063676` e prazo ajustado `73.689714957652157` meses. Isso não homologa os dados reais.

URLs externas foram excluídas conforme a escolha do usuário. As personas são estritamente de leitura; não houve alteração de fontes nem execução do produto. A ausência de achados nestas lentes não certifica prontidão de implementação, integração de bibliotecas ou homologação comercial. A separação do histórico da conversa foi configurada; a exclusão de instruções do host não foi verificada por uma sonda própria.
