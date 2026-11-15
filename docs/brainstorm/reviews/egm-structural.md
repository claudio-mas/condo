Revisão Structural-Brainstormer, modo BRAINSTORM. Usei somente a lente de acoplamento, dívida técnica e manutenção da persona, sem auditoria de estrutura de plano e sem padrão adicional.

Manifesto de leitura integral, com linhas numeradas:

- `/home/claudio/.codex/plugins/cache/egm/egm/0.1.1/agents/structural.md`, linhas 1–65: mandatos, persona, modos e formato de saída.
- `/home/claudio/projetos/condo/docs/brainstorm/hipotese-beta.md`, linhas 1–42: conceito, esclarecimentos, base, acompanhamento, limites e fontes.
- `/home/claudio/projetos/condo/Desenho do piloto - Plataforma comercial hoteleira.md`, linhas 1–312: apresentação e seções 1–13 completas.
- `/home/claudio/projetos/condo/Plano de implementacao - Plataforma comercial hoteleira.md`, linhas 1–336: apresentação, restrições, organização, contratos, tarefas 1–15, autorrevisão, alterações e referências.
- `/home/claudio/projetos/condo/docs/brainstorm/proposta-acompanhamento-beta.md`, linhas 1–78: todas as seções.

Não consultei os links externos, a planilha, o relatório de análise ausente, memória ou relatórios de outros revisores. Nenhum arquivo foi alterado.

**Fatos e salvaguardas confirmados**

A hipótese mantém o escopo documentado, a beta serve ao uso e ao feedback, e o investimento no SaaS já está decidido. A disponibilidade da empresa está confirmada; participantes e cadência permanecem abertos. Não há novas necessidades conhecidas nem código de produto identificado. Fonte: hipótese, “Conceito”, “Esclarecimentos”, “Acompanhamento” e “Estado atual”, linhas 9–33.

A arquitetura proposta já reduz os acoplamentos mais perigosos: domínio puro sem importações de banco, autenticação ou interface; inventário operacional separado do catálogo comercial; preços negociados separados dos pesos de participação; apresentação comum para página e PDF; premissas e propostas imutáveis. Fontes: plano, “Arquivos e responsabilidades”, linhas 59–72; contratos, linhas 88–105; tarefas 4 e 10, linhas 156–159 e 227–232. Desenho, seções 7.3 e 9, linhas 147–166 e 233–243.

Os dois modelos e as regras documentadas continuam no escopo. A stack é proposta técnica do responsável pelo plano, não escolha expressa do solicitante. O payback `73,69` com desconto de 24 meses está aceito, com rótulo e prazo simples `97,69`. Fontes: hipótese, linhas 21–23; plano, linhas 9 e 55; tarefa 14, linhas 277–279.

**Achado 1 — Major; dimensão: dívida técnica e manutenção de longo prazo**

**Risco conceitual condicionado:** preservar propostas antigas enquanto evoluem regras, schemas e textos poderá acoplar documentos históricos à versão atual do produto. O plano identifica `engineVersion`, `schemaVersion` e o catálogo de mensagens, mas não explicita como futuras versões serão lidas sem reinterpretar silenciosamente o passado. Isso é uma decisão de evolução ainda não detalhada, não um defeito implementado. Fontes: plano, contratos, linhas 94–105; tarefa 10, linhas 227–231; desenho, seção 9, linhas 235–239.

**Salvaguardas existentes:** entradas, resultados, dados e imagens ficam congelados; o PDF é armazenado na emissão; página e PDF usam representação de apresentação comum. Isso já protege grande parte do histórico. Fontes: desenho, linhas 201, 227 e 239; plano, linhas 97–101 e 227–232.

**Requisito de manutenção proposto:** acrescentar ao futuro brief o princípio de que alterações de motor, schema ou textos não recalculam nem reinterpretam propostas emitidas. Evoluções devem declarar sua versão e conservar uma leitura compatível do histórico, sem exigir framework de plugins ou manutenção de vários motores executáveis na beta.

**Classificação:** proposta preventiva nova; não há defeito confirmado ou bloqueador de construção. Antes de evoluir o primeiro formato histórico, convém verificar que uma proposta antiga continua sendo apresentada com os dados e significados emitidos.

**Achado 2 — Major; dimensão: dívida técnica e manutenção de longo prazo**

**Risco conceitual residual:** a emissão atravessa banco, armazenamento de PDF e controle de acesso. Falhas intermediárias e retomadas podem transformar esse fluxo em uma carga manual recorrente para o único desenvolvedor se as regras de recuperação ficarem espalhadas entre serviços. O risco decorre da coordenação entre recursos, não da quantidade de usuários. Fontes: desenho, seção 1, linha 13; plano, tarefas 7 e 11, linhas 191 e 239–244.

**Salvaguardas existentes:** o plano já exige idempotência, estados `PENDING | READY | FAILED`, confirmação final das revisões, ausência de transação durante upload, retomada controlada, preservação da versão anterior e remoção de objetos órfãos. Portanto, não há ausência de estratégia de emissão nem justificativa para acrescentar infraestrutura distribuída. Fontes: plano, linha 171; “Review Focus”, linhas 39–42; tarefa 11, linhas 241–244.

**Requisito de manutenção proposto:** manter uma única responsabilidade pela transição e recuperação da emissão, com critério verificável para distinguir tentativa recuperável de objeto órfão. O procedimento operacional deve permitir reconhecer e retomar uma falha sem editar manualmente banco e arquivos. Pode ser atendido pelo serviço e roteiro já previstos; não exige fila, serviço separado ou plantão permanente. Fontes da estrutura já prevista: plano, linhas 67–70 e tarefa 15, linhas 287–295.

**Classificação:** recomendação de consolidação de uma salvaguarda existente; não é funcionalidade ausente nem novo bloqueador de construção. A demonstração de emissão segura e recuperação antes da operação já pertence ao plano, especialmente linhas 241–243 e 291–294.

**Defeitos e bloqueios**

Não identifiquei defeito conceitual confirmado que impeça começar a construir com dados controlados. As duas observações são riscos de manutenção, não autorização para reduzir modelos ou regras.

Inventário e despesas reais do pool, calendário, homologação, revisão jurídica, ambiente operacional e restauração já são condições expressas para publicação ou uso definitivo. Não são lacunas recém-descobertas nem impedimentos ao desenvolvimento controlado. Fontes: desenho, seção 11, linhas 275–289; seção 9, linha 241; plano, tarefas 14–15, linhas 278–295.

O acompanhamento manual proposto é proporcional à beta: já prevê responsável, estado, motivo da decisão, avaliação separada de pedidos e evidências sem ferramenta de analytics. Não há motivo estrutural identificado para transformar esse acompanhamento em funcionalidade do produto. Fonte: proposta de acompanhamento, linhas 43–74.
