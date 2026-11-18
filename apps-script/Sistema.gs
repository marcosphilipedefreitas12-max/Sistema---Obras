/**
 * SISTEMA DE OBRAS — CRM (Demandas, Fornecedores e Interações)
 *
 * Fica no MESMO projeto Apps Script da planilha da obra (Extensões → Apps Script),
 * como arquivos a mais (Sistema.gs, Modulos.gs e Sistema.html) ao lado do Script_Obra.gs.
 *
 * A planilha é o banco de dados: o sistema cria e usa as abas
 *   "CRM Demandas", "CRM Fornecedores" e "CRM Interações"
 * e LÊ (sem alterar) Cotações, Contratos, Medições, Lançamentos e Compras.
 *
 * Publicar: Implantar → Nova implantação → Tipo "App da Web"
 *   Executar como: "Usuário que acessa o app da Web"
 *   Quem pode acessar: "Qualquer pessoa com Conta do Google"
 * Assim cada pessoa entra com a própria conta e só vê os dados se tiver acesso à planilha.
 *
 * Os nomes das funções começam com "sis" para não colidir com o Script_Obra.gs.
 */

var SIS_ABAS = {
  dem: 'CRM Demandas',
  forn: 'CRM Fornecedores',
  inter: 'CRM Interações'
};

var SIS_COLS = {
  dem: ['ID', 'Criada em', 'Título', 'Descrição', 'Origem', 'Solicitante', 'Responsável', 'Obra',
        'Prioridade', 'Prazo', 'Status', 'Atualizada em', 'Concluída em', 'Histórico'],
  forn: ['ID', 'Nome', 'Tipo', 'Categoria / serviço', 'Contato', 'Telefone', 'E-mail', 'CNPJ / CPF',
         'Cidade', 'Nota prazo', 'Nota qualidade', 'Nota preço', 'Situação', 'Observações',
         'Próximo contato', 'Criado em', 'Atualizado em'],
  inter: ['ID', 'Data', 'Fornecedor ID', 'Fornecedor', 'Tipo', 'Resumo', 'Próximo passo',
          'Data do próximo passo', 'Feito?', 'Autor']
};

var SIS_STATUS = ['A fazer', 'Em andamento', 'Aguardando terceiros', 'Concluída'];

/* ------------------------------------------------------------------ web app */

