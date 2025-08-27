# Analytics & Authentication Setup Guide

This guide explains how to set up and use the analytics and authentication system in Ongea.

## 🏗️ Architecture Overview

### Authentication Flow
```
User → Sign Up/In → JWT Token → Session Storage → Protected Routes
```

### Analytics Flow
```
User Action → Client Hook → API Route → Database → Admin Dashboard
```

## 🔧 Setup Instructions

### 1. Database Configuration

Create a MySQL database and configure your connection:

```sql
CREATE DATABASE ongea_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ongea_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ongea_db.* TO 'ongea_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="mysql://ongea_user:your_password@localhost:3306/ongea_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
NEXTAUTH_SECRET="another-secret-for-nextauth"
NEXTAUTH_URL="http://localhost:9002"

# Analytics
ANALYTICS_ENABLED="true"

# AI (existing)
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Database Schema

Run the setup script to create tables:

```bash
npm run setup-db
```

This creates the following tables:
- `users` - User accounts and preferences
- `sessions` - Active user sessions
- `analytics_events` - All tracked events

## 📊 Analytics Implementation

### Client-Side Tracking

Use the `useAnalytics` hook in your components:

```tsx
import { useAnalytics } from '@/hooks/use-analytics';

function MyComponent() {
  const { trackButtonClick, trackFeatureUsed } = useAnalytics();

  return (
    <Button onClick={() => trackButtonClick('my_button')}>
      Click Me
    </Button>
  );
}
```

### Available Tracking Methods

```tsx
// Button clicks
trackButtonClick('button_name', { additional: 'data' });

// Feature usage
trackFeatureUsed('story_generation', { language: 'fr' });

// Custom user actions
trackUserAction('custom_action', { context: 'value' });

// Error tracking
trackError('api_error', { endpoint: '/api/stories' });
```

### Automatic Tracking

The system automatically tracks:
- Page views (via middleware)
- Authentication events (signup, signin, signout)
- Navigation between protected routes

## 🔐 Authentication System

### Protected Routes

Routes are automatically protected based on the `middleware.ts` configuration:

```typescript
const protectedRoutes = ['/dashboard', '/stories', '/flashcards', '/chat', '/admin'];
const authRoutes = ['/signin', '/signup'];
```

### Using Authentication in Components

```tsx
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      Welcome, {user.name}!
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}
```

## 📈 Admin Dashboard

### Accessing Analytics

1. Create a user account
2. Navigate to `/admin`
3. View real-time analytics and user metrics

### Available Metrics

- **User Stats**: Total users, active users, signups
- **Event Tracking**: Most clicked buttons, popular features
- **Conversion Metrics**: Landing page to signup conversion
- **Recent Activity**: Latest user signups and actions

### API Endpoints

```
GET /api/admin/analytics/stats?days=30
POST /api/analytics/track
GET /api/auth/me
POST /api/auth/signin
POST /api/auth/signup
POST /api/auth/signout
```

## 🚀 Deployment Considerations

### Environment Variables

Ensure all production environment variables are set:
- Use strong JWT secrets (minimum 32 characters)
- Set `ANALYTICS_ENABLED=true` for production
- Configure proper `NEXTAUTH_URL` for your domain

### Database

- Use connection pooling for production
- Set up database backups
- Monitor database performance

### Security

- JWT tokens expire after 7 days
- Sessions are stored in database for revocation
- Passwords are hashed with bcrypt (12 rounds)
- HTTPS required in production

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **Analytics Not Tracking**
   - Check `ANALYTICS_ENABLED=true`
   - Verify API routes are accessible
   - Check browser console for errors

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Ensure middleware is configured

### Debug Commands

```bash
# Check database connection
npm run db:studio

# View Prisma schema
npx prisma db pull

# Reset database (development only)
npx prisma db push --force-reset
```

## 📝 Adding New Analytics Events

1. **Define the event** in your component:
```tsx
trackButtonClick('new_feature_button', {
  feature: 'new_feature',
  context: 'dashboard'
});
```

2. **View in admin dashboard** - events appear automatically

3. **Add to popular features** by using `trackFeatureUsed`:
```tsx
trackFeatureUsed('new_feature', { usage_context: 'first_time' });
```

## 🎯 Best Practices

1. **Event Naming**: Use consistent naming (snake_case)
2. **Properties**: Include relevant context data
3. **Privacy**: Don't track sensitive user data
4. **Performance**: Analytics calls are async and non-blocking
5. **Testing**: Use `ANALYTICS_ENABLED=false` in tests
