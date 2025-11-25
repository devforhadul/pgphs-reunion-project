import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { Payment, User } from "../types";
import { formatCurrency, generateId } from "../utils/helpers";

export const CartPage = () => {
  const navigate = useNavigate();
  const { addPayment } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [amount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<string>("bkash-manual");
  const [bkashNumber, setBkashNumber] = useState<string>("");
  const [bkashTrxId, setBkashTrxId] = useState<string>("");
  const [rocketNumber, setRocketNumber] = useState<string>("");
  const [rocketTrxId, setRocketTrxId] = useState<string>("");
  const [nagadNumber, setNagadNumber] = useState<string>("");
  const [nagadTrxId, setNagadTrxId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) {
      navigate("/register");
      return;
    }
    try {
      const parsedUser = JSON.parse(savedUser) as User;
      setUser(parsedUser);
    } catch {
      navigate("/register");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } else if (paymentMethod === "rocket-manual") {
      if (!rocketNumber.trim()) {
        newErrors.rocketNumber = "Rocket number is required";
      } else if (!/^01[3-9]\d{8}$/.test(rocketNumber.replace(/\s/g, ""))) {
        newErrors.rocketNumber =
          "Please enter a valid Rocket number (01XXXXXXXXX)";
      }
      if (!rocketTrxId.trim()) {
        newErrors.rocketTrxId = "Transaction ID is required";
      }
    } else if (paymentMethod === "nagad-manual") {
      if (!nagadNumber.trim()) {
        newErrors.nagadNumber = "Nagad number is required";
      } else if (!/^01[3-9]\d{8}$/.test(nagadNumber.replace(/\s/g, ""))) {
        newErrors.nagadNumber =
          "Please enter a valid Nagad number (01XXXXXXXXX)";
      }
      if (!nagadTrxId.trim()) {
        newErrors.nagadTrxId = "Transaction ID is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      if (user) {
        const newPayment: Payment = {
          id: generateId(),
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          amount,
          paymentDate: new Date().toISOString(),
          paymentMethod,
          status: "completed",
        };

        addPayment(newPayment);
        localStorage.removeItem("currentUser");
        setIsProcessing(false);
        navigate("/dashboard", { state: { paymentSuccess: true } });
      }
    }, 2000);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
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
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Graduation Year
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.graduationYear}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Registration Fee
                    </span>
                    <div className="text-right">
                      <span className="font-medium text-gray-900 dark:text-white block">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <div className="text-right">
                      <span className="text-primary-600 dark:text-primary-400 block">
                        {formatCurrency(amount)}
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
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === "bkash-manual"
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-primary-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      bKash
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Manual Payment
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("rocket-manual")}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === "rocket-manual"
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-primary-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      Rocket
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Manual Payment
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad-manual")}
                    className={`p-4 border-2 rounded-lg transition-colors ${
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
                  </button>
                </div>
              </div>

              {paymentMethod === "bkash-manual" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">
                      <strong>Instructions:</strong> Send money to our bKash
                      merchant number and enter your bKash number and
                      transaction ID below.
                    </p>
                    <p className="text-blue-700  dark:text-blue-300 text-sm font-bold">
                      Merchant Number: 01984839526
                    </p>
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

              {paymentMethod === "rocket-manual" && (
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
              )}

              {paymentMethod === "nagad-manual" && (
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
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-green-500"
                >
                  {isProcessing
                    ? "Processing..."
                    : `Pay ${formatCurrency(amount)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
