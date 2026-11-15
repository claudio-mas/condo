Status: resolved

# Goldfish Annotated Review Report

**Target:** [desenho formal](docs/designs/plataforma-comercial-hoteleira-beta.md) (`full file`; 937 linhas após resolução).

**Data:** 2026-11-14. **FindingsList:** [revisão consolidada F-01–F-15](consolidated_review_report.md).

**Autorização:** instrução personalizada do solicitante para aplicar os 15 ajustes, com decisões por achado. Aplicado o ramo “Custom instruction / Out-of-band edit” de [egm-resolve](/home/claudio/.codex/plugins/cache/egm/egm/0.1.1/skills/egm-resolve/SKILL.md): “If the user provides targeted instructions, apply them and proceed.” Não foi aberta nova votação sobre decisões já fornecidas.

**Resultado documental:** 15 correções aceitas e aplicadas (13 Major, 2 Nit); 0 CONTEST, 0 ESCALATE, 0 DECLINE e 0 achados F-01–F-15 sem tratamento. Todos foram classificados como PROPOSE FIX, inclusive os dois Nits expressamente solicitados. Isso não constitui nova revisão Goldfish independente, build do produto ou homologação comercial.

**SHA-256 anterior:** `0ad5f486ddc551e1675db1481d3e399b4663f7ee687b30269b1e922ac8d8e60c`.

**SHA-256 atualizado:** `0d4712ad2080484f3673acdb1dbbf353b617d016b65410c2a631d91f1f46bce6`.

Os escopos originais abaixo pertencem à revisão de 716 linhas. As localizações atuais apontam para o documento atualizado. Os pareceres originais, seu estado e o relatório consolidado permanecem registros históricos, sem alteração retroativa de conclusões.

## Prioritized Findings & AI Suggestions

### F-01 — Autoridade de credenciais da identidade multivínculo [`S8/IZ-02, S9/CB-01`] - Severity: Major

* **Affected Scope:** linhas originais 170–176, 182 e 488–501; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L171) (3. Identidade).
* **Discrepancy Description:** O plano admite uma identidade com vínculos em várias empresas e redefinição administrativa de acesso por empresa, mas não separa a autoridade sobre a credencial compartilhada da autoridade sobre o vínculo. Se a administração de A puder redefinir e conhecer a senha dessa identidade, poderá potencialmente assumir seus vínculos em B. As verificações comerciais de `companyId` não resolvem essa passagem pela identidade autenticada.
* **Rationale:** definir os contratos de administração do vínculo, recuperação da identidade e revogação de sessões. Impedir redefinição unilateral de identidade compartilhada por autoridade restrita a uma empresa. Exigir caso com a mesma identidade em A e B, demonstrando que administração e desativação locais não permitem assumir B. Trata-se de uma lacuna do contrato; não foi demonstrada vulnerabilidade em produto existente.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Separadas identidade global, vínculo e sessões locais. Removida redefinição administrativa. Incluídos ativação e recuperação pelo titular, e-mail SMTP, revogação global após recuperação e testes com identidade compartilhada A/B. A escolha de `nodemailer` concretiza o transporte necessário, sem contratar provedor.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 171; manifesto dos pacotes afetados.
  * Change: Separadas identidade global, vínculo e sessões locais. Removida redefinição administrativa. Incluídos ativação e recuperação pelo titular, e-mail SMTP, revogação global após recuperação e testes com identidade compartilhada A/B. A escolha de `nodemailer` concretiza o transporte necessário, sem contratar provedor.

Texto resultante (trecho literal):

> A redefinição de senha ocorre exclusivamente por recuperação enviada ao e-mail verificado do próprio titular, com token de uso único, validade limitada, respostas genéricas e limitação de tentativas. Ao concluir, revoga todas as sessões globais e tokens de recuperação anteriores; o usuário faz novo login e os vínculos são revalidados. A seleção de vínculo da sessão é controlada pelo servidor, sem promover uma sessão de A para B por alteração de payload. Alterações de papel/desativação revogam as sessões locais correspondentes e continuam sendo conferidas a cada operação.

### F-02 — Autorização e credenciais após restauração [`S7/D-01, S8/IZ-01`] - Severity: Major

