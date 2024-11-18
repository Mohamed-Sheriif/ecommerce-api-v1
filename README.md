# E-commerce API

This is an E-commerce API built with Node.js, Express, and MongoDB. It provides endpoints for managing categories, subcategories, brands, products, users, authentication, and reviews.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)
- [Environment Variables](#environment-variables)
- [Database Seeder](#database-seeder)
- [Error Handling](#error-handling)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/ecommerce-api.git
   cd ecommerce-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables (see [Environment Variables](#environment-variables)).

4. Start the server:
   ```sh
   npm start
   ```

## Usage

- The API will be running on `http://localhost:8000` by default.
- Use tools like Postman or Insomnia to interact with the API endpoints.

## API Endpoints

- **Categories**

  - `GET /api/v1/categories`
  - `POST /api/v1/categories`
  - `GET /api/v1/categories/:id`
  - `PATCH /api/v1/categories/:id`
  - `DELETE /api/v1/categories/:id`

- **Subcategories**

  - `GET /api/v1/subCategories`
  - `POST /api/v1/subCategories`
  - `GET /api/v1/subCategories/:id`
  - `PATCH /api/v1/subCategories/:id`
  - `DELETE /api/v1/subCategories/:id`

- **Brands**

  - `GET /api/v1/brands`
  - `POST /api/v1/brands`
  - `GET /api/v1/brands/:id`
  - `PATCH /api/v1/brands/:id`
  - `DELETE /api/v1/brands/:id`

- **Products**

  - `GET /api/v1/products`
  - `POST /api/v1/products`
  - `GET /api/v1/products/:id`
  - `PATCH /api/v1/products/:id`
  - `DELETE /api/v1/products/:id`

- **Users**

  - `GET /api/v1/users`
  - `POST /api/v1/users`
  - `GET /api/v1/users/:id`
  - `PATCH /api/v1/users/:id`
  - `DELETE /api/v1/users/:id`

- **Logged User**

  - `GET /api/v1/users/me`
  - `PATCH /api/v1/users/updateMyPassword`
  - `PATCH /api/v1/users/updateMe`
  - `DELETE /api/v1/users/deleteMe`

- **Authentication**

  - `POST /api/v1/auth/signup`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/forgotPassword`
  - `POST /api/v1/auth/verifyResetCode`
  - `POST /api/v1/auth/resetPassword`

- **Reviews**
  - `GET /api/v1/reviews`
  - `POST /api/v1/reviews`
  - `GET /api/v1/reviews/:id`
  - `PATCH /api/v1/reviews/:id`
  - `DELETE /api/v1/reviews/:id`

## Authentication and Authorization

The API uses JWT (JSON Web Tokens) for authentication and authorization. There are three main roles:

- **User**: Can view and purchase products, and leave reviews.
- **Manager**: Can manage products, categories, subcategories, and brands.
- **Admin**: Has full access to all resources and can manage users and reviews.

### Authentication Flow

1. **Signup**: Users can create an account by providing their details.

   - Endpoint: `POST /api/v1/auth/signup`

2. **Login**: Users can log in with their email and password to receive a JWT.

   - Endpoint: `POST /api/v1/auth/login`

3. **Forgot Password**: Users can request a password reset link.

   - Endpoint: `POST /api/v1/auth/forgotPassword`

4. **Reset Password**: Users can reset their password using the token sent to their email.

   - Endpoint: `PATCH /api/v1/auth/resetPassword/:token`

5. **Update Password**: Logged-in users can update their password.

   - Endpoint: `PATCH /api/v1/auth/updateMyPassword`

6. **Protected Routes**: Access to certain routes is restricted based on the user's role. The JWT must be included in the `Authorization` header as a Bearer token.
