# ReSellBD - Client

ReSellBD is a modern, responsive web application designed for buying and selling second-hand products. This repository contains the complete frontend client of the ReSellBD platform, built with Next.js 15 App Router, TypeScript, Redux Toolkit, and Tailwind CSS.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture and Folder Structure](#project-architecture-and-folder-structure)
- [Environment Variables](#environment-variables)
- [Getting Started and Installation](#getting-started-and-installation)
- [Available Scripts](#available-scripts)
- [API and Service Architecture](#api-and-service-architecture)
- [Role-Based Access Control and Route Protection](#role-based-access-control-and-route-protection)
- [Contributing](#contributing)
- [Contact and Support](#contact-and-support)
- [License](#license)

---

## Overview

ReSellBD provides a peer-to-peer marketplace that empowers individuals to list pre-owned items, discover affordable second-hand goods, and manage transactions seamlessly. The frontend client is architected for optimal performance, accessibility, search engine indexing, and real-time state synchronization.

---

## Key Features

### Public Marketplace
- Product Catalog: Browse verified second-hand items across multiple categories with pagination.
- Advanced Search and Filtering: Real-time search by keyword, category classification, and condition.
- Detailed Product Pages: High-resolution image views, pricing details, seller information, and item condition reports.
- Wishlist System: Save favorite products with persistent client-side storage.

### Buyer and Seller Features
- Product Listing Management: Create, update, and remove second-hand product listings.
- Order and Purchase History: Track ordered items, transaction statuses, and invoice overviews.
- Sales Tracking: Review incoming purchase requests and sales transactions.
- User Profile: Manage account details, shipping information, and personal preferences.

### Admin Dashboard
- Analytics Overview: Visual charts and metric tracking for platform revenue, user growth, and active listings powered by Recharts.
- User Administration: Monitor registered users, update permissions, and restrict accounts violating guidelines.
- Content and Blog Management: Create, edit, and publish community articles and platform updates.
- Inquiries and Newsletter: View customer contact messages and manage newsletter subscriber lists.

### Security and State Architecture
- Custom Authentication: Secure session management via JWT tokens stored in HTTP cookies.
- Protected Middleware: Route-level access enforcement based on authenticated roles (User vs. Admin).
- Global State Management: Redux Toolkit combined with Redux Persist for reliable user sessions and wishlist synchronization.

---

## Tech Stack

### Core Framework and Language
- Next.js 15 (App Router with Server and Client Components)
- React 19
- TypeScript

### UI and Styling
- Tailwind CSS
- Radix UI Primitives / Shadcn UI Component System
- Lucide React (Component Icons)
- Sonner (Toast Notifications)
- Recharts (Analytical Charts and Visualizations)

### State Management and Forms
- Redux Toolkit
- Redux Persist
- React Hook Form
- Zod (Schema Validation)
- @hookform/resolvers

### Utilities and Networking
- Native Fetch with Server Actions and Service Abstractions
- jwt-decode (Token Parsing)
- moment-timezone (Date and Time Formatting)
- clsx and tailwind-merge (Dynamic Class Handling)

---

## Project Architecture and Folder Structure

```
resellbd-client/
├── public/                         # Static assets, branding, and images
├── src/
│   ├── app/                        # Next.js App Router (Layouts and Pages)
│   │   ├── (WithCommonLayout)/     # Layout with persistent Navbar and Footer
│   │   │   ├── (home)/             # Marketplace landing page
│   │   │   ├── aboutUs/            # Platform story and information
│   │   │   ├── blogs/              # Blog listing and single article pages
│   │   │   ├── category/           # Category-filtered product pages
│   │   │   ├── checkout/           # Order placement and checkout workflow
│   │   │   ├── contactUs/          # Customer inquiry and support page
│   │   │   ├── faq/                # Frequently asked questions
│   │   │   ├── products/           # Main product directory and detail pages
│   │   │   └── wishlist/           # User wishlist overview
│   │   ├── (WithDashboardLayout)/  # Dedicated dashboard layout with navigation drawer
│   │   │   ├── admin/              # Admin dashboard pages (Analytics, Users, Blogs, Contacts)
│   │   │   └── user/               # User dashboard pages (Products, Orders, Sales, Profile)
│   │   ├── cancelled/              # Payment cancellation callback page
│   │   ├── failed/                 # Payment failure callback page
│   │   ├── success/                # Payment success callback page
│   │   ├── login/                  # User login authentication page
│   │   ├── register/               # User registration page
│   │   ├── profile/                # Direct profile navigation route
│   │   ├── globals.css             # Tailwind and global CSS styles
│   │   ├── layout.tsx              # Root HTML wrapper with Redux and Theme providers
│   │   └── not-found.tsx           # Custom 404 page
│   ├── assets/                     # Graphical assets and static vector illustrations
│   ├── components/                 # Modular React components
│   │   ├── modules/                # Feature modules (Auth, Blog, Category, Checkout, Dashboard, Products)
│   │   ├── shared/                 # Reusable shared components (Navbar, Footer, Container, NavigationLink)
│   │   └── ui/                     # Primitives (Dialog, Dropdown, Table, Input, Button, Accordion)
│   ├── constants/                  # Application constants and static configuration
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Helper utilities (cn class merger, date formatting)
│   ├── providers/                  # Application-wide context and Redux store providers
│   ├── redux/                      # Redux Toolkit store, persist setup, and feature slices
│   │   ├── features/               # Slices (authSlice, wishlistSlice, getToken)
│   │   ├── hooks.ts                # Typed useDispatch and useSelector hooks
│   │   └── store.ts                # Redux store configuration
│   ├── services/                   # Modular API service layer
│   │   ├── Analytics/              # Dashboard metrics and reports
│   │   ├── Auth/                   # Login, register, current user session retrieval
│   │   ├── Blog/                   # Blog CRUD operations
│   │   ├── Contact/                # Contact form submissions and inquiries
│   │   ├── NewsLetter/             # Newsletter subscription services
│   │   ├── Order/                  # Order placement and transaction history
│   │   ├── Product/                # Product queries and listing mutations
│   │   └── User/                   # User profile and account administration
│   ├── types/                      # TypeScript type interfaces and declarations
│   └── middleware.ts               # Next.js edge middleware for route protection
├── .env.example                    # Template for environment configuration
├── next.config.ts                  # Next.js build configuration
├── package.json                    # Project dependencies and operational scripts
├── tsconfig.json                   # TypeScript compiler options
└── README.md                       # Comprehensive project documentation
```

---

## Environment Variables

To protect your system security, never commit real credentials, sensitive secrets, or production database URLs to public repositories.

Create a `.env.local` file in the root directory and configure the variables using the placeholder formats below:

```env
# Backend REST API Base URL
NEXT_PUBLIC_BASE_API=enter your backend api base url here
```

---

## Getting Started and Installation

### Prerequisites

Ensure the following tools are installed on your machine:
- Node.js (version 18.18.0 or later recommended)
- npm, yarn, or pnpm
- Git

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Emam-Bokhari/ReSellBD-Client-.git
   ```

2. Navigate into the project directory:
   ```bash
   cd ReSellBD-Client-
   ```

3. Install project dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   Copy the example file and update the placeholders with your target endpoints:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set `NEXT_PUBLIC_BASE_API` to your active backend server address (for example, `http://localhost:5000/api/v1` during local development).

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open the application:
   Navigate to `http://localhost:3000` in your web browser.

---

## Available Scripts

The following scripts are defined in `package.json` for development and production workflows:

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the development server with Hot Module Replacement (HMR) on port 3000 |
| `npm run build` | Compiles and optimizes the application for production deployment |
| `npm run start` | Starts the production server using the compiled build artifacts |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |

---

## API and Service Architecture

All client interactions with the backend are structured inside `src/services/` to keep UI components decoupled from network logic:

- Auth Service (`src/services/Auth`): Handles user registration, authentication, token storage, and session validation.
- Product Service (`src/services/Product`): Handles product retrieval, single item details, category filters, and listing creation/updates.
- Order Service (`src/services/Order`): Initiates checkouts, tracks purchase orders, and records sales history.
- Analytics Service (`src/services/Analytics`): Retrieves overview statistics, revenue charts, and transaction counts for the admin dashboard.
- Blog Service (`src/services/Blog`): Fetches blog posts, manages article drafts, and updates content.
- Newsletter and Contact Services (`src/services/NewsLetter`, `src/services/Contact`): Manages customer feedback submissions and email newsletter subscriptions.
- User Service (`src/services/User`): Facilitates user profile updates and admin-level account management.

---

## Role-Based Access Control and Route Protection

Route protection is managed by `src/middleware.ts` running at the Next.js edge:

- Public Routes: Accessible to all visitors without authentication (Home, Products, Categories, Blogs, About Us, Contact Us, FAQ, Login, Register).
- User Protected Routes: Requires valid authentication (`/user/*`, `/checkout`, `/profile`, `/user/dashboard/products`, `/user/dashboard/orders/*`).
- Admin Protected Routes: Requires admin role credentials (`/admin/*`, `/admin/dashboard/*`, user administration, platform content management).

Unauthenticated attempts to access protected routes are automatically redirected to `/login` with a `redirectPath` query parameter to return users to their intended destination after logging in.

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request for review.

---

## Contact and Support

For questions, issues, or feedback regarding ReSellBD, please reach out through the following channels:

- Email: moshfiqurrahman37@gmail.com
- GitHub: https://github.com/Emam-Bokhari
- Linkedin: www.linkedin.com/in/moshfiqurrahman37

---

## License

This project is licensed under the MIT License.
