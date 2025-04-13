
export interface CalculatorInput {
  valorArremate: number;
  valorVenal: number;
  valorVenda: number;
  comissaoLeiloeiro: number;
  itbiPercentual: number;
  registro: number;
  oficialImissao: number;
  cartaArremate: number;
  honorariosAdvocaticios: number;
  reforma: number;
  outros: number;
  prazoVenda: number;
  iptuMensal: number;
  despesasMensais: number;
  comissaoCorretor: number;
}

export interface CalculationResults {
  valorArremate: number;
  valorVenda: number;
  custasAquisicao: number;
  custasManutencao: number;
  custasVenda: number;
  lucro: { 
    bruto: number;
    porcentagem: number;
    liquido: number;
  };
  detalhes: {
    label: string;
    value: number;
  }[];
}

export const calculateResults = (input: CalculatorInput): CalculationResults => {
  // Cálculo das custas de aquisição
  const comissaoLeiloeiroValor = (input.valorArremate * input.comissaoLeiloeiro) / 100;
  const itbiValor = (input.valorArremate * input.itbiPercentual) / 100;
  const custasAquisicao = comissaoLeiloeiroValor + itbiValor + input.registro + 
    input.oficialImissao + input.cartaArremate + input.honorariosAdvocaticios;
  
  // Cálculo das custas de manutenção
  const despesasMensaisTotal = (input.iptuMensal + input.despesasMensais) * input.prazoVenda;
  const custasManutencao = input.reforma + despesasMensaisTotal + input.outros;
  
  // Cálculo das custas de venda
  const comissaoCorretorValor = (input.valorVenda * input.comissaoCorretor) / 100;
  const custasVenda = comissaoCorretorValor;
  
  // Cálculo do lucro
  const custoTotal = input.valorArremate + custasAquisicao + custasManutencao + custasVenda;
  const lucroBruto = input.valorVenda - custoTotal;
  const lucroPercentual = (lucroBruto / custoTotal) * 100;
  
  // Detalhes para exibição itemizada
  const detalhes = [
    { label: 'Valor da Arrematação', value: -input.valorArremate },
    { label: 'Comissão do Leiloeiro', value: -comissaoLeiloeiroValor },
    { label: 'ITBI', value: -itbiValor },
    { label: 'Registro', value: -input.registro },
    { label: 'Oficial (imissão na posse)', value: -input.oficialImissao },
    { label: 'Carta de Arrematação', value: -input.cartaArremate },
    { label: 'Honorários Advocatícios', value: -input.honorariosAdvocaticios },
    { label: 'Reforma', value: -input.reforma },
    { label: 'Despesas Mensais', value: -despesasMensaisTotal },
    { label: 'Outros Custos', value: -input.outros },
    { label: 'Comissão do Corretor', value: -comissaoCorretorValor },
    { label: 'Valor de Venda', value: input.valorVenda },
  ];
  
  return {
    valorArremate: input.valorArremate,
    valorVenda: input.valorVenda,
    custasAquisicao,
    custasManutencao,
    custasVenda,
    lucro: {
      bruto: lucroBruto,
      porcentagem: lucroPercentual,
      liquido: lucroBruto
    },
    detalhes
  };
};
