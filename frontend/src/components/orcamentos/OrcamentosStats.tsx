import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OrcamentoStats, formatCurrency } from '@/types/orcamento';

interface OrcamentosStatsProps {
  stats: OrcamentoStats;
}

const OrcamentosStats: React.FC<OrcamentosStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-accent">{stats.total}</div>
          <p className="text-sm text-muted-foreground">Total</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.aguardando}</div>
          <p className="text-sm text-muted-foreground">Aguardando</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-green-600">{stats.aprovados}</div>
          <p className="text-sm text-muted-foreground">Aprovados</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.valorTotal)}</div>
          <p className="text-sm text-muted-foreground">Valor Total</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrcamentosStats;