* **Affected Scope:** linhas originais 170–182, 274–278, 488–501 e 670–674; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L390) (10. Atualizações).
* **Discrepancy Description:** O procedimento cobre links públicos, mas um backup também pode reativar sessões, vínculos, papéis e senhas anteriores a uma revogação. Invalidar sessões não basta se a credencial antiga permitir novo login.
* **Rationale:** ampliar manutenção e condição de reabertura à área autenticada; invalidar sessões restauradas e reconciliar ou recuperar conservadoramente credenciais e autorizações. Ensaiar backup anterior à desativação de um usuário e à redefinição de uma senha. Demonstrar que sessão, senha substituída e vínculo desativado não restabelecem autorização indevida.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Manutenção cobre acesso autenticado e público. Invalida todas as sessões/tokens restaurados, exige recuperação de credenciais, reconcilia e-mail/vínculo/papel e conserva bloqueados os não confirmados. P15 inclui comando `reconcile:access`, estados de manutenção, integrações e ensaios de senha/vínculo anteriores ao backup.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 390; manifesto dos pacotes afetados.
  * Change: Manutenção cobre acesso autenticado e público. Invalida todas as sessões/tokens restaurados, exige recuperação de credenciais, reconcilia e-mail/vínculo/papel e conserva bloqueados os não confirmados. P15 inclui comando `reconcile:access`, estados de manutenção, integrações e ensaios de senha/vínculo anteriores ao backup.

Texto resultante (trecho literal):

> Além dos links, invalidar incondicionalmente todas as sessões autenticadas restauradas e todos os tokens pendentes de ativação/recuperação antes de qualquer reabertura. Reconciliar identidades, e-mails verificados, vínculos, papéis e desativações com uma trilha confiável posterior ao backup. Uma senha antiga não pode voltar a autorizar login: marcar credenciais restauradas como exigindo recuperação pelo e-mail confirmado do titular e rejeitar o login com a senha restaurada até sua substituição. Mesmo uma identidade já recuperada não ganha autorização comercial até seu vínculo e papel serem revalidados.

### F-03 — Colisão da rota raiz [`S5/ZO-01, S9/IR-01`] - Severity: Major

* **Affected Scope:** linhas originais 613 e 617; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L371) (9. Contratos).
* **Discrepancy Description:** `src/app/page.tsx` e `src/app/(staff)/page.tsx` representam a mesma URL `/` no App Router. Executar o manifesto literalmente produz uma colisão na composição da aplicação.
* **Rationale:** manter uma única página para `/`, definindo uma rota explícita para a área autenticada ou consolidando os comportamentos. Atualizar manifesto, navegação e destinos de encaminhamento. Conferir entrada anônima/autenticada e build sem colisão.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. `src/app/page.tsx` é o único proprietário de `/`; início autenticado em `src/app/(staff)/dashboard/page.tsx`. Manifestos P06/P13, destinos de encaminhamento e navegação foram alinhados.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 371; manifesto dos pacotes afetados.
  * Change: `src/app/page.tsx` é o único proprietário de `/`; início autenticado em `src/app/(staff)/dashboard/page.tsx`. Manifestos P06/P13, destinos de encaminhamento e navegação foram alinhados.

Texto resultante (trecho literal):

> Rotas propostas: `/` como única entrada pública/redirecionador (`src/app/page.tsx`), `/entrar`, `/recuperar-senha`, `/trocar-senha`, `/dashboard` (`src/app/(staff)/dashboard/page.tsx`) como início autenticado, áreas administrativas e comerciais sob sessão, `/api/auth/[...all]` para o mecanismo de identidade, `/p/[token]` para consulta externa e `/p/[token]/pdf` para download. Não haverá endpoint público para cadastrar empresas, confirmar contratação ou reservar unidade. A autenticação não concede autorização comercial por si só.

### F-04 — Contrato das condições de pagamento [`S9/IR-02, S9/CB-04`] - Severity: Major

