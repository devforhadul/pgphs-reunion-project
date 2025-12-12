import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase.init";
import type { RegistrationData } from "@/types";
import {
  formatISOToDateTime,
  maskPhoneNumber,
  sortRegistrationsByLatest,
} from "@/utils/helpers";

export const PaymentDashboard = () => {
  // const location = useLocation();
  const [users, setUsers] = useState<RegistrationData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Show success message if coming from payment
  useEffect(() => {
    // Firestore collection ref
    const ref = collection(db, "pgphs_ru_reqisterd_users");

    // 🔥 Realtime listener
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const allData: RegistrationData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as RegistrationData),
      }));

      // তোমার sorting function 그대로 রাখলাম
      setUsers(sortRegistrationsByLatest(allData));
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  const filteredPayments = useMemo(() => {
    return users.filter((payment) => {
      const matchesSearch =
        payment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.phone.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [users, searchTerm]);

  // const totalAmount = useMemo(() => {
  //   return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  // }, [filteredPayments]);

  const visiblePayments = filteredPayments.filter(
    (p) => p.payment.status === "paid" || p.payment.status === "verifying"
  );

  type Status = "paid" | "verifying" | "unPaid";

  const getStatusBadge = (statuses: Status[] | Status) => {
    const styles: Record<Status, string> = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      verifying:
        "bg-green-100 text-blue-800 dark:bg-blue-900/30 dark:text-green-400",
      unPaid: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    const statusArray = Array.isArray(statuses) ? statuses : [statuses];

    return (
      <>
        {statusArray.map((status) => (
          <span
            key={status}
            className={`px-4 py-2 text-xs font-semibold rounded-full ${styles[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View all payment transactions and statistics
            </p>
          </div>

          {/* Summary states */}
          <div className="mt-4 md:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wait For Payment
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter((r) => r.payment.status === "unPaid").length}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed Registration
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {users.filter((p) => p.payment.status === "paid").length}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Collected
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {users.reduce((sum, item) => {
                    if (item.payment?.status === "paid") {
                      return sum + (item.payment.amount || 0);
                    }
                    return sum;
                  }, 0)}{" "}
                  Tk
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search by name or Phone number.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No payments found matching your criteria.
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Registration ID ®
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {visiblePayments.map((payment, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {/* {payment.id.slice(0, 8)}... */}
                        {payment.reg_id ? payment.reg_id : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.fullName}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {payment.payment.amount} Tk
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg text-gray-500 dark:text-gray-400 capitalize">
                        {maskPhoneNumber(payment?.phone)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {/* {payment.payment.paidAt
                          ? formatISOToDateTime(payment.payment.paidAt)
                          : formatISOToDateTime(payment.regAt)} */}
                        {formatISOToDateTime(
                          payment.payment.paidAt ??
                            payment.regAt ??
                            new Date().toISOString()
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
