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
  { id: 'diario', grupo: 'dia', aba: 'Diário de Obra', tipo: 'tabela', hdr: 4, ini: 5, fim: 404, chave: 'A', ult: 'T', fotos: 'P',
    mostrar: ['A', 'B', 'C', 'K', 'M', 'N', 'O'], ordem: 'desc',
    serve: 'Registro do dia: clima, quantas pessoas de cada função, equipamentos, serviços executados e ocorrências.',
    quando: 'Todo dia, no fim do expediente. Um registro por dia.',
    passos: ['Clique em "Novo registro" e escolha a data.', 'Preencha o clima da manhã e da tarde.', 'Digite quantas pessoas de cada função trabalharam.',
             'Descreva os serviços executados e qualquer ocorrência (visita, acidente, falta de material, chuva).', 'O total de efetivo e as colunas "pela folha" são automáticos.', 'Fotos: no registro do dia, toque em "Adicionar fotos" (no celular abre a câmera). Elas vão para a pasta de fotos da obra no Google Drive, separadas por dia.'] },
  { id: 'presenca', grupo: 'dia', aba: 'Presença', tipo: 'presenca',
    serve: 'Presença de cada pessoa cadastrada, dia a dia. Alimenta o pagamento dos diaristas e o custo de mão de obra.',
    quando: 'Todo dia, de manhã, depois de conferir quem chegou.',
    passos: ['Escolha o dia (já abre em hoje).', 'Toque em P (presente), ½ (meio período) ou F (falta sem justificativa).',
             'Para outros casos use "Outro…": falta justificada, atestado, férias, folga, afastado, chuva/obra parada, treinamento, outra obra, suspensão.',
             'Em faltas e ausências, escreva o motivo (fica como nota na planilha).', 'Equipe de empreiteiro: digite quantas pessoas vieram.',
             'P, ½ e treinamento contam como dia trabalhado (pagamento do diarista e efetivo do Diário). F e suspensão contam como falta.',
             '"Mês inteiro" mostra a folha do mês de todos, com totais por pessoa, efetivo por dia e o resumo por empreiteiro. Dá para imprimir ou salvar em PDF.',
             'Empreiteiros: cadastre cada trabalhador na tela Pessoas com vínculo "Prestador / empreiteiro" e o nome da empresa, e marque P como os demais. Se não souber os nomes, cadastre uma linha por equipe e digite quantas pessoas vieram no dia.'] },
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
             tipo: m.tipo, fotos: m.fotos ? sisColNum_(m.fotos) - 1 : -1, serve: m.serve || '', quando: m.quando || '', passos: m.passos || [], novo: m.novo !== false,
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
  var marc = col ? sh.getRange(6, col, 120, 1).getValues() : [], notas = col ? sh.getRange(6, col, 120, 1).getNotes() : [];
  var lista = [];
  pes.forEach(function (p, r) {
    if (!String(p[0]).trim()) return;
    lista.push({ linha: 6 + r, nome: p[0], funcao: p[1], vinculo: p[2], situacao: sit[r][0], valor: col ? String(marc[r][0] === 0 ? '' : marc[r][0] || '') : '',
      obs: col ? String(notas[r][0] || '').replace(/ — [^—]*$/, '') : '' });
  });
  var primeira = datas[0] instanceof Date ? sisIso_(datas[0]) : '';
  return { data: alvo, col: col, primeira: primeira, pessoas: lista, codigos: SIS_PRES_COD };
}

