# Plataforma comercial hoteleira — desenho do piloto

Desenho aprovado pelo solicitante em 26/10/2026, pela resposta “Nada a alterar”. Revisão 1 em 08/11/2026, com decisões do solicitante registradas na seção 13. Este documento define a base funcional do piloto; as escolhas técnicas de implementação são registradas no plano correspondente.

## 1. Objetivo e público

Substituir a planilha atual por uma aplicação web adotada definitivamente pela empresa em seus atendimentos comerciais. A implantação será gradual, começando por um empreendimento e avançando após validação dos cálculos e do uso pela equipe.

O usuário principal é o consultor ou corretor da equipe comercial. Ele conduz a simulação e apresenta os resultados ao investidor. O investidor consulta a proposta enviada após o atendimento.

O piloto atende uma empresa com vários empreendimentos de operação hoteleira. A evolução prevista é um SaaS para empresas independentes, com equipes e carteiras separadas.

O solicitante é um desenvolvedor independente. A empresa do piloto é o primeiro cliente parceiro. Outras empresas podem participar como testadoras beta, somente por convite do operador da plataforma. O foco do produto é condo-hotel no Brasil.

## 2. Decisões confirmadas pelo solicitante

- Atendimento conduzido pela equipe comercial.
- Vários empreendimentos, inicialmente de uma única empresa.
- Somente operação hoteleira no piloto.
- Modelos de resultado individual e pool hoteleiro disponíveis no piloto.
- Configuração das regras por empreendimento.
- Propostas enviáveis ao investidor por link e com PDF.
- Integrações com CRM e outros sistemas previstas para uma etapa SaaS posterior.
- Sucesso definido pela adoção definitiva em substituição à planilha.
- Implantação gradual.
- Empresa do piloto como primeiro cliente parceiro; testadoras beta somente por convite (revisão 1).
- Primeiro empreendimento no modelo pool, com participação por pesos proporcionais ao valor de venda (revisão 1).
- Regra de payback configurável por empreendimento; o primeiro cliente usa payback com 24 meses descontados (revisão 1).
- Modelo de resultado, critério de participação e regra de payback são parâmetros escolhidos entre regras pré-definidas, nunca fórmulas livres (revisão 1).

Os demais pontos deste documento foram apresentados como propostas e aceitos na aprovação do desenho. Não constituem informações já confirmadas sobre contratos, processos ou tecnologia existentes na empresa. Parâmetros reais continuam sujeitos à homologação antes do uso comercial.

## 3. Abordagens consideradas

### Implantação gradual por empreendimento — escolhida

Começar com um empreendimento representativo, com cadastro, regras e equipe preparados. Validar atendimentos e propostas reais e ampliar a utilização após os critérios de aceite. Durante a transição, cada empreendimento terá uma indicação clara de qual ferramenta é a referência oficial.

Essa opção foi recomendada pela possibilidade de ajustar o produto com a equipe antes de ampliar sua utilização e escolhida pelo solicitante.

### Substituição simultânea

Preparar todos os empreendimentos e toda a equipe antes de uma troca única. Oferece padronização imediata, mas concentra o trabalho de cadastro, validação e preparação dos usuários antes da entrada em operação.

### Distribuição da proposta

Foram consideradas a emissão apenas em PDF e a emissão por link com PDF. O solicitante escolheu link com PDF. Cada versão enviada deve registrar o conteúdo e as premissas utilizadas.

## 4. Escopo do produto proposto

### Administração

- Dados e identidade da empresa, incluindo nome, marca e contatos comerciais.
- Usuários e permissões.
- Empreendimentos e unidades, com preços, categorias e disponibilidade.
- Modelo de resultado e premissas oficiais de cada empreendimento.
- Calendário, temporadas, tarifas, ocupações e despesas.
- Regras de participação no pool, quando aplicável.
- Condições de pagamento, limites comerciais e validade padrão das propostas.
- Publicação de versões das premissas e histórico de alterações.

### Atendimento comercial

