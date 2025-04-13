
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Shield, 
  Lock, 
  Key, 
  FileDigit, 
  Database, 
  RefreshCw, 
  Info, 
  HelpCircle, 
  Mail, 
  Globe, 
  MapPin,
  BadgeInfo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

const About = () => {
  const { verifyDataIntegrity } = useAuth();
  
  const handleVerifyIntegrity = async () => {
    try {
      await verifyDataIntegrity();
      toast({
        title: "Verificação concluída",
        description: "A integridade dos dados foi verificada com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro de verificação de integridade:", error);
      toast({
        title: "Erro na verificação",
        description: "Houve um problema ao verificar a integridade dos dados.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <BadgeInfo className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Sobre Nós</h1>
        </div>
        
        <Tabs defaultValue="empresa" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="empresa">Nossa Empresa</TabsTrigger>
            <TabsTrigger value="privacidade">Privacidade & Segurança</TabsTrigger>
            <TabsTrigger value="tecnico">Detalhes Técnicos</TabsTrigger>
          </TabsList>
          
          {/* Aba da Empresa */}
          <TabsContent value="empresa" className="space-y-6">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Sobre a BidSmart
                </CardTitle>
                <CardDescription>Conheça mais sobre nossa empresa e missão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  BidSmart é uma ferramenta especializada para investidores e indivíduos
                  que adquirem imóveis através de leilões. Nossa missão é ajudar você
                  a tomar decisões financeiras informadas, mantendo controle total sobre seus dados.
                </p>
                <p className="text-gray-700">
                  Este aplicativo foi desenvolvido por uma equipe especializada em tecnologias
                  imobiliárias, com larga experiência no mercado de leilões.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-100">
                  <h3 className="text-lg font-medium mb-3 text-blue-700">Informações de Contato</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <p><strong>Email:</strong> contato@bidsmart.com.br</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <p><strong>Website:</strong> www.bidsmart.com.br</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <p><strong>Endereço:</strong> Av. Paulista 1000, São Paulo, Brasil</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 text-sm text-gray-500 rounded-b-lg">
                © {new Date().getFullYear()} BidSmart. Todos os direitos reservados.
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Informações Legais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Nosso aplicativo está em conformidade com a LGPD (Lei Geral de Proteção de Dados),
                  a Lei Brasileira de Proteção de Dados.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba de Privacidade */}
          <TabsContent value="privacidade" className="space-y-6">
            <Card className="border-t-4 border-t-blue-600">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Privacidade & Segurança
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Como protegemos seus dados e garantimos sua privacidade
                </CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                <div className="border-l-4 border-primary pl-4 py-3 mb-6 bg-primary/5 rounded-r">
                  <p className="text-gray-800 font-medium">
                    Seus dados são criptografados usando criptografia avançada AES-256-GCM e armazenados exclusivamente no seu dispositivo. 
                    Mesmo a empresa fornecedora não pode visualizar, acessar ou gerenciar qualquer informação inserida no aplicativo.
                  </p>
                  <p className="mt-2 text-gray-800">
                    Para sua privacidade e proteção, é essencial que você salve um backup criptografado em um local seguro.
                    Em caso de perda do dispositivo ou exclusão do aplicativo, seus dados não poderão ser recuperados sem este arquivo de backup.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="flex flex-col p-4 border rounded-lg bg-blue-50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-800">Criptografia Avançada</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      Usamos AES-256-GCM, o padrão de criptografia considerado inquebrável à força bruta com a tecnologia atual.
                    </p>
                  </div>
                  
                  <div className="flex flex-col p-4 border rounded-lg bg-blue-50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-800">Chaves Derivadas</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      Derivação de chaves PBKDF2 com mais de 310.000 iterações para proteção contra ataques de força bruta.
                    </p>
                  </div>
                  
                  <div className="flex flex-col p-4 border rounded-lg bg-blue-50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <FileDigit className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-800">Verificação de Integridade</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      Cada dado armazenado tem uma assinatura digital para verificar se não foi alterado ou corrompido.
                    </p>
                  </div>
                  
                  <div className="flex flex-col p-4 border rounded-lg bg-blue-50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-800">Armazenamento Local</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      Todos os dados permanecem no seu dispositivo, nunca enviarmos seus dados para servidores externos.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button onClick={handleVerifyIntegrity} variant="outline" className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700">
                    <RefreshCw className="w-4 h-4" />
                    Verificar Integridade dos Dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba de Detalhes Técnicos */}
          <TabsContent value="tecnico" className="space-y-4">
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Detalhes Técnicos de Segurança</CardTitle>
                <CardDescription>Informações detalhadas sobre nossas tecnologias de segurança</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-primary">
                      Armazenamento e Criptografia
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>
                          <span className="font-semibold">Criptografia AES-256-GCM</span>: Algoritmo de criptografia simétrica com verificação de autenticidade integrada.
                        </li>
                        <li>
                          <span className="font-semibold">Derivação de chave PBKDF2</span>: 310.000+ iterações para proteção contra ataques de força bruta.
                        </li>
                        <li>
                          <span className="font-semibold">Verificação de integridade</span>: Hashes SHA-256 para verificar a integridade de todos os dados.
                        </li>
                        <li>
                          <span className="font-semibold">Proteção contra modificação</span>: Dados são verificados a cada acesso para detectar alterações não autorizadas.
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-primary">
                      Melhores Práticas de Segurança
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>
                          Realize backups regulares e armazene-os em locais seguros.
                        </li>
                        <li>
                          Use senhas fortes com pelo menos 12 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.
                        </li>
                        <li>
                          Verifique a integridade dos dados regularmente usando o botão na aba de Privacidade.
                        </li>
                        <li>
                          Atualize sua senha de criptografia quando solicitado pelo aplicativo.
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-primary">
                      Rotação de Chaves e Atualizações
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-gray-700">
                        <p>Recomendamos atualizar suas chaves de criptografia a cada 90 dias para maior segurança.</p>
                        <p>O aplicativo realizará verificações regulares de integridade e alertará caso detecte alguma inconsistência nos dados.</p>
                        <Separator className="my-4" />
                        <div className="pt-2 text-sm bg-amber-50 p-3 rounded-lg border border-amber-100">
                          <span className="font-semibold text-amber-800">Atenção:</span>
                          <p className="text-amber-700 mt-1">Para garantir máxima segurança, nunca compartilhe sua senha de criptografia com ninguém, nem mesmo com nossa equipe de suporte.</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default About;
