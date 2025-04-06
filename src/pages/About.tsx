
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const About = () => {
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
              <h2 className="text-2xl font-semibold mb-4">Privacidade & Segurança</h2>
              <div className="border-l-4 border-primary pl-4 py-2 mb-6 bg-primary/5">
                <p className="text-gray-800">
                  <strong>Seus dados são criptografados usando criptografia avançada AES-256 e armazenados exclusivamente no seu dispositivo. 
                  Mesmo a empresa fornecedora não pode visualizar, acessar ou gerenciar qualquer informação inserida no aplicativo.</strong>
                </p>
                <p className="mt-2 text-gray-800">
                  <strong>Para sua privacidade e proteção, é essencial que você salve um backup criptografado em um local seguro
                  (como um pen drive, armazenamento em nuvem privado ou e-mail seguro). Em caso de perda do dispositivo ou exclusão do aplicativo,
                  seus dados não poderão ser recuperados sem este arquivo de backup. Você é totalmente responsável por armazenar seu backup
                  e senha em segurança.</strong>
                </p>
              </div>
              <div className="space-y-3">
                <p>
                  Este aplicativo é fornecido gratuitamente. Todos os dados são armazenados apenas no seu dispositivo.
                  A empresa não tem acesso às suas entradas.
                </p>
                <p>
                  Ao utilizar este aplicativo, você concorda com nossa política de privacidade e termos de uso.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-semibold mb-4">Detalhes da Privacidade</h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Armazenamento e Criptografia</h3>
                <p>
                  Todos os dados gerados pelo usuário (informações de propriedades, cálculos financeiros, notas) são armazenados exclusivamente no seu dispositivo usando:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>IndexedDB para plataformas web</li>
                  <li>SQLite + SecureStorage para plataformas móveis</li>
                </ul>
                <p>
                  Todos os dados armazenados localmente são protegidos usando criptografia AES-256. A chave de criptografia é derivada de uma combinação do seu ID de autenticação e uma senha local que você define.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Responsabilidade de Backup</h3>
                <p>
                  Como não armazenamos seus dados em nossos servidores, você é responsável por fazer backup dos seus dados para evitar perdas. O aplicativo fornece um recurso para exportar backups criptografados, que recomendamos fortemente que você use regularmente.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
