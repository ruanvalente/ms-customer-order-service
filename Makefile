# Makefile para ambiente com Podman

# Desenvolvimento local (banco + rabbitmq)
dev-up:
	podman-compose -f docker-compose.dev.yml up -d

dev-down:
	podman-compose -f docker-compose.dev.yml down

# Produção (build da aplicação)
prod-up:
	podman-compose -f docker-compose.prod.yml up --build

prod-down:
	podman-compose -f docker-compose.prod.yml down

logs-dev:
	podman-compose -f docker-compose.dev.yml logs -f

logs-prod:
	podman-compose -f docker-compose.prod.yml logs -f
