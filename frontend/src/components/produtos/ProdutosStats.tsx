import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

interface ProdutosStatsProps {
  produtos: any[];
}

export function ProdutosStats({ produtos }: ProdutosStatsProps) {
  const totalProdutos = produtos.length;
  const produtosAtivos = produtos.filter(p => p.ativo).length;
  const produtosInativos = produtos.filter(p => !p.ativo).length;
  const valorTotal = produtos.reduce((sum, p) => sum + (p.valor_base || 0), 0);

  const stats = [
    {
      title: 'Total de Produtos',
      value: totalProdutos,
      icon: Package,
      description: `${produtosAtivos} ativos, ${produtosInativos} inativos`,
    },
    {
      title: 'Produtos Ativos',
      value: produtosAtivos,
      icon: TrendingUp,
      description: `${((produtosAtivos / totalProdutos) * 100 || 0).toFixed(1)}% do total`,
    },
    {
      title: 'Valor Total',
      value: `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: 'Soma dos valores base',
    },
    {
      title: 'Produtos Inativos',
      value: produtosInativos,
      icon: AlertTriangle,
      description: 'Precisa revisão',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

