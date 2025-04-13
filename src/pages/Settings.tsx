
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { retrieveSettings, storeSettings } from '@/lib/storage/settings';
import { Info } from 'lucide-react';

// Type for user preferences
interface Preferences {
  notifyNewAuctions: boolean;
  notifyPriceChanges: boolean;
  notifyNewProperties: boolean;
  notifyInvestmentOpportunities: boolean;
  notifyMarketReports: boolean;
  darkMode: boolean;
}

// Type for user profile
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Function to get the label for a preference
const getPreferenceLabel = (key: keyof Preferences): string => {
  const labels: Record<keyof Preferences, string> = {
    notifyNewAuctions: 'Novos Leilões',
    notifyPriceChanges: 'Mudanças de Preço',
    notifyNewProperties: 'Novos Imóveis',
    notifyInvestmentOpportunities: 'Oportunidades de Investimento',
    notifyMarketReports: 'Relatórios de Mercado',
    darkMode: 'Modo Escuro'
  };
  return labels[key];
};

// Mock function to send email notification
const sendNotificationEmail = (
  preferenceKey: keyof Preferences, 
  email: string, 
  name: string
): void => {
  // In a real application, this would call an API to send an email
  console.log(`Sending email to ${email} for ${name} about ${String(preferenceKey)}`);
  
  // Different templates based on notification type
  const templates: Record<keyof Preferences, string> = {
    notifyNewAuctions: `Olá ${name}, você será notificado sobre novos leilões!`,
    notifyPriceChanges: `Olá ${name}, você será notificado sobre mudanças de preço!`,
    notifyNewProperties: `Olá ${name}, você será notificado sobre novos imóveis!`,
    notifyInvestmentOpportunities: `Olá ${name}, você será notificado sobre oportunidades de investimento!`,
    notifyMarketReports: `Olá ${name}, você será notificado sobre relatórios de mercado!`,
    darkMode: `Olá ${name}, você ativou o modo escuro!`
  };
  
  console.log(`Email template: ${templates[preferenceKey]}`);
};

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('preferences');
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize state for user preferences
  const [preferences, setPreferences] = useState<Preferences>({
    notifyNewAuctions: false,
    notifyPriceChanges: false,
    notifyNewProperties: false,
    notifyInvestmentOpportunities: false,
    notifyMarketReports: false,
    darkMode: false
  });
  
  // Initialize state for user profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '(11) 98765-4321',
    address: 'Av. Paulista, 1000 - São Paulo, SP'
  });
  
  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // For demo purposes, we'll simulate loading from storage
        // In a real app, you would use the actual crypto key
        const mockKey = {} as CryptoKey;
        const savedSettings = await retrieveSettings(mockKey);
        
        if (savedSettings.preferences) {
          setPreferences(savedSettings.preferences);
        }
        
        if (savedSettings.userProfile) {
          setUserProfile(savedSettings.userProfile);
        }
        
        console.log('Settings loaded successfully');
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast({
          title: 'Erro ao carregar configurações',
          description: 'Não foi possível carregar suas configurações.'
        });
      }
    };
    
    loadSettings();
  }, [toast]);
  
  // Save settings to storage
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // For demo purposes, we'll simulate saving to storage
      // In a real app, you would use the actual crypto key
      const mockKey = {} as CryptoKey;
      await storeSettings(
        { preferences, userProfile },
        mockKey
      );
      
      toast({
        title: 'Configurações salvas',
        description: 'Suas configurações foram salvas com sucesso.'
      });
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: 'Não foi possível salvar suas configurações.'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle toggle of preferences
  const handleTogglePreference = async (key: keyof Preferences) => {
    console.log(`Toggling preference: ${String(key)}`);
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    
    setPreferences(newPreferences);
    
    // Send notification email based on user profile
    if (newPreferences[key]) {
      console.log(`Sending notification email for: ${String(key)}`);
      sendNotificationEmail(key, userProfile.email, userProfile.name);
    } else {
      console.log(`Preference ${String(key)} deactivated`);
      toast({
        title: "Preferência desativada",
        description: `A opção de ${getPreferenceLabel(key)} foi desativada.`
      });
    }
    
    // Save the updated preferences
    await saveSettings();
  };
  
  return (
    <SidebarLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="preferences">Notificações</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Preferências de Notificação</h2>
              <p className="text-gray-600 mb-6">
                Escolha quais notificações você deseja receber por e-mail.
              </p>
              
              <div className="space-y-4">
                {(Object.keys(preferences) as Array<keyof Preferences>)
                  .filter(key => key !== 'darkMode')
                  .map((key) => (
                    <div key={key} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded">
                      <Checkbox 
                        id={key} 
                        checked={preferences[key]} 
                        onCheckedChange={() => handleTogglePreference(key)}
                      />
                      <div className="flex flex-col">
                        <Label htmlFor={key} className="font-medium">
                          {getPreferenceLabel(key)}
                        </Label>
                        <p className="text-sm text-gray-500">
                          Receba notificações sobre {getPreferenceLabel(key).toLowerCase()}.
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Aparência</h2>
              
              <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded">
                <Checkbox 
                  id="darkMode" 
                  checked={preferences.darkMode} 
                  onCheckedChange={() => handleTogglePreference('darkMode')}
                />
                <div className="flex flex-col">
                  <Label htmlFor="darkMode" className="font-medium">
                    Modo Escuro
                  </Label>
                  <p className="text-sm text-gray-500">
                    Ative o modo escuro para uma experiência visual mais confortável.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
              
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      />
                    </FormControl>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      />
                    </FormControl>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <input 
                        type="tel" 
                        className="w-full p-2 border rounded"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                      />
                    </FormControl>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded"
                        value={userProfile.address}
                        onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                      />
                    </FormControl>
                  </FormItem>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={saveSettings} 
                    disabled={isSaving}
                    isLoading={isSaving}
                  >
                    Salvar alterações
                  </Button>
                </div>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Segurança da Conta</h2>
              
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Proteção de dados</AlertTitle>
                <AlertDescription>
                  Seus dados são criptografados e armazenados com segurança.
                </AlertDescription>
              </Alert>
              
              <Button variant="outline" className="mb-4">Alterar senha</Button>
              
              <h3 className="text-lg font-medium mt-6 mb-3">Dispositivos conectados</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Windows PC - Chrome</p>
                    <p className="text-sm text-gray-500">São Paulo, Brasil • Atual</p>
                  </div>
                  <Button variant="ghost" size="sm">Este dispositivo</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">iPhone - Safari</p>
                    <p className="text-sm text-gray-500">São Paulo, Brasil • 3 dias atrás</p>
                  </div>
                  <Button variant="outline" size="sm">Desconectar</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Settings;
