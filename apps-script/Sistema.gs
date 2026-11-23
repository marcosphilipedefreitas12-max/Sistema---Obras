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
 *
 * VÁRIAS OBRAS: o mesmo link serve para todas. Cada obra é uma planilha (cópia do
 * Modelo); a lista fica nas propriedades do script. Como o app roda com a conta de
 * quem acessa, cada pessoa só abre as obras cujas planilhas foram compartilhadas
 * com ela (Compartilhar → Editor).
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
  return HtmlService.createHtmlOutputFromFile('Sistema')
    .setTitle('Sistema de Obras')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Tudo o que a tela precisa, numa chamada só. */
function sisCarregar() {
  var ss = sisSS_();
  var pm0 = sisPermissoes_();
  if (pm0.grava) { try { sisGarantirAbas_(); } catch (e) {} }
  var aviso = '';
  if (pm0.admin) { try { aviso = sisPresencaAtualizar_(); } catch (e) { aviso = 'Não consegui atualizar os códigos de presença da planilha: ' + e.message; } }
  var obra = '';
  try { obra = String(ss.getSheetByName('Resumo').getRange('B2').getDisplayValue() || ''); } catch (e) {}
  var pm = sisPermissoes_(), veForn = pm.modulos.indexOf('fornecedores') >= 0;
  var fornecedores = veForn ? sisLer_(SIS_ABAS.forn, SIS_COLS.forn) : [];
  var inicio = sisInicio_();
  if (!pm.custos) { // sem valores em R$ para quem não é engenheiro/administrador
    inicio.numeros = inicio.numeros.filter(function (n) { return !/R\$/.test(n.campo); });
    if (inicio.painel) { inicio.painel.custo = null; inicio.painel.pagar = null; inicio.painel.etapas = []; inicio.painel.vencidas = null; }
  }
  return {
    permissoes: pm,
    ia: (function () { try { var e = sisIaEstado_(); return { ligado: e.ligado }; } catch (x) { return { ligado: false }; } })(),
    avisoPlanilha: aviso,
    config: sisConfig_(),
    inicio: inicio,
    obra: obra || ss.getName(),
    usuario: sisUsuario_(),
    hoje: sisIso_(new Date()),
    status: SIS_STATUS,
    demandas: sisLer_(SIS_ABAS.dem, SIS_COLS.dem),
    fornecedores: fornecedores,
    interacoes: veForn ? sisLer_(SIS_ABAS.inter, SIS_COLS.inter) : [],
    historico: veForn ? sisHistoricoFornecedores_() : {},
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
    var marca = Utilities.formatDate(agora, sisTz_(), 'dd/MM HH:mm') + ' ' + quem + ': ';
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
  var ss = sisSS_();
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
  var sh = sisSS_().getSheetByName('Pessoas');
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
  var ss = sisSS_();
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
  var lock = LockService.getScriptLock();
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

/** Fuso da PLANILHA (não o do projeto de script), para a data gravada e a lida serem o mesmo dia. */
var SIS_TZ = null;
function sisTz_() {
  if (SIS_TZ) return SIS_TZ;
  try { SIS_TZ = sisSS_().getSpreadsheetTimeZone(); } catch (e) {}
  return SIS_TZ || (SIS_TZ = Session.getScriptTimeZone() || 'America/Sao_Paulo');
}

function sisIso_(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  return Utilities.formatDate(d, sisTz_(), 'yyyy-MM-dd');
}

/** 'aaaa-mm-dd' → data ao MEIO-DIA no fuso da planilha (meio-dia não muda de dia com diferença de fuso). */
function sisDia_(a, m, d) {
  return Utilities.parseDate(a + '-' + ('0' + m).slice(-2) + '-' + ('0' + d).slice(-2) + ' 12:00', sisTz_(), 'yyyy-MM-dd HH:mm');
}

function sisData_(s) {
  if (!s) return '';
  if (s instanceof Date) return s;
  var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? sisDia_(Number(m[1]), Number(m[2]), Number(m[3])) : '';
}

/* ======================================================== VÁRIAS OBRAS */

var SIS_OBRA_ID = '', SIS_SS = null;

/** Planilha da obra em uso nesta chamada (a escolhida na tela ou, se nenhuma, a planilha onde o script está). */
function sisSS_() {
  if (SIS_SS) return SIS_SS;
  if (SIS_OBRA_ID) {
    try { SIS_SS = SpreadsheetApp.openById(SIS_OBRA_ID); }
    catch (e) { throw new Error('Você não tem acesso a esta obra. Peça ao responsável para compartilhar a planilha com você como Editor.'); }
    return SIS_SS;
  }
  SIS_SS = SpreadsheetApp.getActiveSpreadsheet();
  if (!SIS_SS) throw new Error('Escolha uma obra.');
  return SIS_SS;
}

/** A tela chama tudo por aqui, dizendo de qual obra é a chamada. */
function sisChamar(obraId, fn, args) {
  var permitidas = { sisCarregar: sisCarregar, sisSalvarDemanda: sisSalvarDemanda, sisSalvarFornecedor: sisSalvarFornecedor,
    sisSalvarInteracao: sisSalvarInteracao, sisImportarFornecedores: sisImportarFornecedores, sisAbaLer: sisAbaLer,
    sisAbaSalvar: sisAbaSalvar, sisAbaLimpar: sisAbaLimpar, sisPresenca: sisPresenca, sisPresencaMes: sisPresencaMes, sisPresencaMarcar: sisPresencaMarcar,
    sisPerfis: sisPerfis, sisPerfisSalvar: sisPerfisSalvar, sisFotos: sisFotos, sisFotoEnviar: sisFotoEnviar, sisRelatorio: sisRelatorio, sisExecutivo: sisExecutivo, sisExecPrazo: sisExecPrazo, sisPlanReprogramar: sisPlanReprogramar, sisIaPerguntar: sisIaPerguntar, sisIaConfig: sisIaConfig, sisIaSalvarConfig: sisIaSalvarConfig,
    sisObras: sisObras, sisObraCadastrar: sisObraCadastrar, sisObraNova: sisObraNova, sisObraRemover: sisObraRemover, sisModeloDefinir: sisModeloDefinir };
  if (!permitidas[fn]) throw new Error('Função não permitida: ' + fn);
  SIS_OBRA_ID = String(obraId || ''); SIS_SS = null; SIS_PERFIL = null; SIS_TZ = null;
  if (!/^sisObra|^sisObras$|^sisModelo/.test(fn)) sisPermitir_(fn, args || []);
  return permitidas[fn].apply(null, args || []);
}

function sisRegistro_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('SIS_OBRAS') || '[]'); } catch (e) { return []; }
}
function sisRegistroGravar_(lista) { PropertiesService.getScriptProperties().setProperty('SIS_OBRAS', JSON.stringify(lista)); }
function sisIdDoLink_(link) {
  var m = String(link || '').match(/\/d\/([a-zA-Z0-9_-]{20,})/) || String(link || '').match(/^([a-zA-Z0-9_-]{20,})$/);
  if (!m) throw new Error('Cole o link completo da planilha (o endereço que começa com https://docs.google.com/spreadsheets/d/...).');
  return m[1];
}
function sisNomeObra_(ss) {
  var n = ''; try { n = String(ss.getSheetByName('Resumo').getRange('B2').getDisplayValue() || ''); } catch (e) {}
  return n || ss.getName();
}

