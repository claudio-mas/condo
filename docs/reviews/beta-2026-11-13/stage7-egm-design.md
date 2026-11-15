Parecer DESIGN — Stage 7, modo REVIEW  
Resultado: **0 Blocker, 1 Major, 0 Nit.**

A arquitetura integrada é proporcional à beta de um desenvolvedor independente. Há separação adequada entre cálculo, serviços e apresentação; o desenho enfrenta explicitamente concorrência, emissão entre banco e arquivos, recuperação de tentativas e preservação do histórico. As alternativas registram benefícios e custos técnicos suficientes para compreender as escolhas principais.

As pendências de capacidade, orçamento, dados reais e homologação têm momentos de definição expressos. Não as classifico como impedimentos para construir com dados controlados. A aprovação documental não foi usada como evidência de correção.

**D-01 — Major — Restauração pode restabelecer acessos autenticados já revogados**

**Escopo:** `docs/designs/plataforma-comercial-hoteleira-beta.md`, linhas **170–182 e 274–278**. Definições complementares consultadas: linhas **488–501 e 670–674**.

**Evidência:** a linha 172 estabelece que desativar um vínculo impede o uso autenticado e revoga suas sessões. A persistência inclui identidade, papel e atividade do vínculo na linha 182. O detalhamento confirma sessões de banco e revogação na redefinição de senha, nas linhas 488 e 501. Entretanto, a recuperação das linhas 276–278 suspende a consulta pública e reconcilia ou invalida **links**, sem exigir tratamento equivalente para sessões, credenciais e permissões recuperadas. O procedimento complementar das linhas 670–674 também não estabelece essa condição.

**Falha e consequência:** considere um backup feito enquanto um consultor ainda tinha vínculo ativo. Depois dele, a empresa desativa o consultor ou redefine uma senha comprometida, revogando as sessões correspondentes. Restaurar aquele banco recupera o vínculo anterior, as sessões persistidas e, conforme o caso, a credencial antiga. A reconciliação de links pode terminar corretamente e ainda deixar esse usuário com acesso aos dados comerciais da empresa. Invalidar todos os links públicos não corrige esse acesso autenticado.

O risco decorre da recuperação temporal do estado de autorização escolhido pelo próprio desenho. Não exige acrescentar uma infraestrutura de identidade diferente, mas precisa de uma regra explícita antes de retomar o ambiente restaurado.

**Correção recomendada:** estender a condição de reabertura da restauração à área autenticada. Exigir invalidação das sessões restauradas e reconciliação de vínculos, papéis e redefinições de credenciais posteriores ao backup com registros confiáveis ou confirmação dos responsáveis das empresas. Na ausência de evidência suficiente, definir um procedimento conservador de confirmação dos acessos e redefinição assistida de credenciais antes de liberar os usuários afetados. Apenas encerrar sessões não basta se uma senha antiga comprometida voltar a permitir login. A manutenção deve impedir operações comerciais enquanto essa conferência estiver pendente.

Acrescentar ao ensaio previsto um backup anterior à desativação de um usuário e à redefinição de uma senha: após a recuperação, a sessão antiga, a credencial substituída e o vínculo desativado não podem recuperar autorização indevidamente.

**Critério de encerramento:** o documento deve declarar como a restauração preservará ou restabelecerá com segurança as restrições de acesso autenticado, além das restrições dos links públicos, e exigir evidência desse comportamento antes da retomada.

**Manifesto de leitura e cobertura**

- Persona `design_critic.md`, padrão `feature-spec-standard.md` e `review_context.json`: leitura integral.
- Alvo `docs/designs/plataforma-comercial-hoteleira-beta.md`: leitura integral das linhas **1–358**, cobrindo problema, objetivos, jornadas, arquitetura, persistência, cálculo, emissão, acesso, recuperação, alternativas e requisitos não funcionais. As linhas **359–716** também foram lidas integralmente, exclusivamente para esclarecer definições e verificar se mitigavam riscos da arquitetura. A saída inicialmente truncada foi suprida por leituras menores, sem lacunas na cobertura final.
- Contextos consultados integralmente: `concepts_brief.md` (**1–125**), `docs/designs/decisao-base-tecnologica-beta.md` (**1–43**) e `Desenho do piloto - Plataforma comercial hoteleira.md` (**1–312**).
- `Plano de implementacao - Plataforma comercial hoteleira.md`: consulta seletiva por busca de restauração, sessões, revogação, redefinição, limites, concorrência, retenção e logs; foram examinadas as linhas correspondentes devolvidas pela busca. Não houve leitura integral desse arquivo.
- Não consultei o RFC nem as onze cópias de referências externas. Não abri relatórios de outros revisores ou críticas anteriores; o brief foi consultado como contexto consolidado expressamente fornecido, sem seguir seus links.

**Limitações:** revisão documental da concepção da funcionalidade, sem auditoria de implementação ou exigência de decisões exaustivas de implementação. Não houve navegação, expansão recursiva do contexto, edição, instalação, build, testes ou migrações. Compatibilidade efetiva das dependências, desempenho e comportamento do produto permanecem sujeitos às verificações futuras previstas no próprio documento.
