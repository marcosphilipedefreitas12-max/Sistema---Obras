/**
 * SISTEMA DE OBRAS — módulos de cada aba da planilha
 *
 * Cada módulo descreve onde estão os dados de uma aba (linha do cabeçalho, primeira e última linha
 * de dados, coluna que identifica o registro e última coluna usada) e o texto de ajuda que aparece
 * na tela. O sistema só GRAVA em células sem fórmula: o que é automático na planilha continua automático.
 *
 * Para acrescentar uma aba nova: copie um bloco de SIS_MODULOS e ajuste. Colunas por letra.
 */

var SIS_GRUPOS = [
  { id: 'dia', nome: 'Todo dia' },
  { id: 'semana', nome: 'Toda semana' },
  { id: 'exec', nome: 'Execução' },
  { id: 'qual', nome: 'Qualidade e vistorias' },
  { id: 'custo', nome: 'Custos e compras' },
  { id: 'crm', nome: 'Relacionamento' },
  { id: 'equipe', nome: 'Equipe' },
  { id: 'cad', nome: 'Cadastro e consulta' }
];

// tipo: 'tabela' (lista + formulário), 'consulta' (só abre na planilha), 'presenca', 'demandas', 'fornecedores'
var SIS_MODULOS = [
  { id: 'diario', grupo: 'dia', aba: 'Diário de Obra', tipo: 'tabela', hdr: 4, ini: 5, fim: 404, chave: 'A', ult: 'T',
    mostrar: ['A', 'B', 'C', 'K', 'M', 'N', 'O'], ordem: 'desc',
    serve: 'Registro do dia: clima, quantas pessoas de cada função, equipamentos, serviços executados e ocorrências.',
    quando: 'Todo dia, no fim do expediente. Um registro por dia.',
    passos: ['Clique em "Novo registro" e escolha a data.', 'Preencha o clima da manhã e da tarde.', 'Digite quantas pessoas de cada função trabalharam.',
             'Descreva os serviços executados e qualquer ocorrência (visita, acidente, falta de material, chuva).', 'O total de efetivo e as colunas "pela folha" são automáticos.'] },
  { id: 'presenca', grupo: 'dia', aba: 'Presença', tipo: 'presenca',
    serve: 'Presença de cada pessoa cadastrada, dia a dia. Alimenta o pagamento dos diaristas e o custo de mão de obra.',
    quando: 'Todo dia, de manhã, depois de conferir quem chegou.',
    passos: ['Escolha o dia (já abre em hoje).', 'Toque em P (presente), F (falta), ½ (meio dia) ou A (atestado) para cada pessoa.', 'Pessoas novas são cadastradas na tela Pessoas.'] },
  { id: 'producao', grupo: 'dia', aba: 'Produção', tipo: 'tabela', hdr: 5, ini: 6, fim: 1005, chave: 'B', ult: 'R',
    mostrar: ['A', 'B', 'C', 'D', 'G', 'F', 'K', 'M', 'P'], ordem: 'desc',
    serve: 'Quanto cada equipe executou: serviço, local, quantidade e número de pessoas. Mostra a produtividade contra a meta e o valor a medir.',
    quando: 'Todo dia (ou no fim de cada serviço), uma linha por serviço e equipe.',
    passos: ['Escolha o serviço da lista (as metas vêm da tela Serviços).', 'Informe o local (pavimento/unidade), a equipe e, se tiver, o nº do contrato.',
             'Digite a quantidade executada, o nº de pessoas e os dias.', 'Produtividade, % da meta e valor da produção são automáticos.'] },
  { id: 'lancamentos', grupo: 'dia', aba: 'Lançamentos', tipo: 'tabela', hdr: 4, ini: 5, fim: 503, chave: 'C', ult: 'V',
    mostrar: ['A', 'C', 'D', 'H', 'I', 'O', 'P'], ordem: 'desc',
    serve: 'Toda nota, boleto ou pagamento da obra. É a base do custo realizado, do fluxo de caixa e das contas a pagar.',
    quando: 'Sempre que chegar uma nota fiscal ou boleto, e quando ele for pago.',
    passos: ['Data, etapa, descrição, fornecedor, nº da NF e categoria.', 'Valor e vencimento.', 'Escolha o item do orçamento (código) para o custo cair no lugar certo.',
             'Status do pagamento: atualize quando enviar ao financeiro e quando for pago (com a data).', 'Cole a linha digitável ou a chave PIX e o link do comprovante.'] },
  { id: 'contas', grupo: 'dia', aba: 'Contas a Pagar', tipo: 'consulta',
    serve: 'O que vence hoje e nos próximos dias. Só consulta: o status muda em Lançamentos.', quando: 'Toda manhã.' },

  { id: 'planejamento', grupo: 'semana', aba: 'Planejamento Semanal', tipo: 'tabela', hdr: 4, ini: 5, fim: 404, chave: 'B', ult: 'M',
    mostrar: ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'M'], ordem: 'desc',
    serve: 'O que a obra se compromete a fazer na semana e o que foi cumprido (PPC). Mostra os motivos de não cumprir.',
    quando: 'Segunda: planejar. Sexta: marcar o que foi concluído e o motivo do que não foi.',
    passos: ['Segunda: uma linha por atividade, com local, equipe, quantidade e o que precisa antes (restrição).', 'Durante a semana: marque quando a restrição for resolvida.',
             'Sexta: "Concluída?" S ou N; se N, escolha o motivo.', 'Semana e status são automáticos.'] },
  { id: 'cronograma', grupo: 'semana', aba: 'Cronograma', tipo: 'tabela', hdr: 6, ini: 7, fim: 67, chave: 'C', ult: 'N',
    mostrar: ['A', 'B', 'C', 'H', 'I', 'J', 'K', 'L'],
    serve: 'Todas as atividades da obra, com dependências, duração, datas e % concluído.',
    quando: 'Sexta: atualize o % concluído. Mude durações e dependências só quando o planejamento mudar.',
    passos: ['Atualize o "% Concluído" de cada atividade em andamento (lajes são automáticas).', 'Início e término são calculados pelas dependências e pela duração.',
             'Com a chave SIM na tela Quantitativos, a duração vem do cálculo de mão de obra.'] },
  { id: 'estrutura', grupo: 'semana', aba: 'Programação Estrutura', tipo: 'tabela', hdr: 7, ini: 8, fim: 37, chave: 'C', ult: 'O',
    mostrar: ['C', 'E', 'F', 'I', 'J', 'K', 'M', 'N'], novo: false,
    serve: 'Ciclo de cada laje: previsto × real, com farol de atraso.',
    quando: 'No início, na concretagem e no término de cada pavimento.',
    passos: ['Abra o pavimento e preencha a data real de início, da concretagem da laje e do término.', 'Ciclo real, farol e situação são automáticos.'] },
  { id: 'diaristas', grupo: 'semana', aba: 'Pagamento Diaristas', tipo: 'tabela', hdr: 5, ini: 6, fim: 126, chave: 'A', ult: 'I', novo: false,
    mostrar: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    serve: 'Quanto pagar a cada diarista no período, pela presença marcada. Tudo automático.',
    quando: 'Na semana ou quinzena de pagamento. O período é escolhido na própria aba da planilha.' },
  { id: 'monitoramento', grupo: 'semana', aba: 'Monitoramento', tipo: 'tabela', hdr: 4, ini: 5, fim: 304, chave: 'A', ult: 'M',
    mostrar: ['A', 'C', 'E', 'G', 'H', 'J', 'K'], ordem: 'desc',
    serve: 'Leituras dos marcos e fissurômetros nos vizinhos. Avisa quando o deslocamento passa do limite.',
    quando: 'Na frequência definida (diária durante escavação e contenção, semanal depois).',
    passos: ['Uma linha por leitura: instrumento, imóvel, fase da obra, data e leitura atual.', 'Deslocamento, variação e situação são automáticos.'] },

  { id: 'unidades', grupo: 'exec', aba: 'Unidades', tipo: 'tabela', hdr: 4, ini: 5, fim: 199, chave: 'A', ult: 'Z',
    mostrar: ['A', 'B', 'C', 'D', 'X', 'Y', 'Z'],
    serve: 'Cadastro dos apartamentos e lojas e a data em que cada serviço ficou pronto em cada unidade.',
    quando: 'Quando um serviço termina numa unidade.',
    passos: ['Abra a unidade e preencha a data na coluna do serviço que terminou.', 'O % pronto é automático.', 'Unidades novas sempre no fim da lista (as vistorias seguem essa ordem).'] },
  { id: 'estacas', grupo: 'exec', aba: 'Estacas', tipo: 'tabela', hdr: 4, ini: 5, fim: 304, chave: 'A', ult: 'O',
    mostrar: ['A', 'B', 'D', 'F', 'G', 'I', 'L', 'N'],
    serve: 'Uma linha por estaca: locação, perfuração, profundidade, concretagem e volume.',
    quando: 'A cada estaca perfurada e concretada.',
    passos: ['Nº, trecho, diâmetro e profundidade de projeto.', 'Data e profundidade da perfuração, data da concretagem e volume real.', 'Diferença, furo aberto, sobreconsumo e status são automáticos.'] },
  { id: 'tempos', grupo: 'exec', aba: 'Tempos de Serviço', tipo: 'tabela', hdr: 6, ini: 7, fim: 80, chave: 'B', ult: 'X',
    mostrar: ['A', 'B', 'E', 'F', 'G', 'K', 'L', 'O'],
    serve: 'Produtividade SINAPI de cada serviço e quanto tempo ele leva com a equipe informada.',
    quando: 'Ao planejar um serviço ou montar o cronograma.',
    passos: ['Digite a quantidade e o nº de profissionais.', 'Use o fator de ajuste para calibrar com a produção real da equipe.'] },
  { id: 'prazo', grupo: 'exec', aba: 'Prazo e Mão de Obra', tipo: 'consulta',
    serve: 'Duração de cada atividade, término previsto da obra e quantas pessoas de cada função por mês.', quando: 'Para planejar equipes e conferir o prazo.' },
  { id: 'quantitativos', grupo: 'exec', aba: 'Quantitativos', tipo: 'consulta',
    serve: 'Áreas, índices e equipes que alimentam o prazo. As equipes de cada serviço são mudadas aqui.', quando: 'Quando chegar projeto novo ou mudar a equipe.' },
  { id: 'levantamento', grupo: 'exec', aba: 'Levantamento do Projeto', tipo: 'consulta',
    serve: 'Esquadrias, paredes e áreas medidas nas pranchas e nos DXF.', quando: 'Quando sair revisão de projeto.' },
  { id: 'gestao', grupo: 'exec', aba: 'Gestão à Vista', tipo: 'consulta',
    serve: 'Quadro pavimento × serviço para imprimir e pendurar no canteiro.', quando: 'Toda semana.' },

  { id: 'inspecoes', grupo: 'qual', aba: 'Inspeções de Serviço', tipo: 'tabela', hdr: 4, ini: 5, fim: 404, chave: 'B', ult: 'Y',
    mostrar: ['A', 'B', 'C', 'D', 'R', 'S', 'X'], ordem: 'desc',
    serve: 'Uma linha por inspeção feita com o checklist: aprovado ou reprovado, correção e reinspeção.',
    quando: 'Depois de cada inspeção em campo.',
    passos: ['Escolha o serviço e o local.', 'Itens 1 a 12 na ordem do Checklist de Campo: C (conforme), NC (não conforme) ou NA.', 'Se reprovado: descreva o que corrigir, responsável e prazo.', 'Quando reinspecionar e aprovar, preencha a data da reinspeção.'] },
  { id: 'vaptos', grupo: 'qual', aba: 'Vistoria Aptos', tipo: 'tabela', hdr: 4, hdr2: true, ini: 6, fim: 155, chave: 'A', ult: 'AR', novo: false,
    mostrar: ['A', 'B', 'C', 'AI', 'AJ', 'AK', 'AQ'],
    serve: 'Vistoria de entrega de cada apartamento (31 itens), pendências e liberação.',
    quando: 'Na vistoria de entrega e na reinspeção.',
    passos: ['Abra o apartamento e marque cada item: C, NC ou NA.', 'Descreva as pendências com o nº do item, responsável e prazo.', 'Data da reinspeção quando corrigido; data de entrega quando entregar as chaves.'] },
  { id: 'vlojas', grupo: 'qual', aba: 'Vistoria Lojas', tipo: 'tabela', hdr: 4, hdr2: true, ini: 6, fim: 55, chave: 'A', ult: 'AE', novo: false,
    mostrar: ['A', 'B', 'C', 'V', 'W', 'X', 'AD'],
    serve: 'Vistoria de entrega de cada loja (18 itens).', quando: 'Na vistoria de entrega e na reinspeção.',
    passos: ['Mesma lógica dos apartamentos: C, NC ou NA em cada item, pendências e datas.'] },
  { id: 'fvs', grupo: 'qual', aba: 'Qualidade (FVS)', tipo: 'tabela', hdr: 4, ini: 5, fim: 404, chave: 'B', ult: 'J',
    mostrar: ['A', 'B', 'C', 'D', 'E', 'G', 'I'], ordem: 'desc',
    serve: 'Não conformidades avulsas, vistas fora de um checklist.', quando: 'Quando encontrar um problema em campo.',
    passos: ['Data, serviço, local e o que foi visto.', 'Resultado, responsável pela correção e prazo.', 'Data da reinspeção quando corrigido.'] },
  { id: 'biblioteca', grupo: 'qual', aba: 'Biblioteca Checklists', tipo: 'tabela', hdr: 4, ini: 5, fim: 299, chave: 'A', ult: 'F',
    mostrar: ['A', 'B', 'C', 'D', 'E'],
    serve: 'Itens e tolerâncias de cada serviço usados nos checklists.', quando: 'Ao ajustar o padrão da empresa.',
    passos: ['Itens do mesmo serviço ficam em linhas seguidas, com o mesmo nome.', 'Máximo de 12 itens por serviço.'] },
  { id: 'checklist', grupo: 'qual', aba: 'Checklist de Campo', tipo: 'consulta',
    serve: 'Ficha do serviço para imprimir e levar a campo.', quando: 'Antes de cada inspeção.' },
  { id: 'ficha', grupo: 'qual', aba: 'Ficha de Vistoria', tipo: 'consulta',
    serve: 'Ficha de vistoria de uma unidade para imprimir ou para o cliente assinar.', quando: 'Na vistoria e na entrega.' },

  { id: 'analitico', grupo: 'custo', aba: 'Orçamento Analítico', tipo: 'tabela', hdr: 9, ini: 10, fim: 509, chave: 'C', ult: 'S',
    mostrar: ['A', 'B', 'C', 'D', 'E', 'J', 'N', 'P'],
    serve: 'Itens do orçamento: código, quantidade, preço de material e de mão de obra, e quanto já foi gasto.',
    quando: 'Ao montar ou revisar o orçamento.',
    passos: ['Código, etapa, descrição, unidade, quantidade e preços unitários.', 'Totais, curva ABC, contratado, gasto e saldo são automáticos.'] },
  { id: 'cotacoes', grupo: 'custo', aba: 'Cotações', tipo: 'tabela', hdr: 5, ini: 6, fim: 205, chave: 'E', ult: 'AP',
    mostrar: ['A', 'B', 'E', 'AE', 'AF', 'AJ', 'AK', 'AM'], ordem: 'desc',
    serve: 'Propostas de até 4 fornecedores por serviço ou material, com a escolha e a economia.',
    quando: 'Ao pedir orçamentos e ao fechar.',
    passos: ['Data, etapa, item do orçamento, serviço, quantidade e prazo para fechar.', 'Para cada proposta: fornecedor, valor, prazo e condição de pagamento.',
             'Ao fechar: fornecedor escolhido, status e nº do contrato ou pedido.', 'Menor preço, comparação e economia são automáticos.'] },
  { id: 'compras', grupo: 'custo', aba: 'Compras', tipo: 'tabela', hdr: 4, ini: 5, fim: 304, chave: 'B', ult: 'O',
    mostrar: ['A', 'B', 'H', 'G', 'J', 'K', 'M', 'N'], ordem: 'desc',
    serve: 'Pedidos de material: quando precisa na obra, quando foi pedido e quando chegou.',
    quando: 'Ao solicitar, ao pedir e ao receber cada material.',
    passos: ['Material, etapa, quantidade e a data em que precisa na obra.', 'Fornecedor e data do pedido; entrega prevista.', 'Data real de entrega quando chegar. Status e alerta são automáticos.'] },
  { id: 'contratos', grupo: 'custo', aba: 'Contratos', tipo: 'tabela', hdr: 4, ini: 5, fim: 64, chave: 'B', ult: 'V',
    mostrar: ['A', 'B', 'C', 'E', 'I', 'N', 'O'],
    serve: 'Empreiteiros e prestadores: forma de pagamento, valor e quanto já foi medido.',
    quando: 'Ao fechar cada contrato.',
    passos: ['Nº, prestador, serviço, etapa e forma de pagamento (diária, por produção, valor global…).', 'Valor unitário, quantidade prevista, retenção, início e término.', 'Medido, saldo e retido são automáticos pelas Medições.'] },
  { id: 'medicoes', grupo: 'custo', aba: 'Medições', tipo: 'tabela', hdr: 4, ini: 5, fim: 304, chave: 'B', ult: 'S',
    mostrar: ['A', 'B', 'C', 'E', 'J', 'M', 'N'], ordem: 'desc',
    serve: 'Medições de cada contrato: quantidade ou % do período, aprovação e pagamento.',
    quando: 'A cada medição (semanal, quinzenal ou mensal).',
    passos: ['Data, nº do contrato e período.', 'Quantidade medida (ou % se for valor global).', 'Quem aprovou, vencimento, e "Pago?" S com a data quando pagar.'] },
  { id: 'equipamentos', grupo: 'custo', aba: 'Equipamentos', tipo: 'tabela', hdr: 4, ini: 5, fim: 154, chave: 'A', ult: 'M',
    mostrar: ['A', 'B', 'C', 'F', 'G', 'H', 'J', 'L'],
    serve: 'Equipamentos locados: retirada, previsão e devolução, com o custo acumulado.',
    quando: 'Ao receber e ao devolver cada equipamento.',
    passos: ['Equipamento, fornecedor, quantidade, forma de cobrança e valor.', 'Datas de retirada, previsão e devolução.', 'Dias, custo e status são automáticos.'] },
  { id: 'orcamento', grupo: 'custo', aba: 'Orçamento', tipo: 'consulta', serve: 'Orçado × gasto × avanço por etapa.', quando: 'Para acompanhar o custo.' },
  { id: 'fluxo', grupo: 'custo', aba: 'Fluxo de Caixa', tipo: 'consulta', serve: 'Previsto × realizado mês a mês.', quando: 'Mensal.' },
  { id: 'mapa', grupo: 'custo', aba: 'Mapa de Concorrência', tipo: 'consulta', serve: 'Comparação de propostas para imprimir e aprovar.', quando: 'Ao fechar uma cotação.' },

  { id: 'demandas', grupo: 'crm', tipo: 'demandas',
    serve: 'Pedidos e tarefas: da diretoria, projetistas, clientes, vizinhos e da própria equipe, com responsável e prazo.',
    quando: 'Sempre que alguém pedir algo ou surgir uma tarefa.',
    passos: ['"Nova demanda": o que precisa ser feito, quem pediu, responsável e prazo.', 'Mova o cartão conforme anda: A fazer → Em andamento → Aguardando terceiros → Concluída.', 'O histórico de mudanças é gravado sozinho.'] },
  { id: 'fornecedores', grupo: 'crm', tipo: 'fornecedores',
    serve: 'Ficha de cada fornecedor, empreiteiro, projetista ou órgão: contatos, avaliação e tudo o que já foi cotado, contratado e pago.',
    quando: 'Ao conhecer um fornecedor, depois de cada contato e ao fim de cada serviço (avaliação).',
    passos: ['"Importar" cadastra os nomes que já estão nas Cotações, Contratos, Lançamentos e Compras.', 'Registre cada contato e o próximo passo com data: ele aparece no Início no dia certo.', 'Dê notas de prazo, qualidade e preço.'] },

  { id: 'pessoas', grupo: 'equipe', aba: 'Pessoas', tipo: 'tabela', hdr: 5, ini: 6, fim: 125, chave: 'B', ult: 'P',
    mostrar: ['A', 'B', 'C', 'D', 'F', 'G', 'O'],
    serve: 'Cadastro de quem trabalha na obra: vínculo, diária ou salário, PIX e etapa do custo.',
    quando: 'Quando alguém entra ou sai da obra.',
    passos: ['Nome, função, vínculo (fichado, diarista, prestador) e empresa.', 'Forma de pagamento e valor da diária ou salário.', 'Etapa do custo, CPF, PIX e data de entrada.', 'Data de saída quando sair: a pessoa some da Presença.'] },
  { id: 'servicos', grupo: 'equipe', aba: 'Serviços', tipo: 'tabela', hdr: 5, ini: 6, fim: 85, chave: 'A', ult: 'E',
    mostrar: ['A', 'B', 'C', 'D', 'E'],
    serve: 'Lista de serviços com meta de produtividade e preço por produção.',
    quando: 'Ao combinar metas ou preços por produção.',
    passos: ['Serviço, unidade, meta por pessoa/dia, preço por produção e etapa.'] },

  { id: 'painel', grupo: 'cad', aba: 'Painel', tipo: 'consulta', serve: 'Resumo da obra em uma tela.', quando: 'Quando quiser.' },
  { id: 'dados', grupo: 'cad', aba: 'Dados do Projeto', tipo: 'consulta', serve: 'Informações do projeto: áreas, pavimentos, unidades.', quando: 'No início da obra.' },
  { id: 'feriados', grupo: 'cad', aba: 'Feriados', tipo: 'consulta', serve: 'Feriados (não contam como dia útil).', quando: 'No começo do ano.' }
];

