# Crítica do desenho — etapa 7

Data de conclusão: 2026-11-14. Alvo: [desenho formal](docs/designs/plataforma-comercial-hoteleira-beta.md), linhas 1–358. Modo completo consolidado; nenhuma correção aplicada.

## Revisores e cobertura

| Lente | Agente nativo | Estado | Parecer bruto |
|---|---|---|---|
| Design | `/root/review_s7_design_resume` | completed | [Design](docs/reviews/beta-2026-11-13/stage7-egm-design.md) |
| Structural | `/root/review_s7_structural_resume` | completed | [Estrutura](docs/reviews/beta-2026-11-13/stage7-egm-structural.md) |
| Style | `/root/review_s7_style_resume` | completed | [Estilo](docs/reviews/beta-2026-11-13/stage7-egm-style.md) |

As três lentes executaram em contextos novos, sem histórico de conversa ou pareceres entre si. Personas e escopo obrigatório foram lidos integralmente, com truncamentos recuperados quando necessários. Design e Structural aplicaram o Feature Specification Standard; Style aplicou sua persona, sem padrão adicional. Os 16 arquivos autorizados permaneceram disponíveis, com consultas efetivas registradas nos pareceres. Estrutura não encontrou deficiência sustentada pelo padrão.

A primeira tentativa de orquestração em 2026-11-13 foi interrompida por limite de uso antes de produzir relatório da etapa. A retomada usou três revisores novos diretamente, em paralelo, preservando as etapas 5 e 6. Resultados da tentativa interrompida não foram tratados como revisão concluída.

## Achados consolidados

Total: **0 Blocker, 2 Major, 1 Nit**. Não há sobreposição entre os três achados desta etapa.

### S7-01 — Major — Restaurar o banco pode reativar acessos autenticados

Origem: D-01. Escopo: linhas 170–182 e 274–278; detalhamento complementar 488–501 e 670–674.

O desenho reconcilia links públicos após restauração, mas o mesmo backup também pode recuperar sessões, vínculos, papéis ou credenciais anteriores a uma revogação. Encerrar sessões não impede novo login com uma senha antiga comprometida. A manutenção e a conferência antes da reabertura devem abranger o acesso autenticado, com invalidação das sessões e reconciliação ou recuperação conservadora dos vínculos e credenciais. Acrescentar um ensaio com usuário desativado e senha redefinida depois do ponto restaurado.

### S7-02 — Major — Preservar a versão anterior não garante acesso válido

Origem: S-01, ação editorial CALIBRATE. Escopo: linhas 94 e 350; regras de acesso nas linhas 243–246.

A frase de que a proposta anterior continua válida até concluir a substituição pode conflitar com vencimento ou revogação durante uma tentativa interrompida. Declarar que a tentativa não marca a versão anterior como substituída; o acesso continua sujeito às demais restrições. Verificar também expiração e revogação durante a recuperação de uma reemissão.

### S7-03 — Nit — Explicitar a subtração dos meses no payback

Origem: S-02. Escopo: linhas 20 e 206.

Definir na apresentação inicial que o prazo ajustado é o payback simples menos os meses publicados, preservando a identificação e os estados de indisponibilidade. A regra está coerente com a fonte funcional e o exemplo da implementação; o achado é de definição local, não de erro aritmético.

## Rastreabilidade

| ID desta etapa | Origem | Classe |
|---|---|---|
| S7-01 | D-01 | Major |
| S7-02 | S-01 | Major |
| S7-03 | S-02 | Nit |
| Sem achados | Structural | Parecer concluído |

Esta crítica verifica concepção e clareza. Não aplica o critério de ausência total de decisões do plano de implementação e não afirma comportamento executado do produto.
