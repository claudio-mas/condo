## What this proposes

O documento propõe uma beta para equipes que vendem unidades de condo-hotéis, substituindo gradualmente a planilha por um fluxo de administração de premissas, simulação comercial e emissão de propostas por link e PDF. Os cálculos contemplam operação individual e pool; no primeiro empreendimento, a participação no pool usa valores de referência publicados, independentemente dos descontos negociados. A aplicação integrada em TypeScript/Next.js e PostgreSQL deverá separar empresas e permissões, preservar o conteúdo das propostas emitidas e permitir recuperação de emissões e backups sem reabrir links indevidamente. O plano organiza a construção futura em quinze pacotes, com verificações técnicas e homologação comercial antes da adoção oficial.

## How the existing system works, per this document

Hoje, uma planilha concentra unidades, tarifas, despesas, ocupação e estimativas apresentadas ao investidor. Ela servirá como fonte histórica e de comparação, mas suas fórmulas e contagens não devem ser reproduzidas automaticamente, nem seus dados presumidos como inventário completo do pool. O documento afirma que os módulos, arquivos e serviços propostos ainda não constituem uma implementação de produto. A disponibilidade da empresa parceira está confirmada, enquanto dados reais, responsáveis, agenda e ambiente ainda dependem das definições e da homologação indicadas.

### C-01 — Major — Referências legadas do P14 dependem de conhecimento ausente do documento

**Escopo:** `/home/claudio/projetos/condo/docs/designs/plataforma-comercial-hoteleira-beta.md`, linhas 630–642, especialmente a linha 642.

**Lacuna de clareza:** o P14 apresenta números esperados para “FINAL 07” e exige conferir “diárias do FINAL 03”, fevereiro, fim de semana e “os textos exigidos no desenho”, sem explicar o que esses identificadores representam ou delimitar os casos correspondentes. O restante do documento informa que existe uma planilha histórica e aponta documentos antecedentes, mas não fornece a identificação nem as entradas necessárias para compreender essas referências específicas. Também não fica claro a qual “desenho” essa exigência remete.

**Consequência concreta:** um leitor novo consegue compreender a finalidade da comparação legada, mas não consegue explicar o caso que produz os números apresentados nem quais discrepâncias precisam ser verificadas antes da publicação real. Os valores de saída, isoladamente, não permitem entender o significado da evidência pretendida.

**Orientação acionável:** acrescentar ao P14 uma descrição breve de FINAL 07 e FINAL 03, identificando sua origem e seu papel na comparação. Resumir as entradas relevantes do caso numérico e explicitar quais verificações de fevereiro, fim de semana, diárias e textos estão sendo exigidas. Distinguir os resultados esperados das discrepâncias históricas ainda pendentes, preservando a ressalva de que esse caso não homologa o pool.

### Manifesto de leitura e cobertura

- **Modo:** REVIEW, Stage 6 — compreensão e autossuficiência documental.
- **Persona lida integralmente:** `/home/claudio/.codex/plugins/cache/egm/egm/0.1.1/agents/comprehension.md`.
- **Documento lido integralmente:** `/home/claudio/projetos/condo/docs/designs/plataforma-comercial-hoteleira-beta.md`, linhas 1–716.
- **Cobertura:** FeatureRange 1–358 e DetailedRange 359–716, incluindo tabelas, jornadas, arquitetura, alternativas, contratos, quinze pacotes, verificações e reconciliação final.
- **Recuperação de truncamento:** a leitura inicial foi truncada; o conteúdo foi recuperado por leituras explícitas das linhas 165–358, 359–545 e 546–716.
- **Fontes não consultadas:** GoldfishContext, `review_context.json`, brief, RFC, documentos predecessores, outros relatórios, código, arquivos vinculados, páginas externas e memória recuperada.
- **Ações:** somente leitura; nenhum arquivo alterado, teste executado, pacote instalado ou implementação iniciada.
- **Limites:** não foi aplicado padrão de reimplementação ou critério de ausência total de decisões; o status Approved não foi tratado como prova de correção.
