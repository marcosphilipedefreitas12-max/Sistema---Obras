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
  { id: 'campo', nome: 'Campo', icone: 'capacete' },
  { id: 'plan', nome: 'Planejamento', icone: 'calendario' },
  { id: 'custo', nome: 'Financeiro', icone: 'dinheiro' },
  { id: 'qual', nome: 'Qualidade', icone: 'check' },
  { id: 'equipe', nome: 'Equipe e fornecedores', icone: 'pessoas' },
  { id: 'cad', nome: 'Cadastros', icone: 'pasta' }
];

// tipo: 'tabela' (lista + formulário), 'consulta' (só abre na planilha), 'presenca', 'demandas', 'fornecedores'
var SIS_MODULOS = [
  { id: 'diario', grupo: 'campo', aba: 'Diário de Obra', tipo: 'tabela', hdr: 4, ini: 5, fim: 404, chave: 'A', ult: 'T', fotos: 'P', servicos: 'M', descricao: 'N',
    mostrar: ['A', 'B', 'C', 'K', 'M', 'N', 'O'], ordem: 'desc',
    serve: 'Registro do dia: clima, quantas pessoas de cada função, equipamentos, serviços executados e ocorrências.',
    quando: 'Todo dia, no fim do expediente. Um registro por dia.',
    passos: ['Clique em "Novo registro" e escolha a data.', 'Preencha o clima da manhã e da tarde.', 'Digite quantas pessoas de cada função trabalharam.',
             'Em "Serviços executados", marque na lista as atividades do Cronograma que andaram no dia (pode marcar várias).', 'Em "Ocorrências", descreva o que foi executado (onde e o quê) e qualquer ocorrência (visita, acidente, falta de material, chuva).', 'O total de efetivo e as colunas "pela folha" são automáticos.', 'Fotos: no registro do dia, toque em "Adicionar fotos" (no celular abre a câmera). Elas vão para a pasta de fotos da obra no Google Drive, separadas por dia.'] },
  { id: 'presenca', grupo: 'campo', aba: 'Presença', tipo: 'presenca',
    serve: 'Presença de cada pessoa cadastrada, dia a dia. Alimenta o pagamento dos diaristas e o custo de mão de obra.',
    quando: 'Todo dia, de manhã, depois de conferir quem chegou.',
    passos: ['Escolha o dia (já abre em hoje).', 'Toque em P (presente), ½ (meio período) ou F (falta sem justificativa).',
             'Para outros casos use "Outro…": falta justificada, atestado, férias, folga, afastado, chuva/obra parada, treinamento, outra obra, suspensão.',
             'Em faltas e ausências, escreva o motivo (fica como nota na planilha).', 'Equipe de empreiteiro: digite quantas pessoas vieram.',
             'P, ½ e treinamento contam como dia trabalhado (pagamento do diarista e efetivo do Diário). F e suspensão contam como falta.', 'Hora extra: quem trabalhou ganha o campo "HE"; digite as horas além da jornada (ex.: 17h às 20h = 3). Sábado (compensado na semana) e domingo/feriado são reconhecidos sozinhos.',
             '"Mês inteiro" mostra a folha do mês de todos, com totais por pessoa, efetivo por dia e o resumo por empreiteiro. Dá para imprimir ou salvar em PDF.',
             'Empreiteiros: cadastre cada trabalhador na tela Pessoas com vínculo "Prestador / empreiteiro" e o nome da empresa, e marque P como os demais. Se não souber os nomes, cadastre uma linha por equipe e digite quantas pessoas vieram no dia.'] },
  { id: 'producao', grupo: 'campo', aba: 'Produção', tipo: 'tabela', hdr: 5, ini: 6, fim: 1005, chave: 'B', ult: 'R',
    mostrar: ['A', 'B', 'C', 'D', 'G', 'F', 'K', 'M', 'P'], ordem: 'desc',
    serve: 'Quanto cada equipe executou: serviço, local, quantidade e número de pessoas. Mostra a produtividade contra a meta e o valor a medir.',
    quando: 'Todo dia (ou no fim de cada serviço), uma linha por serviço e equipe.',
    passos: ['Escolha o serviço da lista (as metas vêm da tela Serviços).', 'Informe o local (pavimento/unidade), a equipe e, se tiver, o nº do contrato.',
             'Digite a quantidade executada, o nº de pessoas e os dias.', 'Produtividade, % da meta e valor da produção são automáticos.'] },
  { id: 'lancamentos', grupo: 'custo', aba: 'Lançamentos', tipo: 'tabela', hdr: 4, ini: 5, fim: 503, chave: 'C', ult: 'V',
    mostrar: ['A', 'C', 'D', 'H', 'I', 'O', 'P'], ordem: 'desc',
    serve: 'Toda nota, boleto ou pagamento da obra. É a base do custo realizado, do fluxo de caixa e das contas a pagar.',
    quando: 'Sempre que chegar uma nota fiscal ou boleto, e quando ele for pago.',
    passos: ['Data, etapa, descrição, fornecedor, nº da NF e categoria.', 'Valor e vencimento.', 'Escolha o item do orçamento (código) para o custo cair no lugar certo.',
             'Status do pagamento: atualize quando enviar ao financeiro e quando for pago (com a data).', 'Cole a linha digitável ou a chave PIX e o link do comprovante.'] },
  { id: 'contas', grupo: 'custo', aba: 'Contas a Pagar', tipo: 'consulta',
    serve: 'O que vence hoje e nos próximos dias. Só consulta: o status muda em Lançamentos.', quando: 'Toda manhã.' },

  { id: 'planejamento', grupo: 'plan', aba: 'Planejamento Semanal', tipo: 'tabela', hdr: 4, ini: 5, fim: 404, chave: 'B', ult: 'N', dias: 'N',
    mostrar: ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'M'], ordem: 'desc',
    serve: 'O que a obra se compromete a fazer na semana e o que foi cumprido (PPC). Mostra os motivos de não cumprir.',
    quando: 'Segunda: planejar. Sexta: marcar o que foi concluído e o motivo do que não foi.',
    passos: ['No "Quadro da semana", escolha a semana nas setas e clique em "+ Nova atividade" (ou no dia vazio, para já marcar aquele dia).',
             'Marque os dias em que o serviço acontece (Seg a Sáb). Sem dia marcado, ele aparece na semana toda.',
             'Informe local, equipe, quantidade e o que precisa antes (restrição). Restrição não resolvida aparece com ⚠.',
             'Durante a semana: marque quando a restrição for resolvida.', 'Sexta: "Concluída?" S, Parcial ou N; se não, escolha o motivo. O PPC da semana é calculado na hora.',
             '"Copiar o que não foi concluído" leva para a semana seguinte as atividades que ficaram para trás.'] },
  { id: 'cronograma', grupo: 'plan', aba: 'Cronograma', tipo: 'tabela', hdr: 6, ini: 7, fim: 67, chave: 'C', ult: 'N',
    mostrar: ['A', 'B', 'C', 'H', 'I', 'J', 'K', 'L'],
    serve: 'Todas as atividades da obra, com dependências, duração, datas e % concluído.',
    quando: 'Sexta: atualize o % concluído. Mude durações e dependências só quando o planejamento mudar.',
    passos: ['Atualize o "% Concluído" de cada atividade em andamento (lajes são automáticas).', 'Início e término são calculados pelas dependências e pela duração.',
             'Com a chave SIM na tela Quantitativos, a duração vem do cálculo de mão de obra.'] },
  { id: 'estrutura', grupo: 'campo', aba: 'Programação Estrutura', tipo: 'tabela', hdr: 7, ini: 8, fim: 37, chave: 'C', ult: 'O',
    mostrar: ['C', 'E', 'F', 'I', 'J', 'K', 'M', 'N'], novo: false,
    serve: 'Ciclo de cada laje: previsto × real, com farol de atraso.',
    quando: 'No início, na concretagem e no término de cada pavimento.',
    passos: ['Abra o pavimento e preencha a data real de início, da concretagem da laje e do término.', 'Ciclo real, farol e situação são automáticos.'] },
  { id: 'diaristas', grupo: 'equipe', aba: 'Pagamento Diaristas', tipo: 'diaristas', titulo: 'Pagamentos da equipe',
    serve: 'Diaristas: quanto cada um tem a receber até hoje (pela Presença). Fichados: pagamentos do mês pelo holerite. Em ambos, o que foi lançado e o que já foi pago.',
    quando: 'No dia de pagar (semana ou quinzena) e sempre que quiser conferir o que está em aberto.',
    passos: ['O valor em aberto soma os dias P, ½, TR e chuva (CH: o diarista fica na obra aguardando) ainda não pagos, até hoje. Falta, mesmo com atestado, não é paga.', 'Clique em "Lançar pagamento", confira o período e escolha "Já foi pago" ou "Lançar para pagar".',
             'O pagamento vai também para a aba Lançamentos (Mão de obra), entrando no custo da obra.', 'Quando o financeiro pagar, abra o histórico e clique em "Marcar como pago".',
             'Se o diarista foi fichado (CLT), informe "Diarista até" (o último dia como diarista): os dias depois disso não entram mais.',
             'Aba "Fichados (CLT)": escolha o mês e lance adiantamento, salário e vale-transporte/alimentação com o valor do holerite do RH; depois marque como pago.',
             '"Relatório para o RH" mostra dias trabalhados, faltas, atestados e férias de cada fichado no mês, pronto para imprimir ou salvar em PDF.'] },
  { id: 'monitoramento', grupo: 'campo', aba: 'Monitoramento', tipo: 'tabela', hdr: 4, ini: 5, fim: 304, chave: 'A', ult: 'M',
    mostrar: ['A', 'C', 'E', 'G', 'H', 'J', 'K'], ordem: 'desc',
    serve: 'Leituras dos marcos e fissurômetros nos vizinhos. Avisa quando o deslocamento passa do limite.',
    quando: 'Na frequência definida (diária durante escavação e contenção, semanal depois).',
    passos: ['Uma linha por leitura: instrumento, imóvel, fase da obra, data e leitura atual.', 'Deslocamento, variação e situação são automáticos.'] },

  { id: 'unidades', grupo: 'campo', aba: 'Unidades', tipo: 'tabela', hdr: 4, ini: 5, fim: 199, chave: 'A', ult: 'Z',
    mostrar: ['A', 'B', 'C', 'D', 'X', 'Y', 'Z'],
    serve: 'Cadastro dos apartamentos e lojas e a data em que cada serviço ficou pronto em cada unidade.',
    quando: 'Quando um serviço termina numa unidade.',
    passos: ['Abra a unidade e preencha a data na coluna do serviço que terminou.', 'O % pronto é automático.', 'Unidades novas sempre no fim da lista (as vistorias seguem essa ordem).'] },
  { id: 'estacas', grupo: 'campo', aba: 'Estacas', tipo: 'tabela', hdr: 4, ini: 5, fim: 304, chave: 'A', ult: 'O',
    mostrar: ['A', 'B', 'D', 'F', 'G', 'I', 'L', 'N'],
    serve: 'Uma linha por estaca: locação, perfuração, profundidade, concretagem e volume.',
    quando: 'A cada estaca perfurada e concretada.',
    passos: ['Nº, trecho, diâmetro e profundidade de projeto.', 'Data e profundidade da perfuração, data da concretagem e volume real.', 'Diferença, furo aberto, sobreconsumo e status são automáticos.'] },
  { id: 'tempos', grupo: 'plan', aba: 'Tempos de Serviço', tipo: 'tabela', hdr: 6, ini: 7, fim: 80, chave: 'B', ult: 'X',
    mostrar: ['A', 'B', 'E', 'F', 'G', 'K', 'L', 'O'],
    serve: 'Produtividade SINAPI de cada serviço e quanto tempo ele leva com a equipe informada.',
    quando: 'Ao planejar um serviço ou montar o cronograma.',
    passos: ['Digite a quantidade e o nº de profissionais.', 'Use o fator de ajuste para calibrar com a produção real da equipe.'] },
  { id: 'prazo', grupo: 'plan', aba: 'Prazo e Mão de Obra', tipo: 'consulta',
    serve: 'Duração de cada atividade, término previsto da obra e quantas pessoas de cada função por mês.', quando: 'Para planejar equipes e conferir o prazo.' },
  { id: 'quantitativos', grupo: 'plan', aba: 'Quantitativos', tipo: 'consulta',
    serve: 'Áreas, índices e equipes que alimentam o prazo. As equipes de cada serviço são mudadas aqui.', quando: 'Quando chegar projeto novo ou mudar a equipe.' },
  { id: 'levantamento', grupo: 'plan', aba: 'Levantamento do Projeto', tipo: 'consulta',
    serve: 'Esquadrias, paredes e áreas medidas nas pranchas e nos DXF.', quando: 'Quando sair revisão de projeto.' },
  { id: 'gestao', grupo: 'plan', aba: 'Gestão à Vista', tipo: 'consulta',
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

  { id: 'analitico', grupo: 'custo', custo: true, aba: 'Orçamento Analítico', tipo: 'tabela', hdr: 9, ini: 10, fim: 509, chave: 'C', ult: 'S',
    mostrar: ['A', 'B', 'C', 'D', 'E', 'J', 'N', 'P'],
    serve: 'Itens do orçamento: código, quantidade, preço de material e de mão de obra, e quanto já foi gasto.',
    quando: 'Ao montar ou revisar o orçamento.',
    passos: ['Código, etapa, descrição, unidade, quantidade e preços unitários.', 'Totais, curva ABC, contratado, gasto e saldo são automáticos.'] },
  { id: 'cotacoes', grupo: 'custo', custo: true, aba: 'Cotações', tipo: 'tabela', hdr: 5, ini: 6, fim: 205, chave: 'E', ult: 'AP',
    mostrar: ['A', 'B', 'E', 'AE', 'AF', 'AJ', 'AK', 'AM'], ordem: 'desc',
    serve: 'Propostas de até 4 fornecedores por serviço ou material, com a escolha e a economia.',
    quando: 'Ao pedir orçamentos e ao fechar.',
    passos: ['Data, etapa, item do orçamento, serviço, quantidade e prazo para fechar.', 'Para cada proposta: fornecedor, valor, prazo e condição de pagamento.',
             'Ao fechar: fornecedor escolhido, status e nº do contrato ou pedido.', 'Menor preço, comparação e economia são automáticos.'] },
  { id: 'compras', grupo: 'custo', custo: true, aba: 'Compras', tipo: 'tabela', hdr: 4, ini: 5, fim: 304, chave: 'B', ult: 'O',
    mostrar: ['A', 'B', 'H', 'G', 'J', 'K', 'M', 'N'], ordem: 'desc',
    serve: 'Pedidos de material: quando precisa na obra, quando foi pedido e quando chegou.',
    quando: 'Ao solicitar, ao pedir e ao receber cada material.',
    passos: ['Material, etapa, quantidade e a data em que precisa na obra.', 'Fornecedor e data do pedido; entrega prevista.', 'Data real de entrega quando chegar. Status e alerta são automáticos.'] },
  { id: 'contratos', grupo: 'custo', custo: true, aba: 'Contratos', tipo: 'tabela', hdr: 4, ini: 5, fim: 64, chave: 'B', ult: 'V',
    mostrar: ['A', 'B', 'C', 'E', 'I', 'N', 'O'],
    serve: 'Empreiteiros e prestadores: forma de pagamento, valor e quanto já foi medido.',
    quando: 'Ao fechar cada contrato.',
    passos: ['Nº, prestador, serviço, etapa e forma de pagamento (diária, por produção, valor global…).', 'Valor unitário, quantidade prevista, retenção, início e término.', 'Medido, saldo e retido são automáticos pelas Medições.'] },
  { id: 'medicoes', grupo: 'custo', custo: true, aba: 'Medições', tipo: 'tabela', hdr: 4, ini: 5, fim: 304, chave: 'B', ult: 'S',
    mostrar: ['A', 'B', 'C', 'E', 'J', 'M', 'N'], ordem: 'desc',
    serve: 'Medições de cada contrato: quantidade ou % do período, aprovação e pagamento.',
    quando: 'A cada medição (semanal, quinzenal ou mensal).',
    passos: ['Data, nº do contrato e período.', 'Quantidade medida (ou % se for valor global).', 'Quem aprovou, vencimento, e "Pago?" S com a data quando pagar.'] },
  { id: 'equipamentos', grupo: 'custo', custo: true, aba: 'Equipamentos', tipo: 'tabela', hdr: 4, ini: 5, fim: 154, chave: 'A', ult: 'M',
    mostrar: ['A', 'B', 'C', 'F', 'G', 'H', 'J', 'L'],
    serve: 'Equipamentos locados: retirada, previsão e devolução, com o custo acumulado.',
    quando: 'Ao receber e ao devolver cada equipamento.',
    passos: ['Equipamento, fornecedor, quantidade, forma de cobrança e valor.', 'Datas de retirada, previsão e devolução.', 'Dias, custo e status são automáticos.'] },
  { id: 'orcamento', grupo: 'custo', custo: true, aba: 'Orçamento', tipo: 'consulta', serve: 'Orçado × gasto × avanço por etapa.', quando: 'Para acompanhar o custo.' },
  { id: 'fluxo', grupo: 'custo', custo: true, aba: 'Fluxo de Caixa', tipo: 'consulta', serve: 'Previsto × realizado mês a mês.', quando: 'Mensal.' },
  { id: 'mapa', grupo: 'custo', custo: true, aba: 'Mapa de Concorrência', tipo: 'consulta', serve: 'Comparação de propostas para imprimir e aprovar.', quando: 'Ao fechar uma cotação.' },

  { id: 'demandas', grupo: 'equipe', tipo: 'demandas',
    serve: 'Pedidos e tarefas: da diretoria, projetistas, clientes, vizinhos e da própria equipe, com responsável e prazo.',
    quando: 'Sempre que alguém pedir algo ou surgir uma tarefa.',
    passos: ['"Nova demanda": o que precisa ser feito, quem pediu, responsável e prazo.', 'Mova o cartão conforme anda: A fazer → Em andamento → Aguardando terceiros → Concluída.', 'O histórico de mudanças é gravado sozinho.'] },
  { id: 'fornecedores', grupo: 'equipe', tipo: 'fornecedores',
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
    return { id: m.id, grupo: m.grupo, custo: !!m.custo, aba: m.aba || '', titulo: m.titulo || m.aba || (m.id === 'demandas' ? 'Demandas' : 'Fornecedores'),
             tipo: m.tipo, fotos: m.fotos ? sisColNum_(m.fotos) - 1 : -1, dias: m.dias ? sisColNum_(m.dias) - 1 : -1, servicos: m.servicos ? sisColNum_(m.servicos) - 1 : -1, descricao: m.descricao ? sisColNum_(m.descricao) - 1 : -1, serve: m.serve || '', quando: m.quando || '', passos: m.passos || [], novo: m.novo !== false,
             link: m.aba ? ss.getUrl() + '#gid=' + gid[m.aba] : '' };
  });
  return { grupos: SIS_GRUPOS, modulos: mods, url: ss.getUrl() };
}

