
## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (claudio-mas/condo) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Projeto

Plataforma Comercial Hoteleira (condo): beta para simular e emitir propostas de unidades de condo-hotel.

### Fonte de verdade

1. `docs/designs/plataforma-comercial-hoteleira-beta.md` — desenho formal aprovado; pacotes P01–P15 executados em sequência.
2. `Desenho do piloto - Plataforma comercial hoteleira.md` (revisão 1) — base funcional citada pelo desenho formal.

Históricos, somente para consulta: `Plano de implementacao - Plataforma comercial hoteleira.md`, `design_draft.md`, `concepts_brief.md`, os relatórios `*_report.md` na raiz e em `docs/reviews/`, `docs/brainstorm/` e o RFC. Em conflito, prevalece o desenho formal.

### Regras

- Não editar `Calculadora investidores.xlsx` nem os documentos históricos.
- Trabalhar somente nos arquivos do manifesto do pacote em execução; desvios exigem decisão do usuário.
- Dependências somente da matriz fechada do desenho formal; versões fixadas e `package-lock.json` versionado.
- Testes antes da implementação; cada pacote roda suas verificações e typecheck/build da aplicação acumulada.
- Domínio (`src/domain`) sem banco, servidor, autenticação ou React. Dinheiro como texto decimal, nunca `number`.
- Textos para o usuário em pt-BR, sempre via `src/i18n`. Identificadores de código em inglês.
- Testes de integração, seeds, migrações e restauração somente em banco de teste; nunca em banco operacional.
- Branch por pacote (`pNN-slug`), Conventional Commits; merge na `main` somente com aceite do usuário.