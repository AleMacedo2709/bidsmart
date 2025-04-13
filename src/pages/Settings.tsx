
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Mail, Bell, Calendar as CalendarIcon2, User, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { retrieveSettings, storeSettings } from "@/lib/storage/settings";
import SidebarLayout from "@/components/layout/SidebarLayout";

// Interfaces for our data structures
interface Preferences {
  emailNotifications: boolean;
  auctionAlerts: boolean;
  monthlyReports: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

interface CalculatorSettings {
  itbiRate: string;
  commissionRate: string;
  taxRate: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("user-profile");
  
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    auctionAlerts: true,
    monthlyReports: false
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "João Silva",
    email: "alessandra.macedo@terra.com.br",
    phone: "(11) 98765-4321"
  });

  const [calculatorSettings, setCalculatorSettings] = useState<CalculatorSettings>({
    itbiRate: "3",
    commissionRate: "5",
    taxRate: "15"
  });

  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const key = await window.crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
        
        const savedSettings = await retrieveSettings(key);
        
        if (savedSettings.preferences) {
          setPreferences(savedSettings.preferences);
        }
        
        if (savedSettings.userProfile) {
          setUserProfile(savedSettings.userProfile);
        }
        
        if (savedSettings.calculatorSettings) {
          setCalculatorSettings(savedSettings.calculatorSettings);
        }
      } catch (error) {
        console.error("Error loading settings", error);
      }
    };
    
    loadSettings();
  }, []);

  // Improved email sending simulation
  const sendNotificationEmail = (
    preference: keyof Preferences, 
    userEmail: string, 
    userName: string
  ) => {
    if (!preferences[preference]) return;

    const emailTemplates = {
      emailNotifications: {
        subject: "Notificações Ativadas",
        body: `Olá ${userName}, suas notificações por email foram ativadas com sucesso.`
      },
      auctionAlerts: {
        subject: "Alertas de Leilão Ativados", 
        body: `Olá ${userName}, você receberá alertas sobre novos leilões.`
      },
      monthlyReports: {
        subject: "Relatórios Mensais",
        body: `Olá ${userName}, seus relatórios mensais foram ativados.`
      }
    };

    const template = emailTemplates[preference];
    
    console.log(`Sending email to: ${userEmail}`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Body: ${template.body}`);
    
    // Simula o envio de email
    setTimeout(() => {
      console.log(`Email enviado para ${userEmail}`);
      toast({
        title: "Notificação Enviada",
        description: template.body
      });
    }, 1500);
  };

  // Save settings to storage
  const saveSettings = async () => {
    try {
      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      
      await storeSettings({
        preferences,
        userProfile,
        calculatorSettings,
      }, key);
      
      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram salvas com sucesso."
      });
    } catch (error) {
      console.error("Error saving settings", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas configurações.",
        variant: "destructive"
      });
    }
  };

  const handleTogglePreference = async (key: keyof Preferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    
    setPreferences(newPreferences);
    
    // Envio de email baseado no perfil do usuário
    if (newPreferences[key]) {
      sendNotificationEmail(key, userProfile.email, userProfile.name);
    } else {
      toast({
        title: "Preferência desativada",
        description: `A opção de ${getPreferenceLabel(key)} foi desativada.`
      });
    }
    
    // Save the updated preferences
    await saveSettings();
  };

  // Helper function to get user-friendly preference names
  const getPreferenceLabel = (key: keyof Preferences): string => {
    switch (key) {
      case "emailNotifications":
        return "notificações por email";
      case "auctionAlerts":
        return "alertas de leilão";
      case "monthlyReports":
        return "relatórios mensais";
      default:
        return key;
    }
  };

  // Simulate sending an email notification
  const simulateSendEmail = (email: string, subject: string, body: string) => {
    console.log(`Sending email to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    // In a real application, this would be connected to an email service
    setTimeout(() => {
      console.log(`Email sent to ${email}`);
    }, 1500);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserProfile) => {
    setUserProfile({
      ...userProfile,
      [field]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    await saveSettings();
    toast({
      title: "Perfil atualizado",
      description: "Seus dados pessoais foram atualizados com sucesso."
    });
  };

  const handleCalculatorSettingChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CalculatorSettings) => {
    setCalculatorSettings({
      ...calculatorSettings,
      [field]: e.target.value
    });
  };

  const handleSaveCalculatorSettings = async () => {
    await saveSettings();
    toast({
      title: "Configurações salvas",
      description: "Os parâmetros da calculadora foram atualizados com sucesso."
    });
  };

  return (
    <SidebarLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full max-w-3xl grid grid-cols-3">
            <TabsTrigger value="user-profile">Perfil do Usuário</TabsTrigger>
            <TabsTrigger value="calculator">Calculadora</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user-profile">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Perfil do Usuário</h2>
                    <p className="text-gray-500">Gerencie suas informações pessoais e preferências</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Nome
                      </Label>
                      <Input 
                        id="name" 
                        className="mt-1"
                        value={userProfile.name}
                        onChange={(e) => handleProfileChange(e, 'name')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email"
                        className="mt-1"
                        value={userProfile.email}
                        onChange={(e) => handleProfileChange(e, 'email')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        Telefone
                      </Label>
                      <Input 
                        id="phone" 
                        className="mt-1"
                        value={userProfile.phone}
                        onChange={(e) => handleProfileChange(e, 'phone')}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveProfile}
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculator">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Configurações da Calculadora</h2>
                    <p className="text-gray-500">Ajuste os parâmetros padrão para suas simulações</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="itbi-rate">ITBI Padrão (%)</Label>
                      <Input 
                        id="itbi-rate" 
                        type="number"
                        min="0"
                        step="0.1"
                        className="max-w-md"
                        value={calculatorSettings.itbiRate}
                        onChange={(e) => handleCalculatorSettingChange(e, 'itbiRate')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="commission-rate">Comissão de Venda Padrão (%)</Label>
                      <Input 
                        id="commission-rate" 
                        type="number"
                        min="0"
                        step="0.1"
                        className="max-w-md"
                        value={calculatorSettings.commissionRate}
                        onChange={(e) => handleCalculatorSettingChange(e, 'commissionRate')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Taxa de Imposto sobre Ganho (%)</Label>
                      <Input 
                        id="tax-rate" 
                        type="number"
                        min="0"
                        step="0.1"
                        className="max-w-md"
                        value={calculatorSettings.taxRate}
                        onChange={(e) => handleCalculatorSettingChange(e, 'taxRate')}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveCalculatorSettings}
                  >
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Preferências de Notificações</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-medium">Notificações por Email</h3>
                      </div>
                      <p className="text-sm text-gray-500">Receba atualizações sobre seus imóveis</p>
                      {preferences.emailNotifications && (
                        <p className="text-xs text-blue-600 mt-1">
                          Próximo email: {format(new Date(Date.now() + 86400000), "dd/MM/yyyy")}
                        </p>
                      )}
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
                      {preferences.auctionAlerts && (
                        <p className="text-xs text-blue-600 mt-1">
                          Alerta automático quando novos leilões forem adicionados
                        </p>
                      )}
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
                      {preferences.monthlyReports && (
                        <p className="text-xs text-blue-600 mt-1">
                          Próximo relatório: {format(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() + 1), "dd/MM/yyyy")}
                        </p>
                      )}
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
