# E-commerce API

This is a comprehensive E-commerce API built with **Node.js**, **Express**, and **MongoDB**. It provides endpoints for managing categories, subcategories, brands, products, users, authentication, reviews, orders, carts, coupons, wishlists, and addresses.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Authentication and Authorization](#authentication-and-authorization)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Mohamed-Sheriif/ecommerce-api-v1
   cd ecommerce-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `config.env` file in the root directory and add your environment variables (see [Environment Variables](#environment-variables)).

4. Start the server:

   ```sh
   npm run start:prod
   ```

## Usage

- The API will run on `http://localhost:8000` by default.
- Use tools like **Postman** or **Insomnia** to interact with the API endpoints.

## Features

- User authentication and authorization (JWT)
- Role-based access control (User, Manager, Admin)
- Product, category, subcategory, and brand management
- Shopping cart and wishlist functionality
- Order creation, payment, and delivery tracking
- Coupon and discount management
- Product reviews and ratings
- User address management
- RESTful API design with clear error handling and validation
- Comprehensive API documentation with Swagger
- Environment-based configuration
- Ready for deployment on Vercel

## Technologies Used

- **Node.js** & **Express** – Backend framework
- **MongoDB** & **Mongoose** – Database and ODM
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **Multer** – File uploads
- **Sharp** – Image processing
- **Stripe** – Payment integration
- **Swagger** – API documentation
- **dotenv** – Environment variable management
- **Vercel** – Deployment
- **Morgan** – HTTP request logging
- **nodemailer** – Sending emails

## API Endpoints

### **Categories**

- `GET /api/v1/categories` - Get all categories.
- `POST /api/v1/categories` - Create a new category.
- `GET /api/v1/categories/:id` - Get a category by ID.
- `PATCH /api/v1/categories/:id` - Update a category by ID.
- `DELETE /api/v1/categories/:id` - Delete a category by ID.

### **Subcategories**

- `GET /api/v1/subCategories` - Get all subcategories.
- `POST /api/v1/subCategories` - Create a new subcategory.
- `GET /api/v1/subCategories/:id` - Get a subcategory by ID.
- `PATCH /api/v1/subCategories/:id` - Update a subcategory by ID.
- `DELETE /api/v1/subCategories/:id` - Delete a subcategory by ID.

### **Brands**

- `GET /api/v1/brands` - Get all brands.
- `POST /api/v1/brands` - Create a new brand.
- `GET /api/v1/brands/:id` - Get a brand by ID.
- `PATCH /api/v1/brands/:id` - Update a brand by ID.
- `DELETE /api/v1/brands/:id` - Delete a brand by ID.

### **Products**

- `GET /api/v1/products` - Get all products.
- `POST /api/v1/products` - Create a new product.
- `GET /api/v1/products/:id` - Get a product by ID.
- `PATCH /api/v1/products/:id` - Update a product by ID.
- `DELETE /api/v1/products/:id` - Delete a product by ID.

### **Users**

- `GET /api/v1/users` - Get all users (Admin only).
- `POST /api/v1/users` - Create a new user (Admin only).
- `GET /api/v1/users/:id` - Get a user by ID (Admin only).
- `PATCH /api/v1/users/:id` - Update a user by ID (Admin only).
- `DELETE /api/v1/users/:id` - Delete a user by ID (Admin only).

### **Logged User**

- `GET /api/v1/users/me` - Get the logged-in user's profile.
- `PATCH /api/v1/users/updateMyPassword` - Update the logged-in user's password.
- `PATCH /api/v1/users/updateMe` - Update the logged-in user's profile.
- `DELETE /api/v1/users/deleteMe` - Delete the logged-in user's account.

### **Authentication**

- `POST /api/v1/auth/signup` - Sign up a new user.
- `POST /api/v1/auth/login` - Log in a user.
- `POST /api/v1/auth/forgotPassword` - Request a password reset.
- `POST /api/v1/auth/verifyResetCode` - Verify a password reset code.
- `POST /api/v1/auth/resetPassword` - Reset a user's password.

### **Reviews**

- `GET /api/v1/reviews` - Get all reviews.
- `POST /api/v1/reviews` - Create a new review.
- `GET /api/v1/reviews/:id` - Get a review by ID.
- `PATCH /api/v1/reviews/:id` - Update a review by ID.
- `DELETE /api/v1/reviews/:id` - Delete a review by ID.

### **Wishlist**

- `GET /api/v1/wishlist` - Get the logged-in user's wishlist.
- `POST /api/v1/wishlist` - Add a product to the wishlist.
- `DELETE /api/v1/wishlist/:productId` - Remove a product from the wishlist.

### **Addresses**

- `GET /api/v1/addresses` - Get the logged-in user's addresses.
- `POST /api/v1/addresses` - Add a new address.
- `DELETE /api/v1/addresses/:addressId` - Remove an address.

### **Cart**

- `GET /api/v1/cart` - Get the logged-in user's cart.
- `POST /api/v1/cart` - Add a product to the cart.
- `PUT /api/v1/cart/:productId` - Update product quantity in the cart.
- `DELETE /api/v1/cart/:productId` - Remove a product from the cart.
- `DELETE /api/v1/cart` - Clear the cart.
- `PUT /api/v1/cart/applyCoupon` - Apply a coupon to the cart.

### **Coupons**

- `GET /api/v1/coupons` - Get all coupons.
- `POST /api/v1/coupons` - Create a new coupon.
- `GET /api/v1/coupons/:id` - Get a coupon by ID.
- `PATCH /api/v1/coupons/:id` - Update a coupon by ID.
- `DELETE /api/v1/coupons/:id` - Delete a coupon by ID.

### **Orders**

- `GET /api/v1/orders` - Get all orders (Admin/Manager/User).
- `GET /api/v1/orders/:id` - Get an order by ID.
- `POST /api/v1/orders/:cartId` - Create a new order.
- `PUT /api/v1/orders/:id/pay` - Mark an order as paid.
- `PUT /api/v1/orders/:id/deliver` - Mark an order as delivered.
- `GET /api/v1/orders/checkout-session/:cartId` - Create a Stripe checkout session.

## Authentication and Authorization

The API uses **JWT (JSON Web Tokens)** for authentication and authorization. There are three main roles:

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

   - Endpoint: `POST /api/v1/auth/resetPassword`

5. **Update Password**: Logged-in users can update their password.

   - Endpoint: `PATCH /api/v1/users/updateMyPassword`

6. **Protected Routes**: Access to certain routes is restricted based on the user's role. The JWT must be included in the `Authorization` header as a Bearer token.

## Environment Variables

Create a `config.env` file in the root directory with the following variables:

```env
PORT=8000
NODE_ENV=development
DATABASE=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## License

This project is licensed under the MIT License.
