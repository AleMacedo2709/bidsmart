
import React, { useState } from 'react';
import CurrencyInput from './CurrencyInput';
import PercentageSelect from './PercentageSelect';
import ResultsSummary from './ResultsSummary';
import { CalculatorInput, calculateResults } from '@/types/calculator';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const initialFormData: CalculatorInput = {
  valorArremate: 0,
  valorVenal: 0,
  valorVenda: 0,
  comissaoLeiloeiro: 5,
  itbiPercentual: 3,
  registro: 0,
  oficialImissao: 0,
  cartaArremate: 0,
  honorariosAdvocaticios: 0,
  reforma: 0,
  outros: 0,
  prazoVenda: 12,
  iptuMensal: 0,
  despesasMensais: 0,
  comissaoCorretor: 6
};

const steps = [
  {
    title: 'Valores Iniciais',
    subtitle: 'Informações básicas do imóvel',
    fields: ['valorArremate', 'valorVenal', 'valorVenda']
  },
  {
    title: 'Custas Iniciais',
    subtitle: 'Custos da arrematação',
    fields: ['comissaoLeiloeiro', 'itbiPercentual', 'registro', 'oficialImissao', 'cartaArremate', 'honorariosAdvocaticios']
  },
  {
    title: 'Custas de Manutenção',
    subtitle: 'Custos mensais e reformas',
    fields: ['reforma', 'outros', 'prazoVenda', 'iptuMensal', 'despesasMensais']
  },
  {
    title: 'Custas de Venda',
    subtitle: 'Custos para revenda',
    fields: ['comissaoCorretor']
  }
];

const fieldLabels: Record<string, string> = {
  valorArremate: 'Valor da Arrematação',
  valorVenal: 'Valor Venal do Imóvel',
  valorVenda: 'Valor Esperado de Venda',
  comissaoLeiloeiro: 'Comissão do Leiloeiro (%)',
  itbiPercentual: 'ITBI (%)',
  registro: 'Registro',
  oficialImissao: 'Oficial (imissão na posse)',
  cartaArremate: 'Carta de Arrematação',
  honorariosAdvocaticios: 'Honorários Advocatícios',
  reforma: 'Reforma',
  outros: 'Outros',
  prazoVenda: 'Prazo de Venda (meses)',
  iptuMensal: 'IPTU Mensal',
  despesasMensais: 'Despesas Mensais',
  comissaoCorretor: 'Comissão do Corretor (%)'
};

const comissaoLeiloeiroOptions = [
  { value: 5, label: '5% (Padrão)' },
  { value: 3, label: '3% (Mínimo)' },
  { value: 7, label: '7% (Máximo)' },
];

const itbiOptions = [
  { value: 3, label: '3% (São Paulo e maioria das cidades)' },
  { value: 2, label: '2% (Algumas cidades)' },
  { value: 2.5, label: '2.5% (Algumas cidades)' },
  { value: 3.5, label: '3.5% (Algumas cidades)' },
];

const comissaoCorretorOptions = [
  { value: 6, label: '6% (Padrão CRECI)' },
  { value: 5, label: '5% (Comum em imóveis de alto valor)' },
  { value: 4, label: '4% (Negociável)' },
];

const ModernCalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CalculatorInput>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculatedResults, setCalculatedResults] = useState<any>(null);

  const handleInputChange = (field: keyof CalculatorInput, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCurrentStep = () => {
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData?.fields) return true;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentStepData.fields.forEach(field => {
      const value = formData[field as keyof CalculatorInput];
      
      // Verificação diferente para campos obrigatórios
      if (field === 'valorArremate' || field === 'valorVenal' || field === 'valorVenda') {
        if (value === 0) {
          newErrors[field] = 'Este campo é obrigatório';
          isValid = false;
        }
      } else if (value < 0) {
        newErrors[field] = 'O valor não pode ser negativo';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (validateCurrentStep()) {
        setCurrentStep(prev => prev + 1);
        setErrors({});
      }
    } else {
      if (validateCurrentStep()) {
        // Calculate and show results
        const results = calculateResults(formData);
        setCalculatedResults(results);
        setCurrentStep(steps.length + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setCalculatedResults(null);
    setErrors({});
  };

  // This function is only called during render and doesn't update state
  const renderStepContent = () => {
    if (currentStep === steps.length + 1) {
      return <ResultsSummary results={calculatedResults} formData={formData} />;
    }

    const currentStepData = steps[currentStep - 1];
    
    return (
      <Card className="border-none shadow-none">
        <CardContent className="pt-6">
          <div className="space-y-5">
            {currentStepData.fields.map((field) => {
              if (field === 'comissaoLeiloeiro') {
                return (
                  <div key={field}>
                    <PercentageSelect
                      value={formData[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      options={comissaoLeiloeiroOptions}
                      label={fieldLabels[field]}
                    />
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                    )}
                  </div>
                );
              }

              if (field === 'itbiPercentual') {
                return (
                  <div key={field}>
                    <PercentageSelect
                      value={formData[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      options={itbiOptions}
                      label={fieldLabels[field]}
                    />
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                    )}
                  </div>
                );
              }

              if (field === 'comissaoCorretor') {
                return (
                  <div key={field}>
                    <PercentageSelect
                      value={formData[field]}
                      onChange={(value) => handleInputChange(field, value)}
                      options={comissaoCorretorOptions}
                      label={fieldLabels[field]}
                    />
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                    )}
                  </div>
                );
              }
              
              if (field === 'prazoVenda') {
                return (
                  <div key={field} className="space-y-2">
                    <Label>{fieldLabels[field]}</Label>
                    <Input
                      type="number"
                      value={formData[field]}
                      onChange={(e) => handleInputChange(field, parseInt(e.target.value) || 0)}
                      className={`${errors[field] ? 'border-red-500' : ''}`}
                      min="1"
                    />
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                    )}
                  </div>
                );
              }

              return (
                <div key={field} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{fieldLabels[field]}</Label>
                    {field === 'registro' && (
                      <a
                        href="https://calculadora.registrodeimoveis.org.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
                        title="Calcular valor no site oficial"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <CurrencyInput
                    value={formData[field as keyof CalculatorInput]}
                    onChange={(value) => handleInputChange(field as keyof CalculatorInput, value)}
                    name={field}
                    required={field === 'valorArremate' || field === 'valorVenal' || field === 'valorVenda'}
                    className={errors[field] ? 'border-red-500' : ''}
                  />
                  {errors[field] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Renderizar os passos
  const renderProgressBar = () => {
    const progress = ((currentStep - 1) / steps.length) * 100;
    
    return (
      <div className="relative mb-8">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
          <div 
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-2xl font-semibold">Calculadora de Investimento em Leilões</h2>
        <p className="text-gray-500 mt-2">
          Calcule o potencial retorno do seu investimento em leilões imobiliários
        </p>
      </div>
      
      <div className="p-6">
        {currentStep <= steps.length && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {steps[currentStep - 1].title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {steps[currentStep - 1].subtitle}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Etapa {currentStep} de {steps.length}
              </div>
            </div>
            {renderProgressBar()}
          </div>
        )}
        
        {renderStepContent()}
      </div>
      
      {currentStep <= steps.length && (
        <div className="border-t p-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Voltar
          </Button>
          
          <Button
            onClick={handleNext}
          >
            {currentStep === steps.length ? 'Ver Resultados' : 'Próximo'}
          </Button>
        </div>
      )}
      
      {currentStep > steps.length && (
        <div className="border-t p-4">
          <Button onClick={handleReset} className="w-full">
            Nova Simulação
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModernCalculator;
