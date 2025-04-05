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
      console.error('Calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "There was an error calculating the results. Please check your inputs.",
        variant: "destructive",
      });
    }
  };
  
  const saveSimulation = async () => {
    if (!encryptionKey) {
      toast({
        title: "Authentication Required",
        description: "Please set up your encryption password to save simulations.",
        variant: "destructive",
      });
      return;
    }
    
    if (!results) {
      toast({
        title: "No Results",
        description: "Please calculate results before saving.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const simulation = {
        name: simulationName || `Simulation ${new Date().toLocaleString()}`,
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
        title: "Simulation Saved",
        description: "Your simulation has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving simulation:', error);
      toast({
        title: "Save Error",
        description: "There was an error saving your simulation.",
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
                  <Label htmlFor="auctioneerCommission">Auctioneer Commission (%)</Label>
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
                  <Label htmlFor="itbiTax">ITBI (Property Transfer Tax) (%)</Label>
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
                  <Label htmlFor="registryFees">Registry Fees (R$)</Label>
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
                  <Label htmlFor="possessionOfficer">Judicial Possession Officer (R$)</Label>
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
                  <Label htmlFor="legalFees">Legal/Attorney Fees (R$)</Label>
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
                  <Label htmlFor="renovation">Renovation Costs (R$)</Label>
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
                  <Label htmlFor="monthlyIptu">Monthly IPTU (Property Tax) (R$)</Label>
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
                  <Label htmlFor="otherMonthlyExpenses">Other Monthly Expenses (R$)</Label>
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
                  <Label htmlFor="holdingPeriod">Expected Holding Period (months)</Label>
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
                  <Label htmlFor="brokerCommission">Broker Commission (%)</Label>
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
                  <Label htmlFor="appraisalFees">Appraisal or Report Fees (R$)</Label>
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
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
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
                  <Label htmlFor="deedCost">Deed Cost (R$)</Label>
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
                  <Label htmlFor="isOnlyProperty">Is this your only property?</Label>
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
                  <Label htmlFor="willReinvest">Will reinvest into another residential property within 180 days?</Label>
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
            <CardTitle>Summary Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Gross Profit</h3>
                  <p className={cn(
                    "text-2xl font-semibold",
                    results.grossProfit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatCurrency(results.grossProfit)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
                  <p className={cn(
                    "text-2xl font-semibold",
                    results.netProfit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatCurrency(results.netProfit)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Return on Investment</h3>
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
                  <h3 className="text-sm font-medium text-gray-500">Capital Gain</h3>
                  <p className="text-xl font-semibold">{formatCurrency(results.capitalGain)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Capital Gains Tax Due</h3>
                  <p className="text-xl font-semibold">{formatCurrency(results.capitalGainsTaxDue)}</p>
                </div>
                
                {results.taxDueDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tax Due Date</h3>
                    <p className="text-xl font-semibold">{formatDate(results.taxDueDate)}</p>
                  </div>
                )}
                
                {results.taxExemptionReason && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tax Exemption Reason</h3>
                    <p className="text-base">{results.taxExemptionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setShowBreakdown(!showBreakdown)}>
            {showBreakdown ? "Hide" : "Show"} Calculation Breakdown
          </Button>
          
          {showBreakdown && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Costs Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Acquisition Costs</h4>
                        <p className="text-xl font-semibold text-red-600">{formatCurrency(results.totalAcquisitionCosts)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Maintenance Costs</h4>
                        <p className="text-xl font-semibold text-red-600">{formatCurrency(results.totalMaintenanceCosts)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Sale Costs</h4>
                        <p className="text-xl font-semibold text-red-600">{formatCurrency(results.totalSaleCosts)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Line Item Breakdown</h3>
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
            <CardTitle>Save This Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="simulationName">Name (Optional)</Label>
                <Input
                  id="simulationName"
                  placeholder="e.g., Downtown Apartment"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="simulationNotes">Notes (Optional)</Label>
                <Input
                  id="simulationNotes"
                  placeholder="Add any notes about this property"
                  value={simulationNotes}
                  onChange={(e) => setSimulationNotes(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button onClick={saveSimulation}>
                  Save Simulation
                </Button>
                
                <Button variant="outline" onClick={exportToPdf}>
                  Export as PDF
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setCurrentStep(1);
                  }}
                >
                  New Calculation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const stepTitles = [
    "Initial Values",
    "Auction Acquisition Costs",
    "Maintenance Costs",
    "Sale Costs",
    "Capital Gains"
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
                  {index === 0 && "Enter the basic property values."}
                  {index === 1 && "Enter all costs associated with acquiring the property."}
                  {index === 2 && "Enter all costs for maintaining the property."}
                  {index === 3 && "Enter all costs associated with selling the property."}
                  {index === 4 && "Enter details for capital gains tax calculation."}
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
