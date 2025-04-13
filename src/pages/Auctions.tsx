import React, { useState } from 'react';
import { Gavel, Calendar, MapPin, Search, Filter, Eye, Home, Building, DollarSign, Briefcase, Clock } from 'lucide-react';
import { mockAuctions } from '@/data/mockData';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Auctions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<typeof mockAuctions[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Extract unique locations from auctions
  const uniqueLocations = Array.from(new Set(mockAuctions.map(auction => auction.location.split(',')[1].trim())));
  
  // Filter auctions based on search term and location filters
  const filteredAuctions = mockAuctions.filter(auction => {
    const matchesSearch = auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocations.length === 0 || 
      selectedLocations.includes(auction.location.split(',')[1].trim());
    
    return matchesSearch && matchesLocation;
  });

  // Calculate property counts for each auction
  const getAuctionPropertyCounts = (totalProperties: number) => {
    const apartments = Math.floor(totalProperties * 0.6);
    const houses = Math.floor(totalProperties * 0.3);
    const lands = Math.floor(totalProperties * 0.1);
    
    return {
      apartments,
      houses,
      lands
    };
  };

  const handleViewDetails = (auction: typeof mockAuctions[0]) => {
    setSelectedAuction(auction);
    setDialogOpen(true);
    
    // Keep toast for consistency with previous behavior
    toast({
      title: "Detalhes do Leilão",
      description: `Visualizando detalhes do leilão ${auction.id}`,
    });
  };

  const handleLocationFilter = (location: string) => {
    setSelectedLocations(prev => {
      if (prev.includes(location)) {
        return prev.filter(l => l !== location);
      } else {
        return [...prev, location];
      }
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header section with title and search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Gavel className="h-8 w-8 text-blue-500" />
              Próximos Leilões
            </h1>
            <p className="text-gray-500 mt-1">
              Acompanhe os próximos leilões e encontre novas oportunidades de investimento.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Buscar leilões..." 
                className="pl-10" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={selectedLocations.length > 0 ? "bg-blue-50 border-blue-200" : ""}
                >
                  <Filter className={`h-4 w-4 ${selectedLocations.length > 0 ? "text-blue-500" : ""}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <p className="font-medium mb-2">Filtrar por Estado</p>
                  {uniqueLocations.map((location) => (
                    <DropdownMenuCheckboxItem
                      key={location}
                      checked={selectedLocations.includes(location)}
                      onCheckedChange={() => handleLocationFilter(location)}
                    >
                      {location}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active filters section */}
        {selectedLocations.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="text-sm text-gray-500 mt-1">Filtros:</span>
            {selectedLocations.map(location => (
              <Badge 
                key={location} 
                variant="outline" 
                className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1"
                onClick={() => handleLocationFilter(location)}
              >
                {location}
                <span className="cursor-pointer hover:text-blue-800">×</span>
              </Badge>
            ))}
            <Button 
              variant="link" 
              className="text-sm h-auto p-0 text-blue-600" 
              onClick={() => setSelectedLocations([])}
            >
              Limpar filtros
            </Button>
          </div>
        )}

        {/* List of upcoming auctions */}
        <div className="grid gap-6">
          {filteredAuctions.map((auction) => {
            // Calculate property counts for this auction
            const { apartments, houses, lands } = getAuctionPropertyCounts(auction.properties);
            const totalCalculatedProperties = apartments + houses + lands;
            
            return (
              <Card key={auction.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-1/4 bg-blue-50 flex flex-col justify-center items-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600">
                        {auction.date.split('/')[0]}
                      </div>
                      <div className="text-gray-500 font-medium">
                        {auction.date.split('/')[1]}/2024
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{auction.date}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-1 text-sm">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{auction.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 md:flex-1">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-xl">{auction.name}</CardTitle>
                    </CardHeader>
                    
                    <div className="text-gray-600 mb-4">
                      {auction.description}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Resumo</h3>
                        <span className="text-blue-600 font-medium">{totalCalculatedProperties} imóveis</span>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Valor Médio</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Apartamentos</TableCell>
                            <TableCell>{apartments}</TableCell>
                            <TableCell>R$ {(300000).toLocaleString('pt-BR')}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Casas</TableCell>
                            <TableCell>{houses}</TableCell>
                            <TableCell>R$ {(450000).toLocaleString('pt-BR')}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Terrenos</TableCell>
                            <TableCell>{lands}</TableCell>
                            <TableCell>R$ {(180000).toLocaleString('pt-BR')}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={() => handleViewDetails(auction)} 
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
        
        {filteredAuctions.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg mt-6">
            <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">Nenhum leilão encontrado</h3>
            <p className="text-gray-500 mt-2">Tente ajustar sua busca ou verifique mais tarde.</p>
          </div>
        )}
      </div>

      {/* Auction Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedAuction && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Gavel className="h-5 w-5 text-blue-500" />
                  {selectedAuction.name}
                </DialogTitle>
                <DialogDescription>
                  Informações detalhadas sobre o leilão
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 my-4">
                <div className="flex flex-col gap-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Data do Leilão</p>
                        <p className="font-medium">{selectedAuction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Localização</p>
                        <p className="font-medium">{selectedAuction.location}</p>
                      </div>
                    </div>
                    {(() => {
                      const { apartments, houses, lands } = getAuctionPropertyCounts(selectedAuction.properties);
                      const totalProperties = apartments + houses + lands;
                      
                      return (
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Total de Imóveis</p>
                            <p className="font-medium">{totalProperties} imóveis</p>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-medium">14:00 (horário de Brasília)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    Distribuição de Imóveis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    {(() => {
                      const { apartments, houses, lands } = getAuctionPropertyCounts(selectedAuction.properties);
                      
                      return (
                        <>
                          <div className="p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">Apartamentos</p>
                            <p className="font-medium">{apartments} unidades</p>
                            <p className="text-sm text-gray-500">R$ {(300000).toLocaleString('pt-BR')} (média)</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-md">
                            <p className="text-sm text-green-800">Casas</p>
                            <p className="font-medium">{houses} unidades</p>
                            <p className="text-sm text-gray-500">R$ {(450000).toLocaleString('pt-BR')} (média)</p>
                          </div>
                          <div className="p-3 bg-amber-50 rounded-md">
                            <p className="text-sm text-amber-800">Terrenos</p>
                            <p className="font-medium">{lands} unidades</p>
                            <p className="text-sm text-gray-500">R$ {(180000).toLocaleString('pt-BR')} (média)</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    Informações do Leiloeiro
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Leiloeiro Responsável</p>
                      <p className="font-medium">Carlos Eduardo Santos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contato</p>
                      <p className="font-medium">(11) 98765-4321</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    Condições
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• Os imóveis serão vendidos no estado físico e de ocupação em que se encontram.</p>
                    <p>• A comissão do leiloeiro, a ser paga pelo arrematante, será de 5% sobre o valor da arrematação.</p>
                    <p>• O pagamento poderá ser à vista ou financiado em até 420 meses, sujeito à aprovação de crédito.</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Auctions;
