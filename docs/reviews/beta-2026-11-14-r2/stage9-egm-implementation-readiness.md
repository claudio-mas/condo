# Etapa 9 — parecer de prontidão

**Lente:** `egm-implementation-readiness`, agente `/root/stage9_readiness`, criado com `fork_turns: "none"`. **Estado:** concluído após uma retomada por limite de uso, com conferência final em 2026-11-15. **Escopo ativo:** linhas 481–937; linhas 1–480 lidas integralmente para definições. **Resultado:** 0 Blocker, 2 Major e 0 Nit.

O plano ainda não atende integralmente ao padrão de prontidão. Os pontos abaixo exigem uma decisão comercial ou ajuste do manifesto antes da execução literal.

## R9-01 — Autorização para ajustar condição de pagamento indefinida — Major

**Linhas:** 517–518, 659–660, 674, 696–698 e 705. Definições relacionadas: 229–231 e 287–292.

A condição administrativa é um plano versionado de valores fixos e vencimentos explícitos. Divergir do líquido exige ajuste “explícito e autorizado” (229). A divisão assistida permite ao consultor informar todas as datas e a entrada (291), enquanto P09 exige rejeitar alteração não autorizada (705). Não se define quais alterações o consultor pode fazer nem qual comparação estabelece autorização.

**Cenário:** uma condição cadastrada totaliza R$ 100.000,00. Com desconto permitido de 5%, o consultor precisa distribuir R$ 95.000,00. Ele pode ajustar o cronograma inteiro, apenas valores mantendo datas/quantidade, ou depende de nova condição administrativa? As três interpretações conciliam o líquido e respeitam o schema, mas conferem autonomias comerciais diferentes. Uma data dez anos depois pode ser válida e preservar a soma sem que o contrato permita decidir sua autorização.

**Impacto:** serviço, formulário e testes podem adotar regras incompatíveis. Somente conferir soma, desconto e existência da condição não atende à exigência de autorização.

**Fechamento mínimo:** definir campos preservados e ajustáveis, limites e necessidade ou dispensa de nova versão administrativa. Fazer `DraftCommand` identificar a versão selecionada e representar apenas os ajustes permitidos. Acrescentar casos com mesmo líquido, um permitido e outro recusado por alteração de datas/entrada/parcelas. Não é necessário criar aprovação de exceções.

**Contraponto:** a regra 291 poderia autorizar todo o cronograma. Essa leitura não explica a seleção simultânea de um plano administrativo fixo nem a rejeição de alteração não autorizada. O algoritmo de divisão e arredondamento já está definido; falta a relação de autoridade entre os contratos.

## R9-02 — Catálogo de mensagens criado após consumidores sem integração enumerada — Major

**Linhas:** 487, 559, 638–644, 666–670, 685–686, 699–702, 717–718 e 775–798.

P06–P09 entregam páginas com rótulos, erros e mensagens. O catálogo único `src/i18n/pt-BR.ts` e seu acesso `src/i18n/index.ts` só são criados em P10. Essa fase não modifica os consumidores anteriores. P13 modifica alguns, mas omite entrada, recuperação, troca de senha, empresa, equipe e listagem administrativa. O desenho do piloto, linha 235, também prevê catálogo único.

**Cenário:** P06 precisa entregar e compilar as telas de identidade antes da criação dos módulos de mensagens. Importá-los viola o checkpoint acumulado; usar textos locais temporários requer migração que as fases posteriores não autorizam para todos os consumidores.

**Impacto:** cumprir literalmente o catálogo único exige sair do manifesto, antecipar arquivos por decisão própria ou manter parte da interface fora do contrato. A validação mecânica de Create/Modify não detecta essa dependência entre módulos.

**Fechamento mínimo:** antecipar a criação dos dois módulos e registrar alterações nas fases consumidoras; alternativamente, enumerar em P10 a migração dos consumidores existentes e as atualizações posteriores do catálogo. Conferir build de cada checkpoint sem importar arquivo futuro e adoção do catálogo pelas telas anteriores. Não é preciso predeterminar cada chave ou frase.

**Contraponto:** o implementador poderia corrigir o manifesto quando surgisse a diferença material, conforme 487. Isso permite resolver durante a construção, mas não entrega o plano fechado exigido pelo padrão. As integrações de concorrência em P11 e manutenção em P15 já estão enumeradas e não foram reapresentadas como ausentes.

## Demais verificações e cobertura

O revisor verificou estrutura mínima de aplicação, compilação incremental, clientes de banco distintos, precisão, referências numéricas, matriz de emissão, proteção contra executor antigo, WebP, validade por requisição e restauração. Não transformou valores operacionais deliberadamente posteriores, dados reais, fixação mecânica de versões ou detalhes rotineiros de SQL/JSX em achados.

Foram lidos integralmente persona, `implementation-readiness-standard.md`, manifesto, alvo 1–937 e os sete Markdown de contexto: brief (125 linhas), RFC (127), piloto (312), plano anterior (336), consolidado histórico (187), resolução histórica (254) e DT-01 (43). O XLSX foi inspecionado estaticamente com `zipfile` e XML: 89 membros, 11 abas, dimensões, visibilidade, células/fórmulas, nomes, tabelas e validações; amostras de FINAL 03/07, calendário, ocupação, tarifas, despesas, receitas e payback. Sem recálculo ou homologação.

Os nove hashes coincidiram com o manifesto, inclusive na retomada de 2026-11-15. Nenhum insumo obrigatório inacessível; truncamentos foram recuperados. Não houve consulta aos relatórios desta rodada, URLs, memória ou achados de outras lentes, nem escrita, produto/build/testes, instalação, remediação ou delegação.
