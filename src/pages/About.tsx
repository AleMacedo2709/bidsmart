
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Shield, Lock, Key, FileDigit, Database, RefreshCw, Building, Mail, Globe, MapPin, Info, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const About = () => {
  const { verifyDataIntegrity } = useAuth();
  
  const handleVerifyIntegrity = async () => {
    try {
      await verifyDataIntegrity();
      toast({
        title: "Verificação concluída",
        description: "A integridade dos dados foi verificada com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error("Integrity verification error:", error);
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar a integridade dos dados.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Sobre Nós</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Informações sobre nossa empresa e políticas de privacidade.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Information Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Sobre a Empresa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Auction Estate Guardian é uma ferramenta especializada para investidores e indivíduos
                que adquirem imóveis através de leilões. Nossa missão é ajudar você
                a tomar decisões financeiras informadas, mantendo controle total sobre seus dados.
              </p>
              <p>
                Este aplicativo foi desenvolvido por [Nome da Empresa Fornecedora], líder em
                soluções imobiliárias baseadas em leilões.
              </p>
              
              <div className="pt-4 space-y-2">
                <h3 className="text-lg font-medium mb-3">Informações de Contato</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <p><strong>Email:</strong> contact@example.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <p><strong>Website:</strong> www.example.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <p><strong>Endereço:</strong> Rua Exemplo 123, São Paulo, Brasil</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Privacy & Security Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Privacidade & Segurança</span>
              </CardTitle>
              <CardDescription>
                Como seus dados são protegidos em nosso aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-l-4 border-blue-600 pl-4 py-3 mb-6 bg-blue-50 rounded-r">
                <p className="text-gray-800 font-medium">
                  Seus dados são criptografados usando criptografia avançada AES-256-GCM e armazenados exclusivamente no seu dispositivo. 
                  Mesmo a empresa fornecedora não pode visualizar, acessar ou gerenciar qualquer informação inserida no aplicativo.
                </p>
                <p className="mt-2 text-gray-800">
                  Para sua privacidade e proteção, é essencial que você salve um backup criptografado em um local seguro
                  (como um pen drive, armazenamento em nuvem privado ou e-mail seguro).
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="flex flex-col p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Criptografia Avançada</h3>
                  </div>
                  <p className="text-sm">
                    Usamos AES-256-GCM, o padrão de criptografia considerado inquebrável à força bruta com a tecnologia atual.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Chaves Derivadas</h3>
                  </div>
                  <p className="text-sm">
                    Derivação de chaves PBKDF2 com mais de 310.000 iterações para proteção contra ataques de força bruta.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <FileDigit className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Verificação de Integridade</h3>
                  </div>
                  <p className="text-sm">
                    Cada dado armazenado tem uma assinatura digital para verificar se não foi alterado ou corrompido.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Armazenamento Local</h3>
                  </div>
                  <p className="text-sm">
                    Todos os dados permanecem no seu dispositivo, nunca enviarmos seus dados para servidores externos.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleVerifyIntegrity} 
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600"
                >
                  <RefreshCw className="w-4 h-4" />
                  Verificar Integridade dos Dados
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Legal Information Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Informações Legais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                © {new Date().getFullYear()} [Nome da Empresa Fornecedora]. Todos os direitos reservados.
              </p>
              <p>
                Nosso aplicativo está em conformidade com a LGPD (Lei Geral de Proteção de Dados),
                a Lei Brasileira de Proteção de Dados.
              </p>
            </CardContent>
          </Card>
          
          {/* Technical Details Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>Detalhes Técnicos de Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Armazenamento e Criptografia</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm">
                    <span className="font-semibold">Criptografia AES-256-GCM</span>: Algoritmo de criptografia simétrica com verificação de autenticidade integrada.
                  </li>
                  <li className="text-sm">
                    <span className="font-semibold">Derivação de chave PBKDF2</span>: 310.000+ iterações para proteção contra ataques de força bruta.
                  </li>
                  <li className="text-sm">
                    <span className="font-semibold">Verificação de integridade</span>: Hashes SHA-256 para verificar a integridade de todos os dados.
                  </li>
                  <li className="text-sm">
                    <span className="font-semibold">Proteção contra modificação</span>: Dados são verificados a cada acesso para detectar alterações não autorizadas.
                  </li>
                  <li className="text-sm">
                    <span className="font-semibold">Rotação de chaves</span>: Recomendação automática para atualizar suas chaves de criptografia a cada 90 dias.
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium mt-4">Melhores Práticas</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm">
                    Realize backups regulares e armazene-os em locais seguros.
                  </li>
                  <li className="text-sm">
                    Use senhas fortes com pelo menos 12 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.
                  </li>
                  <li className="text-sm">
                    Verifique a integridade dos dados regularmente usando o botão acima.
                  </li>
                  <li className="text-sm">
                    Atualize sua senha de criptografia quando solicitado pelo aplicativo.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
