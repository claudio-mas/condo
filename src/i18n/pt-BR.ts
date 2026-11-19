/**
 * Catálogo único de mensagens em pt-BR.
 *
 * Módulo simples: não importa domínio, banco, autenticação nem telas.
 * Placeholders usam `{nome}` e são tipados por `src/i18n/index.ts`.
 * Cada fase acrescenta aqui suas chaves antes de integrar os consumidores.
 */
export const ptBR = {
  // Aplicação
  "app.name": "Plataforma Comercial Hoteleira",
  "app.description": "Simulação e emissão de propostas de unidades de condo-hotel.",
  "app.skipToContent": "Ir para o conteúdo",

  // Entrada mínima
  "home.title": "Plataforma Comercial Hoteleira",
  "home.lead": "Ambiente beta em preparação.",
  "home.body": "O acesso da equipe comercial será disponibilizado em breve.",

  // Estados genéricos
  "notFound.title": "Página não encontrada",
  "notFound.body": "O endereço informado não existe ou não está mais disponível.",
  "notFound.back": "Voltar ao início",
  "error.title": "Algo deu errado",
  "error.body": "Não foi possível concluir a operação. Tente novamente em instantes.",
  "error.retry": "Tentar novamente",
  "error.occurrence": "Código de ocorrência: {code}",

  // Formatos de apresentação
  "format.money": "R$ {value}",
  "format.percent": "{value}%",
  "format.months": "{value} meses",

  // Campos
  "field.baseYear": "Ano-base",
  "field.weekendDays": "Dias de final de semana",
  "field.holidays": "Feriados",
  "field.specialDates": "Datas especiais",
  "field.season": "Temporada",
  "field.period": "Período",
  "field.periodStart": "Início do período",
  "field.periodEnd": "Fim do período",
  "field.horizon": "Horizonte da simulação",
  "field.scenario": "Cenário",
  "field.occupancy": "Ocupação",
  "field.dailyRate": "Diária",
  "field.cost": "Custo",
  "field.costRate": "Percentual do custo",
  "field.costBase": "Base do custo",
  "field.costOrder": "Ordem de aplicação",
  "field.negotiatedPrice": "Preço negociado",
  "field.acquisitionCost": "Custo de aquisição",
  "field.paybackRule": "Regra de payback",
  "field.deductedMonths": "Meses descontados",
  "field.inventory": "Inventário do pool",
  "field.participation": "Participação",
  "field.participationBasis": "Base dos pesos",
  "field.participationShare": "Percentual contratual",
  "field.participationWeight": "Peso",
  "field.lossPolicy": "Tratamento de prejuízo",
  "field.retention": "Retenção",
  "field.investorCost": "Custo exclusivo do investidor",

  // Erros de campo (códigos estáveis do domínio)
  "issue.REQUIRED": "Preencha este campo.",
  "issue.INVALID_FORMAT": "Valor em formato inválido.",
  "issue.INVALID_VALUE": "Opção inválida.",
  "issue.AMBIGUOUS": "Valor ambíguo. Use vírgula para decimais, por exemplo 1.234,56.",
  "issue.TOO_MANY_DECIMALS": "Casas decimais acima do permitido.",
  "issue.OUT_OF_RANGE": "Valor fora da faixa permitida.",
  "issue.NOT_INTEGER": "Informe um número inteiro.",
  "issue.NOT_POSITIVE": "Informe um valor maior que zero.",
  "issue.INVALID_DATE": "Data inexistente no calendário.",
  "issue.OVERLAP": "Período sobreposto a outro período.",
  "issue.DUPLICATE": "Valor repetido.",
  "issue.UNKNOWN_REFERENCE": "Referência não encontrada.",
  "issue.NOT_RECONCILED": "Os percentuais precisam somar exatamente 100%.",
  "issue.UNKNOWN_WEIGHT": "Peso não informado. Pesos desconhecidos não são considerados zero.",
  "issue.UNEXPECTED_FIELD": "Campo não aplicável a este modelo.",
  "issue.MISSING_TARIFF": "Falta a diária necessária para esta categoria, temporada e tipo de dia.",

  // Indicadores
  "metric.unavailable.PARTIAL_YEAR": "Indisponível: requer um ano-base completo de premissas.",
  "metric.unavailable.NON_POSITIVE_RESULT": "Indisponível: o resultado anual não é positivo.",
  "metric.unavailable.INVALID_INVESTMENT": "Indisponível: investimento ausente ou não positivo.",
  "metric.unavailable.RECOVERED_WITHIN_DEDUCTION": "Recuperado dentro dos primeiros {months} meses.",
  "payback.rule.SIMPLE": "Payback simples",
  "payback.rule.DEDUCTED_MONTHS": "Payback contado após {months} meses de operação",
} as const;

export type Catalog = typeof ptBR;
