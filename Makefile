# Discord Voice Timer Bot - Docker Management
# Simple commands to manage Docker deployment

.PHONY: help build up down logs restart clean dev prod

help: ## Show this help message
	@echo "Discord Voice Timer Bot - Docker Commands"
	@echo ""
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the Docker image
	@cd docker && docker-compose build

up: ## Start the bot (detached)
	@cd docker && docker-compose up -d
	@echo "✅ Bot started! Use 'make logs' to see output"

down: ## Stop the bot
	@cd docker && docker-compose down

logs: ## Show bot logs (follow)
	@cd docker && docker-compose logs -f

restart: ## Restart the bot
	@cd docker && docker-compose restart

clean: ## Remove containers and images
	@cd docker && docker-compose down --rmi all --volumes

dev: ## Start in development mode
	@cd docker && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "✅ Bot started in development mode!"

prod: ## Start in production mode
	@cd docker && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "✅ Bot started in production mode!"

# Quick deployment (equivalent to running deploy scripts)
deploy: build up ## Quick deployment (build + start)

status: ## Show container status
	@cd docker && docker-compose ps
