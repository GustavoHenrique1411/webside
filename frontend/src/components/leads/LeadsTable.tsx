import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Lead, STATUS_COLORS } from '@/types/lead';

interface LeadsTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange: (lead: Lead, status: string) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onView, onEdit, onDelete, onStatusChange }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Origem</TableHead>
          <TableHead className="w-[70px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">{lead.contato_principal}</TableCell>
            <TableCell>{lead.nome_empresa}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-sm">
                  <Phone className="h-3 w-3" /> {lead.telefone_contato}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Mail className="h-3 w-3" /> {lead.email_contato}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={STATUS_COLORS[lead.status_nome || ''] || 'bg-gray-100'}>
                {lead.status_nome}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{lead.fonte_lead}</Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(lead)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(lead)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Alterar Status</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => onStatusChange(lead, 'Novo')}>
                        <Badge className={`${STATUS_COLORS['Novo']} mr-2`}>Novo</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(lead, 'Contatado')}>
                        <Badge className={`${STATUS_COLORS['Contatado']} mr-2`}>Contatado</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(lead, 'Qualificado')}>
                        <Badge className={`${STATUS_COLORS['Qualificado']} mr-2`}>Qualificado</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(lead, 'Proposta')}>
                        <Badge className={`${STATUS_COLORS['Proposta']} mr-2`}>Proposta</Badge>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={() => onDelete(lead)} className="text-red-600">
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

export default LeadsTable;

