
/**
 * Testes de experiência do usuário para BidSmart
 * 
 * Testes que simulam interações do usuário para validar
 * fluxos de trabalho e usabilidade.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Backup from '../pages/Backup';
import { AuthProvider } from '../components/auth/AuthProvider';

// Mock Auth Provider values
vi.mock('../components/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-auth-provider">{children}</div>
  ),
  useAuth: () => ({
    isAuthenticated: true,
    user: { displayName: 'Teste' },
    encryptionKey: 'mock-key',
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn()
  })
}));

// Mock components that might cause problems in tests
vi.mock('../components/dashboard/AuctionList', () => ({
  default: () => <div data-testid="mock-auction-list">Leilões mockados</div>
}));

vi.mock('../components/dashboard/FeaturedProperties', () => ({
  default: () => <div data-testid="mock-featured-properties">Imóveis em destaque mockados</div>
}));

describe('Experiência do Usuário - Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Deve exibir informações relevantes no dashboard', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Verifique se os componentes principais estão presentes
    expect(screen.getByText(/Olá/i)).toBeInTheDocument();
    
    // Verifique se os cards de estatísticas estão presentes
    const statCards = screen.getAllByRole('article');
    expect(statCards.length).toBeGreaterThanOrEqual(4);
    
    // Verifique se as seções de leilões e propriedades em destaque estão presentes
    expect(screen.getByTestId('mock-auction-list')).toBeInTheDocument();
    expect(screen.getByTestId('mock-featured-properties')).toBeInTheDocument();
  });

  it('Deve permitir navegação para outras páginas', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const addPropertyButton = screen.getByRole('link', { name: /Adicionar Imóvel/i });
    expect(addPropertyButton).toBeInTheDocument();
    expect(addPropertyButton.getAttribute('href')).toBe('/imoveis/adicionar');
  });
});

describe('Experiência do Usuário - Backup e Restauração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock File API
    global.URL.createObjectURL = vi.fn();
    global.URL.revokeObjectURL = vi.fn();
  });

  it('Deve exibir opções de backup e importação', async () => {
    render(
      <MemoryRouter>
        <Backup />
      </MemoryRouter>
    );

    // Verifique se as opções principais estão presentes
    expect(screen.getByText(/Backup de Dados/i)).toBeInTheDocument();
    expect(screen.getByText(/Exportar Dados/i)).toBeInTheDocument();
    expect(screen.getByText(/Importar Dados/i)).toBeInTheDocument();
    
    // Verifique se os botões de ação estão presentes
    expect(screen.getByText(/Exportar Backup/i)).toBeInTheDocument();
    expect(screen.getByText(/Selecionar Arquivo de Backup/i)).toBeInTheDocument();
  });

  it('Deve mostrar alerta sobre a importância dos backups', async () => {
    render(
      <MemoryRouter>
        <Backup />
      </MemoryRouter>
    );

    // Verifique se o alerta de segurança está presente
    expect(screen.getByText(/Importante/i)).toBeInTheDocument();
    expect(screen.getByText(/Sempre mantenha seus backups em local seguro/i)).toBeInTheDocument();
  });
});
