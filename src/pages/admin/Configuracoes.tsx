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
import { apiService } from '@/lib/api';

const Configuracoes: React.FC = () => {
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
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [isColaboradorDialogOpen, setIsColaboradorDialogOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<any>(null);
  const [colaboradorForm, setColaboradorForm] = useState({
    nome: '',
    email: '',
    cargo: '',
    departamento: ''
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch empresas (assuming first one is the current company)
        const empresas = await apiService.getEmpresas() as any[];
        if (empresas && empresas.length > 0) {
          const empresa = empresas[0];
          setEmpresaData({
            razaoSocial: empresa.razao_social || '',
            nomeFantasia: empresa.nome_fantasia || '',
            cnpj: empresa.cnpj || '',
            ie: empresa.inscricao_estadual || '',
            endereco: empresa.endereco || '',
            telefone: empresa.telefone || '',
            email: empresa.email || ''
          });
        }



        // Fetch system parameters
        const parametros = await apiService.getParametrosEmpresa() as any[];
        if (parametros && parametros.length > 0) {
          const param = parametros[0];
          setParametrosData({
            salarioMinimo: param.salario_minimo || 0,
            percentualReajuste: param.percentual_reajuste || 0,
            diasVencimentoFatura: param.dias_vencimento_fatura || 0,
            taxaJurosMora: param.taxa_juros_mora || 0,
            dataVigencia: param.data_vigencia || new Date().toISOString().split('T')[0]
          });
        }

        // Fetch colaboradores
        const colaboradoresData = await apiService.getColaboradores() as any[];
        setColaboradores(colaboradoresData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Erro ao carregar dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveEmpresa = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Dados da empresa salvos com sucesso!');
      setIsSuccessDialogOpen(true);
    } catch (error) {
      alert('Erro ao salvar dados da empresa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUsuario = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Perfil do usuário salvo com sucesso!');
      setIsSuccessDialogOpen(true);
    } catch (error) {
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotificacoes = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Preferências de notificação salvas com sucesso!');
      setIsSuccessDialogOpen(true);
    } catch (error) {
      alert('Erro ao salvar preferências. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAparencia = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Configurações de aparência salvas com sucesso!');
      setIsSuccessDialogOpen(true);
    } catch (error) {
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveParametros = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Parâmetros do sistema salvos com sucesso!');
      setIsSuccessDialogOpen(true);
    } catch (error) {
      alert('Erro ao salvar parâmetros. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const currentPassword = senhaData.atual;
    const newPassword = senhaData.nova;
    const confirmPassword = senhaData.confirmar;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Por favor, preencha todos os campos de senha.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (newPassword.length < 8) {
      alert('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage('Senha alterada com sucesso!');
      setIsSuccessDialogOpen(true);
      setSenhaData({ atual: '', nova: '', confirmar: '' });
    } catch (error) {
      alert('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate2FA = async () => {
    setIsLoading(true);
    try {
      // Simulate 2FA activation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage('Autenticação de dois fatores ativada com sucesso!');
      setIsSuccessDialogOpen(true);
    } catch (error) {
      alert('Erro ao ativar 2FA. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddColaborador = async (colaboradorData: any) => {
    setIsLoading(true);
    try {
      await apiService.createColaborador(colaboradorData);
      setSuccessMessage('Colaborador adicionado com sucesso!');
      setIsSuccessDialogOpen(true);
      // Refresh colaboradores list
      const colaboradoresData = await apiService.getColaboradores() as any[];
      setColaboradores(colaboradoresData || []);
    } catch (error) {
      alert('Erro ao adicionar colaborador. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditColaborador = async (id: number, colaboradorData: any) => {
    setIsLoading(true);
    try {
      await apiService.updateColaborador(id, colaboradorData);
      setSuccessMessage('Colaborador atualizado com sucesso!');
      setIsSuccessDialogOpen(true);
      // Refresh colaboradores list
      const colaboradoresData = await apiService.getColaboradores() as any[];
      setColaboradores(colaboradoresData || []);
    } catch (error) {
      alert('Erro ao atualizar colaborador. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteColaborador = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este colaborador?')) return;

    setIsLoading(true);
    try {
      await apiService.deleteColaborador(id);
      setSuccessMessage('Colaborador excluído com sucesso!');
      setIsSuccessDialogOpen(true);
      // Refresh colaboradores list
      const colaboradoresData = await apiService.getColaboradores() as any[];
      setColaboradores(colaboradoresData || []);
    } catch (error) {
      alert('Erro ao excluir colaborador. Tente novamente.');
    } finally {
      setIsLoading(false);
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
          <TabsContent value="empresa">
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
          <TabsContent value="usuarios">
            <div className="space-y-6">
              {/* Gerenciamento de Colaboradores */}
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Colaboradores</CardTitle>
                  <CardDescription>Adicione, edite ou remova colaboradores do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Colaboradores</h3>
                      <p className="text-sm text-muted-foreground">Lista de todos os colaboradores cadastrados</p>
                    </div>
                    <Button
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => {
                        setEditingColaborador(null);
                        setColaboradorForm({ nome: '', email: '', cargo: '', departamento: '' });
                        setIsColaboradorDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Colaborador
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {colaboradores.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum colaborador cadastrado ainda.
                      </div>
                    ) : (
                      colaboradores.map((colaborador: any) => (
                        <div key={colaborador.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{colaborador.nome}</p>
                            <p className="text-sm text-muted-foreground">{colaborador.email}</p>
                            <p className="text-sm text-muted-foreground">{colaborador.cargo} - {colaborador.departamento}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingColaborador(colaborador);
                                setColaboradorForm({
                                  nome: colaborador.nome,
                                  email: colaborador.email,
                                  cargo: colaborador.cargo,
                                  departamento: colaborador.departamento
                                });
                                setIsColaboradorDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteColaborador(colaborador.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes">
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
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleSaveNotificacoes}
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : <><Save className="h-4 w-4 mr-2" /> Salvar Preferências</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="seguranca">
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
          <TabsContent value="aparencia">
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
          <TabsContent value="parametros">
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
              {editingColaborador ? 'Editar Colaborador' : 'Adicionar Colaborador'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="colaboradorNome">Nome *</Label>
              <Input
                id="colaboradorNome"
                value={colaboradorForm.nome}
                onChange={(e) => setColaboradorForm({ ...colaboradorForm, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colaboradorEmail">E-mail *</Label>
              <Input
                id="colaboradorEmail"
                type="email"
                value={colaboradorForm.email}
                onChange={(e) => setColaboradorForm({ ...colaboradorForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colaboradorCargo">Cargo</Label>
              <Input
                id="colaboradorCargo"
                value={colaboradorForm.cargo}
                onChange={(e) => setColaboradorForm({ ...colaboradorForm, cargo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colaboradorDepartamento">Departamento</Label>
              <Input
                id="colaboradorDepartamento"
                value={colaboradorForm.departamento}
                onChange={(e) => setColaboradorForm({ ...colaboradorForm, departamento: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsColaboradorDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={async () => {
                if (!colaboradorForm.nome || !colaboradorForm.email) {
                  alert('Nome e e-mail são obrigatórios.');
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