# Sistema de Obras

Sistema de gerenciamento das obras: todas as partes da planilha da obra (diário, presença, produção, lançamentos, cronograma, qualidade, custos, equipe…) num só lugar, com menu por rotina e explicação de onde e como lançar em cada tela, mais **demandas** e **fornecedores e empreiteiros** (estilo CRM).

## Como funciona

| Parte | Onde fica | Para quê |
|---|---|---|
| Dados | Planilha Google de cada obra (`Gerenciamento_Obra_*.xlsx` convertida para Planilhas Google) | Banco de dados. O sistema cria as abas **CRM Demandas**, **CRM Fornecedores** e **CRM Interações** e lê Cotações, Contratos, Medições, Lançamentos e Compras. |
| Telas | `apps-script/Sistema.gs` + `apps-script/Modulos.gs` + `apps-script/Sistema.html`, dentro do Apps Script da planilha | O sistema em si. Abre pelo navegador ou celular, com o login Google de cada pessoa. |
| Página de entrada | `docs/index.html` (GitHub Pages) | Lista as obras e leva ao sistema de cada uma. Não guarda nenhum dado. |

**Nenhum dado da obra fica neste repositório.** Quem não tem acesso à planilha não consegue ver nada no sistema.

## Atualização automática

Projeto separado `atualizador/` (Atualizador.gs + appsscript.json), só do dono. A cada hora baixa `apps-script/Sistema.gs`, `Modulos.gs` e `Sistema.html` do ramo `main`; se mudaram, troca esses arquivos no projeto do sistema (mantém Script_Obra e o manifesto; remove a cópia antiga com outro nome, ex.: "Código"), cria uma versão nova e atualiza a implantação existente — o link não muda. Avisa por e-mail quando atualiza ou quando falha (o sistema continua na versão anterior).

Instalar uma vez: ligar a **API do Google Apps Script** em https://script.google.com/home/usersettings; criar um projeto novo em script.google.com, colar os dois arquivos, preencher `SCRIPT_ID` (projeto do sistema → Configurações → ID do script) e `DEPLOYMENT_ID` (o código AKfycb… da implantação) e executar `instalar`. Depois disso, juntar um pedido (merge) no GitHub já basta para o sistema se atualizar em até 1 hora (ou execute `atualizarAgora`).

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
- **Planejamento Semanal** — "Quadro da semana": setas para trocar de semana, uma linha por atividade e barras nos dias em que ela acontece (Seg a Sáb; Dom se usado), cor pelo status (planejada, concluída, parcial, não concluída), ⚠ para restrição pendente, PPC da semana calculado na hora, "+" no dia para planejar nele, e "Copiar o que não foi concluído para a próxima semana". No celular vira agenda por dia. Os dias ficam na coluna N da aba ("Dias da semana", criada pelo sistema).
- **Presença** — P / ½ / F e "Outro…" (FJ falta justificada, A atestado, FE férias, FG folga, AF afastado, CH chuva/obra parada, TR treinamento, OB outra obra, S suspensão), motivo como nota na célula e nº de pessoas para equipe de empreiteiro. P, ½ e TR contam como dia trabalhado; F e S como falta. Na primeira vez que o Administrador abre a obra, o sistema atualiza a lista suspensa e as fórmulas da planilha (Presença D–F, Pagamento Diaristas E–F, Diário Q–S) para os códigos novos. **Mês inteiro**: folha do mês de todos (filtro por vínculo e busca), totais por pessoa, efetivo por dia, resumo **por empreiteiro** (homens-dia para conferir medição, pela coluna "Empresa / empreiteiro" de Pessoas) e impressão em A4 deitado com campo de assinatura.
- **Demandas** — quadro A fazer → Em andamento → Aguardando terceiros → Concluída, com responsável, prazo e histórico automático.
- **Fornecedores** — cadastro, avaliação, contatos e próximos passos, e o histórico da obra (cotações, contratos, medições, lançamentos, compras) puxado pelo nome.
- **Consultas** (Contas a Pagar, Gestão à Vista, Fluxo de Caixa…) — abrem direto na aba da planilha.

## Relatórios

Menu → **Relatórios** (abaixo do Início). Sai pronto para imprimir ou salvar em PDF, com cabeçalho da obra e campos de assinatura.

- **RDO — Relatório Diário de Obra** (nº = posição do dia no Diário): clima, dia produtivo, efetivo por função e pela folha, equipamentos, serviços executados, produção do dia, ocorrências, qualidade (inspeções e FVS), faltas e ausências com motivo, fotos do dia.
- **Relatório do período** (esta semana / semana passada / este mês / datas livres): avanço físico, dias com diário, efetivo médio e máximo, homens-dia, gráfico de efetivo, serviços executados por dia, produção somada por serviço, ocorrências, qualidade, custos do período por etapa (só para quem vê custos), faltas por tipo, pendências e demandas em aberto e até 12 fotos.

## Assistente (Claude) — desligado por padrão

Botão "✦ Assistente" no menu (e botão flutuante quando ligado). Chat com o Claude pela API da Anthropic que **lê** a planilha da obra (ferramentas `ler_tela`, `relatorio_periodo`, `presenca_mes`) e **propõe** lançamentos e demandas (`propor_lancamento`, `propor_demanda`) — a pessoa confirma na tela e a gravação usa as funções normais, com as permissões do perfil. Custos em R$ não aparecem para quem não vê custos.

Para ligar (Administrador): criar conta e chave em platform.claude.com, abrir o Assistente → Configurar, colar a chave (fica nas propriedades do script, nunca no GitHub), escolher o modelo (Haiku 5.5 econômico / Sonnet 5.5), o limite de perguntas por mês e marcar "Ligado". A tela mostra o uso do mês e o custo estimado. Sem chave ou desligado: nada é chamado nem cobrado.

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
