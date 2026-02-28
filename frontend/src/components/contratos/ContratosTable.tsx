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
import { MoreHorizontal, Eye, Pencil, Trash2, FileText } from 'lucide-react';

interface ContratosTableProps {
  contratos: any[];
  loading?: boolean;
  onView: (contrato: any) => void;
  onEdit: (contrato: any) => void;
  onDelete: (contrato: any) => void;
  onGeneratePDF?: (contrato: any) => void;
}

export function ContratosTable({ contratos, loading, onView, onEdit, onDelete, onGeneratePDF }: ContratosTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!contratos.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Nenhum contrato encontrado.</div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      '1': { label: 'Ativo', variant: 'default' },
      '2': { label: 'Expirado', variant: 'secondary' },
      '3': { label: 'Cancelado', variant: 'destructive' },
      '4': { label: 'Renovado', variant: 'outline' },
    };
    return statusMap[status] || { label: status, variant: 'secondary' };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Término</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contratos.map((contrato) => {
          const statusInfo = getStatusBadge(contrato.status_id);
          return (
            <TableRow key={contrato.id}>
              <TableCell className="font-medium">{contrato.numero_contrato}</TableCell>
              <TableCell>{contrato.cliente_nome || '-'}</TableCell>
              <TableCell>
                {contrato.data_inicio ? new Date(contrato.data_inicio).toLocaleDateString('pt-BR') : '-'}
              </TableCell>
              <TableCell>
                {contrato.data_fim ? new Date(contrato.data_fim).toLocaleDateString('pt-BR') : '-'}
              </TableCell>
              <TableCell className="text-right">
                R$ {contrato.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                    <DropdownMenuItem onClick={() => onView(contrato)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    {onGeneratePDF && (
                      <DropdownMenuItem onClick={() => onGeneratePDF(contrato)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Gerar PDF
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onEdit(contrato)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(contrato)} className="text-red-600">
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

