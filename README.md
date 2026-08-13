# Shopy - E-Commerce Frontend

A modern, full-featured e-commerce frontend built with React, Vite, Tailwind CSS, and shadcn/ui.

## Features

- Product listing, search, and filtering
- Product detail page with image gallery, variants, and reviews
- Shopping cart with quantity management
- Wishlist functionality
- User authentication (login, register, forgot password)
- Order management and address book
- Responsive design for mobile and desktop
- Payment integration with Razorpay

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 6
- **Routing:** React Router v6
- **State Management:** React Context API
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Forms:** React Hook Form
- **Notifications:** Sonner / React Hot Toast

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your API base URL and Razorpay key
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL (e.g., `http://localhost:3000/api/v1`) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key for payments |
| `VITE_APP_BASE_URL` | App base URL |

### Development

```bash
npm run dev
```

App runs on `http://localhost:5173`. API requests are proxied to `http://localhost:3000` in development.

### Build

```bash
npm run build
```

Production build outputs to `dist/`.

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel

1. Import repository in Vercel
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard
6. Deploy

### Render / Docker

```bash
docker build -t shopy-frontend .
docker run -p 80:80 shopy-frontend
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # MainLayout, AccountLayout
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   └── ScrollToTop.jsx
├── contexts/            # Auth, Cart, Wishlist contexts
├── lib/                 # API client, query client, auth utilities
├── pages/               # Route pages
│   └── account/         # Dashboard, Orders, Profile, etc.
├── App.jsx              # Root component with routes
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Related

- Backend repository: `../ecommerce-backend`
