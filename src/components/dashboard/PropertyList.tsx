
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { retrieveAllData, deleteData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import PropertyTable from './PropertyTable';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  notes?: string;
}

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
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
      const data = await retrieveAllData<PropertyData>('properties', encryptionKey);
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

  const handleDelete = async (id: string) => {
    try {
      await deleteData('properties', id);
      setProperties(properties.filter(prop => prop.id !== id));
      toast({
        title: "Imóvel Excluído",
        description: "O imóvel foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Falha ao excluir imóvel:', error);
      toast({
        title: "Erro ao Excluir",
        description: "Falha ao excluir o imóvel.",
        variant: "destructive",
      });
    } finally {
      setPropertyToDelete(null);
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
    ? searchFilteredProperties.filter(property => property.status === activeFilter)
    : searchFilteredProperties;

  const addNewProperty = () => {
    navigate('/add-property');
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex justify-end">
        <Button
          onClick={addNewProperty}
          className="rounded-md flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Adicionar Imóvel
        </Button>
      </div>

      <div className="bg-white border rounded-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Gerenciar Imóveis</h2>
          <div className="w-full max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Pesquisar imóveis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
          
        <div className="border-b p-1 px-2 flex">
          {['Todos', 'Ativos', 'Em Processo', 'Vendidos'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter === 'Ativos' ? 'Ativo' : 
                               filter === 'Vendidos' ? 'Vendido' : filter)}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                (activeFilter === filter || 
                 (filter === 'Ativos' && activeFilter === 'Ativo') ||
                 (filter === 'Vendidos' && activeFilter === 'Vendido'))
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
            <PropertyTable 
              properties={filteredProperties}
              onView={(id) => navigate(`/property/${id}`)}
              onDelete={(id) => setPropertyToDelete(id)}
            />
          </div>
        )}
      </div>

      <AlertDialog open={!!propertyToDelete} onOpenChange={() => setPropertyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              imóvel e removerá os dados do seu dispositivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => propertyToDelete && handleDelete(propertyToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PropertyList;
