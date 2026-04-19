# BookVerse Backend API

A complete backend API for a book e-commerce platform with user authentication, book management, shopping cart, order processing with Razorpay payment integration, review system, and admin analytics dashboard.

## Features

- **User Authentication**: JWT-based authentication with access tokens (7 days) and refresh tokens (30 days), role-based access control (user/admin)
- **Book Management**: Full CRUD operations with file uploads (cover images and PDF files)
- **Category Management**: Create, read, update, and delete book categories
- **Shopping Cart**: Add, update, remove items, and clear cart
- **Wishlist**: Save books for later purchase
- **Order Processing**: Razorpay payment integration with webhook support
- **Review System**: Users can rate and review books (1-5 stars) with pagination
- **Coupon System**: Discount coupons with category targeting and usage limits
- **Admin Analytics**: Revenue tracking, weekly sales, genre distribution, top performers
- **Email Notifications**: Welcome emails and password reset using Pug templates
- **File Upload**: Secure file upload with Multer (cover images and book files)

## Tech Stack

- **Runtime**: Node.js 24.11.1, npm 10.9.4
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.2.1
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **Payment Gateway**: Razorpay 2.9.6
- **Email Service**: Nodemailer 8.0.4 with Pug 3.0.4 templates
- **File Upload**: Multer 2.1.0
- **Security**: CORS enabled, HTTP-only cookies

## Prerequisites

- Node.js 24.11.1 or higher
- npm 10.9.4 or higher
- MongoDB (local or MongoDB Atlas)
- Razorpay account (for payment integration)
- Email service account (Gmail or other SMTP service)

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Book-verse-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and fill in the required values:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT token generation
   - `JWT_REFRESH_SECRET` - Secret key for refresh token generation
   - `EMAIL_USER` - Email address for sending emails
   - `EMAIL_PASSWORD` - Email password or app-specific password
   - `RAZORPAY_KEY_ID` - Razorpay key ID
   - `RAZORPAY_KEY_SECRET` - Razorpay key secret

4. **Database connection**
   The application will automatically connect to MongoDB using the `MONGODB_URI` from your `.env` file when you start the server.

## Initial Setup with Seeders

To populate the database with initial data (users, categories, and books), run the seeder:

```bash
npm run seed
```

This will:
- Create an admin user and a regular user
- Seed 42 book categories
- Seed 10 sample books with proper category references

**Note**: Ensure your MongoDB connection is configured in `.env` before running the seeder.

## Project Structure

```
Book-verse-backend/
├── config/
│   ├── db.js                 # MongoDB connection configuration
│   └── razorPay.js           # Razorpay initialization
├── controllers/
│   ├── authController.js     # Authentication logic (login, register, password reset)
│   ├── bookController.js     # Book CRUD operations
│   ├── cartController.js     # Shopping cart operations
│   ├── categoryController.js # Category management
│   ├── couponController.js   # Coupon management
│   ├── orderController.js    # Order processing & analytics
│   ├── reviewController.js   # Review & rating operations
│   ├── userController.js     # User management
│   └── wishlistController.js # Wishlist operations
├── halpers/
│   ├── bookReviewHelper.js   # Helper for updating book review stats
│   ├── cartHelper.js         # Cart data organization
│   ├── relativePathGetter.js # File path conversion utilities
│   └── resetPasswordTokenGenerator.js # Reset token generation
├── middleware/
│   └── authMiddleware.js     # JWT authentication & role authorization
├── modal/
│   ├── bookModal.js          # Book schema
│   ├── cartModel.js          # Cart schema
│   ├── categoryModel.js      # Category schema
│   ├── couponModel.js        # Coupon schema
│   ├── orderModel.js         # Order schema
│   ├── reviewModal.js        # Review schema
│   ├── userModal.js          # User schema
│   └── wishlistModel.js      # Wishlist schema
├── routes/
│   ├── authRouter.js         # Authentication routes
│   ├── bookRouter.js         # Book routes
│   ├── cartRouter.js         # Cart routes
│   ├── categoryRoutes.js     # Category routes
│   ├── couponRouter.js       # Coupon routes
│   ├── orderRouter.js        # Order routes
│   ├── reviewRouter.js       # Review routes
│   ├── userRouter.js         # User routes
│   └── wishlistRouter.js     # Wishlist routes
├── seeders/
│   ├── seed.js               # Main seeder (orchestrates all seeding)
│   ├── seedBooks.js          # Books seeder
│   ├── seedCategories.js     # Categories seeder
│   └── seedUsers.js          # Users seeder
├── services/
│   ├── authService.js        # Authentication service
│   └── emailService.js       # Email service (Nodemailer)
├── templates/
│   ├── resetPassword.pug     # Password reset email template
│   └── welcomeEmail.pug      # Welcome email template
├── utils/
│   ├── APIResponse.js        # Standardized API response utility
│   └── fileUpload.js         # Multer configuration for file uploads
├── files/                    # Static file storage (created at runtime)
│   ├── coverImage/           # Book cover images
│   └── [book files]          # Book PDF files
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── appRouter.js              # Main router aggregation
├── index.js                  # Application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password/:token` | Reset password with token | No |

