# Condo — comparação da landing beta

Três propostas de primeira dobra, baseadas no **Desenho do piloto — Plataforma comercial hoteleira**. O comparador está em português e permite comparar lado a lado, ampliar em tamanho real e copiar uma escolha para a conversa.

## Abrir

Abra `dist/index.html` diretamente no navegador, ou, nesta pasta, execute:

```sh
python3 -m http.server 4173 --directory dist
```

Acesse http://localhost:4173. A comparação é autocontida, com fontes embutidas; as três propostas separadas também estão em `dist/direcoes/`, com fontes em `dist/assets/fonts/`.

## Direções

1. **Mesa de cenários** — Sora e IBM Plex Mono; verde e limão; uma comparação horizontal como protagonista. Recomendada para explicar o produto antes de pedir o acesso ao beta.
2. **A proposta por inteiro** — Newsreader e Manrope; blush, papel e vinho; documento central e leitura editorial.
3. **Sua operação dita as regras** — Barlow Condensed e Public Sans; carvão e laranja; título monumental e fluxo do empreendimento até a proposta.

## Limites desta exploração

São três primeiras dobras para escolher uma direção, conforme o fluxo de comparação da oil-ui, em 1440 × 900. A landing completa, versão móvel, animações e integração de login serão desenvolvidas após a escolha. Os botões de acesso são representações visuais: nenhuma rota real de plataforma foi fornecida. Não há cadastro nem envio de dados. O comparador guarda a escolha no navegador e copia texto; não notifica o agente automaticamente.

`condo.` é um nome provisório, sem identidade comercial confirmada. Atlântico Residence, unidade 204, número da proposta e premissas de R$ 380 / ocupação 52%, 64%, 76% são conteúdo fictício compartilhado pelas três opções. Não são dados do piloto, indicadores de adesão ou promessas de rentabilidade.

## Verificação

Conceitos gerados e revisados separadamente antes da execução. O terceiro foi ajustado para demonstrar objetos concretos do produto. Nesta fase de comparação, não há avaliação visual independente nem nota. A inspeção renderizada do agente principal e as capturas ficam no workspace de processo `.oil-ui/landing-beta/`, fora da publicação.

A comparação foi gerada pelo `build_explorer.py` da oil-ui e recebeu tradução dos rótulos para português. Candidatos: HTML/CSS sem framework, dependências de execução ou animações. Fontes locais obtidas de Google Fonts; licenças SIL Open Font License em `dist/assets/fonts/licencas/`.
