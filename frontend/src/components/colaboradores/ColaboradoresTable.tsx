import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface ColaboradoresTableProps {
  colaboradores: any[];
  loading?: boolean;
  onView: (colaborador: any) => void;
  onEdit: (colaborador: any) => void;
  onDelete: (colaborador: any) => void;
}

export function ColaboradoresTable({ colaboradores, loading, onView, onEdit, onDelete }: ColaboradoresTableProps) {
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Carregando...</div></div>;
  if (!colaboradores.length) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Nenhum colaborador encontrado.</div></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colaboradores.map((colaborador) => (
          <TableRow key={colaborador.id}>
            <TableCell className="font-medium">{colaborador.nome}</TableCell>
            <TableCell>{colaborador.cargo || '-'}</TableCell>
            <TableCell>{colaborador.email || '-'}</TableCell>
            <TableCell>{colaborador.telefone || '-'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(colaborador)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(colaborador)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(colaborador)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
