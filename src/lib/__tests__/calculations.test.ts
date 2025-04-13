
import { describe, test, expect } from 'vitest';
import {
  calculateAcquisitionCostsTotal,
  calculateMaintenanceCostsTotal,
  calculateSaleCostsTotal,
  calculateCapitalGainsTax,
  calculateResults,
  formatCurrency,
  formatPercentage,
  formatDate,
  InitialValues,
  AcquisitionCosts,
  MaintenanceCosts,
  SaleCosts,
  CapitalGainsTax
} from '../calculations';

describe('Calculation Functions', () => {
  // Valores de teste padrão
  const initialValues: InitialValues = {
    auctionPrice: 300000,
    assessedValue: 300000,
    resalePrice: 450000
  };

  const acquisitionCosts: AcquisitionCosts = {
    auctioneerCommission: 5,
    itbiTax: 3,
    registryFees: 2000,
    possessionOfficer: 1000,
    deedIssuance: 500,
    legalFees: 1500
  };

  const maintenanceCosts: MaintenanceCosts = {
    renovation: 30000,
    monthlyIptu: 375,
    otherMonthlyExpenses: 200,
    holdingPeriod: 6
  };

  const saleCosts: SaleCosts = {
    brokerCommission: 5,
    appraisalFees: 1000
  };

  const capitalGainsTax: CapitalGainsTax = {
    acquisitionDate: new Date(),
    deedCost: 0,
    isOnlyProperty: false,
    willReinvest: false
  };

  // Testes para calculateAcquisitionCostsTotal
  test('calculateAcquisitionCostsTotal calcula corretamente os custos totais de aquisição', () => {
    const result = calculateAcquisitionCostsTotal(initialValues, acquisitionCosts);
    
    // Cálculos manuais de verificação
    const expectedCommission = initialValues.auctionPrice * (acquisitionCosts.auctioneerCommission / 100);
    const expectedItbi = initialValues.auctionPrice * (acquisitionCosts.itbiTax / 100);
    const expectedOtherCosts = acquisitionCosts.registryFees + 
                               acquisitionCosts.possessionOfficer + 
                               acquisitionCosts.deedIssuance + 
                               acquisitionCosts.legalFees;
    const expectedTotal = expectedCommission + expectedItbi + expectedOtherCosts;
    
    expect(result).toBeCloseTo(expectedTotal, 2);
  });

  // Testes para calculateMaintenanceCostsTotal
  test('calculateMaintenanceCostsTotal calcula corretamente os custos totais de manutenção', () => {
    const result = calculateMaintenanceCostsTotal(maintenanceCosts);
    
    // Cálculo manual de verificação
    const expectedRecurringCosts = (maintenanceCosts.monthlyIptu + maintenanceCosts.otherMonthlyExpenses) * 
                                  maintenanceCosts.holdingPeriod;
    const expectedTotal = maintenanceCosts.renovation + expectedRecurringCosts;
    
    expect(result).toBeCloseTo(expectedTotal, 2);
  });

  // Testes para calculateSaleCostsTotal
  test('calculateSaleCostsTotal calcula corretamente os custos totais de venda', () => {
    const result = calculateSaleCostsTotal(initialValues, saleCosts);
    
    // Cálculo manual de verificação
    const expectedCommission = initialValues.resalePrice * (saleCosts.brokerCommission / 100);
    const expectedTotal = expectedCommission + saleCosts.appraisalFees;
    
    expect(result).toBeCloseTo(expectedTotal, 2);
  });

  // Testes para calculateCapitalGainsTax
  test('calculateCapitalGainsTax calcula corretamente o imposto de ganho de capital', () => {
    const result = calculateCapitalGainsTax(initialValues, acquisitionCosts, capitalGainsTax);
    
    // Verifique se o objeto de retorno tem a estrutura esperada
    expect(result).toHaveProperty('capitalGain');
    expect(result).toHaveProperty('taxDue');
    expect(result).toHaveProperty('taxDueDate');
    expect(result).toHaveProperty('exemptionReason');
  });

  // Teste para calculateCapitalGainsTax com isenção para único imóvel
  test('calculateCapitalGainsTax aplica isenção para único imóvel', () => {
    const modifiedCapitalGainsTax = { 
      ...capitalGainsTax, 
      isOnlyProperty: true 
    };
    
    // Ajustando o valor de venda para estar dentro do limite de isenção
    const modifiedInitialValues = { 
      ...initialValues, 
      resalePrice: 440000 
    };
    
    const result = calculateCapitalGainsTax(modifiedInitialValues, acquisitionCosts, modifiedCapitalGainsTax);
    
    expect(result.taxDue).toBe(0);
    expect(result.exemptionReason).toBe("Exemption for only property under R$440,000");
  });

  // Teste para calculateCapitalGainsTax com reinvestimento
  test('calculateCapitalGainsTax aplica isenção para reinvestimento', () => {
    const modifiedCapitalGainsTax = { 
      ...capitalGainsTax, 
      willReinvest: true 
    };
    
    const result = calculateCapitalGainsTax(initialValues, acquisitionCosts, modifiedCapitalGainsTax);
    
    expect(result.taxDue).toBe(0);
    expect(result.exemptionReason).toBe("Will reinvest in another residential property within 180 days");
  });

  // Teste para calculateResults
  test('calculateResults integra todos os cálculos corretamente', () => {
    const result = calculateResults(initialValues, acquisitionCosts, maintenanceCosts, saleCosts, capitalGainsTax);
    
    expect(result).toHaveProperty('grossProfit');
    expect(result).toHaveProperty('netProfit');
    expect(result).toHaveProperty('roi');
    expect(result).toHaveProperty('capitalGain');
    expect(result).toHaveProperty('capitalGainsTaxDue');
    expect(result).toHaveProperty('breakdownItems');
    
    // Verifique se o lucro bruto é calculado corretamente
    expect(result.grossProfit).toBe(initialValues.resalePrice - initialValues.auctionPrice);
  });

  // Testes para as funções de formatação
  test('formatCurrency formata corretamente valores monetários', () => {
    expect(formatCurrency(1000)).toMatch(/R\$/);
  });
  
  test('formatPercentage formata corretamente percentuais', () => {
    expect(formatPercentage(25)).toMatch(/%/);
  });
  
  test('formatDate formata corretamente datas', () => {
    const date = new Date('2024-01-01');
    const formattedDate = formatDate(date);
    expect(formattedDate).toBeTruthy();
  });

  // Testes de caso de borda
  test('calculateAcquisitionCostsTotal lida com valores zero', () => {
    const zeroInitialValues = { ...initialValues, auctionPrice: 0 };
    const result = calculateAcquisitionCostsTotal(zeroInitialValues, acquisitionCosts);
    
    expect(result).toBeGreaterThanOrEqual(0);
  });
  
  test('calculateResults lida com lucro negativo', () => {
    const lowResale = { ...initialValues, resalePrice: 200000 };
    const result = calculateResults(lowResale, acquisitionCosts, maintenanceCosts, saleCosts, capitalGainsTax);
    
    expect(result.grossProfit).toBeLessThan(0);
    expect(result.netProfit).toBeLessThan(0);
  });
});
