import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Cliente, STATUS_COLORS } from '@/types/cliente';

interface ClientesTableProps {
  clientes: Cliente[];
  onView: (cliente: Cliente) => void;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
  onStatusChange: (cliente: Cliente, status: string) => void;
}

const ClientesTable: React.FC<ClientesTableProps> = ({
  clientes,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[200px]">Razão Social</TableHead>
          <TableHead className="min-w-[150px]">Nome Fantasia</TableHead>
          <TableHead className="min-w-[140px]">CNPJ</TableHead>
          <TableHead className="min-w-[100px]">Porte</TableHead>
          <TableHead className="min-w-[80px]">Status</TableHead>
          <TableHead className="w-[70px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.razao_social}</TableCell>
            <TableCell className="font-medium">{cliente.nome_fantasia}</TableCell>
            <TableCell className="font-mono text-sm">{cliente.cnpj}</TableCell>
            <TableCell>{cliente.porte_empresa}</TableCell>
            <TableCell>
              <Badge className={STATUS_COLORS[cliente.status_nome || ''] || 'bg-gray-100'}>
                {cliente.status_nome}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(cliente)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(cliente)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Edit className="h-4 w-4 mr-2" />
                      Alterar Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(cliente, 'Ativo')}
                        disabled={cliente.status_nome === 'Ativo'}
                      >
                        <Badge className={STATUS_COLORS['Ativo']}>Ativo</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(cliente, 'Inativo')}
                        disabled={cliente.status_nome === 'Inativo'}
                      >
                        <Badge className={STATUS_COLORS['Inativo']}>Inativo</Badge>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    onClick={() => onDelete(cliente)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientesTable;

