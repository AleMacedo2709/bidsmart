
# Guia do Usuário BidSmart

## Introdução

BidSmart é uma plataforma inteligente para gestão de investimentos imobiliários, especialmente focada em leilões. Ela permite que você acompanhe seus investimentos, calcule retornos e mantenha seus dados financeiros organizados.

## Como seus dados são armazenados

### Armazenamento Local Seguro

O BidSmart foi desenvolvido para priorizar sua privacidade e segurança:

- **Dados armazenados apenas localmente**: Todos os seus dados são armazenados exclusivamente no seu dispositivo (usando IndexedDB).
- **Criptografia de ponta**: Seus dados são criptografados usando algoritmos modernos (AES-256-GCM).
- **Nenhum dado enviado para servidores externos**: Não coletamos ou enviamos seus dados para nenhum servidor.
- **Verificação de integridade**: O sistema verifica constantemente a integridade dos dados para garantir que não foram corrompidos.

### Backup e Exportação

É altamente recomendável fazer backups regulares dos seus dados:

1. Acesse a página de **Backup** no menu lateral
2. Clique em "Exportar Backup"
3. Salve o arquivo exportado (formato .aeg) em um local seguro
4. Para restaurar seus dados, use a opção "Importar" na mesma página

## Principais Funcionalidades

### Dashboard

Visão geral dos seus investimentos, incluindo:
- Estatísticas importantes
- Próximos leilões
- Imóveis em destaque

### Imóveis

Gerenciamento completo do seu portfólio de imóveis:
- Adicionar novos imóveis
- Visualizar detalhes de cada propriedade
- Acompanhar status (ativo, em processo, vendido)
- Gerenciar documentos e informações financeiras

### Calculadora

Ferramentas para análise financeira:
- Cálculo de retorno sobre investimento (ROI)
- Simulação de cenários de investimento
- Análise de viabilidade

### Finanças

Análise detalhada das suas finanças:
- Métricas financeiras (investimento total, valor estimado, etc.)
- Gráficos de evolução de investimentos
- Distribuição do portfólio
- Análise de ROI por propriedade

## Perguntas Frequentes

### Como limpar todos os meus dados?

Para limpar todos os dados armazenados:
1. Abra as Ferramentas de Desenvolvedor do seu navegador (F12 ou Ctrl+Shift+I)
2. Vá para a aba "Aplicação" ou "Application"
3. No painel lateral, expanda "IndexedDB"
4. Encontre "RealEstateAuctionDB" e clique com o botão direito
5. Selecione "Excluir banco de dados" ou "Delete database"

### Os dados são sincronizados entre dispositivos?

Não. Como priorizamos sua privacidade, os dados são armazenados apenas localmente no dispositivo que você está usando. Para usar seus dados em outro dispositivo, utilize a funcionalidade de exportação e importação de backup.

### Como proteger meus dados?

- Faça backups regulares usando a funcionalidade de exportação
- Mantenha seu navegador atualizado
- Use um gerenciador de senhas para criar e armazenar senhas fortes
- Considere criptografar seu disco rígido para proteção adicional

### É possível compartilhar dados entre usuários?

O BidSmart foi projetado para uso individual. Para compartilhar informações específicas, você pode exportar os dados e compartilhar o arquivo de backup, mas isso compartilhará todos os dados da categoria exportada.

## Suporte e Contato

Para suporte técnico ou dúvidas sobre o aplicativo, entre em contato através de:
- Email: suporte@bidsmart.com.br
- Site: www.bidsmart.com.br/suporte
