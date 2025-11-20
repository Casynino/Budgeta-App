# 🗄️ Database Schema Proposal

## Overview

This document outlines the proposed database schema for Budgeta when transitioning to a backend system using MongoDB or a relational database like PostgreSQL.

---

## Collections/Tables

### 1. Users

Stores user account information.

```json
{
  "_id": "ObjectId",
  "email": "string (unique, required)",
  "password": "string (hashed, required)",
  "firstName": "string",
  "lastName": "string",
  "profileImage": "string (URL)",
  "currency": "string (default: 'USD')",
  "language": "string (default: 'en')",
  "mode": "string (personal|business, default: 'personal')",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "lastLogin": "timestamp",
  "isActive": "boolean (default: true)",
  "preferences": {
    "notifications": "boolean",
    "theme": "string (light|dark)",
    "emailAlerts": "boolean"
  }
}
```

**Indexes:**
- `email` (unique)
- `createdAt`

---

### 2. Transactions

Stores all financial transactions (income and expenses).

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "type": "string (income|expense, required)",
  "category": "string (required)",
  "amount": "number (required, min: 0)",
  "description": "string (required)",
  "date": "date (required)",
  "tags": ["string"],
  "attachments": ["string (URLs)"],
  "businessId": "ObjectId (ref: Businesses, optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `userId`
- `date` (descending)
- `type`
- `category`
- Compound: `userId` + `date`

---

### 3. Budgets

Stores monthly budget limits by category.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "category": "string (required)",
  "limit": "number (required, min: 0)",
  "spent": "number (default: 0)",
  "month": "number (1-12, required)",
  "year": "number (required)",
  "color": "string (hex color)",
  "alerts": {
    "enabled": "boolean",
    "threshold": "number (percentage)"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `userId`
- Compound: `userId` + `month` + `year`
- Unique Compound: `userId` + `category` + `month` + `year`

---

### 4. Debts

Stores debt information (money owed and owed to user).

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "type": "string (iOwe|owedToMe, required)",
  "personName": "string (required)",
  "amount": "number (required, min: 0)",
  "amountPaid": "number (default: 0)",
  "dueDate": "date (required)",
  "description": "string (required)",
  "category": "string (personal|business|loan|other)",
  "status": "string (pending|partial|paid|overdue)",
  "notes": "string",
  "attachments": ["string (URLs)"],
  "paymentHistory": [{
    "amount": "number",
    "date": "date",
    "note": "string"
  }],
  "reminders": {
    "enabled": "boolean",
    "daysBeforeDue": "number"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `userId`
- `type`
- `status`
- `dueDate`
- Compound: `userId` + `type` + `status`

---

### 5. Investments

Stores investment portfolio information.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "name": "string (required)",
  "type": "string (crypto|stocks|bonds|real-estate|mutual-funds|other)",
  "amount": "number (initial investment, required)",
  "currentValue": "number (required)",
  "quantity": "number",
  "purchasePrice": "number",
  "currentPrice": "number",
  "purchaseDate": "date (required)",
  "platform": "string",
  "notes": "string",
  "roi": "number (calculated)",
  "performance": [{
    "date": "date",
    "value": "number"
  }],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `userId`
- `type`
- `purchaseDate`

---

### 6. RecurringPayments

Stores subscription and recurring payment information.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "name": "string (required)",
  "amount": "number (required, min: 0)",
  "frequency": "string (daily|weekly|monthly|quarterly|yearly)",
  "category": "string (required)",
  "dueDate": "date (next payment date)",
  "startDate": "date",
  "endDate": "date (optional)",
  "status": "string (active|paused|cancelled)",
  "autoDeduct": "boolean",
  "reminders": {
    "enabled": "boolean",
    "daysBeforeDue": "number"
  },
  "paymentHistory": [{
    "date": "date",
    "amount": "number",
    "status": "string (paid|missed)"
  }],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `userId`
- `status`
- `dueDate`
- `frequency`

---

### 7. Goals

Stores financial goals and wishlist items.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "name": "string (required)",
  "targetAmount": "number (required, min: 0)",
  "currentAmount": "number (default: 0)",
  "deadline": "date",
  "category": "string (savings|travel|shopping|education|other)",
  "priority": "string (low|medium|high)",
  "description": "string",
  "milestones": [{
    "amount": "number",
    "date": "date",
    "achieved": "boolean"
  }],
  "linkedBudgetId": "ObjectId (ref: Budgets, optional)",
  "status": "string (active|completed|cancelled)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `userId`
- `status`
- `deadline`
- `priority`

---

### 8. Businesses

Stores business entities for business mode.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "name": "string (required)",
  "type": "string (sole-proprietorship|llc|corporation|partnership)",
  "industry": "string",
  "registrationNumber": "string",
  "taxId": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "zipCode": "string"
  },
  "currency": "string",
  "fiscalYearStart": "number (month, 1-12)",
  "status": "string (active|inactive)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `userId`
- `status`

---

### 9. Categories

System-wide or user-custom categories.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, optional - null for system categories)",
  "type": "string (income|expense)",
  "name": "string (required)",
  "icon": "string (emoji or icon code)",
  "color": "string (hex color)",
  "isSystem": "boolean (default: false)",
  "order": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Indexes:**
