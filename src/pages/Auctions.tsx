
import React, { useState } from 'react';
import { Gavel, Calendar, MapPin, Search, Filter } from 'lucide-react';
import { mockAuctions } from '@/data/mockData';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Auctions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter auctions based on search term
  const filteredAuctions = mockAuctions.filter(auction => 
    auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* List of upcoming auctions */}
        <div className="grid gap-6">
          {filteredAuctions.map((auction) => (
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
                      <span className="text-blue-600 font-medium">{auction.properties} imóveis</span>
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
                          <TableCell>{Math.floor(auction.properties * 0.6)}</TableCell>
                          <TableCell>R$ {(300000).toLocaleString('pt-BR')}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Casas</TableCell>
                          <TableCell>{Math.floor(auction.properties * 0.3)}</TableCell>
                          <TableCell>R$ {(450000).toLocaleString('pt-BR')}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Terrenos</TableCell>
                          <TableCell>{Math.floor(auction.properties * 0.1)}</TableCell>
                          <TableCell>R$ {(180000).toLocaleString('pt-BR')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button>Ver Detalhes</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredAuctions.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg mt-6">
            <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">Nenhum leilão encontrado</h3>
            <p className="text-gray-500 mt-2">Tente ajustar sua busca ou verifique mais tarde.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Auctions;
