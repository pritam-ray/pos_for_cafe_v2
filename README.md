<<<<<<< HEAD
# 🍽️ C Square Restaurant Management System

A modern, full-stack restaurant management application built with React, TypeScript, and Supabase. This comprehensive system handles the complete restaurant workflow from customer ordering to backend management and analytics.

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://your-demo-url.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/badge/GitHub-pritam--ray%2Fpos__for__cafe__v2-blue)](https://github.com/pritam-ray/pos_for_cafe_v2)

## ✨ Features Overview

### 👥 Multi-Role Access System
- **🏠 Customer Interface**: Public menu browsing and ordering
- **👨‍💼 Owner Dashboard**: Complete restaurant management
- **👨‍🍳 Employee Portal**: Order management and operations
- **👀 Viewer Mode**: Read-only access for demonstrations

### 📱 Customer Experience
- **Digital Menu**: Interactive, categorized food menu with high-quality images
- **Smart Cart**: Add/remove items with real-time price calculation
- **Order Management**: Table selection, customer info, and payment method choice
- **Live Tracking**: Real-time order status updates
- **QR Payment**: Integrated payment system with QR code scanning

### 📊 Business Management
- **Menu Management**: Full CRUD operations for categories and items
- **Order Processing**: Real-time order status management
- **Inventory Tracking**: Stock levels, low-stock alerts, and reorder management
- **Analytics Dashboard**: Revenue tracking, popular items, and performance metrics
- **Customer Insights**: Order patterns, peak hours, and table analytics

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: TailwindCSS with custom components
- **Animations**: Framer Motion for smooth transitions
- **State Management**: Zustand for lightweight state handling
- **Icons**: Lucide React for consistent iconography
- **Notifications**: React Hot Toast for user feedback

### Backend & Database
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Custom role-based authentication
- **Storage**: Supabase Storage for images and files
- **Real-time**: Supabase real-time subscriptions

### Analytics & Visualization
- **Charts**: Recharts for responsive data visualization
- **Metrics**: Custom analytics engine
- **Reports**: Comprehensive business intelligence

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- A Supabase account (free tier available)

### 1. Clone and Install
```bash
git clone https://github.com/pritam-ray/pos_for_cafe_v2.git
cd pos_for_cafe_v2
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials (see SETUP.md for detailed instructions)
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the SQL migrations from `supabase/migrations/`
3. Set up storage buckets for images

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your application running!

## 📚 Documentation

- **[Setup Guide](SETUP.md)**: Detailed installation and configuration
- **[Deployment Guide](DEPLOYMENT.md)**: Production deployment instructions  
- **[Security Guidelines](SECURITY.md)**: Security best practices and password management

## 🗄️ Database Architecture

### Core Tables
```sql
menu_categories     # Food categories (Starters, Main Course, etc.)
menu_items         # Individual food items with pricing
orders             # Customer orders with status tracking
order_items        # Line items for each order
inventory_items    # Stock management and tracking
inventory_transactions  # Inventory movement history
```

### Key Features
- **Row Level Security (RLS)**: Secure data access
- **Real-time Subscriptions**: Live order updates
- **Audit Trails**: Complete transaction history
- **Backup Strategy**: Automated backups included

## 🔐 Access Control & Authentication

The system implements a role-based authentication system:

| Role | Access Level | Capabilities |
|------|-------------|-------------|
| **Customer** | Public | Browse menu, place orders, track orders |
| **Viewer** | Read-only | View all dashboards and analytics (demo mode) |
| **Employee** | Operational | Manage orders, view operational analytics |
| **Owner** | Full Admin | Complete system control, menu management, full analytics |

### Authentication Flow
1. Public users can access the menu and place orders
2. Staff authentication is password-based for simplicity
3. Secure environment variable management
4. Role-based UI rendering and API access

## 🎨 UI/UX Features

### Design Philosophy
- **Modern & Clean**: Minimalist design with focus on usability
- **Mobile-First**: Responsive design that works on all devices
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized loading with lazy loading and caching

### Key UI Components
- **Animated Transitions**: Smooth page transitions with Framer Motion
- **Real-time Updates**: Live order status without page refresh
- **Dark/Light Themes**: User preference support
- **Progressive Loading**: Skeleton screens and optimistic updates
- **Touch-Friendly**: Large buttons and intuitive gestures

## 📊 Analytics & Insights

### Business Intelligence Features
- **Revenue Analytics**: Daily, weekly, monthly revenue tracking
- **Popular Items**: Best-selling dishes and trending analysis
- **Customer Patterns**: Peak hours, order frequency, table preferences
- **Inventory Intelligence**: Stock levels, reorder points, wastage tracking
- **Performance Metrics**: Order completion times, customer satisfaction

### Data Visualization
- Interactive charts and graphs using Recharts
- Real-time dashboards with live data updates
- Exportable reports for business planning
- Mobile-optimized analytics views

## 🚀 Performance & Scalability

### Optimization Features
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: Efficient data caching with Supabase
- **Bundle Optimization**: Tree shaking and minification
- **CDN Ready**: Static assets optimized for CDN delivery

### Scalability Considerations
- Supabase handles database scaling automatically
- Stateless design for horizontal scaling
- Efficient query patterns with minimal N+1 queries
- Real-time subscriptions with connection pooling

## �️ Development Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run dev:host     # Start dev server accessible on network

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality
npm run lint:fix     # Fix auto-fixable linting issues
npm run type-check   # Run TypeScript type checking

# Database
npm run db:generate  # Generate database types (if using Supabase CLI)
npm run db:push      # Push local schema changes to Supabase
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow the configured linting rules
- **Prettier**: Code formatting (run on save)
- **Conventional Commits**: Use conventional commit messages
- **Testing**: Add tests for new features (when applicable)

### Areas for Contribution
- 🌐 Internationalization (i18n) support
- 📊 Additional analytics features
- 🎨 UI/UX improvements
- 🔌 Third-party integrations
- 📱 Mobile app development
- 🧪 Testing coverage improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability assumed

## 🆘 Support & Community

### Getting Help
- 📖 **Documentation**: Check our comprehensive guides
- 🐛 **Bug Reports**: [Create an issue](https://github.com/your-username/c-square-restaurant/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Request a feature](https://github.com/your-username/c-square-restaurant/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/c-square-restaurant/discussions)

### Community Guidelines
- Be respectful and inclusive
- Provide detailed information when reporting issues
- Search existing issues before creating new ones
- Follow the code of conduct

## 🙏 Acknowledgments

### Built With Love Using:
- [React](https://reactjs.org/) - The web framework used
- [Supabase](https://supabase.com/) - Backend as a service
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons

### Special Thanks
- The open source community for amazing tools and libraries
- Beta testers and early adopters for valuable feedback
- Contributors who help improve the project

---

<div align="center">
  
**Made with ❤️ for the restaurant industry**

[⭐ Star this repo](https://github.com/pritam-ray/pos_for_cafe_v2) • [🍴 Fork it](https://github.com/pritam-ray/pos_for_cafe_v2/fork) • [📝 Report Bug](https://github.com/pritam-ray/pos_for_cafe_v2/issues)

</div>
=======
# pos_for_cafe_v2
more features and more usability than version 1
>>>>>>> 6fb9012ea1daaf97ad61c7b490bca5dc8a14883b
