
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

interface SimulationData {
  id: string;
  name: string;
  date: string;
  notes?: string;
  results: {
    netProfit: number;
    roi: number;
  };
}

// Converting simulation data to property format for display
const mapSimulationToProperty = (simulation: SimulationData) => {
  // Extract address from name or use default
  const nameParts = simulation.name.split(' - ');
  const address = nameParts[0] || simulation.name;
  const cityState = nameParts[1]?.split(', ') || ['São Paulo', 'SP'];
  
  return {
    id: simulation.id,
    name: simulation.name,
    address: address,
    city: cityState[0] || 'São Paulo',
    state: cityState[1] || 'SP',
    type: 'Apartamento',
    status: 'Ativo',
    purchaseDate: new Date(simulation.date).toLocaleDateString('pt-BR'),
    purchasePrice: simulation.results.netProfit * 2, // Placeholder calculation
    estimatedValue: simulation.results.netProfit * 3, // Placeholder calculation
  };
};

const PropertyList: React.FC = () => {
  const [simulations, setSimulations] = useState<SimulationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [simulationToDelete, setSimulationToDelete] = useState<string | null>(null);
  const { encryptionKey } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSimulations();
  }, [encryptionKey]);

  const loadSimulations = async () => {
    if (!encryptionKey) return;

    try {
      setIsLoading(true);
      const data = await retrieveAllData<SimulationData>('simulations', encryptionKey);
      setSimulations(data);
    } catch (error) {
      console.error('Failed to load simulations:', error);
      toast({
        title: "Erro ao Carregar Dados",
        description: "Falha ao carregar suas simulações salvas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteData('simulations', id);
      setSimulations(simulations.filter(sim => sim.id !== id));
      toast({
        title: "Simulação Excluída",
        description: "A simulação foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Failed to delete simulation:', error);
      toast({
        title: "Erro ao Excluir",
        description: "Falha ao excluir a simulação.",
        variant: "destructive",
      });
    } finally {
      setSimulationToDelete(null);
    }
  };

  const properties = simulations.map(mapSimulationToProperty);
  
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

  const newCalculation = () => {
    navigate('/calculator');
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gerenciar Imóveis</h2>
            <div className="w-full max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Pesquisar imóveis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg">
            <div className="flex border-b p-0.5">
              {['Todos', 'Ativos', 'Em Processo', 'Vendidos'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Carregando suas propriedades...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  {searchTerm 
                    ? "Nenhuma propriedade encontrada com os critérios de busca." 
                    : "Você ainda não possui imóveis cadastrados."}
                </p>
                <Button onClick={newCalculation} className="mt-4">
                  Adicionar Imóvel
                </Button>
              </div>
            ) : (
              <PropertyTable 
                properties={filteredProperties}
                onView={(id) => navigate(`/property/${id}`)}
                onDelete={(id) => setSimulationToDelete(id)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10">
        <Button
          onClick={newCalculation}
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <AlertDialog open={!!simulationToDelete} onOpenChange={() => setSimulationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              propriedade e removerá os dados do seu dispositivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => simulationToDelete && handleDelete(simulationToDelete)}
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