- Selecionar empreendimento e unidade.
- Consultar preço, disponibilidade e condições autorizadas.
- Comparar cenários otimista, realista e pessimista.
- Simular desconto dentro do limite autorizado.
- Selecionar uma condição de pagamento cadastrada.
- Identificar o interessado com os dados necessários à proposta.
- Salvar rascunho, gerar proposta e consultar o histórico.
- Copiar link e baixar PDF para envio pelos canais já utilizados pela equipe.

### Consulta do investidor

- Abrir o link no celular ou computador, sem necessidade de conta.
- Consultar identificação do empreendimento, unidade e consultor.
- Conferir preço, condições, cenários e premissas relevantes.
- Consultar emissão, validade, versão e caráter estimativo dos resultados.
- Baixar o PDF da mesma versão.

O piloto não inclui assinatura de contratos, aceite eletrônico com efeito de contratação, reserva automática de unidade, recebimento de pagamentos, comissões, operação de reservas de hospedagem, CRM completo, cobrança de assinaturas SaaS ou integrações externas. São limites de escopo propostos, sujeitos à revisão do solicitante.

## 5. Papéis e autonomia comercial

Proposta inicial: dois papéis.

| Papel | Responsabilidades |
|---|---|
| Administrador | Gerir usuários, cadastros, regras, premissas, limites e propostas da empresa. Publicar versões e revogar links. |
| Consultor | Consultar o catálogo autorizado, criar simulações, gerir seus próprios rascunhos e propostas e emitir versões dentro das condições publicadas. |

Fora das empresas existe o operador da plataforma (o solicitante). Ele cria empresas e seus primeiros administradores por convite e mantém o catálogo de regras disponíveis. Não é um papel dentro da empresa e não consulta propostas ou premissas dos clientes no uso normal. Um acesso de suporte, quando necessário, deve ser autorizado pela empresa e registrado.

O administrador consulta as propostas da empresa. O consultor consulta somente as suas. Atribuições compartilhadas e um papel intermediário de gestor comercial ficam para revisão futura se o processo real exigir.

O consultor pode selecionar unidade, condição cadastrada e desconto permitido. O desconto tem limite percentual por empreendimento, com exceção por unidade. Limite ainda não configurado significa desconto máximo zero. Uma condição acima do limite impede a emissão e exige revisão pelo administrador. Um fluxo específico de aprovação de exceções não faz parte desta proposta inicial.

Propõe-se permitir um cenário personalizado adicional: diária e ocupação dentro de faixas publicadas pelo administrador. Ele deve ficar identificado e não sobrescrever os três cenários oficiais. Faixas não configuradas deixam o cenário personalizado indisponível. As configurações do modelo, custos, taxas e participação no pool permanecem sob responsabilidade administrativa.

No modelo individual, o cenário personalizado altera a operação da unidade. No pool, altera as premissas da operação coletiva e a aplicação mostra ao investidor a parcela resultante de sua unidade. Não pode parecer que a alteração se limita ao desempenho isolado do quarto.

## 6. Cadastros e fontes de dados

Cada empreendimento possui identificador, nome, descrição, localização, imagens opcionais, responsável, modelo de resultado, moeda BRL, fuso horário, unidades e conjunto publicado de premissas.

Cada unidade possui identificador estável, código comercial único dentro do empreendimento, categoria, atributos de apresentação, preço de tabela, custos de aquisição conhecidos, condição de venda e parâmetros específicos necessários ao modelo. A disponibilidade comercial não representa a disponibilidade de noites da operação hoteleira e não determina participação no pool.

O piloto terá administração direta dos cadastros. Para o primeiro empreendimento, os dados da planilha podem ser carregados uma única vez, com preparação e conferência assistidas. Não se propõe um importador genérico de planilhas para usuários no piloto. Fórmulas antigas e nomes quebrados não serão importados como regras da aplicação.

A base da planilha contém valores que podem servir de referência, mas seu calendário e regra de rateio precisam ser homologados. Pontos da planilha a resolver na homologação (revisão 1):

