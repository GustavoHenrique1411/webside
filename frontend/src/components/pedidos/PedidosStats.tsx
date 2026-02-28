import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

interface PedidosStatsProps {
  total: number;
  emProducao: number;
  emTransito: number;
  entregues: number;
}

export const PedidosStats: React.FC<PedidosStatsProps> = ({
  total,
  emProducao,
  emTransito,
  entregues,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div className="text-2xl font-bold">{total}</div>
          </div>
          <p className="text-sm text-muted-foreground">Total de Pedidos</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{emProducao}</div>
          </div>
          <p className="text-sm text-muted-foreground">Em Produção</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{emTransito}</div>
          </div>
          <p className="text-sm text-muted-foreground">Em Trânsito</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{entregues}</div>
          </div>
          <p className="text-sm text-muted-foreground">Entregues</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PedidosStats;
