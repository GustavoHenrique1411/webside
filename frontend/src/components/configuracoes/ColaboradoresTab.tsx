import React, { useState, useEffect } from 'react';
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
  Users, 
  Loader2,
  User,
  Hash,
  Mail,
  Phone,
  Lock,
  Briefcase,
  Calendar,
  X,
  Save,
  UserPlus,
  Shield,
  CheckCircle2,
  Building2,
  DollarSign,
  Percent,
  RefreshCw
} from 'lucide-react';
import { useNotifications } from '@/components/NotificationSystem';
import { apolloClient } from '@/lib/apollo';
import { GET_PERMISSOES } from '@/graphql/queries';

interface Permissao {
  id_permissao: number;
  nome_perfil: string;
  descricao?: string;
  nivel_acesso: number;
}

interface Colaborador {
  id: number;
  cpf: string;
  nome_completo: string;
  email: string;
  telefone: string;
  tipo_colaborador: string;
  ativo: boolean;
  perfil_nome?: string;
  departamentos?: string;
  comissao_venda?: number;
  comissao_recorrente?: number;
  data_admissao?: string;
  data_cadastro?: string;
  data_ultimo_login?: string;
  id_permissao?: number;
  nivel_acesso?: number;
}

interface Departamento {
  id: number;
  nome: string;
  descricao?: string;
  codigo?: string;
}

interface ColaboradoresTabProps {
  colaboradoresData: Colaborador[];
  loading: boolean;
  createColaborador: any;
  updateColaborador: any;
  deleteColaborador: any;
  refetchColaboradores: () => void;
  isLoading: boolean;
}

const COLABORADOR_TYPES = [
  { value: 'funcionario', label: 'Funcionário' },
  { value: 'terceiro', label: 'Terceiro' },
];

// Lista de departamentos sugeridos
const DEPARTAMENTOS_SUGERIDOS: Departamento[] = [
  { id: 1, nome: 'Vendas', codigo: 'VEND' },
  { id: 2, nome: 'Tecnologia', codigo: 'TI' },
  { id: 3, nome: 'Financeiro', codigo: 'FIN' },
  { id: 4, nome: 'Suporte', codigo: 'SUP' },
  { id: 5, nome: 'Recursos Humanos', codigo: 'RH' },
  { id: 6, nome: 'Marketing', codigo: 'MKT' },
  { id: 7, nome: 'Operações', codigo: 'OPE' },
  { id: 8, nome: 'Comercial', codigo: 'COM' },
  { id: 9, nome: 'Contabilidade', codigo: 'CONT' },
  { id: 10, nome: 'Jurídico', codigo: 'JUR' },
  { id: 11, nome: 'Logística', codigo: 'LOG' },
  { id: 12, nome: 'Qualidade', codigo: 'QUAL' },
];

// Lista de perfis de acesso (fallback se banco não retornar)
const PERFIS_ACESSO_FALLBACK = [
  { value: 'admin', label: 'Administrador', nivel: 10, desc: 'Acesso total ao sistema' },
  { value: 'diretor', label: 'Diretor', nivel: 9, desc: 'Acesso total com poderes estratégicos' },
  { value: 'gerente', label: 'Gerente', nivel: 8, desc: 'Acesso completo a área' },
  { value: 'coordenador', label: 'Coordenador', nivel: 7, desc: 'Acesso com restrições' },
  { value: 'supervisor', label: 'Supervisor', nivel: 6, desc: 'Acesso limitado a equipe' },
  { value: 'vendedor', label: 'Vendedor', nivel: 5, desc: 'Acesso às vendas e clientes' },
  { value: 'financeiro', label: 'Financeiro', nivel: 6, desc: 'Acesso ao financeiro' },
  { value: 'tecnico', label: 'Técnico', nivel: 3, desc: 'Acesso às implantações' },
  { value: 'analista', label: 'Analista', nivel: 5, desc: 'Acesso analítico' },
  { value: 'assistente', label: 'Assistente', nivel: 1, desc: 'Acesso básico' },
  { value: 'auxiliar', label: 'Auxiliar', nivel: 2, desc: 'Acesso restrito' },
  { value: 'estagiario', label: 'Estagiário', nivel: 1, desc: 'Acesso mínimo' },
  { value: 'terceirizado', label: 'Terceirizado', nivel: 1, desc: 'Acesso externo' },
  { value: 'padrao', label: 'Padrão', nivel: 0, desc: 'Acesso básico padrão' },
];