- As contagens da coluna rotulada “Dias de Semana” (CALCULADORA!L6:L19) coincidem com o número de sextas a domingos de 2026 em todos os dez meses inteiros; nenhum outro ano entre 2022 e 2030 coincide. Isso indica que as colunas “Final de Semana” e “Dias de Semana” estão trocadas e que a empresa considera fim de semana de sexta a domingo.
- Fevereiro soma 29 dias, e o ano 366. Se o ano-base for 2026, há um dia a mais.
- As diárias do FINAL 03 em QUARTOS!I8:P8 são cerca de metade das demais unidades, apesar de ser o segundo maior investimento, e “Datas Festivas” supera “Final de Semana”. Confirmar antes de qualquer uso.
- A observação em imagem na CALCULADORA afirma que a rentabilidade é dividida em proporção aos valores de venda. Ela fundamenta a escolha do modelo pool com pesos pelo valor de venda. O empreendimento inicial deve ser escolhido pela empresa. O empreendimento da planilha é uma opção por permitir comparação, sem que isso represente uma escolha já feita pelo solicitante.

## 7. Motor de cálculo

O cálculo deve ser determinístico e executado de forma autoritativa no servidor. A interface consulta esse motor e o mesmo resultado alimenta tela, proposta e PDF. As regras são modelos conhecidos com parâmetros configuráveis, em lugar de fórmulas livres digitadas pelos usuários.

Toda simulação usa uma versão publicada de premissas. Valores monetários e percentuais devem usar representação decimal adequada, com política explícita de arredondamento. Apresentar moeda com duas casas e indicadores com precisão suficiente para comparação. Manter precisão interna antes de arredondar os resultados apresentados.

### 7.1 Calendário e cenários

O administrador informa ano-base e períodos de operação. Cada data pertence a um período e a uma única categoria tarifária. A classificação utiliza temporada, dias da semana, feriados e datas especiais cadastrados. A precedência proposta é data especial, feriado, final de semana e dia útil. Os dias que compõem o final de semana são configuráveis por empreendimento, com sábado e domingo como valor inicial proposto. Para o primeiro empreendimento, os dados da planilha indicam sexta a domingo; o valor deve ser confirmado na homologação (revisão 1).

Não haverá busca automática de feriados externos no piloto. O administrador cadastra o calendário aplicável e confere as contagens antes da publicação. Março e dezembro podem ser divididos em períodos comerciais quando necessário. As contagens devem conciliar com as datas, com 365 ou 366 dias no ano completo.

Cada cenário possui ocupação por período. A ocupação deve estar entre 0 e 100%. Tarifas podem variar por categoria/unidade, temporada e tipo de dia. Dados obrigatórios ausentes impedem a publicação ou o cálculo dependente, com indicação do campo necessário. Zero é um valor válido quando permitido e não equivale a dado ausente.

### 7.2 Operação individual

Para cada unidade e período:

`Receita = soma das noites disponíveis de cada categoria × diária aplicável × ocupação do cenário`

`Resultado operacional = receita − despesas fixas − despesas variáveis − demais despesas explícitas`

Custos percentuais precisam indicar sua base. No piloto, as bases suportadas são receita bruta e saldo positivo após custos operacionais, com ordem de aplicação explícita para itens que dependam do saldo. Não se aceitam dependências circulares ou fórmulas arbitrárias entre despesas.

O cadastro de custos deve identificar se cada item é valor fixo por período ou percentual, sua base e sua vigência. As regras tributárias ou contratuais serão informadas pelo administrador; o sistema não as deduz da descrição da despesa. Custos conhecidos e ainda ausentes precisam aparecer como pendência de configuração.

Ocupação zero gera receita zero e conserva os custos fixos devidos. A exclusão de um período do horizonte e a indisponibilidade de noites são controles diferentes. O horizonte exibido deve refletir os períodos efetivamente incluídos.

### 7.3 Pool hoteleiro

A operação coletiva é calculada a partir do inventário operacional completo do pool, com quantidade de unidades/noites por categoria, tarifas, ocupações e despesas coletivas. Esse inventário pode conter unidades sem oferta comercial e não deve ser inferido apenas das unidades anunciadas para venda.

Proposta para o piloto: distribuir o resultado após os custos cadastrados da operação e eventuais retenções explícitas. O resultado distribuível e as retenções precisam ser demonstráveis. Sua configuração deve seguir os documentos do empreendimento antes da publicação.

Dois critérios de participação propostos:

