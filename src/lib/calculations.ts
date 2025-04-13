
/**
 * Calculation utilities for property profit and tax simulation
 */

// Types for calculation inputs
export interface InitialValues {
  auctionPrice: number;
  assessedValue: number;
  resalePrice: number;
}

export interface AcquisitionCosts {
  auctioneerCommission: number;
  itbiTax: number;
  registryFees: number;
  possessionOfficer: number;
  deedIssuance: number;
  legalFees: number;
}

export interface MaintenanceCosts {
  renovation: number;
  monthlyIptu: number;
  otherMonthlyExpenses: number;
  holdingPeriod: number;
}

export interface SaleCosts {
  brokerCommission: number;
  appraisalFees: number;
}

export interface CapitalGainsTax {
  acquisitionDate: Date;
  deedCost: number;
  isOnlyProperty: boolean;
  willReinvest: boolean;
}

export interface SimulationResult {
  grossProfit: number;
  netProfit: number;
  roi: number; // Return on investment percentage
  capitalGain: number;
  capitalGainsTaxDue: number;
  taxDueDate: Date | null;
  taxExemptionReason: string | null;
  totalAcquisitionCosts: number;
  totalMaintenanceCosts: number;
  totalSaleCosts: number;
  breakdownItems: {
    label: string;
    value: number;
    type: 'income' | 'expense' | 'tax';
  }[];
}

// Calculation functions
export const calculateAcquisitionCostsTotal = (
  initialValues: InitialValues,
  acquisitionCosts: AcquisitionCosts
): number => {
  const { auctionPrice } = initialValues;
  const {
    auctioneerCommission,
    itbiTax,
    registryFees,
    possessionOfficer,
    deedIssuance,
    legalFees
  } = acquisitionCosts;

  const commissionAmount = (auctionPrice * auctioneerCommission) / 100;
  const itbiAmount = (auctionPrice * itbiTax) / 100;

  return (
    commissionAmount +
    itbiAmount +
    registryFees +
    possessionOfficer +
    deedIssuance +
    legalFees
  );
};

export const calculateMaintenanceCostsTotal = (
  maintenanceCosts: MaintenanceCosts
): number => {
  const {
    renovation,
    monthlyIptu,
    otherMonthlyExpenses,
    holdingPeriod
  } = maintenanceCosts;

  const recurringCosts = (monthlyIptu + otherMonthlyExpenses) * holdingPeriod;
  
  return renovation + recurringCosts;
};

export const calculateSaleCostsTotal = (
  initialValues: InitialValues,
  saleCosts: SaleCosts
): number => {
  const { resalePrice } = initialValues;
  const { brokerCommission, appraisalFees } = saleCosts;

  const commissionAmount = (resalePrice * brokerCommission) / 100;
  
  return commissionAmount + appraisalFees;
};

export const calculateCapitalGainsTax = (
  initialValues: InitialValues,
  acquisitionCosts: AcquisitionCosts,
  capitalGainsTax: CapitalGainsTax
): {
  capitalGain: number;
  taxDue: number;
  taxDueDate: Date | null;
  exemptionReason: string | null;
} => {
  const { auctionPrice, resalePrice } = initialValues;
  const {
    acquisitionDate,
    deedCost,
    isOnlyProperty,
    willReinvest
  } = capitalGainsTax;

  // Calculate acquisition cost basis
  const acquisitionCostBasis = auctionPrice + 
    calculateAcquisitionCostsTotal(initialValues, acquisitionCosts) + 
    deedCost;

  // Calculate capital gain
  let capitalGain = resalePrice - acquisitionCostBasis;

  // Apply 25% reduction for properties acquired before 1988
  const cutoffDate = new Date('1988-01-01');
  if (acquisitionDate < cutoffDate) {
    capitalGain = capitalGain * 0.75; // Apply 25% reduction
  }

  // Check for exemptions
  if (capitalGain <= 0) {
    return {
      capitalGain,
      taxDue: 0,
      taxDueDate: null,
      exemptionReason: "No capital gain"
    };
  }

  if (isOnlyProperty && resalePrice <= 440000) {
    return {
      capitalGain,
      taxDue: 0,
      taxDueDate: null,
      exemptionReason: "Exemption for only property under R$440,000"
    };
  }

  if (willReinvest) {
    return {
      capitalGain,
      taxDue: 0,
      taxDueDate: null,
      exemptionReason: "Will reinvest in another residential property within 180 days"
    };
  }

  // Calculate tax due using progressive rates
  let taxDue = 0;

  if (capitalGain <= 5000000) {
    taxDue = capitalGain * 0.15;
  } else if (capitalGain <= 10000000) {
    taxDue = capitalGain * 0.175;
  } else if (capitalGain <= 30000000) {
    taxDue = capitalGain * 0.2;
  } else {
    taxDue = capitalGain * 0.225;
  }

  // Calculate tax due date (last day of the following month)
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  
  return {
    capitalGain,
    taxDue,
    taxDueDate: nextMonth,
    exemptionReason: null
  };
};

