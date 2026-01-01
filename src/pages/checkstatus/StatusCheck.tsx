import AlumniCard from "@/components/cards/AlumniCard";
import { Card } from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/firebase/firebase.init";
import type { RegistrationData } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toPng } from "html-to-image";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Search,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Link, useLocation } from "react-router";

export default function StatusCheck() {
  const [phone, setPhone] = useState<string>(""); // Initialize with empty string for better control
  const [user, setUser] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [getTicket, setGetTicket] = useState<boolean>(true);
  const location = useLocation();
  // const [number, setNumber] = useState("");
  // const [result, setResult] = useState(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // URL থেকে number বের করা
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const num = params.get("n"); // URL থেকে number
    if (num) {
      setPhone(num); // phone state-এ রাখুন
      handleSearch(num); // page load হতেই search
    }
  }, [location.search]);

  const getStatusDisplay = (status: "paid" | "unPaid" | "verifying") => {
    switch (status) {
      case "paid":
        return {
          banner: "bg-green-500/10 border-green-500/30 text-green-400",
          icon: <CheckCircle className="w-6 h-6 mr-2" />,
          title: "🎉 Registration Complete!",
          message:
            "Your payment has been verified, and your spot is confirmed.",
        };
      case "unPaid":
        return {
          banner: "bg-red-500/10 border-red-500/30 text-red-400",
          icon: <XCircle className="w-6 h-6 mr-2" />,
          title: "⚠️ Payment Pending",
          message:
            "Please complete your payment immediately to confirm registration.",
        };
      case "verifying":
        return {
          banner: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          icon: <Clock className="w-6 h-6 mr-2 animate-spin-slow" />,
          title: "⏳ Verification in Progress",
          message:
            "We are currently verifying your payment. Please check back soon.",
        };
      default:
        return {
          banner: "bg-gray-500/10 border-gray-500/30 text-gray-400",
          icon: <AlertCircle className="w-6 h-6 mr-2" />,
          title: "Unknown Status",
          message: "Could not retrieve your current status.",
        };
    }
  };

  const handleSearch = async (num?: string) => {
    const phoneNumber = num || phone; // URL number priority, তারপর input

    if (!phoneNumber || phoneNumber.trim() === "") {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setUser(null);
    setGetTicket(false);

    try {
      const collectionPath = `pgphs_ru_reqisterd_users`;
      const q = query(
        collection(db, collectionPath),
        where("phone", "==", phoneNumber)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const matchedUser = {
          id: snapshot.docs[0].id,
          ...(snapshot.docs[0].data() as RegistrationData),
        } as RegistrationData;
        setUser(matchedUser);
      } else {
        setUser(null);
        setError(
          "You are not yet registered. Please proceed to the registration page."
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while fetching data. Check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = user?.payment?.status
    ? getStatusDisplay(user.payment.status)
    : null;
  const qrData: string = user?.reg_id
    ? `https://pgphs-reunion.com/verify/${user.reg_id}`
    : "Error";
  const isPaid = user?.payment?.status === "paid";
  const isUnpaid = user?.payment?.status === "unPaid";

  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadCard = useCallback(() => {
    setIsDownloading(true);
    if (cardRef.current === null) {
      return;
    }

    // লোডিং বা গ্লিচ এড়ানোর জন্য একটু ডিলে এবং কনফিগ
    toPng(cardRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${user?.fullName}-card.png`;
        link.href = dataUrl;
        link.click();
        setIsDownloading(false);
      })
      .catch((err) => {
        setIsDownloading(false);
        console.error("Error downloading image:", err);
      });
  }, [cardRef, user?.fullName]);

  return (
    <div className="min-h-screen  dark:bg-slate-900 text-slate-200 font-sans relative overflow-x-hidden pt-10 pb-20">
      {loading && <LoadingOverlay text="Searching..."/>}
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]"></div>
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* --- Search Card (Input/Action) --- */}
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif dark:text-white text-black mb-2">
              Registration <span className="text-amber-500">Status</span>
            </h1>
            <p className="text-slate-900 dark:text-white">
              Enter your phone number to check your confirmation status.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto items-center">
            <div className="relative flex-1 group">
              {/* <input
                type="text"
                placeholder="Enter phone number (e.g., 017...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-3 dark:bg-slate-900/80 border border-slate-600 rounded-xl text-black placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              /> */}
              <Input
                label="Registrad Phone Number"
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-md transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>Searching...</>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Search Status
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}
        </Card>
        {/* --- Search Card (Input/Action) --- */}
        {/* <div className="dark:bg-slate-800/60 backdrop-blur-md bg-[#FAFAFA] rounded-2xl border border-white/30 shadow-sm p-8 mb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif dark:text-white text-black mb-2">
              Registration <span className="text-amber-500">Status</span>
            </h1>
            <p className="text-slate-900 dark:text-white">
              Enter your phone number to check your confirmation status.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Enter phone number (e.g., 017...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-3 dark:bg-slate-900/80 border border-slate-600 rounded-xl text-black placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>Searching...</>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Search Status
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}
        </div>
 */}
        {user?.payment.status === "paid" && (
          <>
            <div className="flex justify-center items-center  p-4">
              <AlumniCard cardRef={cardRef} user={user} qrData={qrData} />
            </div>
            <div className="my-5 text-center">
              <button
                onClick={handleDownloadCard}
                className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isDownloading ? (
                  <Spinner className="size-6">Downloading</Spinner>
                ) : (
                  "Download Virtual Card"
                )}
              </button>
            </div>
          </>
        )}

        {/* --- Result Section --- */}
        {user && statusInfo && (
          <div className="animate-fade-in-up space-y-8">
            {/* 1. Status Message Banner */}
            <div
              className={`p-6 rounded-xl border text-center shadow-lg flex flex-col items-center ${statusInfo.banner}`}
            >
              <div className="flex items-center">
                {statusInfo.icon}
                <h2 className="text-2xl font-bold mb-1">{statusInfo.title}</h2>
              </div>
              <p className="mt-2">{statusInfo.message}</p>
            </div>

            {/* 2. User Info Card */}
            <div className="bg-slate-800 rounded-2xl border border-white/5 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Info Column */}
                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Full Name
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {user.fullName}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5 mt-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase">
                        {user.payment.status === "paid" ? "Reg ID" : "ID"}
                      </p>
                      <p className="text-amber-400 font-mono font-bold text-lg">
                        {user.payment.status === "paid" ? user.reg_id : user.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">
                        Payment Status
                      </p>
                      <p
                        className={`font-bold capitalize text-lg ${
                          isPaid
                            ? "text-green-400"
                            : isUnpaid
                            ? "text-red-400"
                            : "text-amber-400"
                        }`}
                      >
                        {user.payment.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Column */}
                <div
                  id="status-action-container"
                  className="flex flex-col  gap-3 w-full md:w-auto min-w-[200px] mt-4 md:mt-0 text-center"
                >
                  {isPaid && (
                    <>
                      {/* <div className="bg-white p-2 rounded-lg mx-auto md:mx-0 w-32 h-32 flex items-center justify-center shadow-inner">
                        <QRCode
                          value={qrData}
                          size={110}
                          level="L"
                          fgColor="#000000"
                          bgColor="#FFFFFF"
                        />
                      </div> */}
                    </>
                  )}

                  {isUnpaid && (
                    <Link to={`/cart/${user.id}`} className="w-full">
                      <button className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                        <CreditCard className="w-5 h-5" /> Complete Payment
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* 3. The Digital Ticket (Conditional) */}
            {getTicket && isPaid && (
              <div className="animate-fade-in-up mt-8">
                {/* ID added here for html2canvas targeting */}
                <div
                  id="ticket-card"
                  className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-amber-500/50"
                >
                  {/* Left Side (Main Ticket Content) */}
                  <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase rounded tracking-wider">
                          PGPHS Reunion
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded tracking-wider">
                          CONFIRMED
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 font-serif">
                        Official Entry Pass
                      </h3>
                      <p className="text-slate-500 mb-8">
                        This pass grants {user.fullName} full access to the
                        event.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {[
                          "Gala Dinner Buffet",
                          "Alumni T-Shirt (Confirmed)",
                          "Gift Hamper Collection",
                          "Cultural Program Access",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center text-slate-700 font-medium text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-lg min-w-[200px] text-center shadow-lg">
                        {user.fullName}
                      </div>
                    </div>
                  </div>

                  {/* Dotted Divider */}
                  <div className="relative hidden md:flex flex-col items-center justify-center bg-[#FDFBF7]">
                    <div className="w-6 h-6 bg-slate-900 rounded-full -mt-3 absolute top-0"></div>
                    <div className="h-full border-l-2 border-dashed border-slate-300 mx-4 my-6"></div>
                    <div className="w-6 h-6 bg-slate-900 rounded-full -mb-3 absolute bottom-0"></div>
                  </div>

                  {/* Right Side (QR & Reg Info) */}
                  <div className="bg-slate-900 p-8 md:w-72 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5"></div>

                    <div className="bg-white p-3 rounded-xl mb-4 shadow-lg z-10">
                      {/* Functional QR Code component */}
                      <QRCode
                        value={qrData}
                        size={120}
                        level="L"
                        fgColor="#000000"
                        bgColor="#FFFFFF"
                      />
                    </div>

                    <div className="z-10">
                      <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1">
                        Registration ID
                      </p>
                      <p className="text-amber-400 text-2xl font-mono font-bold tracking-wider">
                        {user.reg_id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Print/Download Hint - Moved below the card for cleaner capture */}
                <p className="text-center text-slate-500 mt-4 text-sm">
                  💡 Please download or save this pass for quick access at the
                  gate.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
