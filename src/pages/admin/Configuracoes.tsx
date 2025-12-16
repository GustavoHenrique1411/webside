import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, User, Bell, Shield, Palette, Save } from 'lucide-react';

const Configuracoes: React.FC = () => {
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(false);

  return (
    <AdminLayout title="Configurações">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <p className="text-white/70">Gerencie as configurações do sistema</p>
        </div>

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-white/10 border border-white/10">
            <TabsTrigger value="empresa" className="flex items-center gap-2 text-white/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Building2 className="h-4 w-4" /> Empresa
            </TabsTrigger>
            <TabsTrigger value="usuario" className="flex items-center gap-2 text-white/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <User className="h-4 w-4" /> Usuário
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2 text-white/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Bell className="h-4 w-4" /> Notificações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="flex items-center gap-2 text-white/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Shield className="h-4 w-4" /> Segurança
            </TabsTrigger>
            <TabsTrigger value="aparencia" className="flex items-center gap-2 text-white/70 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Palette className="h-4 w-4" /> Aparência
            </TabsTrigger>
          </TabsList>

          {/* Empresa */}
          <TabsContent value="empresa">
            <Card className="bg-white/10 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Dados da Empresa</CardTitle>
                <CardDescription className="text-white/60">Informações cadastrais da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial" className="text-white">Razão Social</Label>
                    <Input id="razaoSocial" defaultValue="Webside Sistemas Ltda" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia" className="text-white">Nome Fantasia</Label>
                    <Input id="nomeFantasia" defaultValue="Webside Sistemas" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="text-white">CNPJ</Label>
                    <Input id="cnpj" defaultValue="12.345.678/0001-90" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ie" className="text-white">Inscrição Estadual</Label>
                    <Input id="ie" defaultValue="123.456.789.012" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="endereco" className="text-white">Endereço</Label>
                    <Input id="endereco" defaultValue="Rua das Empresas, 123 - Centro - São Paulo/SP" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-white">Telefone</Label>
                    <Input id="telefone" defaultValue="(11) 3000-0000" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailEmpresa" className="text-white">E-mail</Label>
                    <Input id="emailEmpresa" defaultValue="contato@websidesistemas.com.br" className="bg-white/10 border-white/20 text-white" />
                  </div>
                </div>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuário */}
          <TabsContent value="usuario">
            <Card className="bg-white/10 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Perfil do Usuário</CardTitle>
                <CardDescription className="text-white/60">Suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-white">Nome Completo</Label>
                    <Input id="nome" defaultValue="Administrador" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">E-mail</Label>
                    <Input id="email" type="email" defaultValue="admin@empresa.com" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo" className="text-white">Cargo</Label>
                    <Input id="cargo" defaultValue="Administrador do Sistema" className="bg-white/10 border-white/20 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departamento" className="text-white">Departamento</Label>
                    <Input id="departamento" defaultValue="TI" className="bg-white/10 border-white/20 text-white" />
                  </div>
                </div>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Save className="h-4 w-4 mr-2" /> Salvar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes">
            <Card className="bg-white/10 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Preferências de Notificação</CardTitle>
                <CardDescription className="text-white/60">Configure como deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Notificações por E-mail</p>
                    <p className="text-sm text-white/60">Receba atualizações importantes por e-mail</p>
                  </div>
                  <Switch checked={notificacoesEmail} onCheckedChange={setNotificacoesEmail} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Notificações Push</p>
                    <p className="text-sm text-white/60">Receba alertas em tempo real no navegador</p>
                  </div>
                  <Switch checked={notificacoesPush} onCheckedChange={setNotificacoesPush} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Resumo Diário</p>
                    <p className="text-sm text-white/60">Receba um resumo diário das atividades</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Alertas de Vencimento</p>
                    <p className="text-sm text-white/60">Seja notificado sobre faturas e prazos</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="seguranca">
            <Card className="bg-white/10 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Segurança da Conta</CardTitle>
                <CardDescription className="text-white/60">Gerencie a segurança do seu acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual" className="text-white">Senha Atual</Label>
                    <Input id="senhaAtual" type="password" placeholder="Digite sua senha atual" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novaSenha" className="text-white">Nova Senha</Label>
                    <Input id="novaSenha" type="password" placeholder="Digite a nova senha" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha" className="text-white">Confirmar Nova Senha</Label>
                    <Input id="confirmarSenha" type="password" placeholder="Confirme a nova senha" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                </div>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Alterar Senha
                </Button>

                <div className="border-t border-white/10 pt-4 mt-6">
                  <h4 className="font-medium mb-4 text-white">Autenticação em Dois Fatores</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Adicione uma camada extra de segurança</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Ativar 2FA</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aparência */}
          <TabsContent value="aparencia">
            <Card className="bg-white/10 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Aparência</CardTitle>
                <CardDescription className="text-white/60">Personalize a interface do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Tema Escuro</p>
                    <p className="text-sm text-white/60">Ative o modo escuro para reduzir o cansaço visual</p>
                  </div>
                  <Switch checked={temaEscuro} onCheckedChange={setTemaEscuro} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Menu Compacto</p>
                    <p className="text-sm text-white/60">Reduza o tamanho do menu lateral</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Configuracoes;