function doGet() {
  sisGarantirAbas_();
  return HtmlService.createHtmlOutputFromFile('Sistema')
    .setTitle('Sistema de Obras')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Tudo o que a tela precisa, numa chamada só. */
function sisCarregar() {
  sisGarantirAbas_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var obra = '';
  try { obra = String(ss.getSheetByName('Resumo').getRange('B2').getDisplayValue() || ''); } catch (e) {}
  var fornecedores = sisLer_(SIS_ABAS.forn, SIS_COLS.forn);
  return {
    config: sisConfig_(),
    inicio: sisInicio_(),
    obra: obra || ss.getName(),
    usuario: sisUsuario_(),
    hoje: sisIso_(new Date()),
    status: SIS_STATUS,
    demandas: sisLer_(SIS_ABAS.dem, SIS_COLS.dem),
    fornecedores: fornecedores,
    interacoes: sisLer_(SIS_ABAS.inter, SIS_COLS.inter),
    historico: sisHistoricoFornecedores_(),
    pessoas: sisPessoas_()
  };
}

/* ------------------------------------------------------------------ gravação */

function sisSalvarDemanda(d) {
  return sisComTrava_(function () {
    var agora = new Date();
    var quem = sisUsuario_();
    var sh = sisAba_(SIS_ABAS.dem, SIS_COLS.dem);
    var linha = d.ID ? sisAcharLinha_(sh, d.ID) : 0;
    var antigo = linha ? sisLinhaObj_(sh, linha, SIS_COLS.dem) : {};
    var hist = String(antigo['Histórico'] || '');
    var marca = Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM HH:mm') + ' ' + quem + ': ';
    if (!linha) {
      d.ID = sisNovoId_('D');
      d['Criada em'] = agora;
      hist = marca + 'criou';
    } else if (antigo.Status !== d.Status) {
      hist += '\n' + marca + (antigo.Status || '—') + ' → ' + d.Status;
    } else {
      hist += '\n' + marca + 'editou';
    }
    if (d.Status === 'Concluída' && !antigo['Concluída em']) d['Concluída em'] = agora;
    if (d.Status !== 'Concluída') d['Concluída em'] = '';
    d['Atualizada em'] = agora;
    d['Histórico'] = hist;
    d['Prazo'] = sisData_(d['Prazo']);
    d['Criada em'] = linha ? antigo['Criada em'] : d['Criada em'];
    sisGravar_(sh, linha, SIS_COLS.dem, d);
    return sisCarregar();
  });
}

function sisSalvarFornecedor(f) {
  return sisComTrava_(function () {
    var agora = new Date();
    var sh = sisAba_(SIS_ABAS.forn, SIS_COLS.forn);
    var linha = f.ID ? sisAcharLinha_(sh, f.ID) : 0;
    if (!linha) {
      var nome = sisChave_(f.Nome);
      var ja = sisLer_(SIS_ABAS.forn, SIS_COLS.forn).filter(function (x) { return sisChave_(x.Nome) === nome; });
      if (ja.length) throw new Error('Já existe um fornecedor com o nome "' + f.Nome + '".');
      f.ID = sisNovoId_('F');
      f['Criado em'] = agora;
    } else {
      f['Criado em'] = sisLinhaObj_(sh, linha, SIS_COLS.forn)['Criado em'];
    }
    f['Atualizado em'] = agora;
    f['Próximo contato'] = sisData_(f['Próximo contato']);
    sisGravar_(sh, linha, SIS_COLS.forn, f);
    return sisCarregar();
  });
}

function sisSalvarInteracao(i) {
  return sisComTrava_(function () {
    var sh = sisAba_(SIS_ABAS.inter, SIS_COLS.inter);
    var linha = i.ID ? sisAcharLinha_(sh, i.ID) : 0;
    if (!linha) {
      i.ID = sisNovoId_('I');
      i.Autor = sisUsuario_();
    }
    i['Data'] = sisData_(i['Data']) || new Date();
    i['Data do próximo passo'] = sisData_(i['Data do próximo passo']);
    sisGravar_(sh, linha, SIS_COLS.inter, i);
    return sisCarregar();
  });
}

/** Cria no CRM os fornecedores que já aparecem nas abas da obra e ainda não estão cadastrados. */
function sisImportarFornecedores() {
  return sisComTrava_(function () {
    var hist = sisHistoricoFornecedores_();
    var sh = sisAba_(SIS_ABAS.forn, SIS_COLS.forn);
    var existentes = {};
    sisLer_(SIS_ABAS.forn, SIS_COLS.forn).forEach(function (x) { existentes[sisChave_(x.Nome)] = true; });
    var agora = new Date(), novos = 0;
    Object.keys(hist).forEach(function (k) {
      if (existentes[k]) return;
      var h = hist[k];
      sisGravar_(sh, 0, SIS_COLS.forn, {
        ID: sisNovoId_('F'), Nome: h.nome, Tipo: h.contratos.length ? 'Empreiteiro / prestador' : 'Fornecedor',
        'Categoria / serviço': h.servicos.slice(0, 3).join(', '), Situação: 'Ativo',
        'Criado em': agora, 'Atualizado em': agora
      });
      novos++;
    });
    var r = sisCarregar();
    r.importados = novos;
    return r;
  });
}

/* ------------------------------------------------------- histórico na planilha */

function sisHistoricoFornecedores_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var H = {};
  function reg(nome) {
    var k = sisChave_(nome);
    if (!k) return null;
    if (!H[k]) H[k] = { nome: String(nome).trim(), cotacoes: [], contratos: [], medicoes: [], lancamentos: [], compras: [], servicos: [] };
    return H[k];
  }
  function serv(h, s) { s = String(s || '').trim(); if (s && h.servicos.indexOf(s) < 0) h.servicos.push(s); }

  // Cotações: cabeçalho na linha 5; até 4 propostas por linha (K/L, P/Q, U/V, Z/AA)
  var sh = ss.getSheetByName('Cotações');
  if (sh && sh.getLastRow() >= 6) {
    var n = sh.getLastRow() - 5;
    var v = sh.getRange(6, 1, n, 42).getValues();
    var dv = sh.getRange(6, 1, n, 1).getDisplayValues();
    v.forEach(function (r, i) {
      if (!r[4]) return;
      var escolhido = sisChave_(r[35]);
      [[10, 11, 12], [15, 16, 17], [20, 21, 22], [25, 26, 27]].forEach(function (p) {
        var h = reg(r[p[0]]);
        if (!h) return;
        serv(h, r[4]);
        h.cotacoes.push({ n: dv[i][0], data: sisIso_(r[1]), servico: String(r[4]), valor: sisNum_(r[p[1]]),
                          prazo: String(r[p[2]] || ''), escolhido: escolhido && escolhido === sisChave_(r[p[0]]),
                          status: String(r[38] || '') });
      });
    });
  }
  // Contratos: cabeçalho na linha 4
  sh = ss.getSheetByName('Contratos');
  if (sh && sh.getLastRow() >= 5) {
    sh.getRange(5, 1, sh.getLastRow() - 4, 17).getValues().forEach(function (r) {
      var h = reg(r[1]);
      if (!h || !r[0]) return;
      serv(h, r[2]);
      h.contratos.push({ n: String(r[0]), servico: String(r[2] || ''), forma: String(r[4] || ''), valor: sisNum_(r[8]),
                         inicio: sisIso_(r[10]), termino: sisIso_(r[11]), medido: sisNum_(r[13]), pct: sisNum_(r[14]) });
    });
  }
  // Medições: cabeçalho na linha 4
  sh = ss.getSheetByName('Medições');
  if (sh && sh.getLastRow() >= 5) {
    sh.getRange(5, 1, sh.getLastRow() - 4, 14).getValues().forEach(function (r) {
      var h = reg(r[2]);
      if (!h || !r[1]) return;
      h.medicoes.push({ data: sisIso_(r[0]), contrato: String(r[1]), periodo: String(r[4] || ''), bruto: sisNum_(r[7]),
                        liquido: sisNum_(r[9]), pago: String(r[12] || '').toUpperCase() === 'S', dataPgto: sisIso_(r[13]) });
    });
  }
  // Lançamentos: cabeçalho na linha 4
  sh = ss.getSheetByName('Lançamentos');
  if (sh && sh.getLastRow() >= 5) {
    sh.getRange(5, 1, sh.getLastRow() - 4, 16).getValues().forEach(function (r) {
      var h = reg(r[3]);
      if (!h || r[7] === '') return;
      h.lancamentos.push({ data: sisIso_(r[0]), descricao: String(r[2] || ''), valor: sisNum_(r[7]), vencimento: sisIso_(r[8]),
                           status: String(r[14] || r[9] || ''), dataPgto: sisIso_(r[15]) });
    });
  }
  // Compras: cabeçalho na linha 4
  sh = ss.getSheetByName('Compras');
  if (sh && sh.getLastRow() >= 5) {
    sh.getRange(5, 1, sh.getLastRow() - 4, 13).getValues().forEach(function (r) {
      var h = reg(r[7]);
      if (!h || !r[1]) return;
      serv(h, r[1]);
      h.compras.push({ material: String(r[1]), pedido: sisIso_(r[8]), prevista: sisIso_(r[9]), real: sisIso_(r[10]),
                       valor: sisNum_(r[11]), status: String(r[12] || '') });
    });
  }
  return H;
}

