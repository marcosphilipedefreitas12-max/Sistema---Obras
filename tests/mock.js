window.SIS_MOCK = (function () {
  var st = {
    obra: 'OBRA EXEMPLO', usuario: 'usuario', hoje: '2026-11-18', status: ['A fazer', 'Em andamento', 'Aguardando terceiros', 'Concluída'],
    pessoas: ['Ajudante Teste', 'usuario'],
    demandas: [
      { ID: 'D1', 'Título': 'Pedir PL01 R02 ao arquiteto', 'Descrição': 'Prancha do térreo está na R01', Origem: 'Projetista', Solicitante: 'Usuário', 'Responsável': 'usuario', Obra: 'OBRA EXEMPLO', Prioridade: 'Alta', Prazo: '2026-11-17', Status: 'A fazer', 'Histórico': '17/11 08:00 usuario: criou' },
      { ID: 'D2', 'Título': 'Projeto estrutural / tabela de aço', Origem: 'Projetista', 'Responsável': 'usuario', Prioridade: 'Alta', Prazo: '2026-11-20', Status: 'Aguardando terceiros' },
      { ID: 'D3', 'Título': 'Relatório semanal para a diretoria', Origem: 'Chefe / diretoria', 'Responsável': 'usuario', Prioridade: 'Média', Prazo: '2026-11-18', Status: 'Em andamento' },
      { ID: 'D4', 'Título': 'Reclamação de poeira do vizinho lote 015', Origem: 'Vizinho', 'Responsável': 'Ajudante Teste', Prioridade: 'Média', Prazo: '2026-11-25', Status: 'A fazer' },
      { ID: 'D5', 'Título': 'Vistoria cautelar dos vizinhos', Origem: 'Equipe da obra', 'Responsável': 'usuario', Prioridade: 'Baixa', Prazo: '2026-11-12', Status: 'Concluída' }],
    fornecedores: [
      { ID: 'F1', Nome: 'Engenharia Alfa', Tipo: 'Empreiteiro / prestador', 'Categoria / serviço': 'Vistoria cautelar', Telefone: '(31) 90000-0000', 'Nota prazo': 5, 'Nota qualidade': 4, 'Nota preço': 5, 'Situação': 'Ativo' },
      { ID: 'F2', Nome: 'Consultoria Beta', Tipo: 'Fornecedor', 'Categoria / serviço': 'Vistoria cautelar', 'Situação': 'Ativo' },
      { ID: 'F3', Nome: 'Topografia Gama', Tipo: 'Empreiteiro / prestador', 'Categoria / serviço': 'Topografia', 'Nota prazo': 4, 'Nota qualidade': 5, 'Situação': 'Ativo' }],
    interacoes: [{ ID: 'I1', Data: '2026-11-16', 'Fornecedor ID': 'F3', Fornecedor: 'Topografia Gama', Tipo: 'WhatsApp', Resumo: 'Combinou locação das estacas', 'Próximo passo': 'Confirmar data da locação', 'Data do próximo passo': '2026-11-18', 'Feito?': '', Autor: 'usuario' }],
    historico: {
      'engenharia alfa': { nome: 'Engenharia Alfa', cotacoes: [{ n: 'COT-001', data: '2026-11-10', servico: 'Vistoria Cautelar', valor: 5000, prazo: '20 corridos', escolhido: true }], contratos: [], medicoes: [], lancamentos: [], compras: [], servicos: ['Vistoria Cautelar'] },
      'consultoria beta': { nome: 'Consultoria Beta', cotacoes: [{ n: 'COT-001', data: '2026-11-10', servico: 'Vistoria Cautelar', valor: 15000, prazo: '20', escolhido: false }], contratos: [], medicoes: [], lancamentos: [], compras: [], servicos: [] },
      'topografia gama': { nome: 'Topografia Gama', cotacoes: [], contratos: [{ n: 'CT-001', servico: 'Mão de obra de topografia', forma: 'Diária', valor: 2200, medido: 1100, pct: 0.5 }], medicoes: [{ data: '2026-11-06', contrato: 'CT-001', periodo: 'out/26', liquido: 1100, pago: true }], lancamentos: [], compras: [], servicos: ['Topografia'] },
      'construtora delta': { nome: 'Construtora Delta', cotacoes: [{ n: 'COT-001', servico: 'Vistoria Cautelar', valor: 5000 }], contratos: [], medicoes: [], lancamentos: [], compras: [], servicos: [] },
      'serviços épsilon': { nome: 'Serviços Épsilon', cotacoes: [{ n: 'COT-001', servico: 'Vistoria Cautelar', valor: 6520 }], contratos: [], medicoes: [], lancamentos: [], compras: [], servicos: [] } }
  };
  var n = 10;
  // Tabelas fictícias: cada aba devolve colunas genéricas; o Diário tem colunas próprias para testar o formulário.
  var PERFIS = [], TAB = {}, PRES = { P: {} }, OB = [{ id: 'A1', nome: 'OBRA EXEMPLO', resp: 'Eng. Teste' }, { id: 'B2', nome: 'OBRA DOIS', resp: 'Eng. Outro' }];
  function tabela(id) {
    if (TAB[id]) return TAB[id];
    var col = function (i, nome, tipo, extra) { var c = { i: i, letra: String.fromCharCode(65 + i), nome: nome, ajuda: '', auto: false, tipo: tipo || 'texto', opcoes: [] }; for (var k in extra || {}) c[k] = extra[k]; return c; };
    var t = id === 'diario' ? {
      cols: [col(0, 'Data', 'data', { ajuda: 'Data do dia.' }), col(1, 'Clima manhã', 'texto', { opcoes: ['Bom', 'Nublado', 'Chuva fraca', 'Chuva forte'] }), col(2, 'Pedreiros', 'numero', { ajuda: 'Quantas pessoas de cada função trabalharam.' }),
             col(3, 'Serviços executados (onde e o quê)'), col(4, 'Total efetivo', 'numero', { auto: true })],
      linhas: [{ linha: 6, d: ['17/11/26', 'Bom', '3', 'Demolição do muro de divisa', '3'], v: { 0: '2026-11-17', 1: 'Bom', 2: 3, 3: 'Demolição do muro de divisa' } },
               { linha: 5, d: ['16/11/26', 'Nublado', '2', 'Limpeza do terreno', '2'], v: { 0: '2026-11-16', 1: 'Nublado', 2: 2, 3: 'Limpeza do terreno' } }]
    } : {
      cols: [col(0, 'Item'), col(1, 'Descrição'), col(2, 'Valor', 'numero'), col(3, 'Status', 'texto', { opcoes: ['Aberto', 'Concluído'] })],
      linhas: [{ linha: 5, d: ['1', 'Registro de exemplo', '10', 'Aberto'], v: { 0: '1', 1: 'Registro de exemplo', 2: 10, 3: 'Aberto' } }]
    };
    t.id = id; t.aba = id; t.chave = 0; t.mostrar = []; t.livres = 100; t.novo = true;
    return (TAB[id] = t);
  }
  window.sisSS_ = function () { return SpreadsheetApp.getActiveSpreadsheet(); };
  window.SpreadsheetApp = { getActiveSpreadsheet: function () { return {
    getUrl: function () { return 'https://docs.google.com/spreadsheets/d/EXEMPLO/edit'; },
    getSheets: function () { return SIS_MODULOS.filter(function (m) { return m.aba; }).map(function (m, i) { return { getName: function () { return m.aba; }, getSheetId: function () { return i + 1; } }; }); } }; } };
  return function (fn, args) {
    args = args ? JSON.parse(JSON.stringify(args)) : [];
    var a = args[0];
    var obras = function () { return { usuario: 'usuario', total: OB.length, temModelo: true, obras: OB.map(function (o) { return { id: o.id, nome: o.nome, resp: o.resp, url: 'https://docs.google.com/spreadsheets/d/' + o.id + '/edit' }; }) }; };
    if (fn === 'sisObras') return obras();
    if (fn === 'sisObraNova') { OB.push({ id: 'X' + (n++), nome: args[0], resp: args[1] }); return obras(); }
    if (fn === 'sisObraCadastrar') { OB.push({ id: 'Y' + (n++), nome: 'OBRA CADASTRADA', resp: args[1] }); return obras(); }
    if (fn === 'sisObraRemover') { OB = OB.filter(function (o) { return o.id !== a; }); return obras(); }
    if (fn === 'sisModeloDefinir') return obras();
    if (fn === 'sisAbaLer') return JSON.parse(JSON.stringify(tabela(a)));
    if (fn === 'sisAbaSalvar') {
      var t = tabela(a), vals = args[2], l = args[1] || 100 + (n++), linha = t.linhas.filter(function (x) { return x.linha === l; })[0];
      if (!linha) { linha = { linha: l, d: t.cols.map(function () { return ''; }), v: {} }; t.linhas.unshift(linha); }
      Object.keys(vals).forEach(function (k) { linha.v[k] = vals[k]; linha.d[t.cols.map(function (c) { return c.i; }).indexOf(Number(k))] = vals[k]; });
      var r = JSON.parse(JSON.stringify(t)); r.salva = l; return r;
    }
    if (fn === 'sisAbaLimpar') { var t2 = tabela(a); t2.linhas = t2.linhas.filter(function (x) { return x.linha !== args[1]; }); return JSON.parse(JSON.stringify(t2)); }
    if (fn === 'sisPresenca') return { data: a || st.hoje, col: 8, primeira: '2026-09-01', pessoas: [
      { linha: 6, nome: 'Ajudante Teste', funcao: 'Servente', vinculo: 'Diarista', situacao: 'Ativo', valor: PRES.P[6] || '' },
      { linha: 7, nome: 'Pedreiro Teste', funcao: 'Pedreiro', vinculo: 'Empreiteiro', situacao: 'Ativo', valor: PRES.P[7] || '' }] };
    if (fn === 'sisPresencaMarcar') { PRES.P[args[0]] = args[2]; return true; }
    if (fn === 'sisSalvarDemanda') { if (!a.ID) { a.ID = 'D' + (n++); st.demandas.push(a); } else st.demandas = st.demandas.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisSalvarFornecedor') { if (!a.ID) { a.ID = 'F' + (n++); st.fornecedores.push(a); } else st.fornecedores = st.fornecedores.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisSalvarInteracao') { if (!a.ID) { a.ID = 'I' + (n++); a.Autor = 'usuario'; st.interacoes.push(a); } else st.interacoes = st.interacoes.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisImportarFornecedores') { Object.keys(st.historico).forEach(function (k) { if (!st.fornecedores.some(function (f) { return f.Nome.toLowerCase() === k; })) st.fornecedores.push({ ID: 'F' + (n++), Nome: st.historico[k].nome, Tipo: 'Fornecedor', 'Situação': 'Ativo' }); }); }
    var r = JSON.parse(JSON.stringify(st)); if (fn === 'sisImportarFornecedores') r.importados = 2;
    if (fn === 'sisPerfis') return { lista: PERFIS, dono: 'usuario@exemplo.com', compartilhados: ['mestre@exemplo.com'], perfis: ['Administrador', 'Engenheiro', 'Encarregado', 'Consulta'], desc: { Administrador: 'Tudo.', Engenheiro: 'Tudo menos perfis.', Encarregado: 'Dia a dia, sem custos.', Consulta: 'Só vê.' } };
    if (fn === 'sisPerfisSalvar') { PERFIS = a; return SIS_MOCK('sisPerfis', []); }
    if (fn === 'sisCarregar') {
      r.config = sisConfig_();
      r.permissoes = { perfil: 'Administrador', descricao: 'Tudo.', grava: true, apaga: true, custos: true, admin: true, modulos: r.config.modulos.map(function (m) { return m.id; }) };
      r.inicio = { pend: [{ assunto: 'Boletos vencidos', qtd: 0 }, { assunto: 'Dias sem registro no Diário', qtd: 2 }, { assunto: 'Compras atrasadas', qtd: 1 }],
        painel: { avanco: { real: 0.042, previsto: 0.05 }, termino: '03/07/2029', atrasadas: 1,
          custo: { orcamento: 1000000, realizado: 42000, partes: [['Mão de obra e serviços', 30000], ['Material', 9000], ['Equipamento', 3000]] },
          pagar: [['Mês atual', 8000], ['Próximo mês', 12000], ['Daqui a 2 meses', 3000]], vencidas: 0,
          equipe: [['Pedreiros', 3], ['Serventes', 4], ['Carpinteiros', 2]],
          efetivo: [['2026-11-10', 6], ['2026-11-11', 8], ['2026-11-12', 9], ['2026-11-13', 7], ['2026-11-16', 9], ['2026-11-17', 10]],
          etapas: [['Preliminares', 60000, 30000], ['Fundação', 250000, 12000], ['Estrutura', 400000, 0]] },
        numeros: [{ campo: 'Avanço físico real', valor: '4,2%' }, { campo: 'Avanço físico previsto', valor: '5,0%' }, { campo: 'Orçamento (R$)', valor: 'R$ 1.000.000,00' }, { campo: 'Realizado (R$)', valor: 'R$ 42.000,00' }] };
    }
    return r;
  };
})();
