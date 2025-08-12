# Trendify E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js, React, and Supabase. Features include user authentication, product management, shopping cart, wishlist, order management, and email notifications.

## Features

### Core Functionality
- **User Authentication**: JWT-based authentication with customer and seller roles
- **Product Management**: Browse, search, and filter products with detailed views
- **Shopping Cart**: Add items, update quantities, and manage cart contents
- **Wishlist**: Save favorite items for later purchase
- **Order Management**: Place orders with email notifications
- **Reviews & Ratings**: Customer feedback system for products
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Next.js 14**: Latest App Router with Server Components
- **Supabase**: PostgreSQL database with Row Level Security
- **Real-time Updates**: Live cart and wishlist synchronization
- **Email Notifications**: Order confirmation emails
- **Error Handling**: Comprehensive error handling throughout
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern, responsive styling

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd trendify-ecommerce
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts` folder to set up the database schema
   - Get your project URL and anon key from the Supabase dashboard

4. Configure environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`
Fill in your Supabase credentials in `.env.local`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. In your Supabase project, go to the SQL Editor
2. Run the `database-schema.sql` script to create all tables and policies
3. Run the `seed-data.sql` script to populate with sample data

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── scripts/              # Database scripts
└── public/               # Static assets
\`\`\`

## Key Components

- **AuthProvider**: Manages user authentication state
- **CartProvider**: Handles shopping cart functionality
- **WishlistProvider**: Manages wishlist operations
- **ProductCard**: Reusable product display component
- **Header**: Navigation with search and user menu
- **Footer**: Site footer with links

## API Endpoints

The application uses Supabase's auto-generated REST API with the following main tables:
- `users` - User profiles
- `products` - Product catalog
- `cart` - Shopping cart items
- `wishlist` - Saved items
- `orders` - Order history
- `reviews` - Product reviews

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
