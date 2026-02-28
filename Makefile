# Makefile for Webside Docker Management

# Colors
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help build up down restart logs logs-backend logs-frontend logs-db ps clean rebuild dev build-frontend build-backend

help:
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║           Webside Docker Management Commands                 ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)make build$(NC)            - Build all Docker images"
	@echo "$(GREEN)make up$(NC)               - Start all containers"
	@echo "$(GREEN)make down$(NC)             - Stop all containers"
	@echo "$(GREEN)make restart$(NC)         - Restart all containers"
	@echo "$(GREEN)make logs$(NC)            - View all logs"
	@echo "$(GREEN)make logs-backend$(NC)    - View backend logs"
	@echo "$(GREEN)make logs-frontend$(NC)    - View frontend logs"
	@echo "$(GREEN)make logs-db$(NC)         - View database logs"
	@echo "$(GREEN)make ps$(NC)              - Show running containers"
	@echo "$(GREEN)make clean$(NC)           - Remove all containers and volumes"
	@echo "$(GREEN)make rebuild$(NC)        - Rebuild and restart containers"
	@echo "$(GREEN)make dev$(NC)            - Start development environment"
	@echo "$(GREEN)make build-frontend$(NC)  - Build frontend only"
	@echo "$(GREEN)make build-backend$(NC)   - Build backend only"
	@echo ""

build:
	@echo "$(YELLOW)Building Docker images...$(NC)"
	docker compose -f docker/docker-compose.yml build

up:
	@echo "$(YELLOW)Starting containers...$(NC)"
	docker compose -f docker/docker-compose.yml up -d
	@echo "$(GREEN)Services started!$(NC)"
	@echo "  - Frontend:    http://localhost"
	@echo "  - Backend:     http://localhost/api"
	@echo "  - Adminer:     http://localhost:8080"

down:
	@echo "$(YELLOW)Stopping containers...$(NC)"
	docker compose -f docker/docker-compose.yml down

restart:
	@echo "$(YELLOW)Restarting containers...$(NC)"
	docker compose -f docker/docker-compose.yml restart

logs:
	docker compose -f docker/docker-compose.yml logs -f

logs-backend:
	docker compose -f docker/docker-compose.yml logs -f backend

logs-frontend:
	docker compose -f docker/docker-compose.yml logs -f frontend

logs-db:
	docker compose -f docker/docker-compose.yml logs -f db

ps:
	docker compose -f docker/docker-compose.yml ps

clean:
	@echo "$(YELLOW)WARNING: This will remove all containers and volumes!$(NC)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose -f docker/docker-compose.yml down -v
	@echo "$(GREEN)Clean complete!$(NC)"

rebuild:
	docker compose -f docker/docker-compose.yml up -d --build

dev:
	docker compose -f docker/docker-compose.yml up -d
	@echo "$(GREEN)Development environment ready!$(NC)"
	@echo "  - Frontend:    http://localhost"
	@echo "  - Backend:     http://localhost/api"
	@echo "  - Adminer:     http://localhost:8080"

build-frontend:
	docker compose -f docker/docker-compose.yml build frontend

build-backend:
	docker compose -f docker/docker-compose.yml build backend