1. Percentual contratual explícito por participante/unidade.
2. Pesos relativos, em que a participação corresponde ao peso da unidade dividido pela soma dos pesos do conjunto elegível. A base dos pesos é escolhida pelo administrador: valor de venda de referência, área, fração ideal ou peso informado (revisão 1).

O primeiro empreendimento usa pesos pelo valor de venda de referência. Esses valores são registrados na versão publicada das premissas do pool. Uma alteração na tabela de preços, ou um desconto negociado, não altera as participações até que o administrador publique uma nova versão.

Os percentuais contratuais precisam conciliar com o total do pool. Se houver parcela de outros participantes, ela deve estar explicitamente cadastrada. Não normalizar automaticamente um cadastro incompleto. No modo por pesos, o denominador considera todo o conjunto elegível, independentemente de estar disponível para venda ou selecionado na interface.

`Parcela da unidade = resultado distribuível do período × participação da unidade`

`Resultado do investidor = parcela da unidade − custos exclusivos atribuídos ao investidor`

Proposta de tratamento para prejuízo: o cadastro deve exigir a definição de repasse proporcional ou absorção pela operação. No primeiro, a parcela negativa entra no resultado do investidor. No segundo, a distribuição é zero e o déficit da operação fica demonstrado. Custos exclusivos do investidor continuam aplicáveis. Regras de compensação futura de déficits exigem especificação própria e não estão incluídas no motor inicial.

Preço negociado e participação contratual são parâmetros independentes. Caso a regra utilize valores de referência para definir pesos, esses valores ficam registrados nas premissas do pool. Um desconto comercial não recalcula a participação automaticamente.

### 7.4 Investimento, pagamento e indicadores

Mostrar separadamente preço de tabela, desconto, preço negociado e custos adicionais conhecidos. A base do retorno é o investimento total do comprador, composto pelo preço negociado e pelos custos de aquisição explicitamente considerados. A ausência de informação sobre um custo deve ficar distinguível de custo zero.

As condições de pagamento propostas para o piloto são modelos cadastrados pelo administrador, com entrada e parcelas de datas e valores determináveis. A soma deve conciliar com o preço negociado. Juros de financiamento, correção monetária e encargos de atraso não serão presumidos. Condições que os exijam precisam de regra específica antes de sua disponibilização.

Indicadores iniciais:

- Receita bruta do ano-base, despesas e resultado operacional.
- Resultado anual atribuível ao investidor, distinguindo operação coletiva e parcela da unidade quando houver pool.
- Retorno operacional anual simples: resultado anual do investidor / investimento total.
- Retorno operacional mensal médio simples: retorno anual simples / 12.
- Payback simples estimado em meses: investimento total / resultado anual do investidor × 12.

Regra de payback por empreendimento (revisão 1), escolhida pelo administrador e registrada na versão de premissas:

- Simples: investimento total / resultado anual do investidor × 12.
- Com meses descontados (n): payback simples − n, equivalente a (investimento total − resultado anual × n / 12) / resultado anual × 12. Reproduz a regra da planilha original com n = 24, decisão confirmada pelo solicitante para o primeiro cliente.

A publicação exige a escolha explícita da regra. Com meses descontados, a proposta exibe o rótulo da regra (por exemplo, “payback contado após 24 meses de operação”) e mostra o payback simples como informação secundária, para que o número não seja lido como prazo total. Quando o resultado for positivo, mas o payback simples não ultrapassar n, o indicador mostra “recuperado dentro dos primeiros n meses”, sem valor negativo.

Payback fica indisponível com mensagem específica quando o resultado anual for zero ou negativo. Investimento ausente ou não positivo impede os indicadores que dependem dele. O prazo simples deve ser identificado como estimativa baseada na repetição do resultado do ano-base e contada a partir do início da operação estabilizada. Não representa o tempo desde a primeira parcela antes da entrega.

Para um horizonte parcial, mostrar receitas, despesas e resultado apenas dos períodos incluídos, com datas e quantidade de dias explícitas. Não anualizar automaticamente. Retorno anual, retorno mensal médio derivado do anual e payback simples ficam indisponíveis com a indicação de que requerem um ano-base completo de premissas. A comparação de cenários exige o mesmo horizonte em todos eles. A configuração padrão de uma nova simulação é o ano-base completo. Esta é uma decisão proposta no desenho para resolver a diferença entre resultado de período e resultado anual.

