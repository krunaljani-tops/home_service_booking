# HomeServe Technologies - Deployment Guide

## 1. Architecture Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel      │     │   Render     │     │ Cloud MySQL  │
│   (Frontend)  │────▶│  (Backend)   │────▶│  (Database)  │
│   React App   │     │  FastAPI     │     │  PlanetScale │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                     ┌──────┼──────┐
                     ▼      ▼      ▼
                Razorpay Cloudinary SMTP
```

## 2. Prerequisites

- GitHub account with the repository
- Vercel account (free tier)
- Render account (free tier)
- PlanetScale or Railway MySQL (managed)
- Cloudinary account (free tier)
- Razorpay account (test mode)

## 3. Database Deployment

### Option A: PlanetScale (Recommended)
1. Create account at https://planetscale.com
2. Create database `homeserve_db`
3. Get connection string
4. Run schema.sql via PlanetScale console
5. Run seed.sql for initial data

### Option B: Railway MySQL
1. Create account at https://railway.app
2. Add MySQL service
3. Get connection credentials
4. Connect via MySQL client and run schema.sql

### Connection String Format
```
mysql+pymysql://user:password@host:port/homeserve_db?ssl_ca=/etc/ssl/certs/ca-certificates.crt
```

## 4. Backend Deployment (Render)

### Setup
1. Go to https://render.com and create a Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: homeserve-api
   - **Root Directory**: backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Environment Variables
Set these in Render dashboard:
```
DATABASE_URL=mysql+pymysql://user:pass@host:port/homeserve_db
SECRET_KEY=<generate-a-strong-random-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
FRONTEND_URL=https://your-app.vercel.app
APP_ENV=production
```

### Health Check
Configure health check path: `/health`

## 5. Frontend Deployment (Vercel)

### Setup
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Environment Variables
```
VITE_API_URL=https://homeserve-api.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### Routing Configuration
Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 6. Cloudinary Setup

1. Create account at https://cloudinary.com
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Create upload preset named `homeserve_uploads`
4. Set folder to `homeserve/`
5. Configure allowed formats: jpg, png, webp, pdf

## 7. Razorpay Setup

1. Create account at https://razorpay.com
2. Go to Settings → API Keys → Generate Test Keys
3. Copy Key ID and Key Secret
4. Configure webhook:
   - URL: `https://homeserve-api.onrender.com/api/v1/payments/webhook`
   - Events: `payment.captured`, `payment.failed`, `refund.processed`
   - Secret: Generate and store as `RAZORPAY_WEBHOOK_SECRET`

## 8. Post-Deployment Verification

### Checklist
- [ ] Frontend loads at production URL
- [ ] Backend health endpoint responds: `GET /health`
- [ ] API docs accessible: `GET /docs`
- [ ] Database connection works (test login)
- [ ] User registration works
- [ ] User login works
- [ ] Role-based dashboards load
- [ ] Service browsing works
- [ ] Booking creation works
- [ ] Payment sandbox works
- [ ] Image uploads to Cloudinary work
- [ ] CORS allows frontend origin
- [ ] JWT authentication works
- [ ] All role redirects work

### Test Sequence
1. Open frontend URL
2. Login as admin (admin@homeserve.com / Admin@123)
3. Verify admin dashboard loads with data
4. Login as customer, browse services, create booking
5. Login as provider, accept booking, assign technician
6. Login as technician, view and complete job
7. Return as customer, make payment, submit review

## 9. Monitoring

### Render
- View logs in Render dashboard
- Set up alerts for service health

### Error Tracking (Optional)
- Add Sentry for error monitoring
- Configure `SENTRY_DSN` environment variable

## 10. Scaling Considerations

- **Database**: Upgrade to dedicated MySQL instance for production
- **Backend**: Scale Render instances horizontally
- **Frontend**: Vercel handles scaling automatically
- **CDN**: Cloudinary serves as media CDN
- **Caching**: Add Redis for session/query caching when needed