* **Affected Scope:** linhas originais 383, 390 e 507–548; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L227) (Condições de pagamento).
* **Discrepancy Description:** Conciliação do total e datas determináveis não definem os modelos aceitos, entrada, parcelas, percentuais ou valores, referências de vencimento e distribuição do desconto. Duas implementações podem fechar o mesmo preço e gerar cronogramas diferentes.
* **Rationale:** registrar schema de condição e cronograma, modelos suportados, validações, datas e algoritmo de resíduo. Se datas forem sempre explícitas, declarar isso; se houver recorrência, definir fim de mês e referência temporal. Incluir exemplo completo com desconto, entrada, parcelas, vencimentos e centavo residual, além dos casos inválidos.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Incluídos JSON Schema 2020-12 de PaymentPlan/PaymentSchedule, dinheiro textual, datas explícitas, validações aritméticas e civis adicionais e exemplo integral. Desconto de 5% sobre R$ 100.000,00 resulta em R$ 95.000,00; entrada de R$ 10.000,00, parcelas de R$ 28.333,34/R$ 28.333,33/R$ 28.333,33 e resíduo de R$ 0,01 na primeira. Alternativa explícita aplica o resíduo na entrada. P09 deixa de indicar ajuste na última parcela.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 227; manifesto dos pacotes afetados.
  * Change: Incluídos JSON Schema 2020-12 de PaymentPlan/PaymentSchedule, dinheiro textual, datas explícitas, validações aritméticas e civis adicionais e exemplo integral. Desconto de 5% sobre R$ 100.000,00 resulta em R$ 95.000,00; entrada de R$ 10.000,00, parcelas de R$ 28.333,34/R$ 28.333,33/R$ 28.333,33 e resíduo de R$ 0,01 na primeira. Alternativa explícita aplica o resíduo na entrada. P09 deixa de indicar ajuste na última parcela.

Texto resultante (trecho literal):

> Exemplo completo: preço de tabela R$ 100.000,00, desconto autorizado de 5% (`0.05`) = R$ 5.000,00, líquido R$ 95.000,00. Entrada R$ 10.000,00 em `2026-12-01`. Restam R$ 85.000,00 para três parcelas explicitamente datadas em `2027-01-15`, `2027-02-15` e `2027-03-15`. A divisão em centavos dá R$ 28.333,33 por parcela e sobra R$ 0,01. Aplicar à primeira: R$ 28.333,34 + R$ 28.333,33 + R$ 28.333,33 + entrada de R$ 10.000,00 = R$ 95.000,00.

### F-05 — Matriz de estados da recuperação de emissão [`S9/IR-03`] - Severity: Major

* **Affected Scope:** linhas originais 470, 480, 578 e 588–594; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L329) (Matriz normativa).
* **Discrepancy Description:** Posse temporária e proteção contra executor antigo estão previstas, mas falta definir quando uma falha mantém `PENDING`, produz `FAILED`, permite retomada ou exige nova solicitação. O comportamento após esgotar tentativas também não está fechado.
* **Rationale:** criar matriz de evento, condição, transição persistida, código de falha e ação disponível. Testar falha transitória, conflito comercial definitivo, esgotamento e consulta de execução ainda ativa. Não é preciso inventar limites operacionais de produção para definir essas transições.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Incluída matriz de eventos/condições/transições/códigos/ações. PENDING permite retomada limitada com posse; READY não regride; FAILED é terminal e requer nova solicitação. Esgotamento, executor antigo, commit com resposta perdida e falha sem banco têm tratamento explícito.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 329; manifesto dos pacotes afetados.
  * Change: Incluída matriz de eventos/condições/transições/códigos/ações. PENDING permite retomada limitada com posse; READY não regride; FAILED é terminal e requer nova solicitação. Esgotamento, executor antigo, commit com resposta perdida e falha sem banco têm tratamento explícito.

Texto resultante (trecho literal):

> O estado da emissão é somente `PENDING`, `READY` ou `FAILED`; revogação, vencimento e substituição são estados independentes de acesso de uma versão `READY`. Antes da reserva não existe emissão persistida. `FAILED` é terminal para a mesma chave: nova emissão exige nova intenção confirmada e nova chave; não altera o snapshot anterior. Cada aquisição de posse consome uma tentativa, inclusive a interrompida. Persistir `attemptCount`, limite aplicado na reserva, `leaseVersion`, `leaseExpiresAt`, etapa, `errorCode`, ocorrência e `nextRetryAt` quando cabível. O limite é inteiro positivo; seu valor de produção será definido no ensaio, sem alterar a semântica abaixo.

### F-06 — Tratamento de WebP no PDF [`S9/IR-04, S9/CB-02`] - Severity: Major

* **Affected Scope:** linhas originais 369, 509–521 e 554–570; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L654) (P07).
* **Discrepancy Description:** O upload aceita WebP; os contratos de imagem do pdf-lib consultados nas fontes primárias em cache documentam JPEG e PNG. O plano não seleciona transformação ou outro comportamento explícito para o formato aceito.
* **Rationale:** decidir se haverá conversão, restrição ou omissão deliberada, com comportamento informado e verificável. Mantendo conversão, definir dependência, momento, MIME, hashes e referência imutável do derivado. Testar proposta com cada formato aceito e falha da transformação. Não presumir que continuar sem imagem opcional resolve o tratamento normal do WebP.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. WebP estático é convertido por sharp no upload, antes de persistir, para PNG privado imutável. MIME, hash SHA-256 e referência são do derivado. Falha não substitui ativo anterior nem salva imagem incompleta. P07/P10 verificam formatos, limites, transformação e incorporação no PDF.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 654; manifesto dos pacotes afetados.
  * Change: WebP estático é convertido por sharp no upload, antes de persistir, para PNG privado imutável. MIME, hash SHA-256 e referência são do derivado. Falha não substitui ativo anterior nem salva imagem incompleta. P07/P10 verificam formatos, limites, transformação e incorporação no PDF.

