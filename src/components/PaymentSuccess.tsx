import React from "react";
import { PaymentData } from "../types";
interface ConfirmationCardProps {
  data: PaymentData;
  onClose?: () => void;
  onPrint?: () => void;
}

const PaymentSuccess: React.FC<ConfirmationCardProps> = ({
  onClose,
  onPrint,
}) => {
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
      <div className="p-8">
        {/* PaymentSuccessIcon */}
        <div className="flex justify-center items-center mb-6">
          <div className="relative w-24 h-24">
            {/* Animated Background Circle */}
            <div className="animate-circle absolute inset-0 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="animate-check"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Payment Successful!
          </h2>
          <p className="text-gray-500 mt-2">
            Your transaction has been completed.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Amount Paid</span>
            <span className="text-xl font-bold text-green-600">
              {10000}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Payment Method</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 font-semibold uppercase">
                {"Bkash"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Transaction ID</span>
            <span className="text-gray-800 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
              {"trx id"}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Mobile Number</span>
            <span className="text-gray-800 font-semibold">
              {"01777777777777"}
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-500 font-medium">Payment Date</span>
            <span className="text-gray-800 font-semibold">{"date"}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={onPrint}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
          >
            <i className="fas fa-download text-sm"></i>
            <span>Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">
          A confirmation email has been sent to your registered address. Need
          help?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
