# Car Service Booking App - Docker Commands
.PHONY: help build up down restart logs shell migrate seed fresh test

# Colors
GREEN := \033[0;32m
NC := \033[0m

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

# ============================================
# Docker Commands
# ============================================

build: ## Build all Docker containers
	docker compose build

build-no-cache: ## Build all containers without cache
	docker compose build --no-cache

up: ## Start all services
	docker compose up -d

up-logs: ## Start all services with logs
	docker compose up

down: ## Stop all services
	docker compose down

down-volumes: ## Stop all services and remove volumes
	docker compose down -v

restart: ## Restart all services
	docker compose restart

logs: ## View logs from all containers
	docker compose logs -f

logs-backend: ## View backend logs
	docker compose logs -f backend

logs-frontend: ## View frontend logs
	docker compose logs -f frontend

logs-nginx: ## View nginx logs
	docker compose logs -f nginx

logs-queue: ## View queue worker logs
	docker compose logs -f queue

ps: ## Show running containers
	docker compose ps

# ============================================
# Shell Access
# ============================================

shell: ## Access backend shell
	docker compose exec backend sh

shell-frontend: ## Access frontend shell
	docker compose exec frontend sh

shell-postgres: ## Access PostgreSQL shell
	docker compose exec postgres psql -U postgres -d car_service

shell-redis: ## Access Redis CLI
	docker compose exec redis redis-cli

# ============================================
# Laravel Commands
# ============================================

artisan: ## Run artisan command (usage: make artisan cmd="migrate")
	docker compose exec backend php artisan $(cmd)

migrate: ## Run database migrations
	docker compose exec backend php artisan migrate

migrate-fresh: ## Fresh migration (drops all tables)
	docker compose exec backend php artisan migrate:fresh

seed: ## Run database seeders
	docker compose exec backend php artisan db:seed

fresh: ## Fresh migration with seeders
	docker compose exec backend php artisan migrate:fresh --seed

tinker: ## Start Laravel Tinker
	docker compose exec backend php artisan tinker

cache-clear: ## Clear all caches
	docker compose exec backend php artisan cache:clear
	docker compose exec backend php artisan config:clear
	docker compose exec backend php artisan route:clear
	docker compose exec backend php artisan view:clear

key-generate: ## Generate application key
	docker compose exec backend php artisan key:generate

# ============================================
# Testing
# ============================================

test: ## Run backend tests
	docker compose exec backend php artisan test

test-coverage: ## Run tests with coverage
	docker compose exec backend php artisan test --coverage

# ============================================
# Composer Commands
# ============================================

composer-install: ## Install composer dependencies
	docker compose exec backend composer install

composer-update: ## Update composer dependencies
	docker compose exec backend composer update

composer-dump: ## Dump autoload
	docker compose exec backend composer dump-autoload

# ============================================
# NPM Commands (Frontend)
# ============================================

npm-install: ## Install npm dependencies
	docker compose exec frontend npm install

npm-build: ## Build frontend
	docker compose exec frontend npm run build

# ============================================
# Setup Commands
# ============================================

setup: ## Initial setup (build, up, migrate, seed)
	@echo "Building containers..."
	docker compose build
	@echo "Starting services..."
	docker compose up -d
	@echo "Waiting for services to be ready..."
	sleep 10
	@echo "Running migrations..."
	docker compose exec backend php artisan migrate --force
	@echo "Seeding database..."
	docker compose exec backend php artisan db:seed --force
	@echo ""
	@echo "$(GREEN)Setup complete!$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000/api"
	@echo "Mailpit: http://localhost:8025"

reset: ## Reset everything (down, remove volumes, setup)
	docker compose down -v
	$(MAKE) setup

# ============================================
# Development
# ============================================

dev: ## Start development environment with hot-reload
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

dev-build: ## Build and start development environment
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
