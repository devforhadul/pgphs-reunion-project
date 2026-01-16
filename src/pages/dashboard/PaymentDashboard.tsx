import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase.init";
import type { RegistrationData } from "@/types";
import {
  formatISOToDateTime,
  maskPhoneNumber,
  sortRegistrationsByLatest,
} from "@/utils/helpers";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import {
  Users,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Layers,
} from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import { Link } from "react-router";

export const PaymentDashboard = () => {
  // const location = useLocation();
  const [users, setUsers] = useState<RegistrationData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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

      setLoading(false);
      setUsers(sortRegistrationsByLatest(allData));
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  const filteredPayments = useMemo(() => {
    return users.filter((payment) => {
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        payment.fullName.toLowerCase().includes(searchLower) ||
        payment.phone.toLowerCase().includes(searchLower) ||
        // Graduation Year check (toString use kora hoyeche jate error na hoy)
        payment.graduationYear?.toString().includes(searchLower);

      return matchesSearch;
    });
  }, [users, searchTerm]);

  // const totalAmount = useMemo(() => {
  //   return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  // }, [filteredPayments]);

  const visiblePayments = filteredPayments.filter(
    (p) => p.payment.status === "paid" || p.payment.status === "verifying"
  );

  const yearStats = useMemo(() => {
    const statsMap: Record<string, number> = {};
    users.forEach((item) => {
      statsMap[item.graduationYear] = (statsMap[item.graduationYear] || 0) + 1;
    });
    return Object.entries(statsMap)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [users]);

  const mostActiveYear = useMemo(() => {
    if (yearStats.length === 0) return null;
    return [...yearStats].sort((a, b) => b.count - a.count)[0];
  }, [yearStats]);

  const totalBatches = useMemo(() => {
    return new Set(users.map((item) => item.graduationYear)).size;
  }, [users]);

  return (
    <div className="min-h-screen max-w-7xl bg-[#F8FAFC] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading && <LoadingOverlay />}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        <StatsCard
          title="Total Registrations"
          value={users.length}
          icon={<Users size={24} />}
          trend="+12% this week"
          color="blue"
        />
        <StatsCard
          title="Most Active Batch"
          value={mostActiveYear?.year || "N/A"}
          icon={<TrendingUp size={24} />}
          trend={`${mostActiveYear?.count || 0} participants`}
          color="purple"
        />
        <StatsCard
          title="Total Batches Reg."
          value={`${totalBatches}`}
          icon={<Layers size={24} />}
          color="purple"
        />
        <StatsCard
          title="Online Collected"
          value={`৳${
            users.filter((d) => d.payment.status === "paid").length * 1000
          }`}
          icon={<CreditCard size={24} />}
          color="green"
        />
      </section>

      {/* Search and Filters */}
      {/* <div className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search by name or number or batch no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div> */}

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Recent Registrations
            </h2>
            <p className="text-sm text-slate-500">
              Search and manage alumni list
            </p>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or number or batch no..."
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Alumnus
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Get Photo Card
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* <img src={item.photo} className="w-9 h-9 rounded-full object-cover" alt="" /> */}
                      <div>
                        <p className="text-sm font-bold text-slate-800 ">
                          {item.fullName}
                        </p>
                        <p className="text-xs text-slate-500">{item.reg_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {item.graduationYear}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.payment.status === "paid" ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                        <CheckCircle2 size={14} /> Complete Registration
                      </span>
                    ) : item.payment.status === "verifying" ? (
                      <span className="flex items-center gap-1.5 text-orange-500 text-xs font-bold">
                        <Clock size={14} /> Verifying
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-500 text-xs font-bold">
                        <XCircle size={14} /> Unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`https://aura-card.creativeshop.store/frame/3?photo=${item.photo}&n=${item.fullName}&b=${item.graduationYear}`}
                    >
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-bold cursor-pointer">
                        Photocard{"  "}
                        <span>
                          <ExternalLink size={20} className="inline" />
                        </span>
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                <button className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  View All {users.length} Alumni
                </button>
             </div> */}
      </div>

      {/* Payments Table */}
      <div className=" hidden overflow-x-auto">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ">
                  Registration ID ®
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mobile Number
                </th>

                <th className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
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
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.fullName
                        ?.toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {payment.graduationYear}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg text-gray-500 dark:text-gray-400 capitalize">
                      {maskPhoneNumber(payment?.phone)}
                    </div>
                  </td>
                  <td className="hidden px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {payment.payment.status === "paid" && (
                      <span className="bg-green-100 py-1.5 px-3 rounded-2xl text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Confirmed Registration
                      </span>
                    )}
                    {payment.payment.status === "verifying" && (
                      <span className="bg-green-100 py-1.5 px-3 rounded-2xl text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Verifying Payment
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
