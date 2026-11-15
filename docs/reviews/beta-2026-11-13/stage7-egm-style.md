Revisão STYLE — Stage 7, modo REVIEW

Alvo: `docs/designs/plataforma-comercial-hoteleira-beta.md`, linhas 1–358. Resultado: **0 Blocker, 1 Major e 1 Nit**. Não foi fornecido padrão editorial adicional. A aprovação registrada foi tratada como histórico decisório, sem pressupor correção técnica ou homologação.

**S-01 — Major — CALIBRATE: preservar a proposta anterior não equivale a garantir sua validade.**

Escopo: CUJ 2, linha 94; formulação relacionada na linha 350.

Evidência: “A proposta anterior continua válida até a substituição ser concluída.” Na linha 350, o ensaio deve preservar “a anterior até substituição válida”. Entretanto, a própria tabela de consulta externa, linhas 243–246, restringe valores e PDF aos estados permitidos, incluindo vencimento e revogação como impedimentos independentes da substituição.

A frase da CUJ transforma a ausência de substituição em garantia temporal de validade. Uma proposta pode vencer enquanto a nova emissão está interrompida ou ser revogada durante a recuperação. O leitor precisa distinguir duas decisões: quando marcar a versão anterior como substituída e quando permitir sua consulta pública. A redação atual pode orientar um critério de aceitação que mantenha o acesso até a nova emissão terminar, mesmo após ocorrer outro impedimento.

A correção é editorial e não exige mudar o protocolo: limitar a garantia ao efeito da substituição e preservar as demais regras de acesso.

Redação sugerida para a linha 94:

> “A tentativa de emissão não marca a versão anterior como substituída. A consulta dessa versão continua sujeita à validade, à revogação e às demais restrições de acesso; a substituição só ocorre quando a nova versão estiver pronta.”

Na linha 350, substituir o trecho relacionado por:

> “[…] preservam uma versão pronta coerente e só substituem a anterior após confirmação válida, mantendo as demais restrições de acesso.”

**S-02 — Nit — Definir a operação associada a “meses descontados” na primeira apresentação da regra.**

Escopo: Overview, linha 20; motor de cálculo, linha 206.

Evidência: “o payback será apresentado com 24 meses descontados”; depois, “Para `DEDUCTED_MONTHS`, mantém os dois prazos e a identificação dos meses descontados.”

A expressão não informa, no escopo ativo, qual operação produz o segundo prazo. A fonte funcional é explícita: o desenho do piloto, linha 185, define “payback simples − n”. O exemplo do plano detalhado, linha 443 do alvo, também confirma a subtração: `67.86` passa a `43.86` com 24 meses descontados.

Não há evidência de erro aritmético neste ponto. O problema é a definição local insuficiente de uma regra comercial central: o leitor precisa consultar outra seção ou documento para saber que se trata de subtrair meses do prazo simples. Explicitar a operação ajuda o consultor a interpretar o indicador e o implementador a identificar a referência esperada, preservando a decisão aprovada.

Redação sugerida para a linha 20:

> “Para o primeiro cliente, será apresentado o payback simples menos 24 meses, identificado como prazo contado após os primeiros 24 meses de operação; o prazo simples também será exibido.”

Na linha 206, acrescentar:

> “Para `DEDUCTED_MONTHS`, o prazo é o payback simples menos o número de meses publicado, respeitados os estados de indisponibilidade previstos.”

As ressalvas sobre cópias de PDFs já baixadas, reconciliação ou invalidação de links após restauração e verificação futura da integração das bibliotecas foram classificadas como **KEEP**. Elas orientam decisões concretas de compartilhamento, reabertura da consulta e liberação da implementação. Não são achados de excesso defensivo. A distinção entre verificação prevista e resultado executado, linha 357, também está calibrada.

Manifesto de leitura e cobertura:

- Persona `agents/style.md`: leitura integral.
- Alvo: linhas **1–358 integralmente**, com recuperação da saída inicial truncada por leituras delimitadas; nenhum truncamento pendente nesse intervalo.
- Contexto adicional do alvo: linhas **374–390 e 435–445**; também houve busca textual por termos de payback, desconto, congelamento, substituição, automação e disponibilidade, sem cobertura integral de 359–716.
- `review_context.json`: leitura integral para identificar o contexto permitido.
- `concepts_brief.md`: linhas **1–125**, integral.
- `docs/designs/decisao-base-tecnologica-beta.md`: linhas **1–43**, integral.
- `Desenho do piloto - Plataforma comercial hoteleira.md`: linhas **174–195**, além das linhas retornadas pela busca textual indicada.
- `Plano de implementacao - Plataforma comercial hoteleira.md`: somente linhas retornadas pela mesma busca textual; sem leitura integral.
- RFC e onze fontes externas salvas: não consultados. Nenhuma navegação ao vivo, expansão recursiva de links ou consulta a outros relatórios. Nenhuma escrita ou execução do produto.
