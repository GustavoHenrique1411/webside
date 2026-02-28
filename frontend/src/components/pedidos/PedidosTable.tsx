import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface PedidosTableProps {
  pedidos: any[];
  loading?: boolean;
  onView: (pedido: any) => void;
  onEdit: (pedido: any) => void;
  onDelete: (pedido: any) => void;
}

export function PedidosTable({ pedidos, loading, onView, onEdit, onDelete }: PedidosTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!pedidos.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Nenhum pedido encontrado.</div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      '1': { label: 'Pendente', variant: 'secondary' },
      '2': { label: 'Em Processamento', variant: 'outline' },
      '3': { label: 'Enviado', variant: 'default' },
      '4': { label: 'Entregue', variant: 'default' },
      '5': { label: 'Cancelado', variant: 'destructive' },
    };
    return statusMap[status] || { label: status, variant: 'secondary' };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Data do Pedido</TableHead>
          <TableHead>Data de Entrega</TableHead>
          <TableHead className="text-right">Valor Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pedidos.map((pedido) => {
          const statusInfo = getStatusBadge(pedido.status_id);
          return (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">{pedido.numero_pedido}</TableCell>
              <TableCell>{pedido.cliente_nome || '-'}</TableCell>
              <TableCell>
                {pedido.data_pedido ? new Date(pedido.data_pedido).toLocaleDateString('pt-BR') : '-'}
              </TableCell>
              <TableCell>
                {pedido.data_entrega ? new Date(pedido.data_entrega).toLocaleDateString('pt-BR') : '-'}
              </TableCell>
              <TableCell className="text-right">
                R$ {pedido.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(pedido)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(pedido)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(pedido)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

