import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, User, Bell, Shield, Palette, Settings, Save, CheckCircle, Loader2, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { useEmpresas, useCreateEmpresa, useUpdateEmpresa, useColaboradores, useCreateColaborador, useUpdateColaborador, useDeleteColaborador } from '@/hooks/useGraphQL';
import { useNotifications } from '@/components/NotificationSystem';

const Configuracoes: React.FC = () => {
  const notifications = useNotifications();
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [menuCompacto, setMenuCompacto] = useState(false);
  const [resumoDiario, setResumoDiario] = useState(true);
  const [alertasVencimento, setAlertasVencimento] = useState(true);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [empresaData, setEmpresaData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    ie: '',
    endereco: '',
    telefone: '',
    email: ''
  });

  const [senhaData, setSenhaData] = useState({
    atual: '',
    nova: '',
    confirmar: ''
  });
  const [parametrosData, setParametrosData] = useState({
    salarioMinimo: 0,
    percentualReajuste: 0,
    diasVencimentoFatura: 0,
    taxaJurosMora: 0,
    dataVigencia: ''
  });
  const [isColaboradorDialogOpen, setIsColaboradorDialogOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<any>(null);
  const [colaboradorForm, setColaboradorForm] = useState({
    cpf: '',
    nome_completo: '',
    email: '',
    senha: '',
    telefone: '',
    tipo_colaborador: 'Funcionário',
    data_admissao: new Date().toISOString().split('T')[0],
    comissao_venda: 0,
    comissao_recorrente: 0
  });

  // GraphQL hooks
  const { data: empresasData, loading: loadingEmpresas, refetch: refetchEmpresas } = useEmpresas();
  const { data: colaboradoresData, loading: loadingColaboradores, refetch: refetchColaboradores } = useColaboradores();
  const createEmpresa = useCreateEmpresa();
  const updateEmpresa = useUpdateEmpresa();
  const createColaborador = useCreateColaborador();
  const updateColaborador = useUpdateColaborador();
  const deleteColaborador = useDeleteColaborador();

  // Set initial data from GraphQL
  useEffect(() => {
    if (empresasData && empresasData.length > 0) {
      const empresa = empresasData[0];
      setEmpresaData({
        razaoSocial: empresa.razao_social || '',
        nomeFantasia: empresa.nome_fantasia || '',
        cnpj: empresa.cnpj || '',
        ie: '',
        endereco: '',
        telefone: empresa.telefone || '',
        email: empresa.email || ''
      });
    }
  }, [empresasData]);

  const handleSaveEmpresa = async () => {
    try {
      if (empresasData && empresasData.length > 0) {
        await updateEmpresa.mutate({
          variables: {
            id: empresasData[0].id,
            input: {
              razao_social: empresaData.razaoSocial,
              nome_fantasia: empresaData.nomeFantasia,
              cnpj: empresaData.cnpj,
              telefone: empresaData.telefone,
              email: empresaData.email
            }
          }
        });
      } else {
        await createEmpresa.mutate({
          variables: {
            input: {
              razao_social: empresaData.razaoSocial,
              nome_fantasia: empresaData.nomeFantasia,
              cnpj: empresaData.cnpj,
              telefone: empresaData.telefone,
              email: empresaData.email,
              ativo: true
            }
          }
        });
      }
      refetchEmpresas();
      notifications.success('Sucesso!', 'Dados da empresa salvos com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar dados da empresa. Tente novamente.');
    }
  };

  const handleSaveUsuario = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Perfil do usuário salvo com sucesso!');
      setIsSuccessDialogOpen(true);
    } catch (error) {
      alert('Erro ao salvar perfil. Tente novamente.');
    }
  };

  const handleSaveNotificacoes = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      notifications.success('Sucesso!', 'Preferências de notificação salvas com sucesso!');
      
      // Demonstração das notificações
      if (notificacoesEmail) {
        setTimeout(() => notifications.info('Notificações por E-mail', 'Você receberá atualizações importantes por e-mail'), 1000);
      }
      if (notificacoesPush) {
        setTimeout(() => notifications.info('Notificações Push', 'Você receberá alertas em tempo real'), 2000);
      }
      if (resumoDiario) {
        setTimeout(() => notifications.info('Resumo Diário', 'Você receberá um resumo diário das atividades'), 3000);
      }
      if (alertasVencimento) {
        setTimeout(() => notifications.warning('Alertas de Vencimento', 'Você será notificado sobre faturas e prazos'), 4000);
      }
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar preferências. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAparencia = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      notifications.success('Sucesso!', 'Configurações de aparência salvas com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveParametros = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      notifications.success('Sucesso!', 'Parâmetros do sistema salvos com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar parâmetros. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const currentPassword = senhaData.atual;
    const newPassword = senhaData.nova;
    const confirmPassword = senhaData.confirmar;

    if (!currentPassword || !newPassword || !confirmPassword) {
      notifications.warning('Atenção!', 'Por favor, preencha todos os campos de senha.');
      return;
    }

    if (newPassword !== confirmPassword) {
      notifications.error('Erro!', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    if (newPassword.length < 8) {
      notifications.warning('Atenção!', 'A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      notifications.success('Sucesso!', 'Senha alterada com sucesso!');
      setSenhaData({ atual: '', nova: '', confirmar: '' });
    } catch (error) {
      notifications.error('Erro!', 'Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate2FA = async () => {
    setIsLoading(true);
    try {
      // Simulate 2FA activation
      await new Promise(resolve => setTimeout(resolve, 2000));
      notifications.success('Sucesso!', 'Autenticação de dois fatores ativada com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao ativar 2FA. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddColaborador = async (colaboradorData: any) => {
    try {
      await createColaborador.mutate({
        variables: { input: colaboradorData }
      });
      refetchColaboradores();
      notifications.success('Sucesso!', 'Colaborador adicionado com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao adicionar colaborador. Tente novamente.');
    }
  };

  const handleEditColaborador = async (id: number, colaboradorData: any) => {
    try {
      await updateColaborador.mutate({
        variables: { id, input: colaboradorData }
      });
      refetchColaboradores();
      notifications.success('Sucesso!', 'Colaborador atualizado com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao atualizar colaborador. Tente novamente.');
    }
  };

  const handleDeleteColaborador = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este colaborador?')) return;

    try {
      await deleteColaborador.mutate({
        variables: { id }
      });
      refetchColaboradores();
      notifications.success('Sucesso!', 'Colaborador excluído com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao excluir colaborador. Tente novamente.');
    }
  };



  return (
    <AdminLayout title="Configurações">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto">
            <TabsTrigger value="empresa" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Empresa
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Usuários
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notificações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Segurança
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Aparência
            </TabsTrigger>
            <TabsTrigger value="parametros" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Sistema
            </TabsTrigger>
          </TabsList>

          {/* Empresa */}
          <TabsContent value="empresa" key="tab-empresa">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>Informações cadastrais da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input
                      id="razaoSocial"
                      value={empresaData.razaoSocial}
                      onChange={(e) => setEmpresaData({ ...empresaData, razaoSocial: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                    <Input
                      id="nomeFantasia"
                      value={empresaData.nomeFantasia}
                      onChange={(e) => setEmpresaData({ ...empresaData, nomeFantasia: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={empresaData.cnpj}
                      onChange={(e) => setEmpresaData({ ...empresaData, cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ie">Inscrição Estadual</Label>
                    <Input
                      id="ie"
                      value={empresaData.ie}
                      onChange={(e) => setEmpresaData({ ...empresaData, ie: e.target.value })}
                      placeholder="000.000.000.000"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco">Endereço *</Label>
                    <Input
                      id="endereco"
                      value={empresaData.endereco}
                      onChange={(e) => setEmpresaData({ ...empresaData, endereco: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={empresaData.telefone}
                      onChange={(e) => setEmpresaData({ ...empresaData, telefone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailEmpresa">E-mail *</Label>
                    <Input
                      id="emailEmpresa"
                      type="email"
                      value={empresaData.email}
                      onChange={(e) => setEmpresaData({ ...empresaData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleSaveEmpresa}
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : <><Save className="h-4 w-4 mr-2" /> Salvar Alterações</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuários */}
          <TabsContent value="usuarios" key="tab-usuarios">
            <div className="space-y-6">
              {/* Gerenciamento de Colaboradores */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Gerenciamento de Colaboradores</CardTitle>
                      <CardDescription>Adicione, edite ou remova colaboradores do sistema</CardDescription>
                    </div>
                    <Button
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => {
                        setEditingColaborador(null);
                        setColaboradorForm({
                          cpf: '',
                          nome_completo: '',
                          email: '',
                          senha: '',
                          telefone: '',
                          tipo_colaborador: 'Funcionário',
                          data_admissao: new Date().toISOString().split('T')[0],
                          comissao_venda: 0,
                          comissao_recorrente: 0
                        });
                        setIsColaboradorDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Novo Colaborador
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="border rounded-lg overflow-hidden">
                    {loadingColaboradores ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
                        <p className="text-muted-foreground">Carregando...</p>
                      </div>
                    ) : !colaboradoresData || colaboradoresData.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground bg-muted/20">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Nenhum colaborador cadastrado</p>
                        <p className="text-sm mt-1">Clique em "Novo Colaborador" para começar</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 border-b">
                            <tr>
                              <th className="text-left p-3 font-medium text-sm">Nome</th>
                              <th className="text-left p-3 font-medium text-sm hidden md:table-cell">E-mail</th>
                              <th className="text-left p-3 font-medium text-sm hidden lg:table-cell">Cargo</th>
                              <th className="text-left p-3 font-medium text-sm hidden lg:table-cell">Departamento</th>
                              <th className="text-left p-3 font-medium text-sm hidden sm:table-cell">Status</th>
                              <th className="text-right p-3 font-medium text-sm">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {colaboradoresData && colaboradoresData.map((colaborador: any) => (
                              <tr key={colaborador.id} className="hover:bg-muted/20 transition-colors">
                                <td className="p-3">
                                  <div>
                                    <p className="font-medium text-sm">{colaborador.nome_completo}</p>
                                    <p className="text-xs text-muted-foreground md:hidden">{colaborador.email}</p>
                                  </div>
                                </td>
                                <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">
                                  {colaborador.email}
                                </td>
                                <td className="p-3 text-sm hidden lg:table-cell">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {colaborador.tipo_colaborador || 'Funcionário'}
                                  </span>
                                </td>
                                <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell">
                                  {colaborador.departamento || '-'}
                                </td>
                                <td className="p-3 hidden sm:table-cell">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    colaborador.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {colaborador.ativo ? 'Ativo' : 'Inativo'}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingColaborador(colaborador);
                                        setColaboradorForm({
                                          cpf: colaborador.cpf || '',
                                          nome_completo: colaborador.nome_completo,
                                          email: colaborador.email,
                                          senha: '', // Não preencher senha ao editar
                                          telefone: colaborador.telefone || '',
                                          tipo_colaborador: colaborador.tipo_colaborador || 'Funcionário',
                                          data_admissao: colaborador.data_admissao ? colaborador.data_admissao.split('T')[0] : new Date().toISOString().split('T')[0],
                                          comissao_venda: colaborador.comissao_venda || 0,
                                          comissao_recorrente: colaborador.comissao_recorrente || 0
                                        });
                                        setIsColaboradorDialogOpen(true);
                                      }}
                                      className="hover:bg-blue-100 hover:text-blue-700"
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="ml-1 hidden sm:inline">Editar</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteColaborador(colaborador.id)}
                                      className="hover:bg-red-100 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="ml-1 hidden sm:inline">Excluir</span>
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
              </Card>
            </div>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes" key="tab-notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>Configure como deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações por E-mail</p>
                    <p className="text-sm text-muted-foreground">Receba atualizações importantes por e-mail</p>
                  </div>
                  <Switch checked={notificacoesEmail} onCheckedChange={setNotificacoesEmail} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-sm text-muted-foreground">Receba alertas em tempo real no navegador</p>
                  </div>
                  <Switch checked={notificacoesPush} onCheckedChange={setNotificacoesPush} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Resumo Diário</p>
                    <p className="text-sm text-muted-foreground">Receba um resumo diário das atividades</p>
                  </div>
                  <Switch checked={resumoDiario} onCheckedChange={setResumoDiario} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas de Vencimento</p>
                    <p className="text-sm text-muted-foreground">Seja notificado sobre faturas e prazos</p>
                  </div>
                  <Switch checked={alertasVencimento} onCheckedChange={setAlertasVencimento} />
                </div>
                <Button
                  type="button"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveNotificacoes();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : <><Save className="h-4 w-4 mr-2" /> Salvar Preferências</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="seguranca" key="tab-seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>Gerencie a segurança do seu acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual">Senha Atual *</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      placeholder="Digite sua senha atual"
                      value={senhaData.atual}
                      onChange={(e) => setSenhaData({ ...senhaData, atual: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novaSenha">Nova Senha *</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      placeholder="Digite a nova senha"
                      value={senhaData.nova}
                      onChange={(e) => setSenhaData({ ...senhaData, nova: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Confirme a nova senha"
                      value={senhaData.confirmar}
                      onChange={(e) => setSenhaData({ ...senhaData, confirmar: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleChangePassword}
                  disabled={isLoading}
                >
                  {isLoading ? 'Alterando...' : 'Alterar Senha'}
                </Button>

                <div className="border-t pt-4 mt-6">
                  <h4 className="font-medium mb-4">Autenticação em Dois Fatores</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleActivate2FA}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Ativando...' : 'Ativar 2FA'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aparência */}
          <TabsContent value="aparencia" key="tab-aparencia">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>Personalize a interface do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tema Escuro</p>
                    <p className="text-sm text-muted-foreground">Ative o modo escuro para reduzir o cansaço visual</p>
                  </div>
                  <Switch checked={temaEscuro} onCheckedChange={setTemaEscuro} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Menu Compacto</p>
                    <p className="text-sm text-muted-foreground">Reduza o tamanho do menu lateral</p>
                  </div>
                  <Switch checked={menuCompacto} onCheckedChange={setMenuCompacto} />
                </div>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleSaveAparencia}
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : <><Save className="h-4 w-4 mr-2" /> Salvar Configurações</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sistema */}
          <TabsContent value="parametros" key="tab-parametros">
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros do Sistema</CardTitle>
                <CardDescription>Configure os parâmetros gerais do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salarioMinimo">Salário Mínimo (R$)</Label>
                    <Input
                      id="salarioMinimo"
                      type="number"
                      step="0.01"
                      value={parametrosData.salarioMinimo}
                      onChange={(e) => setParametrosData({ ...parametrosData, salarioMinimo: parseFloat(e.target.value) || 0 })}
                      placeholder="1320.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentualReajuste">Percentual de Reajuste (%)</Label>
                    <Input
                      id="percentualReajuste"
                      type="number"
                      step="0.01"
                      value={parametrosData.percentualReajuste}
                      onChange={(e) => setParametrosData({ ...parametrosData, percentualReajuste: parseFloat(e.target.value) || 0 })}
                      placeholder="10.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diasVencimentoFatura">Dias para Vencimento da Fatura</Label>
                    <Input
                      id="diasVencimentoFatura"
                      type="number"
                      value={parametrosData.diasVencimentoFatura}
                      onChange={(e) => setParametrosData({ ...parametrosData, diasVencimentoFatura: parseInt(e.target.value) || 0 })}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxaJurosMora">Taxa de Juros de Mora (%)</Label>
                    <Input
                      id="taxaJurosMora"
                      type="number"
                      step="0.01"
                      value={parametrosData.taxaJurosMora}
                      onChange={(e) => setParametrosData({ ...parametrosData, taxaJurosMora: parseFloat(e.target.value) || 0 })}
                      placeholder="2.00"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="dataVigencia">Data de Vigência</Label>
                    <Input
                      id="dataVigencia"
                      type="date"
                      value={parametrosData.dataVigencia}
                      onChange={(e) => setParametrosData({ ...parametrosData, dataVigencia: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleSaveParametros}
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : <><Save className="h-4 w-4 mr-2" /> Salvar Parâmetros</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Sucesso
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{successMessage}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsSuccessDialogOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Colaborador Dialog */}
      <Dialog open={isColaboradorDialogOpen} onOpenChange={setIsColaboradorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingColaborador ? 'Editar Colaborador' : 'Novo Colaborador'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colaboradorNome">Nome Completo *</Label>
                <Input
                  id="colaboradorNome"
                  value={colaboradorForm.nome_completo}
                  onChange={(e) => setColaboradorForm({ ...colaboradorForm, nome_completo: e.target.value })}
                  placeholder="João da Silva"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colaboradorCPF">CPF *</Label>
                <Input
                  id="colaboradorCPF"
                  value={colaboradorForm.cpf}
                  onChange={(e) => setColaboradorForm({ ...colaboradorForm, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colaboradorEmail">E-mail *</Label>
                <Input
                  id="colaboradorEmail"
                  type="email"
                  value={colaboradorForm.email}
                  onChange={(e) => setColaboradorForm({ ...colaboradorForm, email: e.target.value })}
                  placeholder="joao@empresa.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colaboradorTelefone">Telefone *</Label>
                <Input
                  id="colaboradorTelefone"
                  value={colaboradorForm.telefone}
                  onChange={(e) => setColaboradorForm({ ...colaboradorForm, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colaboradorSenha">{editingColaborador ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}</Label>
              <Input
                id="colaboradorSenha"
                type="password"
                value={colaboradorForm.senha}
                onChange={(e) => setColaboradorForm({ ...colaboradorForm, senha: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                required={!editingColaborador}
              />
              {!editingColaborador && (
                <p className="text-xs text-muted-foreground">A senha deve ter no mínimo 8 caracteres</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colaboradorTipo">Tipo de Colaborador *</Label>
                <select
                  id="colaboradorTipo"
                  value={colaboradorForm.tipo_colaborador}
                  onChange={(e) => setColaboradorForm({ ...colaboradorForm, tipo_colaborador: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="Funcionário">Funcionário</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Diretor">Diretor</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Suporte">Suporte</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colaboradorDataAdmissao">Data de Admissão *</Label>
                <Input
                  id="colaboradorDataAdmissao"
                  type="date"
                  value={colaboradorForm.data_admissao}
                  onChange={(e) => setColaboradorForm({ ...colaboradorForm, data_admissao: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3 text-sm">Comissões</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="colaboradorComissaoVenda">Comissão por Venda (%)</Label>
                  <Input
                    id="colaboradorComissaoVenda"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={colaboradorForm.comissao_venda}
                    onChange={(e) => setColaboradorForm({ ...colaboradorForm, comissao_venda: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colaboradorComissaoRecorrente">Comissão Recorrente (%)</Label>
                  <Input
                    id="colaboradorComissaoRecorrente"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={colaboradorForm.comissao_recorrente}
                    onChange={(e) => setColaboradorForm({ ...colaboradorForm, comissao_recorrente: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsColaboradorDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={async () => {
                // Validações
                if (!colaboradorForm.nome_completo || !colaboradorForm.email || !colaboradorForm.cpf || !colaboradorForm.telefone) {
                  notifications.warning('Atenção!', 'Por favor, preencha todos os campos obrigatórios.');
                  return;
                }
                
                if (!editingColaborador && !colaboradorForm.senha) {
                  notifications.warning('Atenção!', 'A senha é obrigatória para novos colaboradores.');
                  return;
                }
                
                if (colaboradorForm.senha && colaboradorForm.senha.length < 8) {
                  notifications.warning('Atenção!', 'A senha deve ter no mínimo 8 caracteres.');
                  return;
                }

                // Validação de CPF (formato básico)
                const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                if (!cpfRegex.test(colaboradorForm.cpf)) {
                  notifications.error('Erro!', 'CPF inválido. Use o formato: 000.000.000-00');
                  return;
                }

                // Validação de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(colaboradorForm.email)) {
                  notifications.error('Erro!', 'E-mail inválido.');
                  return;
                }

                if (editingColaborador) {
                  await handleEditColaborador(editingColaborador.id, colaboradorForm);
                } else {
                  await handleAddColaborador(colaboradorForm);
                }
                setIsColaboradorDialogOpen(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : editingColaborador ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Configuracoes;