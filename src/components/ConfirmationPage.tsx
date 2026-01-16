import { db } from "@/firebase/firebase.init";
import type { PaymentResponseType, RegistrationData } from "@/types";
import { collection, doc, runTransaction } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { LoadingOverlay } from "./shared/LoadingOverlay";

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
  const navigate = useNavigate();
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");
  // const signature = searchParams.get("signature");
  const userId = searchParams.get("user");
  const [updatedUser, setUpdatedUser] = useState<RegistrationData | null>(null);
  const executionStarted = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentResponseType | null>(
    null
  );

  useEffect(() => {
    if (status === "failure") {
      setLoading(false);
      return;
    }
    if (!paymentID || executionStarted.current) return;
    const executePayment = async () => {
      if (!paymentID) {
        console.log("Missing userId or paymentID");
        return;
      }
      executionStarted.current = true;

      const reunionUser = JSON.parse(
        localStorage.getItem("reunionUser") || "{}"
      );

      if (!reunionUser?.fullName || !reunionUser?.phone) {
        throw new Error("Invalid registration data");
      }

      setLoading(true);

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
        const bkashData = await res.json();
        if (bkashData.statusCode !== "0000") {
          throw new Error(bkashData.statusMessage || "Payment failed at bKash");
        }
        setPaymentInfo(bkashData);
        // Code for save in db
        const usersRef = collection(db, "pgphs_ru_reqisterd_users");
        const counterRef = doc(db, "counters", "registrationCounter");

        // auto generated user doc id
        const userRef = doc(usersRef);

        let savedData: RegistrationData = null!;

        await runTransaction(db, async (transaction) => {
          // 1️⃣ counter read
          const counterSnap = await transaction.get(counterRef);

          let current = 0;

          if (counterSnap.exists()) {
            current = counterSnap.data().current ?? 0;
          }

          // 2️⃣ calculation
          const newCounter = current + 1;

          // 3️⃣ serial generate
          const serial = `PGMPHS-${newCounter.toString().padStart(4, "0")}`;

          // 4️⃣ user insert
          savedData = {
            ...reunionUser,
            reg_id: serial,
            regAt: new Date().toISOString(),
            payment: {
              ...reunionUser.payment,
              status: "paid",
              transactionId: bkashData.trxID,
              paidAt: new Date().toISOString(),
              paymentMethod: "bkash-auto",
              isManual: false,
              paymentNumber: bkashData.payerAccount,
            },
          };

          transaction.set(userRef, savedData);

          // 5️⃣ counter update / create
          if (counterSnap.exists()) {
            transaction.update(counterRef, { current: newCounter });
          } else {
            transaction.set(counterRef, { current: newCounter });
          }
        });

        setUpdatedUser(savedData);

        setLoading(false);
        Swal.fire({
          title: "Payment Successful!",
          icon: "success",
          draggable: true,
        });

        // 4️⃣ Send confirmation SMS
        const smsBody = [
          `Congrats ${savedData.fullName},`,
          `Your PGPHS Reunion 2026 registration is confirmed.`,
          `Keep your virtual card for entry.`,
          `Check status: https://pgmphs-reunion.com/check-status?n=${savedData.phone}`,
        ].join("\n");

        const smsRes = await fetch(
          "https://modern-hotel-booking-server-nine.vercel.app/send-sms",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: savedData.phone, message: smsBody }),
          }
        );

        const smsData = await smsRes.json();
        console.log(smsData);

        // setIsProcessing(false);
      } catch (err) {
        console.error("Payment processing error:", err);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong during payment. Please contact support",
          icon: "error",
        });
        executionStarted.current = false;
      } finally {
        setLoading(false);
      }
    };

    executePayment();
  }, [userId, paymentID, status]);

  const isSuccess = status === "success";
  const isFailure = status === "failure";
  const isCancel = status === "cancel";

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {loading && <LoadingOverlay text="Payment Processing..." />}
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-8 sm:p-10 flex flex-col items-center text-center">
            {/* Status Icon */}
            <div
              className={`flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                isSuccess
                  ? "bg-green-100 text-green-600"
                  : isFailure
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {isSuccess && (
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {isFailure && (
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {!isSuccess && !isFailure && (
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isSuccess
                ? "Payment Successful"
                : isFailure
                ? "Payment Failed"
                : "Payment Cancelled"}
            </h1>

            <div className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              {isSuccess && (
                <p>
                  Your payment has been completed successfully. Your order is
                  now being processed.
                </p>
              )}
              {isFailure && (
                <div className="space-y-1">
                  <p className="font-semibold text-red-500">
                    Reason: Transaction Declined
                  </p>
                  <p>
                    Your payment could not be completed. This might be due to
                    incorrect card details, insufficient funds, or a bank
                    rejection.
                  </p>
                </div>
              )}
              {isCancel && (
                <div className="space-y-1">
                  <p className="font-semibold text-amber-500">
                    Reason: User Aborted
                  </p>
                  <p>
                    The transaction was cancelled by the user. No funds have
                    been deducted from your account.
                  </p>
                </div>
              )}
            </div>

            {/* Details Section - Only show on Success */}
            {paymentInfo?.statusCode === "0000" && (
              <div className="w-full mb-8 p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 space-y-4">
                {/* Transaction ID */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-3">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Transaction ID
                  </span>
                  <span className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-200">
                    {paymentInfo?.trxID}
                  </span>
                </div>

                {/* Payment Amount */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-3">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Payment Amount
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {paymentInfo?.amount}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-3">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Payment Method
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    bKash
                  </span>
                </div>

                {/* Payer Number */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-3">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Payer Number
                  </span>
                  <span className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-200">
                    {paymentInfo?.payerAccount}
                  </span>
                </div>

                {/* Payment Date */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Payment Date
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {paymentInfo?.paymentExecuteTime}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() =>
                navigate(`https://pgmphs-reunion.com/check-status?n=${userId}`)
              }
              className={`w-full py-4 px-6 rounded-2xl text-white font-bold shadow-lg transition-all active:scale-[0.98] ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700 shadow-green-200/50"
                  : isFailure
                  ? "bg-red-600 hover:bg-red-700 shadow-red-200/50"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-200/50"
              }`}
            >
              {isSuccess
                ? "Get Virtual Pass"
                : isFailure
                ? "Retry Payment"
                : "Start Again"}
            </button>

            {/* {isSuccess && (
              <button
                onClick={() => window.print()}
                className="mt-6 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-2 transition-colors"
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Receipt
              </button>
            )} */}
          </div>
        </div>

        {/* Demo Switcher */}
        {/* <div className="mt-10 flex gap-2">
          <button
            onClick={() =>
              navigate(
                "/confirmation?paymentID=PAY-9922&status=success&signature=TXN_8821944"
              )
            }
            className="text-xs px-3 py-1 bg-white border rounded hover:bg-gray-50 shadow-sm"
          >
            Demo Success
          </button>
          <button
            onClick={() =>
              navigate("/confirmation?paymentID=PAY-9922&status=failure")
            }
            className="text-xs px-3 py-1 bg-white border rounded hover:bg-gray-50 shadow-sm"
          >
            Demo Failure
          </button>
          <button
            onClick={() =>
              navigate("/confirmation?paymentID=PAY-9922&status=cancel")
            }
            className="text-xs px-3 py-1 bg-white border rounded hover:bg-gray-50 shadow-sm"
          >
            Demo Cancel
          </button>
        </div> */}

        <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
          Secure payment. For support, contact forhadul75@gmail.com
        </footer>
      </div>

      {/* =============== */}
      <div className="hidden min-h-screen py-8 bg-slate-900 text-white font-sans overflow-hidden flex items-center justify-center relative">
        {loading && <LoadingOverlay text="Payment Processing" />}
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
              আপনার রেজিস্ট্রেশন তথ্য আমাদের কাছে জমা হয়েছে। আপনার পেমেন্ট
              ভেরিফাই হলে আপনাকে এসএমএস এর মাধ্যমে জানিয়ে দেওয়া হবে।
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
                    <strong className="text-white">virtual Pass: </strong>
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
    </>
  );
};
