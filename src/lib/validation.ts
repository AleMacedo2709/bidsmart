
/**
 * Sistema de validação de entradas e formulários
 * 
 * Este módulo fornece funções para validar dados de entrada,
 * garantindo que estejam em conformidade com os requisitos do sistema.
 */

import * as z from 'zod';
import { hashValue } from './encryption/utils';

// Esquema para validação de propriedades imobiliárias
export const propertySchema = z.object({
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().optional(),
  type: z.enum(["Apartamento", "Casa", "Terreno", "Comercial", "Rural"]),
  status: z.enum(["Ativo", "Em Processo", "Vendido"]),
  purchaseDate: z.string(),
  purchasePrice: z.number().positive("Preço deve ser positivo"),
  estimatedValue: z.number().positive("Valor estimado deve ser positivo"),
  description: z.string().optional(),
  documents: z.array(z.object({
    name: z.string(),
    type: z.string(),
    url: z.string().optional(),
    content: z.string().optional(),
  })).optional()
});

// Esquema para validação de dados do usuário
export const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres")
    .refine(
      (password) => {
        // Validar requisitos de complexidade
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      },
      {
        message: "Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
      }
    )
});

// Esquema para validação de dados financeiros
export const financialSchema = z.object({
  amount: z.number().positive("Valor deve ser positivo"),
  type: z.enum(["Entrada", "Investimento", "Retorno", "Despesa"]),
  date: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  relatedProperty: z.string().optional()
});

// Validação de arquivos importados
export const validateImportFile = async (fileContent: string): Promise<{
  isValid: boolean;
  reason?: string;
  hash?: string;
}> => {
  try {
    // Verificar se o conteúdo tem o formato esperado
    const firstNewline = fileContent.indexOf('\n');
    if (firstNewline === -1) {
      return { 
        isValid: false, 
        reason: "Formato de arquivo inválido: cabeçalho não encontrado" 
      };
    }
    
    const headerString = fileContent.substring(0, firstNewline);
    const header = JSON.parse(headerString);
    
    // Verificar se o cabeçalho tem o formato correto
    if (header.format !== "AEG-EXPORT" || !header.version) {
      return { 
        isValid: false, 
        reason: "Formato de arquivo inválido: cabeçalho não reconhecido" 
      };
    }
    
    // Calcular hash do conteúdo para verificação
    const contentHash = await hashValue(fileContent);
    
    return { 
      isValid: true,
      hash: contentHash
    };
  } catch (error) {
    return { 
      isValid: false, 
      reason: `Erro na validação: ${(error as Error).message}` 
    };
  }
};

// Sanitização de entradas para evitar XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;");
};

// Validação de campos sensíveis
export const validateSensitiveField = async (
  value: string,
  expectedHash?: string
): Promise<boolean> => {
  if (!value) return false;
  
  // Se não houver hash esperado, apenas verificar se o valor existe
  if (!expectedHash) return true;
  
  // Calcular o hash do valor e comparar com o esperado
  const valueHash = await hashValue(value);
  return valueHash === expectedHash;
};
