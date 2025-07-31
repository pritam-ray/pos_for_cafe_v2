# Setup Guide for C Square Restaurant Management System

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account

## Step-by-Step Setup

### 1. Clone and Install

```bash
git clone https://github.com/pritam-ray/pos_for_cafe_v2.git
cd pos_for_cafe_v2
npm install
```

### 2. Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Get your project credentials**:
   - Go to Settings → API
   - Copy your `Project URL` and `anon/public key`

3. **Run database migrations**:
   - Go to SQL Editor in Supabase Dashboard
   - Copy and run each migration file from `supabase/migrations/` in order
   - Or use Supabase CLI: `supabase db push`

4. **Set up Storage**:
   - Go to Storage in Supabase Dashboard
   - Create a public bucket named `qrcode`
   - Upload your payment QR code image

### 3. Environment Configuration

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in your credentials**:
   ```env
   # From your Supabase project settings
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Set secure passwords for different access levels
   VITE_OWNER_PASSWORD=your-secure-owner-password
   VITE_EMPLOYEE_PASSWORD=your-employee-password  
   VITE_VIEWER_PASSWORD=your-viewer-password

   # Asset URLs (upload to Supabase Storage and get public URLs)
   VITE_LOGO_URL=your-logo-image-url
   VITE_QR_CODE_URL=your-payment-qr-code-url
   ```

### 4. Customization

1. **Update branding**:
   - Replace "C Square" with your restaurant name in `src/App.tsx`
   - Update logo and colors as needed

2. **Configure payment QR code**:
   - Upload your QR code to Supabase Storage
   - Update the image URL in `src/components/Cart.tsx`

3. **Add initial menu data**:
   - Use the Owner Dashboard to add your menu categories and items
   - Or modify the default data in `src/menuData.ts`

### 5. Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see your application.

### 6. Production Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**:
   - Vercel
   - Netlify
   - Heroku
   - Your own server

### 7. Access Levels

- **Public**: Can view menu, place orders, track orders
- **Viewer**: Read-only access to dashboards (use viewer password)
- **Employee**: Can manage orders and view analytics (use employee password)
- **Owner**: Full access to all features (use owner password)

## Security Best Practices

1. **Use strong, unique passwords** for each role
2. **Regularly rotate passwords**, especially for production
3. **Monitor Supabase logs** for any suspicious activity
4. **Keep dependencies updated** with `npm audit`
5. **Use HTTPS** in production
6. **Backup your database** regularly

## Troubleshooting

### Common Issues

1. **Supabase connection errors**:
   - Verify your URL and API key
   - Check if RLS policies are properly set

2. **Images not loading**:
   - Ensure Supabase Storage bucket is public
   - Check image URLs are correct

3. **Authentication not working**:
   - Verify environment variables are loaded
   - Check password matching logic

### Support

- Check the main README.md for detailed feature information
- Review the code comments for implementation details
- Open an issue on GitHub for bugs or feature requests

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Storage buckets created and configured
- [ ] Menu items and categories added
- [ ] Payment QR code uploaded
- [ ] Passwords set for all roles
- [ ] Application tested on different devices
- [ ] SSL certificate configured
- [ ] Backup strategy implemented