### Books

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books/all` | Get all books | No |
| GET | `/api/books/details/:id` | Get book details | No |
| POST | `/api/books/create` | Create new book | Admin |
| PATCH | `/api/books/update/:id` | Update book | Admin |
| DELETE | `/api/books/delete/:id` | Delete book | Admin |
| GET | `/api/books/download/:id` | Download book file | User |
| GET | `/api/books/analytics/genres` | Get genre analytics | Admin |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories/` | Get all categories | Yes |
| POST | `/api/categories/` | Create category | Yes |
| GET | `/api/categories/:categoryId` | Get category by ID | Yes |
| PATCH | `/api/categories/:categoryId` | Update category | Yes |
| DELETE | `/api/categories/:categoryId` | Delete category | Yes |

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart/get` | Get user's cart | Yes |
| GET | `/api/cart/cart/:userId` | Get cart by user ID | Yes |
| POST | `/api/cart/add` | Add item to cart | Yes |
| PUT | `/api/cart/update` | Update cart item quantity | Yes |
| DELETE | `/api/cart/remove/:bookId` | Remove item from cart | Yes |
| DELETE | `/api/cart/clear` | Clear entire cart | Yes |

### Wishlist

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/wishlist/get` | Get user's wishlist | Yes |
| GET | `/api/wishlist/wishlist/:userId` | Get wishlist by user ID | Yes |
| POST | `/api/wishlist/add` | Add book to wishlist | Yes |
| DELETE | `/api/wishlist/remove/:bookId` | Remove book from wishlist | Yes |
| DELETE | `/api/wishlist/clear` | Clear wishlist | Yes |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/order/create` | Create order | Yes |
| POST | `/api/order/verify-payment` | Verify Razorpay payment | Yes |
| POST | `/api/order/webhook` | Razorpay webhook | No |
| GET | `/api/order/user-orders` | Get all orders | Yes |
| GET | `/api/order/orders/:userId` | Get orders by user ID | Yes |
| GET | `/api/order/purchased-books/:userId` | Get purchased books | Yes |
| GET | `/api/order/dashboard-analytics` | Get analytics dashboard | Yes |
| GET | `/api/order/admin/total-revenue` | Get total revenue | Yes |
| GET | `/api/order/admin/weekly-sales` | Get weekly sales | Yes |

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews/book/:bookId` | Get reviews for a book | Yes |
| POST | `/api/reviews/book/:bookId` | Add review for a book | Yes |
| GET | `/api/reviews/user/:userId` | Get user's reviews | Yes |
| PUT | `/api/reviews/book/:reviewId` | Update review | Yes |
| DELETE | `/api/reviews/book/:reviewId` | Delete review | Yes |
| POST | `/api/reviews/:reviewId/like` | Like a review | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/` | Get all users | Yes |
| GET | `/api/user/profile` | Get current user profile | Yes |
| GET | `/api/user/:id` | Get user by ID | Yes |
| POST | `/api/user/create` | Create user | No |
| PATCH | `/api/user/update/:id` | Update user | Yes |
| DELETE | `/api/user/delete/:id` | Delete user | Yes |
| PUT | `/api/user/change-password` | Change password | Yes |

### Coupons

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/coupons/list` | Get all coupons | Yes |
| GET | `/api/coupons/validate/:couponCode` | Validate coupon | No |
| GET | `/api/coupons/:couponId` | Get coupon by ID | Yes |
| POST | `/api/coupons/create` | Create coupon | Yes |
| POST | `/api/coupons/apply` | Apply coupon | Yes |
| PATCH | `/api/coupons/update/:couponId` | Update coupon | Yes |
| DELETE | `/api/coupons/delete/:couponId` | Delete coupon | Yes |

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# =========================
# Server Configuration
# =========================
PORT=5000
NODE_ENV=development

