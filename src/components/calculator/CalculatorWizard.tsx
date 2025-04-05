import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import StepNavigation from './StepNavigation';
import InitialValues from './InitialValues';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  calculateResults,
  formatCurrency,
  formatPercentage,
  formatDate,
  InitialValues as InitialValuesType,
  AcquisitionCosts,
  MaintenanceCosts,
  SaleCosts,
  CapitalGainsTax,
  SimulationResult
} from '@/lib/calculations';
import { useAuth } from '@/components/auth/AuthProvider';
import { storeData } from '@/lib/storage';

const CalculatorWizard: React.FC = () => {
  const { toast } = useToast();
  const { encryptionKey } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [simulationName, setSimulationName] = useState('');
  const [simulationNotes, setSimulationNotes] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [initialValues, setInitialValues] = useState<InitialValuesType>({
    auctionPrice: 0,
    assessedValue: 0,
    resalePrice: 0
  });
  
  const [acquisitionCosts, setAcquisitionCosts] = useState<AcquisitionCosts>({
    auctioneerCommission: 5,
    itbiTax: 3,
    registryFees: 0,
    possessionOfficer: 0,
    deedIssuance: 0,
    legalFees: 0
  });
  
  const [maintenanceCosts, setMaintenanceCosts] = useState<MaintenanceCosts>({
    renovation: 0,
    monthlyIptu: 0,
    otherMonthlyExpenses: 0,
    holdingPeriod: 6
  });
  
  const [saleCosts, setSaleCosts] = useState<SaleCosts>({
    brokerCommission: 6,
    appraisalFees: 0
  });
  
  const [capitalGainsTax, setCapitalGainsTax] = useState<CapitalGainsTax>({
    acquisitionDate: new Date(),
    deedCost: 0,
    isOnlyProperty: false,
    willReinvest: false
  });
  
  const [results, setResults] = useState<SimulationResult | null>(null);
  
  const goToNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const calculateAndShowResults = () => {
    try {
      const calculatedResults = calculateResults(
        initialValues,
        acquisitionCosts,
        maintenanceCosts,
        saleCosts,
        capitalGainsTax
      );
      
      setResults(calculatedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Erro no cálculo:', error);
      toast({
        title: "Erro no Cálculo",
        description: "Houve um erro ao calcular os resultados. Por favor, verifique os dados informados.",
        variant: "destructive",
      });
    }
  };
  
  const saveSimulation = async () => {
    if (!encryptionKey) {
      toast({
        title: "Autenticação Necessária",
        description: "Por favor, configure sua senha de criptografia para salvar simulações.",
        variant: "destructive",
      });
      return;
    }
    
    if (!results) {
      toast({
        title: "Sem Resultados",
        description: "Por favor, calcule os resultados antes de salvar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const simulation = {
        name: simulationName || `Simulação ${new Date().toLocaleString()}`,
        notes: simulationNotes,
        date: new Date(),
        inputs: {
          initialValues,
          acquisitionCosts,
          maintenanceCosts,
          saleCosts,
          capitalGainsTax
        },
        results
      };
      
      await storeData('simulations', simulation, encryptionKey);
      
      toast({
        title: "Simulação Salva",
        description: "Sua simulação foi salva com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar simulação:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Houve um erro ao salvar sua simulação.",
        variant: "destructive",
      });
    }
  };
  
  const exportToPdf = () => {
    toast({
      title: "Feature Coming Soon",
      description: "PDF export will be available in a future update.",
    });
  };
  
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          initialValues.auctionPrice > 0 &&
          initialValues.assessedValue > 0 &&
          initialValues.resalePrice > 0
        );
      case 2:
        return true;
      case 3:
        return maintenanceCosts.holdingPeriod > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <InitialValues values={initialValues} onChange={setInitialValues} />;
      case 2:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="auctioneerCommission">Custo do Corretor (%)</Label>
                  <Input
                    id="auctioneerCommission"
                    type="number"
                    value={acquisitionCosts.auctioneerCommission || ''}
                    onChange={(e) => setAcquisitionCosts({
                      ...acquisitionCosts,
                      auctioneerCommission: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itbiTax">ITBI (Taxa de Transferência de Propriedade) (%)</Label>
                  <Input
                    id="itbiTax"
                    type="number"
                    value={acquisitionCosts.itbiTax || ''}
                    onChange={(e) => setAcquisitionCosts({
                      ...acquisitionCosts,
                      itbiTax: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registryFees">Taxa de Registro (R$)</Label>
                  <Input
                    id="registryFees"
                    type="number"
                    value={acquisitionCosts.registryFees || ''}
                    onChange={(e) => setAcquisitionCosts({
                      ...acquisitionCosts,
                      registryFees: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="possessionOfficer">Judicial Possessão (R$)</Label>
                  <Input
                    id="possessionOfficer"
                    type="number"
                    value={acquisitionCosts.possessionOfficer || ''}
                    onChange={(e) => setAcquisitionCosts({
                      ...acquisitionCosts,
                      possessionOfficer: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deedIssuance">Deed Issuance (R$)</Label>
                  <Input
                    id="deedIssuance"
                    type="number"
                    value={acquisitionCosts.deedIssuance || ''}
                    onChange={(e) => setAcquisitionCosts({
                      ...acquisitionCosts,
                      deedIssuance: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="legalFees">Fees Legais/Advogados (R$)</Label>
                  <Input
                    id="legalFees"
                    type="number"
                    value={acquisitionCosts.legalFees || ''}
                    onChange={(e) => setAcquisitionCosts({
                      ...acquisitionCosts,
                      legalFees: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="renovation">Custos de Renovação (R$)</Label>
                  <Input
                    id="renovation"
                    type="number"
                    value={maintenanceCosts.renovation || ''}
                    onChange={(e) => setMaintenanceCosts({
                      ...maintenanceCosts,
                      renovation: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlyIptu">IPTU Mensal (Taxa de Propriedade) (R$)</Label>
                  <Input
                    id="monthlyIptu"
                    type="number"
                    value={maintenanceCosts.monthlyIptu || ''}
                    onChange={(e) => setMaintenanceCosts({
                      ...maintenanceCosts,
                      monthlyIptu: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherMonthlyExpenses">Outros Custos Mensais (R$)</Label>
                  <Input
                    id="otherMonthlyExpenses"
                    type="number"
                    value={maintenanceCosts.otherMonthlyExpenses || ''}
                    onChange={(e) => setMaintenanceCosts({
                      ...maintenanceCosts,
                      otherMonthlyExpenses: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="holdingPeriod">Período de Manutenção Esperado (meses)</Label>
                  <Input
                    id="holdingPeriod"
                    type="number"
                    value={maintenanceCosts.holdingPeriod || ''}
                    onChange={(e) => setMaintenanceCosts({
                      ...maintenanceCosts,
                      holdingPeriod: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brokerCommission">Comissão do Corretor (%)</Label>
                  <Input
                    id="brokerCommission"
                    type="number"
                    value={saleCosts.brokerCommission || ''}
                    onChange={(e) => setSaleCosts({
                      ...saleCosts,
                      brokerCommission: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appraisalFees">Fees de Avaliação ou Relatório (R$)</Label>
                  <Input
                    id="appraisalFees"
                    type="number"
                    value={saleCosts.appraisalFees || ''}
                    onChange={(e) => setSaleCosts({
                      ...saleCosts,
                      appraisalFees: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="acquisitionDate">Data de Aquisição</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !capitalGainsTax.acquisitionDate && "text-muted-foreground"
                        )}
                      >
                        {capitalGainsTax.acquisitionDate ? (
                          format(capitalGainsTax.acquisitionDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <Calendar
                        mode="single"
                        selected={capitalGainsTax.acquisitionDate}
                        onSelect={(date) => date && setCapitalGainsTax({
                          ...capitalGainsTax,
                          acquisitionDate: date
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deedCost">Custo do Deed (R$)</Label>
                  <Input
                    id="deedCost"
                    type="number"
                    value={capitalGainsTax.deedCost || ''}
                    onChange={(e) => setCapitalGainsTax({
                      ...capitalGainsTax,
                      deedCost: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="isOnlyProperty"
                    checked={capitalGainsTax.isOnlyProperty}
                    onCheckedChange={(checked) => setCapitalGainsTax({
                      ...capitalGainsTax,
                      isOnlyProperty: !!checked
                    })}
                  />
                  <Label htmlFor="isOnlyProperty">É sua única propriedade?</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="willReinvest"
                    checked={capitalGainsTax.willReinvest}
                    onCheckedChange={(checked) => setCapitalGainsTax({
                      ...capitalGainsTax,
                      willReinvest: !!checked
                    })}
                  />
                  <Label htmlFor="willReinvest">Reinvestirá em outra propriedade residencial dentro de 180 dias?</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  const renderResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-8 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Resumo dos Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Lucro Bruto</h3>
                  <p className={cn(
                    "text-2xl font-semibold",
                    results.grossProfit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatCurrency(results.grossProfit)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Lucro Líquido</h3>
                  <p className={cn(
                    "text-2xl font-semibold",
                    results.netProfit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatCurrency(results.netProfit)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Retorno sobre Investimento</h3>
                  <p className={cn(
                    "text-2xl font-semibold",
                    results.roi >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatPercentage(results.roi)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ganho de Capital</h3>
                  <p className="text-xl font-semibold">{formatCurrency(results.capitalGain)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Imposto de Capital Ganhado</h3>
                  <p className="text-xl font-semibold">{formatCurrency(results.capitalGainsTaxDue)}</p>
                </div>
                
                {results.taxDueDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data de Imposto de Capital</h3>
                    <p className="text-xl font-semibold">{formatDate(results.taxDueDate)}</p>
                  </div>
                )}
                
                {results.taxExemptionReason && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Motivo de Isenção de Imposto de Capital</h3>
                    <p className="text-base">{results.taxExemptionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setShowBreakdown(!showBreakdown)}>
            {showBreakdown ? "Hide" : "Show"} Cálculo Detalhado
          </Button>
          
          {showBreakdown && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Detalhes Detalhados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Custo Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Custos de Aquisição</h4>
                        <p className="text-xl font-semibold text-red-600">{formatCurrency(results.totalAcquisitionCosts)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Custos de Manutenção</h4>
                        <p className="text-xl font-semibold text-red-600">{formatCurrency(results.totalMaintenanceCosts)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Custos de Venda</h4>
                        <p className="text-xl font-semibold text-red-600">{formatCurrency(results.totalSaleCosts)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Item Breakdown</h3>
                    <div className="mt-2 border rounded-lg divide-y">
                      {results.breakdownItems.map((item, index) => (
                        <div key={index} className="flex justify-between p-3">
                          <span>{item.label}</span>
                          <span className={cn(
                            "font-medium",
                            item.value > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Salvar Esta Simulação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="simulationName">Nome (Opcional)</Label>
                <Input
                  id="simulationName"
                  placeholder="e.g., Apartamento Downtown"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="simulationNotes">Notas (Opcional)</Label>
                <Input
                  id="simulationNotes"
                  placeholder="Adicione notas sobre esta propriedade"
                  value={simulationNotes}
                  onChange={(e) => setSimulationNotes(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button onClick={saveSimulation}>
                  Salvar Simulação
                </Button>
                
                <Button variant="outline" onClick={exportToPdf}>
                  Exportar como PDF
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setCurrentStep(1);
                  }}
                >
                  Nova Cálculo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const stepTitles = [
    "Valores Iniciais",
    "Custos de Aquisição",
    "Custos de Manutenção",
    "Custos de Venda",
    "Ganho de Capital"
  ];
  
  return (
    <div className="space-y-6">
      {!showResults ? (
        <>
          <Tabs value={`step-${currentStep}`} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {stepTitles.map((title, index) => (
                <TabsTrigger
                  key={index}
                  value={`step-${index + 1}`}
                  onClick={() => setCurrentStep(index + 1)}
                  disabled={isProcessing}
                  className="text-xs md:text-sm"
                >
                  {title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {stepTitles.map((title, index) => (
              <TabsContent key={index} value={`step-${index + 1}`} className="mt-6">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-500 mb-6">
                  {index === 0 && "Entre com os valores básicos da propriedade."}
                  {index === 1 && "Entre com todos os custos associados à aquisição da propriedade."}
                  {index === 2 && "Entre com todos os custos para manter a propriedade."}
                  {index === 3 && "Entre com todos os custos associados à venda da propriedade."}
                  {index === 4 && "Entre com detalhes para cálculo de imposto de capital ganho."}
                </p>
                
                {renderStepContent()}
              </TabsContent>
            ))}
          </Tabs>
          
          <StepNavigation
            currentStep={currentStep}
            totalSteps={5}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
            canGoNext={isCurrentStepValid()}
            onComplete={calculateAndShowResults}
          />
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default CalculatorWizard;
