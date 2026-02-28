import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Plus, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  X, 
  Save, 
  Loader2,
  Briefcase,
  Hash,
  CheckCircle2,
  XCircle,
  Shield,
  Calendar,
  Percent,
  Building2,
  Key
} from 'lucide-react';

// Lista de cargos hierarchy para seleção rápida
const CARGOS_HIERARQUIA = [
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

// Lista de departamentos sugeridos
const DEPARTAMENTOS_SUGERIDOS = [
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

interface ColaboradorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  colaborador?: any;
  loading?: boolean;
}

const defaultFormData = {
  // Informações Pessoais
  nome_completo: '',
  cpf: '',
  
  // Informações de Contato
  email: '',
  telefone: '',
  
  // Segurança
  senha: '',
  
  // Dados Profissionais
  tipo_colaborador: 'funcionario',
  cargo: '',
  cargo_nivel: 0,
  data_admissao: '',
  comissao_venda: '0',
  comissao_recorrente: '0',
  
  // Permissão e Acesso
  id_permissao: '1',
  perfil_acesso: 'admin',
  
  // Departamentos
  departamentos: [] as number[],
  departamentos_custom: [] as { id: number; nome: string; codigo: string }[],
  
  // Status
  ativo: true,
};

export function ColaboradorFormDialog({ open, onOpenChange, onSubmit, colaborador, loading }: ColaboradorFormDialogProps) {
  const [formData, setFormData] = useState(defaultFormData);

  // Reset form when dialog opens/closes or when colaborador changes
  useEffect(() => {
    if (open) {
      if (colaborador) {
        // Parse departments from colaborador
        let departamentos: number[] = [];
        if (colaborador.departamentos) {
          if (Array.isArray(colaborador.departamentos)) {
            departamentos = colaborador.departamentos.map((d: any) => d.id || d.id_departamento || d);
          } else if (typeof colaborador.departamentos === 'string') {
            departamentos = colaborador.departamentos.split(',').map((d: string) => parseInt(d.trim())).filter((d: number) => !isNaN(d));
          }
        }
        
        // Parse cargo from departments or use direct cargo field
        let cargo = '';
        let cargo_nivel = 0;
        if (colaborador.cargo) {
          cargo = colaborador.cargo;
          const cargoFound = CARGOS_HIERARQUIA.find(c => c.label.toLowerCase() === cargo.toLowerCase() || c.value === cargo.toLowerCase());
          if (cargoFound) {
            cargo_nivel = cargoFound.nivel;
          }
        } else if (colaborador.departamentos && colaborador.departamentos[0]?.cargo) {
          cargo = colaborador.departamentos[0].cargo;
        }
        
        setFormData({
          nome_completo: colaborador.nome_completo || colaborador.nome || '',
          cpf: colaborador.cpf || '',
          email: colaborador.email || '',
          telefone: colaborador.telefone || '',
          senha: '',
          tipo_colaborador: colaborador.tipo_colaborador || 'funcionario',
          cargo: cargo,
          cargo_nivel: cargo_nivel,
          data_admissao: colaborador.data_admissao || '',
          comissao_venda: String(colaborador.comissao_venda || 0),
          comissao_recorrente: String(colaborador.comissao_recorrente || 0),
          id_permissao: String(colaborador.id_permissao || 1),
          perfil_acesso: getPerfilFromNivel(colaborador.nivel_acesso || 10),
          departamentos: departamentos,
          departamentos_custom: [],
          ativo: colaborador.ativo !== false,
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, colaborador]);

  const getPerfilFromNivel = (nivel: number): string => {
    if (nivel >= 9) return 'admin';
    if (nivel >= 7) return 'gerente';
    if (nivel >= 5) return 'coordenador';
    if (nivel >= 3) return 'supervisor';
    return 'padrao';
  };

  const getNivelFromPerfil = (perfil: string): number => {
    const cargo = CARGOS_HIERARQUIA.find(c => c.value === perfil);
    return cargo?.nivel || 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build payload with departamentos format for backend
    const payload: any = {
      nome_completo: formData.nome_completo,
      cpf: formData.cpf,
      email: formData.email,
      telefone: formData.telefone,
      tipo_colaborador: formData.tipo_colaborador,
      cargo: formData.cargo,
      data_admissao: formData.data_admissao,
      comissao_venda: parseFloat(formData.comissao_venda) || 0,
      comissao_recorrente: parseFloat(formData.comissao_recorrente) || 0,
      id_permissao: parseInt(formData.id_permissao),
      nivel_acesso: getNivelFromPerfil(formData.perfil_acesso),
      ativo: formData.ativo,
    };
    
    // Build departamentos array with custom departments
    const deptos: { id?: number; nome: string; cargo: string }[] = [];
    
    // Add selected predefined departments
    DEPARTAMENTOS_SUGERIDOS.forEach(dept => {
      if (formData.departamentos.includes(dept.id)) {
        if (!formData.departamentos_custom.find(d => d.id === dept.id)) {
          deptos.push({ id: dept.id, nome: dept.nome, cargo: formData.cargo || 'Colaborador' });
        }
      }
    });
    
    // Add custom departments (typed by user)
    formData.departamentos_custom.forEach(dept => {
      deptos.push({ nome: dept.nome, cargo: formData.cargo || 'Colaborador' });
    });
    
    // Add departamentos to payload
    if (deptos.length > 0) {
      payload.departamentos = deptos;
    }
    
    // Only add senha if provided
    if (formData.senha && formData.senha.length > 0) {
      payload.senha = formData.senha;
    }
    
    console.log('DEBUG handleSubmit: payload:', payload);
    onSubmit(payload);
  };

  const handlePerfilChange = (perfil: string) => {
    const nivel = getNivelFromPerfil(perfil);
    const cargoObj = CARGOS_HIERARQUIA.find(c => c.value === perfil);
    setFormData({
      ...formData,
      perfil_acesso: perfil,
      cargo_nivel: nivel,
      cargo: cargoObj?.label || formData.cargo,
    });
  };

  const toggleDepartamento = (deptId: number) => {
    const current = formData.departamentos;
    if (current.includes(deptId)) {
      setFormData({
        ...formData,
        departamentos: current.filter(d => d !== deptId)
      });
    } else {
      setFormData({
        ...formData,
        departamentos: [...current, deptId]
      });
    }
  };

  const isEditing = !!colaborador;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95vh] overflow-y-auto p-0">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 rounded-t-lg">
          <DialogHeader className="space-y-1 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}
                </DialogTitle>
                <DialogDescription className="text-slate-200 text-sm">
                  {isEditing ? 'Atualize os dados do colaborador.' : 'Cadastre um novo membro da equipe.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Seção: Informações Pessoais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 uppercase tracking-wider">
              <User className="h-4 w-4" />
              Informações Pessoais
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="nome_completo" className="text-sm font-medium flex items-center gap-1.5">
                  Nome Completo
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome_completo"
                    placeholder="Ex: João da Silva"
                    value={formData.nome_completo}
                    onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-medium">
                  CPF
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Informações de Contato */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 uppercase tracking-wider">
              <Mail className="h-4 w-4" />
              Informações de Contato
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                  E-mail
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium">
                  Telefone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Segurança */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 uppercase tracking-wider">
              <Key className="h-4 w-4" />
              Segurança
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-sm font-medium">
                {isEditing ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="senha"
                  type="password"
                  placeholder={isEditing ? 'Mínimo 8 caracteres' : 'Senha inicial'}
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="pl-10 h-11"
                  {...( !isEditing && { required: true, minLength: 8 } )}
                  minLength={isEditing ? 0 : 8}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {isEditing ? 'Somente preencha se deseja alterar a senha atual' : 'Mínimo 8 caracteres'}
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Dados Profissionais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 uppercase tracking-wider">
              <Briefcase className="h-4 w-4" />
              Dados Profissionais
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Colaborador */}
              <div className="space-y-2">
                <Label htmlFor="tipo_colaborador" className="text-sm font-medium">
                  Tipo
                </Label>
                <Select
                  value={formData.tipo_colaborador}
                  onValueChange={(value) => setFormData({ ...formData, tipo_colaborador: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funcionario">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Funcionário
                      </div>
                    </SelectItem>
                    <SelectItem value="terceiro">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Terceiro
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Admissão */}
              <div className="space-y-2">
                <Label htmlFor="data_admissao" className="text-sm font-medium">
                  Data Admissão
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="data_admissao"
                    type="date"
                    value={formData.data_admissao}
                    onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            {/* Cargo / Hierarquia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="perfil_acesso" className="text-sm font-medium flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  Cargo / Função
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Obrigatório</Badge>
                </Label>
                <Select
                  value={formData.perfil_acesso}
                  onValueChange={handlePerfilChange}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARGOS_HIERARQUIA.map((cargo) => (
                      <SelectItem key={cargo.value} value={cargo.value}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{cargo.label}</span>
                          <Badge variant="outline" className="text-[10px] ml-2">Nível {cargo.nivel}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cargo Personalizado */}
              <div className="space-y-2">
                <Label htmlFor="cargo" className="text-sm font-medium">
                  Cargo Específico
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cargo"
                    placeholder="Ex: Desenvolvedor Full Stack"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            {/* Comissões */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comissao_venda" className="text-sm font-medium flex items-center gap-1.5">
                  <Percent className="h-3 w-3" />
                  Comissão Venda (%)
                </Label>
                <Input
                  id="comissao_venda"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.comissao_venda}
                  onChange={(e) => setFormData({ ...formData, comissao_venda: e.target.value })}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">Percentual de comissão sobre vendas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comissao_recorrente" className="text-sm font-medium flex items-center gap-1.5">
                  <Percent className="h-3 w-3" />
                  Comissão Recorrente (%)
                </Label>
                <Input
                  id="comissao_recorrente"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.comissao_recorrente}
                  onChange={(e) => setFormData({ ...formData, comissao_recorrente: e.target.value })}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">Percentual de comissão recorrente</p>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Departamentos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 uppercase tracking-wider">
              <Building2 className="h-4 w-4" />
              Departamentos
            </div>
            
            {/* Campo para digitar departamentos customizados */}
            <div className="space-y-2">
              <Label htmlFor="departamentos_custom" className="text-sm font-medium">
                Adicionar Departamento (digite e pressione Enter)
              </Label>
              <Input
                id="departamentos_custom"
                placeholder="Ex: Qualidade, Projetos, Inovação..."
                className="h-11"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const value = input.value.trim();
                    if (value) {
                      // Adicionar como departamento customizado (ID negativo para identificar)
                      const customId = -Date.now();
                      const currentDepts = formData.departamentos;
                      // Armazenar o nome do dept customizado
                      const customDepts = formData.departamentos_custom || [];
                      if (!customDepts.find((d: any) => d.nome.toLowerCase() === value.toLowerCase())) {
                        setFormData({
                          ...formData,
                          departamentos_custom: [...customDepts, { id: customId, nome: value, codigo: value.substring(0, 4).toUpperCase() }],
                          departamentos: [...currentDepts, customId]
                        });
                      }
                      input.value = '';
                    }
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Digite o nome do departamento e pressione Enter para adicionar. Ou selecione abaixo.
              </p>
            </div>

            {/* Lista de departamentos sugeridos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DEPARTAMENTOS_SUGERIDOS.map((dept) => (
                <div 
                  key={dept.id}
                  className={`
                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                    ${formData.departamentos.includes(dept.id) 
                      ? 'bg-slate-100 border-slate-400' 
                      : 'bg-white border-slate-200 hover:border-slate-300'}
                  `}
                  onClick={() => toggleDepartamento(dept.id)}
                >
                  <Checkbox 
                    checked={formData.departamentos.includes(dept.id)}
                    onCheckedChange={() => toggleDepartamento(dept.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{dept.nome}</p>
                    <p className="text-xs text-muted-foreground">{dept.codigo}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mostrar departamentos customizados adicionados */}
            {formData.departamentos_custom && formData.departamentos_custom.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.departamentos_custom.map((dept: any) => (
                  <Badge key={dept.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    {dept.nome}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => {
                        const newDepts = formData.departamentos.filter((d: number) => d !== dept.id);
                        const newCustomDepts = formData.departamentos_custom.filter((d: any) => d.id !== dept.id);
                        setFormData({
                          ...formData,
                          departamentos: newDepts,
                          departamentos_custom: newCustomDepts
                        });
                      }}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            {formData.departamentos.length === 0 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <Badge variant="outline" className="text-amber-600">Atenção</Badge>
                Selecione ou digite pelo menos um departamento
              </p>
            )}
          </div>

          <Separator className="my-5" />

          {/* Seção: Permissão de Acesso */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 uppercase tracking-wider">
              <Shield className="h-4 w-4" />
              Nível de Acesso
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {CARGOS_HIERARQUIA.map((perfil) => (
                <div 
                  key={perfil.value}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                    ${formData.perfil_acesso === perfil.value 
                      ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400' 
                      : 'bg-white border-slate-200 hover:border-slate-300'}
                  `}
                  onClick={() => handlePerfilChange(perfil.value)}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    perfil.nivel >= 8 ? 'bg-red-500' : 
                    perfil.nivel >= 6 ? 'bg-blue-500' : 
                    perfil.nivel >= 4 ? 'bg-green-500' : 
                    perfil.nivel >= 2 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{perfil.label}</p>
                    <p className="text-xs text-muted-foreground">{perfil.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          {/* Seção: Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 uppercase tracking-wider">
              <Hash className="h-4 w-4" />
              Status do Colaborador
            </div>
            
            <div className="flex items-center gap-4">
              <div 
                className={`
                  flex-1 flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
                  ${formData.ativo 
                    ? 'bg-green-50 border-green-300 ring-2 ring-green-300' 
                    : 'bg-white border-slate-200'}
                `}
                onClick={() => setFormData({ ...formData, ativo: true })}
              >
                <Checkbox 
                  checked={formData.ativo}
                  onCheckedChange={() => setFormData({ ...formData, ativo: true })}
                />
                <CheckCircle2 className={`h-5 w-5 ${formData.ativo ? 'text-green-600' : 'text-slate-300'}`} />
                <div>
                  <p className="text-sm font-medium">Ativo</p>
                  <p className="text-xs text-muted-foreground">Colaborador com acesso liberado</p>
                </div>
              </div>

              <div 
                className={`
                  flex-1 flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
                  ${!formData.ativo 
                    ? 'bg-red-50 border-red-300 ring-2 ring-red-300' 
                    : 'bg-white border-slate-200'}
                `}
                onClick={() => setFormData({ ...formData, ativo: false })}
              >
                <Checkbox 
                  checked={!formData.ativo}
                  onCheckedChange={() => setFormData({ ...formData, ativo: false })}
                />
                <XCircle className={`h-5 w-5 ${!formData.ativo ? 'text-red-600' : 'text-slate-300'}`} />
                <div>
                  <p className="text-sm font-medium">Inativo</p>
                  <p className="text-xs text-muted-foreground">Colaborador sem acesso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer com ações */}
          <DialogFooter className="flex gap-3 pt-6 mt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-11 bg-slate-700 hover:bg-slate-800 gap-2" 
              disabled={loading || formData.departamentos.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
