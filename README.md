# Ecommerce Frontend

A modern, responsive React application for customers to browse products, manage their accounts, and complete purchases with a seamless user experience.

## 🚀 Features

### 🛒 Shopping Experience
- **Product Catalog** - Browse products by category with advanced filtering
- **Search & Discovery** - Real-time search with autocomplete suggestions
- **Product Details** - High-quality images, descriptions, and specifications
- **Shopping Cart** - Add/remove items with quantity management
- **Wishlist** - Save favorite products for later

### 👤 User Account Management
- **Secure Authentication** - Email/password registration and login
- **Email Verification** - Account security with email confirmation
- **Password Recovery** - Forgot password with secure reset codes
- **Profile Management** - Update personal information and preferences
- **Order History** - Track past purchases and order status

### 💳 Checkout & Payments
- **Multiple Payment Options** - PayPal, MoMo, and other gateways
- **Secure Checkout** - Encrypted payment processing
- **Order Tracking** - Real-time delivery updates
- **Invoice Generation** - Digital receipts and order confirmations

### 💬 Customer Support
- **Real-time Chat** - Live support with customer service agents
- **Help Center** - FAQ and self-service resources
- **Contact Forms** - Alternative communication channels

### 📱 Responsive Design
- **Mobile-First** - Optimized for all device sizes
- **Progressive Web App** - Installable on mobile devices
- **Fast Loading** - Optimized images and lazy loading
- **Accessibility** - WCAG compliant for all users

## 🛠️ Technology Stack

- **React 18** - Modern UI framework with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing and navigation
- **Axios** - Promise-based HTTP client
- **Socket.io-client** - Real-time bidirectional communication
- **React Toastify** - Toast notifications
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── assets/            # Images, icons, and media files
│   │   ├── assets.js      # Asset exports and configurations
│   │   └── [product-images]/ # Product photos and media
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx     # Main navigation bar
│   │   ├── Footer.jsx     # Site footer
│   │   ├── ProductItem.jsx # Product card component
│   │   ├── CartTotal.jsx  # Shopping cart summary
│   │   ├── SearchBar.jsx  # Search functionality
│   │   ├── ChatWidget.jsx # Real-time customer support
│   │   └── [other-components]/
│   ├── context/           # React Context providers
│   │   └── ShopContext.jsx # Global state management
│   ├── pages/             # Page components
│   │   ├── Home.jsx       # Landing page
│   │   ├── Collection.jsx # Product catalog
│   │   ├── Product.jsx    # Individual product page
│   │   ├── Cart.jsx       # Shopping cart
│   │   ├── Login.jsx      # Authentication
│   │   ├── PlaceOrder.jsx # Checkout process
│   │   ├── Orders.jsx     # Order history
│   │   ├── Profile.jsx    # User account
│   │   └── [other-pages]/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── README.md             # This file
└── vite.config.js        # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ecommerce-frontend.git
   cd ecommerce-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```

   Configure the following variables in `.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Code Quality
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:4000` |

### Build Configuration

The application uses Vite for building and development. Configuration can be modified in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

## 🎨 Styling Guide

### Tailwind CSS Classes

The application uses Tailwind CSS for styling with a custom design system:

- **Colors:** Primary black (`#000000`), white, and gray variants
- **Typography:** Clean sans-serif fonts with proper hierarchy
- **Spacing:** Consistent padding and margins using Tailwind scale
- **Components:** Reusable button, form, and card styles

### Responsive Design

- **Mobile:** `< 640px`
- **Tablet:** `640px - 1024px`
- **Desktop:** `> 1024px`

Breakpoints follow Tailwind's default configuration.

## 🔄 State Management

### ShopContext

Global state is managed through React Context (`ShopContext.jsx`):

```javascript
const ShopContext = createContext()

export const ShopContextProvider = ({ children }) => {
  // Global state
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState({})
  const [wishlist, setWishlist] = useState([])

  // Context value
  const value = {
    token, setToken,
    user, setUser,
    cart, setCart,
    wishlist, setWishlist,
    backendUrl
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}
```

## 🔐 Authentication Flow

1. **Registration:** User creates account with email verification
2. **Login:** JWT token stored in localStorage
3. **Protected Routes:** Automatic redirects for unauthenticated users
4. **Token Refresh:** Automatic token management and renewal

## 💳 Payment Integration

### Supported Payment Methods

- **PayPal** - International payments
- **MoMo** - Vietnamese mobile payments
- **Cash on Delivery** - Traditional payment option

### Checkout Process

1. **Cart Review** - Confirm items and quantities
2. **Shipping Info** - Delivery address and contact details
3. **Payment Selection** - Choose payment method
4. **Order Confirmation** - Final review and submission
5. **Payment Processing** - Secure payment gateway integration

## 💬 Real-time Chat

### Features
- **Live Support** - Connect with customer service agents
- **Message History** - Persistent conversation storage
- **Typing Indicators** - Real-time user activity
- **File Sharing** - Image and document uploads
- **Read Receipts** - Message delivery confirmation



## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

- **Netlify** - Recommended for static hosting
- **Vercel** - Great for React applications
- **Firebase Hosting** - Google's hosting solution
- **AWS S3 + CloudFront** - Scalable cloud hosting

