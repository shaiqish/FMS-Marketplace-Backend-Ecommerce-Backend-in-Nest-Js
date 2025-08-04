# 🛒 E-Commerce Backend API

A full-featured e-commerce backend built with **NestJS**, **PostgreSQL**, and **TypeORM**.  
It includes user authentication, product management, cart functionality, and order checkout.

---

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based signup & login
  - Role-based access control (Admin, User)

- **Product Management**
  - Create, Read, Update, Delete products
  - Public product listing and detail view

- **Cart Functionality**
  - Add products to cart
  - Update or remove cart items
  - View complete cart

- **Order & Checkout**
  - Place order directly from cart
  - Manage shipping addresses
  - Track order history and status

---

## 🧱 Tech Stack

- **NestJS** - Modular and scalable backend framework
- **PostgreSQL** - Relational database
- **TypeORM** - Elegant ORM for database operations
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing
- **class-validator** - DTO and input validation

---

## ⚙️ Setup & Installation

```
git clone https://github.com/your-username/nest-ecommerce-backend.git
cd nest-ecommerce-backend
```

```
npm install
```

Create a `.env` file in the root:

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_DATABASE=ecommerce_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

```
# Development
npm run start:dev

# Production
npm run start:prod
```

---

## 🔐 Authorization

```
# Use token from login:
Authorization: Bearer <JWT_TOKEN>

# Public routes:
- POST /auth/register
- POST /auth/login
- GET  /products
- GET  /products/:id

# Requires Authentication:
- Cart routes
- Order routes

# Requires Admin:
- POST /products
- PUT  /products/:id
- DELETE /products/:id
```

---

## 🧪 Testing

```
# Unit Tests
npm run test

# End-to-End Tests
npm run test:e2e
```

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👤 Author

Created by **Shaiq Ishtiaq**  
https://github.com/shaiqish
