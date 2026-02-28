import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface TransacoesTableProps {
  transacoes: any[];
  loading?: boolean;
  onView: (transacao: any) => void;
  onEdit: (transacao: any) => void;
  onDelete: (transacao: any) => void;
}

export function TransacoesTable({ transacoes, loading, onView, onEdit, onDelete }: TransacoesTableProps) {
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Carregando...</div></div>;
  if (!transacoes.length) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Nenhuma transacao encontrada.</div></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descricao</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transacoes.map((transacao) => {
          const isEntrada = transacao.tipo === 'entrada';
          return (
            <TableRow key={transacao.id}>
              <TableCell className="font-medium">{transacao.descricao}</TableCell>
              <TableCell><Badge variant={isEntrada ? 'default' : 'destructive'}>{isEntrada ? 'Entrada' : 'Saida'}</Badge></TableCell>
              <TableCell className="text-right">R$ {transacao.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>{transacao.data ? new Date(transacao.data).toLocaleDateString('pt-BR') : '-'}</TableCell>
              <TableCell>{transacao.categoria || '-'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(transacao)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(transacao)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(transacao)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
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
