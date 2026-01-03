import { AuthContext } from "@/provider/AuthProvider";
import { useContext } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
  // const [isPhone, setIsPhone] = useState<string>("");
  /*   const [isEmail, setIsEmail] = useState<string>("");
  const [isPass, setIsPass] = useState<string>(""); */
  const navigate = useNavigate();
  const { signinWithGoogle } = useContext(AuthContext)!;

  /*   const loginFun = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailPass(isEmail, isPass);
    } catch (error) {
      console.log(error);
      alert(error);
    }

    // await sendSignInLink(isEmail);
    // alert(`Email link sent to ${isEmail} Check your email for login link!`);
    // navigate(`/check-status?n=${isPhone}`);
  };
 */
  const googleSignIn = async () => {
    try {
      await signinWithGoogle();
      navigate("/");
      toast.success("Login successfully");
    } catch (err) {
      console.error(err);
    }
  };

  /*   const handleReset = async () => {
    if (!isEmail) return alert("Enter your email");
    await forgotPassword(isEmail);
  }; */

  // const [prompt, setPrompt] = useState("");
  // const [response, setResponse] = useState("");
  // const [loading, setLoading] = useState(false);

  // // ১. আপনার API Key এখানে দিন (অথবা environment variable থেকে নিন)
  // // Vite হলে: import.meta.env.VITE_GEMINI_API_KEY
  // // CRA হলে: process.env.REACT_APP_GEMINI_API_KEY
  // const API_KEY = "AIzaSyDNKRe5ALLGqwwkjsIbNL86RSrF3HPKJKQ";

  // const handleGenerate = async () => {
  //   if (!prompt) return;

  //   setLoading(true);
  //   setResponse(""); // আগের রেসপন্স ক্লিয়ার করা হচ্ছে

  //   try {
  //     const genAI = new GoogleGenerativeAI(API_KEY);

  //     // আপনার লেটেস্ট মডেলটি ব্যবহার করুন
  //     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  //     // ১. generateContent এর বদলে generateContentStream ব্যবহার করা হয়েছে
  //     const result = await model.generateContentStream(prompt);

  //     let fullText = "";

  //     // ২. লুপ চালিয়ে অল্প অল্প করে টেক্সট দেখানো হচ্ছে
  //     for await (const chunk of result.stream) {
  //       const chunkText = chunk.text();
  //       fullText += chunkText;
  //       setResponse(fullText); // প্রতিবার স্টেট আপডেট হচ্ছে, তাই এনিমেশন মনে হবে
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setResponse("Something went wrong. Check console.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6  lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xl font-serif">
            P
          </div>
          <span className="text-2xl font-bold text-black dark:text-white tracking-tight font-serif">
            PGPHS <span className="text-amber-500">Reunion - 2026</span>
          </span>
        </Link> */}
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          Log in to your account
        </h2>
      </div>

      {/* <div className="p-5 max-w-xl mx-auto border rounded shadow-lg mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Chat with Gemini (Streaming)
        </h2>

        <textarea
          className="w-full p-2 border rounded mb-3"
          rows="4"
          placeholder="Ask anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Ask Gemini"}
        </button>

        {response && (
          <div className="mt-5 p-3 bg-gray-100 rounded">
            <h3 className="font-bold">Response:</h3>

            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
 */}
      <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <form onSubmit={loginFun} className="space-y-6">
          
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >
              Email Address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                onChange={(e) => setIsEmail(e.target.value)}
                required
                autoComplete="phone"
                placeholder="Enter Email..."
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >
                Password
              </label>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => handleReset()}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password..."
                onChange={(e) => setIsPass(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 cursor-pointer"
            >
              Log in
            </button>
          </div>
        </form> */}

        <div className="mt-5 text-center ">
          {/* <button
            type="button"
            onClick={() => googleSignIn()}
            className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 box-border border border-transparent font-medium leading-5 rounded-full text-sm px-4 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 cursor-pointer"
          >
            <svg
              className="w-4 h-4 me-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                clip-rule="evenodd"
              />
            </svg>
            Sign in with Google
          </button> */}
          <button
            onClick={() => googleSignIn()}
            className="
        flex items-center justify-center
        w-full max-w-sm /* Adjust width as needed */
        px-6 py-3
        bg-white
        border border-gray-300
        rounded-lg /* Rounded corners */
        shadow-sm hover:shadow-md
        hover:bg-gray-50
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer
      "
          >
            <div className="mr-3">
              {/* Paste the SVG here if not importing */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24px"
                height="24px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.654-3.343-11.303-8l-6.571,4.819C9.656,39.663,16.318,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 font-inter">
              Sign in with Google
            </span>
          </button>
        </div>

        <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
          Not a Registrad?{" "}
          <Link
            to={"/registration"}
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Go Now
          </Link>
        </p>
      </div>
    </div>
  );
}
