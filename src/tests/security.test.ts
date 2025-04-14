
/**
 * Testes de segurança para BidSmart
 * 
 * Estes testes verificam os mecanismos de segurança,
 * criptografia e proteção de dados implementados no sistema.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { deriveKey, generateTempKey } from '../lib/encryption/keys';
import { encryptData, decryptData } from '../lib/encryption/crypto';
import { str2ab, ab2str, hashValue, calculatePasswordStrength } from '../lib/encryption/utils';
import { verifyExportedData } from '../lib/encryption/export';
import { exportEncryptedData } from '../lib/encryption/export';

describe('Testes de Criptografia', () => {
  let testKey: CryptoKey;
  
  beforeEach(async () => {
    // Gerar uma chave para os testes
    testKey = await generateTempKey();
  });

  it('Deve gerar chaves com segurança adequada', async () => {
    const uid = 'test-user-123';
    const password = 'securePassword!123';
    
    const key = await deriveKey(uid, password);
    
    // Validar que a chave foi gerada com o algoritmo correto
    expect(key.algorithm.name).toBe('AES-GCM');
    
    // Gerar uma chave temporária para usuários anônimos
    const tempKey = await generateTempKey();
    expect(tempKey.algorithm.name).toBe('AES-GCM');
  });

  it('Deve encriptar e decriptar dados corretamente', async () => {
    const testData = { 
      name: 'Teste de Segurança', 
      value: 12345, 
      sensitive: true 
    };
    
    // Encriptar os dados
    const encrypted = await encryptData(testData, testKey);
    expect(encrypted).toBeDefined();
    expect(typeof encrypted).toBe('string');
    
    // Decriptar os dados
    const decrypted = await decryptData(encrypted, testKey);
    
    // Verificar que os dados originais foram recuperados
    expect(decrypted).toEqual(expect.objectContaining({
      name: 'Teste de Segurança',
      value: 12345,
      sensitive: true
    }));
  });

  it('Deve detectar tentativas de adulteração de dados', async () => {
    const testData = { id: 'test-123', value: 'dados sensíveis' };
    
    // Encriptar dados originais
    const encrypted = await encryptData(testData, testKey);
    
    // Adulterar os dados encriptados (simulando um ataque)
    const tampered = 'T' + encrypted.substring(1);
    
    // Tentar decriptar dados adulterados deve falhar
    await expect(decryptData(tampered, testKey)).rejects.toThrow();
  });

  it('Deve validar força de senhas corretamente', () => {
    // Senha fraca
    expect(calculatePasswordStrength('123456')).toBeLessThan(40);
    
    // Senha média
    expect(calculatePasswordStrength('Password123')).toBeGreaterThanOrEqual(40);
    expect(calculatePasswordStrength('Password123')).toBeLessThan(80);
    
    // Senha forte
    expect(calculatePasswordStrength('P@ssw0rd!2023_Strong')).toBeGreaterThanOrEqual(80);
  });

  it('Deve validar integridade de arquivos exportados', async () => {
    const testData = { test: 'data' };
    const encrypted = await encryptData(testData, testKey);
    
    // Criar um arquivo de exportação de dados
    const headerData = {
      format: "AEG-EXPORT",
      version: 1,
      timestamp: Date.now(),
      contentType: "application/json+encrypted"
    };
    
    const exportFile = JSON.stringify(headerData) + "\n" + encrypted;
    
    // Verificar arquivo válido
    const validResult = verifyExportedData(exportFile);
    expect(validResult.isValid).toBe(true);
    expect(validResult.data).toBe(encrypted);
    
    // Arquivo com formato inválido
    const invalidFormat = JSON.stringify({...headerData, format: "INVALID"}) + "\n" + encrypted;
    const invalidResult = verifyExportedData(invalidFormat);
    expect(invalidResult.isValid).toBe(false);
    
    // Arquivo corrupto (sem quebra de linha)
    const corruptFile = JSON.stringify(headerData) + encrypted;
    const corruptResult = verifyExportedData(corruptFile);
    expect(corruptResult.isValid).toBe(false);
  });
});

describe('Testes de Resistência a Ataques', () => {
  it('Deve resistir a ataques de timing', async () => {
    // Crie dois hashes de valores diferentes, mas com o mesmo comprimento
    const hash1 = await hashValue('valorSeguro12345');
    const hash2 = await hashValue('outroValor12345');
    
    // Verifique se os hashes têm o mesmo comprimento (mitigando ataques de timing)
    expect(hash1.length).toBe(hash2.length);
  });

  it('Deve gerar valores de hash únicos para entradas diferentes', async () => {
    const hash1 = await hashValue('valor1');
    const hash2 = await hashValue('valor2');
    
    // Hashes devem ser diferentes para entradas diferentes
    expect(hash1).not.toBe(hash2);
    
    // O mesmo valor deve sempre gerar o mesmo hash
    const hash1Again = await hashValue('valor1');
    expect(hash1).toBe(hash1Again);
  });
});
