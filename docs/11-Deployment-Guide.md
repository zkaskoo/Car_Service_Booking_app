# Deployment Guide

## Overview

Production deployment guide for the Car Service Booking application.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                            INTERNET                                   │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          CLOUDFLARE                                   │
│                    (DNS, CDN, DDoS Protection)                        │
└───────────────────┬────────────────────────────┬─────────────────────┘
                    │                            │
                    ▼                            ▼
┌─────────────────────────────┐    ┌──────────────────────────────────┐
│         VERCEL              │    │     DIGITAL OCEAN / AWS          │
│     (Frontend Hosting)      │    │      (Backend Hosting)           │
│                             │    │                                  │
│   ┌─────────────────────┐   │    │   ┌────────────────────────┐    │
│   │     Next.js App     │   │    │   │    Laravel API         │    │
│   │   (Static + SSR)    │   │    │   │    (PHP 8.3)           │    │
│   └─────────────────────┘   │    │   └───────────┬────────────┘    │
│                             │    │               │                  │
└─────────────────────────────┘    │   ┌───────────▼────────────┐    │
                                   │   │    PostgreSQL 16       │    │
                                   │   │      (Database)         │    │
                                   │   └────────────────────────┘    │
                                   │                                  │
                                   │   ┌────────────────────────┐    │
                                   │   │      Redis 7           │    │
                                   │   │   (Cache & Queue)      │    │
                                   │   └────────────────────────┘    │
                                   │                                  │
                                   └──────────────────────────────────┘
```

---

## Frontend Deployment (Vercel)

### Prerequisites

1. Vercel account
2. GitHub repository connected

### Configuration

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

### Environment Variables

Set in Vercel Dashboard:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com/api/v1` |

### Deployment Steps

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (from frontend directory)
cd frontend
vercel --prod
```

### Domain Configuration

1. Add domain in Vercel Dashboard
2. Update DNS records:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```

---

## Backend Deployment (Laravel Forge / Manual)

### Option 1: Laravel Forge

1. Create server on DigitalOcean/AWS
2. Add site in Forge
3. Connect GitHub repo
4. Configure environment variables
5. Deploy

### Option 2: Manual Deployment

#### Server Requirements

- Ubuntu 22.04 LTS
- PHP 8.3+
- Composer 2.x
- Nginx
- PostgreSQL 16
- Redis 7
- Supervisor (for queues)

#### Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.3
sudo add-apt-repository ppa:ondrej/php
sudo apt install -y php8.3 php8.3-fpm php8.3-cli php8.3-pgsql php8.3-mbstring \
    php8.3-xml php8.3-curl php8.3-zip php8.3-redis php8.3-bcmath php8.3-gd

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install -y nginx

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Supervisor
sudo apt install -y supervisor
```

#### Database Setup

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE car_service;
CREATE USER car_service_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE car_service TO car_service_user;
\q
```

#### Application Deployment

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/car-service-booking.git
cd car-service-booking/backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Copy and configure environment
cp .env.example .env
nano .env

# Generate key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Run seeders
php artisan db:seed --force

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Set permissions
sudo chown -R www-data:www-data /var/www/car-service-booking
sudo chmod -R 755 /var/www/car-service-booking
sudo chmod -R 775 /var/www/car-service-booking/backend/storage
sudo chmod -R 775 /var/www/car-service-booking/backend/bootstrap/cache
```

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/car-service-api
server {
    listen 80;
    listen [::]:80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.yourdomain.com;

    root /var/www/car-service-booking/backend/public;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/car-service-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com
```

#### Queue Worker (Supervisor)

```ini
# /etc/supervisor/conf.d/car-service-worker.conf
[program:car-service-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/car-service-booking/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/car-service-booking/backend/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start car-service-worker:*
```

---

## Environment Variables

### Backend (.env)

```env
APP_NAME="Car Service Booking"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=false
APP_TIMEZONE=Europe/Budapest
APP_URL=https://api.yourdomain.com

FRONTEND_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=car_service
DB_USERNAME=car_service_user
DB_PASSWORD=your_secure_password

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120
CACHE_STORE=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@mg.yourdomain.com
MAIL_PASSWORD=your_mailgun_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

---

## CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml:**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Build
        run: cd frontend && npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/car-service-booking
            git pull origin main
            cd backend
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            php artisan queue:restart
```

---

## Monitoring & Maintenance

### Health Check Endpoint

```php
// routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'cache' => Cache::store()->getStore() ? 'connected' : 'disconnected',
    ]);
});
```

### Recommended Monitoring Tools

- **Error Tracking**: Sentry
- **APM**: New Relic / Laravel Telescope
- **Uptime**: UptimeRobot / Better Uptime
- **Logs**: Papertrail / Logtail

### Backup Strategy

```bash
# Database backup (daily cron)
0 2 * * * pg_dump -U car_service_user car_service | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Retain 30 days of backups
0 3 * * * find /backups -name "db_*.sql.gz" -mtime +30 -delete
```

---

## Security Checklist

- [ ] HTTPS enabled on all endpoints
- [ ] Database credentials not in code
- [ ] APP_DEBUG=false in production
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Regular dependency updates
- [ ] Database backups automated
- [ ] SSL certificates auto-renewal
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Fail2ban installed

---

## Troubleshooting

### Common Issues

**500 Internal Server Error**
```bash
# Check Laravel logs
tail -f /var/www/car-service-booking/backend/storage/logs/laravel.log

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Check permissions
sudo chown -R www-data:www-data storage bootstrap/cache
```

**Queue Not Processing**
```bash
# Check supervisor status
sudo supervisorctl status

# Restart workers
sudo supervisorctl restart car-service-worker:*
```

**Redis Connection Issues**
```bash
# Check Redis status
redis-cli ping

# Check Redis configuration
sudo nano /etc/redis/redis.conf
```

---

**Related Documents:**
- [[02-Tech-Stack]]
- [[03-System-Architecture]]
