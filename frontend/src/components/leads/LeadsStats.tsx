import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LeadsStatsProps {
  leads: {
    length: number;
    filter: (cb: (l: any) => boolean) => any[];
  };
}

const LeadsStats: React.FC<LeadsStatsProps> = ({ leads }) => {
  const stats = {
    total: leads.length,
    novos: leads.filter((l: any) => l.status_nome === 'Novo').length,
    qualificados: leads.filter((l: any) => l.status_nome === 'Qualificado').length,
    propostas: leads.filter((l: any) => l.status_nome === 'Proposta').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-accent">{stats.total}</div>
          <p className="text-sm text-muted-foreground">Total de Leads</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-blue-600">{stats.novos}</div>
          <p className="text-sm text-muted-foreground">Novos</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-green-600">{stats.qualificados}</div>
          <p className="text-sm text-muted-foreground">Qualificados</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-purple-600">{stats.propostas}</div>
          <p className="text-sm text-muted-foreground">Em Proposta</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsStats;

