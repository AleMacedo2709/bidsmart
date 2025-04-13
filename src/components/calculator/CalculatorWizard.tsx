import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ArrowLeft } from 'lucide-react';

import InitialValues from './InitialValues';
import StepNavigation from './StepNavigation';

// Defina os tipos
interface InitialValuesType {
  valorArremate: number;
  valorVenal: number;
  valorVenda: number;
}

const CalculatorWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [initialValues, setInitialValues] = useState<InitialValuesType>({
    valorArremate: 300000,
    valorVenal: 300000,
    valorVenda: 450000
  });

  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <StepNavigation 
          activeStep={activeStep} 
          setActiveStep={setActiveStep} 
        />
        
        <div className="p-6">
          <TabsContent value="1" className={activeStep === 1 ? 'block' : 'hidden'}>
            <InitialValues 
              valorArremate={initialValues.valorArremate}
              valorVenal={initialValues.valorVenal}
              valorVenda={initialValues.valorVenda}
              onValorArremateChange={(valorArremate) => 
                setInitialValues(prev => ({ ...prev, valorArremate }))
              }
              onValorVenalChange={(valorVenal) => 
                setInitialValues(prev => ({ ...prev, valorVenal }))
              }
              onValorVendaChange={(valorVenda) => 
                setInitialValues(prev => ({ ...prev, valorVenda }))
              }
            />
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext} className="space-x-2">
                <span>Próximo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="2" className={activeStep === 2 ? 'block' : 'hidden'}>
            <h2 className="text-xl font-bold mb-4">Custos de Aquisição</h2>
            {/* Conteúdo para custos de aquisição */}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack} className="space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <Button onClick={handleNext} className="space-x-2">
                <span>Próximo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="3" className={activeStep === 3 ? 'block' : 'hidden'}>
            <h2 className="text-xl font-bold mb-4">Custos de Manutenção</h2>
            {/* Conteúdo para custos de manutenção */}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack} className="space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <Button onClick={handleNext} className="space-x-2">
                <span>Próximo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="4" className={activeStep === 4 ? 'block' : 'hidden'}>
            <h2 className="text-xl font-bold mb-4">Resultados da Simulação</h2>
            {/* Conteúdo para resultados */}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack} className="space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <Button variant="default">
                Salvar Simulação
              </Button>
            </div>
          </TabsContent>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorWizard;
