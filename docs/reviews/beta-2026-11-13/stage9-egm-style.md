Relatório STYLE — Stage 9: Implementation Readiness  
Modo: REVIEW

Foram identificados quatro achados: dois Major e dois Nit. Não há Blocker nesta lente. Os achados tratam da precisão das instruções e dos critérios de verificação; não propõem outra arquitetura.

**IS-01 — Major — A exclusão genérica de arquivos gerados alcança artefatos previstos no próprio manifesto**

Escopo: linha 365, em relação às linhas 401, 474 e 475.

Evidência: “Arquivos gerados de instalação e build […] são artefatos de execução, não código a versionar.” O manifesto também prevê `package-lock.json`, para fixar a resolução instalada, e metadados gerados de migração.

A categoria “arquivos gerados de instalação” é ampla demais para funcionar como regra de versionamento: pode incluir justamente o lockfile. O problema não é exigir que saídas descartáveis fiquem fora do repositório, mas usar a origem automática do arquivo como critério geral enquanto o plano lista arquivos automáticos como entregáveis.

Consequência: quem implementar ou revisar P01 poderá interpretar a instrução como autorização para excluir o lockfile, enfraquecendo a instalação reproduzível exigida na linha 682. As tabelas ajudam a identificar a intenção, mas deixam duas instruções concorrentes.

Ação editorial: **CALIBRATE**. Substituir a frase por uma exclusão delimitada, por exemplo: “Não versionar diretórios de dependências, saídas de build, segredos locais, PDFs emitidos ou backups. Versionar o lockfile e os metadados de migração previstos nas tabelas.” A decisão sobre outros arquivos gerados deve acompanhar sua entrada no manifesto.

**IS-02 — Major — “Mesmo instante” não distingue a verificação de uma requisição da comparação entre requisições**

Escopo: linha 605; definições relacionadas nas linhas 592 e 249–251.

Evidência: “Página e download usam o mesmo instante e resolvedor.”

“Mesmo resolvedor” tem significado claro. “Mesmo instante” permite leituras diferentes: compartilhar o horário capturado quando a página abriu, capturar um horário por requisição ou injetar um horário igual nos testes comparativos. A linha 592 exige `now < expiresAt`, e o desenho caracteriza as respostas como dinâmicas, mas a frase de aceitação não esclarece qual dessas leituras pretende preservar.

Consequência: o implementador pode transportar para o download um horário anterior, enquanto o revisor pode esperar uma nova avaliação da validade. Isso muda o resultado na fronteira do vencimento, justamente o caso que o parágrafo manda testar.

Ação editorial: explicitar o alcance temporal. Redação sugerida: “Página e download consultam o mesmo resolvedor e verificam a validade com o horário atual do servidor em cada requisição. Nos testes comparativos, fornecer o mesmo instante ao resolvedor.” A segunda frase pode ser omitida caso não descreva a intenção do plano; o essencial é retirar a ambiguidade da primeira.

**IS-03 — Nit — “Tablet” não fornece uma condição reproduzível para a verificação responsiva**

Escopo: linha 628.

Evidência: “Conferir 1440 px, tablet e 390 px”.

A enumeração mistura duas larguras com uma categoria de dispositivo que admite diferentes dimensões e orientações. Não foi encontrada uma dimensão correspondente nos trechos consultados das definições anteriores.

Consequência: duas pessoas podem executar a conferência em configurações diferentes e registrar o mesmo critério como atendido. Isso reduz a utilidade da lista como instrução de reprodução.

Ação editorial: declarar que os valores são larguras de viewport e substituir “tablet” pela dimensão escolhida na configuração do Playwright, com orientação quando relevante. Alternativamente, referenciar explicitamente o projeto de navegador que fixará essa dimensão. Não é necessário escolher um modelo comercial de aparelho.

**IS-04 — Nit — Os resultados numéricos de payback omitem a unidade do prazo**

Escopo: linhas 443 e 642.

Evidência: “payback simples `67.86`” e “payback simples `97.69` e prazo `73.69` com 24 meses descontados”.

Os exemplos misturam receitas, custos, investimento e prazos. O desconto de 24 meses permite inferir a unidade dos resultados, mas o critério não a declara junto aos números. A precisão de duas casas, descrita na linha 208, também não resolve a unidade.

Consequência: quem extrair essas frases para fixtures, relatórios de homologação ou revisão de apresentação precisa completar uma informação implícita. Como os números são referências de aceitação, convém que permaneçam inteligíveis fora do parágrafo original.

Ação editorial: escrever “payback simples de `67.86` meses” e identificar igualmente os demais prazos, mantendo a unidade em todas as referências numéricas de payback.

**Manifesto de leitura e limites**

- Persona `agents/style.md`: leitura integral; nenhum padrão editorial adicional aplicado.
- Documento alvo: leitura integral das linhas 359–716. Os trechos afetados por truncamento foram recuperados.
- Definições anteriores do próprio alvo: leitura das linhas 201–208 e 237–253, além de resultados de busca textual em 1–358 para localizar definições e verificar referências.
- `review_context.json`: leitura integral do índice com os 16 arquivos disponíveis. Nenhum corpo desses arquivos foi necessário para sustentar os achados.
- Não houve consulta a relatórios de outras etapas, críticas anteriores, memória ou fontes ao vivo. Nenhum arquivo foi alterado; não foram executados instalações, builds, testes ou migrações.

As verificações futuras e os arquivos propostos foram tratados como requisitos, sem atribuir-lhes comportamento já implementado ou testes aprovados. As ressalvas sobre homologação, compatibilidade do armazenamento, restauração e aprovação documental têm decisões concretas associadas; não foram consideradas excesso editorial.
