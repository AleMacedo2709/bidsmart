
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { retrieveAllData, deleteData } from '@/lib/storage';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SimulationData {
  id: string;
  name: string;
  date: string;
  notes?: string;
  results: {
    netProfit: number;
    roi: number;
  };
}

const PropertyList: React.FC = () => {
  const [simulations, setSimulations] = useState<SimulationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [simulationToDelete, setSimulationToDelete] = useState<string | null>(null);
  const { encryptionKey } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSimulations();
  }, [encryptionKey]);

  const loadSimulations = async () => {
    if (!encryptionKey) return;

    try {
      setIsLoading(true);
      const data = await retrieveAllData<SimulationData>('simulations', encryptionKey);
      setSimulations(data);
    } catch (error) {
      console.error('Failed to load simulations:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load your saved simulations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteData('simulations', id);
      setSimulations(simulations.filter(sim => sim.id !== id));
      toast({
        title: "Simulation Deleted",
        description: "The simulation has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete simulation:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete the simulation.",
        variant: "destructive",
      });
    } finally {
      setSimulationToDelete(null);
    }
  };

  const filteredSimulations = searchTerm
    ? simulations.filter(sim => 
        sim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sim.notes && sim.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : simulations;

  const newCalculation = () => {
    navigate('/calculator');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Properties</h1>
          <p className="text-gray-500 mt-1">
            Manage your auction property investments and simulations
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={newCalculation}>
            New Simulation
          </Button>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <Label htmlFor="search" className="sr-only">Search</Label>
        <Input
          id="search"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">Loading your simulations...</p>
        </div>
      ) : filteredSimulations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Simulations Found</CardTitle>
            <CardDescription>
              {searchTerm 
                ? "No simulations match your search criteria." 
                : "You haven't created any property simulations yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-gray-500">
              {searchTerm 
                ? "Try a different search term or clear the search."
                : "Get started by creating a new simulation."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={newCalculation}>
              Create Your First Simulation
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map((simulation) => (
            <Card key={simulation.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{simulation.name}</CardTitle>
                <CardDescription>
                  Created on {new Date(simulation.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Net Profit:</span>
                    <span className={`font-medium ${simulation.results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(simulation.results.netProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ROI:</span>
                    <span className={`font-medium ${simulation.results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(simulation.results.roi)}
                    </span>
                  </div>
                  {simulation.notes && (
                    <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                      <p className="line-clamp-3">{simulation.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3">
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSimulationToDelete(simulation.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!simulationToDelete} onOpenChange={() => setSimulationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              simulation and remove the data from your device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => simulationToDelete && handleDelete(simulationToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PropertyList;
