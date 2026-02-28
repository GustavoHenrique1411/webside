import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Eye, Edit, Download, FileText, Trash2 } from 'lucide-react';
import { Orcamento, STATUS_COLORS, formatCurrency, formatDate } from '@/types/orcamento';

interface OrcamentosTableProps {
  orcamentos: Orcamento[];
  onView: (orcamento: Orcamento) => void;
  onEdit: (orcamento: Orcamento) => void;
  onDelete: (orcamento: Orcamento, id: number) => void;
  onGenerateDocument: (orcamento: Orcamento) => void;
  onStatusChange: (orcamento: Orcamento, status: string) => void;
}

const OrcamentosTable: React.FC<OrcamentosTableProps> = ({
  orcamentos,
  onView,
  onEdit,
  onDelete,
  onGenerateDocument,
  onStatusChange
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Validade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orcamentos.map((orc) => (
          <TableRow key={orc.id}>
            <TableCell className="font-mono text-sm">{orc.numero_orcamento}</TableCell>
            <TableCell className="font-medium">{orc.cliente_nome}</TableCell>
            <TableCell>{formatCurrency(orc.valor_total)}</TableCell>
            <TableCell>{formatDate(orc.data_criacao)}</TableCell>
            <TableCell>{orc.validade_dias} dias</TableCell>
            <TableCell>
              <Badge className={STATUS_COLORS[orc.status_nome] || 'bg-gray-100'}>
                {orc.status_nome}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(orc)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(orc)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onGenerateDocument(orc)}>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Documento
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FileText className="h-4 w-4 mr-2" />
                      Alterar Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => onStatusChange(orc, 'Aguardando')}>
                        <Badge className="bg-yellow-100 text-yellow-800 mr-2">Aguardando</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(orc, 'Aprovado')}>
                        <Badge className="bg-green-100 text-green-800 mr-2">Aprovado</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(orc, 'Revisão')}>
                        <Badge className="bg-blue-100 text-blue-800 mr-2">Revisão</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(orc, 'Recusado')}>
                        <Badge className="bg-red-100 text-red-800 mr-2">Recusado</Badge>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    onClick={() => onDelete(orc, orc.id)}
                    className="text-red-600 focus:text-red-600"
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

export default OrcamentosTable;

