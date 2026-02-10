# Webside - Sistema de Gestão Empresarial

Sistema completo de gestão empresarial com frontend React/TypeScript e backend Node.js/Express, incluindo módulos para leads, clientes, produtos, pedidos, orçamentos, contratos, faturas e muito mais.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes UI
- **React Query** para gerenciamento de estado e cache
- **React Router** para navegação

### Backend
- **Node.js** com Express.js
- **MySQL** como banco de dados
- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **CORS** configurado
- **Winston** para logs estruturados

### DevOps
- **Docker** e Docker Compose
- **GitHub Actions** para CI/CD
- **ESLint** e **Prettier** para qualidade de código

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- MySQL 8.0+

## 🛠️ Instalação e Configuração

### Desenvolvimento Local

1. **Clone o repositório:**
```bash
git clone <URL_DO_REPOSITORIO>
cd webside
```

2. **Instale as dependências:**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

3. **Configure o ambiente:**
```bash
# Copie o arquivo de exemplo
cp backend/.env.example backend/.env

# Edite as variáveis de ambiente
nano backend/.env
```

4. **Execute com Docker:**
```bash
docker-compose up -d
```

5. **Ou execute localmente:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Produção

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Estrutura do Projeto

```
webside/
├── backend/                 # API REST Node.js/Express
│   ├── controllers/         # Controladores da aplicação
│   ├── middleware/          # Middlewares customizados
│   ├── models/             # Modelos de dados
│   ├── routes/             # Definições de rotas
│   ├── services/           # Lógica de negócio
│   ├── config/             # Configurações
│   └── scripts/            # Scripts utilitários
├── src/                    # Frontend React/TypeScript
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── contexts/           # Contextos React
│   ├── hooks/              # Hooks customizados
│   └── lib/                # Utilitários
├── public/                 # Assets estáticos
├── documentos/             # Documentação do projeto
└── database/               # Scripts SQL
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Usuários de teste disponíveis:

- **Admin:** admin@empresa.com / admin123
- **Teste:** test@test.com / test123
- **Demo:** demo@demo.com / demo123

## 📊 Módulos do Sistema

- **📈 Dashboard** - Visão geral do negócio
- **👥 Leads** - Gestão de leads e prospects
- **🏢 Clientes** - Cadastro e gestão de clientes
- **📦 Produtos** - Catálogo de produtos/serviços
- **📋 Pedidos** - Controle de pedidos de venda
- **💰 Orçamentos** - Criação e gestão de orçamentos
- **📄 Contratos** - Geração de contratos em PDF
- **💳 Financeiro** - Controle financeiro e faturas
- **👷 Implantações** - Gestão de projetos de implantação
- **📊 Relatórios** - Relatórios e analytics

## 🔧 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executa ESLint
```

### Backend
```bash
npm run dev          # Inicia servidor com nodemon
npm run start        # Inicia servidor em produção
npm run test         # Executa testes
npm run healthcheck  # Verifica saúde da aplicação
```

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Com Docker
docker-compose exec backend npm test
```

## 🚀 Deploy

### Desenvolvimento
```bash
docker-compose up -d
```

### Produção
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Documentação da API

A documentação completa da API está disponível em `/api/docs` quando o servidor estiver rodando.

### Endpoints Principais

#### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário
- `GET /api/auth/profile` - Perfil do usuário logado

#### Leads
- `GET /api/leads` - Lista todos os leads
- `POST /api/leads` - Cria novo lead
- `PUT /api/leads/:id` - Atualiza lead
- `DELETE /api/leads/:id` - Remove lead

#### Clientes
- `GET /api/clientes` - Lista todos os clientes
- `POST /api/clientes` - Cria novo cliente
- `PUT /api/clientes/:id` - Atualiza cliente

#### Produtos
- `GET /api/produtos` - Lista todos os produtos
- `POST /api/produtos` - Cria novo produto

#### Pedidos
- `GET /api/pedidos` - Lista todos os pedidos
- `POST /api/pedidos` - Cria novo pedido

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento ou abra uma issue no GitHub.

## 🔄 Versionamento

Este projeto utiliza [SemVer](http://semver.org/) para versionamento. Para ver as versões disponíveis, consulte as [tags neste repositório](https://github.com/seu-usuario/webside/tags).
