# Stage 9 — Implementation Readiness

**Resultado: FAIL pelo padrão de zero decisões de desenho.** O plano apresenta boa decomposição funcional, arquivos futuros identificados e verificações relevantes, mas ainda exige decisões sobre contratos comerciais, recuperação e integração entre pacotes. Há também uma colisão concreta no manifesto de rotas.

**Achados: 0 Blocker, 6 Major, 0 Nit.** As referências abaixo apontam para `docs/designs/plataforma-comercial-hoteleira-beta.md`.

## IR-01 — Major — Duas páginas ocupam a rota `/`

**Escopo e evidência:** P13, linhas **613 e 617**: criação simultânea de `src/app/page.tsx` e `src/app/(staff)/page.tsx`, respectivamente para encaminhamento inicial e área autenticada.

O grupo `(staff)` não acrescenta um segmento à URL. Portanto, os dois arquivos representam `/`. O implementador precisa escolher outra rota para uma das páginas ou fundir seus comportamentos, alterando o manifesto aprovado.

**Consequência:** a estrutura não permite concluir o build previsto nas linhas 628 e 688 sem corrigir o desenho de navegação.

**Correção e aceite:** definir um único proprietário para `/` e um caminho distinto, se necessário, para a página inicial autenticada; atualizar os caminhos, destinos de encaminhamento e testes. O aceite deve conferir a tabela de rotas, o acesso anônimo, o acesso autenticado e o build sem colisão.

## IR-02 — Major — O contrato das condições de pagamento continua delegado à implementação

**Escopo e evidência:** linhas **383, 390, 507, 521, 541 e 548**. O plano determina condição cadastrada, datas determináveis, conciliação com o preço e ajuste na última parcela, mas deixa comandos e DTOs administrativos para definição no serviço proprietário.

Consultei também o plano anterior: ele acrescenta condição por percentuais e `calculatePayments(price, plan, referenceDates)`, mas não define a estrutura de `plan` e `referenceDates`. O desenho do piloto igualmente exige entrada e parcelas determináveis, sem fechar esse contrato.

**O que precisa ser escolhido:** quais modelos serão aceitos; como representar entrada e parcelas; quais datas serão informadas e quais serão derivadas; de qual evento dependem datas relativas; quais combinações são inválidas. Esses pontos são comportamento comercial, não simples escolha de nomes de campos.

**Consequência:** duas implementações podem conciliar o mesmo preço e ainda gerar vencimentos ou cronogramas diferentes, ambos aparentemente conformes ao texto.

**Correção e aceite:** documentar a união de modelos suportados e seus campos, validações, regras de datas e algoritmo de distribuição. Se a beta aceitar somente datas explícitas, registrar essa decisão. Incluir exemplos com preço descontado, entrada, divisão com centavo residual e uma configuração inválida, indicando datas e valores esperados.

## IR-03 — Major — Faltam decisões finais do ciclo de recuperação

**Escopo e evidência:** P05 e P11, linhas **470, 480, 578, 588–590 e 594**. A emissão possui estado e erro; as tentativas possuem etapa, contador e posse. Há regras úteis para fencing e limpeza, porém falta a matriz que determina o destino de cada falha.

A seção anterior, linhas 229 e 233, distingue falha técnica de alteração comercial e exige nova solicitação quando o snapshot ficou obsoleto. Isso resolve a proibição de sobrescrever o snapshot, mas não fecha o contrato persistido e a resposta de recuperação.

**O que precisa ser escolhido:** quando a emissão permanece `PENDING` ou passa a `FAILED`; quais falhas permitem nova tentativa da mesma emissão; o que ocorre ao atingir o limite configurado; como a consulta diferencia execução ainda ativa, falha retomável e conflito que exige nova solicitação. Não é necessário inventar o valor de produção do limite para definir essas transições.

**Consequência:** serviço, interface e comando de diagnóstico podem interpretar o mesmo registro de maneiras diferentes, oferecendo retomada impossível ou deixando uma emissão indefinidamente em andamento.

**Correção e aceite:** acrescentar uma tabela de estados/transições com evento, condição, mudança persistida e ação oferecida. Definir códigos para as classes de falha e o comportamento após esgotamento. Testar esses casos além da perda de posse e falha após upload já previstas.

## IR-04 — Major — WebP é aceito sem caminho definido para o PDF

**Escopo e evidência:** linhas **369, 521, 557–558 e 570**. O catálogo aceita PNG/JPEG/WebP; o PDF incorpora imagens com pdf-lib; a lista aprovada de dependências não estabelece um conversor.

As cópias técnicas autorizadas consultadas documentam `embedJpg` e `embedPng`, além do exemplo de incorporação desses dois formatos. Não fornecem um caminho de incorporação de WebP. O plano histórico permite continuar sem imagem opcional quando ela falha, mas isso não decide o tratamento de um formato aceito normalmente pelo cadastro.