export const calculateResults = (
  initialValues: InitialValues,
  acquisitionCosts: AcquisitionCosts,
  maintenanceCosts: MaintenanceCosts,
  saleCosts: SaleCosts,
  capitalGainsTax: CapitalGainsTax
): SimulationResult => {
  const { auctionPrice, resalePrice } = initialValues;

  // Calculate costs
  const totalAcquisitionCosts = calculateAcquisitionCostsTotal(
    initialValues,
    acquisitionCosts
  );
  const totalMaintenanceCosts = calculateMaintenanceCostsTotal(maintenanceCosts);
  const totalSaleCosts = calculateSaleCostsTotal(initialValues, saleCosts);

  // Calculate capital gains tax
  const {
    capitalGain,
    taxDue,
    taxDueDate,
    exemptionReason
  } = calculateCapitalGainsTax(initialValues, acquisitionCosts, capitalGainsTax);

  // Calculate profit
  const grossProfit = resalePrice - auctionPrice;
  const totalCosts = totalAcquisitionCosts + totalMaintenanceCosts + totalSaleCosts;
  const netProfit = grossProfit - totalCosts - taxDue;

  // Calculate ROI
  const totalInvestment = auctionPrice + totalAcquisitionCosts + totalMaintenanceCosts;
  const roi = (netProfit / totalInvestment) * 100;

  // Create breakdown items for detailed report
  const breakdownItems = [
    { label: 'Auction Purchase Price', value: -auctionPrice, type: 'expense' as const },
    { label: 'Expected Resale Price', value: resalePrice, type: 'income' as const },
    { label: 'Auctioneer Commission', value: -(auctionPrice * acquisitionCosts.auctioneerCommission / 100), type: 'expense' as const },
    { label: 'ITBI Tax', value: -(auctionPrice * acquisitionCosts.itbiTax / 100), type: 'expense' as const },
    { label: 'Registry Fees', value: -acquisitionCosts.registryFees, type: 'expense' as const },
    { label: 'Possession Officer', value: -acquisitionCosts.possessionOfficer, type: 'expense' as const },
    { label: 'Deed Issuance', value: -acquisitionCosts.deedIssuance, type: 'expense' as const },
    { label: 'Legal Fees', value: -acquisitionCosts.legalFees, type: 'expense' as const },
    { label: 'Renovation Costs', value: -maintenanceCosts.renovation, type: 'expense' as const },
    { label: 'Monthly IPTU', value: -(maintenanceCosts.monthlyIptu * maintenanceCosts.holdingPeriod), type: 'expense' as const },
    { label: 'Other Monthly Expenses', value: -(maintenanceCosts.otherMonthlyExpenses * maintenanceCosts.holdingPeriod), type: 'expense' as const },
    { label: 'Broker Commission', value: -(resalePrice * saleCosts.brokerCommission / 100), type: 'expense' as const },
    { label: 'Appraisal Fees', value: -saleCosts.appraisalFees, type: 'expense' as const },
    { label: 'Capital Gains Tax', value: -taxDue, type: 'tax' as const }
  ];

  return {
    grossProfit,
    netProfit,
    roi,
    capitalGain,
    capitalGainsTaxDue: taxDue,
    taxDueDate,
    taxExemptionReason: exemptionReason,
    totalAcquisitionCosts,
    totalMaintenanceCosts,
    totalSaleCosts,
    breakdownItems
  };
};

// Function to format currency (BRL)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Function to format percentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Function to format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};
