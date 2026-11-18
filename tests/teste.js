// Teste das telas fora do Google: node tests/teste.js (precisa do pacote playwright)
// Usa dados fictícios de tests/mock.js e o menu real de apps-script/Modulos.gs. Gera tests/saida/*.png
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = __dirname, out = path.join(dir, 'saida'), as = path.join(dir, '..', 'apps-script');
  fs.mkdirSync(out, { recursive: true });
  const inj = '<script>' + fs.readFileSync(path.join(as, 'Modulos.gs'), 'utf8') + '</script><script src="mock.js"></script><script>';
  const html = fs.readFileSync(path.join(as, 'Sistema.html'), 'utf8').replace('<script>', inj);
  fs.writeFileSync(path.join(dir, '_pagina.html'), html);
  const b = await chromium.launch(); const erros = [];
  const abrir = async (w, h) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', e => erros.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) erros.push(m.text()); });
    await p.goto('file://' + path.join(dir, '_pagina.html')); await p.waitForTimeout(600); return p;
  };
  const p = await abrir(1366, 860);
  await p.screenshot({ path: path.join(out, 'obras.png') });
  await p.click('text=+ Nova obra'); await p.fill('#oNome', 'Obra Nova Teste'); await p.click('#gaveta footer .btn:not(.sec)'); await p.waitForTimeout(500);
  await p.click('.obra .abre >> nth=0'); await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(out, 'inicio.png'), fullPage: true });
  await p.evaluate(() => trocarTema()); await p.waitForTimeout(200); await p.screenshot({ path: path.join(out, 'inicio_escuro.png'), fullPage: true }); await p.evaluate(() => trocarTema());
  await p.evaluate(() => ir('perfis')); await p.waitForTimeout(400); await p.selectOption('#pp0', 'Encarregado'); await p.click('text=Salvar perfis'); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(out, 'perfis.png') });
  // todas as telas do menu abrem sem erro
  for (const id of await p.evaluate(() => CFG.modulos.map(m => m.id))) { await p.evaluate(i => ir(i), id); await p.waitForTimeout(250); }
  await p.evaluate(() => ir('diario')); await p.waitForTimeout(400);
  await p.click('text=+ Novo registro'); await p.fill('#gaveta input[type=date]', '2026-11-18'); await p.fill('#gaveta textarea, #gaveta input[id=c3]', 'Teste');
  await p.screenshot({ path: path.join(out, 'diario_novo.png') });
  await p.click('#gaveta >> text=Salvar na planilha'); await p.waitForTimeout(500);
  await p.evaluate(() => ir('presenca')); await p.waitForTimeout(400); await p.click('.seg button.P >> nth=0'); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(out, 'presenca.png') });
  await p.evaluate(() => ir('demandas')); await p.click('text=+ Nova demanda');
  await p.fill('#fTit', 'Demanda de teste'); await p.click('#gaveta >> text=Salvar'); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(out, 'demandas.png'), fullPage: true });
  await p.evaluate(() => ir('fornecedores')); await p.click('text=Importar todos'); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(out, 'fornecedores.png'), fullPage: true });
  const m = await abrir(390, 844);
  await m.screenshot({ path: path.join(out, 'celular_obras.png') }); await m.click('.obra .abre >> nth=0'); await m.waitForTimeout(600);
  await m.screenshot({ path: path.join(out, 'celular.png'), fullPage: true });
  await m.evaluate(() => menuMob()); await m.waitForTimeout(300); await m.screenshot({ path: path.join(out, 'celular_menu.png') });
  await b.close(); fs.unlinkSync(path.join(dir, '_pagina.html'));
  if (erros.length) { console.error('ERROS:', erros); process.exit(1); }
  console.log('OK — telas em', out);
})();