Texto resultante (trecho literal):

> Se decodificação/conversão falhar, retornar `IMAGE_CONVERSION_FAILED` com ocorrência e orientação para reenviar PNG/JPEG ou corrigir WebP; falhas de limite/formato usam `IMAGE_LIMIT_EXCEEDED`/`IMAGE_FORMAT_UNSUPPORTED`. Não persistir WebP bruto nem substituir a referência anterior, não salvar ativo incompleto e não omitir silenciosamente imagem aceita. Se upload do PNG falhar, devolver `IMAGE_STORAGE_FAILED`, manter o ativo anterior e tratar eventual objeto sem vínculo como órfão. Testar PNG, JPEG, WebP transparente convertido, bytes inválidos, WebP animado, PNG derivado acima do limite e indisponibilidade do sharp/storage; conferir MIME/hash do derivado e presença da imagem no PDF no P10. Objeto já existente não é sobrescrito: conferir hash para reconhecer repetição idêntica ou recusar diferença. A implementação S3 usa a precondição documentada de [gravação condicional](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html), cuja disponibilidade deve ser ensaiada no provedor efetivo. Não presumir que um mock prova compatibilidade de todo serviço S3.

### F-07 — Cliente PostgreSQL e dependências diretas [`S9/CB-03`] - Severity: Major

* **Affected Scope:** linhas originais 124–131, 369, 396–411 e 462–475; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L620) (**Cliente e ciclo).
* **Discrepancy Description:** PostgreSQL e Drizzle estão escolhidos, mas falta o cliente/driver e a integração concreta de `client.ts`. Não há implementação anterior para fornecer essa escolha. Isso é diferente de fixar mecanicamente versões no setup.
* **Rationale:** fechar a matriz de pacotes, incluindo driver e adaptadores necessários, configuração e ciclo de vida das conexões. Especificar como os testes obtêm conexões reais distintas e como são encerradas. A escolha documental não substitui o ensaio futuro de compatibilidade.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Selecionados `pg`, `drizzle-orm/node-postgres` e `@better-auth/drizzle-adapter`. P05 especifica pool, parâmetros, transação no mesmo cliente, release/end e dois clientes simultâneos com backend distinto para concorrência em banco isolado.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 620; manifesto dos pacotes afetados.
  * Change: Selecionados `pg`, `drizzle-orm/node-postgres` e `@better-auth/drizzle-adapter`. P05 especifica pool, parâmetros, transação no mesmo cliente, release/end e dois clientes simultâneos com backend distinto para concorrência em banco isolado.

Texto resultante (trecho literal):

