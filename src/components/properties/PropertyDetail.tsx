
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Banknote, Home, MapPin, Calendar, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { retrieveData, updateData } from '@/lib/storage';
import { formatCurrency } from '@/lib/calculations';
import PropertyFinanceForm from './PropertyFinanceForm';
import { mockProperties } from '@/data/mockData';

interface PropertyDetailProps {
  propertyId: string;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ propertyId }) => {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { encryptionKey } = useAuth();
  const { id } = useParams(); // Get the ID from URL params

  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        setLoading(true);
        
        // First try to get from localStorage (for demo purposes)
        const storedProperty = localStorage.getItem('currentViewProperty');
        if (storedProperty) {
          setProperty(JSON.parse(storedProperty));
          setLoading(false);
          return;
        }
        
        // If not in localStorage, try to fetch from IndexedDB if encryption key exists
        if (encryptionKey) {
          try {
            const fetchedProperty = await retrieveData('properties', propertyId, encryptionKey);
            if (fetchedProperty) {
              setProperty(fetchedProperty);
              return;
            }
          } catch (error) {
            console.log('No stored property found, falling back to mock data');
          }
        }
        
        // As a fallback for demo, use mock data
        const mockProperty = mockProperties.find(p => p.id === propertyId);
        if (mockProperty) {
          setProperty(mockProperty);
        } else {
          toast({
            title: "Imóvel não encontrado",
            description: "O imóvel que você está procurando não foi encontrado.",
            variant: "destructive",
          });
          navigate('/imoveis');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do imóvel:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os detalhes do imóvel.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPropertyData();
  }, [propertyId, navigate, toast, encryptionKey]);

  const handleBack = () => {
    navigate('/imoveis');
  };

  const handleEdit = () => {
    // Implementação futura para edição do imóvel
    toast({
      title: "Editar imóvel",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleFinanceUpdate = async (financialData: any) => {
    if (!encryptionKey || !property) return;
    
    try {
      const updatedProperty = {
        ...property,
        finances: {
          ...property.finances,
          ...financialData
        }
      };
      
      await updateData('properties', propertyId, updatedProperty, encryptionKey);
      setProperty(updatedProperty);
      
      toast({
        title: "Dados financeiros atualizados",
        description: "As informações financeiras do imóvel foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar dados financeiros:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar os dados financeiros.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando detalhes do imóvel...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Imóvel não encontrado.</p>
        <Button onClick={handleBack} className="mt-4">Voltar para lista</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon-sm" 
            onClick={handleBack} 
            className="mr-2"
            title="Voltar para lista de imóveis"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{property.address}</h1>
          <span className="text-gray-500">{property.city}, {property.state}</span>
        </div>
        <Button
          variant="outline"
          onClick={handleEdit}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Editar Imóvel
        </Button>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full p-6">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details" className="gap-2">
            <Home className="h-4 w-4" />
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="finances" className="gap-2">
            <Banknote className="h-4 w-4" />
            Finanças
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <BarChart className="h-4 w-4" />
            Desempenho
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-500" />
                  Informações do Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Tipo:</span>
                  <span className="font-medium">{property.type}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium">{property.status}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Endereço:</span>
                  <span className="font-medium">{property.address}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Cidade:</span>
                  <span className="font-medium">{property.city}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Estado:</span>
                  <span className="font-medium">{property.state}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Datas e Valores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Data de Compra:</span>
                  <span className="font-medium">{property.purchaseDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Valor de Compra:</span>
                  <span className="font-medium">{formatCurrency(property.purchasePrice)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Valor Estimado:</span>
                  <span className="font-medium">{formatCurrency(property.estimatedValue)}</span>
                </div>
                {property.saleValue && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Valor de Venda:</span>
                    <span className="font-medium">{formatCurrency(property.saleValue)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {property.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{property.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="finances" className="space-y-6">
          <PropertyFinanceForm 
            propertyId={propertyId} 
            property={property} 
            onSave={handleFinanceUpdate}
          />
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Desempenho Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                {property.finances ? (
                  <p className="text-gray-700">Gráficos de desempenho baseados nas informações financeiras.</p>
                ) : (
                  <p className="text-gray-500">Adicione informações financeiras para visualizar o desempenho.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retorno sobre Investimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Investimento Total:</span>
                  <span className="font-medium">{formatCurrency(property.purchasePrice)}</span>
                </div>
                
                {property.finances && (
                  <>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Custos de Aquisição:</span>
                      <span className="font-medium">{formatCurrency(property.finances.acquisitionCosts || 0)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Custos Mensais (Acumulado):</span>
                      <span className="font-medium">{formatCurrency(property.finances.monthlyCosts || 0)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500">Receitas (Acumulado):</span>
                      <span className="font-medium text-green-600">{formatCurrency(property.finances.income || 0)}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Valorização:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(property.estimatedValue - property.purchasePrice)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">ROI Estimado:</span>
                  <span className="font-medium text-green-600">
                    {((property.estimatedValue - property.purchasePrice) / property.purchasePrice * 100).toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyDetail;
