
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Banknote, Calculator, PlusCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

interface PropertyFinanceFormProps {
  propertyId: string;
  property: any;
}

const PropertyFinanceForm: React.FC<PropertyFinanceFormProps> = ({ propertyId, property }) => {
  const { toast } = useToast();
  const [financialData, setFinancialData] = useState({
    // Custos de aquisição
    acquisitionCosts: {
      commissionFee: 0,
      itbiTax: 0,
      registryFee: 0,
      legalFee: 0,
      otherFees: 0,
    },
    // Custos mensais
    monthlyCosts: {
      iptuTax: 0,
      condoFee: 0,
      maintenance: 0,
      insurance: 0,
      utilities: 0,
      otherMonthly: 0,
    },
    // Receitas
    income: {
      rentalIncome: 0,
      otherIncome: 0,
    },
    // Custos de venda
    sellingCosts: {
      brokerCommission: 0,
      advertisingCosts: 0,
      capitalGainsTax: 0,
      otherSellingCosts: 0,
    }
  });

  const handleFinanceChange = (category: string, field: string, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);
    setFinancialData({
      ...financialData,
      [category]: {
        ...financialData[category as keyof typeof financialData],
        [field]: numericValue
      }
    });
  };

  const handleSaveFinances = () => {
    // Em um aplicativo real, isso salvaria os dados financeiros no banco de dados
    toast({
      title: "Dados financeiros salvos",
      description: "Os dados financeiros do imóvel foram salvos com sucesso.",
    });
  };

  // Calcular totais
  const totalAcquisitionCosts = Object.values(financialData.acquisitionCosts).reduce((sum, value) => sum + value, 0);
  const totalMonthlyCosts = Object.values(financialData.monthlyCosts).reduce((sum, value) => sum + value, 0);
  const totalAnnualCosts = totalMonthlyCosts * 12;
  const totalIncome = Object.values(financialData.income).reduce((sum, value) => sum + value, 0);
  const totalAnnualIncome = totalIncome * 12;
  const totalSellingCosts = Object.values(financialData.sellingCosts).reduce((sum, value) => sum + value, 0);

  // Calcular métricas financeiras
  const totalInvestment = property.purchasePrice + totalAcquisitionCosts;
  const estimatedAnnualProfit = totalAnnualIncome - totalAnnualCosts;
  const estimatedCapRate = (estimatedAnnualProfit / totalInvestment) * 100;
  const estimatedROI = ((property.estimatedValue - totalInvestment - totalSellingCosts) / totalInvestment) * 100;
  
  // Calcular fluxo de caixa
  const monthlyCashFlow = totalIncome - totalMonthlyCosts;
  const annualCashFlow = monthlyCashFlow * 12;
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="summary" className="gap-1">
            <Banknote className="h-4 w-4" />
            Resumo
          </TabsTrigger>
          <TabsTrigger value="acquisition" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Aquisição
          </TabsTrigger>
          <TabsTrigger value="operations" className="gap-1">
            <Calculator className="h-4 w-4" />
            Operações
          </TabsTrigger>
          <TabsTrigger value="projection" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            Projeções
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Valor do Imóvel:</span>
                  <span className="font-medium">{formatCurrency(property.purchasePrice)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Custos de Aquisição:</span>
                  <span className="font-medium text-red-600">{formatCurrency(totalAcquisitionCosts)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Investimento Total:</span>
                  <span className="font-medium">{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Valor Estimado Atual:</span>
                  <span className="font-medium">{formatCurrency(property.estimatedValue)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Custos de Venda (est.):</span>
                  <span className="font-medium text-red-600">{formatCurrency(totalSellingCosts)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Lucro Estimado:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(property.estimatedValue - totalInvestment - totalSellingCosts)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">ROI Estimado:</span>
                  <span className="font-medium text-green-600">
                    {estimatedROI.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-500" />
                  Fluxo de Caixa Mensal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Receita Mensal:</span>
                  <span className="font-medium text-green-600">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Despesas Mensais:</span>
                  <span className="font-medium text-red-600">{formatCurrency(totalMonthlyCosts)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Fluxo de Caixa Mensal:</span>
                  <span className={`font-medium ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(monthlyCashFlow)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Fluxo de Caixa Anual:</span>
                  <span className={`font-medium ${annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(annualCashFlow)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Cap Rate Estimado:</span>
                  <span className={`font-medium ${estimatedCapRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {estimatedCapRate.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="acquisition">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custos de Aquisição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commissionFee">Comissão de Corretagem</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Banknote className="h-4 w-4" />
                    </div>
                    <Input 
                      id="commissionFee"
                      type="number" 
                      placeholder="0,00" 
                      className="pl-10"
                      value={financialData.acquisitionCosts.commissionFee || ''}
                      onChange={(e) => handleFinanceChange('acquisitionCosts', 'commissionFee', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itbiTax">ITBI (Imposto de Transmissão)</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Banknote className="h-4 w-4" />
                    </div>
                    <Input 
                      id="itbiTax"
                      type="number" 
                      placeholder="0,00" 
                      className="pl-10"
                      value={financialData.acquisitionCosts.itbiTax || ''}
                      onChange={(e) => handleFinanceChange('acquisitionCosts', 'itbiTax', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registryFee">Custos de Registro</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Banknote className="h-4 w-4" />
                    </div>
                    <Input 
                      id="registryFee"
                      type="number" 
                      placeholder="0,00" 
                      className="pl-10"
                      value={financialData.acquisitionCosts.registryFee || ''}
                      onChange={(e) => handleFinanceChange('acquisitionCosts', 'registryFee', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="legalFee">Honorários Advocatícios</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Banknote className="h-4 w-4" />
                    </div>
                    <Input 
                      id="legalFee"
                      type="number" 
                      placeholder="0,00" 
                      className="pl-10"
                      value={financialData.acquisitionCosts.legalFee || ''}
                      onChange={(e) => handleFinanceChange('acquisitionCosts', 'legalFee', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherFees">Outros Custos</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Banknote className="h-4 w-4" />
                    </div>
                    <Input 
                      id="otherFees"
                      type="number" 
                      placeholder="0,00" 
                      className="pl-10"
                      value={financialData.acquisitionCosts.otherFees || ''}
                      onChange={(e) => handleFinanceChange('acquisitionCosts', 'otherFees', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6 pt-4 border-t">
                <span className="font-semibold">Total de Custos de Aquisição:</span>
                <span className="font-semibold text-red-600">{formatCurrency(totalAcquisitionCosts)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Despesas Mensais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="iptuTax">IPTU Mensal</Label>
                    <Input 
                      id="iptuTax"
                      type="number" 
                      placeholder="0,00" 
                      value={financialData.monthlyCosts.iptuTax || ''}
                      onChange={(e) => handleFinanceChange('monthlyCosts', 'iptuTax', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condoFee">Taxa de Condomínio</Label>
                    <Input 
                      id="condoFee"
                      type="number" 
                      placeholder="0,00" 
                      value={financialData.monthlyCosts.condoFee || ''}
                      onChange={(e) => handleFinanceChange('monthlyCosts', 'condoFee', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">Manutenção</Label>
                    <Input 
                      id="maintenance"
                      type="number" 
                      placeholder="0,00" 
                      value={financialData.monthlyCosts.maintenance || ''}
                      onChange={(e) => handleFinanceChange('monthlyCosts', 'maintenance', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Seguro</Label>
                    <Input 
                      id="insurance"
                      type="number" 
                      placeholder="0,00" 
                      value={financialData.monthlyCosts.insurance || ''}
                      onChange={(e) => handleFinanceChange('monthlyCosts', 'insurance', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="utilities">Serviços Públicos</Label>
                    <Input 
                      id="utilities"
                      type="number" 
                      placeholder="0,00" 
                      value={financialData.monthlyCosts.utilities || ''}
                      onChange={(e) => handleFinanceChange('monthlyCosts', 'utilities', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otherMonthly">Outros Custos Mensais</Label>
                    <Input 
                      id="otherMonthly"
                      type="number" 
                      placeholder="0,00" 
                      value={financialData.monthlyCosts.otherMonthly || ''}
                      onChange={(e) => handleFinanceChange('monthlyCosts', 'otherMonthly', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-6 pt-4 border-t">
                  <span className="font-semibold">Total Mensal:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(totalMonthlyCosts)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold">Total Anual:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(totalAnnualCosts)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Receitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rentalIncome">Renda de Aluguel Mensal</Label>
                    <Input 
                      id="rentalIncome"
                      type="number" 
                      placeholder="0,00" 
                      value={financialData.income.rentalIncome || ''}
                      onChange={(e) => handleFinanceChange('income', 'rentalIncome', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otherIncome">Outras Receitas Mensais</Label>
                    <Input 
                      id="otherIncome"
                      type="number" 
                      placeholder="0,00" 
                      value={financialData.income.otherIncome || ''}
                      onChange={(e) => handleFinanceChange('income', 'otherIncome', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-6 pt-4 border-t">
                  <span className="font-semibold">Total Mensal:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold">Total Anual:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(totalAnnualIncome)}</span>
                </div>
                
                <div className="flex justify-between mt-6 pt-4 border-t">
                  <span className="font-semibold">Fluxo de Caixa Líquido Mensal:</span>
                  <span className={`font-semibold ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(monthlyCashFlow)}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold">Fluxo de Caixa Líquido Anual:</span>
                  <span className={`font-semibold ${annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(annualCashFlow)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projection">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custos de Venda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brokerCommission">Comissão de Corretagem</Label>
                  <Input 
                    id="brokerCommission"
                    type="number" 
                    placeholder="0,00" 
                    value={financialData.sellingCosts.brokerCommission || ''}
                    onChange={(e) => handleFinanceChange('sellingCosts', 'brokerCommission', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="advertisingCosts">Custos de Publicidade</Label>
                  <Input 
                    id="advertisingCosts"
                    type="number" 
                    placeholder="0,00" 
                    value={financialData.sellingCosts.advertisingCosts || ''}
                    onChange={(e) => handleFinanceChange('sellingCosts', 'advertisingCosts', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capitalGainsTax">Imposto sobre Ganho de Capital</Label>
                  <Input 
                    id="capitalGainsTax"
                    type="number" 
                    placeholder="0,00" 
                    value={financialData.sellingCosts.capitalGainsTax || ''}
                    onChange={(e) => handleFinanceChange('sellingCosts', 'capitalGainsTax', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherSellingCosts">Outros Custos de Venda</Label>
                  <Input 
                    id="otherSellingCosts"
                    type="number" 
                    placeholder="0,00" 
                    value={financialData.sellingCosts.otherSellingCosts || ''}
                    onChange={(e) => handleFinanceChange('sellingCosts', 'otherSellingCosts', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6 pt-4 border-t">
                <span className="font-semibold">Total de Custos de Venda:</span>
                <span className="font-semibold text-red-600">{formatCurrency(totalSellingCosts)}</span>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Projeção de Venda</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Valor Estimado do Imóvel:</span>
                    <span className="font-medium">{formatCurrency(property.estimatedValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custos de Venda:</span>
                    <span className="font-medium text-red-600">{formatCurrency(totalSellingCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor de Compra + Custos de Aquisição:</span>
                    <span className="font-medium text-red-600">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Lucro Líquido Estimado:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(property.estimatedValue - totalInvestment - totalSellingCosts)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">ROI Estimado:</span>
                    <span className="font-semibold text-green-600">
                      {estimatedROI.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveFinances}>
          Salvar Dados Financeiros
        </Button>
      </div>
    </div>
  );
};

export default PropertyFinanceForm;
