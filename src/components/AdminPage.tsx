import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import {
  FaEdit,
  FaCheckCircle,
  FaSpinner,
  FaPlusCircle,
  FaTimesCircle,
  FaClipboardList,
} from "react-icons/fa";
import { db } from "@/firebase/firebase.init";
import type { RegistrationData } from "@/types";


const COLLECTION_NAME = "pgphs_ru_reqisterd_users";

// --- Sub-Component 1: Admin Table for Display and Status Update ---
const AdminTable: React.FC<{
  users: RegistrationData[];
}> = ({ users }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  

  const handleUpdateStatus = async (
    user: RegistrationData,
    newStatus: "completed" | "failed"
  ) => {
    if (loadingId) return;

    // setLoadingId(user.reg_id);
    try {
      const q = query(
        collection(db, "pgphs_ru_reqisterd_users"),
        where("reg_id", "==", user.reg_id)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("User not found");
        return;
      }

      const docRef = snapshot.docs[0].ref;

      await updateDoc(docRef, {
        "payment.status": newStatus,
      });

      alert(`Pyment status successfully update to ${newStatus}`);
      
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-100 overflow-x-auto">
      <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FaClipboardList className="text-amber-500" /> Registered Users Data
      </h3>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Name",
              "Reg Id",
              "Mobile Number",
              "Txn ID",
              "Status",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {users.map((user) => (
            <tr
              key={user.reg_id}
              className="hover:bg-amber-50/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                {user.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {user.reg_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {user.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-700">
                {user.payment.transactionId || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.payment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : user.payment.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.payment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  {user.payment.status == "verifying" && (
                    <button
                      onClick={() => handleUpdateStatus(user, "completed")}
                      disabled={loadingId === user.id}
                      className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-full transition-colors disabled:opacity-50"
                      title="Set to Paid"
                    >
                      {loadingId === user.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaCheckCircle />
                      )}
                    </button>
                  )}
                  {/* {user.paymentStatus !== 'verifying' && ( */}
                  <button
                    onClick={() => handleUpdateStatus(user, "failed")}
                    disabled={loadingId === user.id}
                    className="text-white bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors disabled:opacity-50"
                    title="Set to Canceled"
                  >
                    <FaTimesCircle />
                  </button>
                  {/* )} */}
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
  );
};

// --- Sub-Component 2: Manual Registration Form ---
const ManualRegistrationForm: React.FC<{ fetchUsers: () => void }> = ({
  fetchUsers,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    email: "",
    paymentTxnId: "",
    paymentStatus: "Paid" as "Paid" | "Pending",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...formData,
        createdAt: new Date(),
      });
      alert("নতুন পেমেন্ট তথ্য সফলভাবে যোগ করা হয়েছে।");
      setFormData({
        name: "",
        batch: "",
        email: "",
        paymentTxnId: "",
        paymentStatus: "Paid",
      });
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("ডাটা যোগ করতে ব্যর্থ। কনসোল দেখুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-100">
      <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FaPlusCircle className="text-amber-500" /> Manually Add Payment/User
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            placeholder="Batch (e.g., 2005)"
            required
            className="w-full p-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        <input
          type="text"
          name="paymentTxnId"
          value={formData.paymentTxnId}
          onChange={handleChange}
          placeholder="Payment Txn ID (Optional)"
          className="w-full p-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
        />

        <select
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
          required
          className="w-full p-3 border border-slate-300 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors bg-white"
        >
          <option value="Paid">Status: Paid</option>
          <option value="Pending">Status: Pending</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaEdit />}
          {loading ? "Adding Data..." : "Add Data to Firestore"}
        </button>
      </form>
    </div>
  );
};

// --- Main Component: AdminPage ---
export default function AdminPage() {
  const [users, setUsers] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

      const usersList: RegistrationData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as RegistrationData),
      }));

    //   const usersList = querySnapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   })) as User[];

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

  useEffect(() => {
    fetchUsers();
  }, []);

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
        <ManualRegistrationForm fetchUsers={fetchUsers} />

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
          <AdminTable users={users}  />
        )}
      </div>
    </div>
  );
}