O cronograma comercial fica apresentado na proposta, mas o piloto não calcula TIR, VPL, valorização do imóvel, reinvestimento ou payback datado que considere obra, parcelas e sazonalidade. Essa limitação deve estar próxima ao indicador. A proposta não deve descrever o retorno simples como taxa de rendimento composto.

## 8. Simulações e propostas

### Rascunho e emissão

Um rascunho é editável pelo consultor responsável e usa uma versão identificada de premissas. Publicar novas premissas não muda seu conteúdo silenciosamente. Ao reabrir um rascunho desatualizado, indicar a nova versão disponível e exigir recálculo com a versão publicada vigente para emitir uma nova proposta.

A emissão confere autorização, disponibilidade comercial, limites e versão vigente, recalcula no servidor e registra um retrato imutável de entradas, resultados e apresentação. A proposta não reserva a unidade. Uma unidade vendida impede nova emissão, mas não altera documentos históricos.

O administrador pode tornar uma versão de premissas indisponível para novas emissões quando descobrir um erro. Propostas anteriores permanecem no histórico; a equipe identifica as afetadas pela versão e decide quais links revogar e quais propostas revisar. Não haverá envio automático de comunicações aos clientes.

### Conteúdo mínimo

- Empresa, empreendimento, unidade e consultor.
- Identificação necessária do interessado, sem exigir documentos pessoais para simular.
- Preço, desconto e condição de pagamento.
- Modelo de resultado e participação aplicável.
- Três cenários oficiais e cenário personalizado, se utilizado.
- Investimento considerado, resultados, retorno e payback com suas definições.
- Principais premissas, despesas incluídas e pendências relevantes.
- Número, versão, emissão, validade e contato comercial.
- Informação clara de que os valores operacionais são estimativas baseadas nas premissas exibidas.

Cadastro básico proposto do interessado: nome obrigatório para emitir, telefone e e-mail opcionais. O consultor faz o envio pelos canais da empresa. Não há cadastro obrigatório do interessado nem autenticação dele para consulta.

### Link e PDF

O link usa um identificador aleatório de alta entropia e está vinculado a uma versão específica. Dados pessoais não aparecem na URL. O link pode ser consultado por quem o possuir; essa característica precisa ficar clara à equipe ao compartilhar. As páginas não devem ser indexadas e não podem usar identificadores sequenciais como controle de acesso.

O administrador define validade padrão por empreendimento. Toda emissão registra uma data final, que não pode ficar indefinida por omissão. O administrador pode revogar o acesso. O consultor pode substituir ou revogar links das próprias propostas.

Nova versão substitui a anterior. O link antigo mostra que a versão foi substituída e o contato do consultor. Links vencidos ou revogados mostram o estado e o contato, sem expor os valores nem liberar o PDF. O acesso à versão atual exige seu próprio link, sem redirecionamento automático.

O PDF contém o mesmo retrato da proposta e é armazenado na emissão, com composição adequada para leitura e impressão. A revogação do link não remove cópias de PDF já baixadas. A interface deve distinguir geração da proposta de envio efetivamente realizado pelo vendedor. Não há rastreamento de abertura ou confirmação de leitura no piloto.

## 9. Estrutura técnica proposta e preparação para SaaS

Aplicação web responsiva com autenticação individual para a equipe, área administrativa, área comercial e consulta externa de propostas. Cadastro e simulações ficam persistidos em banco relacional. Cálculos e permissões são verificados no servidor. PDFs e imagens ficam em armazenamento de arquivos com acesso controlado.

Dados relacionados à operação comercial possuem vínculo obrigatório com a empresa: usuários e suas associações, empreendimentos, unidades, premissas, interessados, simulações e propostas. Toda operação autenticada verifica empresa e permissão no servidor. O contexto da empresa não pode ser aceito apenas de um campo enviado pela interface. O piloto não oferece autocadastro de novas empresas: o operador da plataforma cria a empresa parceira e as empresas beta por convite (revisão 1). Testes de isolamento entre empresas passam a ser obrigatórios com dados reais de mais de uma empresa, não apenas em base controlada.

