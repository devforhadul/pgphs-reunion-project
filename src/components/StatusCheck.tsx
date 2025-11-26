import { db } from "@/firebase/firebase.init";
import type { RegistrationData } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { Link } from "react-router";
import QRCode from "react-qr-code";

export default function StatusCheck() {
  const [phone, setPhone] = useState<string>();
  const [user, setUser] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    // if (!phone.trim()) return;

    setLoading(true);
    setError("");
    setUser(null);
    

    try {
      const q = query(
        collection(db, "pgphs_ru_reqisterd_users"),
        where("phone", "==", phone)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const matchedUser = {
          id: snapshot.docs[0].id,
          ...(snapshot.docs[0].data() as RegistrationData),
        };
        setUser(matchedUser);
      } else {
        setUser(null);
        setError("User not found!!")
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Check Registration Status
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {user && (
        <div>
          {user.payment.status === "completed" ? (
            <h2 className="text-center text-green-700 font-bold text-2xl">
              Congratulation you successfully Complete Registration
            </h2>
          ) : user.payment.status === "pending" ? (
            <h2 className="text-center text-red-700 font-bold text-2xl">
              Complete your payment!!!
            </h2>
          ) : user.payment.status === "verifying" ? (
            <h2 className="text-center text-yellow-700 font-bold text-2xl">
              We are verifying your payment.
            </h2>
          ) : user.payment.status === "failed" ? (
            <h2 className="text-center text-red-950n font-bold text-2xl">
              We don't receive your payment! Please recheck now
            </h2>
          ) : (
            ""
          )}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-7 flex flex-col md:flex-row gap-4 items-center ">
            {/* Left: User Info */}
            <div className="flex-1">
              <p>
                <strong>Reg No:</strong> {user.reg_id}
              </p>
              <p>
                <strong>Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Payment Status:</strong> {user.payment.status}
              </p>
            </div>

            {/* Middle: QR Code Placeholder */}
            {user.payment.status === "completed" && (
              <div className="w-23 h-23 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                {/* Replace with actual QR code later */}
                <span className="text-gray-500 text-sm">
                  <QRCode
                    value="https://pgphs-reunion.com/verify/PGPHS-0015"
                    size={92}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </span>
              </div>
            )}

            {/* Right: Pay Button if pending */}
            {user.payment.status === "pending" && (
              <Link to={`/cart/${user.reg_id}`}>
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer">
                  Pay Now
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
