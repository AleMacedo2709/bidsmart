
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/calculations';

interface PropertyFinanceFormProps {
  propertyId: string;
  property: any;
  onSave: (financialData: any) => Promise<void>;
}

// Esquema de validação para os dados financeiros
const financialSchema = z.object({
  // Custos de Aquisição
  auctionCommission: z.coerce.number().min(0),
  itbiTax: z.coerce.number().min(0),
  registryFees: z.coerce.number().min(0),
  possessionOfficer: z.coerce.number().min(0),
  deedIssuance: z.coerce.number().min(0),
  legalFees: z.coerce.number().min(0),
  
  // Custos Mensais
  monthlyIptu: z.coerce.number().min(0),
  condoFee: z.coerce.number().min(0),
  utilities: z.coerce.number().min(0),
  maintenance: z.coerce.number().min(0),
  
  // Receitas
  rentalIncome: z.coerce.number().min(0),
  otherIncome: z.coerce.number().min(0),
  
  // Custos de Venda
  brokerCommission: z.coerce.number().min(0),
  appraisalFees: z.coerce.number().min(0),
  advertisingCosts: z.coerce.number().min(0),
  
  // Valores Acumulados (calculados automaticamente)
  acquisitionCosts: z.number().optional(),
  monthlyCosts: z.number().optional(),
  income: z.number().optional(),
  saleCosts: z.number().optional(),
});

