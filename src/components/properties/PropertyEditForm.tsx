
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, MapPin, Home, Banknote, Calendar } from 'lucide-react';
import { updateData } from '@/lib/storage';

// Define the schema for property data validation
const propertySchema = z.object({
  name: z.string().optional(),
  address: z.string().min(5, { message: 'O endereço deve ter pelo menos 5 caracteres' }),
  city: z.string().min(2, { message: 'A cidade deve ter pelo menos 2 caracteres' }),
  state: z.string().min(2, { message: 'O estado deve ter pelo menos 2 caracteres' }),
  type: z.string().min(1, { message: 'Selecione um tipo de imóvel' }),
  status: z.string().min(1, { message: 'Selecione um status' }),
  purchaseDate: z.string().min(1, { message: 'Selecione uma data de compra' }),
  purchasePrice: z.string().transform(val => Number(val) || 0),
  estimatedValue: z.string().transform(val => Number(val) || 0),
  notes: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyEditFormProps {
  property: any;
  onSave: (updatedProperty: any) => Promise<void>;
  onCancel: () => void;
}

const PropertyEditForm: React.FC<PropertyEditFormProps> = ({ property, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { encryptionKey } = useAuth();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: property.name || '',
      address: property.address || '',
      city: property.city || '',
      state: property.state || '',
      type: property.type || 'Apartamento',
      status: property.status || 'Ativo',
      purchaseDate: property.purchaseDate || new Date().toISOString().split('T')[0],
      purchasePrice: String(property.purchasePrice) || '',
      estimatedValue: String(property.estimatedValue) || '',
      notes: property.notes || '',
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!encryptionKey) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para editar um imóvel.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare updated property data - ensure numbers are properly converted
      const updatedProperty = {
        ...property,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        type: data.type,
        status: data.status,
        purchaseDate: data.purchaseDate,
        purchasePrice: Number(data.purchasePrice),
        estimatedValue: Number(data.estimatedValue),
        notes: data.notes,
      };

      // Save updated property
      await onSave(updatedProperty);
      
      toast({
        title: "Imóvel atualizado",
        description: "O imóvel foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      toast({
        title: "Erro ao atualizar imóvel",
        description: "Ocorreu um erro ao atualizar o imóvel. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Property type options
  const propertyTypes = [
    'Apartamento',
    'Casa',
    'Terreno',
    'Sala Comercial',
    'Galpão',
    'Fazenda',
    'Chácara',
    'Outro'
  ];

  // Property status options
  const propertyStatuses = [
    'Ativo',
    'Em Processo',
    'Vendido'
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon-sm" 
            onClick={onCancel} 
            className="mr-2"
            title="Cancelar edição"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Imóvel</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Imóvel */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Imóvel</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Home className="h-4 w-4" />
                      </div>
                      <Input 
                        placeholder="Ex: Apartamento Centro" 
                        className="pl-10" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Imóvel */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Imóvel</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors shadow-sm"
                      {...field}
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Endereço */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <Input 
                        placeholder="Rua, número, complemento" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cidade */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Cidade" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Estado" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors shadow-sm"
                      {...field}
                    >
                      {propertyStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data de Compra */}
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Compra</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <Input 
                        type="date" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor de Compra */}
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Compra (R$)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Banknote className="h-4 w-4" />
                      </div>
                      <Input 
                        type="number" 
                        placeholder="0,00" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor Estimado */}
            <FormField
              control={form.control}
              name="estimatedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Estimado (R$)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Banknote className="h-4 w-4" />
                      </div>
                      <Input 
                        type="number" 
                        placeholder="0,00" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Observações */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informações adicionais sobre o imóvel..." 
                    className="min-h-[120px]" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Adicione qualquer observação relevante sobre o imóvel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PropertyEditForm;
