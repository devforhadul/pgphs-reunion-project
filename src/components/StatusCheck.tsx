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
  const [getTicket, setGetTicket] = useState<boolean>(false);

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
        setError("User not found!!");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
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
          {/* Ticket */}
          {getTicket === true && (
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
              {/* Left Side (Main) */}
              <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-100 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase rounded">
                      General
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded">
                      Limited Seats
                    </span>
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-2">
                    Reunion Entry Pass
                  </h3>
                  <p className="text-slate-500 mb-8">
                    Full access to the event, dinner, and alumni kit.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Exclusive Alumni T-Shirt",
                      "Gala Dinner Buffet",
                      "Gift Hamper",
                      "Cultural Program Access",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center text-slate-700 font-medium"
                      >
                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className="uppercase inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors w-full md:w-auto text-center"
                  >
                    Forhaudul islam
                  </Link>
                </div>
              </div>

              {/* Dotted Divider */}
              <div className="relative hidden md:flex flex-col items-center justify-center">
                <div className="w-8 h-8 bg-[#FDFBF7] rounded-full -mt-4"></div>
                <div className="h-full border-l-2 border-dashed border-slate-300 mx-4"></div>
                <div className="w-8 h-8 bg-[#FDFBF7] rounded-full -mb-4"></div>
              </div>

              {/* Right Side (Visual/QR placeholder) */}
              <div className="bg-slate-900 p-8 md:w-64 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                <div className="w-24 h-24 bg-white p-2 rounded-lg mb-4">
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-400 text-center leading-tight">
                    <QRCode
                      value="https://pgphs-reunion.com/verify/PGPHS-0015"
                      size={96}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                  Registration NO
                </p>
                <p className="text-white text-2xl font-bold">{user.reg_id}</p>
              </div>
            </div>
          )}

          {/* status mess */}
          <div className="mt-5">
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
          </div>

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
              <>
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
                <div>
                  <button
                    onClick={() => setGetTicket(!getTicket)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer"
                  >
                    See pass
                  </button>
                </div>
              </>
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
