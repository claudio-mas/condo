# Etapa 9 — prontidão para implementação

**Alvo:** `../../designs/plataforma-comercial-hoteleira-beta.md`, linhas 481–937, com definições anteriores consultáveis. **Conclusão:** o plano ainda precisa de correções antes da execução literal. A arquitetura não exige redesenho.

Foram recebidos **5 achados brutos**, consolidados em **4 ações: 0 Blocker, 3 Major e 1 Nit**. A duplicação R9-02/B9-01 foi mantida na rastreabilidade. Todos os achados permanecem pendentes; não houve remediação.

## Revisores

| Lente | Estado | Achados brutos | Parecer |
|---|---|---|---|
| `egm-implementation-readiness` | Concluído após uma retomada | 2 Major | [Prontidão](stage9-egm-implementation-readiness.md) |
| `egm-codebase-details` | Concluído após uma retomada | 1 Major | [Correspondência com o projeto](stage9-egm-codebase-details.md) |
| `egm-style` | Concluído | 1 Major, 1 Nit | [Precisão editorial](stage9-egm-style.md) |

Os três foram criados com `fork_turns: "none"` e não receberam achados das outras lentes ou relatórios desta rodada. Readiness e Codebase leram o padrão de prontidão; Style não recebeu padrão adicional. Todos leram sua persona, manifesto, intervalo obrigatório, definições pertinentes e oito contextos. Os sete Markdown foram lidos integralmente; o XLSX foi inspecionado estaticamente por ZIP/XML. Os nove hashes do alvo/contextos coincidiram com o manifesto, inclusive nas retomadas. Nenhum insumo obrigatório inacessível.

## Ações Major

### IR-01 — Definir a autoridade para ajustar pagamento

**Origem:** R9-01. **Linhas:** 517–518, 659–660, 674, 696–698, 705; definições em 229–231 e 287–292.

Há condição administrativa versionada com valores/datas fixos, ferramenta em que o consultor informa datas/entrada e obrigação de recusar alterações não autorizadas. Não está definida a relação entre esses contratos. Para uma condição de R$ 100 mil e líquido de R$ 95 mil após desconto, diferentes implementações podem permitir mudar tudo, apenas valores ou exigir nova versão administrativa.

**Encerramento:** declarar campos ajustáveis/preservados, limites e necessidade de nova versão; identificar a condição selecionada no comando; verificar alterações permitidas e recusadas com o mesmo total líquido. O algoritmo de resíduo não precisa ser reaberto.

**Contraponto:** informar datas/entrada poderia ser a autorização. Isso não resolve como comparar o resultado com a condição fixa selecionada para rejeitar uma alteração indevida.

### IR-02 — Ordenar o catálogo de mensagens e suas integrações

**Origem:** R9-02 e B9-01. **Linhas:** 487, 547–551, 559, 638–644, 666–670, 685–686, 699–702, 717–718, 775–798.

O catálogo único só é criado em P10, depois de telas compiláveis em P01/P06–P09. O manifesto não prevê migrar todos os consumidores anteriores; oito páginas, demonstradas no parecer B9-01, nunca recebem Modify. A conferência de que todo Modify possui Create anterior não detecta essa dependência.

**Encerramento:** antecipar os módulos de mensagens e registrar suas alterações nas fases consumidoras, ou enumerar a migração completa em P10 e atualizações posteriores. Verificar que cada checkpoint importa somente módulos já entregues e que as telas anteriores usam o catálogo previsto.

**Contraponto:** permitir textos temporários funcionaria com fronteiras flexíveis. A linha 487 define um manifesto explícito; resolver a omissão durante a execução ainda exige uma alteração documental.

### IR-03 — Condicionar publicação ao modelo e ao tipo de participação

**Origem:** T9-01. **Linha:** 689; contratos em 221 e 512–513.

O critério local exige “pesos completos” e “política de prejuízo” sem distinguir individual/pool. Também ignora que pool aceita percentuais contratuais ou pesos. A aplicação literal pode bloquear dados válidos por exigir campos sem aplicação.

**Encerramento:** separar requisitos comuns, requisitos exclusivos de pool e requisitos por modo de participação. Demonstrar publicação individual sem campos de pool, pool por percentuais conciliados sem pesos e pool por pesos completos; rejeitar ausência de cada requisito aplicável.

**Contraponto:** a linha 221 permite inferir a validação do modelo correspondente. Isso não torna consistente a condição absoluta do pacote P08 com os contratos discriminados.

## Ação Nit

### IR-04 — Nomear o limite de desconto ausente

**Origem:** T9-02. **Linha:** 674, com definição em 225.

“Desconto ausente permite zero” pode indicar valor solicitado ou limite configurado, e não explicita a recusa de desconto positivo. Escrever “limite de desconto não configurado permite somente desconto zero”. O significado já está definido anteriormente; o ajuste torna o critério local preciso.

## Rastreabilidade

| Achado bruto | Severidade original | Ação desta etapa | Ação consolidada |
|---|---|---|---|
| R9-01 | Major | IR-01 | A-01 |
| R9-02 | Major | IR-02 | A-02 |
| B9-01 | Major | IR-02 | A-02 |
| T9-01 | Major | IR-03 | A-03 |
| T9-02 | Nit | IR-04 | A-05 |

As demais verificações não demonstraram nova lacuna material. Os arquivos futuros Create não foram tratados como referências inexistentes defeituosas; não foi encontrada implementação local reutilizável. Valores operacionais e homologação permanecem condições futuras já declaradas. Compatibilidade de APIs, build, testes e execução do produto não foram verificados nesta revisão documental.
