
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
  }[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({ properties, onView, onDelete }) => {
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
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Endereço</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data Compra</TableHead>
            <TableHead>Valor Compra</TableHead>
            <TableHead>Valor Estimado</TableHead>
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
              <TableCell>{property.purchaseDate}</TableCell>
              <TableCell>{formatCurrency(property.purchasePrice)}</TableCell>
              <TableCell>{formatCurrency(property.estimatedValue)}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(property.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(property.id)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyTable;
