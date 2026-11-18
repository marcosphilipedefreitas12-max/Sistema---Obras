// Teste das telas fora do Google: node tests/teste.js (precisa do pacote playwright)
// Gera tests/saida/*.png com dados fictícios de tests/mock.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = __dirname, out = path.join(dir, 'saida');
  fs.mkdirSync(out, { recursive: true });
  const html = fs.readFileSync(path.join(dir, '..', 'apps-script', 'Sistema.html'), 'utf8').replace('<script>', '<script src="mock.js"></script><script>');
  fs.writeFileSync(path.join(dir, '_pagina.html'), html);
  const b = await chromium.launch(); const erros = [];
  const p = await b.newPage({ viewport: { width: 1280, height: 860 } });
  p.on('pageerror', e => erros.push(e.message));
  await p.goto('file://' + path.join(dir, '_pagina.html')); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(out, 'inicio.png'), fullPage: true });
  await p.click('nav button[data-v=demandas]'); await p.click('text=+ Nova demanda');
  await p.fill('#fTit', 'Demanda de teste'); await p.click('.modal >> text=Salvar'); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(out, 'demandas.png'), fullPage: true });
  await p.click('nav button[data-v=fornecedores]'); await p.click('text=Importar todos'); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(out, 'fornecedores.png'), fullPage: true });
  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto('file://' + path.join(dir, '_pagina.html')); await m.waitForTimeout(500);
  await m.screenshot({ path: path.join(out, 'celular.png'), fullPage: true });
  await b.close(); fs.unlinkSync(path.join(dir, '_pagina.html'));
  if (erros.length) { console.error('ERROS:', erros); process.exit(1); }
  console.log('OK — telas em', out);
})();