**O que precisa ser escolhido:** converter WebP, restringir os formatos aceitos ou omiti-lo deliberadamente do documento. Conversão exige definir dependência, momento e objeto imutável resultante; omissão exige estabelecer o comportamento esperado da apresentação.

**Consequência:** uma imagem validamente cadastrada pode causar falha na emissão ou desaparecer do PDF por uma decisão local do implementador.

**Correção e aceite:** documentar o caminho escolhido e ajustar contratos, dependências e manifesto. Acrescentar caso de proposta com WebP válido e verificar o comportamento declarado na página e nos bytes do PDF, sem chamadas de rede durante emissão.

## IR-05 — Major — As listas por pacote não incluem mudanças necessárias em arquivos anteriores

**Escopo e evidência:** linha **365**, que apresenta cada tabela como enumeração dos arquivos do pacote, todos `Create`; P11, linha **588**; P15, linha **674**.

P11 exige que escritas de preços, vigência e desativação coordenem os mesmos registros usados na confirmação. Esses serviços pertencem a P06–P08 e não aparecem como `Modify` no pacote. P15 manda conectar manutenção ao serviço de emissão e ao resolvedor público, já criados em P11–P12, novamente sem incluí-los.

**O que precisa ser escolhido:** antecipar interfaces e implementação desses mecanismos ou modificar arquivos fora da lista do pacote atual. O conjunto global contém os arquivos, mas não fornece uma allowlist correta por fase.

**Consequência:** uma execução fiel à tabela deixa integrações incompletas; uma execução funcional ultrapassa os limites declarados sem uma alteração previamente especificada.

**Correção e aceite:** acrescentar as entradas `Modify` nos pacotes consumidores, com alterações precisas, ou antecipar contratos explícitos e sua conexão nas etapas produtoras. Conferir que toda mudança exigida pelas instruções possui arquivo e ação no pacote correspondente.

## IR-06 — Major — As fases com páginas não permanecem buildáveis

**Escopo e evidência:** linha **396**, que adia o build completo até P13; páginas e rotas criadas em P06–P12, linhas **491–494, 513–517, 529, 542–545, 581–583 e 601–602**; estrutura global e layout autenticado somente nas linhas **611 e 616**.

P01–P05 podem entregar módulos verificáveis sem uma aplicação completa. A partir de P06, entretanto, o plano cria uma aplicação App Router sem disponibilizar sua estrutura mínima, deixando sua compilação para várias etapas depois.

**Consequência:** os checkpoints intermediários verificam serviços, mas não demonstram que as páginas e integrações recém-introduzidas formam uma aplicação compilável. Problemas de imports, fronteiras servidor/navegador e composição podem acumular-se até P13.

**Correção e aceite:** antecipar a estrutura mínima necessária antes da primeira página e estabelecer verificação de compilação apropriada a cada pacote que introduz UI. P13 pode continuar responsável pelo acabamento e pelas jornadas completas. Atualizar também o manifesto de arquivos e as dependências entre etapas.

## Manifesto de leitura e limites

Leitura integral:

- Persona `implementation_readiness.md` e padrão `implementation-readiness-standard.md`.
- Alvo, **linhas 1–716**, incluindo todo o escopo ativo **359–716**.
- `review_context.json`.
- `concepts_brief.md`, **1–125**.
- RFC `plataforma-comercial-hoteleira-beta-rfc.md`, **1–127**.
- `Desenho do piloto - Plataforma comercial hoteleira.md`, **1–312**.
- `Plano de implementacao - Plataforma comercial hoteleira.md`, **1–336**.
- `decisao-base-tecnologica-beta.md`, **1–43**.

Consulta técnica parcial: `pdf-lib-api.txt`, **75–130, 315–348 e 402–435**; `pdf-lib-examples.txt`, **290–333**. Houve buscas textuais nesses dois arquivos por formatos e métodos de imagens. Truncamentos de saída foram recuperados em leituras delimitadas. Dos demais arquivos externos autorizados, consultei somente contagens de linhas de `next-deploying.txt`; seu conteúdo e as outras oito cópias técnicas não foram lidos.

Não abri pareceres anteriores, links recursivos, HTML bruto ou fontes ao vivo. As sínteses históricas contidas no brief/RFC autorizado foram lidas como contexto documental, sem consultar os relatórios vinculados. Não houve escrita, execução de produto, testes, build, instalação ou migração.

O estado **Approved** foi considerado registro de aprovação documental, não evidência de prontidão técnica. Não tratei dados reais pendentes, provedor, metas operacionais, fixação mecânica de versões ou inexistência dos arquivos futuros como defeitos.
