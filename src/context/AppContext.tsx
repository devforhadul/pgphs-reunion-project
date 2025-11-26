// import { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';
// import type { User, Payment } from '../types';

// interface AppContextType {
//   users: User[];
//   payments: Payment[];
//   addUser: (user: User) => void;
//   addPayment: (payment: Payment) => void;
//   darkMode: boolean;
//   toggleDarkMode: () => void;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider = ({ children }: { children: ReactNode }) => {
//   const [users, setUsers] = useState<User[]>(() => {
//     const saved = localStorage.getItem('alumniUsers');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [payments, setPayments] = useState<Payment[]>(() => {
//     const saved = localStorage.getItem('alumniPayments');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [darkMode, setDarkMode] = useState<boolean>(() => {
//     const saved = localStorage.getItem('darkMode');
//     return saved ? JSON.parse(saved) : false;
//   });

//   useEffect(() => {
//     localStorage.setItem('alumniUsers', JSON.stringify(users));
//   }, [users]);

//   useEffect(() => {
//     localStorage.setItem('alumniPayments', JSON.stringify(payments));
//   }, [payments]);

//   useEffect(() => {
//     localStorage.setItem('darkMode', JSON.stringify(darkMode));
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   const addUser = (user: User) => {
//     setUsers((prev) => [...prev, user]);
//   };

//   const addPayment = (payment: Payment) => {
//     setPayments((prev) => [...prev, payment]);
//   };

//   const toggleDarkMode = () => {
//     setDarkMode((prev) => !prev);
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         users,
//         payments,
//         addUser,
//         addPayment,
//         darkMode,
//         toggleDarkMode,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error('useApp must be used within an AppProvider');
//   }
//   return context;
// };

