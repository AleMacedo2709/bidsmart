
/**
 * Testes de fluxo de dados do BidSmart
 * 
 * Estes testes verificam o correto funcionamento do armazenamento local,
 * criptografia e integridade dos dados em diferentes cenários.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initDB } from '../lib/storage/db';
import { 
  storeData, 
  retrieveData, 
  updateData, 
  deleteData, 
  retrieveAllData 
} from '../lib/storage/crud';
import { 
  encryptData, 
  decryptData 
} from '../lib/encryption/crypto';
import { deriveKey, generateTempKey } from '../lib/encryption/keys';
import { verifyDatabaseIntegrity } from '../lib/storage/integrity';
import { exportStoreData, importStoreData } from '../lib/storage/export-import';

// Mock IndexedDB
const indexedDBMock = {
  open: vi.fn(),
  deleteDatabase: vi.fn()
};

// Dados de teste
const testProperty = {
  address: 'Av. Paulista, 1000',
  city: 'São Paulo',
  state: 'SP',
  type: 'Apartamento',
  status: 'Ativo',
  purchaseDate: '2023-05-15',
  purchasePrice: 850000,
  estimatedValue: 950000
};

// Definindo tipos para as funções mockadas
type MockFunction<T = any> = T & { mockImplementation: (fn: any) => any };

// Tipagem para as funções de storage
interface StorageFunctions {
  storeData: <T>(store: string, data: T, key: CryptoKey) => Promise<string>;
  retrieveData: <T>(store: string, id: string, key: CryptoKey) => Promise<T>;
  updateData: <T>(store: string, id: string, data: T, key: CryptoKey) => Promise<void>;
  deleteData: (store: string, id: string) => Promise<void>;
  retrieveAllData: <T>(store: string, key: CryptoKey) => Promise<T[]>;
  exportStoreData: (store: string, key: CryptoKey) => Promise<string>;
  importStoreData: (store: string, data: string, key: CryptoKey) => Promise<void>;
  verifyDatabaseIntegrity: (key: CryptoKey) => Promise<{valid: boolean}>;
}

describe('Fluxo de dados completo', () => {
  let encryptionKey: CryptoKey;
  
  beforeEach(async () => {
    // Configure mocks
    global.indexedDB = indexedDBMock as any;
    
    // Generate a test encryption key
    encryptionKey = await generateTempKey();
    
    // Mock transaction and object store
    const mockObjectStore = {
      add: vi.fn().mockImplementation(() => ({
        onsuccess: null,
        onerror: null
      })),
      put: vi.fn().mockImplementation(() => ({
        onsuccess: null,
        onerror: null
      })),
      get: vi.fn().mockImplementation(() => ({
        onsuccess: null,
        onerror: null,
        result: { data: 'mockEncryptedData', integrityHash: 'mockHash' }
      })),
      getAll: vi.fn().mockImplementation(() => ({
        onsuccess: null,
        onerror: null,
        result: [{ data: 'mockEncryptedData', integrityHash: 'mockHash' }]
      })),
      delete: vi.fn().mockImplementation(() => ({
        onsuccess: null,
        onerror: null
      })),
      clear: vi.fn().mockImplementation(() => ({
        onsuccess: null,
        onerror: null
      }))
    };
    
    const mockTransaction = {
      objectStore: vi.fn().mockReturnValue(mockObjectStore),
      oncomplete: null
    };
    
    const mockDB = {
      transaction: vi.fn().mockReturnValue(mockTransaction),
      close: vi.fn()
    };
    
    // Mock initDB to return our mockDB
    vi.spyOn(initDB, 'implementation').mockResolvedValue(mockDB as any);
    
    // Mock crypto functions to avoid actual encryption/decryption
    vi.spyOn(encryptData, 'implementation').mockResolvedValue('mockEncryptedData');
    vi.spyOn(decryptData, 'implementation').mockResolvedValue(testProperty);
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('Deve armazenar e recuperar dados corretamente', async () => {
    // Test full data flow: Store -> Retrieve -> Verify
    const id = await (storeData as StorageFunctions['storeData'])('properties', testProperty, encryptionKey);
    expect(id).toBeDefined();
    
    const retrievedData = await (retrieveData as StorageFunctions['retrieveData'])('properties', id, encryptionKey);
    expect(retrievedData).toEqual(expect.objectContaining({
      address: testProperty.address,
      city: testProperty.city
    }));
  });

  it('Deve atualizar dados preservando a integridade', async () => {
    // Store initial data
    const id = await (storeData as StorageFunctions['storeData'])('properties', testProperty, encryptionKey);
    
    // Update the data
    const updatedProperty = {
      ...testProperty,
      estimatedValue: 1000000
    };
    
    await (updateData as StorageFunctions['updateData'])('properties', id, updatedProperty, encryptionKey);
    
    // Retrieve and verify the update
    const retrievedData = await (retrieveData as StorageFunctions['retrieveData'])('properties', id, encryptionKey);
    expect(retrievedData).toEqual(expect.objectContaining({
      estimatedValue: 1000000
    }));
  });

  it('Deve verificar a integridade da base de dados', async () => {
    // Setup some test data
    await (storeData as StorageFunctions['storeData'])('properties', testProperty, encryptionKey);
    
    // Test database integrity check
    const integrityResult = await (verifyDatabaseIntegrity as StorageFunctions['verifyDatabaseIntegrity'])(encryptionKey);
    expect(integrityResult.valid).toBe(true);
  });

  it('Deve exportar e importar dados mantendo a integridade', async () => {
    // Store test data
    await (storeData as StorageFunctions['storeData'])('properties', testProperty, encryptionKey);
    
    // Export data
    const exportedData = await (exportStoreData as StorageFunctions['exportStoreData'])('properties', encryptionKey);
    expect(exportedData).toBeDefined();
    
    // Clear database and import data back
    await (deleteData as StorageFunctions['deleteData'])('properties', 'test-id');
    await (importStoreData as StorageFunctions['importStoreData'])('properties', exportedData, encryptionKey);
    
    // Verify imported data
    const allData = await (retrieveAllData as StorageFunctions['retrieveAllData'])('properties', encryptionKey);
    expect(allData.length).toBeGreaterThan(0);
  });
});