- `userId`
- `type`
- Compound: `userId` + `type`

---

### 10. Notifications

Stores user notifications.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users, required)",
  "type": "string (debt-due|budget-alert|goal-milestone|recurring-payment|system)",
  "title": "string (required)",
  "message": "string (required)",
  "relatedEntityId": "ObjectId (optional)",
  "relatedEntityType": "string (debt|budget|goal|recurring)",
  "isRead": "boolean (default: false)",
  "priority": "string (low|normal|high)",
  "createdAt": "timestamp",
  "expiresAt": "timestamp (optional)"
}
```

**Indexes:**
- `userId`
- `isRead`
- `createdAt` (descending)
- Compound: `userId` + `isRead`

---

## Relationships

### MongoDB (NoSQL)
- Use ObjectId references
- Denormalize where appropriate for performance
- Use embedded documents for one-to-few relationships

### PostgreSQL (SQL)
- Foreign key constraints
- Use JOINs for related data
- Create junction tables for many-to-many relationships

---

## API Endpoints Structure

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/:id` - Get single budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/summary` - Get budget summary

### Debts
- `GET /api/debts` - Get all debts
- `POST /api/debts` - Create debt
- `GET /api/debts/:id` - Get single debt
- `PUT /api/debts/:id` - Update debt
- `DELETE /api/debts/:id` - Delete debt
- `POST /api/debts/:id/payment` - Record payment

### Similar patterns for:
- Investments (`/api/investments`)
- Recurring Payments (`/api/recurring`)
- Goals (`/api/goals`)
- Businesses (`/api/businesses`)
- Notifications (`/api/notifications`)

---

## Security Considerations

1. **Authentication**: JWT-based authentication
2. **Authorization**: User can only access their own data
3. **Data Validation**: Strict validation on all inputs
4. **Encryption**: Encrypt sensitive data at rest
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **HTTPS**: Enforce HTTPS in production
7. **SQL Injection**: Use parameterized queries
8. **XSS Protection**: Sanitize all user inputs

---

## Backup & Recovery

1. **Daily Backups**: Automated daily database backups
2. **Point-in-Time Recovery**: Enable for critical data
3. **Disaster Recovery Plan**: Regular backup testing
4. **Data Retention**: 90-day backup retention minimum

---

## Performance Optimization

1. **Indexing**: Strategic indexes on frequently queried fields
2. **Caching**: Redis for frequently accessed data
3. **Query Optimization**: Optimize slow queries
4. **Pagination**: Implement pagination for large datasets
5. **Database Sharding**: For horizontal scaling (future)

---

## Migration Strategy

When moving from localStorage to backend:

1. Export localStorage data
2. Transform to match schema
3. Bulk import via migration endpoint
4. Verify data integrity
5. Enable sync functionality

---

This schema is designed to be flexible and scalable for future enhancements while maintaining data integrity and performance.