function sisModulo_(id) {
  var m = SIS_MODULOS.filter(function (x) { return x.id === id; })[0];
  if (!m || (m.tipo !== 'tabela' && m.tipo !== 'consulta')) throw new Error('Módulo não encontrado: ' + id);
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
  var m = sisModulo_(id); if (m.tipo !== 'tabela') throw new Error('Tela inválida.');
  var sh = sisSS_().getSheetByName(m.aba);
  var nc = sisColNum_(m.ult), nl = m.fim - m.ini + 1;
  var cab = sh.getRange(m.hdr, 1, 1, nc);
  var nomes = cab.getDisplayValues()[0], notas = cab.getNotes()[0];
  if (m.hdr2) { // cabeçalho em duas linhas (células mescladas): usa a de cima quando a de baixo está vazia
    var cima = sh.getRange(m.hdr - 1, 1, 1, nc), nc2 = cima.getDisplayValues()[0], nt2 = cima.getNotes()[0];
    for (var k = 0; k < nc; k++) if (!String(nomes[k]).trim() && String(nc2[k]).trim().length < 60) { nomes[k] = nc2[k]; notas[k] = notas[k] || nt2[k]; }
  }
  if (m.dias) { var di = sisColNum_(m.dias) - 1; if (!String(nomes[di]).trim()) { nomes[di] = 'Dias da semana'; notas[di] = notas[di] || 'Dias em que a atividade acontece. Vazio = semana toda.'; } }
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
  if (m.ordem === 'desc') {
    // mais recente primeiro: pela data da 1ª coluna (quando for data); empate ou sem data, pela linha
    var dt = function (r) { var x = vals[r.linha - m.ini][0]; return x instanceof Date ? x.getTime() : -Infinity; };
    linhas.sort(function (a, b) { var da = dt(a), db = dt(b); return db !== da ? (db > da ? 1 : -1) : b.linha - a.linha; });
  }
  var ix = function (L) { var n = sisColNum_(L) - 1; for (var k = 0; k < cols.length; k++) if (cols[k].i === n) return k; return -1; };
  return { id: id, aba: m.aba, chave: ix(m.chave), mostrar: (m.mostrar || []).map(ix).filter(function (x) { return x >= 0; }),
           cols: cols, linhas: linhas, livres: nl - linhas.length, novo: m.novo !== false };
}

