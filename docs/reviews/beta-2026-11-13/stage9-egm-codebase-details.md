Revisão Stage 9 — Codebase Details, modo REVIEW. Documento: `docs/designs/plataforma-comercial-hoteleira-beta.md`, escopo ativo L359–716; L1–358 consultadas integralmente. Resultado: **quatro achados Major; nenhum Blocker ou Nit**. O plano ainda exige decisões de implementação nos pontos abaixo.

A inspeção confirmou o estado atual declarado: não foi identificada aplicação de produto no workspace. Os cinco documentos locais vinculados existem, assim como `Calculadora investidores.xlsx`. `landing-beta/README.md` caracteriza a landing como exploração visual com conteúdo fictício e botões sem integração. A ausência dos arquivos marcados **Create** não constitui defeito.

**CB-01 — Major — Redefinição de senha não delimita autoridade sobre identidade multivínculo**

**Alvo:** L488–501, especialmente `src/server/auth/users.ts` em L490 e seleção de múltiplos vínculos em L499. Contexto complementar: L170–174.

P06 prevê criar, desativar e redefinir o acesso da equipe dentro da empresa. Ao mesmo tempo, admite que o usuário autenticado tenha vínculos com mais de uma empresa. O desenho não distingue redefinir a credencial da identidade de restringir um vínculo empresarial, nem determina quem pode redefinir uma credencial compartilhada entre empresas.

O plano histórico também prevê redefinição assistida pelo administrador, troca obrigatória e revogação das sessões, sem resolver essa fronteira. Não há implementação existente que forneça a regra ausente.

**Consequência:** uma implementação direta pode permitir que o administrador da empresa A redefina a senha de uma identidade também vinculada à empresa B. Conhecer a senha redefinida permitiria autenticar essa identidade e selecionar seus outros vínculos. Trata-se de uma consequência possível da combinação documentada, não de vulnerabilidade demonstrada em código existente.

**Correção concreta:** separar, no contrato de `users.ts`, operações sobre vínculo e operações sobre credencial. Impedir que autoridade restrita a uma empresa redefina unilateralmente uma identidade compartilhada; documentar quem realiza essa recuperação e seu fluxo, preservando a ausência de e-mail automático. Acrescentar teste com uma identidade vinculada às empresas A e B, cobrindo redefinição, desativação local, sessões correspondentes e impossibilidade de assumir o vínculo de B.

**CB-02 — Major — Upload WebP não tem caminho definido até o PDF**

**Alvo:** L509–521 e L554–570.

P07 aceita PNG, JPEG e WebP após validação dos bytes. P10 determina incorporar imagens no PDF com pdf-lib, preservando ativos imutáveis. Falta definir como um ativo WebP aceito pelo cadastro se torna imagem incorporável pelo renderizador.

A documentação primária em cache de `PDFDocument` lista `embedJpg` e `embedPng` e especifica bytes JPEG e PNG nesses contratos: `sources/pdf-lib-api.txt`, L95–106, L320–345 e L407–432. Os exemplos pesquisados usam essas mesmas operações. O material consultado não apresenta um caminho para incorporação direta de WebP. O plano tampouco seleciona uma transformação, dependência ou representação derivada.

**Consequência:** uma imagem legitimamente cadastrada pode funcionar na interface e interromper a emissão do PDF. Resolver isso durante P10 exigiria escolher uma transformação e possivelmente acrescentar dependência além das explicitadas.

**Correção concreta:** definir antes da implementação o tratamento dos formatos aceitos. Mantendo WebP, registrar o mecanismo de conversão, sua dependência aprovada, o momento da transformação e os contratos do original e do derivado imutável, incluindo MIME, hash e referência histórica. Cobrir emissão com cada formato aceito e falha de transformação. Os testes atuais de ausência de imagem não exercitam esse caso.

**CB-03 — Major — A conexão PostgreSQL deixa uma dependência fundamental por selecionar**

**Alvo:** L369, L396–411 e L462–475. Contexto complementar: L124–131.

O plano seleciona PostgreSQL e Drizzle, mas não escolhe o cliente/driver PostgreSQL nem o adaptador Drizzle utilizado por `src/server/db/client.ts`. Não existe `package.json`, cliente de banco ou infraestrutura compartilhada no workspace que resolva essa escolha por reaproveitamento.

