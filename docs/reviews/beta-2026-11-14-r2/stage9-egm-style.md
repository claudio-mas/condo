# Etapa 9 — parecer de estilo

**Revisor:** `egm-style`, `/root/stage9_style`, criado com `fork_turns: "none"`. **Modo:** REVIEW. **Estado:** concluído. **Escopo:** linhas 481–937 do desenho formal. **Resultado:** 0 Blocker, 1 Major e 1 Nit.

## T9-01 — Requisitos do pool apresentados como condição geral de publicação — Major

**Localização:** P08, linha 689.

**Evidência:** “Sem regra de payback, pesos completos, calendário ou política de prejuízo não há publicação.”

A frase exige pesos e política de prejuízo sem distinguir o modelo. A linha 512 reserva participantes e perdas ao `POOL`; a linha 513 admite percentuais contratuais **ou** pesos. A seção anterior determina validação do “modelo correspondente” (221).

O leitor precisa escolher entre aplicar literalmente a lista a toda publicação e acrescentar condições omitidas no trecho local. Mesmo no pool, precisa decidir se participação por percentuais exige também pesos. Uma validação literal pode rejeitar premissas individuais ou pool válido por percentuais, exigindo dados sem aplicação.

**Fechamento:** separar requisitos comuns e condicionais. Payback e calendário valem para ambos os modelos; no pool, exigir política de prejuízo e participação completa; pesos, base e valores de referência somente no modo por pesos; percentuais conciliados no modo contratual.

**Contraponto considerado na síntese:** a linha 221 permite inferir a intenção. Isso reduz a lacuna, mas não elimina a contradição entre uma condição absoluta local e os contratos discriminados; a regra de publicação precisa ser consistente para execução e teste.

## T9-02 — “Desconto ausente” não identifica o parâmetro de autorização — Nit

**Localização:** P07, linha 674.

**Evidência:** “desconto ausente permite zero; exceção por unidade é explícita”.

“Desconto ausente” pode significar o desconto solicitado, enquanto a regra anterior trata do **limite configurado**. “Permite zero” também não diz que valores positivos devem ser recusados. A verificação local pode conferir só o preenchimento padrão e deixar de verificar autorização.

**Fechamento:** escrever “limite de desconto não configurado permite somente desconto zero”, conservando a exceção explícita por unidade. A linha 225 já define o significado, por isso o ajuste é editorial.

## Cobertura e calibração

Persona `agents/style.md` e manifesto lidos integralmente; nenhum padrão adicional aplicado. O revisor leu 481–937 integralmente e consultou 135–227 e 300–355 para definições. Leu os sete Markdown de contexto integralmente e inspecionou o XLSX com `zipfile`/XML: 89 membros, 11 abas, valores e fórmulas representativos, períodos, despesas e investimentos. Os nove SHA-256 coincidem com o manifesto. Nenhum insumo obrigatório inacessível.

Não encontrou ressalvas defensivas a classificar DROP, CALIBRATE ou RELOCATE. As ressalvas sobre autorização, provedor efetivo, homologação e restauração orientam decisões concretas. Verificações futuras não foram confundidas com resultados executados.

Não houve navegação, leitura dos relatórios desta rodada, escrita de fontes, execução do produto, remediação ou criação de agentes. Os achados permanecem pendentes.
