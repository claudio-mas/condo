Implementation Readiness — BRAINSTORM

A hipótese comporta construção com dados controlados. Não identifiquei bloqueador de construção nesta lente. Os riscos abaixo dizem respeito à transição e às futuras atualizações da beta; são inferências e propostas de proteção, não defeitos observados em software existente. A hipótese informa que não há código de produto identificado, e o plano contém tarefas não executadas (Hipótese, “Base funcional e técnica” e “Estado atual”, linhas 19–33).

1. **Major — Migration & Backward Compatibility: retorno operacional após a troca da referência**

   **Fatos e salvaguardas existentes:** a adoção será gradual, com uma ferramenta explicitamente identificada como referência por empreendimento. Após a troca, a plataforma será referência e a planilha será histórico (Desenho, §3, linhas 35–39; §10, linhas 271–273; Proposta de acompanhamento, §2, linhas 31–35).

   **Risco inferido:** caso seja necessário interromper o uso após atendimentos reais, voltar diretamente à planilha histórica pode recuperar preços, disponibilidade ou premissas desatualizados. Os trechos citados definem a troca normal, mas não explicitam como reconciliar os dados de uma retomada temporária.

   **Requisito proposto de transição:** acrescentar ao roteiro existente uma contingência simples por empreendimento: quem decide suspender emissões, como preservar propostas já emitidas e como conferir os dados vigentes antes de retomar qualquer ferramenta. Se a planilha histórica não puder representar os dados atuais, a contingência pode ser suspender emissões até a recuperação. Isso não exige sincronização permanente com a planilha.

   **Classificação:** lacuna operacional nova nesta revisão; proposta a resolver antes da adoção real, sem impedir construção. Não é proposta de reduzir os dois modelos aprovados.

2. **Major — Migration & Backward Compatibility: versões identificadas precisam continuar legíveis após atualizações**

   **Fatos e salvaguardas existentes:** o plano propõe `engineVersion`, `schemaVersion: 1`, entradas e resultados congelados, imagens imutáveis e JSON validado por schema/versionamento. Premissas e snapshots publicados terão proteção contra alterações (Plano, “Contratos compartilhados”, linhas 94–105; tarefa 5, linhas 163–172). O desenho exige preservar documentos históricos apesar de mudanças cadastrais (Desenho, §9, linhas 237–241).

   **Risco inferido:** identificar versões permite detectar diferenças, mas não estabelece sozinho como uma atualização da beta continuará lendo propostas e premissas anteriores. Um novo leitor incompatível pode prejudicar a consulta histórica; retornar ao código anterior também pode falhar se uma migração já tiver alterado os dados.

   **Requisito proposto de migração:** antes da primeira atualização que altere formatos persistidos, registrar quais versões anteriores continuam legíveis e testar uma proposta emitida pela versão anterior. Preferir alterações aditivas; quando uma alteração impedir retorno ao código anterior, declarar essa restrição e ensaiar a recuperação em ambiente isolado. Preservar os snapshots e PDFs emitidos, sem recalcular silenciosamente documentos antigos.

   **Classificação:** risco futuro e proposta de proteção para atualizações; não é defeito confirmado nem bloqueador da primeira construção. Não demanda um sistema genérico de migração SaaS agora.

3. **Major — Migration & Backward Compatibility: restauração pode recuperar conteúdo e retroceder o estado dos links**

   **Fatos e salvaguardas existentes:** emissão prevê estados recuperáveis e publicação somente após PDF pronto; links vencidos, revogados ou substituídos restringem consulta e download (Plano, tarefas 11–12, linhas 239–256). Já estão previstos backup, manifesto de arquivos, recuperação da chave de links e teste isolado de restauração de snapshot/PDF (Plano, tarefa 15, linhas 285–295).

   **Risco inferido:** restaurar um ponto anterior a uma revogação ou substituição pode fazer um link voltar a parecer ativo, mesmo com snapshot e PDF íntegros. O teste descrito verifica integridade dos documentos, mas não explicita esse cenário temporal.

   **Requisito proposto de recuperação:** incluir no ensaio existente uma proposta revogada ou substituída depois do ponto restaurado. Antes de reabrir a consulta pública, conferir os estados afetados e reaplicar as restrições necessárias. Registrar a perda de dados admitida entre backups e o procedimento de conferência, em escala compatível com a beta.

   **Classificação:** extensão proposta da verificação já prevista, antes do uso real dos links. A necessidade de backup/restauração não é descoberta nova; o risco adicional é o retrocesso dos estados de acesso.

As condições já explícitas de liberação continuam sendo condições existentes, não funcionalidades ausentes: empreendimento e homologador, inventário completo do pool, calendário, despesas, condições comerciais, ambiente, revisão jurídica e termos para empresas beta (Desenho, §11, linhas 275–289). A disponibilidade total da empresa está confirmada; participantes, agenda, canal e primeiro balanço permanecem abertos (Hipótese, linhas 13–16 e 25–27; Proposta, linhas 76–78). Não decorre disso bloqueio para desenvolver com dados controlados, conforme o próprio desenho, linhas 275–277.

A revisão 1 prevalece: `73.69` é aceito com desconto de 24 meses identificado e prazo simples `97.69`; a comparação legada individual não homologa o pool (Plano, tarefa 14, linhas 277–279). Stack e hospedagem continuam propostas do responsável pelo plano, não escolhas expressas do solicitante (Plano, linhas 9 e 55).

Manifesto de leitura integral:

- `/home/claudio/.codex/plugins/cache/egm/egm/0.1.1/agents/implementation_readiness.md`: linhas 1–62; aplicado somente o modo BRAINSTORM, linhas 28–32 e 57–62.
- `/home/claudio/projetos/condo/docs/brainstorm/hipotese-beta.md`: linhas 1–42, todas as seções.
- `/home/claudio/projetos/condo/Desenho do piloto - Plataforma comercial hoteleira.md`: linhas 1–312, abertura e §§1–13.
- `/home/claudio/projetos/condo/Plano de implementacao - Plataforma comercial hoteleira.md`: linhas 1–336, abertura, restrições, contratos, tarefas 1–15 e seções finais.
- `/home/claudio/projetos/condo/docs/brainstorm/proposta-acompanhamento-beta.md`: linhas 1–78, todas as seções.

Nenhum padrão adicional foi utilizado. Não consultei a planilha, o relatório de análise ausente, fontes externas, relatórios de outros revisores ou memória anterior. Nenhum arquivo foi alterado.