Isso é distinto de fixar versões durante o setup, atividade explicitamente prevista. Mesmo antes de escolher versões, permanece indefinido qual pacote executará conexões, transações e consultas em Node e quais imports serão utilizados. A documentação Better Auth consultada também demonstra por que a lista de bibliotecas precisa chegar ao nível de pacote: sua integração Drizzle exige `@better-auth/drizzle-adapter`, conforme `sources/better-auth-drizzle.txt`, L22–38.

**Consequência:** P01 não consegue produzir uma lista fechada de dependências e P05 exige uma escolha de integração durante a execução. Essa escolha afeta configuração, gestão de conexões e os testes concorrentes que dependem de conexões reais distintas.

**Correção concreta:** registrar o pacote de conexão PostgreSQL escolhido, o adaptador/import correspondente do Drizzle e suas dependências diretas. Definir o contrato mínimo de configuração e ciclo de vida das conexões em `client.ts`, incluindo como os testes obtêm conexões independentes. Preservar o ensaio futuro de integração: a escolha documental não comprova compatibilidade já validada.

**CB-04 — Major — A condição de pagamento não possui contrato suficiente para cálculo determinístico**

**Alvo:** L507, L521, L539–548. Contexto complementar: L218.

P07 deve cadastrar condições que conciliem com o preço, enquanto P09 deve gerar datas e parcelas determináveis, com ajuste residual na última parcela. Entretanto, não há schema de `PaymentPlan`, estrutura de entrada/parcelas, representação de valores ou percentuais, nem definição das datas de referência.

O plano histórico acrescenta somente a assinatura `calculatePayments(price, plan, referenceDates): PaymentSchedule` e as mesmas exigências gerais. O desenho do piloto, L170–172, também não fecha a representação. Não há contrato de código existente para reutilizar.

**Consequência:** dois implementadores podem produzir cronogramas diferentes, ambos conciliados com o preço. Podem distribuir desconto de forma diferente entre entrada e parcelas ou escolher referências temporais diferentes para seus vencimentos. A igualdade do total não demonstra correção da condição comercial.

**Correção concreta:** publicar o schema da condição e do cronograma resultante, determinando valores fixos ou percentuais, distribuição do preço negociado, referência das datas, ordenação e aplicação do resíduo. Caso exista recorrência mensal, definir sua regra de fim de mês; caso as datas sejam sempre explícitas, declarar essa restrição. Incluir um exemplo completo com desconto, entrada, parcelas, vencimentos e centavo residual, além dos casos inválidos.

**Manifesto real de leitura e busca**

- Persona `agents/codebase_details.md` e `implementation-readiness-standard.md`: leitura integral.
- Documento-alvo: leitura integral de L1–716. Uma saída agregada apresentou truncamento; os trechos necessários foram recuperados em blocos, sem lacuna no escopo ativo.
- `review_context.json`: leitura integral do manifesto e política de fontes.
- Plano histórico: leitura contínua de L1–107 e L269–299; buscas dirigidas no restante por contratos, dependências, autenticação, persistência, pagamento e emissão. Foram consultados os resultados dessas buscas, sem alegação de leitura integral.
- Desenho do piloto: leitura contínua de L100–228 e resultados de buscas dirigidas. DT-01: leitura integral.
- `concepts_brief.md` e RFC: somente resultados das buscas dirigidas; não foram relidos integralmente.
- Fontes em cache: leitura de `better-auth-drizzle.txt`, L1–56, e dos trechos indicados de `pdf-lib-api.txt`; buscas em Next deploying/authentication, exemplos pdf-lib e gravações condicionais S3. Os outros cinco arquivos externos disponíveis não foram consultados.
- XLSX: inspeção estática do ZIP/XML, metadados, valores e fórmulas selecionados das folhas HOME, QUARTOS, DESPESAS OPERACIONAIS e CALCULADORA. Os valores salvos do FINAL 07 confirmam receita `93145.031847…`, resultado `61173.277070…` e prazo descontado `73.689714…`. Não houve recálculo de fórmulas nem homologação comercial.

Foram utilizados inventário de arquivos, buscas textuais e leitura estática. Diretórios internos e HTML de revisão não foram tratados como produto. Não foram lidos relatórios de outros revisores, executados testes/builds/migrações, instaladas dependências ou alterados arquivos. As conclusões externas limitam-se às fontes primárias em cache; não comprovam compatibilidade de versões ou provedores futuros.
