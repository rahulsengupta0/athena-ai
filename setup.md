# Athena AI Settings Page Setup

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a .env file in the backend directory:**
   ```env
   MONGO_URI=mongodb://localhost:27017/athena-ai
   PORT=5000
   ```

4. **Make sure MongoDB is running on your system**

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Navigate to the root directory:**
   ```bash
   cd ..
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

## Features Implemented

### ✅ Exact UI Match
- Replicated the exact design from the provided screenshots
- Purple color scheme matching the original
- Same layout, spacing, and typography
- Responsive design

### ✅ Profile Management
- **Profile Information Form:**
  - First Name, Last Name, Email fields
  - Bio textarea
  - Website URL field
  - Real-time form updates

- **Avatar Upload:**
  - Click to upload new avatar
  - File validation (JPG, GIF, PNG, max 2MB)
  - Preview uploaded image
  - Server-side file handling

### ✅ Password Management
- **Change Password Form:**
  - Current password field
  - New password field
  - Confirm password field
  - Show/hide password toggles
  - Password validation (minimum 8 characters)
  - Password matching validation

### ✅ Settings Navigation
- **Tab Navigation:**
  - Profile (active/implemented)
  - Notifications (placeholder)
  - Appearance (placeholder)
  - Privacy (placeholder)
  - Billing (placeholder)
  - Advanced (placeholder)

### ✅ Backend Integration
- **RESTful API endpoints:**
  - `GET /api/profile` - Get user profile
  - `PUT /api/profile` - Update user profile
  - `PUT /api/password` - Change password
  - `POST /api/init-user` - Initialize default user

- **Database Integration:**
  - MongoDB with Mongoose
  - User schema with all required fields
  - Password hashing with bcryptjs
  - File upload handling with multer

### ✅ Form Validation & Error Handling
- Client-side validation
- Server-side validation
- Error message display
- Success message display
- Loading states
- File upload validation

## API Endpoints

### Profile Management
- **GET /api/profile** - Retrieve user profile data
- **PUT /api/profile** - Update user profile (supports file upload)

### Password Management
- **PUT /api/password** - Change user password

### Utility
- **POST /api/init-user** - Create default user for demo

## File Structure
```
src/
├── pages/
│   └── Setting.jsx          # Main settings page component
├── services/
│   └── api.js               # API service for backend communication
└── App.jsx                  # Updated with settings route

backend/
├── index.js                 # Express server with all API endpoints
├── package.json             # Updated with new dependencies
└── uploads/                 # Directory for uploaded avatars
```

## Testing the Settings Page

1. **Start both servers** (backend and frontend)
2. **Navigate to** `http://localhost:5173/settings`
3. **Test Profile Updates:**
   - Modify any profile fields
   - Upload a new avatar
   - Click "Save Changes"
4. **Test Password Change:**
   - Enter current password: `password123`
   - Enter new password
   - Confirm new password
   - Click "Update Password"

## Default User Credentials
- **Email:** alex@example.com
- **Password:** password123

The system will automatically create this user on first API call if it doesn't exist.

