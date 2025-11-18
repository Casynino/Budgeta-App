# 💰 Budgeta - Personal & Business Finance Super App

A comprehensive finance management web application built with React, TailwindCSS, and modern web technologies.

![Budgeta](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

Budgeta is a powerful finance management platform that allows users to track all areas of their financial life in one place. From income and expenses to investments and debts, Budgeta provides a comprehensive solution for personal and business finance management.

## ✨ Features

### 🟢 MVP Features (Currently Implemented)

- **📊 Dashboard**
  - Financial health score
  - Total income, expenses, and savings overview
  - Interactive charts (Income vs Expense trends, Category breakdown)
  - Budget usage tracking
  - Recent transactions list

- **💸 Transactions Management**
  - Add, edit, and delete transactions
  - Categorize income and expenses
  - Search and filter functionality
  - Real-time balance calculations
  - Transaction history grouped by date

- **📝 Budget Planner**
  - Set monthly budgets by category
  - Track spending against budget limits
  - Visual progress bars
  - Overspending alerts
  - Budget usage analytics

- **💳 Debt Tracker**
  - Two-tab system: "I Owe" and "Owed to Me"
  - Track person/business name, amount, due date
  - Payment tracking (partial and full)
  - Status badges (Paid, Pending, Overdue, Partial)
  - Due date alerts and overdue tracking
  - Notes and categorization

### 🟡 Coming Soon

- Investment Tracker (Stocks, Crypto, Local investments)
- Recurring Payments (Subscriptions, Bills, Rent)
- Business Finance Mode
- Goals & Wishlist
- Analytics & Insights
- AI-Generated Financial Tips
- Export Reports (PDF, Excel)

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18.2 with Vite
- **Styling**: TailwindCSS 3.3
- **Charts**: Recharts 2.10
- **Icons**: Lucide React
- **Routing**: React Router DOM 6.20
- **Date Handling**: date-fns 2.30
- **State Management**: Context API

### Folder Structure

```
budgeta-app/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── common/        # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── charts/        # Chart components
│   │   │   ├── BarChart.jsx
│   │   │   ├── LineChart.jsx
│   │   │   └── PieChart.jsx
│   │   └── layout/        # Layout components
│   │       ├── Layout.jsx
│   │       ├── Header.jsx
│   │       └── Sidebar.jsx
│   ├── pages/             # Feature pages
│   │   ├── Dashboard/
│   │   ├── Transactions/
│   │   ├── Budget/
│   │   ├── Debts/
│   │   ├── Investments/
│   │   ├── Recurring/
│   │   ├── Business/
│   │   ├── Goals/
│   │   └── Settings/
│   ├── context/           # Global state management
│   │   └── FinanceContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   └── useFinancialSummary.js
│   ├── utils/             # Helper functions
│   │   └── helpers.js
│   ├── data/              # Mock data
│   │   └── mockData.js
│   ├── constants/         # Constants and configs
│   │   └── categories.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd budgeta-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📱 Features in Detail

### Financial Health Score

An intelligent scoring system (0-100) based on:
- Income vs Expense ratio (30 points)
- Savings rate (25 points)
- Debt ratio (25 points)
- Budget adherence (20 points)

### Transaction Categories

**Income Categories:**
- Salary
- Freelance
- Business
- Investment Returns
- Gift
- Other Income

**Expense Categories:**
- Food & Dining
- Transport
- Bills & Utilities
- Shopping
- Entertainment
- Health & Fitness
- Education
- Rent/Mortgage
- Subscriptions
- Business Expense
- Other

### Data Persistence

All data is stored in the browser's localStorage, ensuring your financial data remains private and accessible offline.

## 🎨 Design Philosophy

- **Clean & Modern**: Minimal UI with focus on usability
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive**: Easy navigation with clear visual hierarchy
- **Accessible**: Follows WCAG guidelines for accessibility

## 🔐 Security & Privacy

- All data is stored locally in your browser
- No server-side storage or data transmission
- Complete privacy and control over your financial data

## 🛣️ Roadmap

### Phase 1 (MVP) ✅
- [x] Dashboard with Financial Health Score
- [x] Income & Expense Tracking
- [x] Budget Planner
- [x] Debt Tracker

### Phase 2 (In Development)
- [ ] Investment Tracker
- [ ] Recurring Payments
- [ ] Goals & Wishlist
- [ ] Advanced Analytics

### Phase 3 (Future)
- [ ] Business Finance Mode
- [ ] Multi-currency Support
- [ ] Data Export (PDF, Excel)
- [ ] Cloud Sync (Optional)
- [ ] Mobile Apps (iOS, Android)
- [ ] AI-powered Financial Insights

## 📊 Future Backend Integration

See `DATABASE_SCHEMA.md` for proposed database structure when adding backend support.

## 🤝 Contributing

This is a personal/client project. For collaboration inquiries, please reach out directly.

## 📄 License

MIT License - See LICENSE file for details.

## 👨‍💻 Developer

Built with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI Framework: [TailwindCSS](https://tailwindcss.com/)

---

**Note**: This is the MVP version. More features are coming soon!
