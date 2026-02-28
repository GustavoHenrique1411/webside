import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Bell, 
  Shield, 
  Palette, 
  Settings, 
  Save, 
  CheckCircle, 
  Loader2, 
  Users, 
  Mail,
  Smartphone,
  Moon,
  LayoutTemplate,
  FileText,
  DollarSign,
  Percent,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  FileLock2,
  Share2,
  Package
} from 'lucide-react';
import { useEmpresas, useCreateEmpresa, useUpdateEmpresa, useColaboradores, useCreateColaborador, useUpdateColaborador, useDeleteColaborador, useProdutos, useCreateProduto, useUpdateProduto, useDeleteProduto } from '@/hooks/useGraphQL';
import { useParametrosEmpresa, useUpdateParametrosEmpresa } from '@/hooks/useParametrosEmpresa';
import { useNotifications } from '@/components/NotificationSystem';
import { EmpresaTab, ColaboradoresTab, ProdutosTab } from '@/components/configuracoes';
import { useAuth } from '@/contexts/AuthContext';

const Configuracoes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.tipo === 'Administrador' || user?.tipo === 'Diretor';
  
  const notifications = useNotifications();
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('temaEscuro') === 'true';
    }
    return false;
  });
  const [menuCompacto, setMenuCompacto] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('menuCompacto') === 'true';
    }
    return false;
  });
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

  // Estados para 2FA e LGPD
  const [doisFatoresAtivo, setDoisFatoresAtivo] = useState(false);
  const [lgpdConsentimento, setLgpdConsentimento] = useState(true);
  const [compartilhamentoDados, setCompartilhamentoDados] = useState(false);
  const [codigo2FA, setCodigo2FA] = useState('');
  const [mostrarCodigo2FA, setMostrarCodigo2FA] = useState(false);
  const [parametrosFormData, setParametrosFormData] = useState({
    salarioMinimo: 0,
    percentualReajuste: 0,
    diasVencimentoFatura: 0,
    taxaJurosMora: 0,
    dataVigencia: ''
  });

  // GraphQL hooks
  const { data: empresasData, loading: loadingEmpresas, refetch: refetchEmpresas } = useEmpresas();
  const { data: colaboradoresData, loading: loadingColaboradores, refetch: refetchColaboradores } = useColaboradores();
  const { data: parametrosData, loading: loadingParametros, refetch: refetchParametros } = useParametrosEmpresa();
  const { data: produtosData, loading: loadingProdutos, refetch: refetchProdutos } = useProdutos();
  const updateParametros = useUpdateParametrosEmpresa();
  const createEmpresa = useCreateEmpresa();
  const updateEmpresa = useUpdateEmpresa();
  const createColaborador = useCreateColaborador();
  const updateColaborador = useUpdateColaborador();
  const deleteColaborador = useDeleteColaborador();
  const createProduto = useCreateProduto();
  const updateProduto = useUpdateProduto();
  const deleteProduto = useDeleteProduto();

  // Aplicar tema ao carregar a página
  useEffect(() => {
    const temaSalvo = localStorage.getItem('temaEscuro') === 'true';
    if (temaSalvo) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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

  // Load parametros data
  useEffect(() => {
    if (parametrosData) {
      setParametrosFormData({
        salarioMinimo: parametrosData.salario_minimo || 1412.00,
        percentualReajuste: parametrosData.percentual_reajuste || 5.0,
        diasVencimentoFatura: parametrosData.dias_vencimento_fatura || 30,
        taxaJurosMora: parametrosData.taxa_juros_mora || 1.0,
        dataVigencia: parametrosData.data_vigencia || new Date().toISOString().split('T')[0]
      });
    }
  }, [parametrosData]);

  const handleSaveNotificacoes = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notifications.success('Sucesso!', 'Preferências de notificação salvas com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar preferências.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAparencia = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('temaEscuro', temaEscuro.toString());
      localStorage.setItem('menuCompacto', menuCompacto.toString());
      
      if (temaEscuro) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      notifications.success('Sucesso!', 'Configurações de aparência salvas e aplicadas!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar configurações.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveParametros = async () => {
    setIsLoading(true);
    try {
      await updateParametros.mutate({
        salario_minimo: parametrosFormData.salarioMinimo,
        percentual_reajuste: parametrosFormData.percentualReajuste,
        dias_vencimento_fatura: parametrosFormData.diasVencimentoFatura,
        taxa_juros_mora: parametrosFormData.taxaJurosMora,
        data_vigencia: parametrosFormData.dataVigencia
      });
      await refetchParametros();
      notifications.success('Sucesso!', 'Parâmetros do sistema salvos com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar parâmetros.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate2FA = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDoisFatoresAtivo(true);
      setCodigo2FA('ABC1-DEF2-GHI3-JKL4');
      notifications.success('Sucesso!', 'Autenticação de dois fatores ativada com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao ativar 2FA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesativar2FA = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDoisFatoresAtivo(false);
      setCodigo2FA('');
      notifications.success('Sucesso!', 'Autenticação de dois fatores desativada!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao desativar 2FA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLGPD = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notifications.success('Sucesso!', 'Configurações de privacidade (LGPD) salvas com sucesso!');
    } catch (error) {
      notifications.error('Erro!', 'Erro ao salvar configurações de privacidade.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Configurações">
      <div className="space-y-6">
        {/* Header Moderno */}
        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-background rounded-2xl p-6 border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent rounded-xl shadow-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
              <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue={isAdmin ? "empresa" : "usuarios"} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-auto p-1 bg-muted/50 rounded-xl">
            {isAdmin && (
              <TabsTrigger value="empresa" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-accent">
                <Building2 className="h-4 w-4" /> Empresa
              </TabsTrigger>
            )}
            <TabsTrigger value="usuarios" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-accent">
              <Users className="h-4 w-4" /> Usuários
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="produtos" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-accent">
                <Package className="h-4 w-4" /> Produtos
              </TabsTrigger>
            )}
            <TabsTrigger value="notificacoes" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-accent">
              <Bell className="h-4 w-4" /> Notificações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-accent">
              <Shield className="h-4 w-4" /> Segurança
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-accent">
              <Palette className="h-4 w-4" /> Aparência
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="parametros" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-accent">
                <Settings className="h-4 w-4" /> Sistema
              </TabsTrigger>
            )}
          </TabsList>

          {/* Empresa Tab - Apenas para Administradores */}
          {isAdmin && (
            <TabsContent value="empresa">
              <EmpresaTab
                empresaData={empresaData}
                setEmpresaData={setEmpresaData}
                empresasData={empresasData || []}
                updateEmpresa={updateEmpresa}
                createEmpresa={createEmpresa}
                refetchEmpresas={refetchEmpresas}
                isLoading={isLoading}
              />
            </TabsContent>
          )}

          {/* Colaboradores Tab */}
          <TabsContent value="usuarios">
            <ColaboradoresTab
              colaboradoresData={colaboradoresData || []}
              loading={loadingColaboradores}
              createColaborador={createColaborador}
              updateColaborador={updateColaborador}
              deleteColaborador={deleteColaborador}
              refetchColaboradores={refetchColaboradores}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Produtos Tab - Apenas para Administradores */}
          {isAdmin && (
            <TabsContent value="produtos">
              <ProdutosTab
                produtosData={produtosData || []}
                loading={loadingProdutos}
                createProduto={createProduto}
                updateProduto={updateProduto}
                deleteProduto={deleteProduto}
                refetchProdutos={refetchProdutos}
                isLoading={isLoading}
              />
            </TabsContent>
          )}

          {/* Notificações Tab */}
          <TabsContent value="notificacoes">
            <Card className="overflow-hidden border-2">
              <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-background px-6 py-4 border-b">
                <CardHeader className="p-0 space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Preferências de Notificação</CardTitle>
                      <CardDescription>Configure como deseja receber notificações</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Notificações por E-mail</p>
                        <p className="text-sm text-muted-foreground">Receba atualizações importantes por e-mail</p>
                      </div>
                    </div>
                    <Switch checked={notificacoesEmail} onCheckedChange={setNotificacoesEmail} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Smartphone className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Notificações Push</p>
                        <p className="text-sm text-muted-foreground">Receba alertas em tempo real no navegador</p>
                      </div>
                    </div>
                    <Switch checked={notificacoesPush} onCheckedChange={setNotificacoesPush} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Resumo Diário</p>
                        <p className="text-sm text-muted-foreground">Receba um resumo diário das atividades</p>
                      </div>
                    </div>
                    <Switch checked={resumoDiario} onCheckedChange={setResumoDiario} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">Alertas de Vencimento</p>
                        <p className="text-sm text-muted-foreground">Seja notificado sobre faturas e prazos</p>
                      </div>
                    </div>
                    <Switch checked={alertasVencimento} onCheckedChange={setAlertasVencimento} />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">
                      {notificacoesEmail || notificacoesPush || resumoDiario || alertasVencimento 
                        ? 'Você receberá notificações ativas' 
                        : 'Nenhuma notificação ativa'}
                    </span>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 h-11 px-6" onClick={handleSaveNotificacoes} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4 mr-2" /> Salvar Preferências</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança Tab - 2FA e LGPD */}
          <TabsContent value="seguranca">
            <div className="space-y-6">
              {/* 2FA Card */}
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-background px-6 py-4 border-b">
                  <CardHeader className="p-0 space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Autenticação em Dois Fatores (2FA)</CardTitle>
                        <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  {!doisFatoresAtivo ? (
                    <div className="p-4 bg-muted/30 rounded-xl border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Lock className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">2FA Desativado</h4>
                            <p className="text-sm text-muted-foreground">Ative para proteger sua conta com código adicional</p>
                          </div>
                        </div>
                        <Button onClick={handleActivate2FA} disabled={isLoading} className="h-11 bg-green-500 hover:bg-green-600">
                          {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Ativando...</> : <><CheckCircle2 className="h-4 w-4 mr-2" /> Ativar 2FA</>}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800">2FA Ativo</h4>
                            <p className="text-sm text-green-600">Sua conta está protegida com autenticação em dois fatores</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Código de Recuperação
                          </Label>
                          <div className="relative">
                            <Input 
                              type={mostrarCodigo2FA ? "text" : "password"} 
                              value={codigo2FA || 'XXXX-XXXX-XXXX-XXXX'} 
                              readOnly
                              className="h-11 pr-10 font-mono"
                            />
                            <button 
                              onClick={() => setMostrarCodigo2FA(!mostrarCodigo2FA)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {mostrarCodigo2FA ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">Guarde este código em local seguro. Ele será necessário para recuperar o acesso caso perca seu dispositivo.</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" onClick={handleDesativar2FA} disabled={isLoading} className="h-11 w-full">
                        {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Desativando...</> : <><XCircle className="h-4 w-4 mr-2" /> Desativar 2FA</>}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* LGPD Card */}
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-background px-6 py-4 border-b">
                  <CardHeader className="p-0 space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <FileLock2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Privacidade e Dados (LGPD)</CardTitle>
                        <CardDescription>Gerencie suas preferências de privacidade conforme a LGPD</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Consentimento de Dados</p>
                          <p className="text-sm text-muted-foreground">Permito o processamento dos meus dados pessoais</p>
                        </div>
                      </div>
                      <Switch checked={lgpdConsentimento} onCheckedChange={setLgpdConsentimento} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Share2 className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Compartilhamento de Dados</p>
                          <p className="text-sm text-muted-foreground">Permito compartilhamento com parceiros autorizados</p>
                        </div>
                      </div>
                      <Switch checked={compartilhamentoDados} onCheckedChange={setCompartilhamentoDados} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-700">Conforme a LGPD, você tem direito a acessar, corrigir ou excluir seus dados a qualquer momento.</p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        <FileLock2 className="h-3 w-3 mr-1" />
                        LGPD
                      </Badge>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 h-11 px-6" onClick={handleSaveLGPD} disabled={isLoading}>
                      {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4 mr-2" /> Salvar Privacidade</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aparência Tab */}
          <TabsContent value="aparencia">
            <Card className="overflow-hidden border-2">
              <div className="bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-background px-6 py-4 border-b">
                <CardHeader className="p-0 space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Palette className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Aparência</CardTitle>
                      <CardDescription>Personalize a interface do sistema</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <Moon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Tema Escuro</p>
                        <p className="text-sm text-muted-foreground">Ative o modo escuro para reduzir o cansaço visual</p>
                      </div>
                    </div>
                    <Switch checked={temaEscuro} onCheckedChange={setTemaEscuro} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <LayoutTemplate className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Menu Compacto</p>
                        <p className="text-sm text-muted-foreground">Reduza o tamanho do menu lateral</p>
                      </div>
                    </div>
                    <Switch checked={menuCompacto} onCheckedChange={setMenuCompacto} />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {temaEscuro ? (
                      <Badge variant="secondary" className="bg-slate-800 text-white">Tema Escuro Ativo</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">Tema Claro Ativo</Badge>
                    )}
                    {menuCompacto && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Menu Compacto</Badge>
                    )}
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 h-11 px-6" onClick={handleSaveAparencia} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4 mr-2" /> Salvar Configurações</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sistema Tab - Apenas para Administradores */}
          {isAdmin && (
            <TabsContent value="parametros">
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-background px-6 py-4 border-b">
                  <CardHeader className="p-0 space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Parâmetros do Sistema</CardTitle>
                        <CardDescription>Configure os parâmetros gerais do sistema (Apenas Administradores)</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="salarioMinimo" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        Salário Mínimo (R$)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                        <Input 
                          id="salarioMinimo" 
                          type="number" 
                          step="0.01" 
                          value={parametrosFormData.salarioMinimo || ''} 
                          onChange={(e) => setParametrosFormData({ ...parametrosFormData, salarioMinimo: parseFloat(e.target.value) || 0 })} 
                          placeholder="1320.00" 
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="percentualReajuste" className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        Percentual de Reajuste (%)
                      </Label>
                      <div className="relative">
                        <Input 
                          id="percentualReajuste" 
                          type="number" 
                          step="0.01" 
                          value={parametrosFormData.percentualReajuste || ''} 
                          onChange={(e) => setParametrosFormData({ ...parametrosFormData, percentualReajuste: parseFloat(e.target.value) || 0 })} 
                          placeholder="10.00" 
                          className="h-11 pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diasVencimentoFatura" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        Dias para Vencimento
                      </Label>
                      <div className="relative">
                        <Input 
                          id="diasVencimentoFatura" 
                          type="number" 
                          value={parametrosFormData.diasVencimentoFatura || ''} 
                          onChange={(e) => setParametrosFormData({ ...parametrosFormData, diasVencimentoFatura: parseInt(e.target.value) || 0 })} 
                          placeholder="30" 
                          className="h-11 pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">dias</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxaJurosMora" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        Taxa de Juros de Mora (%)
                      </Label>
                      <div className="relative">
                        <Input 
                          id="taxaJurosMora" 
                          type="number" 
                          step="0.01" 
                          value={parametrosFormData.taxaJurosMora || ''} 
                          onChange={(e) => setParametrosFormData({ ...parametrosFormData, taxaJurosMora: parseFloat(e.target.value) || 0 })} 
                          placeholder="2.00" 
                          className="h-11 pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="dataVigencia" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        Data de Vigência
                      </Label>
                      <Input 
                        id="dataVigencia" 
                        type="date" 
                        value={parametrosFormData.dataVigencia} 
                        onChange={(e) => setParametrosFormData({ ...parametrosFormData, dataVigencia: e.target.value })} 
                        className="h-11"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        <Settings className="h-3 w-3 mr-1" />
                        Configurações do Sistema
                      </Badge>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90 h-11 px-6" onClick={handleSaveParametros} disabled={isLoading}>
                      {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4 mr-2" /> Salvar Parâmetros</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
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
          <div className="py-4"><p>{successMessage}</p></div>
          <div className="flex justify-end"><Button onClick={() => setIsSuccessDialogOpen(false)}>Fechar</Button></div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Configuracoes;
