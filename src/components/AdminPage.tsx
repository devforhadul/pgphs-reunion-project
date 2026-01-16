import { useState, useEffect, useMemo, Suspense } from "react";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  runTransaction,
  deleteDoc,
  updateDoc,
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
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import StatisticsPanel from "./StatisticsPanel";
import SectionLoader from "./SectionLoader";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EditUserModal } from "./admin/EditUserModal";

// --- Main Component: AdminPage ---
export default function AdminPage() {
  const [users, setUsers] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<RegistrationData | null>(null);

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
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, filterStatus]);

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
    if (newStatus === "delete") {
      Swal.fire({
        title: "Type 'delete' to delete item",
        input: "password",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Delete",
        showLoaderOnConfirm: true,
        preConfirm: async (password) => {
          if (password !== "delete") {
            return Swal.showValidationMessage("Incorrect password!");
          }
          if (!user?.id) {
            return;
          }
          // If password correct, delete the item
          const userRef = doc(db, "pgphs_ru_reqisterd_users", user?.id);
          try {
            await deleteDoc(userRef);
          } catch (error) {
            console.log(error);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "Item deleted successfully!",
          });
        }
      });
    } else {
      Confirm.show(
        `Status Update for ${user.fullName}`,
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
              // 1️⃣ READ PHASE: Shob get age korte hobe
              const userDoc = await transaction.get(userRef);
              if (!userDoc.exists()) throw "User found hoyni!";

              const counterDoc = await transaction.get(counterRef); // Counter-ta agei read kore rakhlam
              const current = counterDoc.data()?.current ?? 0;

              // 2️⃣ LOGIC & WRITE PHASE: If-Else use kore alada update
              if (newStatus === "paid") {
                // --- PAID HOLE ---
                const newCounter = current + 1;
                const serial = `PGMPHS-${newCounter
                  .toString()
                  .padStart(4, "0")}`;

                // Counter update korlam
                transaction.update(counterRef, { current: newCounter });

                // User-er status + reg_id update korlam
                transaction.update(userRef, {
                  "payment.status": "paid",
                  reg_id: serial,
                });

                console.log("Paid logic executed");
              } else {
                // --- UNPAID HOLE (ELSE) ---
                // Shudhu status update hobe, reg_id ba counter-e hat dibo na
                transaction.update(userRef, {
                  "payment.status": newStatus,
                });

                console.log("Unpaid logic executed");
              }
            });

            toast.success(
              `Payment status updated to ${newStatus} with Serial generated!`
            );

            const smsBody = [
              `Congrats ${user.fullName},`,
              `Your PGPHS Reunion 2026 registration is confirmed.`,
              `Keep your virtual card for entry.`,
              `Check status: https://pgmphs-reunion.com/check-status?n=${user.phone}`,
            ].join("\n");

            // 5️⃣ Send SMS if paid
            if (newStatus === "paid") {
              const sendSmsData = {
                phone: user?.phone || "",
                message: smsBody,
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
    }

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

  const exportToCSV = (data: RegistrationData[]) => {
    const sorted = [...data].sort((a, b) =>
      (a.reg_id || "").localeCompare(b.reg_id || "", undefined, {
        numeric: true,
      })
    );

    const rows = sorted.map((item) => ({
      "Registration ID": item.reg_id || "N/A",
      "Full Name": item.fullName,
      Phone: item.phone,
      Email: item.email || "N/A",
      "Graduation Year": item.graduationYear,
      Occupation: item.occupation,
      "T-Shirt Size": item.tShirtSize,
      Photo: item.photo,
      "Payment Status": item.payment.status,
      "Transaction ID": item.payment.transactionId || "N/A",
      Amount: item.payment.amount,
      "Payment Number": item.payment.paymentNumber,
      "Registered At": item.regAt || "N/A",
    }));

    // 1. Convert JSON to CSV string
    const csv = Papa.unparse(rows);

    // 2. Create a blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `registration_user_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: RegistrationData[]) => {
    const doc = new jsPDF();

    // Sorting logic (1 to last)
    const sortedData = [...data].sort((a, b) =>
      (a.reg_id || "").localeCompare(b.reg_id || "", undefined, {
        numeric: true,
      })
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    // --- MAIN HEADER SECTION START ---
    // Main Title
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40); // Dark Gray color
    doc.setFont("helvetica", "bold");
    doc.text("PGMPHS REUNION 2026", doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });

    // Subtitle/Report Name
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Complete Registration Data",
      doc.internal.pageSize.getWidth() / 2,
      22,
      { align: "center" }
    );

    // Date and Time (Right side)
    doc.setFontSize(10);
    doc.text(
      `${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() - 15,
      22,
      { align: "right" }
    );
    // --- MAIN HEADER SECTION END ---

    const tableColumn = ["Reg ID", "Name", "Phone", "SSC Batch"];
    const tableRows = sortedData.map((item) => [
      item.reg_id || "N/A",
      item.fullName,
      item.phone,
      item.graduationYear,
    ]);

    // EIKHANE CHANGE: doc.autoTable er poriborte 'autoTable(doc, ...)' use korun
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      margin: { top: 30 },
      didDrawPage: (dataArg) => {
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${dataArg.pageNumber}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      },
    });

    doc.save(`reunion_registration_data_${Date.now()}.pdf`);
  };

  const handleSaveEdit = async (updatedUser: RegistrationData) => {
    // ১. আইডি চেক এবং টাইপ ন্যারোইং
    if (!updatedUser || !updatedUser.id) {
      toast.error("User ID not found!");
      return;
    }

    try {
      // ২. আইডিটি স্টোর করুন
      const userId = updatedUser.id;

      // ৩. ডাটা কপি করুন এবং অবজেক্ট থেকে 'id' সরাসরি ডিলিট করে দিন
      // এতে কোনো নতুন ভেরিয়েবল তৈরি হবে না, তাই ESLint এরর আসবে না
      const dataToUpdate = { ...updatedUser };
      delete dataToUpdate.id;

      // ৪. Firestore আপডেট
      const userDocRef = doc(db, "pgphs_ru_reqisterd_users", userId);

      await updateDoc(userDocRef, {
        ...dataToUpdate,
      });

      toast.success("User data updated successfully! 🎉");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update user data.");
    }
  };

  return (
    <Suspense fallback={<SectionLoader />}>
      <div className="min-h-screen bg-[#FDFBF7] text-slate-800 pb-20">
        {/* Admin Header */}
        <div className="bg-slate-900 pt-28 pb-10 text-center shadow-lg">
          <h1 className="text-4xl font-bold  text-white">
            <span className="text-amber-500">PGPHS</span> Admin Panel
          </h1>
          <p className="text-slate-400 mt-2">
            Manage Registrations and Payment Status
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-5">
          <StatisticsPanel users={users} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  space-y-8">
          {/* Manual Registration Form */}
          {/* <ManualRegistrationForm fetchUsers={fetchUsers} /> */}

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
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Status
                  </label> */}
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
                {/* ----- */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => exportToCSV(users)}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-1 text-sm font-medium text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    CSV Export
                  </button>

                  <button
                    onClick={() => exportToPDF(users)}
                    className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-1 text-sm font-medium text-white shadow-md transition hover:bg-rose-700 hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    PDF Export
                  </button>
                </div>
                {/* <div>
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
                </div> */}
              </div>

              {/* Table data */}

              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      "Photo",
                      "Name",
                      "SSC Batch",
                      "Mobile Number",
                      "Txn ID",
                      "Payment Number",
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
                        <img src={user.photo} alt="" className="h-20 w-20" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        <span> {user.fullName}</span>
                        <br />
                        <span className="">
                          {user.reg_id ? user.reg_id : "Wait for Payment"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {user.graduationYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-700">
                        {user.payment.transactionId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {user.payment.paymentNumber || "N/A"}
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
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                            title="Edit User"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
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
                          {user.payment.status === "unPaid" && (
                            <button
                              onClick={() => handleUpdateStatus(user, "delete")}
                              disabled={loadingId === user.id}
                              className="text-white bg-red-600 hover:bg-red-700 p-4 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                              title="Set to Canceled"
                            >
                              <MdDeleteForever />
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
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </Suspense>
  );
}
