# Revisão intermediária de arquitetura — etapa 8

**Modo:** REVIEW. **Data:** 2026-11-14. **Alvo:** `docs/designs/plataforma-comercial-hoteleira-beta.md`, linhas 1–716.

**Resultado:** 0 Blocker, 2 Major nesta lente: uma reiteração e um achado novo. Nenhuma correção foi aplicada ou verificada.

## Avaliação global

A arquitetura permanece proporcional ao problema: uma aplicação integrada, domínio determinístico separado da apresentação, PostgreSQL e arquivos privados. A emissão em etapas decorre da impossibilidade de uma transação única entre banco e armazenamento; não é justificativa para acrescentar serviços distribuídos. Posse temporária, idempotência e confirmação final atendem falhas concretas previstas.

Histórico imutável e apresentação congelada respondem à necessidade de consultar o conteúdo efetivamente emitido. Separar inventário operacional, participantes do pool e oferta comercial resolve uma diferença do negócio que não desapareceria com um modelo de dados menor. Não encontrei motivo sustentado para cortar um dos modelos, introduzir fila externa, sincronizar a planilha ou construir analytics.

O detalhamento das linhas 359–716 pertence intencionalmente ao plano de implementação. Sua existência não constitui, por si, queda indevida de altitude. Os riscos globais remanescentes concentram-se na fronteira entre identidade, autorização por empresa e recuperação operacional.

## IZ-01 — Major — Recuperação precisa abranger a identidade autenticada

**Classificação:** reiteração de **S7-01**, origem D-01; não contar como descoberta independente.

**Escopo:** linhas 170–182, 274–278, 488–501 e 670–674.

**Evidência:** sessões são persistidas e a autorização depende de vínculos ativos. O procedimento de restauração trata explicitamente das restrições posteriores ao backup dos links públicos, mas não estabelece tratamento equivalente para sessões, vínculos, papéis e credenciais restaurados. O detalhamento conecta manutenção à emissão e ao resolvedor público, sem explicitar a suspensão de todas as operações autenticadas afetadas pela restauração.

**Consequência:** recuperar o banco pode recuperar uma senha anterior à redefinição ou um vínculo anterior à desativação. Mesmo invalidar todas as sessões não impede novo login com a credencial restaurada. A recuperação pode, portanto, preservar PDFs e links corretamente enquanto reabre acesso interno indevido.

**Orientação:** ampliar o procedimento existente, incluindo manutenção das áreas autenticadas, invalidação de sessões e reconciliação ou recuperação conservadora das credenciais e autorizações antes da reabertura. Ensaiar usuário desativado e senha redefinida depois do backup. A solução não exige um novo serviço de identidade nem um subsistema de eventos: deve começar pelo procedimento de recuperação já previsto e declarar como demonstrará segurança quando faltarem registros confiáveis.

## IZ-02 — Major — Redefinição por empresa não delimita autoridade sobre identidade compartilhada

**Classificação:** achado novo, distinto do retrocesso de estado causado por restauração.

**Escopo:** linhas 170–176, 182, 490 e 499–501.

**Evidência:** o desenho distingue usuário e vínculo, permite que uma identidade tenha mais de um vínculo selecionável na entrada e atribui ao serviço administrativo a criação, desativação e redefinição de acesso da equipe dentro da empresa. Não define o que um administrador local pode fazer quando essa identidade também possui vínculo com outra empresa.

**Consequência:** se a redefinição assistida alterar a credencial compartilhada e entregar acesso ao administrador de uma empresa, esse administrador poderá autenticar-se como o usuário e alcançar seus outros vínculos. Conferir `companyId` nas operações comerciais não resolve essa passagem, pois a autenticação já ocorreu sob a identidade do usuário. Também fica indefinido se desativação e revogação de sessões afetam somente o vínculo administrado ou toda a identidade.

Isso é uma lacuna do contrato proposto, não uma vulnerabilidade demonstrada em implementação existente.

**Orientação:** definir separadamente a autoridade sobre o vínculo empresarial e sobre a identidade. O administrador local deve administrar seu vínculo; redefinir credenciais de uma identidade compartilhada exige um fluxo cuja autoridade alcance essa identidade, sem transferir seu controle ao administrador local. Especificar também o escopo da revogação de sessões. Acrescentar ao ensaio de isolamento uma identidade vinculada a duas empresas e uma tentativa de redefinição pela administração de apenas uma delas. Resolver essa fronteira antes de criar controles adicionais de gestão global.

## Riscos anteriores e proporcionalidade das correções

**S5-01** continua aplicável: as páginas das linhas 613 e 617 disputam a raiz. A correção deve escolher um proprietário da rota, sem separar aplicações ou criar outro mecanismo de encaminhamento.

**C-01** permanece uma lacuna de compreensão das referências legadas do P14. Sua correção pede identificação da origem e entradas dos casos, não um importador genérico de XLSX.

**S7-02** e **S7-03** permanecem pendentes. Precisar a preservação da versão anterior e definir localmente a subtração dos meses no payback são ajustes de contrato e texto. Não justificam outro estado de emissão ou outro motor de indicadores.

Nenhuma dessas recomendações foi aplicada. A aprovação do escopo não substitui sua correção técnica.

## Manifesto de leitura e limites

Leituras integrais:

- Persona `agents/zoom_out.md`: 1–74; standard `zoom-out-standard.md`: 1–60.
- Alvo: 1–716, incluindo Feature 1–358 e Detailed 359–716; trecho truncado recuperado por leitura específica.
- Relatórios prévios: `zoom_out_report.md` 1–49, `comprehension_report.md` 1–28 e `critic_report.md` 1–48.
- GoldfishContext: `concepts_brief.md` 1–125 e `decisao-base-tecnologica-beta.md` 1–43.
- Contexto de reaproveitamento: `landing-beta/README.md` 1–31.

Consultas parciais ao GoldfishContext:

- Desenho do piloto: 83–100, 197–241 e 271–289.
- Plano anterior: 175–190.
- Fonte arquivada `better-auth-drizzle.txt`: 1–180.
- Busca textual nos dois documentos históricos e no RFC; saída parcialmente truncada, sem alegação de leitura integral desses resultados ou do RFC.

Não consultei o conteúdo dos outros dez arquivos externos do manifesto. Não li relatórios brutos irmãos nem críticas antigas vinculadas pelo brief.

Realizei inventário com `rg --files` e buscas de implementações de cálculo, autenticação, emissão e armazenamento. Os resultados acessíveis indicam documentação e HTMLs de exploração visual; não identifiquei implementação equivalente dos serviços propostos. Os HTMLs não foram lidos integralmente.

Hash confirmado: `0ad5f486ddc551e1675db1481d3e399b4663f7ee687b30269b1e922ac8d8e60c`. Não houve escrita, instalação, teste, build, migração, execução de produto, navegação externa ou delegação. O parecer avalia o desenho documental; não comprova comportamento executado.