Preparação para o SaaS sem ampliar o escopo do piloto (revisão 1): empreendimento com campo de tipo de produto (somente condo-hotel no piloto); valores monetários armazenados com código de moeda (somente BRL aceito no piloto); textos da interface e do PDF em catálogo de mensagens pt-BR, sem textos fixos espalhados no código; regras de modelo, participação e payback como implementações registradas e versionadas.

Estruturas principais propostas: Empresa, Usuário, Vínculo de acesso, Empreendimento, Unidade, Inventário operacional, Versão de premissas, Período/calendário, Cenário, Tarifa, Despesa, Participante do pool, Condição de pagamento, Interessado, Simulação, Proposta, Versão de proposta, Link e Registro de alteração.

Armazenar o conteúdo imutável da proposta independentemente de referências a cadastros que possam mudar. Manter registro de quem publicou premissas, mudou preços, emitiu versões ou revogou links. Exclusão de cadastros com histórico deve ocorrer por arquivamento, preservando o vínculo dos documentos existentes.

O banco precisa de backup automatizado e restauração verificada antes do uso definitivo. A publicação da aplicação deve ter ambiente de validação separado do operacional e procedimentos de migração e recuperação. Credenciais e configurações sensíveis ficam fora do código e dos dados de propostas.

Framework, bibliotecas, provedor de hospedagem, mecanismo de autenticação e ferramenta de geração de PDF ficam à escolha fundamentada do responsável pela implementação. Não há tecnologia existente ou preferência informada pelo solicitante. Essas escolhas devem privilegiar manutenção simples, exportação dos dados, teste dos cálculos e portabilidade para a futura operação SaaS. Custos e contas de serviços exigem definição antes da publicação operacional.

## 10. Implantação gradual e aceite

### Entrada do primeiro empreendimento

Escolher um empreendimento representativo, revisar seus cadastros e confirmar modelo, regras de despesas, calendário e participação contratual quando houver pool. O administrador publica as premissas após essa conferência. Usar os valores da planilha como evidência histórica e casos de comparação, identificando quais resultados eram defeituosos.

Ambos os modelos precisam de casos de referência aprovados antes da conclusão do piloto. Se o primeiro empreendimento usar somente um modelo, validar o outro com um conjunto controlado de dados e, antes de sua utilização comercial, com as regras do empreendimento correspondente.

### Critérios de aceite propostos

1. Modelos individual e pool conferem com cálculos independentes, inclusive resultados zero e negativos.
2. Receita usa noites e diárias; nenhum resultado depende acidentalmente da unidade selecionada em outra simulação.
3. Alterar investimento máximo, preços ou quantidade de unidades não cria referência circular.
4. Calendário, cenários e participação conciliam, com dados ausentes diferenciados de zero.
5. Desconto respeita o limite e altera a base do investimento sem alterar indevidamente a participação contratual.
6. Simulação, link e PDF conciliam por versão. Atualização cadastral não modifica propostas emitidas.
7. Permissões e vínculos com a empresa são verificados por testes, incluindo tentativa de acesso a registros de outra empresa em uma base controlada.
8. Administrador consegue manter cadastros e premissas e consultor consegue concluir um atendimento e compartilhar uma proposta.
9. Backup pode ser restaurado em ambiente de validação.
10. Responsáveis da empresa validam atendimentos reais do empreendimento inicial e formalizam a adoção da aplicação como referência para ele.
11. Regra de payback: o mesmo resultado produz payback simples e payback com meses descontados conciliados (diferença exata de n meses), com rótulo na tela, no link e no PDF; o caso “recuperado dentro dos primeiros n meses” não exibe valor negativo (revisão 1).
12. Pesos pelo valor de venda: participações conferem com valores de venda de referência / soma do conjunto elegível; mudança de preço ou desconto não altera participações sem nova publicação (revisão 1).
13. Empresas beta convidadas não acessam dados umas das outras nem da empresa parceira (revisão 1).

Horizontes parciais também devem ser testados: os totais representam somente os períodos incluídos, e os indicadores que exigem ano completo permanecem explicitamente indisponíveis.

