
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { retrieveAllData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import PropertiesTable from './PropertiesTable';

interface PropertyData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
  status: string;
  purchaseDate: string;
  purchasePrice: number;
  estimatedValue: number;
  saleValue?: number;
  notes?: string;
}

const PropertyManager: React.FC = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const { encryptionKey } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, [encryptionKey]);

  const loadProperties = async () => {
    if (!encryptionKey) return;

    try {
      setIsLoading(true);
      let data = await retrieveAllData<PropertyData>('properties', encryptionKey);
      
      // Add saleValue if not present (for backward compatibility)
      data = data.map(property => ({
        ...property,
        saleValue: property.saleValue || property.estimatedValue
      }));
      
      setProperties(data);
    } catch (error) {
      console.error('Falha ao carregar imóveis:', error);
      toast({
        title: "Erro ao Carregar Dados",
        description: "Falha ao carregar seus imóveis salvos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply search filter
  const searchFilteredProperties = searchTerm
    ? properties.filter(property => 
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : properties;
    
  // Apply status filter
  const filteredProperties = activeFilter !== 'Todos'
    ? searchFilteredProperties.filter(property => 
        activeFilter === 'Ativos' ? property.status === 'Ativo' :
        activeFilter === 'Em Processo' ? property.status === 'Em Processo' :
        activeFilter === 'Vendidos' ? property.status === 'Vendido' : true
      )
    : searchFilteredProperties;

  const addNewProperty = () => {
    navigate('/add-property');
  };

  return (
    <div className="bg-white border rounded-lg">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-semibold">Gerenciar Imóveis</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Pesquisar imóveis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={addNewProperty}
            className="rounded-md flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Adicionar Imóvel
          </Button>
        </div>
      </div>
          
      <div className="border-b p-1 px-2 flex">
        {['Todos', 'Ativos', 'Em Processo', 'Vendidos'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === filter 
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
            
      {isLoading ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">Carregando seus imóveis...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            {searchTerm 
              ? "Nenhum imóvel encontrado com os critérios de busca." 
              : "Você ainda não possui imóveis cadastrados."}
          </p>
          <Button onClick={addNewProperty} className="mt-4">
            Adicionar Imóvel
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <PropertiesTable 
            properties={filteredProperties}
            onView={(id) => navigate(`/property/${id}`)}
            onDelete={(id) => navigate(`/property/${id}`)}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyManager;