const PropertyFinanceForm: React.FC<PropertyFinanceFormProps> = ({ propertyId, property, onSave }) => {
  const [activeTab, setActiveTab] = useState('acquisition');
  const [isSaving, setIsSaving] = useState(false);
  const [timeOwned, setTimeOwned] = useState(0); // meses

  // Definir valores padrão a partir dos dados existentes ou usar zeros
  const defaultValues = {
    // Custos de Aquisição
    auctionCommission: property?.finances?.auctionCommission || 0,
    itbiTax: property?.finances?.itbiTax || 0,
    registryFees: property?.finances?.registryFees || 0,
    possessionOfficer: property?.finances?.possessionOfficer || 0,
    deedIssuance: property?.finances?.deedIssuance || 0,
    legalFees: property?.finances?.legalFees || 0,
    
    // Custos Mensais
    monthlyIptu: property?.finances?.monthlyIptu || 0,
    condoFee: property?.finances?.condoFee || 0,
    utilities: property?.finances?.utilities || 0,
    maintenance: property?.finances?.maintenance || 0,
    
    // Receitas
    rentalIncome: property?.finances?.rentalIncome || 0,
    otherIncome: property?.finances?.otherIncome || 0,
    
    // Custos de Venda
    brokerCommission: property?.finances?.brokerCommission || 0,
    appraisalFees: property?.finances?.appraisalFees || 0,
    advertisingCosts: property?.finances?.advertisingCosts || 0,
    
    // Valores Acumulados
    acquisitionCosts: property?.finances?.acquisitionCosts || 0,
    monthlyCosts: property?.finances?.monthlyCosts || 0,
    income: property?.finances?.income || 0,
    saleCosts: property?.finances?.saleCosts || 0,
  };

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(financialSchema),
    defaultValues,
  });

  // Calcular o tempo de posse do imóvel em meses
  useEffect(() => {
    if (property?.purchaseDate) {
      const purchaseDate = new Date(property.purchaseDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      setTimeOwned(diffMonths);
    }
  }, [property]);

  // Observar mudanças nos custos de aquisição para cálculo automático
  const auctionCommission = watch('auctionCommission');
  const itbiTax = watch('itbiTax');
  const registryFees = watch('registryFees');
  const possessionOfficer = watch('possessionOfficer');
  const deedIssuance = watch('deedIssuance');
  const legalFees = watch('legalFees');

  // Observar mudanças nos custos mensais
  const monthlyIptu = watch('monthlyIptu');
  const condoFee = watch('condoFee');
  const utilities = watch('utilities');
  const maintenance = watch('maintenance');

  // Observar mudanças nas receitas
  const rentalIncome = watch('rentalIncome');
  const otherIncome = watch('otherIncome');

  // Observar mudanças nos custos de venda
  const brokerCommission = watch('brokerCommission');
  const appraisalFees = watch('appraisalFees');
  const advertisingCosts = watch('advertisingCosts');

  // Calcular custos totais de aquisição
  useEffect(() => {
    const totalAcquisitionCosts = 
      parseFloat(auctionCommission || 0) +
      parseFloat(itbiTax || 0) +
      parseFloat(registryFees || 0) +
      parseFloat(possessionOfficer || 0) +
      parseFloat(deedIssuance || 0) +
      parseFloat(legalFees || 0);
    
    setValue('acquisitionCosts', totalAcquisitionCosts);
  }, [auctionCommission, itbiTax, registryFees, possessionOfficer, deedIssuance, legalFees, setValue]);

  // Calcular custos mensais acumulados
  useEffect(() => {
    const monthlyTotal = 
      parseFloat(monthlyIptu || 0) +
      parseFloat(condoFee || 0) +
      parseFloat(utilities || 0) +
      parseFloat(maintenance || 0);
    
    const totalMonthlyCosts = monthlyTotal * timeOwned;
    setValue('monthlyCosts', totalMonthlyCosts);
  }, [monthlyIptu, condoFee, utilities, maintenance, timeOwned, setValue]);

  // Calcular receita acumulada
  useEffect(() => {
    const monthlyIncome = 
      parseFloat(rentalIncome || 0) +
      parseFloat(otherIncome || 0);
    
    const totalIncome = monthlyIncome * timeOwned;
    setValue('income', totalIncome);
  }, [rentalIncome, otherIncome, timeOwned, setValue]);

  // Calcular custos de venda
  useEffect(() => {
    const totalSaleCosts = 
      parseFloat(brokerCommission || 0) +
      parseFloat(appraisalFees || 0) +
      parseFloat(advertisingCosts || 0);
    
    setValue('saleCosts', totalSaleCosts);
  }, [brokerCommission, appraisalFees, advertisingCosts, setValue]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await onSave(data);
    } finally {
      setIsSaving(false);
    }
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
                    <Input
                      id="auctionCommission"
                      placeholder="0,00"
                      {...register('auctionCommission')}
                    />
                    {errors.auctionCommission && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itbiTax">ITBI (Imposto de Transmissão)</Label>
                    <Input
                      id="itbiTax"
                      placeholder="0,00"
                      {...register('itbiTax')}
                    />
                    {errors.itbiTax && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registryFees">Taxas de Cartório</Label>
                    <Input
                      id="registryFees"
                      placeholder="0,00"
                      {...register('registryFees')}
                    />
                    {errors.registryFees && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="possessionOfficer">Oficial de Posse</Label>
                    <Input
                      id="possessionOfficer"
                      placeholder="0,00"
                      {...register('possessionOfficer')}
                    />
                    {errors.possessionOfficer && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deedIssuance">Emissão de Escritura</Label>
                    <Input
                      id="deedIssuance"
                      placeholder="0,00"
                      {...register('deedIssuance')}
                    />
                    {errors.deedIssuance && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="legalFees">Despesas Jurídicas</Label>
                    <Input
                      id="legalFees"
                      placeholder="0,00"
                      {...register('legalFees')}
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
                    <Input
                      id="monthlyIptu"
                      placeholder="0,00"
                      {...register('monthlyIptu')}
                    />
                    {errors.monthlyIptu && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condoFee">Taxa de Condomínio</Label>
                    <Input
                      id="condoFee"
                      placeholder="0,00"
                      {...register('condoFee')}
                    />
                    {errors.condoFee && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="utilities">Contas (Água, Luz, etc)</Label>
                    <Input
                      id="utilities"
                      placeholder="0,00"
                      {...register('utilities')}
                    />
                    {errors.utilities && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">Manutenção</Label>
                    <Input
                      id="maintenance"
                      placeholder="0,00"
                      {...register('maintenance')}
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
                        parseFloat(monthlyIptu || 0) +
                        parseFloat(condoFee || 0) +
                        parseFloat(utilities || 0) +
                        parseFloat(maintenance || 0)
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
                    <Input
                      id="rentalIncome"
                      placeholder="0,00"
                      {...register('rentalIncome')}
                    />
                    {errors.rentalIncome && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otherIncome">Outras Receitas Mensais</Label>
                    <Input
                      id="otherIncome"
                      placeholder="0,00"
                      {...register('otherIncome')}
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
                        parseFloat(rentalIncome || 0) +
                        parseFloat(otherIncome || 0)
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
                    <Input
                      id="brokerCommission"
                      placeholder="0,00"
                      {...register('brokerCommission')}
                    />
                    {errors.brokerCommission && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="appraisalFees">Custos de Avaliação</Label>
                    <Input
                      id="appraisalFees"
                      placeholder="0,00"
                      {...register('appraisalFees')}
                    />
                    {errors.appraisalFees && (
                      <p className="text-sm text-red-500">Valor inválido</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="advertisingCosts">Custos de Publicidade</Label>
                    <Input
                      id="advertisingCosts"
                      placeholder="0,00"
                      {...register('advertisingCosts')}
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
                <span>
                  {formatCurrency(
                    property.purchasePrice + 
                    watch('acquisitionCosts') + 
                    watch('monthlyCosts')
                  )}
                </span>
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
                  {formatCurrency(
                    property.estimatedValue - property.purchasePrice - 
                    watch('acquisitionCosts') - watch('monthlyCosts') + 
                    watch('income') - watch('saleCosts')
                  )}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>ROI Projetado:</span>
                <span className="text-green-600 font-bold">
                  {(
                    (property.estimatedValue - property.purchasePrice - 
                    watch('acquisitionCosts') - watch('monthlyCosts') + 
                    watch('income') - watch('saleCosts')) / 
                    (property.purchasePrice + watch('acquisitionCosts') + watch('monthlyCosts')) * 100
                  ).toFixed(2)}%
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
