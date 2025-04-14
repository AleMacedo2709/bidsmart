
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { exportStoreData, importStoreData } from '@/lib/storage/export-import';
import { exportEncryptedData, decryptData, verifyExportedData } from '@/lib/encryption/export';
import { 
  FileDown, 
  FileUp, 
  ShieldCheck, 
  AlertCircle,
  Download
} from 'lucide-react';
import { verifyDatabaseIntegrity } from '@/lib/storage/integrity';

const BackupPage: React.FC = () => {
  const { encryptionKey } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

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

  const handleExportExcel = async () => {
    if (!encryptionKey) {
      toast({
        title: "Erro de Exportação",
        description: "Chave de criptografia não disponível.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsExportingExcel(true);
      
      // Import the XLSX library dynamically to reduce initial load time
      const XLSX = await import('xlsx');
      
      // Retrieve property data and decrypt it properly
      const encryptedPropertiesData = await exportStoreData('properties', encryptionKey);
      
      // First, we need to verify and extract the data
      const validationResult = verifyExportedData(encryptedPropertiesData);
      if (!validationResult.isValid || !validationResult.data) {
        throw new Error('Invalid data format');
      }
      
      // Now decrypt the data
      const decryptedData = await decryptData(validationResult.data, encryptionKey);
      
      // Make sure we have an array of properties
      const propertyData = Array.isArray(decryptedData) ? decryptedData : 
                          (decryptedData.data && Array.isArray(decryptedData.data)) ? 
                          decryptedData.data : [];
      
      // Create a workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(propertyData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Imóveis");
      
      // Generate Excel file
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      XLSX.writeFile(wb, `bidsmart-imoveis-${timestamp}.xlsx`);
      
      toast({
        title: "Excel Exportado",
        description: "Os dados foram exportados para Excel com sucesso.",
      });
    } catch (error) {
      console.error("Erro na exportação para Excel:", error);
      toast({
        title: "Erro na Exportação Excel",
        description: "Não foi possível exportar os dados para Excel.",
        variant: "destructive"
      });
    } finally {
      setIsExportingExcel(false);
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
    <div className="h-full overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-[#7E69AB]">
          <ShieldCheck className="text-[#9b87f5]" /> Backup de Dados
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-[#f8f9fa] to-[#F1F0FB] rounded-t-lg border-b">
              <CardTitle className="flex items-center gap-2 text-[#7E69AB]">
                <FileDown className="text-[#9b87f5]" /> Exportar Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground mb-4">
                Exporte todos os seus dados de forma segura e criptografada.
              </p>
              <Button 
                onClick={handleExport} 
                isLoading={isExporting}
                className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
              >
                Exportar Backup
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-[#f8f9fa] to-[#F1F0FB] rounded-t-lg border-b">
              <CardTitle className="flex items-center gap-2 text-[#7E69AB]">
                <Download className="text-[#9b87f5]" /> Exportar Excel
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground mb-4">
                Exporte seus imóveis em formato Excel para análise.
              </p>
              <Button 
                onClick={handleExportExcel} 
                isLoading={isExportingExcel}
                variant="outline"
                className="w-full border-[#9b87f5] text-[#7E69AB] hover:bg-[#F1F0FB]"
              >
                Exportar para Excel
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-[#f8f9fa] to-[#F1F0FB] rounded-t-lg border-b">
              <CardTitle className="flex items-center gap-2 text-[#7E69AB]">
                <FileUp className="text-[#9b87f5]" /> Importar Dados
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
                    className="w-full border-[#9b87f5] text-[#7E69AB] hover:bg-[#F1F0FB]" 
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

        <div className="mt-8 bg-[#F1F0FB] border border-[#D6BCFA] rounded-lg p-4 flex items-center gap-4 shadow-sm">
          <AlertCircle className="text-[#9b87f5]" />
          <div>
            <h3 className="font-semibold text-[#6E59A5]">Importante</h3>
            <p className="text-[#7E69AB] text-sm">
              Sempre mantenha seus backups em local seguro. Em caso de perda de dispositivo, 
              você precisará deste arquivo para recuperar seus dados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupPage;