export function ColaboradoresTab({ 
  colaboradoresData, 
  loading, 
  createColaborador, 
  updateColaborador, 
  deleteColaborador, 
  refetchColaboradores,
  isLoading 
}: ColaboradoresTabProps) {
  const notifications = useNotifications();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [loadingPermissoes, setLoadingPermissoes] = useState(false);
  
  const [form, setForm] = useState({
    cpf: '',
    nome_completo: '',
    email: '',
    senha: '',
    telefone: '',
    tipo_colaborador: 'funcionario',
    cargo: '',
    data_admissao: new Date().toISOString().split('T')[0],
    comissao_venda: 0,
    comissao_recorrente: 0,
    id_permissao: 1,
    ativo: true,
    departamentos: [] as number[],
    departamentos_custom: [] as { id: number; nome: string; codigo: string }[],
    perfil_acesso: 'admin',
    nivel_acesso: 10
  });

  // Carregar permissões do banco de dados
  const fetchPermissoes = async () => {
    setLoadingPermissoes(true);
    try {
      const result = await apolloClient.query({
        query: GET_PERMISSOES,
        fetchPolicy: 'network-only',
      }) as { data: { permissoes: Permissao[] } };
      if (result.data && result.data.permissoes) {
        setPermissoes(result.data.permissoes);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      // Fallback para lista estática
    } finally {
      setLoadingPermissoes(false);
    }
  };

  useEffect(() => {
    fetchPermissoes();
  }, []);

  const getPerfisAcesso = () => {
    if (permissoes && permissoes.length > 0) {
      return permissoes.map(p => ({
        value: String(p.id_permissao),
        label: p.nome_perfil,
        nivel: p.nivel_acesso,
        desc: p.descricao || 'Acesso ao sistema'
      }));
    }
    return PERFIS_ACESSO_FALLBACK;
  };

  const handleOpenNew = () => {
    setEditingColaborador(null);
    setForm({
      cpf: '',
      nome_completo: '',
      email: '',
      senha: '',
      telefone: '',
      tipo_colaborador: 'funcionario',
      cargo: '',
      data_admissao: new Date().toISOString().split('T')[0],
      comissao_venda: 0,
      comissao_recorrente: 0,
      id_permissao: 1,
      ativo: true,
      departamentos: [],
      departamentos_custom: [],
      perfil_acesso: 'admin',
      nivel_acesso: 10
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (colaborador: Colaborador) => {
    setEditingColaborador(colaborador);
    let deptIds: number[] = [];
    if (colaborador.departamentos) {
      const deptMatches = colaborador.departamentos.match(/\((\d+)\)/g);
      if (deptMatches) {
        deptIds = deptMatches.map(m => parseInt(m.replace(/[()]/g, '')));
      }
    }
    
    // Encontrar perfil de acesso baseado no nível
    const perfilValue = String(colaborador.id_permissao || colaborador.nivel_acesso || 1);
    
    setForm({
      cpf: colaborador.cpf || '',
      nome_completo: colaborador.nome_completo,
      email: colaborador.email,
      senha: '',
      telefone: colaborador.telefone || '',
      tipo_colaborador: colaborador.tipo_colaborador || 'funcionario',
      cargo: '',
      data_admissao: colaborador.data_admissao || new Date().toISOString().split('T')[0],
      comissao_venda: Number(colaborador.comissao_venda) || 0,
      comissao_recorrente: Number(colaborador.comissao_recorrente) || 0,
      id_permissao: Number(colaborador.id_permissao) || 1,
      ativo: colaborador.ativo !== false,
      departamentos: deptIds,
      departamentos_custom: [],
      perfil_acesso: perfilValue,
      nivel_acesso: Number(colaborador.nivel_acesso) || 1
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este colaborador?')) return;
    try {
      await deleteColaborador.mutate({ variables: { id } });
      refetchColaboradores();
      notifications.success('Sucesso!', 'Colaborador excluído com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao excluir colaborador.');
    }
  };

  const validateForm = (): boolean => {
    if (!form.nome_completo?.trim()) {
      notifications.warning('Atenção!', 'O nome completo é obrigatório.');
      return false;
    }
    if (!form.email?.trim()) {
      notifications.warning('Atenção!', 'O e-mail é obrigatório.');
      return false;
    }
    if (!form.cpf?.trim()) {
      notifications.warning('Atenção!', 'O CPF é obrigatório.');
      return false;
    }
    if (!form.telefone?.trim()) {
      notifications.warning('Atenção!', 'O telefone é obrigatório.');
      return false;
    }
    if (!editingColaborador && !form.senha) {
      notifications.warning('Atenção!', 'A senha é obrigatória para novos colaboradores.');
      return false;
    }
    if (form.senha && form.senha.length < 8) {
      notifications.warning('Atenção!', 'A senha deve ter pelo menos 8 caracteres.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      notifications.warning('Atenção!', 'Por favor, insira um e-mail válido.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    if (editingColaborador) {
      if (!updateColaborador?.mutate) {
        notifications.error('Erro!', 'Função de atualização não disponível. Recarregue a página.');
        return;
      }
    } else {
      if (!createColaborador?.mutate) {
        notifications.error('Erro!', 'Função de criação não disponível. Recarregue a página.');
        return;
      }
    }
    
    // Build departamentos array for backend
    const deptos: { id?: number; nome: string; cargo: string }[] = [];
    
    DEPARTAMENTOS_SUGERIDOS.forEach(dept => {
      if (form.departamentos.includes(dept.id)) {
        if (!form.departamentos_custom.find(d => d.id === dept.id)) {
          deptos.push({ id: dept.id, nome: dept.nome, cargo: form.cargo || 'Colaborador' });
        }
      }
    });
    
    form.departamentos_custom.forEach(dept => {
      deptos.push({ nome: dept.nome, cargo: form.cargo || 'Colaborador' });
    });
    
    const formDataToSend: any = {
      ...form,
      comissao_venda: Number(form.comissao_venda) || 0,
      comissao_recorrente: Number(form.comissao_recorrente) || 0,
    };
    
    if (deptos.length > 0) {
      formDataToSend.departamentos = deptos;
    }
    
    try {
      if (editingColaborador) {
        const updateData = { ...formDataToSend };
        if (!updateData.senha) {
          delete updateData.senha;
        }
        await updateColaborador.mutate({ variables: { id: editingColaborador.id, input: updateData } });
      } else {
        await createColaborador.mutate({ variables: { input: formDataToSend } });
      }
      refetchColaboradores();
      notifications.success('Sucesso!', editingColaborador ? 'Colaborador atualizado com sucesso!' : 'Colaborador adicionado com sucesso!');
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Erro ao salvar colaborador:', error);
      notifications.error('Erro!', error?.message || 'Erro ao salvar colaborador. Verifique os dados e tente novamente.');
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipoColors: Record<string, string> = {
      'funcionario': 'bg-blue-100 text-blue-800',
      'terceiro': 'bg-orange-100 text-orange-800',
    };
    return tipoColors[tipo] || 'bg-blue-100 text-blue-800';
  };

  const toggleDepartamento = (deptId: number) => {
    setForm(prev => ({
      ...prev,
      departamentos: prev.departamentos.includes(deptId)
        ? prev.departamentos.filter(id => id !== deptId)
        : [...prev.departamentos, deptId]
    }));
  };

  const handlePerfilChange = (value: string) => {
    const perfil = getPerfisAcesso().find(p => p.value === value);
    setForm(prev => ({
      ...prev,
      perfil_acesso: value,
      nivel_acesso: perfil?.nivel || 1
    }));
  };

  return (
    <Card className="overflow-hidden border-2">
      <div className="bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-background px-6 py-4 border-b">
        <CardHeader className="p-0 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Gerenciamento de Colaboradores</CardTitle>
                <CardDescription>Adicione, edite ou remova colaboradores do sistema</CardDescription>
              </div>
            </div>
            <Button className="bg-purple-500 hover:bg-purple-600 h-10" onClick={handleOpenNew}>
              <Plus className="h-4 w-4 mr-2" /> Novo Colaborador
            </Button>
          </div>
        </CardHeader>
      </div>
      
      <CardContent className="p-6">
        <div className="border rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-12 bg-muted/20">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-purple-500" />
              <p className="text-muted-foreground">Carregando colaboradores...</p>
            </div>
          ) : !colaboradoresData || colaboradoresData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20">
              <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-purple-500" />
              </div>
              <p className="font-medium text-lg">Nenhum colaborador cadastrado</p>
              <p className="text-sm mt-1">Clique em "Novo Colaborador" para adicionar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-sm">Colaborador</th>
                    <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Contato</th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Tipo</th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Departamentos</th>
                    <th className="text-left p-4 font-medium text-sm hidden sm:table-cell">Status</th>
                    <th className="text-right p-4 font-medium text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {colaboradoresData.map((colaborador) => (
                    <tr key={colaborador.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <User className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{colaborador.nome_completo}</p>
                            <p className="text-xs text-muted-foreground">CPF: {colaborador.cpf}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {colaborador.email}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {colaborador.telefone || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <Badge className={getTipoBadge(colaborador.tipo_colaborador || 'funcionario')}>
                          {colaborador.tipo_colaborador === 'funcionario' ? 'Funcionário' : 'Terceiro'}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        {colaborador.departamentos ? (
                          <div className="flex flex-wrap gap-1">
                            {colaborador.departamentos.split(', ').map((dept, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {dept}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${colaborador.ativo ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-sm font-medium ${colaborador.ativo ? 'text-green-700' : 'text-red-700'}`}>
                            {colaborador.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(colaborador)} className="hover:bg-purple-50 hover:text-purple-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(colaborador.id)} className="hover:bg-red-50 hover:text-red-600">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[95vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 rounded-t-lg">
            <DialogHeader className="space-y-1 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {editingColaborador ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    {editingColaborador ? 'Editar Colaborador' : 'Novo Colaborador'}
                  </DialogTitle>
                  <DialogDescription className="text-purple-100 text-sm">
                    {editingColaborador ? 'Atualize os dados do colaborador' : 'Preencha os dados do novo colaborador'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Pessoais
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nome Completo *</Label>
                  <Input
                    value={form.nome_completo}
                    onChange={(e) => setForm({ ...form, nome_completo: e.target.value })}
                    placeholder="João da Silva"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">CPF *</Label>
                  <Input
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="h-11"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contato */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Informações de Contato
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">E-mail *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="joao@empresa.com"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Telefone *</Label>
                  <Input
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="h-11"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Segurança */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Segurança
              </h4>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {editingColaborador ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
                </Label>
                <Input
                  type="password"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  className="h-11"
                  required={!editingColaborador}
                />
                <p className="text-xs text-muted-foreground">A senha deve conter pelo menos 8 caracteres</p>
              </div>
            </div>

            <Separator />

            {/* Dados Profissionais */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Dados Profissionais
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo *</Label>
                  <select
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.tipo_colaborador}
                    onChange={(e) => setForm({ ...form, tipo_colaborador: e.target.value })}
                  >
                    {COLABORADOR_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Data Admissão</Label>
                  <Input
                    type="date"
                    value={form.data_admissao}
                    onChange={(e) => setForm({ ...form, data_admissao: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>

              {/* Cargo / Função - Nível de Acesso */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Nível de Acesso *
                    {loadingPermissoes && <RefreshCw className="h-3 w-3 animate-spin" />}
                  </Label>
                  <select
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.perfil_acesso}
                    onChange={(e) => handlePerfilChange(e.target.value)}
                  >
                    {getPerfisAcesso().map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label} (Nível {p.nivel})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    {getPerfisAcesso().find(p => p.value === form.perfil_acesso)?.desc}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cargo Específico</Label>
                  <Input
                    placeholder="Ex: Desenvolvedor Full Stack"
                    className="h-11"
                    value={form.cargo || ''}
                    onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comissão Venda (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={form.comissao_venda}
                    onChange={(e) => setForm({ ...form, comissao_venda: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Comissão Recorrente (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={form.comissao_recorrente}
                    onChange={(e) => setForm({ ...form, comissao_recorrente: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Departamentos */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Departamentos
              </h4>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Adicionar Departamento (digite e pressione Enter)</Label>
                <Input
                  placeholder="Ex: Qualidade, Projetos, Inovação..."
                  className="h-11"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const value = input.value.trim();
                      if (value) {
                        const customId = -Date.now();
                        const currentDepts = form.departamentos;
                        const customDepts = form.departamentos_custom || [];
                        if (!customDepts.find((d: any) => d.nome.toLowerCase() === value.toLowerCase())) {
                          setForm({
                            ...form,
                            departamentos_custom: [...customDepts, { id: customId, nome: value, codigo: value.substring(0, 4).toUpperCase() }],
                            departamentos: [...currentDepts, customId]
                          });
                        }
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DEPARTAMENTOS_SUGERIDOS.map(dept => (
                  <label
                    key={dept.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      form.departamentos.includes(dept.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-input hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.departamentos.includes(dept.id)}
                      onChange={() => toggleDepartamento(dept.id)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{dept.nome}</p>
                      <p className="text-xs text-muted-foreground">{dept.codigo}</p>
                    </div>
                  </label>
                ))}
              </div>
              
              {form.departamentos_custom && form.departamentos_custom.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.departamentos_custom.map((dept: any) => (
                    <Badge key={dept.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {dept.nome}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => {
                          const newDepts = form.departamentos.filter((d: number) => d !== dept.id);
                          const newCustomDepts = form.departamentos_custom.filter((d: any) => d.id !== dept.id);
                          setForm({
                            ...form,
                            departamentos: newDepts,
                            departamentos_custom: newCustomDepts
                          });
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {editingColaborador && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Status do Colaborador
                  </h4>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ativo"
                        checked={form.ativo === true}
                        onChange={() => setForm({ ...form, ativo: true })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Ativo
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ativo"
                        checked={form.ativo === false}
                        onChange={() => setForm({ ...form, ativo: false })}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Inativo
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {form.nome_completo && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {form.nome_completo}
                  </Badge>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-11 px-6">
                  <X className="h-4 w-4 mr-2" /> Cancelar
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 h-11 px-6" 
                  onClick={handleSave} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> {editingColaborador ? 'Atualizar' : 'Adicionar'}</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ColaboradoresTab;
