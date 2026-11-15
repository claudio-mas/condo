# Revisão consolidada — Plataforma Comercial Hoteleira, beta

Início: 2026-11-13. Conclusão: 2026-11-14. Skill: egm-review, modo completo consolidado, cinco etapas sequenciais.

Alvo: [desenho formal da beta](docs/designs/plataforma-comercial-hoteleira-beta.md), 716 linhas. Especificação: 1–358. Implementação detalhada: 359–716.

SHA-256 preservado: `0ad5f486ddc551e1675db1481d3e399b4663f7ee687b30269b1e922ac8d8e60c`.

## Conclusão

**O plano ainda não passa no critério de prontidão para implementação sem decisões de desenho adicionais.** Há contratos comerciais e de recuperação por fechar, uma colisão de rotas e integrações entre fases por especificar. A arquitetura integrada permanece proporcional à beta; a revisão não recomenda retirar os modelos individual/pool nem introduzir serviços distribuídos, filas externas ou novos módulos de analytics.

Foram recebidos **21 achados brutos**, consolidados em **15 ações: 0 Blocker, 13 Major e 2 Nit**. A ausência da classe Blocker não significa aprovação do plano: os Major incluem lacunas que impedem sua execução literal ou deixam regras relevantes para o implementador escolher. Severidade se refere ao documento e ao risco da implementação proposta, não a defeitos demonstrados em software em operação.

Todos os achados permanecem **pendentes**. Não foram alterados o desenho, o brief ou seus arquivos de contexto. Não houve instalação, testes do produto, build, migração ou implantação.

## Etapas e evidência de conclusão

| Etapa | Cobertura e revisores concluídos | Achados brutos | Relatório |
|---|---|---|---|
| 5 — Initial Zoom Out | Alvo integral; Zoom Out e Inventive Catalyst | 1 Major | [Visão geral](zoom_out_report.md) |
| 6 — Comprehension | Alvo integral, sem contexto adicional; paráfrases preservadas | 1 Major | [Compreensão](comprehension_report.md) |
| 7 — Critic Review | Especificação; Design, Structural e Style | 2 Major, 1 Nit | [Crítica](critic_report.md) |
| 8 — Intermediate Zoom Out | Alvo integral e relatórios anteriores; Zoom Out | 2 Major, sendo uma reiteração | [Revisão intermediária](intermediate_zoom_out_report.md) |
| 9 — Implementation Readiness | Plano detalhado, com definições anteriores consultáveis; Readiness, Codebase Details e Style | 12 Major, 2 Nit | [Prontidão](implementation_readiness_report.md) |

Os dez pareceres especializados foram efetivamente recebidos. Cada revisor usou contexto de conversa novo e leu sua persona, o escopo obrigatório e o padrão quando aplicável. As leituras seletivas de contexto e os truncamentos recuperados estão declarados nos pareceres. Structural e Inventive Catalyst concluíram sem achados; isso não foi confundido com ausência de execução.

A etapa 7 foi interrompida por limite de uso em 2026-11-13 antes de produzir relatório. Na retomada, três novos revisores executaram essa etapa diretamente e em paralelo. As etapas 5 e 6 foram preservadas. O retorno final de Codebase Details da etapa 9 foi solicitado novamente ao mesmo agente, sem repetir a auditoria nem fornecer achados de outras lentes.

## Ações Major

### F-01 — Delimitar redefinição de credenciais de identidade compartilhada

**Origem:** S8/IZ-02, S9/CB-01. **Escopo:** linhas 170–176, 182 e 488–501.

O plano admite uma identidade com vínculos em várias empresas e redefinição administrativa de acesso por empresa, mas não separa a autoridade sobre a credencial compartilhada da autoridade sobre o vínculo. Se a administração de A puder redefinir e conhecer a senha dessa identidade, poderá potencialmente assumir seus vínculos em B. As verificações comerciais de `companyId` não resolvem essa passagem pela identidade autenticada.

**Correção e encerramento:** definir os contratos de administração do vínculo, recuperação da identidade e revogação de sessões. Impedir redefinição unilateral de identidade compartilhada por autoridade restrita a uma empresa. Exigir caso com a mesma identidade em A e B, demonstrando que administração e desativação locais não permitem assumir B. Trata-se de uma lacuna do contrato; não foi demonstrada vulnerabilidade em produto existente.

### F-02 — Recuperar autorizações autenticadas com segurança após restauração

**Origem:** S7/D-01, S8/IZ-01. **Escopo:** linhas 170–182, 274–278, 488–501 e 670–674.

