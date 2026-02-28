import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Save, 
  FileText, 
  Hash, 
  MapPin, 
  Phone, 
  Mail, 
  Loader2,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { useNotifications } from '@/components/NotificationSystem';

interface EmpresaTabProps {
  empresaData: {
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    ie: string;
    endereco: string;
    telefone: string;
    email: string;
  };
  setEmpresaData: React.Dispatch<React.SetStateAction<any>>;
  empresasData: any[];
  updateEmpresa: any;
  createEmpresa: any;
  refetchEmpresas: () => void;
  isLoading: boolean;
}

export function EmpresaTab({ 
  empresaData, 
  setEmpresaData, 
  empresasData, 
  updateEmpresa, 
  createEmpresa, 
  refetchEmpresas,
  isLoading 
}: EmpresaTabProps) {
  const notifications = useNotifications();

  const handleSave = async () => {
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

  return (
    <Card className="overflow-hidden border-2">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-background px-6 py-4 border-b">
        <CardHeader className="p-0 space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Dados da Empresa</CardTitle>
              <CardDescription>Informações cadastrais da empresa</CardDescription>
            </div>
          </div>
        </CardHeader>
      </div>
      
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Razão Social */}
          <div className="space-y-2">
            <Label htmlFor="razaoSocial" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Razão Social *
            </Label>
            <Input
              id="razaoSocial"
              value={empresaData.razaoSocial}
              onChange={(e) => setEmpresaData({ ...empresaData, razaoSocial: e.target.value })}
              placeholder="Razão Social Ltda"
              className="h-11"
              required
            />
          </div>
          
          {/* Nome Fantasia */}
          <div className="space-y-2">
            <Label htmlFor="nomeFantasia" className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Nome Fantasia *
            </Label>
            <Input
              id="nomeFantasia"
              value={empresaData.nomeFantasia}
              onChange={(e) => setEmpresaData({ ...empresaData, nomeFantasia: e.target.value })}
              placeholder="Nome Fantasia"
              className="h-11"
              required
            />
          </div>
          
          {/* CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="flex items-center gap-2 text-sm font-medium">
              <Hash className="h-4 w-4 text-muted-foreground" />
              CNPJ *
            </Label>
            <Input
              id="cnpj"
              value={empresaData.cnpj}
              onChange={(e) => setEmpresaData({ ...empresaData, cnpj: e.target.value })}
              placeholder="00.000.000/0000-00"
              className="h-11"
              required
            />
          </div>
          
          {/* Inscrição Estadual */}
          <div className="space-y-2">
            <Label htmlFor="ie" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Inscrição Estadual
            </Label>
            <Input
              id="ie"
              value={empresaData.ie}
              onChange={(e) => setEmpresaData({ ...empresaData, ie: e.target.value })}
              placeholder="000.000.000.000"
              className="h-11"
            />
          </div>
          
          {/* Endereço */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="endereco" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Endereço *
            </Label>
            <Input
              id="endereco"
              value={empresaData.endereco}
              onChange={(e) => setEmpresaData({ ...empresaData, endereco: e.target.value })}
              placeholder="Rua, número, bairro, cidade - UF, CEP"
              className="h-11"
              required
            />
          </div>
          
          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Telefone *
            </Label>
            <Input
              id="telefone"
              value={empresaData.telefone}
              onChange={(e) => setEmpresaData({ ...empresaData, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="h-11"
              required
            />
          </div>
          
          {/* E-mail */}
          <div className="space-y-2">
            <Label htmlFor="emailEmpresa" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-muted-foreground" />
              E-mail *
            </Label>
            <Input
              id="emailEmpresa"
              type="email"
              value={empresaData.email}
              onChange={(e) => setEmpresaData({ ...empresaData, email: e.target.value })}
              placeholder="contato@empresa.com"
              className="h-11"
              required
            />
          </div>
        </div>

        <Separator />

        {/* Footer com preview e botão */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {empresaData.razaoSocial && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {empresaData.razaoSocial}
              </Badge>
            )}
          </div>
          <Button
            className="bg-blue-500 hover:bg-blue-600 h-11 px-6"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" /> Salvar Alterações</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmpresaTab;