# Base URL of backend (use your deployed URL in production)
BASE_URL=http://localhost:5000

# Frontend URL (for CORS / redirects)
FRONTEND_URL=http://localhost:3000
# =========================
# Database
# =========================
# Local:
# MONGODB_URI=mongodb://localhost:27017/bookverse
#
# Production (Atlas):
# mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DB_NAME>
MONGODB_URI=

# =========================
# JWT Configuration
# =========================
JWT_SECRET=
JWT_EXPIRE=7d

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRE=30d

# =========================
# Email Configuration (Nodemailer)
# =========================
EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASSWORD=

# =========================
# Razorpay Configuration
# =========================
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## Available Scripts

```bash
# Start the server in production mode
npm start

# Start the server in development mode with auto-reload
npm run dev

# Run database seeders (users, categories, books)
npm run seed

# Run tests (placeholder)
npm test
```

## Database Models

### User Model
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hidden by default)
- `phone` (String)
- `avatar` (String)
- `role` (String, enum: ['user', 'admin'], default: 'user')
- `isActive` (Boolean, default: true)
- `resetPasswordToken` (String)
- `resetPasswordExpire` (Date)
- Timestamps

### Book Model
- `title` (String, required)
- `author` (String, required)
- `description` (String, required)
- `categoryId` (ObjectId, ref: Category, required)
- `price` (Number, required)
- `discount` (Number, required)
- `coverImage` (String, required)
- `fileUrl` (String, required)
- `format` (String, enum: ['pdf', 'epub', 'mobi', 'audiobook'])
- `pages` (Number, required)
- `stock` (Number, required)
- `isbn` (String, unique)
- `language` (String, required)
- `publisher` (String, required)
- `publishedDate` (Date, required)
- `avgRating` (Number, default: 0)
- `totalReviews` (Number, default: 0)
- `isActive` (Boolean, default: true)
- `createdBy` (ObjectId, ref: User)
- `updatedBy` (ObjectId, ref: User)
- Timestamps

### Category Model
- `name` (String, required, unique, lowercase)
- Timestamps

### Cart Model
- `userId` (ObjectId, ref: User, required, unique)
- `items` (Array)
  - `bookId` (ObjectId, ref: Book)
  - `title` (String)
  - `price` (Number)
  - `coverImage` (String)
  - `author` (String)
  - `category` (ObjectId)
  - `discount` (Number)
  - `avgRating` (Number)
  - `quantity` (Number)
- Timestamps

### Wishlist Model
- `userId` (ObjectId, ref: User, required, unique)
- `books` (Array)
  - `bookId` (ObjectId, ref: Book)
- Timestamps

