
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Shield, Lock, Key, FileDigit, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';

const About = () => {
  const { verifyDataIntegrity } = useAuth();
  
  const handleVerifyIntegrity = async () => {
    try {
      await verifyDataIntegrity();
    } catch (error) {
      console.error("Integrity verification error:", error);
    }
  };
  
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Sobre Nós</h1>
          <p className="text-gray-500">
            Informações sobre nossa empresa e políticas de privacidade.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-semibold mb-4">Sobre a Empresa</h2>
              <div className="space-y-4">
                <p>
                  Auction Estate Guardian é uma ferramenta especializada para investidores e indivíduos
                  que adquirem imóveis através de leilões. Nossa missão é ajudar você
                  a tomar decisões financeiras informadas, mantendo controle total sobre seus dados.
                </p>
                <p>
                  Este aplicativo foi desenvolvido por [Nome da Empresa Fornecedora], líder em
                  soluções imobiliárias baseadas em leilões.
                </p>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Informações de Contato</h3>
                  <div className="space-y-1">
                    <p><strong>Email:</strong> contact@example.com</p>
                    <p><strong>Website:</strong> www.example.com</p>
                    <p><strong>Endereço:</strong> Rua Exemplo 123, São Paulo, Brasil</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-semibold mb-4">Informações Legais</h2>
              <div className="space-y-4">
                <p>
                  © {new Date().getFullYear()} [Nome da Empresa Fornecedora]. Todos os direitos reservados.
                </p>
                <p>
                  Nosso aplicativo está em conformidade com a LGPD (Lei Geral de Proteção de Dados),
                  a Lei Brasileira de Proteção de Dados.
                </p>
              </div>
            </div>
          </section>
          
          <section className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Privacidade & Segurança</h2>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-2 mb-6 bg-primary/5">
                <p className="text-gray-800">
                  <strong>Seus dados são criptografados usando criptografia avançada AES-256-GCM e armazenados exclusivamente no seu dispositivo. 
                  Mesmo a empresa fornecedora não pode visualizar, acessar ou gerenciar qualquer informação inserida no aplicativo.</strong>
                </p>
                <p className="mt-2 text-gray-800">
                  <strong>Para sua privacidade e proteção, é essencial que você salve um backup criptografado em um local seguro
                  (como um pen drive, armazenamento em nuvem privado ou e-mail seguro). Em caso de perda do dispositivo ou exclusão do aplicativo,
                  seus dados não poderão ser recuperados sem este arquivo de backup. Você é totalmente responsável por armazenar seu backup
                  e senha em segurança.</strong>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="flex flex-col p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Criptografia Avançada</h3>
                  </div>
                  <p className="text-sm">
                    Usamos AES-256-GCM, o padrão de criptografia considerado inquebrável à força bruta com a tecnologia atual.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Chaves Derivadas</h3>
                  </div>
                  <p className="text-sm">
                    Derivação de chaves PBKDF2 com mais de 310.000 iterações para proteção contra ataques de força bruta.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileDigit className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Verificação de Integridade</h3>
                  </div>
                  <p className="text-sm">
                    Cada dado armazenado tem uma assinatura digital para verificar se não foi alterado ou corrompido.
                  </p>
                </div>
                
                <div className="flex flex-col p-4 border rounded-lg bg-blue-50">
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
                <Button onClick={handleVerifyIntegrity} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Verificar Integridade dos Dados
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-semibold mb-4">Detalhes Técnicos de Segurança</h2>
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
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;

