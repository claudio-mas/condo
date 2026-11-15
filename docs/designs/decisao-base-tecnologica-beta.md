# DT-01 — base tecnológica da beta

Autor: Cláudio Más.
Data: 2026-11-11.
Estado: decisão concluída; o solicitante escolheu a opção 1, TypeScript/Next.js e PostgreSQL.

O bloco de visão geral, problema, objetivos e limites do [desenho formal](../../design_draft.md) foi aprovado. Esta decisão prepara sua seção técnica. O [plano anterior](<../../Plano de implementacao - Plataforma comercial hoteleira.md>) propõe TypeScript/Next.js e PostgreSQL, mas distingue essa proposta de uma escolha expressa do solicitante.

## O que permanece comum às opções

O [brief aprovado](../../concepts_brief.md) mantém uma aplicação web integrada e modular, cálculo autoritativo no servidor, banco relacional, arquivos privados, autenticação individual, separação entre empresas e versões imutáveis. O domínio de cálculo fica separado das telas e da persistência. Os dois modelos, a participação pelo valor de venda de referência e a regra de payback continuam os mesmos.

Ambas as opções usam PostgreSQL e preveem páginas de administração, atendimento e consulta externa de propostas. Ambas precisam implementar a autorização por empresa, os limites comerciais e o protocolo de emissão e recuperação; escolher um framework não resolve essas regras automaticamente. Esta comparação não inclui contratação de infraestrutura nem mudança de escopo funcional.

## Opção 1 — TypeScript, Next.js e PostgreSQL

**Mecanismo.** Interface em React e serviços de servidor no mesmo projeto Next.js, executado em Node.js. O motor de calendário e cálculo será um módulo TypeScript sem dependência de interface ou banco. Os serviços consultam PostgreSQL e armazenam PDFs em arquivos privados. Autenticação, persistência e renderização de PDF usam bibliotecas integradas à aplicação, conforme o detalhamento da seção técnica.

**Reaproveitamento.** Preserva a linguagem e a estrutura de diretórios propostas no plano anterior. Drizzle, Better Auth, decimal.js, pdf-lib, Vitest e Playwright são os candidatos ali documentados; esta opção não afirma que suas versões ou a integração completa já foram validadas. A documentação do Next.js prevê execução como servidor Node.js e apresenta integração com bibliotecas de autenticação. Fontes: [publicação em Node.js](https://nextjs.org/docs/app/getting-started/deploying) e [autenticação no Next.js](https://nextjs.org/docs/app/guides/authentication).

**Trocas.** Permite manter a aplicação em TypeScript e construir as interações comerciais em React, aproveitando o plano já escrito. Exige integrar os pacotes de autenticação, banco e documentos e conferir suas versões. Os limites entre código do navegador e do servidor e o comportamento de cache precisam ser explícitos, principalmente na consulta de propostas. A documentação de [operação própria do Next.js](https://nextjs.org/docs/app/guides/self-hosting) descreve essas configurações; sua existência não comprova que o produto já as atende.

**Quando deixa de atender esta proposta.** Uma publicação apenas estática não executa os serviços de cálculo, autenticação e emissão previstos. Um ambiente que não sustente o runtime Node e as operações necessárias de geração e armazenamento de documentos exige outra configuração de publicação. Essas condições devem ser verificadas antes da operação; não há provedor escolhido.

## Opção 2 — Python, Django e PostgreSQL

**Mecanismo.** Aplicação Django integrada, com páginas próprias renderizadas no servidor e JavaScript nas interações que precisarem de atualização sem recarregar a página inteira. O motor de cálculo será um módulo Python separado das views e do ORM. PostgreSQL persiste os dados; um adaptador de armazenamento atende os PDFs privados. A biblioteca de PDF e os contratos de apresentação serão especificados se esta opção for escolhida.

**Reaproveitamento.** Django fornece contas, sessões e permissões gerais; o projeto acrescenta os vínculos e regras de acesso por empresa. O admin pode apoiar cadastros internos adequados a seu modelo, sem substituir automaticamente as telas administrativas e comerciais do produto. Fontes: [autenticação do Django](https://docs.djangoproject.com/en/stable/topics/auth/) e [finalidade do admin](https://docs.djangoproject.com/en/stable/ref/contrib/admin/).

**Trocas.** Reaproveita mecanismos do próprio framework para autenticação e cadastros internos. Em contrapartida, exige traduzir a proposta de módulos, contratos, testes e documentos do plano anterior para Python/Django e definir a biblioteca de PDF. Telas orientadas ao atendimento e às premissas do pool continuam precisando de desenvolvimento próprio; o admin genérico não fornece esses fluxos comerciais.

**Quando deixa de atender esta proposta.** Usar apenas o admin padrão, sem os fluxos próprios do produto, não atende a jornada aprovada do consultor e do investidor. Também não atende presumir que permissões gerais isolam automaticamente registros de empresas distintas; esse controle precisa existir e ser verificado na aplicação.

## Alcance da decisão

A escolha define a base para redigir os componentes, contratos e arquivos da seção técnica. Não seleciona provedor de hospedagem nem fixa preços, versões ou capacidade sem verificação. Os custos e limites acima são uma análise de adequação ao projeto, não resultados de benchmark ou implementação.

O objetivo não é alterar o investimento no SaaS nem reabrir os modelos funcionais aprovados. A escolha fica registrada neste arquivo e no desenho formal antes de detalhar a implementação.

## Decisão registrada

O solicitante respondeu “Opção 1”. TypeScript, React/Next.js em Node.js e PostgreSQL são a base escolhida para a beta. Django/Python permanece como alternativa considerada e não selecionada; o solicitante não forneceu um motivo adicional para essa escolha. A seleção não fixa provedor de hospedagem nem comprova a compatibilidade de versões das bibliotecas candidatas.
