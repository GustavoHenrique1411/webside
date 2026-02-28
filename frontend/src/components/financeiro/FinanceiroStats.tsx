import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinanceiroStatsProps {
  totalEntradas: number;
  totalSaidas: number;
  transacoes: any[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function FinanceiroStats({ totalEntradas, totalSaidas, transacoes }: FinanceiroStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Entradas</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Saídas</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-accent">{formatCurrency(totalEntradas - totalSaidas)}</div>
          <p className="text-sm text-muted-foreground">Saldo</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-yellow-600">
            {transacoes.filter((t: any) => t.status === 'Pendente').length}
          </div>
          <p className="text-sm text-muted-foreground">Pendentes</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default FinanceiroStats;

