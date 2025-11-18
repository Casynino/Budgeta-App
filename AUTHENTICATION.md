# 🔐 Authentication System Documentation

## Overview

Budgeta now includes a complete, secure authentication system with industry-standard practices including password hashing, session management, and protected routes.

---

## 🎯 Features

### Implemented Security Features

✅ **Password Security**
- BCrypt hashing (10 salt rounds)
- Password strength validation
- Minimum 8 characters
- Requires uppercase, lowercase, and numbers
- No plain text password storage

✅ **Session Management**
- Token-based authentication
- 7-day session expiry
- Automatic token validation on app load
- Secure session storage

✅ **Protected Routes**
- All app pages require authentication
- Automatic redirect to login
- Loading state during auth check
- Session persistence across page reloads

✅ **User Management**
- Secure user registration
- Email validation
- Duplicate email prevention
- Profile updates
- Password change functionality

✅ **UI/UX**
- Modern dark-themed auth pages
- Real-time password strength indicator
- Show/hide password toggle
- Error handling and validation
- Loading states
- Success feedback

---

## 🔑 Authentication Flow

### Registration Flow

```
1. User fills registration form
   ↓
2. Client-side validation
   - All fields required
   - Email format check
   - Password strength check
   - Password confirmation match
   ↓
3. Password hashing (BCrypt)
   ↓
4. Store user data (localStorage)
   ↓
5. Generate auth token
   ↓
6. Create session
   ↓
7. Redirect to dashboard
```

### Login Flow

```
1. User enters credentials
   ↓
2. Validate input
   ↓
3. Find user by email
   ↓
4. Verify password (BCrypt compare)
   ↓
5. Generate auth token
   ↓
6. Create session (7 days)
   ↓
7. Update last login timestamp
   ↓
8. Redirect to dashboard
```

### Session Validation

```
1. App loads
   ↓
2. Check for auth token
   ↓
3. Check token expiry
   ↓
4. If valid: Load user session
   If expired: Clear session & redirect
```

---

## 🛡️ Security Implementation

### Password Hashing

```javascript
// Registration
const hashedPassword = await bcrypt.hash(password, 10);

// Login verification
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

### Password Requirements

- **Length**: Minimum 8 characters
- **Uppercase**: At least one (A-Z)
- **Lowercase**: At least one (a-z)
- **Numbers**: At least one (0-9)
- **Validation**: Real-time visual feedback

### Token Generation

```javascript
// Generate token (simplified for client-side)
const token = btoa(JSON.stringify({ 
  userId: user.id, 
  timestamp: Date.now() 
}));

// Set expiry (7 days)
const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
```

### Session Storage

```javascript
localStorage.setItem('budgeta_auth_token', token);
localStorage.setItem('budgeta_user_data', JSON.stringify(userSession));
localStorage.setItem('budgeta_token_expiry', expiryTime.toString());
```

---

## 📁 File Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Authentication state & methods
├── pages/
│   └── Auth/
│       ├── Login.jsx             # Login page
│       ├── Register.jsx          # Registration page
│       └── ForgotPassword.jsx    # Password reset page
└── components/
    └── auth/
        └── ProtectedRoute.jsx    # Route protection HOC
```

---

## 🔧 API Reference

### AuthContext Methods

#### `register(userData)`
Create a new user account.

```javascript
const { register } = useAuth();

await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123'
});
```

**Validation:**
- All fields required
- Valid email format
- Password strength requirements
- Unique email

**Returns:** `{ success: true, user: userSession }`

---

#### `login(email, password)`
Authenticate existing user.

```javascript
const { login } = useAuth();

await login('john@example.com', 'SecurePass123');
```

**Validation:**
- Email and password required
- User must exist
- Password must match

**Returns:** `{ success: true, user: userSession }`

---

#### `logout()`
End user session.

```javascript
const { logout } = useAuth();

logout();
```

**Actions:**
- Clears auth token
- Removes user data
- Clears expiry timestamp
- Resets auth state

---

#### `updateProfile(updates)`
Update user profile information.

```javascript
const { updateProfile } = useAuth();

await updateProfile({
  firstName: 'Jane',
  lastName: 'Smith'
});
```

**Protected Fields:**
- ID (cannot change)
- Password (use changePassword)

---

#### `changePassword(currentPassword, newPassword)`
Change user password.

```javascript
const { changePassword } = useAuth();

await changePassword('OldPass123', 'NewPass456');
```

**Validation:**
- Current password must be correct
- New password strength requirements
- Automatic re-hashing

---

#### `resetPassword(email)`
Request password reset.

```javascript
const { resetPassword } = useAuth();

await resetPassword('john@example.com');
```

**Note:** Currently simulated. In production, would send email with reset link.

---

### AuthContext State

```javascript
const {
  currentUser,      // User object or null
  loading,          // Boolean - auth check in progress
  error,            // String - last error message
  isAuthenticated   // Boolean - quick auth check
} = useAuth();
```

---

## 🎨 UI Components

### Login Page (`/login`)

**Features:**
- Email input with validation
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link
- Error message display
- Loading states
- Social login placeholders (Google, GitHub)
- Link to registration

**Route:** Public (redirects if already logged in)

---

### Register Page (`/register`)

**Features:**
- First name & last name inputs
- Email validation
- Password with strength indicator
- Confirm password validation
- Real-time password requirements
- Terms & privacy policy checkboxes
- Error handling
- Loading states
- Link to login