/* ---------------------------------------------------------------- gravação */

/** Grava só nas colunas SEM fórmula. linha = 0 → primeira linha vazia do intervalo. */
function sisAbaSalvar(id, linha, valores) {
  return sisComTrava_(function () {
    var m = sisModulo_(id); if (m.tipo !== 'tabela') throw new Error('Tela inválida.');
    var sh = sisSS_().getSheetByName(m.aba);
    var nc = sisColNum_(m.ult), kc = sisColNum_(m.chave);
    if (!linha) {
      if (m.novo === false) throw new Error('Nesta tela não dá para criar linhas novas.');
      var chaves = sh.getRange(m.ini, kc, m.fim - m.ini + 1, 1).getDisplayValues();
      for (var r = 0; r < chaves.length; r++) if (String(chaves[r][0]).trim() === '') { linha = m.ini + r; break; }
      if (!linha) throw new Error('A aba "' + m.aba + '" está cheia (linhas ' + m.ini + ' a ' + m.fim + '). Peça para aumentar.');
    }
    if (linha < m.ini || linha > m.fim) throw new Error('Linha fora da área de dados.');
    if (m.dias) { var hd = sh.getRange(m.hdr, sisColNum_(m.dias)); if (!String(hd.getValue()).trim()) hd.setValue('Dias da semana').setNote('Dias em que a atividade acontece (Seg, Ter, Qua, Qui, Sex, Sáb, Dom). Vazio = semana toda. Preenchido pelo Sistema de Obras.'); }
    var fmls = sh.getRange(linha, 1, 1, nc).getFormulas()[0];
    var fmts = sh.getRange(linha, 1, 1, nc).getNumberFormats()[0];
    Object.keys(valores).forEach(function (k) {
      var c = Number(k);
      if (c < 0 || c >= nc || fmls[c]) return;
      var v = valores[k];
      if (typeof v === 'string') {
        v = v.trim();
        var dm = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dm) v = sisDia_(Number(dm[1]), Number(dm[2]), Number(dm[3]));
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
    var m = sisModulo_(id); if (m.tipo !== 'tabela') throw new Error('Tela inválida.');
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
  var primeira = datas[0] instanceof Date ? sisIso_(datas[0]) : '', he = sisHeLer_(alvo, alvo);
  lista.forEach(function (p) { var h = he.filter(function (x) { return x.linha === p.linha; })[0]; p.he = h ? h.horas : ''; });
  return { data: alvo, col: col, primeira: primeira, pessoas: lista, codigos: SIS_PRES_COD, heTipo: sisHeTipo_(alvo, sisFeriados_()), heRegras: sisCltCfg_().he };
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
  var he = {}; if (dias.length) sisHeLer_(dias[0], dias[dias.length - 1]).forEach(function (x) { (he[x.linha] = he[x.linha] || {})[x.data] = x.horas; });
  lista.forEach(function (p) { p.he = dias.map(function (d) { return (he[p.linha] || {})[d] || ''; }); });
  return { mes: mes, dias: dias, primeira: primeira, pessoas: lista, codigos: SIS_PRES_COD };
}

/* Códigos da folha de presença. "conta": vale como dia trabalhado (pagamento e efetivo); "falta": falta sem justificativa. */
var SIS_PRES_COD = [
  { c: 'P', nome: 'Presente', conta: 1 },
  { c: '½', nome: 'Meio período', conta: 0.5 },
  { c: 'F', nome: 'Falta (sem justificativa)', falta: true },
  { c: 'FJ', nome: 'Falta justificada (antigo — hoje use A)', just: true, oculto: true },  // só para marcações antigas; falta justificada = atestado (A)
  { c: 'A', nome: 'Atestado médico', just: true },
  { c: 'FE', nome: 'Férias', just: true },
  { c: 'FG', nome: 'Folga / compensação de horas', just: true },
  { c: 'AF', nome: 'Afastado (INSS / acidente)', just: true },
  { c: 'CH', nome: 'Chuva / obra parada (na obra, aguardando)', just: true, diaria: 1 },  // diarista recebe o dia
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
  var dv = SpreadsheetApp.newDataValidation().requireValueInList(SIS_PRES_COD.filter(function (x) { return !x.oculto; }).map(function (x) { return x.c; }), true).setAllowInvalid(true)
    .setHelpText(SIS_PRES_COD.filter(function (x) { return !x.oculto; }).map(function (x) { return x.c + ' = ' + x.nome; }).join(' · ')).build();
  pr.getRange(6, 8, 120, nc - 7).setDataValidation(dv);
  pr.getRange('D2').setValue('Marque: ' + SIS_PRES_COD.filter(function (x) { return !x.oculto; }).map(function (x) { return x.c + ' = ' + x.nome.toLowerCase(); }).join(' · ') +
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
     'A vencer em 7 dias (R$)', 'Unidades liberadas para entrega'].forEach(function (w) { if (w in RD && !(w === 'Orçamento (R$)' && !sisOrcOk_())) out.numeros.push({ campo: w, valor: RD[w] }); });
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
    custo: { orcamento: sisOrcOk_() ? num(R['Orçamento (R$)']) : 0, realizado: num(R['Realizado (R$)']),
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
      p.etapas = sisOrcOk_() ? ordem.map(function (e) { return [e, et[e][0], et[e][1]]; }).filter(function (x) { return x[1] || x[2]; }) : [];
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
  var out = { tipo: tipo, de: de, ate: ate, obra: cab, gerado: Utilities.formatDate(new Date(), sisTz_(), 'dd/MM/yyyy HH:mm'), por: sisUsuario_() };
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
    out.custos = { total: tot, porEtapa: porEtapa, qtd: la.linhas.length, orcamento: sisOrcOk_() ? (RD['Orçamento (R$)'] || '') : 'a definir', realizado: RD['Realizado (R$)'] || '',
      vencidas: RD['Contas vencidas (R$)'] || '', aVencer7: RD['A vencer em 7 dias (R$)'] || '' };
  }
  out.pendencias = (sisInicio_().pend || []).filter(function (p) { return Number(String(p.qtd).replace(/[^\d]/g, '')) > 0; });
  var dias = (out.diario.linhas.map(function (l) { return l[0]; }));
  out.fotos = sisFotosBase64_(tipo === 'rdo' ? [de] : dias, tipo === 'rdo' ? 8 : 12, tipo === 'rdo' ? 8 : 2);
  return out;
}

/* ---------------------------------------------------------------- planejamento: reprogramar */
/** Copia para a semana seguinte as atividades da semana (segunda = seg) que não foram concluídas (Concluída? ≠ S). */
function sisPlanReprogramar(seg) {
  return sisComTrava_(function () {
    var m = sisModulo_('planejamento'), sh = sisSS_().getSheetByName(m.aba), nl = m.fim - m.ini + 1;
    var v = sh.getRange(m.ini, 1, nl, 14).getValues(), ini = sisData_(seg), prox = new Date(ini.getTime() + 7 * 864e5);
    var copiar = [], livres = [];
    v.forEach(function (r, i) {
      if (!String(r[1]).trim()) { livres.push(m.ini + i); return; }
      var d = r[0] instanceof Date ? r[0] : null;
      if (d && sisIso_(d) >= seg && sisIso_(d) < sisIso_(prox) && String(r[8]).trim() !== 'S') copiar.push(r);
    });
    // não duplica o que já foi copiado (mesma atividade e local na semana seguinte)
    var jaTem = {}; v.forEach(function (r) { if (r[0] instanceof Date && sisIso_(r[0]) >= sisIso_(prox) && sisIso_(r[0]) < sisIso_(new Date(prox.getTime() + 7 * 864e5))) jaTem[r[1] + '|' + r[2]] = 1; });
    copiar = copiar.filter(function (r) { return !jaTem[r[1] + '|' + r[2]]; });
    if (copiar.length > livres.length) throw new Error('Não há linhas livres suficientes na aba.');
    copiar.forEach(function (r, i) {
      var L = livres[i];
      sh.getRange(L, 1, 1, 8).setValues([[prox, r[1], r[2], r[3], r[4], r[5], r[6], r[7]]]);
      sh.getRange(L, 11).setValue('Reprogramada da semana de ' + Utilities.formatDate(ini, sisTz_(), 'dd/MM') + (r[10] ? ' — ' + r[10] : ''));
      sh.getRange(L, 14).setValue(r[13] || '');
    });
    var r2 = sisAbaLer('planejamento'); r2.copiadas = copiar.length; return r2;
  });
}

/* ---------------------------------------------------------------- ASSISTENTE (Claude) */
/*
 * Chat com o Claude dentro do sistema. Fica DESLIGADO até o Administrador colar a chave da API
 * (platform.claude.com) na tela do Assistente. A chave fica nas propriedades do script — nunca no GitHub.
 * O assistente só LÊ dados; para gravar, ele PROPÕE e a pessoa confirma na tela (grava pelas funções
 * normais, com as mesmas permissões do perfil).
 */
var SIS_IA_MODELOS = [['claude-haiku-5-5', 'Claude Haiku 5.5 — rápido e econômico'], ['claude-sonnet-5-5', 'Claude Sonnet 5.5 — mais caprichado']];
var SIS_IA_PRECO = { 'claude-haiku-5-5': [0.10, 0.50], 'claude-sonnet-5-5': [2, 10] }; // US$ por milhão de tokens (entrada, saída)

function sisIaProps_() { return PropertiesService.getScriptProperties(); }
function sisIaMes_() { return Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM'); }
function sisIaUso_() { try { return JSON.parse(sisIaProps_().getProperty('SIS_IA_USO_' + sisIaMes_()) || '{}'); } catch (e) { return {}; } }

/** Estado para a tela (sem a chave). */
function sisIaEstado_() {
  var p = sisIaProps_(), chave = p.getProperty('SIS_IA_CHAVE') || '', u = sisIaUso_(), mod = p.getProperty('SIS_IA_MODELO') || SIS_IA_MODELOS[0][0], pr = SIS_IA_PRECO[mod] || [0, 0];
  return { ligado: !!chave && p.getProperty('SIS_IA_LIGADO') === '1', temChave: !!chave, chaveFim: chave ? chave.slice(-4) : '', modelo: mod, modelos: SIS_IA_MODELOS,
    limite: Number(p.getProperty('SIS_IA_LIMITE') || 300), usoMes: { perguntas: u.n || 0, entrada: u.ent || 0, saida: u.sai || 0,
      custoUS: Math.round(((u.ent || 0) * pr[0] + (u.sai || 0) * pr[1]) / 1e3) / 1000 } };
}
function sisIaConfig() { return sisIaEstado_(); }
function sisIaSalvarConfig(c) {
  var p = sisIaProps_();
  if (c.chave) { if (!/^sk-ant-/.test(String(c.chave).trim())) throw new Error('A chave da API começa com "sk-ant-". Confira o que foi colado.'); p.setProperty('SIS_IA_CHAVE', String(c.chave).trim()); }
  if (c.apagarChave) p.deleteProperty('SIS_IA_CHAVE');
  if (c.modelo && SIS_IA_PRECO[c.modelo]) p.setProperty('SIS_IA_MODELO', c.modelo);
  if (c.limite != null) p.setProperty('SIS_IA_LIMITE', String(Math.max(0, Math.min(5000, Number(c.limite) || 0))));
  p.setProperty('SIS_IA_LIGADO', c.ligado ? '1' : '0');
  return sisIaEstado_();
}

/** Ferramentas que o assistente pode usar (só leitura + propostas). */
function sisIaFerramentas_(pm) {
  var mods = SIS_MODULOS.filter(function (m) { return m.tipo === 'tabela' && pm.modulos.indexOf(m.id) >= 0; }).map(function (m) { return m.id; });
  var t = [
    { name: 'ler_tela', description: 'Lê os registros de uma tela/aba da planilha da obra. Use para responder perguntas com dados reais. Telas: ' + mods.join(', ') + '.',
      input_schema: { type: 'object', properties: { tela: { type: 'string', enum: mods }, busca: { type: 'string', description: 'texto para filtrar (opcional)' },
        de: { type: 'string', description: 'data inicial aaaa-mm-dd (opcional, filtra pela 1ª coluna de data)' }, ate: { type: 'string', description: 'data final aaaa-mm-dd (opcional)' } }, required: ['tela'] } },
    { name: 'relatorio_periodo', description: 'Resumo da obra num período: diário (clima, efetivo, serviços, ocorrências), produção, qualidade, presença (homens-dia, ausências)' + (pm.custos ? ', custos' : '') + ' e pendências.',
      input_schema: { type: 'object', properties: { de: { type: 'string' }, ate: { type: 'string' } }, required: ['de', 'ate'] } },
    { name: 'propor_lancamento', description: 'PROPÕE gravar um registro numa tela (não grava: a pessoa confirma na tela). Use os nomes de coluna exatamente como vêm de ler_tela. Datas em aaaa-mm-dd. Para alterar um registro existente, informe a linha.',
      input_schema: { type: 'object', properties: { tela: { type: 'string', enum: mods }, linha: { type: 'integer', description: 'linha da aba (só para alterar)' },
        valores: { type: 'object', description: 'nome da coluna → valor', additionalProperties: { type: 'string' } }, resumo: { type: 'string', description: 'uma frase dizendo o que será gravado' } }, required: ['tela', 'valores', 'resumo'] } }
  ];
  if (pm.modulos.indexOf('presenca') >= 0) t.push({ name: 'presenca_mes', description: 'Folha de presença de um mês (aaaa-mm): código de cada pessoa por dia (P presente, ½ meio, F falta, FJ falta justificada (marcação antiga), A atestado (única falta justificada), FE férias, FG folga, AF afastado, CH chuva, TR treinamento, OB outra obra, S suspensão; número = equipe de empreiteiro).',
    input_schema: { type: 'object', properties: { mes: { type: 'string' } }, required: ['mes'] } });
  if (pm.modulos.indexOf('demandas') >= 0) t.push({ name: 'propor_demanda', description: 'PROPÕE criar uma demanda/tarefa (a pessoa confirma na tela).',
    input_schema: { type: 'object', properties: { titulo: { type: 'string' }, descricao: { type: 'string' }, responsavel: { type: 'string' }, prazo: { type: 'string', description: 'aaaa-mm-dd' }, prioridade: { type: 'string', enum: ['Baixa', 'Média', 'Alta', 'Urgente'] } }, required: ['titulo'] } });
  return t;
}

function sisIaTexto_(t, max) { // tabela compacta para o modelo
  var cab = t.cols.map(function (c) { return c.nome; }), out = ['linha\t' + cab.join('\t')];
  t.linhas.slice(0, max).forEach(function (l) { out.push(l.linha + '\t' + l.d.map(function (x) { return String(x).replace(/\s+/g, ' ').slice(0, 160); }).join('\t')); });
  if (t.linhas.length > max) out.push('… mais ' + (t.linhas.length - max) + ' registro(s); filtre por data ou busca.');
  return out.join('\n');
}

function sisIaFerramenta_(nome, inp, pm, propostas) {
  if (nome === 'ler_tela') {
    if (pm.modulos.indexOf(inp.tela) < 0) return 'Sem permissão para esta tela.';
    var t = sisAbaLer(inp.tela), q = String(inp.busca || '').toLowerCase();
    t.linhas = t.linhas.filter(function (l) {
      var d0 = String(l.v[0] || ''), okD = (!inp.de || d0 >= inp.de) && (!inp.ate || d0 <= inp.ate || !/^\d{4}-/.test(d0));
      if ((inp.de || inp.ate) && !/^\d{4}-/.test(d0)) okD = false;
      return okD && (!q || l.d.join(' ').toLowerCase().indexOf(q) >= 0);
    });
    return sisIaTexto_(t, 80);
  }
  if (nome === 'relatorio_periodo') {
    var r = sisRelatorio('periodo', inp.de, inp.ate); delete r.fotos;
    ['diario', 'producao', 'inspecoes', 'fvs'].forEach(function (k) { if (r[k]) r[k] = { cab: r[k].cab, linhas: r[k].linhas.slice(0, 60) }; });
    return JSON.stringify(r).slice(0, 60000);
  }
  if (nome === 'presenca_mes') {
    var pmz = sisPresencaMes(inp.mes);
    return 'dias: ' + pmz.dias.join(',') + '\n' + pmz.pessoas.map(function (p) { return p.nome + ' (' + p.funcao + ', ' + p.vinculo + (p.empresa ? ', ' + p.empresa : '') + '): ' + p.v.map(function (x) { return x || '-'; }).join(' '); }).join('\n');
  }
  if (nome === 'propor_lancamento') {
    if (pm.modulos.indexOf(inp.tela) < 0 || !pm.grava) return 'Sem permissão para gravar nesta tela.';
    var tt = sisAbaLer(inp.tela), vals = {}, campos = [], nao = [];
    Object.keys(inp.valores || {}).forEach(function (k) {
      var c = tt.cols.filter(function (x) { return x.nome.toLowerCase() === k.toLowerCase(); })[0];
      if (!c || c.auto) { nao.push(k); return; }
      vals[c.i] = String(inp.valores[k]); campos.push({ nome: c.nome, valor: String(inp.valores[k]) });
    });
    if (!campos.length) return 'Nenhuma coluna reconhecida. Colunas que dá para preencher: ' + tt.cols.filter(function (c) { return !c.auto; }).map(function (c) { return c.nome; }).join(' | ');
    propostas.push({ tipo: 'aba', tela: inp.tela, titulo: sisModulo_(inp.tela).titulo || sisModulo_(inp.tela).aba || inp.tela, linha: inp.linha || 0, valores: vals, campos: campos, resumo: inp.resumo || '' });
    return 'Proposta criada e mostrada para a pessoa confirmar.' + (nao.length ? ' Colunas ignoradas (não existem ou são automáticas): ' + nao.join(', ') : '');
  }
  if (nome === 'propor_demanda') {
    if (pm.modulos.indexOf('demandas') < 0 || !pm.grava) return 'Sem permissão para criar demandas.';
    var d = { 'Título': inp.titulo, 'Descrição': inp.descricao || '', 'Responsável': inp.responsavel || '', 'Prazo': inp.prazo || '', 'Prioridade': inp.prioridade || 'Média', 'Status': 'A fazer', 'Origem': 'Assistente' };
    propostas.push({ tipo: 'demanda', titulo: 'Nova demanda', dados: d, campos: Object.keys(d).filter(function (k) { return d[k]; }).map(function (k) { return { nome: k, valor: d[k] }; }), resumo: inp.titulo });
    return 'Proposta de demanda mostrada para a pessoa confirmar.';
  }
  return 'Ferramenta desconhecida.';
}

/** Uma rodada de conversa. historico: [{role:'user'|'assistant', content:'texto'}]. */
function sisIaPerguntar(historico) {
  var p = sisIaProps_(), est = sisIaEstado_(), pm = sisPermissoes_();
  if (!est.ligado) throw new Error('O Assistente está desligado. O administrador pode ligá-lo na tela do Assistente.');
  if (est.usoMes.perguntas >= est.limite) throw new Error('O limite de ' + est.limite + ' perguntas deste mês foi atingido. O administrador pode aumentar na configuração do Assistente.');
  var ss = sisSS_(), rs = ss.getSheetByName('Resumo'), resumo = [];
  if (rs) rs.getRange(1, 1, rs.getLastRow(), 2).getDisplayValues().forEach(function (x) { if (x[0] && x[1] && x[0] !== 'Campo' && (pm.custos || !/R\$/.test(x[0])) && !(/^Orçamento/.test(x[0]) && !sisOrcOk_())) resumo.push(x[0] + ': ' + x[1]); });
  var sistema = 'Você é o assistente do Sistema de Obras, falando em português do Brasil, de forma simples e direta, com um engenheiro ou a equipe de uma obra de construção civil em Belo Horizonte. ' +
    'Hoje é ' + sisIso_(new Date()) + '. Quem pergunta: ' + sisUsuario_() + ' (perfil ' + pm.perfil + '). ' +
    'Use SEMPRE as ferramentas para buscar dados antes de responder sobre números, pessoas, datas ou custos; nunca invente. Se não achar, diga que não achou. ' +
    'Para gravar qualquer coisa, use propor_lancamento ou propor_demanda: você não grava, a pessoa confirma na tela. Ao propor, use os nomes de coluna exatos lidos com ler_tela. ' +
    (pm.custos ? '' : 'Esta pessoa NÃO pode ver valores em R$; não informe custos. ') +
    'Não peça nem repita CPF, PIX ou dados bancários. Respostas curtas; use listas quando ajudar.\n\nRESUMO ATUAL DA OBRA:\n' + resumo.join('\n');
  var msgs = (historico || []).slice(-12).map(function (m) { return { role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 8000) }; });
  var ferr = sisIaFerramentas_(pm), propostas = [], ent = 0, sai = 0, texto = '';
  for (var volta = 0; volta < 6; volta++) {
    var r = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', { method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { 'x-api-key': p.getProperty('SIS_IA_CHAVE'), 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify({ model: est.modelo, max_tokens: 1500, system: sistema, tools: ferr, messages: msgs }) });
    var c = r.getResponseCode(), j = {}; try { j = JSON.parse(r.getContentText()); } catch (e) {}
    if (c !== 200) throw new Error('O Assistente não respondeu (erro ' + c + '): ' + ((j.error && j.error.message) || r.getContentText().slice(0, 200)) +
      (c === 401 ? ' — confira a chave da API.' : c === 402 || /credit|billing/i.test(r.getContentText()) ? ' — confira os créditos/cartão em platform.claude.com.' : ''));
    ent += (j.usage && j.usage.input_tokens) || 0; sai += (j.usage && j.usage.output_tokens) || 0;
    var usos = (j.content || []).filter(function (b) { return b.type === 'tool_use'; });
    texto = (j.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('\n');
    if (j.stop_reason !== 'tool_use' || !usos.length) break;
    msgs.push({ role: 'assistant', content: j.content });
    msgs.push({ role: 'user', content: usos.map(function (u) {
      var res; try { res = sisIaFerramenta_(u.name, u.input || {}, pm, propostas); } catch (e) { res = 'Erro: ' + e.message; }
      return { type: 'tool_result', tool_use_id: u.id, content: String(res) };
    }) });
  }
  sisComTrava_(function () { var u = sisIaUso_(); u.n = (u.n || 0) + 1; u.ent = (u.ent || 0) + ent; u.sai = (u.sai || 0) + sai; p.setProperty('SIS_IA_USO_' + sisIaMes_(), JSON.stringify(u)); });
  return { texto: texto || (propostas.length ? 'Preparei para você conferir:' : 'Não consegui responder agora. Tente reformular.'), propostas: propostas };
}

/* ---------------------------------------------------------------- VISÃO EXECUTIVA */
/** Dados da Visão Executiva de uma obra (a escolhida no filtro). Só leitura. */
function sisExecutivo(obraId, de, ate) {
  if (obraId && obraId !== SIS_OBRA_ID) { SIS_OBRA_ID = String(obraId); SIS_SS = null; SIS_PERFIL = null; SIS_TZ = null; }
  var ss = sisSS_(), pm = sisPermissoes_(), hoje = sisIso_(new Date());
  if (!de) de = sisIso_(new Date(Date.now() - 30 * 864e5)); if (!ate) ate = hoje;
  var num = function (x) { return typeof x === 'number' ? x : (Number(String(x || '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0); };
  var R = {}, RD = {}, rs = ss.getSheetByName('Resumo');
  if (rs) { var n = rs.getLastRow(), rg = rs.getRange(1, 1, n, 2), dv = rg.getDisplayValues(), vv = rg.getValues(); for (var i = 0; i < n; i++) { R[dv[i][0]] = vv[i][1] instanceof Date ? sisIso_(vv[i][1]) : vv[i][1]; RD[dv[i][0]] = dv[i][1]; } }
  var out = { obraId: SIS_OBRA_ID || ss.getId(), obra: sisNomeObra_(ss), de: de, ate: ate, hoje: hoje, custos: pm.custos, perfil: pm.perfil, admin: pm.admin,
    prazoContratual: PropertiesService.getScriptProperties().getProperty('SIS_PRAZO_' + ss.getId()) || '' };
  ['Engenheiro', 'Fase atual', 'Início da obra', 'Término previsto', 'Atividades atrasadas', 'Efetivo médio (7 dias)', 'Lajes concluídas', 'Total de lajes', 'Atraso da estrutura (dias úteis)',
   'Término da estrutura — previsto', 'Término da estrutura — ritmo real', 'PPC última semana', 'PPC médio 4 semanas', 'Produtividade média — % da meta (30 dias)', 'FVS em aberto',
   'Inspeções de serviço reprovadas em aberto', 'Compras atrasadas', 'Unidades liberadas para entrega', 'Total de unidades', 'Unidades entregues ao cliente', 'Área construída (m²)'].forEach(function (k) { out[k] = RD[k] || ''; });
  out.avanco = { real: num(R['Avanço físico real']), previsto: num(R['Avanço físico previsto']) };
  out.orcOk = sisOrcOk_();
  if (pm.custos) out.fin = { orcamento: out.orcOk ? num(R['Orçamento (R$)']) : 0, realizado: num(R['Realizado (R$)']), vencidas: num(R['Contas vencidas (R$)']), aVencer7: num(R['A vencer em 7 dias (R$)']),
    pagarMes: num(R['A pagar — mês atual (R$)']), pagarProx: num(R['A pagar — próximo mês (R$)']), mo: num(R['Mão de obra e serviços (R$)']), material: num(R['Material (R$)']), equip: num(R['Equipamento (R$)']),
    custoFichados: num(R['Custo fichados — estimado (R$)']), custoDiaristas: num(R['Custo diaristas (R$)']), custoPrestadores: num(R['Custo prestadores / empreiteiros (R$)']),
    acimaOrcado: num(R['Itens do orçamento com gasto acima do orçado']), previstoAcum: num(R['Previsto acumulado até o mês atual (R$)']) };
  // curva S
  var cs = ss.getSheetByName('Curva S'); out.curva = [];
  if (cs) cs.getRange(5, 1, Math.max(1, cs.getLastRow() - 4), 3).getValues().forEach(function (r) { if (r[0] instanceof Date && r[1] !== '') out.curva.push([sisIso_(r[0]), num(r[1]), r[2] === '' || r[2] === null ? null : num(r[2])]); });
  // cronograma
  var cr = ss.getSheetByName('Cronograma'); out.crono = [];
  if (cr) cr.getRange(7, 1, 61, 14).getValues().forEach(function (r) {
    if (!String(r[2]).trim()) return;
    out.crono.push({ id: r[0], etapa: String(r[1] || 'Sem etapa'), ativ: String(r[2]), resp: String(r[3] || ''), ini: r[8] instanceof Date ? sisIso_(r[8]) : '', fim: r[9] instanceof Date ? sisIso_(r[9]) : '',
      pct: num(r[10]), status: String(r[11] || ''), prevHoje: num(r[13]) });
  });
  // período: reaproveita o relatório (sem fotos)
  var rel = sisRelatorio('periodo', de, ate); delete rel.fotos;
  out.diario = rel.diario; out.producao = rel.producao; out.presenca = rel.presenca || null; out.pendencias = rel.pendencias; out.inspecoes = rel.inspecoes; out.fvs = rel.fvs;
  if (pm.custos) {
    out.custosPeriodo = rel.custos;
    var la = ss.getSheetByName('Lançamentos'), meses = {}, venc = [];
    if (la) la.getRange(5, 1, 499, 16).getValues().forEach(function (r) {
      if (!(r[0] instanceof Date)) return; var v = num(r[7]), m = sisIso_(r[0]).slice(0, 7), et = String(r[1] || 'Sem etapa');
      meses[m] = meses[m] || {}; meses[m][et] = (meses[m][et] || 0) + v;
      var st = String(r[14] || ''), vto = r[8] instanceof Date ? sisIso_(r[8]) : '';
      if (vto && !/pago/i.test(st) && String(r[9]).toUpperCase() !== 'S') venc.push({ venc: vto, desc: String(r[2]).slice(0, 80), forn: String(r[3] || ''), valor: v, etapa: et });
    });
    out.custoMes = meses; out.contasAbertas = venc.sort(function (a, b) { return a.venc < b.venc ? -1 : 1; }).slice(0, 60);
    var ct = ss.getSheetByName('Contratos'), comp = 0, contr = 0, medido = 0;
    if (ct) ct.getRange(5, 1, 60, 16).getValues().forEach(function (r) { if (!String(r[0]).trim()) return; contr += num(r[8]); medido += num(r[13]); comp += num(r[15]); });
    out.fin.contratado = contr; out.fin.medido = medido; out.fin.comprometido = comp;
    var oa = ss.getSheetByName('Orçamento Analítico'); out.etapasOrc = [];
    if (oa) { var c2 = oa.getRange(9, 1, 1, 20).getDisplayValues()[0], cE = c2.indexOf('Etapa'), cO = c2.indexOf('Custo direto (R$)'), cG = c2.indexOf('Gasto (R$)'), et = {}, ordem = [];
      if (cE >= 0 && cO >= 0 && cG >= 0) oa.getRange(10, 1, 500, 20).getValues().forEach(function (r) { var e = String(r[cE] || '').trim(); if (!e) return; if (!et[e]) { et[e] = [0, 0]; ordem.push(e); } et[e][0] += num(r[cO]); et[e][1] += num(r[cG]); });
      out.etapasOrc = out.orcOk ? ordem.map(function (e) { return [e, et[e][0], et[e][1]]; }).filter(function (x) { return x[1] || x[2]; }) : []; }
    if (!out.orcOk) out.fin.acimaOrcado = 0;
  }
  // planejamento da semana atual e motivos de não cumprimento no período
  var pl = ss.getSheetByName('Planejamento Semanal'), seg = sisIso_(new Date(Date.now() - ((new Date().getDay() + 6) % 7) * 864e5)), semN = 0, motivos = {};
  if (pl) pl.getRange(5, 1, 400, 10).getValues().forEach(function (r) {
    if (!(r[0] instanceof Date) || !String(r[1]).trim()) return; var d = sisIso_(r[0]);
    if (d >= seg && d <= sisIso_(new Date(Date.now() + 6 * 864e5))) semN++;
    if (d >= de && d <= ate && String(r[8]) !== 'S' && r[9]) motivos[r[9]] = (motivos[r[9]] || 0) + 1;
  });
  out.planSemana = semN; out.motivos = motivos;
  try { out.demandasAtrasadas = sisLer_(SIS_ABAS.dem, SIS_COLS.dem).filter(function (d) { return d.Status !== 'Concluída' && d.Prazo && String(d.Prazo) < hoje; })
    .map(function (d) { return { titulo: d['Título'], resp: d['Responsável'], prazo: d.Prazo }; }); } catch (e) { out.demandasAtrasadas = []; }
  out.obras = (sisObras().obras || []).map(function (o) { return { id: o.id, nome: o.nome }; });
  return out;
}

/** Administrador: guarda o prazo contratual da obra (data de entrega prevista em contrato). */
function sisExecPrazo(iso) {
  var ss = sisSS_(), k = 'SIS_PRAZO_' + ss.getId(), p = PropertiesService.getScriptProperties();
  if (iso) p.setProperty(k, String(iso).slice(0, 10)); else p.deleteProperty(k);
  return p.getProperty(k) || '';
}

/* ---------------------------------------------------------------- abas de consulta dentro do sistema */
/** Lê uma aba "de consulta" inteira (valores já calculados) para mostrar no sistema, sem abrir a planilha. */
function sisConsultaLer(id) {
  var m = sisModulo_(id); if (m.tipo !== 'consulta') throw new Error('Tela inválida.');
  var sh = sisSS_().getSheetByName(m.aba); if (!sh) throw new Error('A aba "' + m.aba + '" não existe nesta planilha.');
  var lr = Math.min(Math.max(sh.getLastRow(), 1), 400), lc = Math.min(Math.max(sh.getLastColumn(), 1), 70);
  var rg = sh.getRange(1, 1, lr, lc), d = rg.getDisplayValues(), f = rg.getFormulas(), w = rg.getFontWeights(), bg = rg.getBackgrounds(), dv = rg.getDataValidations();
  var usadas = []; for (var c = 0; c < lc; c++) for (var r = 0; r < lr; r++) if (String(d[r][c]).trim() !== '') { usadas[c] = true; break; }
  var ult = usadas.length; // corta colunas vazias do fim
  var escuro = function (h) { if (!h || h === '#ffffff') return 0; var x = parseInt(h.slice(1), 16), l = 0.299 * (x >> 16) + 0.587 * (x >> 8 & 255) + 0.114 * (x & 255); return l < 110 ? 2 : l < 235 ? 1 : 0; };
  var linhas = [];
  for (var i = 0; i < lr; i++) {
    var cel = [];
    for (var j = 0; j < ult; j++) {
      var v = String(d[i][j]); if (/⌂ MENU/.test(v)) v = '';
      var o = { v: v };
      if (f[i][j]) o.f = 1; if (w[i][j] === 'bold') o.b = 1; var e = escuro(bg[i][j]); if (e) o.e = e;
      var rule = dv[i][j];
      if (rule && !f[i][j]) { try { var t = rule.getCriteriaType(), a = rule.getCriteriaValues();
        if (t == SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) o.op = a[0];
        else if (t == SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) o.op = a[0].getDisplayValues().map(function (x) { return x[0]; }).filter(String).slice(0, 200); } catch (x) {} }
      cel.push(o);
    }
    linhas.push(cel);
  }
  var mesc = []; try { sh.getRange(1, 1, lr, ult || 1).getMergedRanges().forEach(function (mr) { if (mr.getNumColumns() > 1) mesc.push([mr.getRow(), mr.getColumn(), mr.getNumColumns()]); }); } catch (x) {}
  return { id: id, aba: m.aba, linhas: linhas, mesc: mesc, ncol: ult };
}

/** Altera UMA célula (sem fórmula) de uma aba de consulta e devolve a aba recalculada. */
function sisConsultaGravar(id, linha, col, texto) {
  return sisComTrava_(function () {
    var m = sisModulo_(id); if (m.tipo !== 'consulta') throw new Error('Tela inválida.');
    var sh = sisSS_().getSheetByName(m.aba), cel = sh.getRange(linha, col);
    if (linha < 3) throw new Error('Essa parte é o título da aba.');
    if (cel.getFormula()) throw new Error('Esse valor é calculado pela planilha e não pode ser alterado.');
    var v = String(texto == null ? '' : texto).trim(), fmt = String(cel.getNumberFormat() || ''), dm;
    if ((dm = v.match(/^(\d{4})-(\d{2})-(\d{2})$/)) || (dm = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)))
      v = dm[1].length === 4 ? sisDia_(Number(dm[1]), Number(dm[2]), Number(dm[3])) : sisDia_(Number(dm[3]), Number(dm[2]), Number(dm[1]));
    else if (v !== '' && /^-?(R\$\s?)?[\d.]*,?\d+%?$/.test(v) && !/^0\d/.test(v) && !/@/.test(fmt))
      v = /%$/.test(v) ? Number(v.replace(/[^\d,-]/g, '').replace(',', '.')) / 100 : Number(v.replace(/R\$\s?/, '').replace(/\./g, '').replace(',', '.'));
    cel.setValue(v);
    SpreadsheetApp.flush();
    return sisConsultaLer(id);
  });
}


/* ---------------------------------------------------------------- orçamento confirmado? */
/* Enquanto o Administrador não confirmar que os valores do orçamento são os reais, o sistema
   não mostra orçamento, saldo nem orçado por etapa (mostra "a definir"). */
function sisOrcOk_() { try { return PropertiesService.getScriptProperties().getProperty('SIS_ORC_OK_' + sisSS_().getId()) === '1'; } catch (e) { return false; } }
function sisOrcConfirmar(ok) {
  PropertiesService.getScriptProperties().setProperty('SIS_ORC_OK_' + sisSS_().getId(), ok ? '1' : '0');
  return sisOrcOk_();
}


/* ---------------------------------------------------------------- PAGAMENTO DE DIARISTAS */
/* Os pagamentos ficam na própria aba Lançamentos (Mão de obra), com a marca [DIARIAS aaaa-mm-dd a aaaa-mm-dd]
   nas Observações. "Diarista até" (quem virou fichado) fica nas propriedades do script, por obra. */
function sisDiarAte_() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('SIS_DIAR_ATE_' + sisSS_().getId()) || '{}'); } catch (e) { return {}; } }
function sisDiaristas() {
  var ss = sisSS_(), hoje = sisIso_(new Date()), ate = sisDiarAte_(), num = function (x) { return typeof x === 'number' ? x : Number(String(x || '').replace(/[^\d,-]/g, '').replace(',', '.')) || 0; };
  var pe = ss.getSheetByName('Pessoas').getRange(6, 1, 120, 16).getValues();
  var pr = ss.getSheetByName('Presença'), nc = pr.getLastColumn(), datas = pr.getRange(5, 8, 1, nc - 7).getValues()[0].map(function (d) { return d instanceof Date ? sisIso_(d) : ''; });
  var marc = pr.getRange(6, 8, 120, nc - 7).getValues(), prNome = pr.getRange(6, 1, 120, 1).getDisplayValues().map(function (x) { return String(x[0]).trim().toLowerCase(); });
  var la = ss.getSheetByName('Lançamentos'), lv = la.getRange(5, 1, 499, 17).getValues(), pags = {};
  var outrosL = {};
  lv.forEach(function (r, i) {
    var nome = String(r[3] || '').trim().toLowerCase(), m = String(r[11] || '').match(/\[DIARIAS (\d{4}-\d{2}-\d{2}) a (\d{4}-\d{2}-\d{2})\]/);
    if (!m) { if (nome && String(r[5]) === 'Mão de obra' && r[0]) (outrosL[nome] = outrosL[nome] || []).push({ lanc: 5 + i, data: r[0] instanceof Date ? sisIso_(r[0]) : String(r[0]), desc: String(r[2] || ''), valor: num(r[7]), status: String(r[14] || '') }); return; }
    (pags[nome] = pags[nome] || []).push({ lanc: 5 + i, de: m[1], ate: m[2], dias: num(r[6]), valor: num(r[7]),
      status: String(r[14] || 'Lançado'), venc: r[8] instanceof Date ? sisIso_(r[8]) : '', pagoEm: r[15] instanceof Date ? sisIso_(r[15]) : '', forma: String(r[13] || '') });
  });
  var lista = [], outras = [], heTodas = sisHeLer_('2000-01-01', hoje), regras = sisCltCfg_().he;
  pe.forEach(function (p, i) {
    var nome = String(p[1] || '').trim(); if (!nome) return;
    var linha = 6 + i, ehDiar = String(p[3]) === 'Diarista' || ate[linha];
    if (!ehDiar) { outras.push({ linha: linha, nome: nome, vinculo: String(p[3] || '') }); return; }
    var limite = ate[linha] && ate[linha] < hoje ? ate[linha] : hoje, saida = p[13] instanceof Date ? sisIso_(p[13]) : '';
    if (saida && saida < limite) limite = saida;
    var ip = prNome.indexOf(nome.toLowerCase());
    var ps = (pags[nome.toLowerCase()] || []).filter(function (x) { return x.status !== 'Cancelado'; });
    var dias = [];
    datas.forEach(function (d, j) {
      if (ip < 0 || !d || d > limite) return; var v = marc[ip][j]; if (v === '' || v === null) return;
      var cod = SIS_PRES_COD.filter(function (x) { return x.c === String(v); })[0], w = cod ? (cod.conta || cod.diaria || 0) : 0; if (!w) return;  // falta (mesmo com atestado) não é paga ao diarista
      if (ps.some(function (x) { return d >= x.de && d <= x.ate; })) return;
      dias.push([d, w]);
    });
    heTodas.filter(function (x) { return x.linha === linha && x.data <= limite && !ps.some(function (g) { return x.data >= g.de && x.data <= g.ate; }); }).forEach(function (x) {
      var w = sisHeDiarias_(x.horas, regras); if (w) dias.push([x.data, w, 'HE', x.horas]);
    });
    dias.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
    var diaria = num(p[6]), q = dias.reduce(function (a, x) { return a + x[1]; }, 0);
    lista.push({ linha: linha, nome: nome, funcao: String(p[2] || ''), vinculo: String(p[3] || ''), pagamento: String(p[5] || ''), diaria: diaria, etapa: String(p[9] || ''),
      temPix: !!String(p[11] || '').trim(), situacao: String(p[14] || ''), diaristaAte: ate[linha] || '',
      aberto: { dias: dias, qtd: q, valor: q * diaria, de: dias.length ? dias[0][0] : '', ate: dias.length ? dias[dias.length - 1][0] : '' },
      semPresenca: ip < 0, outros: outrosL[nome.toLowerCase()] || [],
      pagamentos: (pags[nome.toLowerCase()] || []).sort(function (a, b) { return a.de < b.de ? 1 : -1; }) });
  });
  if (!sisPermissoes_().custos) lista.forEach(function (p) { p.diaria = 0; p.aberto.valor = 0; p.pagamentos.forEach(function (x) { x.valor = 0; }); p.outros.forEach(function (x) { x.valor = 0; }); });
  return { hoje: hoje, pessoas: lista, outras: outras, heRegras: regras };
}
/** Lança (e opcionalmente já dá como pago) as diárias em aberto de uma pessoa entre de e ate. */
function sisDiaristaLancar(linha, de, ate, data, forma, pago) {
  {
    var r = sisDiaristas(), p = r.pessoas.filter(function (x) { return x.linha === linha; })[0];
    if (!p) throw new Error('Pessoa não encontrada.');
    var dias = p.aberto.dias.filter(function (d) { return d[0] >= de && d[0] <= ate; }), q = dias.reduce(function (a, x) { return a + x[1]; }, 0);
    if (!q) throw new Error('Não há diárias em aberto nesse período.');
    if (!p.diaria) throw new Error('Falta o valor da diária de ' + p.nome + ' na tela Pessoas.');
    var d1 = dias[0][0], d2 = dias[dias.length - 1][0], br = function (x) { return x.slice(8) + '/' + x.slice(5, 7); };
    var pix = String(sisSS_().getSheetByName('Pessoas').getRange(linha, 12).getValue() || '');
    var v = { 0: r.hoje, 1: p.etapa || '', 2: 'Diárias — ' + p.nome + ' (' + br(d1) + ' a ' + br(d2) + ', ' + q + ' dia(s))', 3: p.nome, 5: 'Mão de obra', 6: q, 7: q * p.diaria,
      11: '[DIARIAS ' + d1 + ' a ' + d2 + '] Lançado pelo sistema por ' + sisUsuario_(), 13: forma || 'PIX' };
    sisSituacao_(v, pago, data, r.hoje); if (pix) v[16] = pix;
    sisAbaSalvar('lancamentos', 0, v);
    return sisDiaristas();
  }
}
function sisDiaristaLanc_(lanc) {
  var obs = String(sisSS_().getSheetByName('Lançamentos').getRange(lanc, 12).getValue());
  if (!/\[(DIARIAS|CLT) /.test(obs)) throw new Error('Esse lançamento não é de diárias nem de fichado.');
}
var SIS_SIT_PAG = ['Lançado', 'Enviado ao financeiro', 'Agendado', 'Pago'];
/** Situação do pagamento: Lançado / Enviado ao financeiro / Agendado (com previsão em Vencimento) ou Pago (data do pagamento). */
function sisSituacao_(v, sit, data, hoje) {
  if (sit === true) sit = 'Pago'; if (!sit || sit === false) sit = 'Lançado';
  if (SIS_SIT_PAG.indexOf(sit) < 0) throw new Error('Situação inválida.');
  v[14] = sit;
  if (sit === 'Pago') { v[15] = data || hoje; v[8] = data || hoje; } else if (data) v[8] = data;  // vencimento = previsão de pagamento
}
/** Marca como pago. Se o valor pago for menor que o lançado, divide: esta linha fica com o que foi pago e uma linha nova fica com o saldo. */
function sisDiaristaPago(lanc, data, valor) {
  return sisComTrava_(function () {
    sisDiaristaLanc_(lanc);
    var sh = sisSS_().getSheetByName('Lançamentos'), r = sh.getRange(lanc, 1, 1, 18).getValues()[0], f = sh.getRange(lanc, 1, 1, 18).getFormulas()[0];
    var total = Number(r[7]) || 0, pg = valor === undefined || valor === null || valor === '' ? total : Number(String(valor).replace(/\./g, '').replace(',', '.'));
    if (typeof valor === 'number') pg = valor;
    if (!(pg > 0)) throw new Error('Informe o valor pago.');
    pg = Math.round(pg * 100) / 100; if (pg > total + 0.005) throw new Error('O valor pago é maior que o lançado (R$ ' + total.toFixed(2).replace('.', ',') + ').');
    var dt = data || sisIso_(new Date());
    if (pg < total - 0.005) {
      var resto = Math.round((total - pg) * 100) / 100, qtd = Number(r[6]) || 0, novo = {};
      r.forEach(function (x, i) { if (!f[i] && x !== '' && x !== null) novo[i] = x instanceof Date ? sisIso_(x) : x; });
      novo[7] = resto; if (qtd) novo[6] = Math.round(qtd * resto / total * 100) / 100; novo[14] = 'Lançado'; delete novo[15];
      novo[11] = String(r[11] || '') + ' (saldo: pago R$ ' + pg.toFixed(2).replace('.', ',') + ' em ' + dt.slice(8) + '/' + dt.slice(5, 7) + ')';
      sisAbaSalvar('lancamentos', lanc, { 7: pg, 6: qtd ? Math.round(qtd * pg / total * 100) / 100 : '', 14: 'Pago', 15: dt, 11: String(r[11] || '') + ' (parcela paga; saldo em outra linha)' });
      sisAbaSalvar('lancamentos', 0, novo);
    } else sisAbaSalvar('lancamentos', lanc, { 14: 'Pago', 15: dt });
    return sisDiaristas();
  });
}
/** Previsão de pagamento (o financeiro informa): grava no Vencimento e muda a situação. */
function sisDiaristaPrevisao(lanc, data, sit) {
  sisDiaristaLanc_(lanc); if (sit && ['Lançado', 'Enviado ao financeiro', 'Agendado'].indexOf(sit) < 0) throw new Error('Situação inválida.');
  var v = {}; if (data) v[8] = data; if (sit) v[14] = sit; if (!data && !sit) throw new Error('Nada para salvar.');
  sisAbaSalvar('lancamentos', lanc, v); return sisDiaristas();
}
function sisDiaristaCancelar(lanc) { sisDiaristaLanc_(lanc); sisAbaSalvar('lancamentos', lanc, { 14: 'Cancelado' }); return sisDiaristas(); }
function sisDiaristaAte(linha, iso) {
  var a = sisDiarAte_(); if (iso) a[linha] = String(iso).slice(0, 10); else delete a[linha];
  PropertiesService.getScriptProperties().setProperty('SIS_DIAR_ATE_' + sisSS_().getId(), JSON.stringify(a));
  return sisDiaristas();
}


/* ---------------------------------------------------------------- FICHADOS (CLT) */
/* O valor vem do holerite do RH (digitado); o sistema só controla lançado → pago e junta a presença do mês.
   Pagamentos = linhas da aba Lançamentos com [CLT aaaa-mm TIPO] nas Observações (TIPO: ADIANTAMENTO, SALARIO, BENEFICIOS). */
var SIS_CLT_TIPOS = { ADIANTAMENTO: 'Adiantamento (vale)', SALARIO: 'Salário do mês', BENEFICIOS: 'Vale-transporte / alimentação' };
function sisFichados(mes) {
  var ss = sisSS_(), ate = sisDiarAte_(), pm = sisPermissoes_();
  mes = String(mes || sisIso_(new Date()).slice(0, 7)).slice(0, 7);
  var num = function (x) { return typeof x === 'number' ? x : Number(String(x || '').replace(/[^\d,-]/g, '').replace(',', '.')) || 0; };
  var iso = function (x) { return x instanceof Date ? sisIso_(x) : ''; };
  var pe = ss.getSheetByName('Pessoas').getRange(6, 1, 120, 16).getValues();
  var pres = sisPresencaMes(mes), porLinha = {}; pres.pessoas.forEach(function (x) { porLinha[x.linha] = x; });
  var lv = ss.getSheetByName('Lançamentos').getRange(5, 1, 499, 17).getValues(), pags = {};
  lv.forEach(function (r, i) {
    var m = String(r[11] || '').match(/\[CLT (\d{4}-\d{2}) (ADIANTAMENTO|SALARIO|BENEFICIOS)\]/); if (!m || m[1] !== mes) return;
    var nome = String(r[3] || '').trim().toLowerCase();
    (pags[nome] = pags[nome] || []).push({ lanc: 5 + i, tipo: m[2], valor: pm.custos ? num(r[7]) : 0, status: String(r[14] || 'Lançado'), venc: iso(r[8]), pagoEm: iso(r[15]), forma: String(r[13] || '') });
  });
  var fimMes = new Date(Date.UTC(Number(mes.slice(0, 4)), Number(mes.slice(5, 7)), 0)).toISOString().slice(0, 10), iniMes = mes + '-01', lista = [];
  var fer = sisFeriados_(), heMes = sisHeLer_(iniMes, fimMes);
  pe.forEach(function (p, i) {
    var nome = String(p[1] || '').trim(), linha = 6 + i; if (!nome) return;
    var clt = /fichado|clt/i.test(String(p[3])), adm = ate[linha] ? sisMaisDias_(ate[linha], 1) : (clt ? iso(p[12]) : '');
    if (!clt && !ate[linha]) return;
    var saida = iso(p[13]);
    if (adm && adm > fimMes) return; if (saida && saida < iniMes) return;
    var pr = porLinha[linha], cont = {}, datas = {}, obs = [];
    if (pr) pr.v.forEach(function (v, j) {
      var d = pres.dias[j]; if (!v || (adm && d < adm) || (saida && d > saida)) return;
      cont[v] = (cont[v] || 0) + 1; (datas[v] = datas[v] || []).push(d);
      if (pr.obs[j]) obs.push(d.slice(8) + '/' + d.slice(5, 7) + ' ' + v + ': ' + pr.obs[j]);
    });
    lista.push({ linha: linha, nome: nome, funcao: String(p[2] || ''), vinculo: String(p[3] || ''), empresa: String(p[4] || ''), salario: pm.custos ? num(p[7]) : 0, etapa: String(p[9] || ''),
      admissao: adm, saida: saida, proporcional: !!(adm && adm > iniMes) || !!(saida && saida < fimMes), situacao: String(p[14] || ''), temPix: !!String(p[11] || '').trim(),
      cont: cont, datas: datas, obs: obs, semPresenca: !pr, pagamentos: pags[nome.toLowerCase()] || [],
      he: heMes.filter(function (x) { return x.linha === linha && (!adm || x.data >= adm) && (!saida || x.data <= saida); }).map(function (x) { return { data: x.data, horas: x.horas, tipo: sisHeTipo_(x.data, fer) }; }) });
  });
  return { mes: mes, hoje: sisIso_(new Date()), dias: pres.dias, tipos: SIS_CLT_TIPOS, codigos: SIS_PRES_COD, pessoas: lista, cfg: sisCltCfg_(), feriados: Object.keys(fer).filter(function (d) { return d >= iniMes && d <= fimMes; }) };
}
/** Soma dias a um texto aaaa-mm-dd (conta pura, sem fuso). */
function sisMaisDias_(iso, n) { var d = new Date(Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)) + n)); return d.toISOString().slice(0, 10); }
/** Lança um pagamento de fichado com o valor do holerite. */
function sisFichadoLancar(linha, mes, tipo, valor, data, forma, pago) {
  if (!SIS_CLT_TIPOS[tipo]) throw new Error('Tipo de pagamento inválido.');
  mes = String(mes || '').slice(0, 7); if (!/^\d{4}-\d{2}$/.test(mes)) throw new Error('Mês inválido.');
  var v = Number(String(valor).replace(/\./g, '').replace(',', '.')); if (typeof valor === 'number') v = valor;
  if (!(v > 0)) throw new Error('Informe o valor do holerite.');
  var p = sisFichados(mes).pessoas.filter(function (x) { return x.linha === linha; })[0];
  if (!p) throw new Error('Pessoa não encontrada entre os fichados desse mês.');
  var hoje = sisIso_(new Date()), pix = String(sisSS_().getSheetByName('Pessoas').getRange(linha, 12).getValue() || '');
  var w = { 0: hoje, 1: p.etapa || '', 2: SIS_CLT_TIPOS[tipo] + ' ' + mes.slice(5) + '/' + mes.slice(0, 4) + ' — ' + p.nome, 3: p.nome, 5: 'Mão de obra', 6: 1, 7: v,
    11: '[CLT ' + mes + ' ' + tipo + '] Valor do holerite. Lançado pelo sistema por ' + sisUsuario_(), 13: forma || 'PIX' };
  sisSituacao_(w, pago, data, hoje); if (pix) w[16] = pix;
  sisAbaSalvar('lancamentos', 0, w);
  return sisFichados(mes);
}

/* Configuração da estimativa de folha (por obra): % do adiantamento e, por pessoa, se usa vale-transporte e nº de dependentes. */
function sisCltCfg_() {
  var c = {}; try { c = JSON.parse(PropertiesService.getScriptProperties().getProperty('SIS_CLT_CFG_' + sisSS_().getId()) || '{}'); } catch (e) { }
  if (typeof c.adiant !== 'number') c.adiant = 40; c.p = c.p || {};
  var d = { util: 50, sab: 50, df: 100, divisor: 220, bloco: 3, parcial: 'inteiro' }; c.he = c.he || {};
  Object.keys(d).forEach(function (k) { if (c.he[k] === undefined) c.he[k] = d[k]; });
  return c;
}
function sisFichadoConfig(linha, cfg) {
  var c = sisCltCfg_();
  if (linha === -1) {
    var n = function (k, mi, ma) { var v = Number(String(cfg[k]).replace(',', '.')); if (!(v >= mi && v <= ma)) throw new Error('Valor inválido em ' + k + '.'); return v; };
    c.he = { util: n('util', 0, 300), sab: n('sab', 0, 300), df: n('df', 0, 300), divisor: n('divisor', 100, 300), bloco: n('bloco', 0.5, 12), parcial: ['inteiro', 'proporcional'].indexOf(cfg.parcial) >= 0 ? cfg.parcial : 'inteiro' };
  } else if (linha === 0) { var a = Number(cfg.adiant); if (!(a >= 0 && a <= 100)) throw new Error('Percentual do adiantamento inválido.'); c.adiant = a; }
  else c.p[linha] = { vt: !!cfg.vt, dep: Math.max(0, Math.min(20, Math.floor(Number(cfg.dep) || 0))) };
  PropertiesService.getScriptProperties().setProperty('SIS_CLT_CFG_' + sisSS_().getId(), JSON.stringify(c));
  return c;
}
/* Pensão alimentícia: guardada só para o usuário que salvou (UserProperties — o app roda como quem acessa), nunca na planilha. */
function sisPensao(salvar) {
  var up = PropertiesService.getUserProperties(), k = 'SIS_PENS_' + sisSS_().getId(), c = {};
  try { c = JSON.parse(up.getProperty(k) || '{}'); } catch (e) { }
  if (salvar) {
    var pe = Number(String(salvar.pens || 0).replace(',', '.')) || 0; if (pe < 0 || pe > 100) throw new Error('Percentual inválido.');
    if (pe) c[salvar.linha] = { pens: pe, base: ['liq', 'inss', 'bruto'].indexOf(salvar.base) >= 0 ? salvar.base : 'liq' }; else delete c[salvar.linha];
    up.setProperty(k, JSON.stringify(c));
  }
  return c;
}

/* ---------------------------------------------------------------- HORAS EXTRAS */
/* Aba "Horas Extras" (criada pelo sistema): uma linha por pessoa e dia. Lançada na tela Presença. */
var SIS_HE_CAB = ['Data', 'Linha (Pessoas)', 'Nome', 'Horas extras', 'Tipo do dia', 'Lançado por', 'Quando'];
function sisHeAba_(criar) {
  var ss = sisSS_(), sh = ss.getSheetByName('Horas Extras');
  if (!sh && criar) {
    sh = ss.insertSheet('Horas Extras'); sh.getRange(1, 1, 1, SIS_HE_CAB.length).setValues([SIS_HE_CAB]).setFontWeight('bold'); sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('dd/mm/yyyy');
  }
  return sh;
}
function sisHeLer_(de, ate) {
  var sh = sisHeAba_(false); if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues().map(function (r, i) {
    return { row: 2 + i, data: r[0] instanceof Date ? sisIso_(r[0]) : '', linha: Number(r[1]) || 0, nome: String(r[2] || ''), horas: Number(r[3]) || 0 };
  }).filter(function (x) { return x.data && x.linha && x.horas > 0 && x.data >= de && x.data <= ate; });
}
function sisFeriados_() {
  var sh = sisSS_().getSheetByName('Feriados'), f = {}; if (!sh || sh.getLastRow() < 3) return f;
  sh.getRange(3, 1, sh.getLastRow() - 2, 1).getValues().forEach(function (r) { if (r[0] instanceof Date) f[sisIso_(r[0])] = 1; });
  return f;
}
/** UTIL = dia útil, SAB = sábado (compensado durante a semana), DF = domingo ou feriado. */
function sisHeTipo_(iso, fer) {
  var w = new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))).getUTCDay();
  return w === 0 || (fer && fer[iso]) ? 'DF' : w === 6 ? 'SAB' : 'UTIL';
}
/** Diarista: cada bloco de N horas extras (padrão 3 h) vale 1 diária a mais. */
function sisHeDiarias_(h, r) {
  var b = r.bloco || 3; return r.parcial === 'proporcional' ? Math.round(h / b * 100) / 100 : Math.floor(h / b + 1e-9);
}
function sisPresencaHE(iso, linha, horas) {
  return sisComTrava_(function () {
    iso = String(iso).slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error('Data inválida.');
    if (linha < 6 || linha > 125) throw new Error('Pessoa inválida.');
    var h = Number(String(horas || 0).replace(',', '.')) || 0; if (h < 0 || h > 16) throw new Error('Horas extras inválidas (0 a 16).');
    h = Math.round(h * 2) / 2;
    var nome = String(sisSS_().getSheetByName('Pessoas').getRange(linha, 2).getValue() || '').trim(); if (!nome) throw new Error('Pessoa não encontrada.');
    var ex = sisHeLer_(iso, iso).filter(function (x) { return x.linha === linha; }), sh = sisHeAba_(!!h);
    var del = 0; ex.forEach(function (x, i) { if (i > 0 || !h) { sh.deleteRow(x.row - del); del++; } });
    if (h) {
      var linhaV = [sisDia_(+iso.slice(0, 4), +iso.slice(5, 7), +iso.slice(8, 10)), linha, nome, h, { UTIL: 'Dia útil', SAB: 'Sábado', DF: 'Domingo/feriado' }[sisHeTipo_(iso, sisFeriados_())], sisUsuario_(), new Date()];
      if (ex.length) sh.getRange(ex[0].row, 1, 1, linhaV.length).setValues([linhaV]); else sh.appendRow(linhaV);
    }
    return h;
  });
}

