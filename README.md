# Sistema de Obras

Sistema de gerenciamento das obras (estilo CRM): **demandas**, **fornecedores e empreiteiros** e, nas próximas versões, **projetistas e órgãos** e os **serviços da obra**.

## Como funciona

| Parte | Onde fica | Para quê |
|---|---|---|
| Dados | Planilha Google de cada obra (`Gerenciamento_Obra_*.xlsx` convertida para Planilhas Google) | Banco de dados. O sistema cria as abas **CRM Demandas**, **CRM Fornecedores** e **CRM Interações** e lê Cotações, Contratos, Medições, Lançamentos e Compras. |
| Telas | `apps-script/Sistema.html` + `apps-script/Sistema.gs`, dentro do Apps Script da planilha | O sistema em si. Abre pelo navegador ou celular, com o login Google de cada pessoa. |
| Página de entrada | `docs/index.html` (GitHub Pages) | Lista as obras e leva ao sistema de cada uma. Não guarda nenhum dado. |

**Nenhum dado da obra fica neste repositório.** Quem não tem acesso à planilha não consegue ver nada no sistema.

## Instalar numa obra (uma vez por planilha)

1. Abra a planilha da obra no Google Planilhas → **Extensões → Apps Script**.
2. Ao lado do `Script_Obra.gs`, clique em **+ → Script**, nomeie `Sistema` e cole o conteúdo de `apps-script/Sistema.gs`.
3. Clique em **+ → HTML**, nomeie `Sistema` e cole o conteúdo de `apps-script/Sistema.html`.
4. Salve. Clique em **Implantar → Nova implantação** → engrenagem → **App da Web**:
   - Descrição: `Sistema de Obras`
   - Executar como: **Usuário que acessa o app da Web**
   - Quem pode acessar: **Qualquer pessoa com Conta do Google**
5. Clique em **Implantar**, autorize e copie a **URL do app da Web**.
6. Cole a URL em `docs/index.html` (lista `OBRAS`) — ou peça ao Claude para colar.

Para usar o sistema, cada pessoa precisa ter **acesso de edição à planilha** da obra.

### Atualizar depois de uma mudança no código

Cole os arquivos novos no Apps Script e vá em **Implantar → Gerenciar implantações → lápis → Versão: Nova versão → Implantar**. A URL continua a mesma.

## Publicar a página de entrada (GitHub Pages)

**Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, pasta `/docs` → Save.**
O endereço fica `https://<usuário>.github.io/<repositório>/`.

## Módulos

- **Início** — demandas atrasadas e vencendo, aguardando terceiros, retornos combinados com fornecedores, "comigo".
- **Demandas** — quadro A fazer → Em andamento → Aguardando terceiros → Concluída, com origem, responsável, prazo, prioridade e histórico automático de mudanças.
- **Fornecedores** — cadastro, avaliação (prazo, qualidade, preço), contatos e próximos passos, e o histórico da obra: cotações (e se fechou), contratos, medições, lançamentos e compras, puxados da planilha pelo nome.
