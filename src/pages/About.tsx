
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const AboutPage = () => {
  const { toast } = useToast();
  const [feedbackSent, setFeedbackSent] = useState(false);
  
  const handleFeedback = () => {
    setFeedbackSent(true);
    toast({
      title: "Feedback enviado",
      description: "Agradecemos seu interesse em nosso aplicativo!",
      variant: "default", // Alterado de "success" para "default"
    });
  };
  
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sobre o Leilão Lucrativo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Uma plataforma completa para investidores de leilões imobiliários calcularem custos, impostos e lucro potencial.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Nossa Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Fornecer ferramentas precisas e intuitivas para que investidores possam tomar decisões
                informadas sobre investimentos em leilões imobiliários, compreendendo todos os custos, 
                impostos e potencial retorno sobre investimento.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Por que Escolher Nossa Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cálculos Precisos</h3>
                  <p className="text-gray-600">Algoritmos avançados que consideram todos os custos e impostos relacionados.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Segurança de Dados</h3>
                  <p className="text-gray-600">Criptografia de ponta a ponta para proteger suas informações financeiras.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="my-10" />
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl mb-1">João Paulo</h3>
                <p className="text-gray-500 mb-4">Fundador & CEO</p>
                <p className="text-gray-700 text-sm">
                  Especialista em mercado imobiliário com mais de 10 anos de experiência em leilões.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl mb-1">Ana Maria</h3>
                <p className="text-gray-500 mb-4">CFO & Especialista Tributária</p>
                <p className="text-gray-700 text-sm">
                  Contadora com especialização em tributação imobiliária e ganho de capital.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>CS</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl mb-1">Carlos Silva</h3>
                <p className="text-gray-500 mb-4">CTO</p>
                <p className="text-gray-700 text-sm">
                  Desenvolvedor com foco em criar soluções tecnológicas para o mercado imobiliário.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Entre em Contato</CardTitle>
            <CardDescription>
              Tem dúvidas ou sugestões? Ficaremos felizes em ajudar.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button 
              className="w-full sm:w-auto" 
              onClick={handleFeedback}
              disabled={feedbackSent}
            >
              {feedbackSent ? "Mensagem Enviada" : "Enviar Mensagem"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => window.location.href = 'mailto:contato@leilao-lucrativo.com.br'}
            >
              Email Direto
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AboutPage;
