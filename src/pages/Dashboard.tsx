
import React from 'react';
import { DollarSign, Home, TrendingUp, PercentSquare } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import AuctionList from '@/components/dashboard/AuctionList';
import FeaturedProperties from '@/components/dashboard/FeaturedProperties';

const Dashboard = () => {
  // Example data - in a real application, this would come from an API or context
  const stats = {
    activeProperties: 12,
    inProcessProperties: 4,
    totalInvestment: 1450000,
    projectedProfit: 320000,
    averageROI: 22,
    monthlyChange: 12,
    profitProjection: 18.2,
    quarterlyChange: -3
  };

  return (
    <AppLayout>
      <div className="h-full px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Olá, Alessandra macedo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Imóveis Ativos"
            value={stats.activeProperties.toString()}
            subtext={`${stats.inProcessProperties} em processo de venda`}
            icon={<Home className="h-6 w-6 text-blue-500" />}
            iconBg="bg-blue-100"
          />
          
          <StatCard 
            title="Investimento Total"
            value={`R$ ${stats.totalInvestment.toLocaleString('pt-BR')}`}
            subtext={`+${stats.monthlyChange}% do último mês`}
            icon={<DollarSign className="h-6 w-6 text-blue-500" />}
            iconBg="bg-blue-100"
            subTextColor="text-blue-600"
          />
          
          <StatCard 
            title="Lucro Estimado"
            value={`R$ ${stats.projectedProfit.toLocaleString('pt-BR')}`}
            subtext={`${stats.profitProjection}% (projeção)`}
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
            iconBg="bg-green-100"
            isPositive={true}
          />
          
          <StatCard 
            title="ROI Médio"
            value={`${stats.averageROI}%`}
            subtext={`${Math.abs(stats.quarterlyChange)}% desde o último trimestre`}
            icon={<PercentSquare className="h-6 w-6 text-red-500" />}
            iconBg="bg-red-100"
            isPositive={false}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Próximos Leilões</h2>
            <AuctionList />
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Imóveis em Destaque</h2>
            <FeaturedProperties />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
