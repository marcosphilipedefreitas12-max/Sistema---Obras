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
  var SEG = (function () { var d = new Date(st.hoje + 'T12:00:00'); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toISOString().slice(0, 10); })();
  var CONSV = {}, IA = { ligado: false }, PERFIS = [], TAB = {}, PRES = { P: {} }, OB = [{ id: 'A1', nome: 'OBRA EXEMPLO', resp: 'Eng. Teste' }, { id: 'B2', nome: 'OBRA DOIS', resp: 'Eng. Outro' }];
  function tabela(id) {
    if (TAB[id]) return TAB[id];
    var col = function (i, nome, tipo, extra) { var c = { i: i, letra: String.fromCharCode(65 + i), nome: nome, ajuda: '', auto: false, tipo: tipo || 'texto', opcoes: [] }; for (var k in extra || {}) c[k] = extra[k]; return c; };
    var t = id === 'diario' ? {
      cols: [col(0, 'Data', 'data', { ajuda: 'Data do dia.' }), col(1, 'Clima manhã', 'texto', { opcoes: ['Bom', 'Nublado', 'Chuva fraca', 'Chuva forte'] }), col(2, 'Pedreiros', 'numero', { ajuda: 'Quantas pessoas de cada função trabalharam.' }),
             col(3, 'Serviços executados (onde e o quê)'), col(4, 'Total efetivo', 'numero', { auto: true }), col(15, 'Fotos (link da pasta / imagem)')],
      linhas: [{ linha: 6, d: ['17/11/26', 'Bom', '3', 'Demolição do muro de divisa', '3'], v: { 0: '2026-11-17', 1: 'Bom', 2: 3, 3: 'Demolição do muro de divisa' } },
               { linha: 5, d: ['16/11/26', 'Nublado', '2', 'Limpeza do terreno', '2'], v: { 0: '2026-11-16', 1: 'Nublado', 2: 2, 3: 'Limpeza do terreno' } }]
    } : {
      cols: [col(0, 'Item'), col(1, 'Descrição'), col(2, 'Valor', 'numero'), col(3, 'Status', 'texto', { opcoes: ['Aberto', 'Concluído'] })],
      linhas: [{ linha: 5, d: ['1', 'Registro de exemplo', '10', 'Aberto'], v: { 0: '1', 1: 'Registro de exemplo', 2: 10, 3: 'Aberto' } }]
    };
    if (id === 'planejamento') t = {
      cols: [col(0, 'Data (qualquer dia da semana)', 'data'), col(1, 'Atividade / serviço'), col(2, 'Local (pav. / unidade)'), col(3, 'Equipe / responsável'), col(4, 'Qtd planejada', 'numero'), col(5, 'Unid.'),
             col(6, 'O que precisa antes (restrição)', 'texto', { opcoes: ['Nenhuma', 'Material'] }), col(7, 'Restrição resolvida?', 'texto', { opcoes: ['S', 'N'] }), col(8, 'Concluída?', 'texto', { opcoes: ['S', 'Parcial', 'N'] }),
             col(9, 'Motivo (se não concluída)'), col(10, 'Observações'), col(13, 'Dias da semana')],
      linhas: [{ linha: 5, d: ['18/11/26', 'Alvenaria 2º pav.', 'Pav. 2', 'Equipe A', '120', 'm²', 'Material', 'N', '', '', '', 'Seg, Ter, Qua'], v: { 0: SEG, 1: 'Alvenaria 2º pav.', 2: 'Pav. 2', 3: 'Equipe A', 4: 120, 5: 'm²', 6: 'Material', 7: 'N', 13: 'Seg, Ter, Qua' } },
               { linha: 6, d: ['18/11/26', 'Limpeza do canteiro', 'Canteiro', 'Serventes', '', '', 'Nenhuma', '', 'S', '', '', ''], v: { 0: SEG, 1: 'Limpeza do canteiro', 2: 'Canteiro', 3: 'Serventes', 6: 'Nenhuma', 8: 'S' } }]
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
      { linha: 7, nome: 'Pedreiro Teste', funcao: 'Pedreiro', vinculo: 'Prestador / empreiteiro', situacao: 'Ativo', valor: PRES.P[7] || '' }], codigos: SIS_PRES_COD };
    if (fn === 'sisRelatorio') {
      var cabD = ['Data', 'Clima manhã', 'Clima tarde', 'Pedreiros', 'Serventes', 'Carpinteiro', 'Armadores', 'Bombeiro', 'Eletric.', 'Terceiros', 'Total efetivo', 'Equipamentos em obra', 'Serviços executados (onde e o quê)', 'Ocorrências / visitas / acidentes', 'Dia produtivo?'];
      var lin = function (d, n) { return [d, 'Bom', 'Bom', '3', '4', '', '', '', '', '', String(n), 'Betoneira', 'Alvenaria do 2º pavimento', n > 7 ? 'Visita do cliente' : '', 'Sim']; };
      var linhas = args[0] === 'rdo' ? [lin(args[1], 7)] : [lin('2026-11-16', 7), lin('2026-11-17', 9), lin('2026-11-18', 8)];
      return { tipo: args[0], de: args[1], ate: args[2], numero: 12, gerado: '19/11/2026 10:00', por: 'usuario',
        obra: { Obra: 'OBRA EXEMPLO', Engenheiro: 'Eng. Teste', 'Fase atual': 'Estrutura', 'Término previsto': '30/06/2028', 'Avanço físico real': '4,2%', 'Avanço físico previsto': '5,0%' },
        diario: { cab: cabD, linhas: linhas }, producao: { cab: ['Data', 'Serviço', 'Local (pav. / unidade)', 'Equipe / empreiteiro', 'Nº contrato (opcional)', 'Unid.', 'Quantidade executada', 'Nº de pessoas', 'Dias', 'Homens-dia'], linhas: [[args[1], 'Alvenaria', '2º pav.', 'Equipe A', '', 'm²', '42', '3', '1', '3']] },
        inspecoes: { cab: [], linhas: [] }, fvs: { cab: [], linhas: [] },
        presenca: { dias: [], porVinculo: { Diarista: 5 }, ausencias: [{ data: args[1], nome: 'Ajudante Teste', funcao: 'Servente', cod: 'A', desc: 'Atestado médico', obs: 'Consulta' }], homensDia: 21, faltas: 0 },
        custos: { total: 5000, porEtapa: { Estrutura: 5000 }, qtd: 2, orcamento: 'R$ 1.000.000', realizado: 'R$ 42.000', vencidas: 'R$ 0', aVencer7: 'R$ 3.000' },
        pendencias: [{ assunto: 'Compras atrasadas', qtd: 1 }], fotos: [] };
    }
    if (fn === 'sisPresencaMes') {
      var dias = []; for (var d = 1; d <= 30; d++) dias.push('2026-11-' + (d < 10 ? '0' : '') + d);
      var cod = function (i, base) { var w = new Date(dias[i] + 'T12:00:00').getDay(); return w === 0 || w === 6 ? '' : base(i); };
      return { mes: '2026-11', dias: dias, primeira: '2026-10-26', codigos: SIS_PRES_COD, pessoas: [
        { linha: 6, nome: 'Ajudante Teste', funcao: 'Servente', vinculo: 'Diarista', empresa: '', situacao: 'Ativo', v: dias.map(function (x, i) { return cod(i, function (j) { return j === 9 ? 'F' : j === 10 ? 'FJ' : 'P'; }); }), obs: dias.map(function (x, i) { return i === 10 ? 'Consulta' : ''; }) },
        { linha: 7, nome: 'Equipe Teste', funcao: 'Pedreiro', vinculo: 'Prestador / empreiteiro', empresa: 'Empreiteira Exemplo', situacao: 'Ativo', v: dias.map(function (x, i) { return cod(i, function (j) { return String(4 + j % 3); }); }), obs: dias.map(function () { return ''; }) }] };
    }
    if (fn === 'sisPensao') { st.pens = st.pens || {}; var sv = args[0]; if (sv) { if (Number(sv.pens)) st.pens[sv.linha] = { pens: Number(sv.pens), base: sv.base }; else delete st.pens[sv.linha]; } return JSON.parse(JSON.stringify(st.pens)); }
    if (/^sisFichado/.test(fn) || (/^sisDiarista(Pago|Cancelar)$/.test(fn) && st.fich && st.fich.pags.some(function (g) { return g.lanc === args[0]; }))) {
      var FI = st.fich = st.fich || { pags: [] };
      if (fn === 'sisFichadoLancar') FI.pags.push({ linha: args[0], mes: args[1], lanc: 100 + FI.pags.length, tipo: args[2], valor: Number(String(args[3]).replace(/\./g, '').replace(',', '.')), status: args[6] ? 'Pago' : 'Lançado', venc: args[4], pagoEm: args[6] ? args[4] : '', forma: args[5] });
      if (fn === 'sisDiaristaPago') FI.pags.forEach(function (g) { if (g.lanc === args[0]) { g.status = 'Pago'; g.pagoEm = args[1]; } });
      if (fn === 'sisDiaristaCancelar') FI.pags.forEach(function (g) { if (g.lanc === args[0]) g.status = 'Cancelado'; });
      FI.cfg = FI.cfg || { adiant: 40, p: {} };
      if (fn === 'sisFichadoConfig') { if (args[0] === 0) FI.cfg.adiant = args[1].adiant; else FI.cfg.p[args[0]] = { vt: !!args[1].vt, dep: Number(args[1].dep) || 0 }; return FI.cfg; }
      var mesF = fn === 'sisFichados' ? args[0] : (FI.mes || '2026-11'); FI.mes = mesF;
      if (fn !== 'sisFichados' && fn !== 'sisFichadoLancar') return SIS_MOCK('sisDiaristas', []);
      return { mes: mesF, hoje: st.hoje, dias: [], cfg: FI.cfg, codigos: SIS_PRES_COD, tipos: { ADIANTAMENTO: 'Adiantamento (vale)', SALARIO: 'Salário do mês', BENEFICIOS: 'Vale-transporte / alimentação' }, pessoas: [
        { linha: 8, nome: 'Fichado Teste', funcao: 'Mestre de obras', vinculo: 'Fichado (CLT)', salario: 4200, admissao: '2026-08-03', saida: '', cont: { P: 14, '½': 1, F: 1, A: 2 }, datas: { F: ['2026-11-09'], A: ['2026-11-12', '2026-11-13'] }, obs: ['12/11 A: Atestado de 2 dias'], semPresenca: false },
        { linha: 9, nome: 'Novo Fichado', funcao: 'Engenheiro', vinculo: 'Fichado (CLT)', salario: 6000, admissao: '2026-11-17', saida: '', cont: { P: 2 }, datas: {}, obs: [], semPresenca: false }
      ].map(function (p) { p.pagamentos = FI.pags.filter(function (g) { return g.linha === p.linha && g.mes === mesF; }); return p; }) };
    }
    if (/^sisDiarista/.test(fn)) {
      var DI = st.diar = st.diar || { ate: {}, pags: [] };
      var diasT = ['2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-16', '2026-11-17', '2026-11-18'];
      var monta = function () {
        var pes = [{ linha: 6, nome: 'Ajudante Teste', funcao: 'Servente', diaria: 150 }, { linha: 7, nome: 'Equipe Teste', funcao: 'Pedreiro', diaria: 250 }];
        return { hoje: st.hoje, outras: [{ linha: 8, nome: 'Fichado Teste', vinculo: 'Fichado (CLT)' }], pessoas: pes.map(function (p) {
          var ps = DI.pags.filter(function (g) { return g.linha === p.linha && g.status !== 'Cancelado'; }), lim = DI.ate[p.linha] || st.hoje;
          var d = diasT.filter(function (x) { return x <= lim && !ps.some(function (g) { return x >= g.de && x <= g.ate; }); }).map(function (x, i) { return [x, i === 2 && p.linha === 6 ? 0.5 : 1]; });
          var q = d.reduce(function (a, x) { return a + x[1]; }, 0);
          return Object.assign({ vinculo: 'Diarista', pagamento: 'Quinzenal', etapa: 'Infraestrutura', temPix: p.linha === 6, situacao: 'Ativo', diaristaAte: DI.ate[p.linha] || '', semPresenca: false, outros: [],
            aberto: { dias: d, qtd: q, valor: q * p.diaria, de: d.length ? d[0][0] : '', ate: d.length ? d[d.length - 1][0] : '' },
            pagamentos: DI.pags.filter(function (g) { return g.linha === p.linha; }) }, p);
        }) };
      };
      if (fn === 'sisDiaristaLancar') {
        var pp = monta().pessoas.filter(function (x) { return x.linha === args[0]; })[0], ds = pp.aberto.dias.filter(function (x) { return x[0] >= args[1] && x[0] <= args[2]; }), qq = ds.reduce(function (a, x) { return a + x[1]; }, 0);
        if (!qq) throw new Error('Não há diárias em aberto nesse período.');
        DI.pags.unshift({ linha: args[0], lanc: 10 + DI.pags.length, de: ds[0][0], ate: ds[ds.length - 1][0], dias: qq, valor: qq * pp.diaria, status: args[5] ? 'Pago' : 'Lançado', venc: args[3], pagoEm: args[5] ? args[3] : '', forma: args[4] });
      }
      if (fn === 'sisDiaristaPago') DI.pags.forEach(function (g) { if (g.lanc === args[0]) { g.status = 'Pago'; g.pagoEm = args[1]; } });
      if (fn === 'sisDiaristaCancelar') DI.pags.forEach(function (g) { if (g.lanc === args[0]) g.status = 'Cancelado'; });
      if (fn === 'sisDiaristaAte') { if (args[1]) DI.ate[args[0]] = args[1]; else delete DI.ate[args[0]]; }
      return monta();
    }
    if (fn === 'sisPresencaMarcar') { PRES.P[args[0]] = args[2]; return true; }
    if (fn === 'sisSalvarDemanda') { if (!a.ID) { a.ID = 'D' + (n++); st.demandas.push(a); } else st.demandas = st.demandas.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisSalvarFornecedor') { if (!a.ID) { a.ID = 'F' + (n++); st.fornecedores.push(a); } else st.fornecedores = st.fornecedores.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisSalvarInteracao') { if (!a.ID) { a.ID = 'I' + (n++); a.Autor = 'usuario'; st.interacoes.push(a); } else st.interacoes = st.interacoes.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisImportarFornecedores') { Object.keys(st.historico).forEach(function (k) { if (!st.fornecedores.some(function (f) { return f.Nome.toLowerCase() === k; })) st.fornecedores.push({ ID: 'F' + (n++), Nome: st.historico[k].nome, Tipo: 'Fornecedor', 'Situação': 'Ativo' }); }); }
    var r = JSON.parse(JSON.stringify(st)); if (fn === 'sisImportarFornecedores') r.importados = 2;
    if (fn === 'sisPlanReprogramar') { var tp = tabela('planejamento'); var r0 = JSON.parse(JSON.stringify(tp)); r0.copiadas = 1; return r0; }
    if (fn === 'sisIaConfig' || fn === 'sisIaSalvarConfig') { if (fn === 'sisIaSalvarConfig') IA.ligado = !!a.ligado; return { ligado: IA.ligado, temChave: IA.ligado, chaveFim: 'abcd', modelo: 'claude-haiku-5-5', modelos: [['claude-haiku-5-5', 'Haiku'], ['claude-sonnet-5-5', 'Sonnet']], limite: 300, usoMes: { perguntas: 0, entrada: 0, saida: 0, custoUS: 0 } }; }
    if (fn === 'sisIaPerguntar') return { texto: 'Resposta de **teste**.\n- item 1', propostas: [{ tipo: 'demanda', titulo: 'Nova demanda', dados: { 'Título': 'Comprar cimento', Status: 'A fazer' }, campos: [{ nome: 'Título', valor: 'Comprar cimento' }], resumo: 'Comprar cimento' }] };
    if (fn === 'sisExecPrazo') return a || '';
    if (fn === 'sisExecutivo') {
      var rl = SIS_MOCK('sisRelatorio', ['periodo', args[1], args[2]]);
      return { obraId: 'A1', obra: 'OBRA EXEMPLO', de: args[1], ate: args[2], hoje: st.hoje, custos: true, perfil: 'Administrador', admin: true, prazoContratual: '2028-12-31',
        'Engenheiro': 'Eng. Teste', 'Fase atual': 'Estrutura', 'Início da obra': '01/09/2026', 'Término previsto': '30/06/2028', 'Produtividade média — % da meta (30 dias)': '92%', 'FVS em aberto': '2', 'Inspeções de serviço reprovadas em aberto': '1', 'Compras atrasadas': '1', 'Lajes concluídas': '2', 'Total de lajes': '16', 'PPC médio 4 semanas': '75%',
        avanco: { real: 0.042, previsto: 0.05 },
        fin: { orcamento: 1000000, realizado: 60000, vencidas: 0, aVencer7: 3000, comprometido: 80000, contratado: 120000, medido: 40000, custoFichados: 10000, custoDiaristas: 5000, custoPrestadores: 20000, acimaOrcado: 1 },
        curva: [['2026-11-02', 0.02, 0.02], ['2026-11-09', 0.03, 0.028], ['2026-11-16', 0.04, 0.035], ['2026-11-23', 0.05, null], ['2026-11-30', 0.06, null]],
        crono: [{ etapa: 'Preliminares', ativ: 'Canteiro', resp: 'Eng. Teste', ini: '2026-09-01', fim: '2026-09-30', pct: 1, status: 'Concluído' }, { etapa: 'Fundação', ativ: 'Estacas', resp: 'Equipe A', ini: '2026-10-01', fim: '2026-11-10', pct: 0.6, status: 'Atrasado' }, { etapa: 'Estrutura', ativ: 'Lajes', resp: 'Equipe B', ini: '2026-12-01', fim: '2027-08-30', pct: 0, status: 'Não iniciado' }],
        diario: rl.diario, producao: rl.producao, presenca: rl.presenca, pendencias: rl.pendencias, inspecoes: rl.inspecoes, fvs: rl.fvs, custosPeriodo: rl.custos,
        custoMes: { '2026-10': { Fundação: 20000 }, '2026-11': { Fundação: 30000, Preliminares: 10000 } }, contasAbertas: [{ venc: '2026-11-20', desc: 'Concreto', valor: 4000 }],
        etapasOrc: [['Fundação', 200000, 50000], ['Preliminares', 30000, 10000]], planSemana: 0, motivos: { 'Material não chegou': 1 }, demandasAtrasadas: [], obras: [{ id: 'A1', nome: 'OBRA EXEMPLO' }, { id: 'B2', nome: 'OBRA DOIS' }] };
    }
    if (fn === 'sisOrcConfirmar') return !!a;
    if (fn === 'sisConsultaLer' || fn === 'sisConsultaGravar') {
      if (fn === 'sisConsultaGravar') CONSV[args[1] + ',' + args[2]] = args[3];
      var L = function (r, c, v) { return CONSV[r + ',' + c] != null ? CONSV[r + ',' + c] : v; };
      return { id: a, aba: a, ncol: 4, mesc: [], linhas: [
        [{ v: 'Título da aba' }, { v: '' }, { v: '' }, { v: '' }],
        [{ v: 'Explicação da aba de exemplo, com texto longo para ocupar a linha inteira da tabela.' }, { v: '' }, { v: '' }, { v: '' }],
        [{ v: 'Etapa', e: 2 }, { v: 'Orçado', e: 2 }, { v: 'Gasto', e: 2 }, { v: 'Saldo', e: 2 }],
        [{ v: 'Fundação' }, { v: L(4, 2, 'R$ 200.000,00') }, { v: 'R$ 50.000,00', f: 1 }, { v: 'R$ 150.000,00', f: 1 }],
        [{ v: 'Estrutura' }, { v: L(5, 2, 'R$ 400.000,00') }, { v: 'R$ 0,00', f: 1 }, { v: 'R$ 400.000,00', f: 1 }]] };
    }
    if (fn === 'sisFotos') return { fotos: [], pasta: '' };
    if (fn === 'sisFotoEnviar') return { pasta: 'https://drive.google.com/drive/folders/EXEMPLO', foto: { id: 'X' + (n++), nome: args[3], url: '#' } };
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
