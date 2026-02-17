const API_BASE_URL = 'https://www.websidesistemas.com.br/api';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; senha: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Leads endpoints
  async getLeads() {
    return this.request('/leads');
  }

  async getLead(id: number) {
    return this.request(`/leads/${id}`);
  }

  async createLead(leadData: any) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async updateLead(id: number, leadData: any) {
    return this.request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  }

  async deleteLead(id: number) {
    return this.request(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  // Clientes endpoints
  async getClientes() {
    return this.request('/clientes');
  }

  async getCliente(id: number) {
    return this.request(`/clientes/${id}`);
  }

  async createCliente(clienteData: any) {
    return this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(clienteData),
    });
  }

  async updateCliente(id: number, clienteData: any) {
    return this.request(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clienteData),
    });
  }

  async deleteCliente(id: number) {
    return this.request(`/clientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Produtos endpoints
  async getProdutos() {
    return this.request('/produtos');
  }

  async createProduto(produtoData: any) {
    return this.request('/produtos', {
      method: 'POST',
      body: JSON.stringify(produtoData),
    });
  }

  async updateProduto(id: number, produtoData: any) {
    return this.request(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(produtoData),
    });
  }

  async deleteProduto(id: number) {
    return this.request(`/produtos/${id}`, {
      method: 'DELETE',
    });
  }

  // Pedidos endpoints
  async getPedidos() {
    return this.request('/pedidos');
  }

  async createPedido(pedidoData: any) {
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedidoData),
    });
  }

  async updatePedido(id: number, pedidoData: any) {
    return this.request(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pedidoData),
    });
  }

  async deletePedido(id: number) {
    return this.request(`/pedidos/${id}`, {
      method: 'DELETE',
    });
  }

  // Contratos endpoints
  async getContratos() {
    return this.request('/contratos');
  }

  async createContrato(contratoData: any) {
    return this.request('/contratos', {
      method: 'POST',
      body: JSON.stringify(contratoData),
    });
  }

  async updateContrato(id: number, contratoData: any) {
    return this.request(`/contratos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contratoData),
    });
  }

  async deleteContrato(id: number) {
    return this.request(`/contratos/${id}`, {
      method: 'DELETE',
    });
  }

  // Faturas endpoints
  async getFaturas() {
    return this.request('/faturas');
  }

  async createFatura(faturaData: any) {
    return this.request('/faturas', {
      method: 'POST',
      body: JSON.stringify(faturaData),
    });
  }

  async updateFatura(id: number, faturaData: any) {
    return this.request(`/faturas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faturaData),
    });
  }

  async deleteFatura(id: number) {
    return this.request(`/faturas/${id}`, {
      method: 'DELETE',
    });
  }

  // Status endpoints
  async getStatus() {
    return this.request('/status');
  }

  // Templates endpoints
  async getTemplates() {
    return this.request('/templates');
  }

  // Implantacoes endpoints
  async getImplantacoes() {
    return this.request('/implantacoes');
  }

  async createImplantacao(implantacaoData: any) {
    return this.request('/implantacoes', {
      method: 'POST',
      body: JSON.stringify(implantacaoData),
    });
  }

  async updateImplantacao(id: number, implantacaoData: any) {
    return this.request(`/implantacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(implantacaoData),
    });
  }

  async deleteImplantacao(id: number) {
    return this.request(`/implantacoes/${id}`, {
      method: 'DELETE',
    });
  }

  // Orcamentos endpoints
  async getOrcamentos() {
    return this.request('/orcamentos');
  }

  async getOrcamento(id: number) {
    return this.request(`/orcamentos/${id}`);
  }

  async createOrcamento(orcamentoData: any) {
    return this.request('/orcamentos', {
      method: 'POST',
      body: JSON.stringify(orcamentoData),
    });
  }

  async updateOrcamento(id: number, orcamentoData: any) {
    return this.request(`/orcamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orcamentoData),
    });
  }

  async deleteOrcamento(id: number) {
    return this.request(`/orcamentos/${id}`, {
      method: 'DELETE',
    });
  }

  async updateOrcamentoStatus(id: number, status: string) {
    return this.request(`/orcamentos/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Colaboradores endpoints
  async getColaboradores() {
    return this.request('/colaboradores');
  }

  async createColaborador(colaboradorData: any) {
    return this.request('/colaboradores', {
      method: 'POST',
      body: JSON.stringify(colaboradorData),
    });
  }

  async updateColaborador(id: number, colaboradorData: any) {
    return this.request(`/colaboradores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(colaboradorData),
    });
  }

  async deleteColaborador(id: number) {
    return this.request(`/colaboradores/${id}`, {
      method: 'DELETE',
    });
  }

  // Empresas endpoints
  async getEmpresas() {
    return this.request('/empresas');
  }

  async createEmpresa(empresaData: any) {
    return this.request('/empresas', {
      method: 'POST',
      body: JSON.stringify(empresaData),
    });
  }

  async updateEmpresa(id: number, empresaData: any) {
    return this.request(`/empresas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(empresaData),
    });
  }

  async deleteEmpresa(id: number) {
    return this.request(`/empresas/${id}`, {
      method: 'DELETE',
    });
  }

  // Transacoes endpoints
  async getTransacoes() {
    return this.request('/transacoes');
  }

  async createTransacao(transacaoData: any) {
    return this.request('/transacoes', {
      method: 'POST',
      body: JSON.stringify(transacaoData),
    });
  }

  async updateTransacao(id: number, transacaoData: any) {
    return this.request(`/transacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transacaoData),
    });
  }

  async deleteTransacao(id: number) {
    return this.request(`/transacoes/${id}`, {
      method: 'DELETE',
    });
  }

  // User profile endpoints
  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // User preferences endpoints
  async getUserPreferences() {
    return this.request('/auth/preferences');
  }

  async updateUserPreferences(preferencesData: any) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferencesData),
    });
  }

  // System parameters endpoints
  async getParametrosEmpresa() {
    return this.request('/parametros-empresa');
  }

  async updateParametrosEmpresa(parametrosData: any) {
    return this.request('/parametros-empresa', {
      method: 'PUT',
      body: JSON.stringify(parametrosData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;