A expansão ocorre por empreendimento após essa validação. A substituição definitiva se completa quando todos os empreendimentos abrangidos utilizarem a plataforma como referência e a equipe conseguir executar as tarefas comerciais necessárias por ela. A planilha pode ser mantida como arquivo histórico identificado, evitando dúvidas sobre qual base está vigente.

Não foram impostos prazo de piloto, número de usuários ou metas quantitativas sem informação da empresa. Esses parâmetros podem ser definidos no início da implantação. O critério central informado pelo solicitante é a adoção definitiva.

## 11. Informações necessárias antes do uso comercial

Estas informações não impedem desenhar ou desenvolver o produto com dados controlados, mas são necessárias para publicar um empreendimento real:

- Empreendimento inicial e responsável pela homologação.
- Identidade e contatos da empresa e usuários autorizados.
- Cadastros e disponibilidade comercial atualizados.
- Calendário e parâmetros oficiais dos cenários.
- Custos incluídos, bases de cobrança e tratamento de despesas ainda não informadas.
- Inventário completo, participações, retenções e tratamento de prejuízo do pool, conforme documentos do empreendimento.
- Condições de pagamento, limites de desconto e validade das propostas.
- Ambiente de hospedagem, contas de serviço e rotina operacional responsável por suporte e dados.
- Confirmação dos dias de fim de semana, da contagem de fevereiro e das diárias do FINAL 03 (revisão 1).
- Revisão jurídica do texto que acompanha o payback com meses descontados e do aviso de estimativa (revisão 1).
- Termos de uso e tratamento de dados para empresas beta convidadas (revisão 1).

## 12. Relação com a análise da planilha

Este desenho incorpora as correções descritas em `Relatorio de analise - Calculadora investidores.md`, produzido nesta conversa. A equivalência procurada é com a função comercial da planilha e com as regras homologadas de cada empreendimento. A aplicação não deve reproduzir os erros de receita, payback, dependência de seleção, circularidade e ocultação de falhas identificados no arquivo original.

Ajustes ao relatório após uma segunda análise independente do mesmo arquivo (revisão 1):

- O relatório afirma que não há validações de dados. Há duas listas de validação, em CALCULADORA!B3 e DASHBOARD!E7, ambas presas a QUARTOS!$E$6:$E$17. Elas ficam numa extensão do arquivo que algumas ferramentas de leitura descartam. A conclusão prática se mantém: as demais entradas não têm validação.
- O deslocamento de 24 meses no payback (falha 2 do relatório) passa a ser uma regra explícita e rotulada, por decisão do solicitante, e não mais um erro. Sem o rótulo, continua sendo um defeito.
- A política de tarifas (falha 6) fica resolvida para o primeiro empreendimento: pool com pesos pelo valor de venda.
- Calendário (falha 7): ver as evidências da seção 6 sobre 2026 e sobre a troca entre fim de semana e dias de semana.

## 13. Registro de alterações

| Revisão | Data | Alteração | Origem |
|---|---|---|---|
| 0 | 26/10/2026 | Desenho aprovado (“Nada a alterar”) | Solicitante |
| 1 | 08/11/2026 | Contexto: desenvolvedor independente, empresa do piloto como primeiro cliente parceiro, testadoras beta por convite; operador da plataforma (seções 1, 2, 5 e 9) | Decisão do solicitante |
| 1 | 08/11/2026 | Primeiro empreendimento no pool com pesos pelo valor de venda; base dos pesos configurável e congelada na versão de premissas (seções 2 e 7.3) | Decisão do solicitante, apoiada na observação da planilha |
| 1 | 08/11/2026 | Regra de payback configurável: simples ou com meses descontados; primeiro cliente com 24 meses, rótulo obrigatório e payback simples secundário (seções 2 e 7.4) | Decisão do solicitante |
| 1 | 08/11/2026 | Evidências de calendário (2026, sexta a domingo, fevereiro) e diárias do FINAL 03 como pendências de homologação (seções 6, 7.1 e 11) | Segunda análise da planilha |
| 1 | 08/11/2026 | Preparação para o SaaS: tipo de produto, moeda por valor, catálogo de mensagens, regras versionadas (seção 9) | Segunda análise |
| 1 | 08/11/2026 | Ajustes ao relatório de análise (seção 12) | Segunda análise |
