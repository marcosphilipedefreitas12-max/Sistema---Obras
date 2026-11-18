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
  return function (fn, a) {
    a = a ? JSON.parse(JSON.stringify(a)) : a;
    if (fn === 'sisSalvarDemanda') { if (!a.ID) { a.ID = 'D' + (n++); st.demandas.push(a); } else st.demandas = st.demandas.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisSalvarFornecedor') { if (!a.ID) { a.ID = 'F' + (n++); st.fornecedores.push(a); } else st.fornecedores = st.fornecedores.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisSalvarInteracao') { if (!a.ID) { a.ID = 'I' + (n++); a.Autor = 'usuario'; st.interacoes.push(a); } else st.interacoes = st.interacoes.map(function (d) { return d.ID === a.ID ? a : d; }); }
    if (fn === 'sisImportarFornecedores') { Object.keys(st.historico).forEach(function (k) { if (!st.fornecedores.some(function (f) { return f.Nome.toLowerCase() === k; })) st.fornecedores.push({ ID: 'F' + (n++), Nome: st.historico[k].nome, Tipo: 'Fornecedor', 'Situação': 'Ativo' }); }); }
    var r = JSON.parse(JSON.stringify(st)); if (fn === 'sisImportarFornecedores') r.importados = 2; return r;
  };
})();