/** Folha do mês inteiro (todas as pessoas), para conferência, empreiteiros e impressão. mes = 'yyyy-mm'. */
function sisPresencaMes(mes) {
  var ss = sisSS_(), sh = ss.getSheetByName('Presença'), nc = sh.getLastColumn();
  var datas = sh.getRange(5, 8, 1, nc - 7).getValues()[0], cols = [], dias = [];
  mes = String(mes || sisIso_(new Date()).slice(0, 7));
  for (var i = 0; i < datas.length; i++) if (datas[i] instanceof Date && sisIso_(datas[i]).slice(0, 7) === mes) { cols.push(i + 8); dias.push(sisIso_(datas[i])); }
  var pes = sh.getRange(6, 1, 120, 3).getDisplayValues();
  var cad = ss.getSheetByName('Pessoas').getRange(6, 5, 120, 11).getDisplayValues(); // E empresa … O situação
  var marc = [], notas = [];
  if (cols.length) { var rg = sh.getRange(6, cols[0], 120, cols[cols.length - 1] - cols[0] + 1); marc = rg.getValues(); notas = rg.getNotes(); }
  var lista = [];
  pes.forEach(function (p, r) {
    if (!String(p[0]).trim()) return;
    var v = cols.map(function (c) { var x = marc[r][c - cols[0]]; return x === '' || x === null || x === 0 ? '' : String(x); });
    var n = cols.map(function (c) { return String(notas[r][c - cols[0]] || ''); });
    var sit = cad[r][10];
    if (sit === 'Desligado' && !v.some(function (x) { return x; })) return;
    lista.push({ linha: 6 + r, nome: p[0], funcao: p[1], vinculo: p[2], empresa: cad[r][0], situacao: sit, v: v, obs: n });
  });
  var primeira = datas[0] instanceof Date ? sisIso_(datas[0]) : '';
  return { mes: mes, dias: dias, primeira: primeira, pessoas: lista, codigos: SIS_PRES_COD };
}

/* Códigos da folha de presença. "conta": vale como dia trabalhado (pagamento e efetivo); "falta": falta sem justificativa. */
var SIS_PRES_COD = [
  { c: 'P', nome: 'Presente', conta: 1 },
  { c: '½', nome: 'Meio período', conta: 0.5 },
  { c: 'F', nome: 'Falta (sem justificativa)', falta: true },
  { c: 'FJ', nome: 'Falta justificada / abonada', just: true },
  { c: 'A', nome: 'Atestado médico', just: true },
  { c: 'FE', nome: 'Férias', just: true },
  { c: 'FG', nome: 'Folga / compensação de horas', just: true },
  { c: 'AF', nome: 'Afastado (INSS / acidente)', just: true },
  { c: 'CH', nome: 'Chuva ou obra parada (dispensado)', just: true },
  { c: 'TR', nome: 'Treinamento / integração', conta: 1 },
  { c: 'OB', nome: 'Trabalhando em outra obra', just: true },
  { c: 'S', nome: 'Suspensão', falta: true }
];

function sisPresencaMarcar(linha, col, valor, obs) {
  return sisComTrava_(function () {
    if (linha < 6 || linha > 125 || col < 8) throw new Error('Posição inválida.');
    var ok = valor === '' || SIS_PRES_COD.some(function (x) { return x.c === valor; }) || /^\d{1,3}$/.test(String(valor));
    if (!ok) throw new Error('Código de presença inválido.');
    var cel = sisSS_().getSheetByName('Presença').getRange(linha, col);
    cel.setValue(/^\d+$/.test(String(valor)) ? Number(valor) : valor);
    if (obs !== undefined) cel.setNote(obs ? String(obs).slice(0, 300) + ' — ' + sisUsuario_() : '');
    return true;
  });
}

/*
 * Atualiza UMA VEZ a planilha da obra para os códigos novos (lista suspensa e fórmulas que contam
 * presença: Presença D/E/F, Pagamento Diaristas E/F e Diário de Obra Q/R/S). Só roda para o
 * Administrador, só se a planilha ainda estiver na versão antiga, e só troca fórmulas que reconhece.
 */
