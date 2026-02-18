# Webside - Docker Deployment Guide

## 📋 Overview

This project now includes a complete Docker setup for easy deployment and development. The Docker configuration includes:

- **Frontend**: Nginx serving the React production build
- **Backend**: Node.js Express API
- **Database**: MySQL 8.0 (optional - can use external)
- **Adminer**: Database management UI (optional)

## 🚀 Quick Start

### Option 1: Using External Database (Recommended for Development)

```bash
# Start with external database
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Option 2: Using Local Database

```bash
# Start with local MySQL database
docker-compose up -d
```

## 📖 Configuration

### Environment Variables

Copy `.env.docker` to `.env` and adjust as needed:

```bash
cp .env.docker .env
```

### Database Configuration

The system can use either:
1. **External database** (Hostgator) - Already configured
2. **Local MySQL** - Created automatically with Docker

## 🛠️ Management Commands

Using Makefile (recommended):

```bash
# Build images
make build

# Start all services
make up

# Stop all services
make down

# View logs
make logs

# View backend logs
make logs-backend

# View frontend logs
make logs-frontend

# Restart services
make restart

# Clean everything (removes containers and volumes)
make clean

# Rebuild and start
make rebuild
```

### Using Docker Compose Directly

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Stop and remove volumes
docker-compose down -v
```

## 🌐 Service URLs

After starting:

| Service    | URL                      |
|------------|--------------------------|
| Frontend   | http://localhost         |
| Backend    | http://localhost/api    |
| Adminer    | http://localhost:8080    |

## 🔧 Development

### Rebuild after code changes

```bash
# Rebuild and restart
make rebuild

# Or manually
docker-compose up -d --build
```

### Access container shell

```bash
# Backend
docker exec -it webside-backend-1 sh

# Database
docker exec -it webside-db-1 mysql -u root -p
```

## 🔒 Security Notes

1. **Change JWT_SECRET** in `.env` before production
2. **Database passwords** should be changed from defaults
3. **Use HTTPS** in production (configure Nginx with SSL certificates)
4. **Don't expose Adminer** in production (remove from docker-compose.yml)

## 📦 Project Structure

```
webside/
├── Dockerfile.frontend     # Frontend Nginx image
├── Dockerfile.backend     # Backend Node.js image
├── docker-compose.yml     # Main compose file
├── docker-compose.dev.yml # Development override
├── nginx.conf            # Nginx configuration
├── Makefile              # Management commands
├── .dockerignore         # Docker ignore file
├── backend/              # Node.js backend source
└── src/                 # React frontend source
```

## 🔄 Updating

To update after code changes:

```bash
# Full rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🐛 Troubleshooting

### Check container status
```bash
docker-compose ps
```

### View logs
```bash
docker-compose logs --tail=100
```

### Restart a specific service
```bash
docker-compose restart backend
```

### Rebuild specific service
```bash
docker-compose up -d --build frontend
```

### Check health
```bash
curl http://localhost/api/health
```

## 🚀 Production Deployment

For production deployment:

1. Update `.env` with production values:
   - Set secure JWT_SECRET
   - Configure database credentials
   - Set NODE_ENV=production

2. Configure SSL/HTTPS in nginx.conf

3. Update CORS settings in backend if needed

4. Review and update security headers in nginx.conf

## 📝 Additional Notes

- The frontend API calls are automatically proxied through Nginx to the backend
- Health checks are configured for all services
- The system uses a shared network for container communication
- Data volumes persist database data between restarts (if using local DB)

