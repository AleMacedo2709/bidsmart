
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurrencyInput from '@/components/ui/currency-input';
import { 
  formatCurrency, 
  formatPercentage,
  calculateAcquisitionCostsTotal,
  calculateMaintenanceCostsTotal,
  calculateSaleCostsTotal
} from '@/lib/calculations';

interface PropertyFinanceFormProps {
  propertyId: string;
  property: any;
  onSave: (financialData: any) => Promise<void>;
}

const financialSchema = z.object({
  auctionCommission: z.coerce.number().min(0),
  itbiTax: z.coerce.number().min(0),
  registryFees: z.coerce.number().min(0),
  possessionOfficer: z.coerce.number().min(0),
  deedIssuance: z.coerce.number().min(0),
  legalFees: z.coerce.number().min(0),
  
  monthlyIptu: z.coerce.number().min(0),
  condoFee: z.coerce.number().min(0),
  utilities: z.coerce.number().min(0),
  maintenance: z.coerce.number().min(0),
  
  rentalIncome: z.coerce.number().min(0),
  otherIncome: z.coerce.number().min(0),
  
  brokerCommission: z.coerce.number().min(0),
  appraisalFees: z.coerce.number().min(0),
  advertisingCosts: z.coerce.number().min(0),
  
  acquisitionCosts: z.coerce.number().min(0),
  monthlyCosts: z.coerce.number().min(0),
  income: z.coerce.number().min(0),
  saleCosts: z.coerce.number().min(0),
});

// Define the type for form values based on the schema
type FinancialFormValues = z.infer<typeof financialSchema>;