function sisPresencaAtualizar_() {
  var ss = sisSS_(), pr = ss.getSheetByName('Presença'); if (!pr) return '';
  var f6 = pr.getRange('F6').getFormula();
  if (!/COUNTIF\(\$H6:\$ALS6,"P"\)/.test(f6)) return ''; // já atualizada (ou planilha diferente)
  var nc = pr.getLastColumn(), FIM = '$ALS';
  var trab = '{"P","TR"}', falt = '{"F","S"}', log = [];
  var linhasD = [], linhasE = [], linhasF = [];
  for (var r = 6; r <= 125; r++) {
    var L = '$H' + r + ':' + FIM + r, mes = ',$H$5:' + FIM + '$5,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),$H$5:' + FIM + '$5,"<="&EOMONTH(TODAY(),0)';
    linhasD.push(['=IF(A' + r + '="","",SUMPRODUCT(COUNTIFS(' + L + ',' + trab + mes + '))+0.5*COUNTIFS(' + L + ',"½"' + mes + ')+SUMIFS(' + L + mes + '))']);
    linhasE.push(['=IF(A' + r + '="","",SUMPRODUCT(COUNTIFS(' + L + ',' + falt + mes + ')))']);
    linhasF.push(['=IF(A' + r + '="","",SUMPRODUCT(COUNTIF(' + L + ',' + trab + '))+0.5*COUNTIF(' + L + ',"½")+SUMIF(' + L + ',">0"))']);
  }
  pr.getRange(6, 4, 120, 1).setFormulas(linhasD); pr.getRange(6, 5, 120, 1).setFormulas(linhasE); pr.getRange(6, 6, 120, 1).setFormulas(linhasF);
  log.push('Presença');
  // lista suspensa com todos os códigos (números continuam aceitos para equipe de empreiteiro)
  var dv = SpreadsheetApp.newDataValidation().requireValueInList(SIS_PRES_COD.map(function (x) { return x.c; }), true).setAllowInvalid(true)
    .setHelpText(SIS_PRES_COD.map(function (x) { return x.c + ' = ' + x.nome; }).join(' · ')).build();
  pr.getRange(6, 8, 120, nc - 7).setDataValidation(dv);
  pr.getRange('D2').setValue('Marque: ' + SIS_PRES_COD.map(function (x) { return x.c + ' = ' + x.nome.toLowerCase(); }).join(' · ') +
    '. P, ½ e TR contam como dia trabalhado; F e S contam como falta. Para equipe de empreiteiro, digite o NÚMERO de pessoas do dia (ex.: 6).');
  // Pagamento Diaristas
  var pg = ss.getSheetByName('Pagamento Diaristas');
  if (pg && /"P",Presença!/.test(pg.getRange('E6').getFormula())) {
    var e = [], f = [];
    for (var r2 = 6; r2 <= 125; r2++) {
      var P = 'Presença!$H' + r2 + ':' + FIM + r2, per = ',Presença!$H$5:' + FIM + '$5,">="&$B$2,Presença!$H$5:' + FIM + '$5,"<="&$D$2';
      e.push(['=IF(A' + r2 + '="","",SUMPRODUCT(COUNTIFS(' + P + ',' + trab + per + '))+0.5*COUNTIFS(' + P + ',"½"' + per + '))']);
      f.push(['=IF(A' + r2 + '="","",SUMPRODUCT(COUNTIFS(' + P + ',' + falt + per + ')))']);
    }
    pg.getRange(6, 5, 120, 1).setFormulas(e); pg.getRange(6, 6, 120, 1).setFormulas(f); log.push('Pagamento Diaristas');
  }
  // Diário de Obra: efetivo pela folha (Q, R, S)
  var di = ss.getSheetByName('Diário de Obra');
  if (di) {
    var fq = di.getRange(5, 17, 400, 3).getFormulas(), mud = false;
    for (var i = 0; i < fq.length; i++) for (var j = 0; j < 3; j++) {
      var g = fq[i][j];
      if (g && /COUNTIFS\(INDEX\(Presença![^"]*\),"P",/.test(g)) {
        fq[i][j] = g.replace(/COUNTIFS\((INDEX\(Presença!\$H\$6:\$ALS\$125,0,MATCH\(\$A\d+,Presença!\$H\$5:\$ALS\$5,0\)\)),"P",(Presença!\$C\$6:\$C\$125,"[^"]+")\)/g, 'SUMPRODUCT(COUNTIFS($1,' + trab + ',$2))');
        mud = true;
      }
    }
    if (mud) { di.getRange(5, 17, 400, 3).setFormulas(fq); log.push('Diário de Obra'); }
  }
  return 'Planilha atualizada para os novos códigos de presença (' + log.join(', ') + ').';
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

/* ---------------------------------------------------------------- fotos (Google Drive) */
/*
 * Cada obra tem uma pasta "Fotos — <obra>" no Drive (guardada nas propriedades do script) com uma
 * subpasta por tela e por registro (ex.: Diário de Obra / 2026-11-18). O link da subpasta vai para a
 * coluna de fotos da linha. A pasta é compartilhada com quem tem acesso à planilha.
 */
function sisPastaObra_(criar) {
  var ss = sisSS_(), k = 'SIS_FOTOS_' + ss.getId(), props = PropertiesService.getScriptProperties(), id = props.getProperty(k);
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { if (!criar) throw new Error('Você ainda não tem acesso à pasta de fotos desta obra. Peça ao administrador para abrir "Perfis de acesso" e salvar (isso libera a pasta para a equipe).'); } }
  if (!criar) return null;
  var pai = null; try { var it = DriveApp.getFileById(ss.getId()).getParents(); if (it.hasNext()) pai = it.next(); } catch (e) {}
  var nome = 'Fotos — ' + (function () { try { return String(ss.getSheetByName('Resumo').getRange('B2').getDisplayValue() || ss.getName()); } catch (e) { return ss.getName(); } })();
  var pasta; try { pasta = pai ? pai.createFolder(nome) : DriveApp.createFolder(nome); } catch (e) { pasta = DriveApp.createFolder(nome); }
  props.setProperty(k, pasta.getId());
  sisFotosCompartilhar_(pasta, ss);
  return pasta;
}
function sisFotosCompartilhar_(pasta, ss) {
  var ed = [], le = [];
  try { ed = ss.getEditors().map(function (u) { return u.getEmail(); }); } catch (e) {}
  try { le = ss.getViewers().map(function (u) { return u.getEmail(); }).filter(function (x) { return ed.indexOf(x) < 0; }); } catch (e) {}
  ed.forEach(function (e) { try { pasta.addEditor(e); } catch (x) {} });
  le.forEach(function (e) { try { pasta.addViewer(e); } catch (x) {} });
}
function sisSubpasta_(pai, nome) { var it = pai.getFoldersByName(nome); return it.hasNext() ? it.next() : pai.createFolder(nome); }
function sisPastaRegistro_(id, chave, criar) {
  var m = sisModulo_(id); if (!m.fotos) throw new Error('Esta tela não tem fotos.');
  var raiz = sisPastaObra_(criar); if (!raiz) return null;
  var tela = criar ? sisSubpasta_(raiz, m.titulo || m.aba) : (function () { var it = raiz.getFoldersByName(m.titulo || m.aba); return it.hasNext() ? it.next() : null; })();
  if (!tela) return null;
  var nome = String(chave || '').replace(/[\\/:*?"<>|]/g, '-').slice(0, 80) || 'sem-identificacao';
  if (criar) return sisSubpasta_(tela, nome);
  var it2 = tela.getFoldersByName(nome); return it2.hasNext() ? it2.next() : null;
}
function sisFotosLista_(pasta) {
  var out = [], it = pasta.getFiles();
  while (it.hasNext()) { var f = it.next(); if (!/^image\//.test(f.getMimeType())) continue;
    out.push({ id: f.getId(), nome: f.getName(), url: 'https://drive.google.com/file/d/' + f.getId() + '/view', quando: sisIso_(f.getDateCreated()) }); }
  out.sort(function (a, b) { return a.nome < b.nome ? -1 : 1; });
  return out;
}

/** Fotos de um registro (chave = data do diário em yyyy-mm-dd). */
function sisFotos(id, chave) {
  var p = null; try { p = sisPastaRegistro_(id, chave, false); } catch (e) { return { fotos: [], pasta: '', erro: e.message }; }
  return { fotos: p ? sisFotosLista_(p) : [], pasta: p ? p.getUrl() : '' };
}

/** Recebe UMA foto (já reduzida no celular/computador) e grava no Drive. linha > 0: grava o link da pasta na planilha. */
function sisFotoEnviar(id, chave, linha, nome, base64) {
  if (!chave) throw new Error('Preencha a data antes de adicionar fotos.');
  var m = sisModulo_(id), pasta = sisPastaRegistro_(id, chave, true);
  var dados = Utilities.base64Decode(String(base64).replace(/^data:[^,]+,/, ''));
  if (dados.length > 8 * 1024 * 1024) throw new Error('Foto grande demais.');
  var arq = pasta.createFile(Utilities.newBlob(dados, 'image/jpeg', String(nome || 'foto.jpg').replace(/[\\/]/g, '-')));
  arq.setDescription('Enviada por ' + sisUsuario_() + ' pelo Sistema de Obras');
  if (linha > 0) {
    sisComTrava_(function () {
      var sh = sisSS_().getSheetByName(m.aba), c = sisColNum_(m.fotos), cel = sh.getRange(linha, c);
      if (!cel.getFormula() && String(cel.getValue()) !== pasta.getUrl()) cel.setValue(pasta.getUrl());
    });
  }
  return { pasta: pasta.getUrl(), foto: { id: arq.getId(), nome: arq.getName(), url: 'https://drive.google.com/file/d/' + arq.getId() + '/view' } };
}

/** Administrador: libera a pasta de fotos para todos que têm acesso à planilha. */
function sisFotosLiberar_() {
  try { var p = sisPastaObra_(false); if (p) sisFotosCompartilhar_(p, sisSS_()); } catch (e) {}
}

/* ---------------------------------------------------------------- relatórios (RDO e período) */
/** Linhas de uma aba entre duas datas (coluna de data = 1ª coluna). Devolve cabeçalho e valores exibidos. */
function sisPeriodo_(ss, aba, hdr, ini, fim, ncols, de, ate) {
  var sh = ss.getSheetByName(aba); if (!sh) return { cab: [], linhas: [] };
  var nc = Math.min(ncols, sh.getLastColumn()), cab = sh.getRange(hdr, 1, 1, nc).getDisplayValues()[0];
  var rg = sh.getRange(ini, 1, fim - ini + 1, nc), vv = rg.getValues(), dd = rg.getDisplayValues(), out = [];
  for (var i = 0; i < vv.length; i++) {
    if (!(vv[i][0] instanceof Date)) continue;
    var d = sisIso_(vv[i][0]); if (d < de || d > ate) continue;
    var l = dd[i].slice(); l[0] = d; out.push(l);
  }
  out.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
  return { cab: cab, linhas: out };
}
function sisFotosBase64_(datas, max, porDia) {
  var out = [];
  try {
    datas.forEach(function (d) {
      if (out.length >= max) return;
      var p = sisPastaRegistro_('diario', d, false); if (!p) return;
      var it = p.getFiles(), n = 0;
      while (it.hasNext() && out.length < max && n < porDia) {
        var f = it.next(); if (!/^image\//.test(f.getMimeType())) continue;
        var b = f.getBlob(); if (b.getBytes().length > 1500000) continue;
        out.push({ data: d, nome: f.getName(), src: 'data:' + f.getMimeType() + ';base64,' + Utilities.base64Encode(b.getBytes()) }); n++;
      }
    });
  } catch (e) {}
  return out;
}
/** tipo: 'rdo' (de = dia) ou 'periodo' (de..ate). */
function sisRelatorio(tipo, de, ate) {
  var ss = sisSS_(), pm = sisPermissoes_(), R = {}, RD = {};
  if (tipo === 'rdo') ate = de;
  if (!de || !ate || de > ate) throw new Error('Escolha as datas do relatório.');
  var rs = ss.getSheetByName('Resumo');
  if (rs) { var n = rs.getLastRow(), dv = rs.getRange(1, 1, n, 2).getDisplayValues(); dv.forEach(function (x) { RD[x[0]] = x[1]; }); }
  var cab = {}; ['Obra', 'Engenheiro', 'Fase atual', 'Avanço físico real', 'Avanço físico previsto', 'Término previsto', 'Início da obra', 'Área construída (m²)',
    'Atividades atrasadas', 'FVS em aberto', 'Inspeções de serviço reprovadas em aberto', 'Lajes concluídas', 'Total de lajes', 'PPC última semana'].forEach(function (k) { cab[k] = RD[k] || ''; });
  var out = { tipo: tipo, de: de, ate: ate, obra: cab, gerado: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'), por: sisUsuario_() };
  out.diario = sisPeriodo_(ss, 'Diário de Obra', 4, 5, 404, 20, de, ate);
  out.producao = sisPeriodo_(ss, 'Produção', 5, 6, 1005, 17, de, ate);
  out.inspecoes = sisPeriodo_(ss, 'Inspeções de Serviço', 4, 5, 404, 25, de, ate);
  out.fvs = sisPeriodo_(ss, 'Qualidade (FVS)', 4, 5, 404, 10, de, ate);
  // número do RDO = posição do dia entre os registros do Diário
  if (tipo === 'rdo') { var todos = sisPeriodo_(ss, 'Diário de Obra', 4, 5, 404, 1, '0000-00-00', de).linhas; out.numero = todos.length; }
  // presença no período: por dia e por vínculo, e as ausências com motivo
  var pr = ss.getSheetByName('Presença');
  if (pr && pm.modulos.indexOf('presenca') >= 0) {
    var nc = pr.getLastColumn(), datas = pr.getRange(5, 8, 1, nc - 7).getValues()[0], cols = [];
    for (var i = 0; i < datas.length; i++) if (datas[i] instanceof Date) { var d = sisIso_(datas[i]); if (d >= de && d <= ate) cols.push([i + 8, d]); }
    var pes = pr.getRange(6, 1, 120, 3).getDisplayValues(), pres = { dias: [], porVinculo: {}, ausencias: [], homensDia: 0, faltas: 0 };
    if (cols.length) {
      var rg = pr.getRange(6, cols[0][0], 120, cols[cols.length - 1][0] - cols[0][0] + 1), mv = rg.getValues(), mn = rg.getNotes();
      cols.forEach(function (c) {
        var j = c[0] - cols[0][0], dia = { data: c[1], trab: 0 };
        pes.forEach(function (p, r) {
          if (!String(p[0]).trim()) return;
          var v = mv[r][j]; if (v === '' || v === null) return;
          var cod = SIS_PRES_COD.filter(function (x) { return x.c === String(v); })[0], w = typeof v === 'number' ? v : (cod && cod.conta) || 0;
          dia.trab += w; pres.homensDia += w; pres.porVinculo[p[2] || 'Outros'] = (pres.porVinculo[p[2] || 'Outros'] || 0) + w;
          if (cod && !cod.conta) { if (cod.falta) pres.faltas++; pres.ausencias.push({ data: c[1], nome: p[0], funcao: p[1], cod: cod.c, desc: cod.nome, obs: String(mn[r][j] || '').replace(/ — [^—]*$/, '') }); }
        });
        pres.dias.push(dia);
      });
    }
    out.presenca = pres;
  }
  // custos do período (só para quem vê custos)
  if (pm.custos) {
    var la = sisPeriodo_(ss, 'Lançamentos', 4, 5, 503, 15, de, ate), ce = la.cab.indexOf('Etapa'), cv = la.cab.indexOf('Valor (R$)'), porEtapa = {}, tot = 0;
    var nb = function (x) { return Number(String(x || '').replace(/[^\d,-]/g, '').replace(',', '.')) || 0; };
    la.linhas.forEach(function (l) { var v = nb(l[cv]); tot += v; var e = l[ce] || 'Sem etapa'; porEtapa[e] = (porEtapa[e] || 0) + v; });
    out.custos = { total: tot, porEtapa: porEtapa, qtd: la.linhas.length, orcamento: RD['Orçamento (R$)'] || '', realizado: RD['Realizado (R$)'] || '',
      vencidas: RD['Contas vencidas (R$)'] || '', aVencer7: RD['A vencer em 7 dias (R$)'] || '' };
  }
  out.pendencias = (sisInicio_().pend || []).filter(function (p) { return Number(String(p.qtd).replace(/[^\d]/g, '')) > 0; });
  var dias = (out.diario.linhas.map(function (l) { return l[0]; }));
  out.fotos = sisFotosBase64_(tipo === 'rdo' ? [de] : dias, tipo === 'rdo' ? 8 : 12, tipo === 'rdo' ? 8 : 2);
  return out;
}
