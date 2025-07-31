# Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_OWNER_PASSWORD`
     - `VITE_EMPLOYEE_PASSWORD`
     - `VITE_VIEWER_PASSWORD`

3. **Deploy**: Vercel will automatically build and deploy

### Option 2: Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   - Drag and drop the `dist` folder to [netlify.com](https://netlify.com)
   - Or connect your GitHub repository

3. **Add Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all required variables

### Option 3: GitHub Pages (Static Only)

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

## 🔧 Environment Configuration

### Production Environment Variables

Create these environment variables in your deployment platform:

```env
# Supabase Configuration (from your Supabase project)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Dashboard Access (use strong passwords for production)
VITE_OWNER_PASSWORD=your-secure-production-owner-password
VITE_EMPLOYEE_PASSWORD=your-production-employee-password
VITE_VIEWER_PASSWORD=your-production-viewer-password

# Asset URLs (upload images to Supabase Storage and get public URLs)
VITE_LOGO_URL=your-production-logo-url
VITE_QR_CODE_URL=your-production-qr-code-url
```

### Security Best Practices:

1. **Use different passwords** for production than development
2. **Use strong passwords** (16+ characters with mixed case, numbers, symbols)
3. **Never expose passwords** in client-side code or logs
4. **Rotate passwords regularly** (every 3-6 months)

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase database migrations applied
- [ ] Menu items and categories added via dashboard
- [ ] Payment QR code uploaded to Supabase Storage
- [ ] Restaurant branding updated (name, logo, colors)
- [ ] Contact information updated
- [ ] Tested on different devices and screen sizes
- [ ] All authentication roles tested
- [ ] Order flow tested end-to-end

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_OWNER_PASSWORD: ${{ secrets.VITE_OWNER_PASSWORD }}
        VITE_EMPLOYEE_PASSWORD: ${{ secrets.VITE_EMPLOYEE_PASSWORD }}
        VITE_VIEWER_PASSWORD: ${{ secrets.VITE_VIEWER_PASSWORD }}
    - name: Deploy to Vercel
      uses: vercel/action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Domain Setup

### Custom Domain (Optional)

1. **Purchase domain** from any registrar
2. **Configure DNS** to point to your deployment platform
3. **Enable HTTPS** (usually automatic on modern platforms)
4. **Update any hardcoded URLs** in your application

## 📞 Post-Deployment

### Testing Your Live Application:

1. **Customer Flow**:
   - Browse menu
   - Add items to cart
   - Place test order
   - Track order status

2. **Staff Access**:
   - Test employee login
   - Update order status
   - View analytics

3. **Owner Access**:
   - Test owner login
   - Add/edit menu items
   - View comprehensive analytics
   - Manage inventory

### Monitoring:

- Check Supabase logs for any errors
- Monitor application performance
- Test on different devices/browsers
- Set up uptime monitoring (optional)

## 🆘 Troubleshooting

### Common Issues:

1. **Environment variables not loading**:
   - Check variable names match exactly
   - Restart deployment after adding variables

2. **Supabase connection errors**:
   - Verify URL and API key are correct
   - Check if RLS policies allow access

3. **Authentication not working**:
   - Verify password environment variables
   - Check for typos in variable names

4. **Images not displaying**:
   - Ensure Supabase Storage bucket is public
   - Check image URLs are accessible

### Getting Help:

- Check browser console for error messages
- Review Supabase logs in dashboard
- Test locally first to isolate deployment issues
- Contact support for your deployment platform

---

**🎉 Congratulations!** Your restaurant management system is now live and ready to serve customers!
