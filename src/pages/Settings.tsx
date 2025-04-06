
import React, { useState } from 'react';
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Mail, Bell, Calendar as CalendarIcon2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Auction {
  id: string;
  name: string;
  date: Date;
  location: string;
  propertyCount: number;
}

interface Preferences {
  emailNotifications: boolean;
  auctionAlerts: boolean;
  monthlyReports: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("user-profile");
  const [auctions, setAuctions] = useState<Auction[]>([
    {
      id: "1",
      name: "Leilão Caixa SP",
      date: new Date(2025, 3, 14), // April 14, 2025
      location: "São Paulo, SP",
      propertyCount: 24
    },
    {
      id: "2",
      name: "Leilão BB MG",
      date: new Date(2025, 3, 21), // April 21, 2025
      location: "Belo Horizonte, MG",
      propertyCount: 12
    }
  ]);

  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    auctionAlerts: true,
    monthlyReports: false
  });

  // New auction form state
  const [newAuction, setNewAuction] = useState({
    name: "",
    date: new Date(),
    location: "",
    propertyCount: ""
  });

  const handleAddAuction = () => {
    if (!newAuction.name || !newAuction.location || !newAuction.propertyCount) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos para adicionar um leilão.",
        variant: "destructive"
      });
      return;
    }

    const auction: Auction = {
      id: Date.now().toString(),
      name: newAuction.name,
      date: newAuction.date,
      location: newAuction.location,
      propertyCount: parseInt(newAuction.propertyCount)
    };

    setAuctions([...auctions, auction]);
    
    // Reset form
    setNewAuction({
      name: "",
      date: new Date(),
      location: "",
      propertyCount: ""
    });

    toast({
      title: "Leilão adicionado",
      description: "O leilão foi adicionado com sucesso."
    });
  };

  const handleDeleteAuction = (id: string) => {
    setAuctions(auctions.filter(auction => auction.id !== id));
    toast({
      title: "Leilão removido",
      description: "O leilão foi removido com sucesso."
    });
  };

  const handleTogglePreference = (key: keyof Preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    toast({
      title: "Preferência atualizada",
      description: `A preferência foi ${preferences[key] ? "desativada" : "ativada"} com sucesso.`
    });
  };

  return (
    <SidebarLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full max-w-3xl grid grid-cols-4">
            <TabsTrigger value="user-profile">Perfil do Usuário</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
            <TabsTrigger value="auctions">Leilões</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user-profile">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Perfil do Usuário</h2>
                <p>Configurações do perfil do usuário serão implementadas aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculator">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Configurações da Calculadora</h2>
                <p>Configurações da calculadora serão implementadas aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="auctions">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Gerenciamento de Leilões</h2>
                    <p className="text-gray-500">Adicione e gerencie informações sobre próximos leilões</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="auction-name">Nome do Leilão</Label>
                      <Input 
                        id="auction-name" 
                        placeholder="Ex: Leilão Caixa SP" 
                        className="mt-1"
                        value={newAuction.name}
                        onChange={e => setNewAuction({...newAuction, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="auction-date">Data do Leilão</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="auction-date"
                            variant={"outline"}
                            className={cn(
                              "w-full mt-1 justify-start text-left font-normal",
                              !newAuction.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newAuction.date ? format(newAuction.date, "dd/MM/yyyy") : "dd/mm/aaaa"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto">
                          <Calendar
                            mode="single"
                            selected={newAuction.date}
                            onSelect={(date) => date && setNewAuction({...newAuction, date})}
                            initialFocus
                            className="p-3"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="property-count">Quantidade de Imóveis</Label>
                      <Input 
                        id="property-count" 
                        placeholder="Ex: 24" 
                        type="number"
                        className="mt-1"
                        value={newAuction.propertyCount}
                        onChange={e => setNewAuction({...newAuction, propertyCount: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Localização</Label>
                      <Input 
                        id="location" 
                        placeholder="Ex: São Paulo, SP" 
                        className="mt-1"
                        value={newAuction.location}
                        onChange={e => setNewAuction({...newAuction, location: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleAddAuction} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Leilão</span>
                  </Button>
                  
                  <div className="mt-10">
                    <h3 className="text-lg font-semibold mb-4">Próximos Leilões</h3>
                    <div className="space-y-4">
                      {auctions.map(auction => (
                        <div 
                          key={auction.id} 
                          className="border rounded-md p-4 relative"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteAuction(auction.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                          
                          <h4 className="font-semibold text-lg">{auction.name}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Data: {format(auction.date, "dd/MM/yyyy")}</p>
                            <p>Localização: {auction.location}</p>
                            <p>Imóveis disponíveis: {auction.propertyCount}</p>
                          </div>
                        </div>
                      ))}
                      
                      {auctions.length === 0 && (
                        <p className="text-gray-500 italic">Nenhum leilão cadastrado.</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Preferências</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium">Notificações por Email</h3>
                      </div>
                      <p className="text-sm text-gray-500">Receba atualizações sobre seus imóveis</p>
                    </div>
                    <Switch 
                      checked={preferences.emailNotifications}
                      onCheckedChange={() => handleTogglePreference('emailNotifications')}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium">Alertas de Leilão</h3>
                      </div>
                      <p className="text-sm text-gray-500">Seja avisado sobre novos leilões</p>
                    </div>
                    <Switch 
                      checked={preferences.auctionAlerts}
                      onCheckedChange={() => handleTogglePreference('auctionAlerts')}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CalendarIcon2 className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium">Relatórios Mensais</h3>
                      </div>
                      <p className="text-sm text-gray-500">Receba relatórios de desempenho mensalmente</p>
                    </div>
                    <Switch 
                      checked={preferences.monthlyReports}
                      onCheckedChange={() => handleTogglePreference('monthlyReports')}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
                
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Settings;
