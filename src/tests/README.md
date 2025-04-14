
# BidSmart - Testes de Qualidade e Segurança

Este diretório contém os testes automatizados para o sistema BidSmart, garantindo o correto funcionamento, segurança e experiência do usuário.

## Estrutura de Testes

Os testes estão organizados em três categorias principais:

### 1. Testes de Fluxo de Dados (`data-flow.test.ts`)

Validam o funcionamento correto do armazenamento local, criptografia e persistência de dados:
- Armazenamento e recuperação de dados
- Atualização de registros
- Exclusão segura
- Integridade da base de dados
- Exportação e importação de backups

### 2. Testes de Experiência do Usuário (`user-experience.test.ts`)

Validam fluxos de trabalho e interações do usuário:
- Dashboard e navegação
- Backup e restauração de dados
- Fluxos de cadastro de imóveis
- Exibição de informações financeiras

### 3. Testes de Segurança (`security.test.ts`)

Validam os mecanismos de proteção implementados:
- Criptografia AES-256-GCM
- Geração e derivação segura de chaves
- Integridade de dados
- Resistência a adulterações
- Validação de força de senhas

## Executando os Testes

Para executar todos os testes:

```bash
npm run test
```

Para executar uma categoria específica:

```bash
npm run test -- src/tests/security.test.ts
```

## Resultados e Relatórios

Após a execução dos testes, um relatório é gerado indicando:
- Taxa de sucesso/falha
- Cobertura de código
- Potenciais vulnerabilidades

## Padrões de Segurança Implementados

Os testes validam a conformidade com padrões de segurança:

- **Criptografia**: AES-256-GCM para todos os dados armazenados
- **Derivação de chaves**: PBKDF2 com 310.000 iterações (recomendação OWASP)
- **Verificação de integridade**: Hash SHA-256 para cada registro
- **Proteção contra adulteração**: Verificação de dados antes da decodificação
- **Segurança do backup**: Arquivos de exportação criptografados e validados

