# Etapa 8 — visão geral intermediária

**Alvo:** `../../designs/plataforma-comercial-hoteleira-beta.md`, linhas 1–937. **Revisor:** `egm-zoom-out`, agente `/root/stage8_zoom`, criado com `fork_turns: "none"`. **Estado:** concluído. **Resultado:** 0 Blocker, 0 Major, 0 Nit; nenhum ID Z8 atribuído.

## Conclusão estratégica

Nenhum achado novo de arquitetura ou simplicidade. A aplicação integrada continua relacionada ao problema de substituir a função comercial da planilha, preservar propostas e permitir administração, atendimento e consulta externa (14–60, 118–169).

O teste de compreensão não apresentou achados ou mitigação adicional. Sua paráfrase corresponde ao alvo. A crítica apresentou somente T7-01: o trecho “única entrada pública/redirecionador” (388) admite ajuste editorial, mas o proprietário de `/` e o destino `/dashboard` são consistentes em 549, 643–645, 652 e 779. Não há nova colisão de rotas; T7-01 permanece pendente e não foi duplicado como Z8.

Nenhuma alteração ou nova mitigação foi aplicada nesta rodada. Os relatórios foram conferidos como evidência, sem funcionar como decisões normativas.

## Contrapontos examinados

- **Emissão recuperável (314–351, 729–760):** tentativas, posse e confirmação acrescentam complexidade para coordenar banco e arquivos sem publicar conteúdo incompleto. Renderização no mesmo runtime pode disputar recursos, mas 462, 756 e 892 exigem ensaio e limites; 428–430 condiciona separação futura à evidência. Não há gargalo demonstrado que torne fila ou worker uma simplificação necessária.
- **Identidade multivínculo (173–183, 628–652):** e-mail de recuperação e autoridade local separada da credencial resolvem uma fronteira concreta. Não exigem serviço adicional de identidade ou impersonação.
- **Restauração (390–402, 852–892):** bloqueio externo ao backup e reabertura conservadora podem exigir intervenção prolongada. O texto assume esse custo e conserva bloqueados acessos não comprovados, sem prometer reconstruir informação perdida.
- **Altitude do documento (227–312, 329–351, 481–919):** schemas, matriz e manifestos são extensos, mas fecham contratos e possuem consumidores identificados. Não foram encontrados pseudocódigo ornamental ou abstrações especulativas.
- **Homologação (74–82, 802–850, 919):** dados reais, responsáveis e valores operacionais são condições declaradas de liberação. Não impedem a construção com dados controlados.

## Reúso e integridade

O revisor executou `rg --files`, inventário de extensões de implementação e busca por `calculatePool|calculateIndividual|requireActor|buildSnapshot|PaymentPlan|putImmutable|decimal\.js|better-auth|pdf-lib|FileStore|issueProposal|resolvePublicProposal|leaseVersion`, fora de documentação e ferramentas. Não encontrou implementação reutilizável. A busca equivalente na landing também não encontrou componentes de plataforma. Leu integralmente `landing-beta/README.md`, 38 linhas: exploração estática sem rotas, cadastro ou envio de dados reais. Não existem `src/`, `package.json`, `README.md`, `context.md` ou `AGENTS.md` na raiz.

Foram lidos persona, padrão `zoom-out-standard.md`, manifesto, alvo integral, sete contextos Markdown, os três relatórios desta rodada e README da landing. O XLSX foi inspecionado estaticamente por ZIP/XML, com 89 membros, 11 abas e amostras de valores/fórmulas. Todos os nove hashes do alvo/contexto coincidiram com o manifesto no início e no fim. Não houve entrada obrigatória inacessível.

Hashes dos relatórios consultados:

| Relatório | SHA-256 |
|---|---|
| `zoom_out_report.md` | `0f4f1ef0a61964ea1c97b406589759da4acc8d0f9b6185f99f8c682d21e1d1a4` |
| `comprehension_report.md` | `9a6f19d8cd65f1444a6d53fca057bb3905d0c7bcb8aa3e78c6cbde81388f42e6` |
| `critic_report.md` | `e881e7328c30abd6c96d71b5674951e221c7ad798b60215b6722b14f8fd4245b` |

Não houve escrita de fontes, navegação externa, execução de produto ou remediação. A conclusão desta lente não certifica integração das bibliotecas, prontidão de execução ou homologação comercial.