O procedimento cobre links públicos, mas um backup também pode reativar sessões, vínculos, papéis e senhas anteriores a uma revogação. Invalidar sessões não basta se a credencial antiga permitir novo login.

**Correção e encerramento:** ampliar manutenção e condição de reabertura à área autenticada; invalidar sessões restauradas e reconciliar ou recuperar conservadoramente credenciais e autorizações. Ensaiar backup anterior à desativação de um usuário e à redefinição de uma senha. Demonstrar que sessão, senha substituída e vínculo desativado não restabelecem autorização indevida.

### F-03 — Definir um único proprietário da rota raiz

**Origem:** S5/ZO-01, S9/IR-01. **Escopo:** linhas 613 e 617.

`src/app/page.tsx` e `src/app/(staff)/page.tsx` representam a mesma URL `/` no App Router. Executar o manifesto literalmente produz uma colisão na composição da aplicação.

**Correção e encerramento:** manter uma única página para `/`, definindo uma rota explícita para a área autenticada ou consolidando os comportamentos. Atualizar manifesto, navegação e destinos de encaminhamento. Conferir entrada anônima/autenticada e build sem colisão.

### F-04 — Fechar o contrato das condições de pagamento

**Origem:** S9/IR-02, S9/CB-04. **Escopo:** linhas 383, 390 e 507–548.

Conciliação do total e datas determináveis não definem os modelos aceitos, entrada, parcelas, percentuais ou valores, referências de vencimento e distribuição do desconto. Duas implementações podem fechar o mesmo preço e gerar cronogramas diferentes.

**Correção e encerramento:** registrar schema de condição e cronograma, modelos suportados, validações, datas e algoritmo de resíduo. Se datas forem sempre explícitas, declarar isso; se houver recorrência, definir fim de mês e referência temporal. Incluir exemplo completo com desconto, entrada, parcelas, vencimentos e centavo residual, além dos casos inválidos.

### F-05 — Completar a matriz de recuperação de emissão

**Origem:** S9/IR-03. **Escopo:** linhas 470, 480, 578 e 588–594.

Posse temporária e proteção contra executor antigo estão previstas, mas falta definir quando uma falha mantém `PENDING`, produz `FAILED`, permite retomada ou exige nova solicitação. O comportamento após esgotar tentativas também não está fechado.

**Correção e encerramento:** criar matriz de evento, condição, transição persistida, código de falha e ação disponível. Testar falha transitória, conflito comercial definitivo, esgotamento e consulta de execução ainda ativa. Não é preciso inventar limites operacionais de produção para definir essas transições.

### F-06 — Definir o caminho de WebP até o PDF

**Origem:** S9/IR-04, S9/CB-02. **Escopo:** linhas 369, 509–521 e 554–570.

O upload aceita WebP; os contratos de imagem do pdf-lib consultados nas fontes primárias em cache documentam JPEG e PNG. O plano não seleciona transformação ou outro comportamento explícito para o formato aceito.

**Correção e encerramento:** decidir se haverá conversão, restrição ou omissão deliberada, com comportamento informado e verificável. Mantendo conversão, definir dependência, momento, MIME, hashes e referência imutável do derivado. Testar proposta com cada formato aceito e falha da transformação. Não presumir que continuar sem imagem opcional resolve o tratamento normal do WebP.

### F-07 — Selecionar cliente PostgreSQL e dependências diretas

**Origem:** S9/CB-03. **Escopo:** linhas 124–131, 369, 396–411 e 462–475.

PostgreSQL e Drizzle estão escolhidos, mas falta o cliente/driver e a integração concreta de `client.ts`. Não há implementação anterior para fornecer essa escolha. Isso é diferente de fixar mecanicamente versões no setup.

**Correção e encerramento:** fechar a matriz de pacotes, incluindo driver e adaptadores necessários, configuração e ciclo de vida das conexões. Especificar como os testes obtêm conexões reais distintas e como são encerradas. A escolha documental não substitui o ensaio futuro de compatibilidade.

### F-08 — Enumerar alterações de fases posteriores em arquivos já criados

**Origem:** S9/IR-05. **Escopo:** linhas 365, 588 e 674.

P11 exige coordenação com serviços de preços, vigência e desativação criados em P06–P08. P15 exige conectar manutenção à emissão e à consulta criadas em P11–P12. As tabelas de cada fase contêm somente Create, sem as alterações posteriores correspondentes.

