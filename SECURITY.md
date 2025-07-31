# Security Guidelines for C Square Restaurant System

## 🔐 Environment Variables Security

### Important: Never commit sensitive data to GitHub

The following files are already configured to protect your sensitive information:

- `.env` is in `.gitignore` - your actual credentials will never be pushed
- `.env.example` provides a template without real values
- Use strong, unique passwords for each role

### Setup Instructions
1. Copy `.env.example` to `.env`
2. Fill in your actual values
3. Keep `.env` in your `.gitignore` file
4. Use platform environment variables in production

## 🛡️ Password Security

### Recommended Password Structure:
- **Owner Password**: 16+ characters, mix of letters, numbers, symbols
- **Employee Password**: 12+ characters, easy to remember for staff
- **Viewer Password**: 8+ characters, for demo/training purposes

### Password Rotation Schedule:
- **Owner Password**: Every 3 months
- **Employee Password**: Every 6 months  
- **Viewer Password**: Every year or when needed

## 🔧 Supabase Security
- Enable Row Level Security (RLS) on all tables
- Use proper access policies
- Regularly rotate API keys
- Monitor access logs
- Enable database backups

## 🚨 Production Deployment Security

### Before Going Live:
- Use strong, unique passwords
- Enable HTTPS
- Set up proper environment variables on your hosting platform
- Test all security features
- Review and audit all access permissions

### Environment Variables in Production:
Never use development passwords in production. Set up separate, secure credentials for your live environment.
- Use appropriate policies for data access
- Keep your Supabase keys secure

## Production Deployment
- Use environment variables in your deployment platform
- Enable HTTPS
- Configure proper CORS settings
- Monitor for security vulnerabilities