const PropertyFinanceForm: React.FC<PropertyFinanceFormProps> = ({ propertyId, property, onSave }) => {
  const [activeTab, setActiveTab] = useState('acquisition');
  const [isSaving, setIsSaving] = useState(false);
  const [timeOwned, setTimeOwned] = useState(0);

  const defaultValues: FinancialFormValues = {
    auctionCommission: property?.finances?.auctionCommission || 0,
    itbiTax: property?.finances?.itbiTax || 0,
    registryFees: property?.finances?.registryFees || 0,
    possessionOfficer: property?.finances?.possessionOfficer || 0,
    deedIssuance: property?.finances?.deedIssuance || 0,
    legalFees: property?.finances?.legalFees || 0,
    
    monthlyIptu: property?.finances?.monthlyIptu || 0,
    condoFee: property?.finances?.condoFee || 0,
    utilities: property?.finances?.utilities || 0,
    maintenance: property?.finances?.maintenance || 0,
    
    rentalIncome: property?.finances?.rentalIncome || 0,
    otherIncome: property?.finances?.otherIncome || 0,
    
    brokerCommission: property?.finances?.brokerCommission || 0,
    appraisalFees: property?.finances?.appraisalFees || 0,
    advertisingCosts: property?.finances?.advertisingCosts || 0,
    
    acquisitionCosts: property?.finances?.acquisitionCosts || 0,
    monthlyCosts: property?.finances?.monthlyCosts || 0,
    income: property?.finances?.income || 0,
    saleCosts: property?.finances?.saleCosts || 0,
  };

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FinancialFormValues>({
    resolver: zodResolver(financialSchema),
    defaultValues,
  });

  useEffect(() => {
    if (property?.purchaseDate) {
      const purchaseDate = new Date(property.purchaseDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      setTimeOwned(diffMonths);
    }
  }, [property]);

  const auctionCommission = watch('auctionCommission');
  const itbiTax = watch('itbiTax');
  const registryFees = watch('registryFees');
  const possessionOfficer = watch('possessionOfficer');
  const deedIssuance = watch('deedIssuance');
  const legalFees = watch('legalFees');

  const monthlyIptu = watch('monthlyIptu');
  const condoFee = watch('condoFee');
  const utilities = watch('utilities');
  const maintenance = watch('maintenance');

  const rentalIncome = watch('rentalIncome');
  const otherIncome = watch('otherIncome');

  const brokerCommission = watch('brokerCommission');
  const appraisalFees = watch('appraisalFees');
  const advertisingCosts = watch('advertisingCosts');

  useEffect(() => {
    const initialValues = {
      auctionPrice: property.purchasePrice,
      assessedValue: property.estimatedValue,
      resalePrice: property.estimatedValue
    };

    const totalAcquisitionCosts = 
      parseFloat(auctionCommission?.toString() || '0') +
      parseFloat(itbiTax?.toString() || '0') +
      parseFloat(registryFees?.toString() || '0') +
      parseFloat(possessionOfficer?.toString() || '0') +
      parseFloat(deedIssuance?.toString() || '0') +
      parseFloat(legalFees?.toString() || '0');
    
    setValue('acquisitionCosts', totalAcquisitionCosts);
  }, [auctionCommission, itbiTax, registryFees, possessionOfficer, deedIssuance, legalFees, setValue, property.purchasePrice, property.estimatedValue]);

  useEffect(() => {
    const monthlyTotal = 
      parseFloat(monthlyIptu?.toString() || '0') +
      parseFloat(condoFee?.toString() || '0') +
      parseFloat(utilities?.toString() || '0') +
      parseFloat(maintenance?.toString() || '0');
    
    const totalMonthlyCosts = monthlyTotal * timeOwned;
    setValue('monthlyCosts', totalMonthlyCosts);
  }, [monthlyIptu, condoFee, utilities, maintenance, timeOwned, setValue]);

  useEffect(() => {
    const monthlyIncome = 
      parseFloat(rentalIncome?.toString() || '0') +
      parseFloat(otherIncome?.toString() || '0');
    
    const totalIncome = monthlyIncome * timeOwned;
    setValue('income', totalIncome);
  }, [rentalIncome, otherIncome, timeOwned, setValue]);

  useEffect(() => {
    const totalSaleCosts = 
      parseFloat(brokerCommission?.toString() || '0') +
      parseFloat(appraisalFees?.toString() || '0') +
      parseFloat(advertisingCosts?.toString() || '0');
    
    setValue('saleCosts', totalSaleCosts);
  }, [brokerCommission, appraisalFees, advertisingCosts, setValue]);

  const getFinancialMetrics = () => {
    const acquisitionCosts = watch('acquisitionCosts');
    const monthlyCosts = watch('monthlyCosts');
    const income = watch('income');
    const saleCosts = watch('saleCosts');

    const totalInvestment = property.purchasePrice + acquisitionCosts + monthlyCosts;
    const projectedProfit = property.estimatedValue - property.purchasePrice - 
                          acquisitionCosts - monthlyCosts + income - saleCosts;
    const roi = (projectedProfit / totalInvestment) * 100;

    return {
      totalInvestment,
      projectedProfit,
      roi
    };
  };

  const financialMetrics = getFinancialMetrics();

  const onSubmit = async (data: FinancialFormValues) => {
    setIsSaving(true);
    try {
      await onSave(data);
    } finally {
      setIsSaving(false);
    }
  };

  // Type-safe handler for currency inputs
  const handleCurrencyChange = (field: keyof FinancialFormValues, value: number) => {
    setValue(field, value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs 
          defaultValue="acquisition" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="acquisition">Aquisição</TabsTrigger>
            <TabsTrigger value="monthly">Custos Mensais</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="sale">Venda</TabsTrigger>
          </TabsList>

          <TabsContent value="acquisition">
            <Card>
              <CardHeader>
                <CardTitle>Custos de Aquisição</CardTitle>
                <CardDescription>
                  Registre todos os custos relacionados à compra do imóvel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="auctionCommission">Comissão do Leiloeiro</Label>
                    <CurrencyInput
                      id="auctionCommission"
                      value={auctionCommission || 0}
                      onChange={(value) => handleCurrencyChange('auctionCommission', value)}
                    />
                    {errors.auctionCommission && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itbiTax">ITBI (Imposto de Transmissão)</Label>
                    <CurrencyInput
                      id="itbiTax"
                      value={itbiTax || 0}
                      onChange={(value) => handleCurrencyChange('itbiTax', value)}
                    />
                    {errors.itbiTax && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registryFees">Taxas de Cartório</Label>
                    <CurrencyInput
                      id="registryFees"
                      value={registryFees || 0}
                      onChange={(value) => handleCurrencyChange('registryFees', value)}
                    />
                    {errors.registryFees && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="possessionOfficer">Oficial de Posse</Label>
                    <CurrencyInput
                      id="possessionOfficer"
                      value={possessionOfficer || 0}
                      onChange={(value) => handleCurrencyChange('possessionOfficer', value)}
                    />
                    {errors.possessionOfficer && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deedIssuance">Emissão de Escritura</Label>
                    <CurrencyInput
                      id="deedIssuance"
                      value={deedIssuance || 0}
                      onChange={(value) => handleCurrencyChange('deedIssuance', value)}
                    />
                    {errors.deedIssuance && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="legalFees">Despesas Jurídicas</Label>
                    <CurrencyInput
                      id="legalFees"
                      value={legalFees || 0}
                      onChange={(value) => handleCurrencyChange('legalFees', value)}
                    />
                    {errors.legalFees && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total dos Custos de Aquisição:</span>
                    <span className="font-bold text-xl">
                      {formatCurrency(watch('acquisitionCosts'))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Custos Mensais</CardTitle>
                <CardDescription>
                  Registre os custos mensais relacionados à manutenção do imóvel.
                  Tempo de posse: {timeOwned} meses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIptu">IPTU Mensal</Label>
                    <CurrencyInput
                      id="monthlyIptu"
                      value={monthlyIptu || 0}
                      onChange={(value) => handleCurrencyChange('monthlyIptu', value)}
                    />
                    {errors.monthlyIptu && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condoFee">Taxa de Condomínio</Label>
                    <CurrencyInput
                      id="condoFee"
                      value={condoFee || 0}
                      onChange={(value) => handleCurrencyChange('condoFee', value)}
                    />
                    {errors.condoFee && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="utilities">Contas (Água, Luz, etc)</Label>
                    <CurrencyInput
                      id="utilities"
                      value={utilities || 0}
                      onChange={(value) => handleCurrencyChange('utilities', value)}
                    />
                    {errors.utilities && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">Manutenção</Label>
                    <CurrencyInput
                      id="maintenance"
                      value={maintenance || 0}
                      onChange={(value) => handleCurrencyChange('maintenance', value)}
                    />
                    {errors.maintenance && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Custo Mensal Total:</span>
                    <span className="font-bold">
                      {formatCurrency(
                        parseFloat((monthlyIptu || 0).toString()) +
                        parseFloat((condoFee || 0).toString()) +
                        parseFloat((utilities || 0).toString()) +
                        parseFloat((maintenance || 0).toString())
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-semibold">Total Acumulado ({timeOwned} meses):</span>
                    <span className="font-bold text-xl">
                      {formatCurrency(watch('monthlyCosts'))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Receitas</CardTitle>
                <CardDescription>
                  Registre as receitas geradas pelo imóvel.
                  Tempo de posse: {timeOwned} meses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rentalIncome">Renda de Aluguel Mensal</Label>
                    <CurrencyInput
                      id="rentalIncome"
                      value={rentalIncome || 0}
                      onChange={(value) => handleCurrencyChange('rentalIncome', value)}
                    />
                    {errors.rentalIncome && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otherIncome">Outras Receitas Mensais</Label>
                    <CurrencyInput
                      id="otherIncome"
                      value={otherIncome || 0}
                      onChange={(value) => handleCurrencyChange('otherIncome', value)}
                    />
                    {errors.otherIncome && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Receita Mensal Total:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(
                        parseFloat((rentalIncome || 0).toString()) +
                        parseFloat((otherIncome || 0).toString())
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-semibold">Total Acumulado ({timeOwned} meses):</span>
                    <span className="font-bold text-xl text-green-600">
                      {formatCurrency(watch('income'))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sale">
            <Card>
              <CardHeader>
                <CardTitle>Custos de Venda</CardTitle>
                <CardDescription>
                  Registre os custos relacionados à venda do imóvel (projetados ou realizados).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brokerCommission">Comissão do Corretor</Label>
                    <CurrencyInput
                      id="brokerCommission"
                      value={brokerCommission || 0}
                      onChange={(value) => handleCurrencyChange('brokerCommission', value)}
                    />
                    {errors.brokerCommission && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="appraisalFees">Custos de Avaliação</Label>
                    <CurrencyInput
                      id="appraisalFees"
                      value={appraisalFees || 0}
                      onChange={(value) => handleCurrencyChange('appraisalFees', value)}
                    />
                    {errors.appraisalFees && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="advertisingCosts">Custos de Publicidade</Label>
                    <CurrencyInput
                      id="advertisingCosts"
                      value={advertisingCosts || 0}
                      onChange={(value) => handleCurrencyChange('advertisingCosts', value)}
                    />
                    {errors.advertisingCosts && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total dos Custos de Venda:</span>
                    <span className="font-bold text-xl">
                      {formatCurrency(watch('saleCosts'))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="outline" type="button" onClick={() => setActiveTab(
            activeTab === 'acquisition' ? 'monthly' :
            activeTab === 'monthly' ? 'income' :
            activeTab === 'income' ? 'sale' : 'acquisition'
          )}>
            {activeTab === 'sale' ? 'Voltar ao Início' : 'Próximo'}
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Dados Financeiros'}
          </Button>
        </div>
      </form>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
          <CardDescription>Resumo dos dados financeiros deste imóvel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Valor de Compra:</span>
              <span>{formatCurrency(property.purchasePrice)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Custos de Aquisição:</span>
              <span>{formatCurrency(watch('acquisitionCosts'))}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Custos Mensais Acumulados:</span>
              <span>{formatCurrency(watch('monthlyCosts'))}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Receitas Acumuladas:</span>
              <span className="text-green-600">{formatCurrency(watch('income'))}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Custos de Venda (estimados):</span>
              <span>{formatCurrency(watch('saleCosts'))}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Valor Atual Estimado:</span>
              <span>{formatCurrency(property.estimatedValue)}</span>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between font-semibold">
                <span>Investimento Total:</span>
                <span>{formatCurrency(financialMetrics.totalInvestment)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Resultado Operacional:</span>
                <span className={watch('income') > watch('monthlyCosts') ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(watch('income') - watch('monthlyCosts'))}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Lucro Projetado (na venda):</span>
                <span className="text-green-600 font-bold">
                  {formatCurrency(financialMetrics.projectedProfit)}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>ROI Projetado:</span>
                <span className="text-green-600 font-bold">
                  {formatPercentage(financialMetrics.roi)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyFinanceForm;
