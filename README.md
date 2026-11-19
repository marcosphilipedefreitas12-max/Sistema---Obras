# Sistema de Obras

Sistema de gerenciamento das obras: todas as partes da planilha da obra (diário, presença, produção, lançamentos, cronograma, qualidade, custos, equipe…) num só lugar, com menu por rotina e explicação de onde e como lançar em cada tela, mais **demandas** e **fornecedores e empreiteiros** (estilo CRM).

## Como funciona

| Parte | Onde fica | Para quê |
|---|---|---|
| Dados | Planilha Google de cada obra (`Gerenciamento_Obra_*.xlsx` convertida para Planilhas Google) | Banco de dados. O sistema cria as abas **CRM Demandas**, **CRM Fornecedores** e **CRM Interações** e lê Cotações, Contratos, Medições, Lançamentos e Compras. |
| Telas | `apps-script/Sistema.gs` + `apps-script/Modulos.gs` + `apps-script/Sistema.html`, dentro do Apps Script da planilha | O sistema em si. Abre pelo navegador ou celular, com o login Google de cada pessoa. |
| Página de entrada | `docs/index.html` (GitHub Pages) | Lista as obras e leva ao sistema de cada uma. Não guarda nenhum dado. |

**Nenhum dado da obra fica neste repositório.** Quem não tem acesso à planilha não consegue ver nada no sistema.

## Várias obras

Um único link serve para todas as obras. Cada obra é uma planilha (cópia do Modelo) e a lista de obras fica guardada no próprio script. Como o sistema roda com a conta de quem acessa, **cada pessoa só vê as obras cujas planilhas foram compartilhadas com ela** (Compartilhar → Editor). A diretoria, com acesso a todas, vê todas.

Na tela **Suas obras**: "+ Nova obra a partir do modelo" copia o Modelo, coloca o nome e compartilha com os e-mails informados; "Cadastrar obra existente" inclui uma planilha que já existe; "Tirar da lista" não apaga a planilha. Dentro de uma obra, "Trocar de obra" fica no rodapé do menu.

## Instalar (uma vez)

1. Abra uma planilha de obra no Google Planilhas → **Extensões → Apps Script**.
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

- **Início** — gráficos (avanço físico previsto × real, orçamento × realizado com divisão por tipo, contas a pagar, efetivo diário, equipe por função, orçado × gasto por etapa), pendências da planilha (aba Menu) com atalho para a tela certa, números principais (Resumo), demandas e retornos do dia.
- **Telas de lançamento** — lista com busca; "+ Novo registro" abre um formulário com a explicação de cada campo (tirada das notas do cabeçalho da planilha). Só grava nas colunas sem fórmula; o que a planilha calcula aparece no fim, só para consulta. Painel "Como lançar" com quando e como preencher.
- **Fotos no Diário** — no registro do dia, "📷 Adicionar fotos" (no celular abre a câmera). A foto é reduzida no aparelho e vai para a pasta "Fotos — <obra>" no Google Drive (subpasta por dia); o link da pasta fica na coluna de fotos do Diário. A pasta é compartilhada com quem tem acesso à planilha (o Administrador reforça isso ao salvar os Perfis). Outras telas podem ganhar fotos com `fotos: '<coluna>'` em `SIS_MODULOS`.
- **Presença** — P / ½ / F e "Outro…" (FJ falta justificada, A atestado, FE férias, FG folga, AF afastado, CH chuva/obra parada, TR treinamento, OB outra obra, S suspensão), motivo como nota na célula e nº de pessoas para equipe de empreiteiro. P, ½ e TR contam como dia trabalhado; F e S como falta. Na primeira vez que o Administrador abre a obra, o sistema atualiza a lista suspensa e as fórmulas da planilha (Presença D–F, Pagamento Diaristas E–F, Diário Q–S) para os códigos novos. **Mês inteiro**: folha do mês de todos (filtro por vínculo e busca), totais por pessoa, efetivo por dia, resumo **por empreiteiro** (homens-dia para conferir medição, pela coluna "Empresa / empreiteiro" de Pessoas) e impressão em A4 deitado com campo de assinatura.
- **Demandas** — quadro A fazer → Em andamento → Aguardando terceiros → Concluída, com responsável, prazo e histórico automático.
- **Fornecedores** — cadastro, avaliação, contatos e próximos passos, e o histórico da obra (cotações, contratos, medições, lançamentos, compras) puxado pelo nome.
- **Consultas** (Contas a Pagar, Gestão à Vista, Fluxo de Caixa…) — abrem direto na aba da planilha.

## Perfis de acesso

Em cada obra, o Administrador define em **Perfis de acesso** (menu → Administração) o perfil de cada e-mail; fica na aba `Sistema Perfis` da planilha.

| Perfil | Pode |
|---|---|
| Administrador | Tudo e definir perfis (o dono da planilha é sempre Administrador) |
| Engenheiro | Ver e lançar em todas as telas, inclusive custos |
| Encarregado | Lançar o dia a dia; sem custos, pagamentos, fornecedores e dados das pessoas; não apaga |
| Consulta | Só ver (sem custos); não grava |

Lista vazia = todos como Engenheiro. Com alguém na lista, quem não está nela entra como Consulta. O servidor confere o perfil em cada chamada. A proteção de base continua sendo o compartilhamento da planilha — a implantação deve ser **"Executar como: Usuário que acessa o app da Web"**.

## Tema claro e escuro

Botão no rodapé do menu (no celular, "Tema" no topo). Começa pelo tema do aparelho e lembra a escolha.

## Testar sem o Google

`node tests/teste.js` (com Playwright) abre as telas com dados fictícios de `tests/mock.js` e salva imagens em `tests/saida/`.
