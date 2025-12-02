import { useState, useEffect, useMemo } from "react";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import {
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
  FaClipboardList,
} from "react-icons/fa";
import { db } from "@/firebase/firebase.init";
import type { RegistrationData } from "@/types";
import { sortRegistrationsByLatest } from "@/utils/helpers";

const COLLECTION_NAME = "pgphs_ru_reqisterd_users";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import toast from "react-hot-toast";

// --- Main Component: AdminPage ---
export default function AdminPage() {
  const [users, setUsers] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

        const usersList: RegistrationData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as RegistrationData),
        }));
        setUsers(usersList);
      } catch (err) {
        console.error("Firestore fetch error:", err);
        setError(
          "Failed to load data from Firestore. Check console for details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter Users
  const filteredPayments = useMemo(() => {
    return users.filter((payment) => {
      const matchesSearch =
        payment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || payment.payment.status === filterStatus;
      const matchesMethod =
        filterMethod === "all" || payment.payment.status === filterMethod;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [users, searchTerm, filterStatus, filterMethod]);

  /* After status update realtime update */
  useEffect(() => {
    const ref = collection(db, "pgphs_ru_reqisterd_users");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const allData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as RegistrationData),
      }));

      setUsers(sortRegistrationsByLatest(allData));
    });

    return () => unsubscribe();
  }, []);

  // Update Staus
  const handleUpdateStatus = async (
    user: RegistrationData,
    newStatus: string
  ) => {
    if (loadingId) return;

    // setLoadingId(user.id);

    Confirm.show(
      "Status Update Confirmation",
      `Are you sure update to ${newStatus}?`,
      "Yes",
      "No",
      async () => {
        // setLoadingId(user.id);
        try {
          if (!user.id) return toast.error("User not found!");
          const userRef = doc(db, "pgphs_ru_reqisterd_users", user?.id);
          const counterRef = doc(db, "counters", "registrationCounter");

          await runTransaction(db, async (transaction) => {
            // 1️⃣ Read counter
            const counterDoc = await transaction.get(counterRef);
            const current = counterDoc.data()?.current ?? 0;
            const newCounter = current + 1;

            // 2️⃣ Generate serial
            const serial = `PGMPHS-${newCounter.toString().padStart(4, "0")}`;

            // 3️⃣ Update user document: status + serial
            transaction.update(userRef, {
              "payment.status": newStatus,
              reg_id: serial, // merge serial
            });

            // 4️⃣ Update counter
            transaction.update(counterRef, { current: newCounter });
          });

          toast.success(
            `Payment status updated to ${newStatus} with Serial generated!`
          );

          // 5️⃣ Send SMS if paid
          if (newStatus === "paid") {
            const sendSmsData = {
              phone: user?.phone || "",
              message: `Congratulations ${
                user?.fullName || "Guest"
              }\nYour registration for the PGPHS Reunion 2026 has been successfully completed. Keep your virtual registration card to collect your entry pass.`,
            };

            try {
              const res = await fetch(
                "https://modern-hotel-booking-server-nine.vercel.app/send-sms",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(sendSmsData),
                }
              );

              const data = await res.json();
              console.log("SMS response:", data);

              if (data.status === "success") {
                toast.success(`Confirmation SMS sent to ${user.fullName}`);
              } else {
                toast.error(data?.data?.error_message || "SMS failed");
              }
            } catch (err) {
              console.error(err);
              toast.error("SMS sending failed");
            }
          }
        } catch (err) {
          console.error("Transaction failed:", err);
          toast.error("Status update failed");
        } finally {
          setLoadingId(null);
        }
      },
      () => {
        // Clicked No
        console.log("Update cancelled");
      },
      {}
    );

    // Confirm.show(
    //   "Status Update Confirmation",
    //   `Are you sure update to ${newStatus}`,
    //   "Yes",
    //   "No",
    //   async () => {
    //     try {
    //       if (!user.id) {
    //         return "User not found!!";
    //       }
    //       const docRef = doc(db, "pgphs_ru_reqisterd_users", user.id);

    //       await updateDoc(docRef, {
    //         "payment.status": newStatus,
    //       });
    //       toast.success(`Payment status successfully updated to ${newStatus}`);

    //       //const counterRef = doc(db, "counters", "registrationCounter");
    //       // const registrationsRef = collection(db, "pgphs_ru_reqisterd_users");

    //       // For gat counter number

    //       const sendSmsData = {
    //         phone: user?.phone || "",
    //         message: `Congratulations ${
    //           user?.fullName || "Guest"
    //         }\nYour registration for the PGPHS Reunion 2026 has been successfully completed. Keep your virtual registration card to collect your entry pass.`,
    //       };

    //       if (newStatus === "paid") {
    //         try {
    //           const res = await fetch(
    //             "https://modern-hotel-booking-server-nine.vercel.app/send-sms",
    //             {
    //               method: "POST",
    //               headers: { "Content-Type": "application/json" },
    //               body: JSON.stringify(sendSmsData),
    //             }
    //           );

    //           const data = await res.json();

    //           if (data.status === "success") {
    //             toast.success(`Confirmation sms sent to ${user.fullName}`);
    //           }

    //           //               {
    //           //     "status": "success",
    //           //     "data": {
    //           //         "response_code": 1032,
    //           //         "success_message": "",
    //           //         "error_message": "Your ip 100.27.223.141 not Whitelisted. Please whitelist ip from Phonebook"
    //           //     }
    //           // }
    //           console.log("SMS response:", data);
    //         } catch (err) {
    //           console.error(err);
    //           alert("SMS sending failed");
    //         }
    //       }
    //     } catch (error) {
    //       console.error("Error:", error);
    //     } finally {
    //       setLoadingId(null);
    //     }
    //   },
    //   () => {
    //     // if click no
    //   },
    //   {}
    // );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans pb-20">
      {/* Admin Header */}
      <div className="bg-slate-900 pt-28 pb-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold font-serif text-white">
          <span className="text-amber-500">PGPHS</span> Admin Panel
        </h1>
        <p className="text-slate-400 mt-2">
          Manage Registrations and Payment Status
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        {/* Manual Registration Form */}
        {/* <ManualRegistrationForm fetchUsers={fetchUsers} /> */}

        <div className="border-t border-slate-200 pt-8">
          <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">
            Database View
          </h2>
        </div>

        {loading && (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg">
            <FaSpinner className="animate-spin text-amber-500 text-3xl mx-auto mb-3" />
            <p className="text-slate-700">Loading user data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-100 overflow-x-auto">
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FaClipboardList className="text-amber-500" /> Registered Users
              Data
            </h3>
            {/* Search */}
            <div className="mb-6 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Search by name or mobile number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            {/* Filter data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">PAID</option>
                  <option value="verifying">Verifying</option>
                  <option value="unPaid">UNPAID</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Payment Method
                </label>
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Methods</option>
                  <option value="bkash-manual">bKash</option>
                  <option value="nagad-manual">Nagad</option>
                </select>
              </div>
            </div>
            {/* Table data */}
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Name",
                    "Mobile Number",
                    "Reg Id",
                    "Payment Number",
                    "Txn ID",
                    "Status",
                    "Actions",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredPayments.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.reg_id ? user.reg_id : "Wait for Payment"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.payment.paymentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-700">
                      {user.payment.transactionId || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.payment.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : user.payment.status === "unPaid"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.payment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {user.payment.status == "verifying" && (
                          <button
                            onClick={() => handleUpdateStatus(user, "paid")}
                            disabled={loadingId === user.id}
                            className="text-white bg-green-600 hover:bg-green-700 p-4 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                            title="Set to Paid"
                          >
                            {loadingId === user.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheckCircle />
                            )}
                          </button>
                        )}
                        {user.payment.status === "verifying" && (
                          <button
                            onClick={() => handleUpdateStatus(user, "unPaid")}
                            disabled={loadingId === user.id}
                            className="text-white bg-red-600 hover:bg-red-700 p-4 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                            title="Set to Canceled"
                          >
                            <FaTimesCircle />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="p-4 text-center text-slate-500 italic">
                No registered users found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
