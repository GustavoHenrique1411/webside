import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface TransacaoViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transacao: any | null;
}

export function TransacaoViewDialog({ open, onOpenChange, transacao }: TransacaoViewDialogProps) {
  if (!transacao) return null;
  const isEntrada = transacao.tipo === 'entrada';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Transacao</DialogTitle>
          <DialogDescription>Informacoes completas da transacao.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-muted-foreground">Descricao</Label><p className="font-medium">{transacao.descricao}</p></div>
            <div className="space-y-2"><Label className="text-muted-foreground">Tipo</Label><p className="font-medium"><Badge variant={isEntrada ? 'default' : 'destructive'}>{isEntrada ? 'Entrada' : 'Saida'}</Badge></p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-muted-foreground">Valor</Label><p className="font-medium">R$ {transacao.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
            <div className="space-y-2"><Label className="text-muted-foreground">Data</Label><p className="font-medium">{transacao.data ? new Date(transacao.data).toLocaleDateString('pt-BR') : '-'}</p></div>
          </div>
          <div className="space-y-2"><Label className="text-muted-foreground">Categoria</Label><p className="font-medium">{transacao.categoria || '-'}</p></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
