import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface FaturasTableProps {
  faturas: any[];
  loading?: boolean;
  onView: (fatura: any) => void;
  onEdit: (fatura: any) => void;
  onDelete: (fatura: any) => void;
}

export function FaturasTable({ faturas, loading, onView, onEdit, onDelete }: FaturasTableProps) {
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Carregando...</div></div>;
  if (!faturas.length) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Nenhuma fatura encontrada.</div></div>;

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-500',
    paga: 'bg-green-500',
    vencida: 'bg-red-500',
    cancelada: 'bg-gray-500',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descricao</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead>Data Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {faturas.map((fatura) => (
          <TableRow key={fatura.id}>
            <TableCell className="font-medium">{fatura.descricao}</TableCell>
            <TableCell className="text-right">R$ {fatura.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
            <TableCell>{fatura.data_vencimento ? new Date(fatura.data_vencimento).toLocaleDateString('pt-BR') : '-'}</TableCell>
            <TableCell>
              <Badge className={statusColors[fatura.status] || 'bg-gray-500'}>
                {fatura.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(fatura)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(fatura)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(fatura)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

