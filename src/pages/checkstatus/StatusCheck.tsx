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
  CloudDownload,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLocation } from "react-router";

export default function StatusCheck() {
  const [phone, setPhone] = useState<string>(""); // Initialize with empty string for better control
  const [user, setUser] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const initialized = useRef(false);

  // URL থেকে number বের করা
  /*   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const num = params.get("n"); // URL থেকে number
      if (num) {
        setPhone(num); // phone state-এ রাখুন
        handleSearch(num); // page load হতেই search
      }
    }, [location.search]); */

  const handleSearch = async (num?: string) => {
    const phoneNumber = num || phone; // URL number priority, তারপর input

    if (!phoneNumber || phoneNumber.trim() === "") {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setUser(null);

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



  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const num = params.get("n");

    if (!num) return;

    if (!initialized.current) {
      initialized.current = true;
      setPhone(num);
      handleSearch(num);
    }
  }, [location.search]);




  const qrData: string = user?.reg_id
    ? `https://pgphs-reunion.com/verify/${user.reg_id}`
    : "Error";


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
      {loading && <LoadingOverlay text="Searching..." />}
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]"></div>
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* --- Search Card (Input/Action) --- */}
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold  dark:text-white text-black mb-2">
              Registration <span className="text-amber-500">Status</span>
            </h1>
          </div>

          <div className="flex flex-row gap-3 max-w-lg mx-auto items-center">

            <div className="flex-1">
              <Input
                label="Registered Phone Number"
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
              />
            </div>

            <div className="shrink-0">
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="group relative px-6 py-3 rounded-sm cursor-pointer font-semibold text-slate-900 
      bg-linear-to-r from-amber-400 to-amber-500 
      shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
      flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <span className="animate-pulse">Searching...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    Search
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
            <h1 className="text-3xl md:text-4xl font-bold  dark:text-white text-black mb-2">
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
              <AlumniCard ref={cardRef} user={user} qrData={qrData} />
            </div>
            <div className="my-5 text-center">
              <button
                onClick={handleDownloadCard}
                className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isDownloading ? (
                  <Spinner className="size-6">Downloading</Spinner>
                ) : (
                  <span>Download  <CloudDownload className="inline" /></span>
                )}
              </button>
            </div>
          </>
        )}


      </div>
    </div>
  );
}
