# 🌿 Khatidana (খাঁটিদানা) - Premium Organic Food E-commerce

Khatidana is a modern, full-stack, premium e-commerce platform dedicated to providing pure and organic grains, honey, and oils to the Bangladeshi market. Built with a focus on health, purity, and a seamless user experience, Khatidana combines a high-end "Flipkart-inspired" interface with robust backend logic.

## 🚀 Live Demo
**Website:** [https://khatidana.lovable.app](https://khatidana.lovable.app)

---

## ✨ Features

- **Premium Organic UI**: Compact, high-end design with a "Forest Green & Gold" theme, featuring both Light and Dark mode toggles.
- **Mobile-First Experience**: Optimized mobile navigation featuring a persistent **Bottom Navigation Bar** for an app-like feel on every page.
- **Advanced Search**: Expandable mobile search bar with smooth animations and desktop-integrated filtering.
- **User Authentication**: Secure signup/login with profile management and persistent shopping carts.
- **Wishlist Management**: Dedicated wishlist page accessible from both mobile and desktop headers.
- **Dynamic Inventory**: Real-time product syncing from the database with automated stock status updates.
- **Admin Dashboard**: A fully controlled, secure management suite for:
  - **Product CRUD**: Add, edit, or remove organic products and grains.
  - **Order Tracking**: Manage order statuses from 'Pending' to 'Delivered'.
  - **Analytics**: View sales overview and customer insights.
- **SEO Optimized**: Fully production-ready with meta tags, Open Graph (OG) support for social sharing, and search engine friendly structure.

---

## 🛠️ Tech Stack

- **Platform**: [Lovable.dev](https://lovable.dev/)
- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + Real-time Sync)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file or GitHub Secrets:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
SSLCOMMERZ_STORE_ID=your_sandbox_id
SSLCOMMERZ_STORE_PASSWORD=your_sandbox_password
```

## 📖 Installation & Setup

 * Clone the repository:

 ```bash
 git clone https://github.com/raselshikdar/khatidana.git
 cd bongshai
 ```

 * Install dependencies:
   ```bash
   npm install
   ```

 * Start the development server:
   ```bash
   npm run dev
   ```

 * Build for production:
   ```bash
   npm run build
   ```

🛡️ Security
 * Row Level Security (RLS): All Supabase tables are protected by strict RLS policies ensuring users can only access their own data.
 * Environment Protection: Sensitive keys (Service Role Keys) are stored in secure backend environments and never exposed to the frontend.

***

© 2026 Bongshai. Built with ❤️ for Bangladesh.

***
