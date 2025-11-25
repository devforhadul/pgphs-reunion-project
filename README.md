# Alumni Reunion Website

A modern, responsive, and user-friendly alumni reunion website built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Features

- **Registration Form**: Users can fill out a comprehensive registration form with personal details including name, email, phone, graduation year, and address
- **Payment System**: Secure payment processing with support for credit card and PayPal
- **Unique Payment IDs**: Each payment generates a unique identifier for tracking
- **Payment Dashboard**: View all payments with search and filter capabilities
- **Admin Panel**: Complete admin interface for managing users and payments
- **Manual Payment Entry**: Admins can manually add payments that appear in the dashboard

### 🎨 Design Features

- **Modern UI**: Sleek and professional design with smooth transitions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Form Validation**: Comprehensive client-side validation with error messages
- **User-Friendly Experience**: Intuitive navigation and clear feedback

### 🔍 Enhanced Features

- **Search & Filter**: Search payments by name or ID, filter by status and payment method
- **Statistics Dashboard**: View total collected amount, payment counts, and averages
- **Success Notifications**: Visual feedback for successful registrations and payments
- **Data Persistence**: All data is stored in localStorage for demo purposes

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pgphs-reunion-proejct
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── RegistrationForm.tsx
│   ├── CartPage.tsx
│   ├── PaymentDashboard.tsx
│   └── AdminPanel.tsx
├── context/            # React Context for state management
│   └── AppContext.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.ts
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point
```

## Usage

### For Users

1. **Register**: Navigate to the home page and fill out the registration form
2. **Pay**: After registration, you'll be redirected to the payment page
3. **View Dashboard**: Check the payment dashboard to see all transactions

### For Admins

1. **View Users**: Access the Admin Panel to see all registered users
2. **View Payments**: See all payment transactions with detailed information
3. **Add Manual Payment**: Manually add payments for offline transactions

## Routes

- `/` - Registration form
- `/cart` - Payment page
- `/dashboard` - Payment dashboard
- `/admin` - Admin panel

## Data Storage

Currently, all data is stored in browser localStorage. For production use, you would want to integrate with a backend API and database.

## Future Enhancements

- Backend API integration
- Database storage
- Email notifications
- User authentication
- Payment gateway integration (Stripe, PayPal API)
- Export functionality for reports
- Advanced analytics

## License

This project is open source and available under the MIT License.