### Order Model
- `userId` (ObjectId, ref: User, required)
- `razorpayOrderId` (String, required, unique)
- `razorpayPaymentId` (String)
- `razorpaySignature` (String)
- `totalAmount` (Number, required)
- `currency` (String, default: 'INR')
- `status` (String, enum: ['pending', 'paid', 'failed', 'completed'])
- `items` (Array)
  - `bookId` (ObjectId, ref: Book)
  - `title` (String)
  - `price` (Number)
  - `quantity` (Number)
- Timestamps

### Review Model
- `bookId` (ObjectId, ref: Book, required)
- `userId` (ObjectId, ref: User, required)
- `rating` (Number, min: 1, max: 5)
- `reviewText` (String, required)
- `isVerifiedPurchase` (Boolean, default: false)
- `likes` (Number, default: 0)
- Compound unique index on (bookId, userId)
- Timestamps

### Coupon Model
- `couponCode` (String, required, unique, uppercase)
- `discount` (Number, required)
- `discountType` (String, enum: ['fixed', 'percentage'])
- `categoryId` (ObjectId, ref: Category, required)
- `validTillDate` (Date, required)
- `usageLimit` (Number, optional)
- `timesUsed` (Number, default: 0)
- `description` (String)
- Timestamps

## Authentication Flow

1. **Registration**: User registers with email, password, and name. Password is hashed with bcryptjs.
2. **Login**: User logs in with email and password. Server validates credentials and generates:
   - Access token (expires in 7 days)
   - Refresh token (expires in 30 days, stored in HTTP-only cookie)
3. **Protected Routes**: Access token sent in `Authorization: Bearer <token>` header
4. **Token Refresh**: Refresh token from cookie can be used to get new access token
5. **Role Authorization**: Admin routes protected with `authorizeRoles('admin')` middleware

## File Upload Configuration

- **Max File Size**: 100 MB per file
- **Max Files**: 10 files at once
- **Supported Formats**:
  - Images: .jpg, .jpeg, .png, .gif, .webp
  - Documents: .pdf, .doc, .docx, .xls, .xlsx
- **Storage Structure**:
  - Cover images: `files/coverImage/`
  - Book files: `files/`
- **Naming**: Unique filename with timestamp and random suffix

## Payment Integration (Razorpay)

1. **Order Creation**: Client requests order creation with cart items and total amount
2. **Razorpay Order**: Server creates Razorpay order with amount in paise
3. **Payment**: Client completes payment on Razorpay checkout
4. **Verification**: Server verifies payment signature using Razorpay secret
5. **Order Update**: On successful verification, order status updated to 'paid' and cart cleared
6. **Webhook**: Optional webhook for payment status updates from Razorpay

## Development Notes

- **Folder Name Note**: The models folder is named `modal/` (typo) but should be `model/`. This is referenced throughout the codebase.
- **Database Seeding**: Always run `npm run seed` after setting up the database to populate initial data.
- **Email Templates**: Pug templates are used for email HTML rendering. Update templates in `templates/` directory.
- **CORS**: CORS is enabled for `http://localhost:3000`. Update in `index.js` if your frontend runs on a different port.
- **Static Files**: Uploaded files are served from `/files` route configured in `index.js`.
- **Error Handling**: All API responses use standardized `APIResponse` utility for consistent format.
- **Password Reset**: Reset tokens expire in 10 minutes for security.

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running locally or MongoDB Atlas URI is correct
- Check that `MONGODB_URI` is set in `.env` file

### Email Not Sending
- Verify email credentials in `.env`
- For Gmail, use App-specific password instead of regular password
- Check if less secure apps are enabled (if not using App password)

### File Upload Errors
- Ensure `files/` directory exists or can be created
- Check file size doesn't exceed 100MB limit
- Verify file extension is in allowed list

### Razorpay Payment Issues
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
- Ensure webhook secret is configured if using webhooks
- Check Razorpay dashboard for order status

## License

ISC