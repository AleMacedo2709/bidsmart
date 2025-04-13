import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { storeData } from '@/lib/storage';
import { DollarSign, ArrowRight, Calculator, Calendar, Info, AlertTriangle, ExternalLink, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import CurrencyInput from '@/components/ui/currency-input';
import PercentageInput from '@/components/ui/percentage-input';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  calculateResults,
  formatCurrency,
  formatPercentage,
  formatDate,
  InitialValues,
  AcquisitionCosts,
  MaintenanceCosts,
  SaleCosts,
  CapitalGainsTax,
  SimulationResult
} from '@/lib/calculations';

const DEV_DEFAULT_VALUES = {
  initialValues: {
    auctionPrice: 300000,
    assessedValue: 300000,
    resalePrice: 450000
  },
  needsRenovation: true,
  acquisitionCosts: {
    auctioneerCommission: 5,
    itbiTax: 3,
    registryFees: 2000,
    possessionOfficer: 1000,
    deedIssuance: 500,
    legalFees: 1500
  },
  maintenanceCosts: {
    renovation: 30000,
    monthlyIptu: 375,
    otherMonthlyExpenses: 200,
    holdingPeriod: 6
  },
  saleCosts: {
    brokerCommission: 5,
    appraisalFees: 1000
  },
  capitalGainsTax: {
    acquisitionDate: new Date(),
    deedCost: 0,
    isOnlyProperty: false,
    willReinvest: false
  },
  iptuRate: 1.5,
  paymentMethod: "cash"
};

const PROD_DEFAULT_VALUES = {
  initialValues: {
    auctionPrice: 0,
    assessedValue: 0,
    resalePrice: 0
  },
  needsRenovation: false,
  acquisitionCosts: {
    auctioneerCommission: 5,
    itbiTax: 3,
    registryFees: 0,
    possessionOfficer: 0,
    deedIssuance: 0,
    legalFees: 0
  },
  maintenanceCosts: {
    renovation: 0,
    monthlyIptu: 0,
    otherMonthlyExpenses: 0,
    holdingPeriod: 6
  },
  saleCosts: {
    brokerCommission: 5,
    appraisalFees: 0
  },
  capitalGainsTax: {
    acquisitionDate: new Date(),
    deedCost: 0,
    isOnlyProperty: false,
    willReinvest: false
  },
  iptuRate: 1.5,
  paymentMethod: "cash"
};

const isProduction = process.env.NODE_ENV === 'production';
const DEFAULT_VALUES = isProduction ? PROD_DEFAULT_VALUES : DEV_DEFAULT_VALUES;

