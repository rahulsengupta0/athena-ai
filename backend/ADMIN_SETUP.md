# Admin Setup Guide

This document explains how to set up admin users in the Athena AI application.

## Overview

The application now uses a role-based authentication system where users can have either:
- **`user`** role (default) - Regular users
- **`admin`** role - Administrators with access to admin dashboard

## Backend Structure

### User Model
- Added `role` field to User schema (default: `'user'`)
- Role can be either `'user'` or `'admin'`

### Admin Middleware
- Location: `backend/middlewares/admin.js`
- Used to protect admin-only routes
- Checks if user's role is `'admin'`

### Admin Routes
- Location: `backend/routes/adminRoutes.js`
- Protected by admin middleware
- Endpoints:
  - `GET /api/admin/users` - Get all users (admin only)
  - `PUT /api/admin/users/:userId/role` - Update user role (admin only)

## Setting a User as Admin

### Method 1: Using the Utility Script (Recommended)

Run the provided script from the project root:

```bash
node backend/scripts/setAdmin.js <user-email>
```

Example:
```bash
node backend/scripts/setAdmin.js admin@example.com
```

### Method 2: Using MongoDB Directly

Connect to your MongoDB database and run:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: Using the Admin API (After First Admin is Created)

Once you have at least one admin, you can use the API endpoint:

```bash
curl -X PUT http://localhost:5000/api/admin/users/<userId>/role \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

## Frontend Structure

### AuthContext
- Fetches user profile on login
- Checks if `user.role === 'admin'`
- Exposes `isAdmin` boolean to components

### AdminRoute Component
- Location: `src/components/AdminRoute.jsx`
- Protects admin-only pages
- Redirects non-admin users to home page

### Sidebar
- Shows "Admin Dash" menu item only for admin users
- Located in "Workspace" section

### Admin Dashboard
- Route: `/admin-dash`
- Protected by `AdminRoute` component
- Currently shows a placeholder page

## Testing Admin Access

1. **Set a user as admin** using one of the methods above
2. **Login** with that user's credentials
3. **Check sidebar** - you should see "Admin Dash" in the Workspace section
4. **Navigate to `/admin-dash`** - should load the admin dashboard
5. **Try accessing as non-admin** - should be redirected to home page

## Security Notes

- Admin routes are protected by both authentication and admin role checks
- The admin middleware verifies the role from the database on each request
- User role is stored in the database, not just in the JWT token
- Admin status is checked on every protected route request

## Next Steps

After setting up admin access, you can:
1. Build the Template Creator UI in `src/pages/AdminDash.jsx`
2. Add more admin routes as needed
3. Customize admin dashboard features