
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Backup from '../pages/Backup';
import { AuthProvider } from '../components/auth/AuthProvider';

// Mock do provedor de autenticação com valores em português
vi.mock('../components/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-provedor-autenticacao">{children}</div>
  ),
  useAuth: () => ({
    isAuthenticated: true,
    user: { displayName: 'Usuário Teste' },
    encryptionKey: 'chave-mock',
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn()
  })
}));

// Mock de componentes para testes
vi.mock('../components/dashboard/AuctionList', () => ({
  default: () => <div data-testid="lista-leiloes-mock">Leilões mockados</div>
}));

vi.mock('../components/dashboard/FeaturedProperties', () => ({
  default: () => <div data-testid="propriedades-destaque-mock">Imóveis em destaque mockados</div>
}));

describe('Experiência do Usuário - Painel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Deve exibir informações relevantes no painel', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Verifique se os componentes principais estão presentes
    expect(screen.getByText(/Olá/i)).toBeInTheDocument();
    
    // Verifique se os cartões de estatísticas estão presentes
    const cartõesEstatísticas = screen.getAllByRole('article');
    expect(cartõesEstatísticas.length).toBeGreaterThanOrEqual(4);
    
    // Verifique se as seções de leilões e propriedades em destaque estão presentes
    expect(screen.getByTestId('lista-leiloes-mock')).toBeInTheDocument();
    expect(screen.getByTestId('propriedades-destaque-mock')).toBeInTheDocument();
  });

  it('Deve permitir navegação para outras páginas', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const botãoAdicionarImóvel = screen.getByRole('link', { name: /Adicionar Imóvel/i });
    expect(botãoAdicionarImóvel).toBeInTheDocument();
    expect(botãoAdicionarImóvel.getAttribute('href')).toBe('/imoveis/adicionar');
  });
});

describe('Experiência do Usuário - Backup e Restauração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock da API de arquivos
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
