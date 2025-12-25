import { AuthContext } from "@/provider/AuthProvider";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function LoginPage() {
  // const [isPhone, setIsPhone] = useState<string>("");
  const [isEmail, setIsEmail] = useState<string>("");
  const [isPass, setIsPass] = useState<string>("");
  // const navigate = useNavigate();
  const { signinWithGoogle, signInWithEmailPass, forgotPassword } =
    useContext(AuthContext)!;



  const loginFun = async (e: React.FormEvent) => {
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

  const googleSignIn = async () => {
    try {
      await signinWithGoogle();
      toast.success("Google login successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!isEmail) return alert("Enter your email");
    await forgotPassword(isEmail);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto dark:hidden"
        />
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto not-dark:hidden"
        /> */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xl font-serif">
            P
          </div>
          <span className="text-2xl font-bold text-black dark:text-white tracking-tight font-serif">
            PGPHS <span className="text-amber-500">Reunion - 2026</span>
          </span>
        </Link>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          Log in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={loginFun} className="space-y-6">
          {/* <div>
            <label
              htmlFor="phone"
              className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >
              Registrad Mobile Number
            </label>
            <div className="mt-2">
              <input
                id="phone"
                name="phone"
                type="tel"
                onChange={(e) => setIsPhone(e.target.value)}
                required
                autoComplete="phone"
                placeholder="Enter phone number..."
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
              />
            </div>
          </div> */}

          {/* Email */}
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
        </form>

        <div className="mt-5 text-center ">
          <button
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
