# 🏛️ Budgeta Architecture Guide

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [State Management](#state-management)
5. [Component Patterns](#component-patterns)
6. [Adding New Features](#adding-new-features)
7. [Best Practices](#best-practices)

---

## Overview

Budgeta is built using a modern React architecture with a focus on:
- **Modularity**: Reusable components and clear separation of concerns
- **Scalability**: Easy to add new features and pages
- **Maintainability**: Clean code with consistent patterns
- **Performance**: Optimized rendering and efficient state management

---

## Technology Stack

### Core Technologies
- **React 18.2**: Modern React with hooks and concurrent features
- **Vite**: Lightning-fast build tool and dev server
- **TailwindCSS 3.3**: Utility-first CSS framework
- **React Router DOM 6.20**: Client-side routing

### UI & Visualization
- **Recharts 2.10**: Charting library for data visualization
- **Lucide React**: Modern icon library
- **date-fns 2.30**: Date manipulation and formatting

### State Management
- **Context API**: Global state management
- **localStorage**: Client-side data persistence

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic UI elements
│   ├── charts/         # Chart components
│   └── layout/         # Layout components
│
├── pages/              # Feature pages (route components)
│   ├── Dashboard/
│   ├── Transactions/
│   └── ...
│
├── context/            # Global state management
│   └── FinanceContext.jsx
│
├── hooks/              # Custom React hooks
│   └── useFinancialSummary.js
│
├── utils/              # Helper functions
│   └── helpers.js
│
├── data/               # Mock data and constants
│   └── mockData.js
│
├── constants/          # Application constants
│   └── categories.js
│
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

### Directory Purposes

#### `/components/common`
Reusable UI components used across the application:
- **Button**: Versatile button component with variants
- **Card**: Container component for content
- **Input**: Form input with label and validation
- **Select**: Dropdown select component
- **Modal**: Dialog/modal component
- **Badge**: Status and category badges
- **ProgressBar**: Visual progress indicator

#### `/components/charts`
Wrapper components for Recharts:
- **LineChart**: Trend visualization
- **BarChart**: Comparison visualization
- **PieChart**: Distribution visualization

#### `/components/layout`
Layout structure components:
- **Layout**: Main app layout wrapper
- **Header**: Top navigation bar
- **Sidebar**: Side navigation menu

#### `/pages`
Each page represents a route and feature:
- Self-contained feature modules
- Import necessary components and hooks
- Handle feature-specific state and logic

---

## State Management

### Context API Architecture

```jsx
FinanceContext.jsx
├── State
│   ├── transactions[]
│   ├── budgets[]
│   ├── debts{}
│   ├── investments[]
│   ├── recurringPayments[]
│   ├── goals[]
│   └── app settings (mode, currency, etc.)
│
├── Methods
│   ├── CRUD operations for each entity
│   └── Utility functions
│
└── Persistence
    └── localStorage sync
```

### Using the Context

```jsx
import { useFinance } from '../../context/FinanceContext';

const MyComponent = () => {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction,
    deleteTransaction 
  } = useFinance();
  
  // Your component logic
};
```

### Custom Hooks

Custom hooks encapsulate complex logic and calculations:

```jsx
// useFinancialSummary.js
export const useFinancialSummary = () => {
  const { transactions, budgets, debts } = useFinance();
  
  // Complex calculations
  const summary = useMemo(() => {
    // Calculate totals, percentages, etc.
    return {
      totalIncome,
      totalExpense,
      healthScore,
      // ...
    };
  }, [transactions, budgets, debts]);
  
  return summary;
};
```

---

## Component Patterns

### 1. Container/Presentational Pattern

**Container (Smart Component):**
```jsx
const TransactionsContainer = () => {
  const { transactions, addTransaction } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleSubmit = (data) => {
    addTransaction(data);
    setModalOpen(false);
  };
  
  return (
    <TransactionsList 
      transactions={transactions}
      onAdd={handleSubmit}
    />
  );
};
```

**Presentational (Dumb Component):**
```jsx
const TransactionsList = ({ transactions, onAdd }) => {
  return (
    <div>
      {transactions.map(t => (
        <TransactionItem key={t.id} transaction={t} />
      ))}
    </div>
  );
};
```

### 2. Composition Pattern

```jsx
<Card>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Body>
    Content here
  </Card.Body>
</Card>
```

### 3. Render Props Pattern

```jsx
<DataProvider>
  {(data) => <Component data={data} />}
</DataProvider>
```

---

## Adding New Features

### Step 1: Plan the Feature
1. Define data structure
2. Design UI/UX
3. Identify required components
4. Plan state management

### Step 2: Update Context (if needed)

```jsx
// In FinanceContext.jsx

// Add state
const [newFeature, setNewFeature] = useState([]);

// Add CRUD methods
const addNewFeatureItem = (item) => {
  const newItem = { ...item, id: Date.now().toString() };
  setNewFeature([...newFeature, newItem]);
};

// Add to context value
const value = {
  // ...existing
  newFeature,
  addNewFeatureItem,
  // ...
};
```

### Step 3: Create Components

```jsx
// src/pages/NewFeature/NewFeature.jsx
import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const NewFeature = () => {
  const { newFeature, addNewFeatureItem } = useFinance();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Feature</h1>
      {/* Your feature UI */}
    </div>
  );
};

export default NewFeature;
```

### Step 4: Add Route

```jsx
// In App.jsx
import NewFeature from './pages/NewFeature/NewFeature';

<Route path="new-feature" element={<NewFeature />} />
```

### Step 5: Add Navigation

```jsx
// In Sidebar.jsx
const navItems = [
  // ...existing
  { path: '/new-feature', icon: IconComponent, label: 'New Feature' },
];
```

---

## Best Practices

### 1. Component Organization

```jsx
// ✅ Good: Organized and readable
const MyComponent = () => {
  // 1. Hooks
  const { data } = useFinance();
  const [state, setState] = useState(null);
  
  // 2. Derived values
  const computed = useMemo(() => calculate(data), [data]);
  
  // 3. Handlers
  const handleClick = () => {
    // logic
  };
  
  // 4. Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 5. Early returns
  if (!data) return <Loading />;
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### 2. Naming Conventions

- **Components**: PascalCase (`TransactionCard`)
- **Functions**: camelCase (`calculateTotal`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TRANSACTIONS`)
- **Files**: Match component name (`TransactionCard.jsx`)

### 3. Props Destructuring

```jsx
// ✅ Good
const Button = ({ variant, size, children, onClick }) => {
  // ...
};

// ❌ Avoid
const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

### 4. Conditional Rendering

```jsx
// ✅ Good: Clear and explicit
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ Avoid: Nested ternaries
{isLoading ? <Spinner /> : error ? <Error /> : <Data />}
```

### 5. State Management

```jsx
// ✅ Good: Single source of truth
const [formData, setFormData] = useState({
  name: '',
  email: '',
  amount: 0
});

// Update
setFormData({ ...formData, name: 'John' });

// ❌ Avoid: Multiple related states
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [amount, setAmount] = useState(0);
```

### 6. Performance Optimization

```jsx
// Use memo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Use callback for functions passed as props
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Split large components
const LargeList = React.memo(({ items }) => {
  return items.map(item => <Item key={item.id} item={item} />);
});
```

### 7. Error Handling

```jsx
const MyComponent = () => {
  const [error, setError] = useState(null);
  
  const handleAction = async () => {
    try {
      setError(null);
      // action
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div>
      {error && <ErrorAlert message={error} />}
      {/* content */}
    </div>
  );
};
```

### 8. Form Handling

```jsx
const FormComponent = () => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // process form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        name="field1" 
        value={formData.field1}
        onChange={handleChange}
      />
    </form>
  );
};
```

---

## Testing Strategy

### Unit Tests
- Test utility functions
- Test custom hooks
- Test component logic

### Integration Tests
- Test page flows
- Test context integration
- Test form submissions

### E2E Tests
- Test complete user journeys
- Test critical paths
- Test responsive behavior

---

## Deployment Checklist

- [ ] Run production build (`npm run build`)
- [ ] Test production build locally (`npm run preview`)
- [ ] Verify all routes work
- [ ] Check responsive design
- [ ] Verify charts render correctly
- [ ] Test data persistence
- [ ] Check browser console for errors
- [ ] Verify SEO meta tags
- [ ] Test on multiple browsers
- [ ] Deploy to hosting service

---

## Future Improvements

1. **Add TypeScript** for type safety
2. **Implement Testing** with Jest and React Testing Library
3. **Add Backend** with Node.js/Express
4. **Implement Authentication** with JWT
5. **Add Cloud Sync** for multi-device access
6. **Progressive Web App** features
7. **Dark Mode** support
8. **Data Export** (PDF, Excel)
9. **AI Insights** integration
10. **Mobile Apps** (React Native)

---

## Resources

- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Recharts Documentation](https://recharts.org/)
- [Vite Documentation](https://vitejs.dev/)

---

**Remember**: Clean code is better than clever code. Write code that your future self will thank you for!
