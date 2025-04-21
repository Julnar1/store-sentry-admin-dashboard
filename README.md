# StoreSentry - Admin Dashboard

A modern, responsive admin dashboard built with Next.js, Material-UI, and Redux Toolkit. This application provides a comprehensive solution for managing products, categories, and user authentication with role-based access control.

## 🌟 Features

- **Authentication & Authorization**
  - Secure login system with JWT tokens
  - Role-based access control (Admin, User)
  - Protected routes and API endpoints
  - Persistent authentication state

- **Product Management**
  - CRUD operations for products
  - Image upload and management
  - Category assignment
  - Pagination support

- **Category Management**
  - CRUD operations for categories
  - Hierarchical category structure
  - Product association
  - Bulk operations support

- **User Interface**
  - Responsive Material-UI design
  - Customizable layout
  - Interactive data tables
  - Form validation
  - Toast notifications
  - Loading states and error handling

## 🛠️ Tech Stack

- **Frontend Framework**
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Material-UI (MUI) v5
  - Redux Toolkit for state management

- **Styling & UI**
  - Material-UI components
  - CSS-in-JS with styled-components
  - Responsive design
  - Custom theme implementation

- **State Management**
  - Redux Toolkit for global state
  - Local storage for persistence

- **Authentication**
  - JWT token-based authentication
  - HTTP-only cookies for security
  - Role-based access control

- **Development Tools**
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript for type safety
  - Git for version control

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Julnar1/store-sentry-admin-dashboard.git
   cd store-sentry
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open http://localhost:3000**
   View the application in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── components/         # Reusable components
│   ├── redux/             # Redux store and slices
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## 🔐 Authentication

The application implements a secure authentication system:
- JWT tokens stored in HTTP-only cookies
- Role-based access control
- Protected API routes
- Automatic token refresh
- Secure logout mechanism

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Form validation with error messages
- Loading states and progress indicators
- Toast notifications for user feedback
- Smooth animations and transitions

## 🔄 State Management

- Redux Toolkit for global state
- Persistent state with local storage
- Type-safe actions and reducers

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 📝 License

 © 2025 Julnar Nabeel. All rights reserved.

## 👤 Author

Julnar Nabeel
- GitHub: [@Julnar1](https://github.com/Julnar1)
- LinkedIn: [Julnar Nabeel](https://www.linkedin.com/in/julnar-nabeel/)

## 🙏 Acknowledgments

- Material-UI for the component library
- Next.js team for the amazing framework
- Redux Toolkit for state management
- All contributors and supporters
