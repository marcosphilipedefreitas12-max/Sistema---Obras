# Sistema de Obras — instruções para o Claude

- Usuário: Marcos, engenheiro civil em Belo Horizonte, responsável pela obra City Design (residencial misto, 121 aptos + 4 lojas). Falar e escrever **em português do Brasil**, linguagem simples (ele não é programador).
- Arquitetura: **planilha Google = banco de dados**; telas em **Apps Script** (`apps-script/Sistema.gs` (CRM) + `apps-script/Modulos.gs` (menu e leitura/gravação genérica das abas) + `apps-script/Sistema.html`, HtmlService, `google.script.run`); `docs/index.html` = página de entrada no GitHub Pages, sem dados.
- **Nunca** colocar dados da obra (nomes de pessoas, CPF, valores reais, PIX, e-mails) neste repositório — ele é público.
- Funções do servidor começam com `sis` para não colidir com o `Script_Obra.gs` que já existe no mesmo projeto (ele define `onOpen`, `irPara`, `abrirMenuLateral` etc. — não redefinir).
- Abas do CRM: `CRM Demandas`, `CRM Fornecedores`, `CRM Interações`. Colunas em `SIS_COLS` (`Sistema.gs`); acrescentar colunas sempre **no fim** para não desalinhar dados existentes.
- Abas da obra lidas (não alterar): Cotações (cabeçalho linha 5, propostas K/L, P/Q, U/V, Z/AA, escolhido AJ, status AM), Contratos (linha 4), Medições (linha 4), Lançamentos (linha 4), Compras (linha 4), Pessoas (nomes em B a partir da linha 6), Resumo!B2 (nome da obra).
- `google.script.run` não aceita `Date` no retorno: converter para texto `yyyy-MM-dd` (`sisIso_`).
- Escapar todo texto vindo da planilha com `esc()` antes de pôr no HTML.
- Cada tela da planilha é um item de `SIS_MODULOS` (`Modulos.gs`): aba, linha do cabeçalho (`hdr`, `hdr2` se o nome está mesclado na linha de cima), primeira/última linha de dados, coluna-chave, última coluna, colunas da lista (`mostrar`) e os textos `serve` / `quando` / `passos`. Ao mudar o layout de uma aba na planilha, atualizar aqui.
- `sisAbaSalvar` nunca grava em célula com fórmula (confere a 1ª linha de dados).
- Testar fora do Google: `node tests/teste.js` (mock fictício `window.SIS_MOCK(fn, args)` + Playwright); conferir também em 390 px. Teste com a estrutura real da planilha só fora do repositório.
- Visual: "prancha técnica" — carimbo no topo de cada tela, grafite #22272b, fundo #eceeec, azul #1f3864 para ações, amarelo #f2b705 só para marcador ativo/foco/guia; Barlow Condensed (títulos) + IBM Plex Sans.
- Próximas versões planejadas: módulo **Projetistas e órgãos** (revisões de projeto, protocolos PBH/Bombeiros/concessionárias) e **Serviços da obra** (cronograma, produção, inspeções e vistorias lidas das abas existentes).
