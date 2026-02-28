import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ClientesStatsProps {
  clientes: {
    length: number;
    filter: (cb: (c: any) => boolean) => any[];
  };
}

const ClientesStats: React.FC<ClientesStatsProps> = ({ clientes }) => {
  const stats = {
    total: clientes.length,
    ativos: clientes.filter((c: any) => c.status_nome === 'Ativo').length,
    inativos: clientes.filter((c: any) => c.status_nome === 'Inativo').length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="text-xl sm:text-2xl font-bold text-accent">{stats.total}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">Total de Clientes</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.ativos}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">Ativos</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-xl sm:text-2xl font-bold text-gray-600">{stats.inativos}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">Inativos</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-xl sm:text-2xl font-bold text-accent">
            +{stats.total > 0 ? Math.round((stats.ativos / stats.total) * 100) : 0}%
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Taxa de Ativação</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientesStats;

