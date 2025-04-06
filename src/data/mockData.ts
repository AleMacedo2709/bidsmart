
// Mock data for properties
export const mockProperties = [
  {
    id: '1',
    name: 'Apartamento 45',
    address: 'Rua das Flores, 123 - Apto 45',
    city: 'São Paulo',
    state: 'SP',
    type: 'Apartamento',
    status: 'Ativo',
    purchaseDate: '14/02/2024',
    purchasePrice: 280000,
    estimatedValue: 380000,
    saleValue: 380000,
    notes: 'Apartamento bem localizado com 2 quartos e 1 vaga de garagem.'
  },
  {
    id: '2',
    name: 'Casa 3',
    address: 'Av. Atlântica, 500 - Casa 3',
    city: 'Rio de Janeiro',
    state: 'RJ',
    type: 'Casa',
    status: 'Em Processo',
    purchaseDate: '19/11/2023',
    purchasePrice: 450000,
    estimatedValue: 620000,
    saleValue: 620000,
    notes: 'Casa com 3 quartos, 2 banheiros e área de lazer.'
  },
  {
    id: '3',
    name: 'Lote 12',
    address: 'Rua Alphaville, 789 - Lote 12',
    city: 'Barueri',
    state: 'SP',
    type: 'Terreno',
    status: 'Ativo',
    purchaseDate: '04/01/2024',
    purchasePrice: 320000,
    estimatedValue: 390000,
    saleValue: 390000,
    notes: 'Terreno plano com 250m² em condomínio fechado.'
  },
  {
    id: '4',
    name: 'Apartamento 102',
    address: 'Rua Paraíso, 321 - Apto 102',
    city: 'São Paulo',
    state: 'SP',
    type: 'Apartamento',
    status: 'Vendido',
    purchaseDate: '09/08/2023',
    purchasePrice: 350000,
    estimatedValue: 420000,
    saleValue: 420000,
    notes: 'Apartamento com 3 quartos, varanda e área de serviço.'
  },
  {
    id: '5',
    name: 'Casa 7',
    address: 'Av. Beira Mar, 1500 - Casa 7',
    city: 'Florianópolis',
    state: 'SC',
    type: 'Casa',
    status: 'Ativo',
    purchaseDate: '14/12/2023',
    purchasePrice: 520000,
    estimatedValue: 680000,
    saleValue: 680000,
    notes: 'Casa de praia com 4 quartos, vista para o mar e piscina.'
  }
];

// Mock data for financial information
export const mockFinancialData = {
  totalInvestment: 1920000,
  totalEstimatedValue: 2490000,
  totalRevenue: 420000,
  roi: 29.69,
  properties: {
    active: 3,
    inProcess: 1,
    sold: 1
  },
  monthlyData: [
    { month: 'Jan', investment: 320000, value: 390000 },
    { month: 'Fev', investment: 280000, value: 380000 },
    { month: 'Mar', investment: 0, value: 0 },
    { month: 'Abr', investment: 0, value: 0 },
    { month: 'Mai', investment: 0, value: 0 },
    { month: 'Jun', investment: 0, value: 0 },
    { month: 'Jul', investment: 0, value: 0 },
    { month: 'Ago', investment: 350000, value: 420000 },
    { month: 'Set', investment: 0, value: 0 },
    { month: 'Out', investment: 0, value: 0 },
    { month: 'Nov', investment: 450000, value: 620000 },
    { month: 'Dez', investment: 520000, value: 680000 }
  ]
};

// Mock data for upcoming auctions
export const mockAuctions = [
  {
    id: '1',
    name: 'Leilão Caixa Econômica Federal',
    date: '15/04/2024',
    location: 'São Paulo, SP',
    properties: 24,
    description: 'Leilão de imóveis da Caixa Econômica Federal com diversos apartamentos e casas em São Paulo.'
  },
  {
    id: '2',
    name: 'Leilão Banco do Brasil',
    date: '22/04/2024',
    location: 'Belo Horizonte, MG',
    properties: 12,
    description: 'Leilão de imóveis do Banco do Brasil com propriedades em Minas Gerais.'
  },
  {
    id: '3',
    name: 'Leilão Judicial Rio de Janeiro',
    date: '28/04/2024',
    location: 'Rio de Janeiro, RJ',
    properties: 8,
    description: 'Leilão judicial com imóveis localizados na região metropolitana do Rio de Janeiro.'
  },
  {
    id: '4',
    name: 'Leilão Santander',
    date: '05/05/2024',
    location: 'Curitiba, PR',
    properties: 15,
    description: 'Leilão de imóveis do Santander com diversas opções em Curitiba e região.'
  }
];

// Mock user data
export const mockUserData = {
  name: 'Carlos Silva',
  email: 'carlos.silva@example.com',
  phone: '(11) 98765-4321',
  notifications: {
    emailAlerts: true,
    auctionAlerts: true,
    monthlyReports: false
  }
};
