# Etapa 7 — crítica da especificação

**Alvo:** `../../designs/plataforma-comercial-hoteleira-beta.md`, linhas 1–480. **Resultado:** 0 Blocker, 0 Major e 1 Nit. Não houve remediação.

## Achado priorizado

### T7-01 — Qualificar a unicidade da entrada pública — Nit

**Lente:** `egm-style`. **Escopo:** linha 388, “9. Contratos internos e rotas propostas”.

**Evidência:** “`/` como única entrada pública/redirecionador”. O mesmo parágrafo enumera `/entrar`, `/recuperar-senha`, `/p/[token]` e o download externo.

**Discrepância:** “única entrada pública” pode indicar que só `/` é acessível sem autenticação. O contexto aponta outra intenção: uma única página implementa a URL raiz. A frase mistura a propriedade da rota raiz com a existência de outras entradas públicas.

**Impacto:** o leitor precisa inferir qual unicidade se aplica ao mapa de rotas. A enumeração das demais rotas reduz a ambiguidade; não há bloqueio de implementação.

**Recomendação:** escrever “`/` como entrada pública/redirecionador, implementada exclusivamente em `src/app/page.tsx`”. Preservar as outras rotas. É um ajuste de precisão sem mudança de escopo.

**Contrargumento:** o caminho de arquivo e a lista de rotas tornam a intenção dedutível. Por isso a classificação é Nit, não Major. O achado permanece pendente; o desenho não foi alterado.

## Estado e cobertura dos revisores

| Revisor | Agente | Estado | Blocker | Major | Nit |
|---|---|---|---:|---:|---:|
| `egm-design` | `/root/stage7_design` | Concluído após uma retomada | 0 | 0 | 0 |
| `egm-structural` | `/root/stage7_structural` | Concluído após uma retomada | 0 | 0 | 0 |
| `egm-style` | `/root/stage7_style` | Concluído após uma retomada | 0 | 0 | 1 |

As primeiras execuções das três lentes falharam por limite de uso. Após o pedido “Continue”, cada agente recebeu uma única retomada da tarefa original, sem achados das outras lentes. Todos entregaram parecer final; a falha inicial não foi contabilizada como resultado sem achados. Os três foram originalmente criados com `fork_turns: "none"`.

Design e Structural leram suas personas e `feature-spec-standard.md`; Style leu sua persona sem padrão adicional. Todos leram o manifesto, o escopo 1–480 e integralmente os sete contextos Markdown. Design também leu 481–937 para esclarecer definições e mitigação. Structural e Style não leram esse restante textual. Todos confirmaram os nove hashes do alvo/contexto contra o manifesto.

Todos inspecionaram o XLSX estaticamente por ZIP/XML, com inventário das 11 abas, valores e fórmulas representativos; não executaram Excel nem recalcularam a planilha. Não houve insumo obrigatório inacessível, navegação externa, escrita de fontes ou execução do produto. Truncamentos foram recuperados em blocos menores.

## Parecer da lente de desenho

Sem achados D7. O padrão é atendido por problema e motivação (24–34), objetivos/limites (36–82), componentes (116–169), segurança/persistência/cálculo/emissão (171–400), alternativas (404–456) e operação (458–479).

Foram examinados: autoridade global de identidade versus vínculo local (173–179, com esclarecimento em 650–652); restauração anterior a revogações e senhas alteradas (394–400, 890–892); interrupção entre reserva, upload e confirmação (316–351, 754–760); download após expiração e reemissão pendente (96, 331, 367–369, 758, 771); independência entre preço e participação no pool (191–217); e tratamento de WebP para PDF (131, 674–676). A lente encontrou mitigação documental para esses riscos. Capacidade e tolerâncias são valores de ensaio, não escolhas estruturais esquecidas.

## Parecer da lente estrutural

Sem achados S7. A hierarquia H1/H2/H3/H4 é sequencial; pagamento e matriz normativa pertencem às seções técnicas correspondentes. Problema, objetivos, arquitetura, alternativas e riscos são identificáveis. O padrão não obriga grafia exata nem uma seção única chamada “Risks & Mitigations”; distribuir riscos pelos mecanismos responsáveis não viola sua exigência.

O revisor verificou oito tabelas com colunas consistentes, três blocos cercados fechados (Mermaid e dois JSON), sintaxe válida dos dois JSON e dez ocorrências de links locais existentes no escopo. Não tratou arquivos futuros como referências existentes ausentes. Um sumário poderia ajudar a navegação, mas não foi classificado como defeito sem obrigação ou referência inacessível.

## Calibração editorial

Além de T7-01, Style não encontrou ressalva defensiva a remover ou reposicionar. Manteve as distinções entre desenho e execução (122, 169, 353, 479), valores operacionais a medir (60, 462), autorização temporal independente por requisição (367), reabertura após restauração (394–400) e alcance da revogação de PDFs baixados (369, 418). Essas passagens orientam decisões concretas.

Os pareceres históricos foram tratados como contexto e confrontados com a versão atual. As conclusões desta etapa não certificam integração de bibliotecas, execução do produto ou homologação comercial.
