# Backend - Webside API

API REST desenvolvida em Node.js/Express para o sistema de gestão empresarial Webside.

## 🚀 Tecnologias

- **Node.js 18+** com Express.js
- **MySQL 8.0+** como banco de dados
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Winston** para logs
- **Joi** para validação
- **multer** para upload de arquivos

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=webside

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Logs
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🚀 Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Docker
```bash
docker build -t webside-backend .
docker run -p 5000:5000 webside-backend
```

## 📚 Documentação da API

### Autenticação

Todas as rotas (exceto login e registro) requerem autenticação via JWT no header:

```
Authorization: Bearer <token>
```

#### POST /api/auth/login
Login de usuário.

**Request:**
```json
{
  "email": "admin@empresa.com",
  "senha": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@empresa.com",
    "tipo": "funcionario"
  }
}
```

#### POST /api/auth/register
Registro de novo usuário (requer autenticação admin).

#### GET /api/auth/profile
Obtém perfil do usuário logado.

### Leads

#### GET /api/leads
Lista todos os leads com paginação.

**Query Parameters:**
- `page` (number): Página atual (padrão: 1)
- `limit` (number): Itens por página (padrão: 10)
- `status` (string): Filtrar por status
- `origem` (string): Filtrar por origem

**Response:**
```json
{
  "leads": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### POST /api/leads
Cria novo lead.

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "empresa": "Empresa XYZ",
  "origem": "site",
  "status": "novo",
  "observacoes": "Lead interessado em nossos serviços"
}
```

#### PUT /api/leads/:id
Atualiza lead existente.

#### DELETE /api/leads/:id
Remove lead.

### Clientes

#### GET /api/clientes
Lista todos os clientes.

#### POST /api/clientes
Cria novo cliente.

**Request:**
```json
{
  "nome_fantasia": "Empresa XYZ Ltda",
  "razao_social": "Empresa XYZ Ltda ME",
  "cnpj": "12345678000199",
  "email": "contato@empresa.com",
  "telefone": "1133334444",
  "endereco": {
    "rua": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234567"
  }
}
```

### Produtos

#### GET /api/produtos
Lista todos os produtos.

#### POST /api/produtos
Cria novo produto.

**Request:**
```json
{
  "nome": "Sistema ERP Básico",
  "descricao": "Sistema completo de gestão empresarial",
  "preco": 2999.99,
  "categoria": "software",
  "ativo": true
}
```

### Pedidos

#### GET /api/pedidos
Lista todos os pedidos.

#### POST /api/pedidos
Cria novo pedido.

**Request:**
```json
{
  "id_cliente": 1,
  "itens": [
    {
      "id_produto": 1,
      "quantidade": 1,
      "preco_unitario": 2999.99
    }
  ],
  "observacoes": "Pedido urgente"
}
```

### Orçamentos

#### GET /api/orcamentos
Lista todos os orçamentos.

#### POST /api/orcamentos
Cria novo orçamento.

### Outros Módulos

- **Contratos:** `/api/contratos`
- **Faturas:** `/api/faturas`
- **Implantações:** `/api/implantacoes`
- **Transações:** `/api/transacoes`
- **Parâmetros Empresa:** `/api/parametros-empresa`

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes de integração
npm run test:integration
```

## 📊 Monitoramento

### Health Check
```
GET /api/health
```

### Logs
Os logs são salvos em `logs/app.log` e incluem:
- Requisições HTTP
- Erros do sistema
- Operações do banco de dados

## 🔒 Segurança

- **Rate Limiting:** Implementado para prevenir abuso
- **Input Sanitization:** Todos os inputs são sanitizados
- **CORS:** Configurado para origens permitidas
- **Helmet:** Headers de segurança adicionados
- **JWT:** Tokens com expiração configurável

## 📁 Estrutura

```
backend/
├── controllers/         # Controladores da aplicação
├── middleware/          # Middlewares customizados
├── models/             # Modelos de dados
├── routes/             # Definições de rotas
├── services/           # Lógica de negócio
├── config/             # Configurações
├── scripts/            # Scripts utilitários
├── logs/               # Arquivos de log
├── tests/              # Testes
└── utils/              # Utilitários
```

## 🤝 Desenvolvimento

### Padrões de Código

- **ESLint** configurado com regras do Airbnb
- **Prettier** para formatação automática
- **Husky** para pre-commit hooks
- **Conventional Commits** para mensagens

### Commits

```
feat: add new endpoint for leads
fix: resolve login validation bug
docs: update API documentation
```

### Branches

- `main`: Código de produção
- `develop`: Desenvolvimento ativo
- `feature/*`: Novas funcionalidades
- `bugfix/*`: Correções de bugs
- `hotfix/*`: Correções críticas

## 🚀 Deploy

### Ambiente de Desenvolvimento
```bash
docker-compose up -d
```

### Ambiente de Produção
```bash
# Build da imagem
docker build -t webside-backend:latest .

# Deploy com docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Ou com Kubernetes
kubectl apply -f k8s/
```

## 📞 Suporte

Para questões técnicas ou bugs, abra uma issue no repositório principal.
