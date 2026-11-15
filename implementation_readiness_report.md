# Prontidão de implementação — etapa 9

Data: 2026-11-14. Alvo: [desenho formal](docs/designs/plataforma-comercial-hoteleira-beta.md), linhas 359–716; definições anteriores consultáveis nas linhas 1–358. Padrão: Implementation Readiness Standard para as lentes de prontidão e detalhes; Style aplicou somente sua persona.

**Conclusão: não passa no critério de ausência de decisões de desenho para o implementador.** Há contratos e integrações por definir antes de executar o plano literalmente. Isso não exige abandonar a arquitetura integrada nem retirar os modelos aprovados.

## Revisores e cobertura

| Lente | Agente nativo | Estado | Parecer bruto |
|---|---|---|---|
| Implementation Readiness | `/root/review_s9_readiness` | completed | [Prontidão](docs/reviews/beta-2026-11-13/stage9-egm-implementation-readiness.md) |
| Codebase Details | `/root/review_s9_codebase` | completed | [Detalhes](docs/reviews/beta-2026-11-13/stage9-egm-codebase-details.md) |
| Style | `/root/review_s9_style` | completed | [Estilo](docs/reviews/beta-2026-11-13/stage9-egm-style.md) |

Os revisores foram lançados diretamente, em contextos novos, sem histórico de conversa ou achados de outras lentes. O retorno final de Codebase Details foi solicitado novamente ao mesmo agente após uma mensagem de progresso, sem repetir a auditoria ou fornecer conclusões de outros revisores. Todos concluíram a leitura obrigatória de persona, escopo e padrão quando aplicável; truncamentos foram recuperados. Consultas efetivas de contexto estão descritas nos pareceres. A inspeção do XLSX foi estática; não houve recálculo de fórmulas.

Não houve instalação, execução de testes, build, migração, implementação ou edição do alvo. A inexistência de arquivos futuros marcados Create e as pendências de homologação real não foram contadas como defeitos.

## Achados deduplicados desta etapa

Foram recebidos **14 achados brutos: 12 Major e 2 Nit**. Dois pares se sobrepõem. Resultado desta etapa: **0 Blocker, 10 Major e 2 Nit**, com 12 ações distintas.

| ID | Classe | Escopo no alvo | Problema, correção e evidência de encerramento | Origens |
|---|---|---|---|---|
| S9-01 | Major | 613, 617 | Duas páginas resolvem `/`. Definir proprietário único e destinos de navegação, atualizar manifesto e demonstrar build e entrada anônima/autenticada sem colisão. | IR-01 |
| S9-02 | Major | 383, 390, 507–548 | Falta o contrato das condições de pagamento: entrada, parcelas, percentuais/valores, referências temporais e resíduo. Definir schema e exemplos completos com desconto, datas e configuração inválida. | IR-02, CB-04 |
| S9-03 | Major | 470, 480, 578, 588–594 | Faltam transições completas para falhas, limite de tentativas e conflito definitivo. Definir evento, estado persistido, código de falha e ação oferecida; testar esgotamento e cada classe de recuperação. | IR-03 |
| S9-04 | Major | 369, 509–521, 554–570 | WebP é aceito, mas seu caminho para o PDF não está definido. Escolher transformação ou outro comportamento explícito e aprovar dependência/manifesto quando necessário; testar todos os formatos aceitos e falha de transformação. | IR-04, CB-02 |
| S9-05 | Major | 365, 588, 674 | Pacotes posteriores exigem alterações em arquivos de pacotes anteriores, sem ações Modify. Enumerar essas mudanças ou antecipar seus contratos e conexões; conferir a lista permitida de cada fase. | IR-05 |
| S9-06 | Major | 396, 491–617 | Páginas aparecem antes da estrutura mínima e só há build completo no P13. Antecipar a estrutura e verificar compilação nas fases que passam a introduzir UI. | IR-06 |
| S9-07 | Major | 170–174, 488–501 | Redefinição administrativa não delimita autoridade sobre identidade com vínculos em várias empresas. Separar vínculo e credencial e testar uma identidade compartilhada sem permitir tomada de outro vínculo. | CB-01 |
| S9-08 | Major | 124–131, 369, 396–411, 462–475 | Falta selecionar o cliente PostgreSQL e sua integração Drizzle, incluindo ciclo de conexões e dependências diretas. Definir esses contratos antes do setup; testar conexões distintas para concorrência. | CB-03 |
| S9-09 | Major | 365, 401, 474–475 | Exclusão genérica de arquivos gerados conflita com lockfile e metadados de migração. Delimitar saídas descartáveis e declarar explicitamente quais gerados devem ser versionados. | IS-01 |
| S9-10 | Major | 249–251, 592, 605 | “Mesmo instante” pode sugerir reutilizar o horário da abertura da página no download. Exigir horário atual do servidor a cada requisição; usar instante igual apenas em testes comparativos. | IS-02 |
| S9-11 | Nit | 628 | “Tablet” não é viewport reproduzível. Fixar largura/altura/orientação ou referenciar projeto Playwright com dimensões explícitas. | IS-03 |
| S9-12 | Nit | 443, 642 | Exemplos de payback omitem unidade. Informar meses junto de cada prazo de referência. | IS-04 |

Os pareceres brutos preservam todos os textos, as justificativas e os manifestos de leitura. A matriz acima não substitui os critérios detalhados de cada origem. Nenhuma sugestão foi aplicada automaticamente ao desenho.