**Password Strength Indicator:**
- ✓ At least 8 characters
- ✓ One uppercase letter
- ✓ One lowercase letter
- ✓ One number

**Route:** Public

---

### Forgot Password Page (`/forgot-password`)

**Features:**
- Email input
- Send reset link
- Success confirmation
- Back to login link
- Error handling

**Route:** Public

---

### Protected Route Component

**Usage:**
```jsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

**Behavior:**
- Shows loading spinner during auth check
- Redirects to `/login` if not authenticated
- Renders children if authenticated

---

## 🚀 Usage Examples

### Check Authentication Status

```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <h1>Welcome, {currentUser.firstName}!</h1>
    </div>
  );
}
```

### Implement Logout Button

```jsx
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
```

### Custom Protected Component

```jsx
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminOnly({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}
```

---

## 🔄 Migration to Backend

### Current Implementation (Client-Side)

**Storage:** localStorage
**Hashing:** BCrypt.js (client-side)
**Tokens:** Base64 encoded JSON

### Production Migration Steps

1. **Create Backend API**
   ```javascript
   POST /api/auth/register
   POST /api/auth/login
   POST /api/auth/logout
   POST /api/auth/refresh
   GET  /api/auth/me
   ```

2. **Update AuthContext**
   - Replace localStorage calls with API calls
   - Use JWT tokens from server
   - Implement token refresh logic

3. **Server-Side Implementation**
   ```javascript
   // Example with Express.js
   app.post('/api/auth/register', async (req, res) => {
     const { email, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
     // Save to database
     // Generate JWT
     // Return token
   });
   ```

4. **Environment Variables**
   ```env
   JWT_SECRET=your-secret-key
   JWT_EXPIRY=7d
   DATABASE_URL=your-database-url
   ```

5. **Update Routes**
   - Change API endpoints
   - Add axios/fetch calls
   - Handle server errors
   - Implement token refresh

---

## 🧪 Testing Guide

### Test User Accounts

Create test accounts manually:

```javascript
// In browser console
localStorage.setItem('budgeta_users', JSON.stringify([
  {
    id: '1',
    email: 'test@budgeta.com',
    firstName: 'Test',
    lastName: 'User',
    hashedPassword: '$2a$10$...' // BCrypt hash
  }
]));
```

### Test Scenarios

1. **Registration**
   - ✓ Valid registration
   - ✓ Duplicate email error
   - ✓ Weak password rejection
   - ✓ Password mismatch

2. **Login**
   - ✓ Valid credentials
   - ✓ Invalid email
   - ✓ Wrong password
   - ✓ Remember me functionality

3. **Session**
   - ✓ Auto-login on page reload
   - ✓ Token expiry (after 7 days)
   - ✓ Logout clears session

4. **Protected Routes**
   - ✓ Redirect when not logged in
   - ✓ Access after login
   - ✓ Persistence across navigatio

n

---

## 🛠️ Troubleshooting

### Common Issues

**Issue:** "Cannot read property of undefined"
**Solution:** Wrap components with AuthProvider

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

---

**Issue:** Stuck on loading screen
**Solution:** Clear localStorage and refresh

```javascript
localStorage.clear();
window.location.reload();
```

---

**Issue:** Token expired immediately
**Solution:** Check system time/date settings

---

**Issue:** Can't login after registration
**Solution:** Check console for errors, verify BCrypt is working

---

## 🔒 Security Best Practices

### Current Implementation

✅ Password hashing (BCrypt)
✅ Input validation
✅ XSS prevention (React default)
✅ Session expiry
✅ Error messages don't reveal user existence

### Production Recommendations

1. **HTTPS Only** - Use SSL/TLS in production
2. **CSRF Protection** - Implement CSRF tokens
3. **Rate Limiting** - Prevent brute force attacks
4. **2FA** - Two-factor authentication
5. **Password Reset** - Email-based with time-limited tokens
6. **Account Lockout** - After failed login attempts
7. **Audit Logging** - Track authentication events
8. **Security Headers** - Implement CSP, HSTS, etc.

---

## 📊 Data Storage

### LocalStorage Structure

```javascript
{
  "budgeta_users": [
    {
      "id": "1234567890",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "hashedPassword": "$2a$10$...",
      "createdAt": "2024-11-18T12:00:00.000Z",
      "lastLogin": "2024-11-18T12:00:00.000Z"
    }
  ],
  "budgeta_auth_token": "base64_token",
  "budgeta_user_data": "{\"id\":\"1234567890\",\"email\":\"user@example.com\"}",
  "budgeta_token_expiry": "1700000000000"
}
```

---

## 🎓 Learning Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [BCrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

---

## 📝 Changelog

### Version 1.0.0 (Current)

- ✅ User registration with validation
- ✅ Secure login with BCrypt
- ✅ Session management (7-day tokens)
- ✅ Protected routes
- ✅ Password strength validation
- ✅ Profile updates
- ✅ Password change
- ✅ Forgot password UI
- ✅ Modern dark-themed auth pages
- ✅ Error handling

### Planned Features

- [ ] Email verification
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Account lockout after failed attempts
- [ ] Session management dashboard
- [ ] Login history
- [ ] Device management

---

## 🤝 Support

For authentication issues or questions:

1. Check this documentation
2. Review the code in `src/context/AuthContext.jsx`
3. Test in browser console
4. Clear localStorage and retry

---

**Remember:** This is a client-side implementation for development. For production, migrate to a proper backend with database and server-side authentication!
