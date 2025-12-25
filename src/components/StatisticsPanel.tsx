import type { RegistrationData } from '@/types';
import { useMemo, type ReactNode } from 'react';
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaSpinner,
  FaTimesCircle,
  FaUsers,
} from 'react-icons/fa';

interface UsersProps {
  users: RegistrationData[];
}

export default function StatisticsPanel({ users }: UsersProps) {
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const paidUsers = users.filter(
      (user) => user.payment.status === 'paid'
    ).length;

    const unpaidUsers = users.filter(
      (user) => user.payment.status === 'unPaid'
    ).length;

    const verifyingUsers = users.filter(
      (user) => user.payment.status === 'verifying'
    ).length;

    const totalRevenue = paidUsers * 1000;

    return {
      totalUsers,
      paidUsers,
      unpaidUsers,
      verifyingUsers,
      totalRevenue,
    };
  }, [users]);

  const statItems: {
    title: string;
    value: string | number;
    icon: ReactNode ;
    color: string;
  }[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers className="text-4xl text-blue-500" />,
      color: 'bg-blue-100 border-blue-200',
    },
    {
      title: 'Total Paid Users',
      value: stats.paidUsers,
      icon: <FaCheckCircle className="text-4xl text-green-500" />,
      color: 'bg-green-100 border-green-200',
    },
    {
      title: 'Total Unpaid Users',
      value: stats.unpaidUsers,
      icon: <FaTimesCircle className="text-4xl text-red-500" />,
      color: 'bg-red-100 border-red-200',
    },
    {
      title: 'Users Verifying',
      value: stats.verifyingUsers,
      icon: <FaSpinner className="text-4xl text-yellow-500" />,
      color: 'bg-yellow-100 border-yellow-200',
    },
    {
      title: 'Total Revenue (BDT)',
      value: stats.totalRevenue.toLocaleString('en-BD'),
      icon: <FaMoneyBillWave className="text-4xl text-purple-500" />,
      color: 'bg-purple-100 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`p-5 rounded-xl shadow-lg flex items-center justify-between transition-shadow duration-300 hover:shadow-xl border ${item.color}`}
        >
          <div>
            <p className="text-sm font-medium text-slate-600 uppercase">
              {item.title}
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {item.value}
            </p>
          </div>
          <div className="opacity-70">{item.icon}</div>
        </div>
      ))}
    </div>
  );
}