/* ---------------------------------------------------------------- DIÁRIO: serviços padronizados */
/** Atividades do Cronograma (etapa + atividade) para a lista de "Serviços executados" do Diário. */
function sisAtividades() {
  var sh = sisSS_().getSheetByName('Cronograma'); if (!sh) return [];
  return sh.getRange(7, 2, 61, 2).getDisplayValues().filter(function (r) { return String(r[1]).trim(); })
    .map(function (r) { return { etapa: String(r[0]).trim(), atividade: String(r[1]).trim() }; });
}
/** Uma vez só (Administrador): o texto livre antigo de "Serviços executados" vai para "Ocorrências" (na frente do que já havia). */
function sisDiarioPadronizar() {
  return sisComTrava_(function () {
    var m = sisModulo_('diario'), sh = sisSS_().getSheetByName(m.aba), cS = sisColNum_(m.servicos), cD = sisColNum_(m.descricao);
    var at = {}; sisAtividades().forEach(function (a) { at[a.atividade] = 1; });
    var n = m.fim - m.ini + 1, vs = sh.getRange(m.ini, cS, n, 1).getValues(), ds = sh.getRange(m.ini, cD, n, 1).getValues(), mud = 0;
    if (sh.getRange(m.ini, cS).getFormula() || sh.getRange(m.ini, cD).getFormula()) throw new Error('Coluna com fórmula: não mexi em nada.');
    for (var i = 0; i < n; i++) {
      var t = String(vs[i][0] || '').trim(); if (!t) continue;
      if (t.split(/\s*;\s*/).every(function (x) { return at[x] || /^Outro/.test(x); })) continue;  // já está no padrão
      var d = String(ds[i][0] || '').trim();
      ds[i][0] = 'Executado: ' + t + (d ? ' | Ocorrência: ' + d : ''); vs[i][0] = ''; mud++;
    }
    if (mud) { sh.getRange(m.ini, cD, n, 1).setValues(ds); sh.getRange(m.ini, cS, n, 1).setValues(vs); }
    return mud;
  });
}
