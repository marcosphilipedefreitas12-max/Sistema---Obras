# Sistema de Obras

Sistema de gerenciamento das obras: todas as partes da planilha da obra (diário, presença, produção, lançamentos, cronograma, qualidade, custos, equipe…) num só lugar, com menu por rotina e explicação de onde e como lançar em cada tela, mais **demandas** e **fornecedores e empreiteiros** (estilo CRM).

## Como funciona

| Parte | Onde fica | Para quê |
|---|---|---|
| Dados | Planilha Google de cada obra (`Gerenciamento_Obra_*.xlsx` convertida para Planilhas Google) | Banco de dados. O sistema cria as abas **CRM Demandas**, **CRM Fornecedores** e **CRM Interações** e lê Cotações, Contratos, Medições, Lançamentos e Compras. |
| Telas | `apps-script/Sistema.gs` + `apps-script/Modulos.gs` + `apps-script/Sistema.html`, dentro do Apps Script da planilha | O sistema em si. Abre pelo navegador ou celular, com o login Google de cada pessoa. |
| Página de entrada | `docs/index.html` (GitHub Pages) | Lista as obras e leva ao sistema de cada uma. Não guarda nenhum dado. |

**Nenhum dado da obra fica neste repositório.** Quem não tem acesso à planilha não consegue ver nada no sistema.

## Instalar numa obra (uma vez por planilha)

1. Abra a planilha da obra no Google Planilhas → **Extensões → Apps Script**.
2. Ao lado do `Script_Obra.gs`, clique em **+ → Script**, nomeie `Sistema` e cole o conteúdo de `apps-script/Sistema.gs`.
3. De novo **+ → Script**, nomeie `Modulos` e cole `apps-script/Modulos.gs`.
4. Clique em **+ → HTML**, nomeie `Sistema` e cole o conteúdo de `apps-script/Sistema.html`.
5. Salve. Clique em **Implantar → Nova implantação** → engrenagem → **App da Web**:
   - Descrição: `Sistema de Obras`
   - Executar como: **Usuário que acessa o app da Web**
   - Quem pode acessar: **Qualquer pessoa com Conta do Google**
6. Clique em **Implantar**, autorize e copie a **URL do app da Web**.
7. Cole a URL em `docs/index.html` (lista `OBRAS`) — ou peça ao Claude para colar.

Para usar o sistema, cada pessoa precisa ter **acesso de edição à planilha** da obra.

### Atualizar depois de uma mudança no código

Cole os arquivos novos no Apps Script e vá em **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**. A URL continua a mesma.

## Publicar a página de entrada (GitHub Pages)

**Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, pasta `/docs` → Save.**
O endereço fica `https://<usuário>.github.io/<repositório>/`.

## Telas

O menu segue a rotina da obra: **Todo dia** (Diário, Presença, Produção, Lançamentos), **Toda semana** (Planejamento, Cronograma, Estrutura, Diaristas, Monitoramento), **Execução**, **Qualidade e vistorias**, **Custos e compras**, **Contatos e demandas**, **Equipe** e **Cadastros**. A lista completa e os textos de ajuda estão em `SIS_MODULOS` (`Modulos.gs`).

- **Início** — pendências da planilha (aba Menu) com atalho para a tela certa, números principais (Resumo), demandas e retornos do dia.
- **Telas de lançamento** — lista com busca; "+ Novo registro" abre um formulário com a explicação de cada campo (tirada das notas do cabeçalho da planilha). Só grava nas colunas sem fórmula; o que a planilha calcula aparece no fim, só para consulta. Painel "Como lançar" com quando e como preencher.
- **Presença** — P / F / ½ / A por pessoa, gravando na hora.
- **Demandas** — quadro A fazer → Em andamento → Aguardando terceiros → Concluída, com responsável, prazo e histórico automático.
- **Fornecedores** — cadastro, avaliação, contatos e próximos passos, e o histórico da obra (cotações, contratos, medições, lançamentos, compras) puxado pelo nome.
- **Consultas** (Contas a Pagar, Gestão à Vista, Fluxo de Caixa…) — abrem direto na aba da planilha.

## Testar sem o Google

`node tests/teste.js` (com Playwright) abre as telas com dados fictícios de `tests/mock.js` e salva imagens em `tests/saida/`.
