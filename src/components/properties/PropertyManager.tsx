import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PropertiesTable from './PropertiesTable';
import { mockProperties } from '@/data/mockData';
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
import { useAuth } from '@/components/auth/AuthProvider';
import * as XLSX from 'xlsx';

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
  const [properties, setProperties] = useState<PropertyData[]>(mockProperties);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { encryptionKey } = useAuth();

  const searchFilteredProperties = searchTerm
    ? properties.filter(property => 
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : properties;
    
  const filteredProperties = activeFilter !== 'Todos'
    ? searchFilteredProperties.filter(property => 
        activeFilter === 'Ativos' ? property.status === 'Ativo' :
        activeFilter === 'Em Processo' ? property.status === 'Em Processo' :
        activeFilter === 'Vendidos' ? property.status === 'Vendido' : true
      )
    : searchFilteredProperties;

  const addNewProperty = () => {
    toast({
      title: "Adicionar imóvel",
      description: "Você será redirecionado para o formulário de adição de imóvel.",
    });
    navigate('/imoveis/adicionar');
  };

  const handleView = (id: string) => {
    const propertyToView = properties.find(prop => prop.id === id);
    if (propertyToView) {
      localStorage.setItem('currentViewProperty', JSON.stringify(propertyToView));
    }
    
    toast({
      title: "Visualizando imóvel",
      description: `Visualizando detalhes do imóvel ID: ${id}`,
    });
    
    navigate(`/imoveis/${id}`);
  };

  const handleEdit = (id: string) => {
    const propertyToEdit = properties.find(prop => prop.id === id);
    if (propertyToEdit) {
      localStorage.setItem('currentViewProperty', JSON.stringify(propertyToEdit));
    }
    
    navigate(`/imoveis/${id}`);
  };

  const handleDelete = (id: string) => {
    setProperties(properties.filter(property => property.id !== id));
    setPropertyToDelete(null);
    
    toast({
      title: "Imóvel excluído",
      description: "O imóvel foi excluído com sucesso.",
    });
  };

  const exportData = async () => {
    try {
      setIsExporting(true);
      
      const excelData = filteredProperties.map(property => ({
        Endereço: property.address,
        Cidade: property.city,
        Estado: property.state,
        Tipo: property.type,
        Status: property.status,
        'Data de Compra': property.purchaseDate,
        'Valor de Compra': property.purchasePrice,
        'Valor Estimado': property.estimatedValue,
        'Valor de Venda': property.saleValue || '',
        Notas: property.notes || ''
      }));
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Imóveis');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'imoveis-export.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação concluída",
        description: "Os dados dos imóveis foram exportados em Excel com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados para Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
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
            variant="outline"
            size="sm"
            onClick={exportData}
            isLoading={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
          <Button
            onClick={addNewProperty}
            className="gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
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
            onView={handleView}
            onDelete={(id) => setPropertyToDelete(id)}
            onEdit={handleEdit}
          />
        </div>
      )}
      
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

export default PropertyManager;
