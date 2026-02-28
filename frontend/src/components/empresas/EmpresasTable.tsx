import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface EmpresasTableProps {
  empresas: any[];
  loading?: boolean;
  onView: (empresa: any) => void;
  onEdit: (empresa: any) => void;
  onDelete: (empresa: any) => void;
}

export function EmpresasTable({ empresas, loading, onView, onEdit, onDelete }: EmpresasTableProps) {
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Carregando...</div></div>;
  if (!empresas.length) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground">Nenhuma empresa encontrada.</div></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome Fantasia</TableHead>
          <TableHead>Razao Social</TableHead>
          <TableHead>CNPJ</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {empresas.map((empresa) => (
          <TableRow key={empresa.id}>
            <TableCell className="font-medium">{empresa.nome_fantasia}</TableCell>
            <TableCell>{empresa.razao_social || '-'}</TableCell>
            <TableCell>{empresa.cnpj || '-'}</TableCell>
            <TableCell>{empresa.telefone || '-'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(empresa)}><Eye className="mr-2 h-4 w-4" />Visualizar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(empresa)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(empresa)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