**Correção e encerramento:** adicionar ações Modify precisas aos pacotes consumidores ou antecipar os contratos e conexões nas fases produtoras. Conferir que a lista de arquivos permitidos por fase contém toda mudança exigida pelo texto, não apenas que o arquivo aparece em algum lugar do manifesto global.

### F-09 — Manter as fases intermediárias de interface compiláveis

**Origem:** S9/IR-06. **Escopo:** linhas 396, 491–494, 513–517, 529, 542–545, 581–583, 601–602, 611 e 616.

Páginas são criadas a partir de P06, mas a estrutura mínima global e o layout autenticado ficam em P13, quando o plano exige o primeiro build completo. A integração pode acumular problemas durante vários pacotes.

**Correção e encerramento:** antecipar a estrutura mínima antes da primeira página e estabelecer compilação apropriada nos checkpoints que introduzem UI. Manter o acabamento e os E2E completos em P13, ajustando o manifesto e as dependências entre fases.

### F-10 — Verificar horário atual em cada requisição pública

**Origem:** S9/IS-02. **Escopo:** linhas 249–251, 592 e 605.

“Página e download usam o mesmo instante” pode significar reutilizar no download um horário capturado na abertura da página, mesmo após vencer a proposta. O resolvedor comum está definido; a relação temporal entre requisições não está clara.

**Correção e encerramento:** declarar horário atual do servidor por requisição. Reservar um instante igual para testes comparativos do resolvedor, quando necessário. Testar abrir antes do vencimento e solicitar download depois, sem reaproveitar autorização temporal antiga.

### F-11 — Separar preservação da versão e validade de acesso

**Origem:** S7/S-01. **Escopo:** linhas 94, 243–246 e 350.

A garantia de que a proposta anterior continua válida até concluir a substituição conflita, por leitura literal, com vencimento ou revogação independentes. Preservar a versão não significa manter seu acesso público válido.

**Correção e encerramento:** dizer que uma tentativa não marca a anterior como substituída; a consulta continua sujeita a todas as restrições. Ensaiar expiração e revogação enquanto a reemissão ainda está interrompida.

### F-12 — Tornar a referência legada inteligível sem contexto oculto

**Origem:** S6/C-01. **Escopo:** linhas 630–642.

P14 fornece resultados de FINAL 07 e cita diárias do FINAL 03, fevereiro e fim de semana sem explicar localmente as identidades, entradas e discrepâncias a conferir. O leitor novo não consegue reconstruir o significado do caso apenas pelos valores de saída.

**Correção e encerramento:** identificar a origem dos dois casos, resumir entradas e verificações e tornar inequívoca a referência ao desenho do piloto. Separar comparação sintética das pendências reais do pool. A inspeção estática posterior confirmou valores salvos na planilha; não recalculou suas fórmulas e não substitui essa definição do caso nem a homologação.

### F-13 — Delimitar quais arquivos gerados devem ser versionados

**Origem:** S9/IS-01. **Escopo:** linhas 365, 401 e 474–475.

A exclusão genérica de arquivos gerados de instalação/build pode alcançar lockfile e metadados de migração previstos como entregáveis. A origem automática do arquivo não basta para decidir seu versionamento.

**Correção e encerramento:** excluir explicitamente dependências instaladas, saídas de build, segredos, PDFs e backups; preservar lockfile e metadados declarados. Conferir coerência entre essa regra, `.gitignore`, manifesto e instalação reproduzível.

## Ações Nit

### F-14 — Explicitar definição e unidade do payback

**Origem:** S7/S-02, S9/IS-04. **Escopo:** linhas 20, 206, 443 e 642.

Definir no primeiro uso que o prazo ajustado subtrai os meses publicados do payback simples e escrever a unidade meses junto dos resultados numéricos. Os dois achados são agrupados por finalidade editorial; não são uma alegação de erro aritmético ou uma mudança da regra aprovada.

### F-15 — Fixar o viewport de tablet

**Origem:** S9/IS-03. **Escopo:** linha 628.

Substituir a categoria genérica tablet por dimensões/orientação ou por um projeto Playwright que as fixe. Declarar que 1440 px e 390 px são larguras de viewport. O critério deve ser reproduzível sem escolher um modelo comercial de aparelho.

## Matriz de rastreabilidade dos 21 achados