> **Cliente e ciclo de conexões:** `client.ts` importa `Pool` de `pg` e `drizzle` de `drizzle-orm/node-postgres`; cria `new Pool({ connectionString, max, idleTimeoutMillis, connectionTimeoutMillis, ssl })` a partir de ambiente validado e `drizzle({ client: pool, schema })`. Validar `DATABASE_POOL_MAX`, `DATABASE_IDLE_TIMEOUT_MS` e `DATABASE_CONNECT_TIMEOUT_MS` como inteiros positivos e `DATABASE_SSL` conforme ambiente; os exemplos locais usam `max=10`, `idleTimeoutMillis=30000`, `connectionTimeoutMillis=5000`, sem representar capacidade contratada. TLS operacional valida certificado; não usar `rejectUnauthorized: false` como solução genérica. Uma instância por processo, reaproveitada no hot reload, sem criar pool por requisição. Em transação, reservar um cliente e executar todas as consultas nesse cliente; liberar em `finally`, com rollback antes de liberar após erro. `pool.on('error')` produz diagnóstico sem segredos. Comandos encerram com `await pool.end()` em `finally`; o runtime drena no desligamento controlado, não a cada requisição. Ver [ciclo do pool node-postgres](https://node-postgres.com/features/pooling).

### F-08 — Mudanças em arquivos de fases anteriores [`S9/IR-05`] - Severity: Major

* **Affected Scope:** linhas originais 365, 588 e 674; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L729) (P11).
* **Discrepancy Description:** P11 exige coordenação com serviços de preços, vigência e desativação criados em P06–P08. P15 exige conectar manutenção à emissão e à consulta criadas em P11–P12. As tabelas de cada fase contêm somente Create, sem as alterações posteriores correspondentes.
* **Rationale:** adicionar ações Modify precisas aos pacotes consumidores ou antecipar os contratos e conexões nas fases produtoras. Conferir que a lista de arquivos permitidos por fase contém toda mudança exigida pelo texto, não apenas que o arquivo aparece em algum lugar do manifesto global.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Acrescentados Modify em P06, P07, P08, P09, P11, P13 e P15 para navegação, coordenação de escrita, integração de UI e manutenção. Toda modificação referencia arquivo criado em fase anterior, com exceção explícita do `.gitignore` já entregue.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 729; manifesto dos pacotes afetados.
  * Change: Acrescentados Modify em P06, P07, P08, P09, P11, P13 e P15 para navegação, coordenação de escrita, integração de UI e manutenção. Toda modificação referencia arquivo criado em fase anterior, com exceção explícita do `.gitignore` já entregue.

Texto resultante (trecho literal):

> **Reserva e concorrência:** calcular o fingerprint a partir do comando normalizado, contexto do dono e revisões solicitadas. Após verificar o direito de acesso, procurar a chave existente antes de recalcular: mesma chave e comando de uma emissão pronta devolvem sua referência original, mesmo que o rascunho ou catálogo tenham evoluído; isso não autoriza reemitir nem alterar o documento. Conteúdo diferente conflita. Na reserva nova, usar unicidade e transação para obter ou criar a emissão, alocar número/versão e congelar conteúdo. Na confirmação, bloquear os registros de autorização e estado relevantes numa ordem estável, com IDs ordenados dentro do mesmo grupo; conferir vínculo, catálogo, premissas, rascunho, série atual e tentativa antes de atualizar o ponteiro. Escritas de preços, vigência e desativação devem coordenar os mesmos registros para não contornar a conferência. Transação nenhuma atravessa geração ou upload.

### F-09 — Compilação das fases intermediárias de interface [`S9/IR-06`] - Severity: Major

* **Affected Scope:** linhas originais 396, 491–494, 513–517, 529, 542–545, 581–583, 601–602, 611 e 616; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L529) (P01).
* **Discrepancy Description:** Páginas são criadas a partir de P06, mas a estrutura mínima global e o layout autenticado ficam em P13, quando o plano exige o primeiro build completo. A integração pode acumular problemas durante vários pacotes.
* **Rationale:** antecipar a estrutura mínima antes da primeira página e estabelecer compilação apropriada nos checkpoints que introduzem UI. Manter o acabamento e os E2E completos em P13, ajustando o manifesto e as dependências entre fases.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Estrutura mínima global antecipada para P01; layout autenticado, shell e dashboard criados no P06 antes das páginas comerciais. P13 passa a modificar a estrutura anterior. Typecheck/build exigidos em todas as fases depois da estrutura mínima, sem importação antecipada de serviços futuros.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 529; manifesto dos pacotes afetados.
  * Change: Estrutura mínima global antecipada para P01; layout autenticado, shell e dashboard criados no P06 antes das páginas comerciais. P13 passa a modificar a estrutura anterior. Typecheck/build exigidos em todas as fases depois da estrutura mínima, sem importação antecipada de serviços futuros.

Texto resultante (trecho literal):

> **Verificação do pacote:** `1.234,56` vira `1234.56`; texto inválido é recusado; `0.1 + 0.2` apresenta `0.30` e `1.005` apresenta `1.01`. Ocupação maior que um e meses descontados não inteiros/positivos são recusados. Rodar os testes unitários afetados, typecheck e `npm run build` da estrutura mínima. Cada pacote posterior executa typecheck e build sobre a aplicação acumulada, usando apenas dependências já entregues. Isso inclui P06–P13 ao introduzir/alterar UI e P14–P15 ao integrar dados e operação. Acessos a banco/segredos de runtime são adiados para requisições, sem consultas na geração estática; os testes de integração usam configuração isolada.

### F-10 — Horário atual por requisição pública [`S9/IS-02`] - Severity: Major

