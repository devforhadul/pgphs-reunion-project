import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label="Your Label", type = "text", error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    // ২. যদি প্রপস থেকে id না আসে, তাহলে অটোমেটিক id ব্যবহার করবে
    const inputId = id || generatedId;

    return (
      <div className="w-full relative">
        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          // placeholder=" " রাখা জরুরি যাতে peer-placeholder-shown কাজ করে
          type={type}
          placeholder=" "
          className={`
            peer
            w-full px-4 pt-5 pb-2 
            text-gray-900 bg-white border rounded-lg outline-none 
            transition-all duration-200
            focus:ring-2 
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
            }
            ${className} 
          `}
          {...props}
        />

        {/* Floating Animated Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-4 top-3.5 z-10 origin-left 
              text-gray-500 cursor-text 
              transition-all duration-200 
              
              /* ডিফল্ট বা ফোকাস অবস্থায় (উপরে থাকবে) */
              scale-75 -translate-y-3 
              
              /* যখন ইনপুট খালি এবং ফোকাস নেই (মাঝখানে থাকবে) */
              peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 
              
              /* ফোকাস হলে আবার উপরে যাবে */
              peer-focus:scale-75 
              peer-focus:-translate-y-3
              
              ${error ? "text-red-500" : "peer-focus:text-blue-600"}
            `}
          >
            {label}
          </label>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-xs text-red-500 ml-1 animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
