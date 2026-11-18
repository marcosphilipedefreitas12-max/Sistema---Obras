# Sistema de Obras — instruções para o Claude

- Usuário: Marcos, engenheiro civil em Belo Horizonte, responsável pela obra City Design (residencial misto, 121 aptos + 4 lojas). Falar e escrever **em português do Brasil**, linguagem simples (ele não é programador).
- Arquitetura: **planilha Google = banco de dados**; telas em **Apps Script** (`apps-script/Sistema.gs` + `apps-script/Sistema.html`, HtmlService, `google.script.run`); `docs/index.html` = página de entrada no GitHub Pages, sem dados.
- **Nunca** colocar dados da obra (nomes de pessoas, CPF, valores reais, PIX, e-mails) neste repositório — ele é público.
- Funções do servidor começam com `sis` para não colidir com o `Script_Obra.gs` que já existe no mesmo projeto (ele define `onOpen`, `irPara`, `abrirMenuLateral` etc. — não redefinir).
- Abas do CRM: `CRM Demandas`, `CRM Fornecedores`, `CRM Interações`. Colunas em `SIS_COLS` (`Sistema.gs`); acrescentar colunas sempre **no fim** para não desalinhar dados existentes.
- Abas da obra lidas (não alterar): Cotações (cabeçalho linha 5, propostas K/L, P/Q, U/V, Z/AA, escolhido AJ, status AM), Contratos (linha 4), Medições (linha 4), Lançamentos (linha 4), Compras (linha 4), Pessoas (nomes em B a partir da linha 6), Resumo!B2 (nome da obra).
- `google.script.run` não aceita `Date` no retorno: converter para texto `yyyy-MM-dd` (`sisIso_`).
- Escapar todo texto vindo da planilha com `esc()` antes de pôr no HTML.
- Testar as telas fora do Google com um mock em `window.SIS_MOCK` (ver histórico do PR inicial) usando Playwright; conferir também em largura de celular (390 px).
- Próximas versões planejadas: módulo **Projetistas e órgãos** (revisões de projeto, protocolos PBH/Bombeiros/concessionárias) e **Serviços da obra** (cronograma, produção, inspeções e vistorias lidas das abas existentes).