* **Affected Scope:** linhas originais 249–251, 592 e 605; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L355) (8. Consulta).
* **Discrepancy Description:** “Página e download usam o mesmo instante” pode significar reutilizar no download um horário capturado na abertura da página, mesmo após vencer a proposta. O resolvedor comum está definido; a relação temporal entre requisições não está clara.
* **Rationale:** declarar horário atual do servidor por requisição. Reservar um instante igual para testes comparativos do resolvedor, quando necessário. Testar abrir antes do vencimento e solicitar download depois, sem reaproveitar autorização temporal antiga.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Cada requisição da página e do download captura horário atual do servidor. Instante igual existe apenas em testes comparativos. Incluído caso de página aberta antes do vencimento com download posterior recusado.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 355; manifesto dos pacotes afetados.
  * Change: Cada requisição da página e do download captura horário atual do servidor. Instante igual existe apenas em testes comparativos. Incluído caso de página aberta antes do vencimento com download posterior recusado.

Texto resultante (trecho literal):

> Página e download passam pelo mesmo resolvedor de autorização pública, e cada requisição captura o horário atual do servidor e revalida estado e validade antes de liberar conteúdo. O download não recebe nem reaproveita timestamp, autorização temporal ou decisão capturados na abertura da página. Um relógio injetado com o mesmo instante serve apenas a testes comparativos determinísticos; não é uma autorização compartilhada entre requisições. A validade é registrada como instante final derivado da data civil e do fuso do empreendimento. O arquivo privado não é exposto por URL permanente.

### F-11 — Preservação da versão versus validade de acesso [`S7/S-01`] - Severity: Major

* **Affected Scope:** linhas originais 94, 243–246 e 350; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L92) (CUJ 2).
* **Discrepancy Description:** A garantia de que a proposta anterior continua válida até concluir a substituição conflita, por leitura literal, com vencimento ou revogação independentes. Preservar a versão não significa manter seu acesso público válido.
* **Rationale:** dizer que uma tentativa não marca a anterior como substituída; a consulta continua sujeita a todas as restrições. Ensaiar expiração e revogação enquanto a reemissão ainda está interrompida.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. CUJ2, recomendação R3, P11 e P12 distinguem não substituir a versão anterior de autorizar seu acesso. Expiração/revogação continuam independentes, inclusive enquanto a reemissão está PENDING ou falhou.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 92; manifesto dos pacotes afetados.
  * Change: CUJ2, recomendação R3, P11 e P12 distinguem não substituir a versão anterior de autorizar seu acesso. Expiração/revogação continuam independentes, inclusive enquanto a reemissão está PENDING ou falhou.

Texto resultante (trecho literal):

> - **Then:** o servidor recalcula, valida acesso e condições e publica uma única versão pronta por solicitação idempotente. Link e PDF representam o mesmo conteúdo. Mudanças concorrentes indicam o que precisa ser revisto; falhas técnicas preservam o rascunho e permitem tentativa controlada. Uma emissão em andamento ou falha não marca a proposta anterior como substituída. Sua consulta continua sujeita, independentemente, à expiração, revogação e demais restrições de acesso.

### F-12 — Autossuficiência das referências legadas [`S6/C-01`] - Severity: Major

* **Affected Scope:** linhas originais 630–642; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L802) (P14).
* **Discrepancy Description:** P14 fornece resultados de FINAL 07 e cita diárias do FINAL 03, fevereiro e fim de semana sem explicar localmente as identidades, entradas e discrepâncias a conferir. O leitor novo não consegue reconstruir o significado do caso apenas pelos valores de saída.
* **Rationale:** identificar a origem dos dois casos, resumir entradas e verificações e tornar inequívoca a referência ao desenho do piloto. Separar comparação sintética das pendências reais do pool. A inspeção estática posterior confirmou valores salvos na planilha; não recalculou suas fórmulas e não substitui essa definição do caso nem a homologação.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. P14 identifica códigos, abas e células; transcreve períodos, noites, ocupação, tarifas exatas por razões e despesas do FINAL 07, com fórmulas e saídas. Expõe as oito tarifas do FINAL 03 e seu estado não homologado. Separa referência aritmética sintética de 2024 das inconsistências de fevereiro/fim de semana da origem e do pool real pendente.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 802; manifesto dos pacotes afetados.
  * Change: P14 identifica códigos, abas e células; transcreve períodos, noites, ocupação, tarifas exatas por razões e despesas do FINAL 07, com fórmulas e saídas. Expõe as oito tarifas do FINAL 03 e seu estado não homologado. Separa referência aritmética sintética de 2024 das inconsistências de fevereiro/fim de semana da origem e do pool real pendente.