/** Lista as obras que ESTA pessoa consegue abrir. */
function sisObras() {
  var reg = sisRegistro_(), mudou = false, ativa = null;
  try { ativa = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (ativa && !reg.length) { // primeira vez: a planilha onde o script está entra na lista
    try { reg.push({ id: ativa.getId(), nome: sisNomeObra_(ativa), resp: '', criada: sisIso_(new Date()) }); mudou = true; } catch (e) {}
  }
  var cache = CacheService.getUserCache(), lista = [];
  reg.forEach(function (o) {
    var ok = cache.get('ac_' + o.id);
    if (ok === null) {
      ok = '0';
      try { var ss = SpreadsheetApp.openById(o.id); ok = '1'; var nome = sisNomeObra_(ss); if (nome && nome !== o.nome) { o.nome = nome; mudou = true; } } catch (e) {}
      cache.put('ac_' + o.id, ok, 600);
    }
    if (ok === '1') lista.push({ id: o.id, nome: o.nome, resp: o.resp || '', url: 'https://docs.google.com/spreadsheets/d/' + o.id + '/edit' });
  });
  if (mudou) sisRegistroGravar_(reg);
  return { obras: lista, total: reg.length, usuario: sisUsuario_(), temModelo: !!PropertiesService.getScriptProperties().getProperty('SIS_MODELO') };
}

/** Cadastra uma planilha de obra que já existe. */
function sisObraCadastrar(link, resp) {
  var id = sisIdDoLink_(link), ss;
  try { ss = SpreadsheetApp.openById(id); } catch (e) { throw new Error('Não consegui abrir essa planilha. Confira o link e se ela está compartilhada com você.'); }
  if (!ss.getSheetByName('Resumo') || !ss.getSheetByName('Diário de Obra')) throw new Error('Essa planilha não parece ser do modelo de gerenciamento de obra (faltam as abas Resumo / Diário de Obra).');
  return sisComTrava_(function () {
    var reg = sisRegistro_().filter(function (o) { return o.id !== id; });
    reg.push({ id: id, nome: sisNomeObra_(ss), resp: String(resp || ''), criada: sisIso_(new Date()) });
    sisRegistroGravar_(reg); CacheService.getUserCache().remove('ac_' + id);
    return sisObras();
  });
}

/** Guarda qual planilha é o Modelo em branco. */
function sisModeloDefinir(link) {
  var id = sisIdDoLink_(link);
  try { SpreadsheetApp.openById(id); } catch (e) { throw new Error('Não consegui abrir o Modelo. Confira o link.'); }
  PropertiesService.getScriptProperties().setProperty('SIS_MODELO', id);
  return sisObras();
}

/** Cria uma obra nova: copia o Modelo para o Drive de quem clicou, dá o nome e compartilha com os responsáveis. */
function sisObraNova(nome, emails) {
  nome = String(nome || '').trim(); if (!nome) throw new Error('Escreva o nome da obra.');
  var mid = PropertiesService.getScriptProperties().getProperty('SIS_MODELO');
  if (!mid) throw new Error('Defina primeiro a planilha Modelo.');
  var modelo; try { modelo = SpreadsheetApp.openById(mid); } catch (e) { throw new Error('Você não tem acesso à planilha Modelo. Peça para compartilharem com você.'); }
  var nova = modelo.copy('Gerenciamento_Obra_' + nome.replace(/[^\wÀ-ú -]/g, '').replace(/\s+/g, '_'));
  try { nova.getSheetByName('Resumo').getRange('B2').setValue(nome); } catch (e) {}
  var lista = String(emails || '').split(/[\s,;]+/).filter(function (x) { return /@/.test(x); });
  lista.forEach(function (em) { try { nova.addEditor(em); } catch (e) {} });
  return sisComTrava_(function () {
    var reg = sisRegistro_();
    reg.push({ id: nova.getId(), nome: nome, resp: lista.join(', '), criada: sisIso_(new Date()) });
    sisRegistroGravar_(reg);
    var r = sisObras(); r.criada = { id: nova.getId(), url: nova.getUrl() }; return r;
  });
}

/** Tira a obra da lista do sistema (a planilha NÃO é apagada). Só quem tem acesso à planilha pode tirar. */
function sisObraRemover(id) {
  try { SpreadsheetApp.openById(id); } catch (e) { throw new Error('Só quem tem acesso à planilha pode tirar a obra da lista.'); }
  return sisComTrava_(function () { sisRegistroGravar_(sisRegistro_().filter(function (o) { return o.id !== id; })); return sisObras(); });
}

/* ======================================================== PERFIS DE ACESSO */
/*
 * Cada obra tem a aba "Sistema Perfis" (E-mail | Perfil | Nome). Enquanto ela estiver vazia,
 * o dono da planilha é Administrador e os demais são Engenheiro (como antes). Depois que
 * houver alguém cadastrado, quem não estiver na lista entra como Consulta.
 * A proteção de verdade continua sendo o Compartilhar da planilha; os perfis decidem o que
 * cada pessoa vê e pode lançar dentro do sistema.
 */
var SIS_PERFIS = ['Administrador', 'Engenheiro', 'Diretoria', 'Encarregado', 'Consulta'];
var SIS_PERFIL_DESC = {
  'Administrador': 'Tudo, inclusive definir os perfis da equipe.',
  'Engenheiro': 'Vê e lança em todas as telas, inclusive custos e fornecedores.',
  'Diretoria': 'Vê tudo, inclusive custos e a Visão Executiva, mas não grava nada. Para CEO, diretoria e gestores.',
  'Encarregado': 'Lança o dia a dia (diário, presença, produção, planejamento, qualidade, demandas). Não vê custos, pagamentos, fornecedores nem dados das pessoas; não apaga registros.',
  'Consulta': 'Só vê as telas (sem custos detalhados). Não grava nada. Bom para diretoria e visitantes.'
};
var SIS_ABA_PERFIS = 'Sistema Perfis', SIS_PERFIL = null;
var SIS_BLOQ_ENCARREGADO = ['lancamentos', 'contas', 'diaristas', 'fornecedores', 'pessoas'];

function sisEmail_() { try { return String(Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (e) { return ''; } }

function sisPerfilAtual_() {
  if (SIS_PERFIL) return SIS_PERFIL;
  var ss = sisSS_(), eu = sisEmail_(), dono = '';
  try { dono = String(ss.getOwner().getEmail() || '').toLowerCase(); } catch (e) {}
  var lista = sisPerfisLer_(ss), achou = null;
  lista.forEach(function (p) { if (p.email === eu) achou = p.perfil; });
  SIS_PERFIL = (eu && eu === dono) ? 'Administrador' : achou || (lista.length ? 'Consulta' : 'Engenheiro');
  if (SIS_PERFIS.indexOf(SIS_PERFIL) < 0) SIS_PERFIL = 'Consulta';
  return SIS_PERFIL;
}

function sisPerfisLer_(ss) {
  var sh = ss.getSheetByName(SIS_ABA_PERFIS); if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues()
    .filter(function (r) { return String(r[0]).indexOf('@') > 0; })
    .map(function (r) { return { email: String(r[0]).trim().toLowerCase(), perfil: String(r[1]).trim(), nome: String(r[2] || '').trim() }; });
}

/** O que o perfil pode fazer: vai para a tela junto com sisCarregar. */
function sisPermissoes_() {
  var p = sisPerfilAtual_();
  var podeModulo = function (m) {
    if (p === 'Administrador' || p === 'Engenheiro' || p === 'Diretoria') return true;
    if (m.grupo === 'custo' || SIS_BLOQ_ENCARREGADO.indexOf(m.id) >= 0) return false;
    return true;
  };
  return { perfil: p, descricao: SIS_PERFIL_DESC[p], grava: p !== 'Consulta' && p !== 'Diretoria', apaga: p === 'Administrador' || p === 'Engenheiro',
           custos: p === 'Administrador' || p === 'Engenheiro' || p === 'Diretoria', admin: p === 'Administrador',
           modulos: SIS_MODULOS.filter(podeModulo).map(function (m) { return m.id; }) };
}

/** Confere no servidor (não só na tela) se o perfil pode chamar a função. */
function sisPermitir_(fn, args) {
  var pm = sisPermissoes_(), nega = function () { throw new Error('Seu perfil (' + pm.perfil + ') não permite esta ação. Fale com o administrador da obra.'); };
  var grava = ['sisPlanReprogramar', 'sisFotoEnviar', 'sisAbaSalvar', 'sisAbaLimpar', 'sisPresencaMarcar', 'sisSalvarDemanda', 'sisSalvarFornecedor', 'sisSalvarInteracao', 'sisImportarFornecedores'];
  if (grava.indexOf(fn) >= 0 && !pm.grava) nega();
  if (fn === 'sisAbaLimpar' && !pm.apaga) nega();
  if ((/^sisAba/.test(fn) || /^sisFoto/.test(fn)) && pm.modulos.indexOf(args[0]) < 0) nega();
  if (/Fornecedor|Interacao/.test(fn) && pm.modulos.indexOf('fornecedores') < 0) nega();
  if (fn === 'sisSalvarDemanda' && pm.modulos.indexOf('demandas') < 0) nega();
  if (fn === 'sisRelatorio' && pm.modulos.indexOf('diario') < 0) nega();
  if (fn === 'sisExecPrazo' && !pm.admin) nega();
  if (fn === 'sisPlanReprogramar' && pm.modulos.indexOf('planejamento') < 0) nega();
  if (/^sisPresenca/.test(fn) && pm.modulos.indexOf('presenca') < 0) nega();
  if (fn === 'sisPerfisSalvar' && !pm.admin) nega();
  if ((fn === 'sisIaConfig' || fn === 'sisIaSalvarConfig') && !pm.admin) nega();
}

function sisPerfis() {
  var ss = sisSS_(), dono = ''; try { dono = ss.getOwner().getEmail(); } catch (e) {}
  var editores = []; try { editores = ss.getEditors().map(function (u) { return u.getEmail().toLowerCase(); }); } catch (e) {}
  var leitores = []; try { leitores = ss.getViewers().map(function (u) { return u.getEmail().toLowerCase(); }); } catch (e) {}
  return { lista: sisPerfisLer_(ss), dono: String(dono).toLowerCase(), compartilhados: editores.concat(leitores.filter(function (x) { return editores.indexOf(x) < 0; })),
           perfis: SIS_PERFIS, desc: SIS_PERFIL_DESC };
}

function sisPerfisSalvar(lista) {
  return sisComTrava_(function () {
    var ss = sisSS_(), sh = ss.getSheetByName(SIS_ABA_PERFIS);
    if (!sh) {
      sh = ss.insertSheet(SIS_ABA_PERFIS);
      sh.getRange(1, 1, 1, 3).setValues([['E-mail', 'Perfil', 'Nome']]).setFontWeight('bold').setFontColor('#ffffff').setBackground('#1F3864');
      sh.setFrozenRows(1); sh.setTabColor('#AD1457');
    }
    var linhas = (lista || []).filter(function (p) { return String(p.email).indexOf('@') > 0 && SIS_PERFIS.indexOf(p.perfil) >= 0; })
      .map(function (p) { return [String(p.email).trim().toLowerCase(), p.perfil, String(p.nome || '')]; });
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 3).clearContent();
    if (linhas.length) sh.getRange(2, 1, linhas.length, 3).setValues(linhas);
    SIS_PERFIL = null;
    sisFotosLiberar_();
    return sisPerfis();
  });
}
