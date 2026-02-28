// Generic CRUD Page Component
// Reusable admin page with CRUD operations

import React, { useState, useMemo, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Loader2, MoreHorizontal, Edit, Trash2, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/components/NotificationSystem';

// Types
export interface CrudColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

export interface CrudStats {
  key: string;
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'date' | 'password';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface CrudAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: any) => void;
  variant?: 'default' | 'destructive' | 'outline';
}

interface AdminCrudPageProps {
  title: string;
  subtitle?: string;
  data: any[];
  columns: CrudColumn[];
  stats?: CrudStats[];
  searchKeys?: string[];
  loading: boolean;
  error: any;
  onRefetch: () => void;
  onCreate: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  createFields: FormField[];
  editFields?: FormField[];
  viewFields?: { label: string; key: string }[];
  idField?: string;
  customActions?: CrudAction[];
  onView?: (item: any) => void;
  statusField?: string;
  statusColors?: Record<string, string>;
}

export function AdminCrudPage({
  title,
  subtitle,
  data,
  columns,
  stats,
  searchKeys = [],
  loading,
  error,
  onRefetch,
  onCreate,
  onUpdate,
  onDelete,
  createFields,
  editFields,
  viewFields,
  idField = 'id',
  customActions = [],
  onView,
  statusField,
  statusColors = {}
}: AdminCrudPageProps) {
  const notifications = useNotifications();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter data
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(item => 
      searchKeys.some(key => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, searchKeys]);

  // Handle create
  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    const initialData: Record<string, any> = {};
    createFields.forEach(field => { initialData[field.name] = ''; });
    setFormData(initialData);
    setIsDialogOpen(true);
  };

  // Handle view
  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
    onView?.(item);
  };

  // Handle edit
  const handleEdit = (item: any) => {
    setIsEditMode(true);
    setSelectedItem(item);
    const itemData: Record<string, any> = {};
    (editFields || createFields).forEach(field => { itemData[field.name] = item[field.name] ?? ''; });
    setFormData(itemData);
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      try { 
        setIsSubmitting(true);
        await onDelete(id); 
        notifications.success('Sucesso', 'Excluído com sucesso.'); 
        onRefetch();
      } catch { 
        notifications.error('Erro', 'Não foi possível excluir.'); 
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && selectedItem) { 
        await onUpdate(selectedItem[idField], formData); 
        notifications.success('Sucesso', 'Atualizado com sucesso.'); 
      } else { 
        await onCreate(formData); 
        notifications.success('Sucesso', 'Criado com sucesso.'); 
      }
      setIsDialogOpen(false); 
      onRefetch();
    } catch { 
      notifications.error('Erro', 'Não foi possível salvar.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form field
  const renderField = (field: FormField, value: any, onChange: (value: any) => void) => {
    if (field.type === 'textarea') {
      return (
        <textarea 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
          placeholder={field.placeholder} 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          required={field.required} 
        />
      );
    }
    if (field.type === 'select') {
      return (
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          required={field.required}
        >
          <option value="">Selecione...</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }
    return (
      <Input 
        type={field.type} 
        placeholder={field.placeholder} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        required={field.required} 
      />
    );
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout title={title}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout title={title}>
        <div className="text-center py-8">
          <p className="text-red-500">Erro: {error.message}</p>
          <Button onClick={onRefetch} className="mt-4">Tentar novamente</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={title}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          <Button onClick={handleCreate} className="bg-accent">
            <Plus className="h-4 w-4 mr-2" />Novo
          </Button>
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
              <Card key={s.key}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    {s.icon}
                    <div className={`text-2xl font-bold ${s.color || ''}`}>{s.value}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar..." 
            className="pl-10" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(c => (
                    <TableHead key={c.key}>{c.label}</TableHead>
                  ))}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, idx) => (
                    <TableRow key={item[idField] || idx}>
                      {columns.map(c => (
                        <TableCell key={c.key}>
                          {c.render ? c.render(item[c.key], item) : item[c.key]}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onView && (
                              <DropdownMenuItem onClick={() => handleView(item)}>
                                <Eye className="h-4 w-4 mr-2" />Ver Detalhes
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4 mr-2" />Editar
                            </DropdownMenuItem>
                            {customActions.map((action, idx) => (
                              <DropdownMenuItem 
                                key={idx} 
                                onClick={() => action.onClick(item)}
                                className={action.variant === 'destructive' ? 'text-red-600' : ''}
                              >
                                {action.icon}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item[idField])} 
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Editar' : 'Novo'} {title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(isEditMode && editFields ? editFields : createFields).map(field => (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  {renderField(field, formData[field.name] || '', v => setFormData({...formData, [field.name]: v}))}
                </div>
              ))}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-accent" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        {viewFields && viewFields.length > 0 && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Detalhes {title}</DialogTitle>
              </DialogHeader>
              {selectedItem && (
                <div className="space-y-4">
                  {viewFields.map(field => (
                    <div key={field.key}>
                      <Label className="text-sm font-medium">{field.label}</Label>
                      <p>{selectedItem[field.key] || '-'}</p>
                    </div>
                  ))}
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCrudPage;