Texto resultante (trecho literal):

> **FINAL 07 — comparação aritmética individual controlada:** QUARTOS!E12:P12 identifica unidade LUXO, investimento e venda de R$ 498.000,00. O comparativo reproduz CALCULADORA!B3, G6:J19 e K25:K30, usando tarifas proporcionais fixas de alta `1200 × 498000 / 628000 = 951.592356687898089…` BRL/noite e baixa `650 × 498000 / 628000 = 515.445859872611464…` BRL/noite, iguais nas quatro categorias em cada temporada. `1200` e `650` são as bases salvas do FINAL 09 em CALCULADORA!E33:F33; a razão é somente a origem dessa referência legada, não participação no pool. Registrar essas duas razões como entradas exatas da fixture e calcular com a precisão do motor, sem reproduzir dependência circular por MAX ou usar os valores de exibição arredondados como entrada.

### F-13 — Versionamento de arquivos gerados [`S9/IS-01`] - Severity: Major

* **Affected Scope:** linhas originais 365, 401 e 474–475; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L483) (Alcance e convenções).
* **Discrepancy Description:** A exclusão genérica de arquivos gerados de instalação/build pode alcançar lockfile e metadados de migração previstos como entregáveis. A origem automática do arquivo não basta para decidir seu versionamento.
* **Rationale:** excluir explicitamente dependências instaladas, saídas de build, segredos, PDFs e backups; preservar lockfile e metadados declarados. Conferir coerência entre essa regra, `.gitignore`, manifesto e instalação reproduzível.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Criado `.gitignore` real e alinhado P01: exclui dependências, builds, `.env`, armazenamento/PDFs gerados e backups; preserva explicitamente `.env.example`, package-lock e metadados Drizzle. Lockfile e migrações são entregáveis versionados obrigatórios.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 483; manifesto dos pacotes afetados.
  * Change: Criado `.gitignore` real e alinhado P01: exclui dependências, builds, `.env`, armazenamento/PDFs gerados e backups; preserva explicitamente `.env.example`, package-lock e metadados Drizzle. Lockfile e migrações são entregáveis versionados obrigatórios.

Texto resultante (trecho literal):

> Os quinze pacotes abaixo constituem uma única sequência de implementação. Cada tabela enumera os arquivos do pacote e a finalidade de cada um. As ações **Create** identificam a primeira criação; **Modify** autoriza a alteração explícita de arquivo entregue por fase anterior. A lista de cada fase é seu manifesto de escrita, incluindo integrações posteriores. Não há exclusões previstas. O `.gitignore` já é entregue nesta resolução documental e aparece como **Modify** no P01. Ao executar um pacote, confirmar antes se algum arquivo passou a existir e preservar alterações legítimas; diferenças materiais exigem atualizar o manifesto. Excluir do versionamento `node_modules/`, `.next/`, `out/`, `dist/`, `build/`, arquivos `.env` e `.env.*` (exceto `.env.example`), PDFs gerados, armazenamento privado e backups. A regra não abrange todos os gerados: **versionar obrigatoriamente `package-lock.json`, migrações SQL e os metadados gerados de migração em `drizzle/meta/`**, inclusive snapshots e `_journal.json`. O `.gitignore` deve manter essas exceções explícitas; `npm ci` e a geração incremental de migrações dependem delas.

### F-14 — Definição e unidade do payback [`S7/S-02, S9/IS-04`] - Severity: Nit

* **Affected Scope:** linhas originais 20, 206, 443 e 642; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L22) (Os modelos individual).
* **Discrepancy Description:** Definir no primeiro uso que o prazo ajustado subtrai os meses publicados do payback simples e escrever a unidade meses junto dos resultados numéricos. Os dois achados são agrupados por finalidade editorial; não são uma alegação de erro aritmético ou uma mudança da regra aprovada.
* **Rationale:** Definir no primeiro uso que o prazo ajustado subtrai os meses publicados do payback simples e escrever a unidade meses junto dos resultados numéricos. Os dois achados são agrupados por finalidade editorial; não são uma alegação de erro aritmético ou uma mudança da regra aprovada.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. Primeira menção define prazo simples e subtração dos meses publicados. Política geral e exemplos P03/P14 passam a explicitar a unidade meses, sem mudar a regra de 24 meses.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 22; manifesto dos pacotes afetados.
  * Change: Primeira menção define prazo simples e subtração dos meses publicados. Política geral e exemplos P03/P14 passam a explicitar a unidade meses, sem mudar a regra de 24 meses.

