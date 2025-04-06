
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';

interface PropertyTableProps {
  properties: {
    id: string;
    name?: string;
    address: string;
    city: string;
    state: string;
    type: string;
    status: string;
    purchaseDate: string;
    purchasePrice: number;
    estimatedValue: number;
    saleValue?: number;
  }[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const PropertiesTable: React.FC<PropertyTableProps> = ({ properties, onView, onDelete }) => {
  // Function to render the status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">Ativo</span>;
      case 'Em Processo':
        return <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">Em Processo</span>;
      case 'Vendido':
        return <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">Vendido</span>;
      default:
        return <span className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-full">{status}</span>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead>Endereço</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Data Compra</TableHead>
          <TableHead className="text-right">Valor Compra</TableHead>
          <TableHead className="text-right">Valor Estimado</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell className="font-medium">
              <div>
                <div className="font-medium">{property.address}</div>
                <div className="text-sm text-gray-500">{property.city}, {property.state}</div>
              </div>
            </TableCell>
            <TableCell>{property.type}</TableCell>
            <TableCell>{renderStatusBadge(property.status)}</TableCell>
            <TableCell className="text-right">{property.purchaseDate}</TableCell>
            <TableCell className="text-right">{formatCurrency(property.purchasePrice)}</TableCell>
            <TableCell className="text-right">{formatCurrency(property.estimatedValue)}</TableCell>
            <TableCell>
              <div className="flex justify-center gap-2">
                <button 
                  onClick={() => onView(property.id)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onDelete(property.id)} 
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PropertiesTable;
