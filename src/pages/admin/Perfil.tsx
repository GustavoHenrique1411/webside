import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Briefcase, Building2, Save, Edit } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: number;
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  tipo: string;
}

const Perfil: React.FC = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    departamento: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await apiService.getProfile() as UserProfile;
      setProfile(userData);
      setFormData({
        nome: userData.nome || '',
        email: userData.email || '',
        cargo: userData.cargo || '',
        departamento: userData.departamento || ''
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o perfil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await apiService.updateProfile(formData);
      setProfile({ ...profile!, ...formData });
      setEditing(false);
      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: profile?.nome || '',
      email: profile?.email || '',
      cargo: profile?.cargo || '',
      departamento: profile?.departamento || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Perfil do Usuário">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Perfil do Usuário">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Suas informações pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </Label>
                {editing ? (
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                ) : (
                  <p className="text-sm font-medium">{profile?.nome || 'Administrador'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail *
                </Label>
                {editing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                ) : (
                  <p className="text-sm font-medium">{profile?.email || 'admin@empresa.com'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Cargo
                </Label>
                {editing ? (
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium">{profile?.cargo || 'Não informado'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departamento" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Departamento
                </Label>
                {editing ? (
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium">{profile?.departamento || 'Não informado'}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tipo de usuário:</span>
                <Badge variant="secondary">{profile?.tipo || 'Administrador'}</Badge>
              </div>

              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Perfil;
