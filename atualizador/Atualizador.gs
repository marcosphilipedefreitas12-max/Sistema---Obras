/**
 * ATUALIZADOR DO SISTEMA DE OBRAS
 *
 * Projeto separado (script.google.com → Novo projeto), só do dono do sistema.
 * A cada hora confere o código no GitHub (ramo main). Se mudou, troca os arquivos
 * Sistema.gs, Modulos.gs e Sistema.html no projeto do sistema, cria uma versão nova
 * e atualiza a implantação — o link do sistema continua o mesmo.
 *
 * Instalar (uma vez):
 *  1. Ligar a "API do Google Apps Script" em https://script.google.com/home/usersettings
 *  2. Colar este arquivo e o appsscript.json (Configurações do projeto → mostrar manifesto)
 *  3. Preencher SCRIPT_ID e DEPLOYMENT_ID abaixo e executar a função "instalar"
 */

var SCRIPT_ID = 'COLE_AQUI_O_ID_DO_SCRIPT';          // projeto do sistema → Configurações do projeto → "ID do script"
var DEPLOYMENT_ID = 'COLE_AQUI_O_CODIGO_DE_IMPLANTACAO'; // o código que aparece em Implantar → Gerenciar implantações (começa com AKfycb)

var REPO = 'marcosphilipedefreitas12-max/Sistema---Obras', RAMO = 'main';
var ARQUIVOS = [
  { caminho: 'apps-script/Sistema.gs', nome: 'Código', tipo: 'SERVER_JS' }, // no projeto o .gs não pode ter o mesmo nome do Sistema.html
  { caminho: 'apps-script/Modulos.gs', nome: 'Modulos', tipo: 'SERVER_JS' },
  { caminho: 'apps-script/Sistema.html', nome: 'Sistema', tipo: 'HTML' }
];

/** Executar UMA vez: autoriza, liga a verificação de hora em hora e já atualiza. */
function instalar() {
  if (/COLE_AQUI/.test(SCRIPT_ID + DEPLOYMENT_ID)) throw new Error('Preencha SCRIPT_ID e DEPLOYMENT_ID no topo do arquivo.');
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'verificar') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('verificar').timeBased().everyHours(1).create();
  PropertiesService.getScriptProperties().deleteProperty('VERSAO');
  var r = atualizarAgora();
  Logger.log('Instalado. Verificação automática de hora em hora ligada. ' + r);
}

/** Desliga a atualização automática. */
function desligar() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'verificar') ScriptApp.deleteTrigger(t); });
  Logger.log('Atualização automática desligada.');
}

/** Chamado pelo gatilho de hora em hora. */
function verificar() {
  try { var r = atualizarAgora(); if (r.indexOf('Atualizado') === 0) avisar_('Sistema de Obras atualizado', r); }
  catch (e) {
    var p = PropertiesService.getScriptProperties(), ult = p.getProperty('ULTIMO_ERRO');
    if (ult !== e.message) { p.setProperty('ULTIMO_ERRO', e.message); avisar_('Sistema de Obras: a atualização automática falhou', e.message + '\n\nO sistema continua funcionando na versão anterior.'); }
  }
}

/** Pode executar à mão também (botão Executar). */
function atualizarAgora() {
  var novos = ARQUIVOS.map(function (a) {
    var url = 'https://raw.githubusercontent.com/' + REPO + '/' + RAMO + '/' + a.caminho + '?t=' + Date.now();
    var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) throw new Error('Não consegui baixar ' + a.caminho + ' do GitHub (código ' + r.getResponseCode() + ').');
    var src = r.getContentText('UTF-8');
    if (src.length < 500) throw new Error('Arquivo ' + a.caminho + ' veio vazio ou incompleto.');
    return { name: a.nome, type: a.tipo, source: src };
  });
  var versao = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, novos.map(function (f) { return f.source; }).join('\u0000'), Utilities.Charset.UTF_8)).slice(0, 12);
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('VERSAO') === versao) return 'Já está na versão mais nova (' + versao + ').';

  // conteúdo atual do projeto: mantém o que não é do sistema (Script_Obra, manifesto etc.)
  var atual = api_('get', '/content').files || [];
  var manter = atual.filter(function (f) {
    if (f.type === 'JSON') return true;
    if (novos.some(function (n) { return n.name === f.name && n.type === f.type; })) return false;
    if (f.type === 'SERVER_JS' && /function sisChamar\(|var SIS_MODULOS|function sisAbaLer\(/.test(f.source)) return false; // cópia antiga com outro nome (ex.: Código)
    return true;
  });
  if (!manter.some(function (f) { return f.name === 'appsscript' && f.type === 'JSON'; })) throw new Error('O projeto do sistema não tem o arquivo appsscript.json. Confira o SCRIPT_ID.');
  api_('put', '/content', { files: manter.concat(novos) });
  var ver = api_('post', '/versions', { description: 'Atualização automática ' + versao });
  api_('put', '/deployments/' + DEPLOYMENT_ID, { deploymentConfig: { scriptId: SCRIPT_ID, versionNumber: ver.versionNumber, manifestFileName: 'appsscript', description: 'Sistema de Obras ' + versao } });
  props.setProperty('VERSAO', versao); props.deleteProperty('ULTIMO_ERRO');
  var msg = 'Atualizado para a versão ' + versao + ' (versão nº ' + ver.versionNumber + ' do projeto) em ' + Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm') + '.';
  Logger.log(msg); return msg;
}

function api_(metodo, caminho, corpo) {
  var op = { method: metodo, headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true, contentType: 'application/json' };
  if (corpo) op.payload = JSON.stringify(corpo);
  var r = UrlFetchApp.fetch('https://script.googleapis.com/v1/projects/' + SCRIPT_ID + caminho, op), c = r.getResponseCode(), t = r.getContentText();
  if (c >= 300) {
    var dica = /has not been used|is disabled|SERVICE_DISABLED/i.test(t) ? ' → Ligue a "API do Google Apps Script" em https://script.google.com/home/usersettings e tente de novo em alguns minutos.'
      : c === 404 ? ' → Confira o SCRIPT_ID e o DEPLOYMENT_ID.' : c === 403 ? ' → Esta conta precisa ser dona (ou editora) do projeto do sistema.' : '';
    throw new Error('Erro ' + c + ' ao falar com o Apps Script (' + caminho + '): ' + t.slice(0, 300) + dica);
  }
  return t ? JSON.parse(t) : {};
}

function avisar_(assunto, texto) {
  try { MailApp.sendEmail(Session.getEffectiveUser().getEmail(), assunto, texto); } catch (e) {}
}