const ModernCalculator: React.FC = () => {
  const { toast } = useToast();
  const { encryptionKey } = useAuth();
  const [simulationName, setSimulationName] = useState('');
  const [simulationNotes, setSimulationNotes] = useState('');
  const [activeTab, setActiveTab] = useState<string>('property-data');
  const [showDetailedCosts, setShowDetailedCosts] = useState(false);
  
  const [initialValues, setInitialValues] = useState<InitialValues>(DEFAULT_VALUES.initialValues);
  const [needsRenovation, setNeedsRenovation] = useState(DEFAULT_VALUES.needsRenovation);
  const [acquisitionCosts, setAcquisitionCosts] = useState<AcquisitionCosts>(DEFAULT_VALUES.acquisitionCosts);
  const [maintenanceCosts, setMaintenanceCosts] = useState<MaintenanceCosts>(DEFAULT_VALUES.maintenanceCosts);
  const [saleCosts, setSaleCosts] = useState<SaleCosts>(DEFAULT_VALUES.saleCosts);
  const [capitalGainsTax, setCapitalGainsTax] = useState<CapitalGainsTax>(DEFAULT_VALUES.capitalGainsTax);
  const [paymentMethod, setPaymentMethod] = useState<string>(DEFAULT_VALUES.paymentMethod);
  const [iptuRate, setIptuRate] = useState<number>(DEFAULT_VALUES.iptuRate);
  
  const [results, setResults] = useState<SimulationResult | null>(null);
  
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
      setActiveTab('results');
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Erro no cálculo",
        description: "Houve um erro ao calcular os resultados. Por favor, verifique os dados inseridos.",
        variant: "destructive",
      });
    }
  };
  
  const saveSimulation = async () => {
    if (!encryptionKey) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, configure sua senha de criptografia para salvar simulações.",
        variant: "destructive",
      });
      return;
    }
    
    if (!results) {
      toast({
        title: "Sem resultados",
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
          capitalGainsTax,
          needsRenovation,
          iptuRate,
          paymentMethod
        },
        results
      };
      
      await storeData('simulations', simulation, encryptionKey);
      
      toast({
        title: "Simulação salva",
        description: "Sua simulação foi salva com sucesso.",
      });
    } catch (error) {
      console.error('Error saving simulation:', error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar sua simulação.",
        variant: "destructive",
      });
    }
  };
  
  const handleIptuRateChange = (value: number[]) => {
    setIptuRate(value[0]);
    
    const monthlyIptu = (initialValues.assessedValue * (value[0] / 100)) / 12;
    setMaintenanceCosts({
      ...maintenanceCosts,
      monthlyIptu: parseFloat(monthlyIptu.toFixed(2))
    });
  };
  
  const handleHoldingPeriodChange = (value: number[]) => {
    setMaintenanceCosts({
      ...maintenanceCosts,
      holdingPeriod: value[0]
    });
  };
  
  const handleRenovationChange = (checked: boolean) => {
    setNeedsRenovation(checked);
    if (!checked) {
      setMaintenanceCosts({
        ...maintenanceCosts,
        renovation: 0
      });
    } else {
      setMaintenanceCosts({
        ...maintenanceCosts,
        renovation: 30000
      });
    }
  };
  
  const generatePDF = () => {
    if (!results) {
      toast({
        title: "Sem resultados",
        description: "Por favor, calcule os resultados antes de gerar o PDF.",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const usableWidth = pageWidth - (margin * 2);
      
      const imgData = "/lovable-uploads/45f7cfb2-2b06-4da9-85fa-6fd6e3dfde32.png";
      const imgWidth = 40;
      const imgHeight = 40;
      doc.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, margin, imgWidth, imgHeight);
      
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 153);
      doc.text("Relatório de Simulação - BidSmart", margin, margin + imgHeight + 10);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Data: ${format(new Date(), 'dd/MM/yyyy')}`, margin, margin + imgHeight + 20);
      
      if (simulationName) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Nome da Simulação: ${simulationName}`, margin, margin + imgHeight + 30);
        var currentY = margin + imgHeight + 35;
      } else {
        var currentY = margin + imgHeight + 25;
      }
      
      currentY += 5;
      
      const propertyData = [
        ["Valor de Compra", formatCurrency(initialValues.auctionPrice)],
        ["Valor de Venda Esperado", formatCurrency(initialValues.resalePrice)],
        ["Reforma Necessária", needsRenovation ? "Sim" : "Não"],
        ["Valor da Reforma", needsRenovation ? formatCurrency(maintenanceCosts.renovation) : "N/A"],
        ["Taxa de IPTU", `${iptuRate.toFixed(2)}%`],
        ["Tempo de Retenção", `${maintenanceCosts.holdingPeriod} meses`]
      ];
      
      autoTable(doc, {
        startY: currentY,
        head: [['Descrição', 'Valor']],
        body: propertyData,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
        margin: { top: currentY, left: margin, right: margin },
        styles: { overflow: 'linebreak' }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
      
      const acquisitionData = [
        ["Comissão do Leiloeiro", `${acquisitionCosts.auctioneerCommission}% (${formatCurrency(initialValues.auctionPrice * (acquisitionCosts.auctioneerCommission / 100))})`],
        ["ITBI", `${acquisitionCosts.itbiTax}% (${formatCurrency(initialValues.auctionPrice * (acquisitionCosts.itbiTax / 100))})`],
        ["Taxas de Registro", formatCurrency(acquisitionCosts.registryFees)],
        ["Oficial de Posse", formatCurrency(acquisitionCosts.possessionOfficer)],
        ["Emissão de Escritura", formatCurrency(acquisitionCosts.deedIssuance)],
        ["Honorários Advocatícios", formatCurrency(acquisitionCosts.legalFees)]
      ];
      
      autoTable(doc, {
        startY: currentY,
        head: [['Descrição', 'Valor']],
        body: acquisitionData,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
        margin: { top: currentY, left: margin, right: margin },
        styles: { overflow: 'linebreak' }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
      
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = margin;
      }
      
      const maintenanceData = [
        ["IPTU Mensal", formatCurrency(maintenanceCosts.monthlyIptu)],
        ["Outras Despesas Mensais", formatCurrency(maintenanceCosts.otherMonthlyExpenses)],
        ["Total Custos Mensais", formatCurrency(maintenanceCosts.monthlyIptu + maintenanceCosts.otherMonthlyExpenses)],
        ["Período Total", `${maintenanceCosts.holdingPeriod} meses`],
        ["Total Custos de Manutenção", formatCurrency((maintenanceCosts.monthlyIptu + maintenanceCosts.otherMonthlyExpenses) * maintenanceCosts.holdingPeriod)]
      ];
      
      autoTable(doc, {
        startY: currentY,
        head: [['Descrição', 'Valor']],
        body: maintenanceData,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
        margin: { top: currentY, left: margin, right: margin },
        styles: { overflow: 'linebreak' }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
      
      const saleData = [
        ["Comissão de Venda", `${saleCosts.brokerCommission}% (${formatCurrency(initialValues.resalePrice * (saleCosts.brokerCommission / 100))})`],
        ["Taxas de Avaliação", formatCurrency(saleCosts.appraisalFees)]
      ];
      
      autoTable(doc, {
        startY: currentY,
        head: [['Descrição', 'Valor']],
        body: saleData,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
        margin: { top: currentY, left: margin, right: margin },
        styles: { overflow: 'linebreak' }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
      
      if (currentY > pageHeight - 70) {
        doc.addPage();
        currentY = margin;
      }
      
      const resultsData = [
        ["Investimento Total", formatCurrency(initialValues.auctionPrice + results.totalAcquisitionCosts + maintenanceCosts.renovation)],
        ["Despesas Totais", formatCurrency(results.totalAcquisitionCosts + results.totalMaintenanceCosts + results.totalSaleCosts)],
        ["Valor de Venda", formatCurrency(initialValues.resalePrice)],
        ["Lucro Bruto", formatCurrency(results.grossProfit)],
        ["Imposto sobre Ganho de Capital", formatCurrency(results.capitalGainsTaxDue)],
        ["Lucro Líquido Final", formatCurrency(results.netProfit)],
        ["ROI Total", formatPercentage(results.roi)],
        ["ROI Anualizado", formatPercentage(results.roi / (maintenanceCosts.holdingPeriod / 12))]
      ];
      
      autoTable(doc, {
        startY: currentY,
        head: [['Métrica', 'Valor']],
        body: resultsData,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
        margin: { top: currentY, left: margin, right: margin },
        styles: { overflow: 'linebreak' }
      });
      
      if (simulationNotes) {
        currentY = (doc as any).lastAutoTable.finalY + 10;
        
        if (currentY > pageHeight - 70) {
          doc.addPage();
          currentY = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 153);
        doc.text("Observações", margin, currentY);
        currentY += 5;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const splitNotes = doc.splitTextToSize(simulationNotes, usableWidth);
        doc.text(splitNotes, margin, currentY);
      }
      
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`BidSmart - Relatório de Simulação - Página ${i} de ${pageCount}`, margin, pageHeight - 10);
        doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth - margin - 60, pageHeight - 10, { align: 'right' });
      }
      
      const fileName = simulationName 
        ? `BidSmart_Simulacao_${simulationName.replace(/\s+/g, '_')}.pdf`
        : `BidSmart_Simulacao_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.pdf`;
      
      doc.save(fileName);
      
      toast({
        title: "PDF gerado com sucesso",
        description: `O relatório foi salvo como "${fileName}".`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Houve um erro ao gerar o relatório em PDF.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="property-data" className="text-xs md:text-sm">
              Dados do Imóvel
            </TabsTrigger>
            <TabsTrigger value="costs" className="text-xs md:text-sm">
              Custos
            </TabsTrigger>
            <TabsTrigger value="financing" className="text-xs md:text-sm">
              Impostos e Financiamento
            </TabsTrigger>
            <TabsTrigger value="results" className="text-xs md:text-sm" disabled={!results}>
              Resultados
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="property-data" className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center text-xl font-semibold">
                <Calculator className="mr-2 h-5 w-5" />
                <h2>Dados do Imóvel</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="auctionPrice">Valor de Compra</Label>
                  <div className="mt-1.5">
                    <CurrencyInput
                      id="auctionPrice"
                      value={initialValues.auctionPrice}
                      onChange={(value) => setInitialValues({
                        ...initialValues,
                        auctionPrice: value
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="renovation-switch">Reforma necessária</Label>
                    <Switch 
                      id="renovation-switch" 
                      checked={needsRenovation} 
                      onCheckedChange={handleRenovationChange} 
                    />
                  </div>
                  
                  {needsRenovation && (
                    <div className="mt-3">
                      <Label htmlFor="renovationCost">Custo de Reforma</Label>
                      <div className="mt-1.5">
                        <CurrencyInput
                          id="renovationCost"
                          value={maintenanceCosts.renovation}
                          onChange={(value) => setMaintenanceCosts({
                            ...maintenanceCosts,
                            renovation: value
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="resalePrice">Valor de Venda Esperado</Label>
                  <div className="mt-1.5">
                    <CurrencyInput
                      id="resalePrice"
                      value={initialValues.resalePrice}
                      onChange={(value) => setInitialValues({
                        ...initialValues,
                        resalePrice: value
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="iptu-slider" className="flex items-center">
                      IPTU Anual (%)
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-0 ml-1">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="w-80">
                          <p className="text-sm">Percentual do IPTU sobre o valor venal do imóvel</p>
                        </PopoverContent>
                      </Popover>
                    </Label>
                    <span className="text-sm font-medium">{iptuRate.toFixed(2)}%</span>
                  </div>
                  <Slider 
                    id="iptu-slider"
                    min={0.1} 
                    max={3} 
                    step={0.1} 
                    value={[iptuRate]} 
                    onValueChange={handleIptuRateChange}
                    className="py-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="holding-period-slider">Tempo de Retenção (meses)</Label>
                    <span className="text-sm font-medium">{maintenanceCosts.holdingPeriod} meses</span>
                  </div>
                  <Slider 
                    id="holding-period-slider"
                    min={1} 
                    max={24} 
                    step={1} 
                    value={[maintenanceCosts.holdingPeriod]} 
                    onValueChange={handleHoldingPeriodChange}
                    className="py-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setActiveTab('costs')}
                className="space-x-2"
              >
                <span>Próximo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="costs" className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center text-xl font-semibold">
                <DollarSign className="mr-2 h-5 w-5" />
                <h2>Custos e Comissões</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="auctioneerCommission">Comissão do Leiloeiro (%)</Label>
                  <PercentageInput
                    id="auctioneerCommission"
                    value={acquisitionCosts.auctioneerCommission}
                    onChange={(value) => setAcquisitionCosts({
                      ...acquisitionCosts,
                      auctioneerCommission: value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itbiTax">ITBI (Imposto de Transferência) (%)</Label>
                  <PercentageInput
                    id="itbiTax"
                    value={acquisitionCosts.itbiTax}
                    onChange={(value) => setAcquisitionCosts({
                      ...acquisitionCosts,
                      itbiTax: value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registryFees" className="flex items-center">
                    Taxas de Registro
                    <a 
                      href="https://calculadora.registrodeimoveis.org.br" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center ml-2 text-sm text-indigo-600 hover:text-indigo-500 transition-colors" 
                      title="Calcular valor no site oficial"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Label>
                  <div className="mt-1.5">
                    <CurrencyInput
                      id="registryFees"
                      value={acquisitionCosts.registryFees}
                      onChange={(value) => setAcquisitionCosts({
                        ...acquisitionCosts,
                        registryFees: value
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brokerCommission">Comissão de Venda (%)</Label>
                  <PercentageInput
                    id="brokerCommission"
                    value={saleCosts.brokerCommission}
                    onChange={(value) => setSaleCosts({
                      ...saleCosts,
                      brokerCommission: value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherMonthlyExpenses">Outras Despesas Mensais</Label>
                  <div className="mt-1.5">
                    <CurrencyInput
                      id="otherMonthlyExpenses"
                      value={maintenanceCosts.otherMonthlyExpenses}
                      onChange={(value) => setMaintenanceCosts({
                        ...maintenanceCosts,
                        otherMonthlyExpenses: value
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('property-data')}
              >
                Voltar
              </Button>
              <Button 
                onClick={() => setActiveTab('financing')}
                className="space-x-2"
              >
                <span>Próximo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="financing" className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center text-xl font-semibold">
                <Calendar className="mr-2 h-5 w-5" />
                <h2>Tributação e Financiamento</h2>
              </div>
              
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
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto">
                      <CalendarComponent
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
                
                <div className="space-y-3">
                  <Label>Método de Financiamento</Label>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="payment-cash" />
                      <Label htmlFor="payment-cash" className="cursor-pointer">À Vista</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="financing" id="payment-financing" />
                      <Label htmlFor="payment-financing" className="cursor-pointer">Financiado</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isOnlyProperty"
                      checked={capitalGainsTax.isOnlyProperty}
                      onCheckedChange={(checked) => setCapitalGainsTax({
                        ...capitalGainsTax,
                        isOnlyProperty: checked
                      })}
                    />
                    <Label htmlFor="isOnlyProperty">Este é seu único imóvel?</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="willReinvest"
                      checked={capitalGainsTax.willReinvest}
                      onCheckedChange={(checked) => setCapitalGainsTax({
                        ...capitalGainsTax,
                        willReinvest: checked
                      })}
                    />
                    <Label htmlFor="willReinvest">Vai reinvestir em outro imóvel em até 180 dias?</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('costs')}
              >
                Voltar
              </Button>
              <Button 
                onClick={calculateAndShowResults}
                variant="default"
              >
                Calcular Resultados
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6 p-6">
            {results && (
              <div className="space-y-6">
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="summary" className="flex-1">Resultados</TabsTrigger>
                    <TabsTrigger value="details" className="flex-1">Detalhamento</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="pt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h3 className="text-sm font-medium text-gray-500">Investimento Total</h3>
                        <p className="text-3xl font-bold mt-1 text-blue-900">
                          {formatCurrency(initialValues.auctionPrice + results.totalAcquisitionCosts + maintenanceCosts.renovation)}
                        </p>
                      </div>
                      
                      <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
                        <h3 className="text-sm font-medium text-gray-500">Despesas Totais</h3>
                        <p className="text-3xl font-bold mt-1 text-rose-900">
                          {formatCurrency(results.totalAcquisitionCosts + results.totalMaintenanceCosts + results.totalSaleCosts)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Lucro Bruto</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(results.grossProfit)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Lucro Líquido</span>
                        <span className={cn(
                          "text-xl font-bold",
                          results.netProfit >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {formatCurrency(results.netProfit)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium flex items-center">
                          ROI Total
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 ml-1">
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent side="top" className="w-80">
                              <p className="text-sm">Retorno sobre o investimento total</p>
                            </PopoverContent>
                          </Popover>
                        </span>
                        <span className={cn(
                          "text-xl font-bold",
                          results.roi >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {formatPercentage(results.roi)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium flex items-center">
                          ROI Anualizado
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 ml-1">
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent side="top" className="w-80">
                              <p className="text-sm">ROI convertido em taxa anual</p>
                            </PopoverContent>
                          </Popover>
                        </span>
                        <span className={cn(
                          "text-xl font-bold",
                          (results.roi / (maintenanceCosts.holdingPeriod / 12)) >= 0 
                            ? "text-green-600" 
                            : "text-red-600"
                        )}>
                          {formatPercentage(results.roi / (maintenanceCosts.holdingPeriod / 12))}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <Card className="border border-gray-200">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="simulationName">Nome (Opcional)</Label>
                              <Input
                                id="simulationName"
                                placeholder="ex: Apartamento Centro"
                                value={simulationName}
                                onChange={(e) => setSimulationName(e.target.value)}
                              />
                            </div>
                            
                            <Button 
                              onClick={generatePDF}
                              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              Salvar em PDF
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => {
                                setActiveTab('property-data');
                                setResults(null);
                              }}
                              className="w-full"
                            >
                              Nova Simulação
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="pt-4 space-y-4">
                    <h3 className="font-medium text-lg">Detalhamento de Custos</h3>
                    
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span>ITBI ({acquisitionCosts.itbiTax}%)</span>
                        <span className="font-medium">
                          {formatCurrency(initialValues.auctionPrice * (acquisitionCosts.itbiTax / 100))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Taxas de Registro</span>
                        <span className="font-medium">{formatCurrency(acquisitionCosts.registryFees)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Comissão do Leiloeiro ({acquisitionCosts.auctioneerCommission}%)</span>
                        <span className="font-medium">
                          {formatCurrency(initialValues.auctionPrice * (acquisitionCosts.auctioneerCommission / 100))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Comissão de Venda ({saleCosts.brokerCommission}%)</span>
                        <span className="font-medium">
                          {formatCurrency(initialValues.resalePrice * (saleCosts.brokerCommission / 100))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>IPTU ({maintenanceCosts.holdingPeriod} meses)</span>
                        <span className="font-medium">
                          {formatCurrency(maintenanceCosts.monthlyIptu * maintenanceCosts.holdingPeriod)}
                        </span>
                      </div>
                      
                      {needsRenovation && (
                        <div className="flex justify-between">
                          <span>Reforma</span>
                          <span className="font-medium">{formatCurrency(maintenanceCosts.renovation)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Imposto sobre Ganho de Capital</span>
                        <span className="font-medium">{formatCurrency(results.capitalGainsTaxDue)}</span>
                      </div>
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Lucro Líquido Final</span>
                          <span className={results.netProfit >= 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(results.netProfit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ModernCalculator;