/** Nomes para o campo "Responsável": quem já aparece nas demandas + equipe ativa da aba Pessoas. */
function sisPessoas_() {
  var nomes = {};
  sisLer_(SIS_ABAS.dem, SIS_COLS.dem).forEach(function (d) { if (d['Responsável']) nomes[d['Responsável']] = 1; });
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pessoas');
  if (sh && sh.getLastRow() >= 6) {
    sh.getRange(6, 2, Math.min(120, sh.getLastRow() - 5), 1).getValues().forEach(function (r) { if (r[0]) nomes[String(r[0]).trim()] = 1; });
  }
  return Object.keys(nomes).sort();
}

/* --------------------------------------------------------------- utilidades */

function sisGarantirAbas_() {
  sisAba_(SIS_ABAS.dem, SIS_COLS.dem);
  sisAba_(SIS_ABAS.forn, SIS_COLS.forn);
  sisAba_(SIS_ABAS.inter, SIS_COLS.inter);
}

function sisAba_(nome, cols) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.getRange(1, 1, 1, cols.length).setValues([cols])
      .setFontWeight('bold').setFontColor('#ffffff').setBackground('#1F3864');
    sh.setFrozenRows(1);
    sh.setTabColor('#AD1457');
    sh.getRange(1, 1).setNote('Aba usada pelo Sistema de Obras (CRM). Pode consultar e filtrar; para editar, prefira o sistema.');
  }
  return sh;
}

function sisLer_(nome, cols) {
  var sh = sisAba_(nome, cols);
  var n = sh.getLastRow() - 1;
  if (n < 1) return [];
  var v = sh.getRange(2, 1, n, cols.length).getValues();
  return v.filter(function (r) { return r[0] !== ''; }).map(function (r) {
    var o = {};
    cols.forEach(function (c, i) { o[c] = r[i] instanceof Date ? sisIso_(r[i]) : r[i]; });
    return o;
  });
}

function sisLinhaObj_(sh, linha, cols) {
  var r = sh.getRange(linha, 1, 1, cols.length).getValues()[0];
  var o = {};
  cols.forEach(function (c, i) { o[c] = r[i]; });
  return o;
}

function sisAcharLinha_(sh, id) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  var ids = sh.getRange(2, 1, n, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

function sisGravar_(sh, linha, cols, obj) {
  var row = cols.map(function (c) { var v = obj[c]; return v === undefined || v === null ? '' : v; });
  if (!linha) linha = sh.getLastRow() + 1;
  sh.getRange(linha, 1, 1, cols.length).setValues([row]);
}

function sisComTrava_(fn) {
  var lock = LockService.getDocumentLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function sisNovoId_(prefixo) {
  return prefixo + Utilities.formatDate(new Date(), 'GMT-3', 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
}

function sisUsuario_() {
  var e = '';
  try { e = Session.getActiveUser().getEmail(); } catch (x) {}
  return e ? e.split('@')[0] : 'usuário';
}

function sisChave_(s) {
  return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function sisNum_(v) {
  return typeof v === 'number' ? v : (v === '' || v === null ? null : Number(String(v).replace(/\./g, '').replace(',', '.')) || null);
}

function sisIso_(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function sisData_(s) {
  if (!s) return '';
  if (s instanceof Date) return s;
  var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : '';
}
