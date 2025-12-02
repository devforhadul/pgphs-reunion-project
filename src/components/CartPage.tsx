
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { RegistrationData } from "../types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.init";
import  bkash_qr_9607 from "../assets/qr_code/bkash_qr_9607.jpg";

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
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  const COLLECTION_NAME = "pgphs_ru_reqisterd_users";

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

      navigate(`/confirmation/${paramsID}`);
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
                  {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">
                      <strong>Instructions:</strong> Send money to our bKash
                      merchant number and enter your bKash number and
                      transaction ID below.
                    </p>
                    <p className="text-blue-700  dark:text-blue-300 text-sm font-bold">
                      Merchant Number: 01984839526
                    </p>
                  </div> */}

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

              {/* {paymentMethod === "rocket-manual" && (
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <p className="text-purple-800 dark:text-purple-200 text-sm mb-2">
                      <strong>Instructions:</strong> Send money to our Rocket
                      merchant number and enter your Rocket number and
                      transaction ID below.
                    </p>
                    <p className="text-purple-700 dark:text-purple-300 text-sm font-bold">
                      Merchant Number: 01984839526
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="rocketNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Rocket Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="rocketNumber"
                      value={rocketNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 11) value = value.slice(0, 11);
                        setRocketNumber(value);
                        if (errors.rocketNumber) {
                          setErrors((prev) => ({ ...prev, rocketNumber: "" }));
                        }
                      }}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.rocketNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.rocketNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.rocketNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="rocketTrxId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Transaction ID (TrxID){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="rocketTrxId"
                      value={rocketTrxId}
                      onChange={(e) => {
                        setRocketTrxId(e.target.value.toUpperCase());
                        if (errors.rocketTrxId) {
                          setErrors((prev) => ({ ...prev, rocketTrxId: "" }));
                        }
                      }}
                      placeholder="Enter Transaction ID"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.rocketTrxId
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.rocketTrxId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.rocketTrxId}
                      </p>
                    )}
                  </div>
                </div>
              )} */}

              {/* {paymentMethod === "nagad-manual" && (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-200 text-sm mb-2">
                      <strong>Instructions:</strong> Send money to our Nagad
                      merchant number and enter your Nagad number and
                      transaction ID below.
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-sm font-bold">
                      Merchant Number: 01984839526
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="nagadNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Nagad Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="nagadNumber"
                      value={nagadNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 11) value = value.slice(0, 11);
                        setNagadNumber(value);
                        if (errors.nagadNumber) {
                          setErrors((prev) => ({ ...prev, nagadNumber: "" }));
                        }
                      }}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.nagadNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.nagadNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.nagadNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="nagadTrxId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Transaction ID (TrxID){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nagadTrxId"
                      value={nagadTrxId}
                      onChange={(e) => {
                        setNagadTrxId(e.target.value.toUpperCase());
                        if (errors.nagadTrxId) {
                          setErrors((prev) => ({ ...prev, nagadTrxId: "" }));
                        }
                      }}
                      placeholder="Enter Transaction ID"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.nagadTrxId ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.nagadTrxId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.nagadTrxId}
                      </p>
                    )}
                  </div>
                </div>
              )} */}

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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