| Origem bruta | Ação consolidada | Parecer preservado |
|---|---|---|
| S5/ZO-01 | F-03 | [Zoom Out](docs/reviews/beta-2026-11-13/stage5-egm-zoom-out.md) |
| S6/C-01 | F-12 | [Compreensão](docs/reviews/beta-2026-11-13/stage6-egm-comprehension.md) |
| S7/D-01 | F-02 | [Design](docs/reviews/beta-2026-11-13/stage7-egm-design.md) |
| S7/S-01 | F-11 | [Style da especificação](docs/reviews/beta-2026-11-13/stage7-egm-style.md) |
| S7/S-02 | F-14 | [Style da especificação](docs/reviews/beta-2026-11-13/stage7-egm-style.md) |
| S8/IZ-01 | F-02 | [Revisão intermediária](docs/reviews/beta-2026-11-13/stage8-egm-zoom-out.md) |
| S8/IZ-02 | F-01 | [Revisão intermediária](docs/reviews/beta-2026-11-13/stage8-egm-zoom-out.md) |
| S9/IR-01 | F-03 | [Readiness](docs/reviews/beta-2026-11-13/stage9-egm-implementation-readiness.md) |
| S9/IR-02 | F-04 | [Readiness](docs/reviews/beta-2026-11-13/stage9-egm-implementation-readiness.md) |
| S9/IR-03 | F-05 | [Readiness](docs/reviews/beta-2026-11-13/stage9-egm-implementation-readiness.md) |
| S9/IR-04 | F-06 | [Readiness](docs/reviews/beta-2026-11-13/stage9-egm-implementation-readiness.md) |
| S9/IR-05 | F-08 | [Readiness](docs/reviews/beta-2026-11-13/stage9-egm-implementation-readiness.md) |
| S9/IR-06 | F-09 | [Readiness](docs/reviews/beta-2026-11-13/stage9-egm-implementation-readiness.md) |
| S9/CB-01 | F-01 | [Codebase Details](docs/reviews/beta-2026-11-13/stage9-egm-codebase-details.md) |
| S9/CB-02 | F-06 | [Codebase Details](docs/reviews/beta-2026-11-13/stage9-egm-codebase-details.md) |
| S9/CB-03 | F-07 | [Codebase Details](docs/reviews/beta-2026-11-13/stage9-egm-codebase-details.md) |
| S9/CB-04 | F-04 | [Codebase Details](docs/reviews/beta-2026-11-13/stage9-egm-codebase-details.md) |
| S9/IS-01 | F-13 | [Style da implementação](docs/reviews/beta-2026-11-13/stage9-egm-style.md) |
| S9/IS-02 | F-10 | [Style da implementação](docs/reviews/beta-2026-11-13/stage9-egm-style.md) |
| S9/IS-03 | F-15 | [Style da implementação](docs/reviews/beta-2026-11-13/stage9-egm-style.md) |
| S9/IS-04 | F-14 | [Style da implementação](docs/reviews/beta-2026-11-13/stage9-egm-style.md) |

Revisores concluídos sem achados: [Inventive Catalyst](docs/reviews/beta-2026-11-13/stage5-egm-inventive-catalyst.md) e [Structural](docs/reviews/beta-2026-11-13/stage7-egm-structural.md). O [índice estruturado](docs/reviews/beta-2026-11-13/findings_index.json) registra os mesmos IDs, severidades e agrupamentos.

## Contexto, limites e próximo passo

O [manifesto de fontes](docs/reviews/beta-2026-11-13/source_manifest.md) documenta os cinco arquivos locais e as onze URLs autorizadas, arquivadas em HTML e texto visível. As fontes estavam disponíveis a todas as etapas com contexto, com consultas seletivas registradas nos pareceres. A etapa 6 leu apenas o alvo e sua persona. Disponibilizar uma fonte não significa que todas as lentes a leram integralmente, nem que a integração de bibliotecas foi certificada.

O [estado da revisão](docs/reviews/beta-2026-11-13/review_state.json) preserva escopos e interrupção/retomada. O mecanismo de contexto novo separou histórico de conversa; não foi realizado um teste específico para comprovar exclusão de instruções do host.

Pendências já reconhecidas de dados reais, responsáveis, orçamento, provedor e homologação não foram convertidas em novas funcionalidades ou falhas do produto. Não foram propostos novos indicadores financeiros, CRM, cobrança SaaS ou expansão de escopo para resolver os achados.

**Próximo passo recomendado:** avaliar e resolver F-01–F-15 com egm-resolve, registrando as decisões comerciais e de identidade necessárias, atualizando o desenho e verificando novamente os critérios afetados. Este relatório não aceita riscos em nome do solicitante e não aplica alterações automaticamente.
