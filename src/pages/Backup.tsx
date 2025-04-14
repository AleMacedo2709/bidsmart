
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { exportStoreData, importStoreData } from '@/lib/storage/export-import';
import { exportEncryptedData } from '@/lib/encryption/export';
import { verifyExportedData } from '@/lib/encryption/export';
import { verifyDatabaseIntegrity } from '@/lib/storage/integrity';
import { 
  FileDown, 
  FileUp, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const BackupPage: React.FC = () => {
  const { encryptionKey } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    if (!encryptionKey) {
      toast({
        title: "Erro de Exportação",
        description: "Chave de criptografia não disponível.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsExporting(true);
      const stores = ['properties', 'simulations', 'settings'];
      
      for (const store of stores) {
        const exportedData = await exportStoreData(store, encryptionKey);
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        exportEncryptedData(exportedData, `bidsmart-backup-${store}-${timestamp}.aeg`);
      }

      toast({
        title: "Backup Concluído",
        description: "Todos os dados foram exportados com sucesso.",
      });
    } catch (error) {
      console.error("Erro na exportação:", error);
      toast({
        title: "Erro na Exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!encryptionKey) {
      toast({
        title: "Erro de Importação",
        description: "Chave de criptografia não disponível.",
        variant: "destructive"
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const fileContent = await file.text();

      const storeMap: Record<string, string> = {
        'properties': 'properties',
        'simulations': 'simulations',
        'settings': 'settings'
      };

      const matchedStore = Object.keys(storeMap).find(key => 
        file.name.includes(key)
      ) || 'properties';

      await importStoreData(matchedStore, fileContent, encryptionKey);

      const integrityResult = await verifyDatabaseIntegrity(encryptionKey);
      
      if (integrityResult.valid) {
        toast({
          title: "Importação Concluída",
          description: "Dados importados e verificados com sucesso.",
        });
      } else {
        toast({
          title: "Aviso de Integridade",
          description: "Dados importados, mas algumas inconsistências foram detectadas.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro na importação:", error);
      toast({
        title: "Erro na Importação",
        description: "Não foi possível importar os dados. Verifique o arquivo.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="page-title">
          <ShieldCheck /> Backup de Dados
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-[#f8f9fa] to-[#F1F0FB] rounded-t-lg border-b">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileDown /> Exportar Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground mb-4">
                Exporte todos os seus dados de forma segura e criptografada.
              </p>
              <Button 
                onClick={handleExport} 
                isLoading={isExporting}
                className="w-full"
              >
                Exportar Backup
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-[#f8f9fa] to-[#F1F0FB] rounded-t-lg border-b">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileUp /> Importar Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground mb-4">
                Importe um backup de dados previamente exportado.
              </p>
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  accept=".aeg" 
                  onChange={handleImport} 
                  className="hidden" 
                  id="backup-import"
                  disabled={isImporting}
                />
                <label 
                  htmlFor="backup-import" 
                  className="w-full"
                >
                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary/10" 
                    isLoading={isImporting}
                    asChild
                  >
                    <span>Selecionar Arquivo de Backup</span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-4 shadow-sm">
          <AlertCircle className="text-primary" />
          <div>
            <h3 className="font-semibold text-primary">Importante</h3>
            <p className="text-primary/80 text-sm">
              Sempre mantenha seus backups em local seguro. Em caso de perda de dispositivo, 
              você precisará deste arquivo para recuperar seus dados.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BackupPage;
