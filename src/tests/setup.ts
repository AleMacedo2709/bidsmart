
/**
 * Configuração para testes
 * 
 * Este arquivo configura o ambiente de testes com mocks necessários
 * para APIs do navegador que não estão disponíveis no ambiente de teste.
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock para a API Web Crypto
const cryptoMock = {
  subtle: {
    encrypt: vi.fn(),
    decrypt: vi.fn(),
    importKey: vi.fn(),
    exportKey: vi.fn(),
    generateKey: vi.fn().mockImplementation(() => Promise.resolve({
      algorithm: { name: 'AES-GCM' },
      extractable: false,
      type: 'secret',
      usages: ['encrypt', 'decrypt']
    })),
    deriveKey: vi.fn().mockImplementation(() => Promise.resolve({
      algorithm: { name: 'AES-GCM' },
      extractable: false,
      type: 'secret',
      usages: ['encrypt', 'decrypt']
    })),
    digest: vi.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(32)))
  },
  getRandomValues: vi.fn().mockImplementation((array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
  randomUUID: vi.fn().mockImplementation(() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  })
};

// Mock para IndexedDB
const indexedDBMock = {
  open: vi.fn().mockImplementation(() => {
    return {
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
      result: {
        createObjectStore: vi.fn(),
        objectStoreNames: {
          contains: vi.fn().mockReturnValue(true)
        },
        transaction: vi.fn().mockImplementation(() => ({
          objectStore: vi.fn().mockImplementation(() => ({
            put: vi.fn(),
            add: vi.fn(),
            get: vi.fn(),
            getAll: vi.fn(),
            delete: vi.fn(),
            clear: vi.fn(),
            createIndex: vi.fn()
          })),
          oncomplete: null
        })),
        close: vi.fn()
      }
    };
  }),
  deleteDatabase: vi.fn()
};

// Mock para localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Configurar mocks globais
global.crypto = cryptoMock as any;
global.indexedDB = indexedDBMock as any;
global.localStorage = localStorageMock as any;
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

// Mock para o objeto File
global.File = class MockFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;

  constructor(parts: any[], filename: string, options: any = {}) {
    this.name = filename;
    this.size = 1024;
    this.type = options.type || '';
    this.lastModified = Date.now();
  }

  text() {
    return Promise.resolve('mock file content');
  }
} as any;

// Silenciar erros de console durante os testes
console.error = vi.fn();
console.warn = vi.fn();

// Resetar todos os mocks após cada teste
afterEach(() => {
  vi.clearAllMocks();
});
