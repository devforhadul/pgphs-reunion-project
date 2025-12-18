import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { RegistrationData } from "../types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.init";
import bkash_qr_9607 from "../assets/qr_code/bkash_qr_9607.jpg";
import bkash_logo from "../assets/bkash_logo.png";

export const CartPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<RegistrationData | null>();
  const [paymentMethod, setPaymentMethod] = useState<string>("bkash-manual");
  const [bkashNumber, setBkashNumber] = useState<string>("");
  const [bkashTrxId, setBkashTrxId] = useState<string>("");
  // const [nagadNumber, setNagadNumber] = useState<string>("");
  // const [nagadTrxId, setNagadTrxId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { id: paramsID } = useParams();

  const COLLECTION_NAME = "pgphs_ru_reqisterd_users";
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get specific user
  useEffect(() => {
    if (!paramsID || typeof paramsID !== "string") {
      return;
    }

    const fetchReg = async () => {
      // setIsProcessing(true);
      // setError(null);
      const collectionName = "pgphs_ru_reqisterd_users";

      try {
        // 1. ডকুমেন্ট রেফারেন্স তৈরি (এখানেই doc ব্যবহার হয়)
        const docRef = doc(db, collectionName, paramsID);

        // 2. getDoc() দিয়ে ডাটা ফেচ করা
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 3. ডাটা এক্সট্র্যাক্ট করা এবং State এ সেভ করা
          const fetchedData = docSnap.data() as RegistrationData;
          setUser(fetchedData); // ✅ State আপডেট
        } else {
          setUser(null);
          // setErrors(`No document found with ID: ${paramsID}`);
        }
      } catch (e) {
        setUser(null);
        console.log(e);
        alert("Something wrong! Try again later or contact technical support.");
      }
    };

    fetchReg();
  }, [paramsID]);

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === "bkash-manual") {
      if (!bkashNumber.trim()) {
        newErrors.bkashNumber = "bKash number is required";
      } else if (!/^01[3-9]\d{8}$/.test(bkashNumber.replace(/\s/g, ""))) {
        newErrors.bkashNumber =
          "Please enter a valid bKash number (01XXXXXXXXX)";
      }
      if (!bkashTrxId.trim()) {
        newErrors.bkashTrxId = "Transaction ID is required";
      }
    }
    // else if (paymentMethod === "nagad-manual") {
    //   if (!nagadNumber.trim()) {
    //     newErrors.nagadNumber = "Nagad number is required";
    //   } else if (!/^01[3-9]\d{8}$/.test(nagadNumber.replace(/\s/g, ""))) {
    //     newErrors.nagadNumber =
    //       "Please enter a valid Nagad number (01XXXXXXXXX)";
    //   }
    //   if (!nagadTrxId.trim()) {
    //     newErrors.nagadTrxId = "Transaction ID is required";
    //   }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setIsProcessing(true);

    let payNumber = "";
    let trxId = "";

    if (!paramsID) {
      alert("Error: Registration ID is missing.");
      setIsProcessing(false);
      return;
    }

    if (paymentMethod === "bkash-manual") {
      payNumber = bkashNumber;
      trxId = bkashTrxId;
    }
    //  else if (paymentMethod === "nagad-manual") {
    //   payNumber = nagadNumber;
    //   trxId = nagadTrxId;
    // }
    else {
      console.error("Invalid payment method selected.");
      setIsProcessing(false);
      return;
    }

    const docRef = doc(db, COLLECTION_NAME, paramsID);

    try {
      await updateDoc(docRef, {
        "payment.status": "verifying",
        "payment.transactionId": trxId,
        "payment.paidAt": new Date().toISOString(),
        "payment.paymentMethod": paymentMethod,
        "payment.isManual": true,
        "payment.paymentNumber": payNumber,
      });

      navigate(`/confirmation/`);
    } catch (error) {
      console.error("Error during payment update:", error);
      alert("Update failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const [copied, setCopied] = useState(false);
  const number = "01910179607";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBkashAuto = async () => {
    setIsLoading(true);
    if (!paramsID) {
      return alert("User not found. Please login again.");
    }

    const userPayInfo = {
      payerReference: user?.fullName,
      callbackURL: `https://pgmphs-reunion.com/confirmation?user=${paramsID}`,
      amount: "1",
      merchantInvoiceNumber: `PGMPHS-Reunion2026`,
    };

    try {
      const initBkash = await fetch(
        "https://bkash-pgw-pgmphs-reunion.vercel.app/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userPayInfo),
        }
      );

      const data = await initBkash.json();
      if (data.bkashURL) {
        setIsLoading(false);
        window.location.href = data.bkashURL;
      } else {
        setIsLoading(false);
        alert("Payment URL not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Complete Your Payment
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Review your registration details and complete the payment to confirm
          your attendance.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Registration Summary
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Name
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    phone number
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Graduation Year
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.graduationYear}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Address
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.address}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Registration Fee:
                    </span>
                    <div className="text-right">
                      <span className="font-medium text-gray-900 dark:text-white block">
                        {user?.payment?.amount} Tk
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <div className="text-right">
                      <span className="text-primary-600 dark:text-primary-400 block">
                        {user?.payment?.amount} Tk
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Bkash onine payment */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash-auto")}
                    className={`p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                      paymentMethod === "bkash-auto"
                        ? "border-green-800 bg-primary-50 dark:bg-primary-900/20"
                        : "border-g-300 dark:border-gray-600 hover:border-primary-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      bKash Gateway
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Auto Payment
                    </p>
                  </button>

                  {/* Bkash manual payment */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash-manual")}
                    className={`p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                      paymentMethod === "bkash-manual"
                        ? "border-green-800 bg-primary-50 dark:bg-primary-900/20"
                        : "border-g-300 dark:border-gray-600 hover:border-primary-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      bKash
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Manual Payment
                    </p>
                  </button>

                  {/* Nagad */}
                  {/* <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad-manual")}
                    className={`p-4 border-2 rounded-lg transition-colors cursor-pointer ${
                      paymentMethod === "nagad-manual"
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-primary-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      Nagad
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Manual Payment
                    </p>
                  </button> */}
                </div>
              </div>

              {paymentMethod === "bkash-manual" && (
                <div className="space-y-4">
                  <div className="max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-[#e2136e] p-4 text-white flex justify-between items-center">
                      <h3 className="font-bold text-lg">Send Money</h3>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">
                        Personal
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        আপনার bKash অ্যাপ থেকে নিচের নাম্বারে{" "}
                        <strong>Send Money</strong> করুন। এরপর ট্রানজ্যাকশন আইডি
                        (TxnID) ফর্মটিতে দিন।
                      </p>

                      <div className="flex flex-col sm:flex-row gap-5 items-center">
                        {/* QR Code Block */}
                        <div className="shrink-0 p-2 border border-dashed border-pink-300 rounded-lg bg-pink-50">
                          <img
                            src={bkash_qr_9607}
                            alt="bKash QR"
                            className="w-24 h-24 object-contain"
                          />
                        </div>

                        {/* Number & Copy Section */}
                        <div className="flex-1 w-full">
                          <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                            bKash Personal Number
                          </p>

                          <div className="relative group">
                            <div className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg p-1 px-2  transition-colors">
                              <span className="font-mono text-lg font-bold text-gray-800 tracking-wider">
                                {number}
                              </span>

                              <button
                                onClick={handleCopy}
                                className="ml-3 p-2 rounded-md bg-white border border-gray-200 hover:bg-[#e2136e] hover:text-white hover:border-[#e2136e] transition-all group-hover:shadow-sm cursor-pointer"
                                title="Copy Number"
                              >
                                {copied ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>

                            {/* Copied Tooltip */}
                            {copied && (
                              <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow transition-opacity">
                                Copied!
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="bkashNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your bKash Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="bkashNumber"
                      value={bkashNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 11) value = value.slice(0, 11);
                        setBkashNumber(value);
                        if (errors.bkashNumber) {
                          setErrors((prev) => ({ ...prev, bkashNumber: "" }));
                        }
                      }}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.bkashNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.bkashNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.bkashNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="bkashTrxId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Transaction ID (TrxID){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bkashTrxId"
                      value={bkashTrxId}
                      onChange={(e) => {
                        setBkashTrxId(e.target.value.toUpperCase());
                        if (errors.bkashTrxId) {
                          setErrors((prev) => ({ ...prev, bkashTrxId: "" }));
                        }
                      }}
                      placeholder="Enter Transaction ID"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.bkashTrxId ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.bkashTrxId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.bkashTrxId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {paymentMethod === "bkash-auto" && (
                <div className="space-y-4 mt-4">
                  {/* Main Card */}
                  <div className="border border-[#E2136E]/30 bg-pink-50/50 rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
                    {/* bKash Logo */}
                    <div className="w-24 h-auto mb-3">
                      {/* bKash logo image - Replace with your actual asset */}
                      <img
                        src={bkash_logo}
                        alt="bKash Logo"
                        className="w-full object-contain"
                      />
                    </div>

                    <h3 className="text-gray-800 font-semibold text-lg">
                      Pay with bKash
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 mb-6 max-w-xs">
                      You will be redirected to the secure bKash gateway.
                    </p>

                    {/* Payment Button */}
                    <button
                      // disabled={true}
                      className="w-full max-w-sm bg-[#E2136E] hover:bg-[#c40f5f] text-white font-bold py-3 px-4 rounded shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => handleBkashAuto()}
                    >
                      {/* <span>Proceed to bKash</span> */}
                      {!isLoading && <span>bKash pay</span>}
                      {/* The Spinner */}
                      {isLoading && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                    </button>

                    {/* Security Footer */}
                    <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3 text-green-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 12c0 5.285 3.04 9.883 7.42 12.015a.75.75 0 00.66 0C14.71 21.883 17.75 17.285 17.75 12c0-2.34-.67-4.52-1.845-6.38a12.74 12.74 0 00-3.389-3.45zM10.25 16.25l-3-3a.75.75 0 011.06-1.06l1.94 1.94 4.19-4.19a.75.75 0 111.06 1.06l-4.72 4.72a.75.75 0 01-1.06 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>100% Secure Payment</span>
                    </div>
                  </div>

                  {/* Disclaimer Text */}
                  <p className="text-xs text-gray-400 text-center">
                    By clicking above, you agree to the{" "}
                    <span className="underline cursor-pointer hover:text-[#E2136E]">
                      Terms & Conditions
                    </span>
                    .
                  </p>
                </div>
              )}

              {paymentMethod === "bkash-auto" || (
                <div className="flex space-x-4">
                  {/* <button
                  type="button"
                  onClick={() => navigate("/registration")}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                >
                  Back
                </button> */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay ${user?.payment?.amount} Tk`}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
