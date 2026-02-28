import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Loader2,
  Package as PackageIcon,
  Hash,
  DollarSign,
  Layers,
  Archive,
  X,
  Save,
  PackagePlus,
  Tag,
  Eye
} from 'lucide-react';
import { useNotifications } from '@/components/NotificationSystem';
import { ProdutoFormDialog, ProdutoViewDialog } from '@/components/produtos';

interface Produto {
  id: number;
  codigo_produto: string;
  nome: string;
  descricao: string;
  tipo_produto: string;
  categoria: string;
  valor_base: number;
  unidade_medida: string;
  estoque_minimo: number;
  ativo: boolean;
}

interface ProdutosTabProps {
  produtosData: Produto[];
  loading: boolean;
  createProduto: any;
  updateProduto: any;
  deleteProduto: any;
  refetchProdutos: () => void;
  isLoading: boolean;
}

const PRODUTO_TIPOS = [
  { value: 'produto', label: 'Produto Físico' },
  { value: 'servico', label: 'Serviço' },
];

const CATEGORIAS_COMUNS = [
  'Software',
  'Hardware',
  'Consultoria',
  'Implementação',
  'Suporte',
  'Manutenção',
  'Licença',
  'Infraestrutura',
  'Treinamento',
  'Outro'
];

export function ProdutosTab({ 
  produtosData, 
  loading, 
  createProduto, 
  updateProduto, 
  deleteProduto, 
  refetchProdutos,
  isLoading 
}: ProdutosTabProps) {
  const notifications = useNotifications();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [editingProduto, setEditingProduto] = React.useState<Produto | null>(null);
  const [viewingProduto, setViewingProduto] = React.useState<Produto | null>(null);
  const [form, setForm] = React.useState({
    codigo_produto: '',
    nome: '',
    descricao: '',
    tipo_produto: 'servico',
    categoria: '',
    valor_base: 0,
    unidade_medida: 'un',
    estoque_minimo: 0,
    ativo: true
  });

  const handleOpenNew = () => {
    setEditingProduto(null);
    setForm({
      codigo_produto: '',
      nome: '',
      descricao: '',
      tipo_produto: 'servico',
      categoria: '',
      valor_base: 0,
      unidade_medida: 'un',
      estoque_minimo: 0,
      ativo: true
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setForm({
      codigo_produto: produto.codigo_produto || '',
      nome: produto.nome || '',
      descricao: produto.descricao || '',
      tipo_produto: produto.tipo_produto || 'servico',
      categoria: produto.categoria || '',
      valor_base: produto.valor_base || 0,
      unidade_medida: produto.unidade_medida || 'un',
      estoque_minimo: produto.estoque_minimo || 0,
      ativo: produto.ativo !== false
    });
    setIsDialogOpen(true);
  };

  const handleView = (produto: Produto) => {
    setViewingProduto(produto);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto/serviço?')) return;
    try {
      await deleteProduto.mutate({ variables: { id } });
      refetchProdutos();
      notifications.success('Sucesso!', 'Produto/Serviço excluído com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao excluir produto/serviço.');
    }
  };

  const handleSave = async () => {
    if (!form.nome || !form.codigo_produto) {
      notifications.warning('Atenção!', 'Preencha o nome e código do produto.');
      return;
    }
    try {
      if (editingProduto) {
        await updateProduto.mutate({ variables: { id: editingProduto.id, input: form } });
      } else {
        await createProduto.mutate({ variables: { input: form } });
      }
      refetchProdutos();
      notifications.success('Sucesso!', editingProduto ? 'Produto/Serviço atualizado!' : 'Produto/Serviço adicionado!');
      setIsDialogOpen(false);
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar produto/serviço.');
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipoColors: Record<string, string> = {
      'produto': 'bg-blue-100 text-blue-800',
      'servico': 'bg-purple-100 text-purple-800',
    };
    return tipoColors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'produto': 'Produto',
      'servico': 'Serviço',
    };
    return labels[tipo] || tipo;
  };

  // Calcula estatísticas
  const totalProdutos = produtosData.filter(p => p.tipo_produto === 'produto').length;
  const totalServicos = produtosData.filter(p => p.tipo_produto === 'servico').length;
  const produtosAtivos = produtosData.filter(p => p.ativo).length;

  return (
    <Card className="overflow-hidden border-2">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-background px-6 py-4 border-b">
        <CardHeader className="p-0 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Gerenciamento de Produtos e Serviços</CardTitle>
                <CardDescription>Cadastre e gerencie o catálogo de produtos e serviços</CardDescription>
              </div>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 h-10" onClick={handleOpenNew}>
              <Plus className="h-4 w-4 mr-2" /> Novo Item
            </Button>
          </div>
        </CardHeader>
      </div>
      
      <CardContent className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PackageIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total de Produtos</p>
                <p className="text-2xl font-bold text-blue-800">{totalProdutos}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Total de Serviços</p>
                <p className="text-2xl font-bold text-purple-800">{totalServicos}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Itens Ativos</p>
                <p className="text-2xl font-bold text-green-800">{produtosAtivos}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-12 bg-muted/20">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-500" />
              <p className="text-muted-foreground">Carregando produtos e serviços...</p>
            </div>
          ) : !produtosData || produtosData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <PackagePlus className="h-8 w-8 text-blue-500" />
              </div>
              <p className="font-medium text-lg">Nenhum produto ou serviço cadastrado</p>
              <p className="text-sm mt-1">Clique em "Novo Item" para adicionar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Código</th>
                    <th className="text-left p-4 font-medium text-sm">Nome</th>
                    <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Tipo</th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Categoria</th>
                    <th className="text-right p-4 font-medium text-sm hidden md:table-cell">Valor</th>
                    <th className="text-left p-4 font-medium text-sm hidden sm:table-cell">Status</th>
                    <th className="text-right p-4 font-medium text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {produtosData.map((produto) => (
                    <tr key={produto.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Hash className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-mono text-sm">{produto.codigo_produto}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{produto.nome}</p>
                          {produto.descricao && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{produto.descricao}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge className={getTipoBadge(produto.tipo_produto)}>
                          {getTipoLabel(produto.tipo_produto)}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">{produto.categoria || '-'}</span>
                      </td>
                      <td className="p-4 hidden md:table-cell text-right">
                        <span className="font-mono text-sm font-medium">
                          R$ {produto.valor_base?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${produto.ativo ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-sm font-medium ${produto.ativo ? 'text-green-700' : 'text-red-700'}`}>
                            {produto.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleView(produto)} className="hover:bg-blue-50 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(produto)} className="hover:bg-blue-50 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(produto.id)} className="hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>

      {/* Dialog de Formulário */}
      <ProdutoFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        produto={editingProduto}
        onSubmit={handleSave}
        loading={isLoading}
      />

      {/* Dialog de Visualização */}
      {viewingProduto && (
        <ProdutoViewDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          produto={viewingProduto}
          onEdit={() => {
            setIsViewDialogOpen(false);
            handleEdit(viewingProduto);
          }}
        />
      )}
    </Card>
  );
}

export default ProdutosTab;