Texto resultante (trecho literal):

> Os modelos individual e pool permanecem no escopo. O primeiro empreendimento utilizará pool com participação proporcional aos valores de venda de referência, registrados nas premissas publicadas. Alterações de preço e descontos não mudarão automaticamente essa participação. O payback simples é o investimento dividido pelo resultado anual positivo, multiplicado por 12 meses. O payback ajustado subtrai desse prazo os meses definidos nas premissas publicadas; para o primeiro cliente, `payback ajustado = payback simples − 24 meses`. A apresentação identifica a regra e mostra também o prazo simples; quando a recuperação ocorre dentro da dedução, apresenta o motivo correspondente em vez de prazo negativo ou zero enganador. Essas são decisões existentes, não novas escolhas deste rascunho.

### F-15 — Viewport responsivo reproduzível [`S9/IS-03`] - Severity: Nit

* **Affected Scope:** linhas originais 628; [localização atual](docs/designs/plataforma-comercial-hoteleira-beta.md#L800) (**Verificação do pacote:** executar as cinco CUJs).
* **Discrepancy Description:** Substituir a categoria genérica tablet por dimensões/orientação ou por um projeto Playwright que as fixe. Declarar que 1440 px e 390 px são larguras de viewport. O critério deve ser reproduzível sem escolher um modelo comercial de aparelho.
* **Rationale:** Substituir a categoria genérica tablet por dimensões/orientação ou por um projeto Playwright que as fixe. Declarar que 1440 px e 390 px são larguras de viewport. O critério deve ser reproduzível sem escolher um modelo comercial de aparelho.
* ***AI Suggestion:*** PROPOSE FIX
* ***Justification:*** Achado válido; diretriz explícita do solicitante. P13 e roteiro P14 fixam 1440×900, 768×1024 retrato e 390×844 em CSS pixels. Esclarecidas as larguras de 1440 px e 390 px.
* ***Proposed Edit:*** aplicada.
  * Location: seção acima, linha atual 800; manifesto dos pacotes afetados.
  * Change: P13 e roteiro P14 fixam 1440×900, 768×1024 retrato e 390×844 em CSS pixels. Esclarecidas as larguras de 1440 px e 390 px.

Texto resultante (trecho literal):

> **Verificação do pacote:** executar as cinco CUJs com dados controlados. O navegador não inventa nova chave em cada retry da mesma intenção; após recarregar, recupera a emissão associada ao rascunho autorizado. Conferir viewports fixos em CSS pixels: `1440×900` (largura 1440 px), `768×1024` em retrato e `390×844` (largura 390 px), teclado, nomes extensos, erros de campo, perda do pool e ausência de imagem. O administrador distingue os três conjuntos do pool. Geração da proposta e envio efetivo continuam ações distintas. Rodar build, typecheck, lint e os E2E afetados após a integração.

## Alterações exatas e verificação

O [patch completo](docs/reviews/beta-2026-11-14-resolution/changes.patch) preserva todas as substituições, inclusões e movimentações do desenho e a criação do [.gitignore](.gitignore), inclusive schemas e tabelas integrais.

A [evidência de verificação](docs/reviews/beta-2026-11-14-resolution/verification.json) registra estrutura Markdown, JSON Schema/exemplo, valores de referência, ordem do manifesto, ausência de colisões no mapa de rotas e regras reais do `.gitignore`. Os testes do `.gitignore` usam um repositório temporário em `/tmp`; este workspace não foi inicializado como repositório Git.

A verificação é documental. Não foram executados npm, build da aplicação, migrações, envio de e-mail ou testes de um produto implementado. Os aceites futuros permanecem nos pacotes. Dados reais, responsáveis, calendário/tarifas do empreendimento e operação do pool continuam sujeitos à homologação comercial já prevista.

Fontes técnicas primárias adicionais consultadas em 2026-11-14: [pool node-postgres](https://node-postgres.com/features/pooling), [Drizzle/node-postgres](https://orm.drizzle.team/docs/get-started-postgresql), [adaptador Better Auth](https://better-auth.com/docs/adapters/drizzle), [recuperação Better Auth](https://better-auth.com/docs/authentication/email-password), [sharp PNG](https://sharp.pixelplumbing.com/api-output/#png) e [SMTP Nodemailer](https://nodemailer.com/smtp). Elas sustentam os contratos selecionados, sem substituir o ensaio futuro com versões fixadas.
