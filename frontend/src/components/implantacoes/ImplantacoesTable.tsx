import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface ImplantacoesTableProps {
  implantacoes: any[];
  loading?: boolean;
  onView: (implantacao: any) => void;
  onEdit: (implantacao: any) => void;
  onDelete: (implantacao: any) => void;
}

export function ImplantacoesTable({ implantacoes, loading, onView, onEdit, onDelete }: ImplantacoesTableProps) {
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Carregando...</div></div>;
  if (!implantacoes.length) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Nenhuma implantacao encontrada.</div></div>;

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-500',
    em_andamento: 'bg-blue-500',
    concluida: 'bg-green-500',
    cancelada: 'bg-red-500',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descricao</TableHead>
          <TableHead>Data Inicio</TableHead>
          <TableHead>Data Fim</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {implantacoes.map((implantacao) => (
          <TableRow key={implantacao.id}>
            <TableCell className="font-medium">{implantacao.nome}</TableCell>
            <TableCell>{implantacao.descricao || '-'}</TableCell>
            <TableCell>{implantacao.data_inicio ? new Date(implantacao.data_inicio).toLocaleDateString('pt-BR') : '-'}</TableCell>
            <TableCell>{implantacao.data_fim ? new Date(implantacao.data_fim).toLocaleDateString('pt-BR') : '-'}</TableCell>
            <TableCell>
              <Badge className={statusColors[implantacao.status] || 'bg-gray-500'}>
                {implantacao.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(implantacao)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(implantacao)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(implantacao)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

