import { db } from "@/firebase/firebase.init";
import type { RegistrationData } from "@/types";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

// --- Custom SVG Icons ---
const FaCheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path
      fill="currentColor"
      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
    />
  </svg>
);
export const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const paymentID = searchParams.get("paymentID");
  // const status = searchParams.get("status");
  // const signature = searchParams.get("signature");
  const userId = searchParams.get("user");
  // const [isPaid, setIsPaid] = useState<boolean>(false);

  // const [isProcessing, setIsProcessing] = useState(true);
  const [updatedUser, setUpdatedUser] = useState<RegistrationData | null>(null);

  const executionStarted = useRef(false);

  useEffect(() => {
    if (!paymentID || executionStarted.current) return;
    const executePayment = async () => {
      if (!userId || !paymentID) {
        console.log("Missing userId or paymentID");
        return;
      }
      executionStarted.current = true;

      try {
        // 1️⃣ Execute bKash payment via your backend
        const res = await fetch(
          "https://bkash-pgw-pgmphs-reunion.vercel.app/execute",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentID }),
          }
        );
        const data = await res.json();

        console.log("Payment executed successfully:", data.statusMessage);

        // 2️⃣ Firestore transaction → update payment status + serial
        const userRef = doc(db, "pgphs_ru_reqisterd_users", userId);
        const counterRef = doc(db, "counters", "registrationCounter");

        await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          const current = counterDoc.data()?.current ?? 0;
          const newCounter = current + 1;

          const serial = `PGMPHS-${newCounter.toString().padStart(4, "0")}`;

          transaction.update(userRef, {
            "payment.status": "paid",
            "payment.transactionId": data.trxID,
            "payment.paidAt": new Date().toISOString(),
            "payment.paymentMethod": "bkash-auto",
            "payment.isManual": false,
            "payment.paymentNumber": data.payerAccount,
            reg_id: serial,
          });

          transaction.update(counterRef, { current: newCounter });
          toast.success("Payment Success");
        });

        // 3️⃣ Get updated user document
        const updatedSnap = await getDoc(userRef);
        if (!updatedSnap.exists())
          throw new Error("User not found after transaction");
        const userData = updatedSnap.data() as RegistrationData;
        setUpdatedUser(userData);

        // 4️⃣ Send confirmation SMS
        const smsBody = [
          `Congrats ${userData.fullName},`,
          `Your PGPHS Reunion 2026 registration is confirmed.`,
          `Keep your virtual card for entry.`,
          `Check status: https://pgmphs-reunion.com/check-status?n=${userData.phone}`,
        ].join("\n");

        const smsRes = await fetch(
          "https://modern-hotel-booking-server-nine.vercel.app/send-sms",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: userData.phone, message: smsBody }),
          }
        );

        const smsData = await smsRes.json();
        if (smsData.status === "success") {
          console.log(`Confirmation SMS sent to ${userData.fullName}`);
        } else {
          toast.error(smsData?.data?.error_message || "SMS failed");
        }

        // setIsProcessing(false);
      } catch (err) {
        console.error("Payment processing error:", err);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong during payment. Please contact support",
          icon: "error",
        });
        executionStarted.current = false;
      }
    };

    executePayment();
  }, [userId, paymentID]);

  return (
    <div className="min-h-screen py-8 bg-slate-900 text-white font-sans overflow-hidden flex items-center justify-center relative">
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* --- Main Content Card --- */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-amber-500/20 shadow-[0_0_60px_rgba(245,158,11,0.15)] text-center transform transition-all hover:scale-[1.01]">
          {/* Success Icon */}
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-2xl">
              <FaCheckCircle className="text-white text-5xl drop-shadow-md" />
            </div>
            {/* Decorative particles around icon */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-200 rounded-full animate-bounce delay-150"></div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif">
            Thank You!
          </h1>
          {updatedUser?.payment.status === "paid" ? (
            " ✓ Payment completed successfully! Your registration is confirmed."
          ) : (
            <p className="text-xl text-amber-400 font-medium mb-6">
              Registration Submitted Successfully
            </p>
          )}

          {/* {isPaid && (
            // ? " ✓ Payment completed successfully! Your registration is confirmed."
            <div className="mb-3">
              <Link
                to={`https://pgmphs-reunion.com/check-status?n=${user?.phone}`}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25 group"
              >
                See pass
                
              </Link>
            </div>
          )} */}
          {/* {showSuccessMessage && ( */}
          {/* <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200">
              ✓ Payment completed successfully! Your registration is confirmed.
              Registration Submitted Successfully
            </p>
          </div> */}
          {/* )} */}
          {/* {isPaid && (
            <p className="text-xl text-amber-400 font-medium mb-6">
              Your number Registration is {}
            </p>
          )} */}

          {/* Download Reg card */}

          <p className="text-slate-300 leading-relaxed mb-10 max-w-lg mx-auto">
            আপনার রেজিস্ট্রেশন তথ্য আমাদের কাছে জমা হয়েছে। আপনার পেমেন্ট ভেরিফাই
            হলে আপনাকে এসএমএস এর মাধ্যমে জানিয়ে দেওয়া হবে।
          </p>

          {/* Summary / Next Steps Box */}
          <div className="bg-slate-900/50 rounded-xl p-6 mb-10 border border-white/5 text-left">
            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
              What's Next?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  1
                </span>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Verification:</strong> আমাদের
                  টিম আপনার পেমেন্ট Txn ID চেক করবে (২৪ ঘন্টার মধ্যে)।
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  2
                </span>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Approval:</strong> পেমেন্ট
                  কনফার্ম হলে আপনি SMS এবং ইমেইল পাবেন।
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  3
                </span>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Vertual Pass:</strong>
                  ড্যাশবোর্ড থেকে আপনার ডিজিটাল এন্ট্রি টিকিট ডাউনলোড করতে
                  পারবেন।
                </p>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25 group"
            >
              Go to Dashboard
              {/* <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> */}
            </Link>

            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-300"
            >
              {/* <FaHome  /> */}
              Back to Home
            </Link>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@pgphsreunion.com"
              className="text-amber-500 hover:underline"
            >
              pgphsalumniassociation@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
