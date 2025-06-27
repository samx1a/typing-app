# SpeedType Deployment Guide

This guide will help you deploy the SpeedType typing test application to production.

## 🚀 Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy Frontend**
   ```bash
   cd client
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-backend-url.com`

#### Backend (Railway)
1. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `server` directory

2. **Configure Environment Variables**
   ```env
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

3. **Deploy**
   - Railway will automatically build and deploy
   - Get your backend URL from Railway dashboard

### Option 2: Netlify + Render

#### Frontend (Netlify)
1. **Build the project**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify
   - Or connect your GitHub repository

3. **Configure redirects**
   Create `_redirects` file in `client/public/`:
   ```
   /*    /index.html   200
   ```

#### Backend (Render)
1. **Create a new Web Service**
   - Go to [Render.com](https://render.com)
   - Connect your GitHub repository
   - Select the `server` directory

2. **Configure Build Settings**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Set Environment Variables**
   ```env
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.netlify.app
   ```

## 🔧 Manual Deployment

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Step 1: Prepare the Application

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd typing-app
   
   # Install client dependencies
   cd client
   npm install --legacy-peer-deps
   
   # Install server dependencies
   cd ../server
   npm install
   ```

2. **Build the application**
   ```bash
   # Build frontend
   cd client
   npm run build
   
   # Build backend
   cd ../server
   npm run build
   ```

### Step 2: Deploy Backend

#### Using PM2 (Recommended for VPS)
1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start the server**
   ```bash
   cd server
   pm2 start dist/index.js --name speedtype-server
   pm2 save
   pm2 startup
   ```

#### Using Docker
1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY dist ./dist
   EXPOSE 5000
   CMD ["node", "dist/index.js"]
   ```

2. **Build and run**
   ```bash
   docker build -t speedtype-server .
   docker run -p 5000:5000 speedtype-server
   ```

### Step 3: Deploy Frontend

#### Using Nginx
1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /var/www/speedtype/client/build;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Deploy files**
   ```bash
   sudo cp -r client/build/* /var/www/speedtype/client/build/
   sudo systemctl restart nginx
   ```

## 🌐 Domain and SSL Setup

### Using Let's Encrypt
1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 📊 Monitoring and Analytics

### Application Monitoring
1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs speedtype-server
   ```

2. **Nginx Logs**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

### Performance Monitoring
- **Frontend**: Use Vercel Analytics or Google Analytics
- **Backend**: Use PM2 monitoring or external services like New Relic

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use secure random strings for secrets
- Rotate secrets regularly

### CORS Configuration
```typescript
// In server/src/index.ts
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `CLIENT_URL` environment variable
   - Ensure CORS is properly configured

2. **Build Failures**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Use `--legacy-peer-deps` if needed

3. **Port Conflicts**
   - Check if port 5000 is available
   - Use `PORT` environment variable to change

4. **Memory Issues**
   - Increase Node.js memory limit: `node --max-old-space-size=4096 dist/index.js`
   - Monitor memory usage with PM2

### Debug Commands
```bash
# Check server status
pm2 status
pm2 logs

# Check nginx status
sudo systemctl status nginx
sudo nginx -t

# Check ports
netstat -tulpn | grep :5000
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Implement session management
- Use Redis for caching

### Database Migration
- Replace in-memory storage with PostgreSQL/MongoDB
- Implement proper data persistence
- Add database connection pooling

### CDN Setup
- Use Cloudflare or AWS CloudFront
- Cache static assets
- Enable gzip compression

## 🎯 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size

### Backend
- Enable compression middleware
- Implement caching strategies
- Use connection pooling
- Monitor memory usage

---

**Need help?** Check the [main README](../README.md) or open an issue on GitHub. 