/* ---------------------------------------------------------------- config */

function sisConfig_() {
  var ss = sisSS_();
  var gid = {};
  ss.getSheets().forEach(function (s) { gid[s.getName()] = s.getSheetId(); });
  var mods = SIS_MODULOS.filter(function (m) { return !m.aba || gid[m.aba] !== undefined; }).map(function (m) {
    return { id: m.id, grupo: m.grupo, aba: m.aba || '', titulo: m.titulo || m.aba || (m.id === 'demandas' ? 'Demandas' : 'Fornecedores'),
             tipo: m.tipo, serve: m.serve || '', quando: m.quando || '', passos: m.passos || [], novo: m.novo !== false,
             link: m.aba ? ss.getUrl() + '#gid=' + gid[m.aba] : '' };
  });
  return { grupos: SIS_GRUPOS, modulos: mods, url: ss.getUrl() };
}

function sisModulo_(id) {
  var m = SIS_MODULOS.filter(function (x) { return x.id === id; })[0];
  if (!m || m.tipo !== 'tabela') throw new Error('Módulo não encontrado: ' + id);
  return m;
}

function sisColNum_(letra) {
  var n = 0;
  String(letra).toUpperCase().split('').forEach(function (c) { n = n * 26 + (c.charCodeAt(0) - 64); });
  return n;
}
function sisColLetra_(n) {
  var s = '';
  while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

/* ---------------------------------------------------------------- leitura */

/** Colunas (nome, ajuda, automática?, tipo, opções) e as linhas preenchidas de uma aba. */
function sisAbaLer(id) {
  var m = sisModulo_(id);
  var sh = sisSS_().getSheetByName(m.aba);
  var nc = sisColNum_(m.ult), nl = m.fim - m.ini + 1;
  var cab = sh.getRange(m.hdr, 1, 1, nc);
  var nomes = cab.getDisplayValues()[0], notas = cab.getNotes()[0];
  if (m.hdr2) { // cabeçalho em duas linhas (células mescladas): usa a de cima quando a de baixo está vazia
    var cima = sh.getRange(m.hdr - 1, 1, 1, nc), nc2 = cima.getDisplayValues()[0], nt2 = cima.getNotes()[0];
    for (var k = 0; k < nc; k++) if (!String(nomes[k]).trim() && String(nc2[k]).trim().length < 60) { nomes[k] = nc2[k]; notas[k] = notas[k] || nt2[k]; }
  }
  var mod = sh.getRange(m.ini, 1, 1, nc);
  var fmls = mod.getFormulas()[0], fmts = mod.getNumberFormats()[0], dvs = mod.getDataValidations()[0];
  var cols = [];
  for (var c = 0; c < nc; c++) {
    if (!String(nomes[c]).trim()) continue;
    var tipo = 'texto', f = String(fmts[c] || '');
    if (/(^|[^a-z])(d{1,2}|yy|mm\/)/i.test(f) && !/0\.0|#/.test(f)) tipo = 'data';
    else if (/R\$|#|0/.test(f) && f !== '@') tipo = 'numero';
    var ops = [];
    if (dvs[c]) {
      try {
        var t = dvs[c].getCriteriaType(), v = dvs[c].getCriteriaValues();
        if (t === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) ops = v[0];
        else if (t === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE)
          ops = v[0].getDisplayValues().map(function (r) { return r[0]; }).filter(function (x, i, a) { return x && a.indexOf(x) === i; });
      } catch (e) {}
    }
    cols.push({ i: c, letra: sisColLetra_(c + 1), nome: String(nomes[c]).trim(), ajuda: String(notas[c] || ''), auto: !!fmls[c], tipo: tipo, opcoes: ops.slice(0, 300) });
  }
  var rng = sh.getRange(m.ini, 1, nl, nc);
  var disp = rng.getDisplayValues(), vals = rng.getValues();
  var kc = sisColNum_(m.chave) - 1, linhas = [];
  for (var r = 0; r < nl; r++) {
    if (String(disp[r][kc]).trim() === '') continue;
    var bruto = {};
    cols.forEach(function (col) { var v = vals[r][col.i]; if (!col.auto) bruto[col.i] = v instanceof Date ? sisIso_(v) : v; });
    linhas.push({ linha: m.ini + r, d: cols.map(function (col) { return disp[r][col.i]; }), v: bruto });
  }
  if (m.ordem === 'desc') linhas.reverse();
  var ix = function (L) { var n = sisColNum_(L) - 1; for (var k = 0; k < cols.length; k++) if (cols[k].i === n) return k; return -1; };
  return { id: id, aba: m.aba, chave: ix(m.chave), mostrar: (m.mostrar || []).map(ix).filter(function (x) { return x >= 0; }),
           cols: cols, linhas: linhas, livres: nl - linhas.length, novo: m.novo !== false };
}

/* ---------------------------------------------------------------- gravação */

/** Grava só nas colunas SEM fórmula. linha = 0 → primeira linha vazia do intervalo. */
function sisAbaSalvar(id, linha, valores) {
  return sisComTrava_(function () {
    var m = sisModulo_(id);
    var sh = sisSS_().getSheetByName(m.aba);
    var nc = sisColNum_(m.ult), kc = sisColNum_(m.chave);
    if (!linha) {
      if (m.novo === false) throw new Error('Nesta tela não dá para criar linhas novas.');
      var chaves = sh.getRange(m.ini, kc, m.fim - m.ini + 1, 1).getDisplayValues();
      for (var r = 0; r < chaves.length; r++) if (String(chaves[r][0]).trim() === '') { linha = m.ini + r; break; }
      if (!linha) throw new Error('A aba "' + m.aba + '" está cheia (linhas ' + m.ini + ' a ' + m.fim + '). Peça para aumentar.');
    }
    if (linha < m.ini || linha > m.fim) throw new Error('Linha fora da área de dados.');
    var fmls = sh.getRange(linha, 1, 1, nc).getFormulas()[0];
    var fmts = sh.getRange(linha, 1, 1, nc).getNumberFormats()[0];
    Object.keys(valores).forEach(function (k) {
      var c = Number(k);
      if (c < 0 || c >= nc || fmls[c]) return;
      var v = valores[k];
      if (typeof v === 'string') {
        v = v.trim();
        var dm = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dm) v = new Date(Number(dm[1]), Number(dm[2]) - 1, Number(dm[3]));
        else if (v !== '' && /^-?[\d.]*,?\d+%?$/.test(v) && !/^0\d/.test(v) && !/@|[a-z]/i.test(String(fmts[c])))
          v = /%$/.test(v) ? Number(v.replace('%', '').replace(/\./g, '').replace(',', '.')) / 100 : Number(v.replace(/\./g, '').replace(',', '.'));
      }
      sh.getRange(linha, c + 1).setValue(v === null || v === undefined ? '' : v);
    });
    SpreadsheetApp.flush();
    var r = sisAbaLer(id);
    r.salva = linha;
    return r;
  });
}

/** Apaga só o que foi digitado na linha (fórmulas ficam). */
function sisAbaLimpar(id, linha) {
  return sisComTrava_(function () {
    var m = sisModulo_(id);
    if (m.novo === false) throw new Error('Nesta tela as linhas não podem ser apagadas.');
    if (linha < m.ini || linha > m.fim) throw new Error('Linha fora da área de dados.');
    var sh = sisSS_().getSheetByName(m.aba);
    var nc = sisColNum_(m.ult), fmls = sh.getRange(linha, 1, 1, nc).getFormulas()[0];
    for (var c = 0; c < nc; c++) if (!fmls[c]) sh.getRange(linha, c + 1).clearContent();
    return sisAbaLer(id);
  });
}

/* ---------------------------------------------------------------- presença */

function sisPresenca(iso) {
  var ss = sisSS_(), sh = ss.getSheetByName('Presença');
  var nc = sh.getLastColumn();
  var datas = sh.getRange(5, 8, 1, nc - 7).getValues()[0];
  var alvo = iso || sisIso_(new Date()), col = 0;
  for (var i = 0; i < datas.length; i++) if (datas[i] instanceof Date && sisIso_(datas[i]) === alvo) { col = i + 8; break; }
  var pes = sh.getRange(6, 1, 120, 3).getDisplayValues();
  var sit = ss.getSheetByName('Pessoas').getRange(6, 15, 120, 1).getDisplayValues();
  var marc = col ? sh.getRange(6, col, 120, 1).getValues() : [];
  var lista = [];
  pes.forEach(function (p, r) {
    if (!String(p[0]).trim()) return;
    lista.push({ linha: 6 + r, nome: p[0], funcao: p[1], vinculo: p[2], situacao: sit[r][0], valor: col ? String(marc[r][0] || '') : '' });
  });
  var primeira = datas[0] instanceof Date ? sisIso_(datas[0]) : '';
  return { data: alvo, col: col, primeira: primeira, pessoas: lista };
}

function sisPresencaMarcar(linha, col, valor) {
  return sisComTrava_(function () {
    if (linha < 6 || linha > 125 || col < 8) throw new Error('Posição inválida.');
    if (['', 'P', 'F', '½', 'A'].indexOf(valor) < 0) throw new Error('Valor inválido.');
    sisSS_().getSheetByName('Presença').getRange(linha, col).setValue(valor);
    return true;
  });
}

/* ---------------------------------------------------------------- início */

function sisInicio_() {
  var ss = sisSS_(), out = { pend: [], numeros: [], painel: null };
  var mn = ss.getSheetByName('Menu');
  if (mn) {
    var v = mn.getRange(6, 8, 22, 2).getDisplayValues();
    for (var i = 0; i < v.length; i++) {
      if (!v[i][0] || v[i][0].indexOf('Vermelho') === 0) break;
      out.pend.push({ assunto: v[i][0], qtd: v[i][1] });
    }
  }
  var rs = ss.getSheetByName('Resumo'), R = {}, RD = {};
  if (rs) {
    var n = rs.getLastRow(), rg = rs.getRange(1, 1, n, 2), dv = rg.getDisplayValues(), vv = rg.getValues();
    for (var k = 0; k < n; k++) { R[dv[k][0]] = vv[k][1]; RD[dv[k][0]] = dv[k][1]; }
    ['Avanço físico real', 'Avanço físico previsto', 'Orçamento (R$)', 'Realizado (R$)', 'Efetivo no último dia', 'Lajes concluídas',
     'A vencer em 7 dias (R$)', 'Unidades liberadas para entrega'].forEach(function (w) { if (w in RD) out.numeros.push({ campo: w, valor: RD[w] }); });
  }
  try { out.painel = sisPainel_(ss, R, RD); } catch (e) { out.painel = null; }
  return out;
}

/** Dados dos gráficos do Início (lidos da planilha, sem alterar nada). */
function sisPainel_(ss, R, RD) {
  var num = function (x) { return typeof x === 'number' ? x : (Number(String(x || '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0); };
  var p = {
    avanco: { real: num(R['Avanço físico real']), previsto: num(R['Avanço físico previsto']) },
    termino: RD['Término previsto'] || '', inicio: RD['Início da obra'] || '', atrasadas: num(R['Atividades atrasadas']),
    custo: { orcamento: num(R['Orçamento (R$)']), realizado: num(R['Realizado (R$)']),
             partes: [['Mão de obra e serviços', num(R['Mão de obra e serviços (R$)'])], ['Material', num(R['Material (R$)'])], ['Equipamento', num(R['Equipamento (R$)'])]] },
    pagar: [['Mês atual', num(R['A pagar — mês atual (R$)'])], ['Próximo mês', num(R['A pagar — próximo mês (R$)'])], ['Daqui a 2 meses', num(R['A pagar — daqui a 2 meses (R$)'])]],
    vencidas: num(R['Contas vencidas (R$)']),
    equipe: ['Pedreiros', 'Serventes', 'Carpinteiros', 'Armadores', 'Bombeiros (encanadores)', 'Eletricistas', 'Terceiros'].map(function (f) { return [f.replace(' (encanadores)', ''), num(R[f])]; }),
    efetivo: [], etapas: []
  };
  // efetivo dos últimos 30 lançamentos do Diário
  var di = ss.getSheetByName('Diário de Obra');
  if (di) {
    var cab = di.getRange(4, 1, 1, 25).getDisplayValues()[0], cT = cab.indexOf('Total efetivo');
    if (cT >= 0) {
      var vals = di.getRange(5, 1, 400, cT + 1).getValues(), lst = [];
      vals.forEach(function (r) { if (r[0] instanceof Date) lst.push([sisIso_(r[0]), num(r[cT])]); });
      lst.sort(function (a, b) { return a[0] < b[0] ? -1 : 1; });
      p.efetivo = lst.slice(-30);
    }
  }
  // orçado × gasto por etapa (Orçamento Analítico)
  var oa = ss.getSheetByName('Orçamento Analítico');
  if (oa) {
    var c2 = oa.getRange(9, 1, 1, 20).getDisplayValues()[0], cE = c2.indexOf('Etapa'), cO = c2.indexOf('Custo direto (R$)'), cG = c2.indexOf('Gasto (R$)');
    if (cE >= 0 && cO >= 0 && cG >= 0) {
      var et = {}, ordem = [];
      oa.getRange(10, 1, 500, 20).getValues().forEach(function (r) {
        var e = String(r[cE] || '').trim(); if (!e) return;
        if (!et[e]) { et[e] = [0, 0]; ordem.push(e); }
        et[e][0] += num(r[cO]); et[e][1] += num(r[cG]);
      });
      p.etapas = ordem.map(function (e) { return [e, et[e][0], et[e][1]]; }).filter(function (x) { return x[1] || x[2]; });
    }
  }
  return p;
}
