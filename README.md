# 📦 order-service (NestJS)

Este microserviço é responsável pelo gerenciamento de **clientes**, **pedidos** e **itens do pedido**. Ele representa o ponto de entrada do sistema de pedidos, iniciando o fluxo de compra, validando produtos com o estoque e integrando-se com o microserviço de inventário via **REST** e **RabbitMQ**.


---

## 🧱 Architecture

- Arquitetura baseada em **microserviços**
- Comunicação entre serviços via **RabbitMQ (mensageria)** e **REST API**
- Padrão **Domain Driven Design (DDD)** com separação clara entre camadas
- Testes automatizados (unitários e de integração)
- Exposição da API via **Swagger**
- Banco de dados relacional **PostgreSQL**
- Containerizado com **Docker**
---

## 📌 Technologies Used

| Layer           | Technology        |
|------------------|------------------|
| Language         | TypeScript       |
| Framework        | NestJS           |
| Database         | PostgreSQL       |
| Messaging Queue  | RabbitMQ         |
| Testing          | Jest             |
| API Docs         | Swagger (via @nestjs/swagger) |
| Containerization | Docker + Docker Compose |

---

## 📘 Entities and Relationships

### 👤 Customer

| Field       | Type     | Required | Description                                     |
|-------------|----------|----------|-------------------------------------------------|
| id          | integer  | Sim      | Identificador do cliente  identifier            |
| name        | string   | Sim      | Nome do cliente  name                           |
| email       | string   | Sim      | E-mail único address                            |
| phoneNumber | string   | Sim      | Telefone de contato number                      |

🔁 **Relationship:**  
- 1 **Customer** possui N **Orders**

---

### 📦 Order

| Field       | Type     | Required | Description                               |
|-------------|----------|----------|-------------------------------------------|
| id          | integer  | Sim      | Identificador do pedido                   |
| customerId  | integer  | Sim      | Relacionado ao Cliente                    |
| status      | enum     | Sim      | Status: PENDING, APPROVED, REJECTED       |
| createdAt   | datetime | Sim      | Data/hora do pedido                       | 

🔁 **Relationship:**  
- 1 **Order** possui N **OrderItems**

---

### 🧾 OrderItem

| Field         | Type     | Required | Description                                |
|---------------|----------|----------|--------------------------------------------|
| id            | integer  | Sim      | Identificador                              |
| orderId       | integer  | Sim      | Referência ao pedido                       |
| productId     | integer  | Sim      | ID do produto (referência externa)         |
| quantity      | integer  | Sim      | Quantidade solicitada                      |
| unitPrice     | decimal  | Sim      | Preço no momento do pedido                 |

---

## 🔁 Integração com o inventory-service

- **Validação de estoque** via REST ou mensagem RabbitMQ
- **Fluxo assíncrono** para confirmação ou rejeição do pedido
- Atualização de status do pedido após resposta do inventário

---

## 🚀 Endpoints (Swagger)

- Documentação disponível em: `/api/docs`
- Examples:
  - `POST /customers`
  - `GET /customers/:id`
  - `POST /orders`
  - `GET /orders/:id`
  - `POST /orders/validate`  (inicia o fluxo de validação)

---

## 🧪 Testing

- Testes com **Jest** ou **vitest**
- Cobertura mínima de 80%
- Separação de testes unitários e de integração
- Mocks para RabbitMQ e requisições REST externas

---

## 🐳 Docker

### Run with Docker Compose:

```bash
docker-compose up --build
```

📂 Project Structure
```bash
src/
├── modules/
├── customer/
│   ├── customer.entity.ts
│   ├── customer.service.ts
│   └── customer.controller.ts
│   └── customer.module.ts
├── order/
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   ├── order.service.ts
│   └── order.controller.ts
│   └── order.module.ts
├── infra/
├── messaging/
│   ├── rabbitmq.module.ts
│   └── handlers/
├── database/
│   └── database.module.ts
├── main.ts
```