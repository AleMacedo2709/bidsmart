
import { useState } from 'react';
import { Lock, ShieldCheck, Eye, Database, Key } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PrivacyPage = () => {
  const { toast } = useToast();
  const [feedbackSent, setFeedbackSent] = useState(false);
  
  const handleFeedback = () => {
    setFeedbackSent(true);
    toast({
      title: "Contato de Segurança",
      description: "Sua mensagem sobre segurança foi enviada. Responderemos em breve.",
      variant: "default",
    });
  };
  
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacidade e Segurança</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compromisso total com a proteção de seus dados e informações financeiras.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-3 text-green-600" />
                Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Utilizamos criptografia de ponta a ponta para proteger todas as suas informações 
                financeiras e pessoais. Nossos sistemas seguem os mais rigorosos padrões de 
                segurança da informação.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-3 text-blue-600" />
                Confidencialidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Garantimos total confidencialidade de seus dados. Nenhuma informação é 
                compartilhada com terceiros sem sua autorização expressa.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-3 text-purple-600" />
                Transparência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Total transparência sobre como seus dados são coletados, utilizados e protegidos. 
                Você tem controle total sobre suas informações.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-3 text-orange-600" />
                Armazenamento Seguro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Dados armazenados em servidores seguros com múltiplas camadas de proteção 
                e backup constante.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-3 text-red-600" />
                Controle de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Autenticação de dois fatores e monitoramento constante para prevenir 
                acessos não autorizados.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Dúvidas sobre Privacidade?</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="w-full sm:w-auto" 
                onClick={handleFeedback}
                disabled={feedbackSent}
              >
                {feedbackSent ? "Mensagem Enviada" : "Fale sobre Segurança"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => window.location.href = 'mailto:seguranca@leilao-lucrativo.com.br'}
              >
                Email de Segurança
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PrivacyPage;
