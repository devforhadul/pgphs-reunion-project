import { db } from "@/firebase/firebase.init";
import imageCompression from "browser-image-compression";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Spinner } from "../../components/ui/spinner";
import type { RegistrationData } from "../../types";
import bkash_logo from "../../assets/bkash_logo.png";
import bkash_qr_9607 from "../../assets/qr_code/bkash_qr_9607.jpg";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationData, string>>
  >({});
  const [photoUploading, setPhotoUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    // reg_id: "",
    fullName: "",
    email: "",
    phone: "",
    graduationYear: "",
    occupation: "",
    address: "",
    photo: "",
    tShirtSize: "",
    payment: {
      status: "unPaid",
      transactionId: null,
      amount: 1000,
      paidAt: null,
      paymentMethod: "",
      isManual: null,
      paymentNumber: "",
      isCancelled: false,
    },
  });
  const [isRegisterd, setIsRegisterd] = useState<boolean>(false);
  const [isRegisterdMess, setIsRegisterdMess] = useState<string>("");
  // =============
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("bkash-auto");
  const [bkashNumber, setBkashNumber] = useState<string>("");
  const [bkashTrxId, setBkashTrxId] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Bangladeshi phone number";
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = "Occupation is required";
    }

    if (!formData.photo || formData.photo.trim() === "") {
      newErrors.photo = "Photo is required";
    }

    if (!formData.graduationYear.trim()) {
      newErrors.graduationYear = "Graduation year is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.tShirtSize.trim()) {
      newErrors.tShirtSize = "T-shirt size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() && !formData.phone) return;
    setIsSubmitting(true);

    const counterRef = doc(db, "counters", "registrationCounter");
    const registrationsRef = collection(db, "pgphs_ru_reqisterd_users");

    // --- Wrap transaction inside toast.promise ---
    toast
      .promise(
        runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);

          if (!counterDoc.exists()) {
            throw new Error("Counter document does not exist!");
          }

          const current = counterDoc.data()?.current ?? 0;
          const newCounter = current + 1;

          const serial = `PGPHS-${newCounter.toString().padStart(4, "0")}`;

          transaction.set(doc(registrationsRef), {
            ...formData,
            reg_id: serial,
            createdAt: getBDTime(),
          });

          transaction.update(counterRef, { current: newCounter });

          return serial; // IMPORTANT: return serial
        }),
        {
          loading: "Registering...",
          success: "Registration successful!",
          error: "Failed to register!",
        }
      )
      .then((serial) => {
        setTimeout(() => {
          setIsSubmitting(false);
          navigate(`/cart/${serial}`);
        }, 1000);
      });

    setIsSubmitting(false);
  }; */

  useEffect(() => {
    const checkNumber = async () => {
      try {
        const q = query(
          collection(db, "pgphs_ru_reqisterd_users"),
          where("phone", "==", formData.phone)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const matchedUser = {
            id: snapshot.docs[0].id,
            ...(snapshot.docs[0].data() as RegistrationData),
          };
          if (matchedUser) {
            setIsRegisterd(true);
            setIsRegisterdMess("Registration has been done using this number.");
          }
        } else {
          // setUser(null);
          // setErrors("You not yer registerd. go Register page");
        }
      } catch (err) {
        console.error(err);
        // setError("Something went wrong while fetching data.");
      }
    };
    checkNumber();
  }, [formData?.phone]);

  // Bkash gateway
  const handleBkashAuto = async () => {
    if (!validate() || !formData.photo) {
      alert("Filled all required field");
      return;
    }
    if (isRegisterd) {
      return alert(
        "This number already Registrad. Check status using your number."
      );
    }
    localStorage.setItem("reunionUser", JSON.stringify(formData));
    setIsLoading(true);
    const userPayInfo = {
      payerReference: formData.fullName,
      callbackURL: `https://pgmphs-reunion.com/confirmation?user=${formData.phone}`,
      amount: "1000",
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
        window.location.href = data.bkashURL;
        // setIsLoading(false);
      } else {
        setIsLoading(false);
        alert("Payment URL not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  //* Manual payment submit */
  const handleSubmit = async () => {
    if (!validate() || !formData.photo) {
      alert("Filled all required field");
      return;
    }
    if (isRegisterd) {
      return alert(
        "This number already Registrad. Check status using your number."
      );
    }
    localStorage.setItem("reunionUser", JSON.stringify(formData));

    if (!validatePayment()) return;

    setIsLoading(true);

    let payNumber = "";
    let trxId = "";

    if (paymentMethod === "bkash-manual") {
      payNumber = bkashNumber;
      trxId = bkashTrxId;
    } else {
      console.error("Invalid payment method selected.");
      setIsLoading(false);
      return;
    }

    const saveRegistration = async () => {
      const usersRef = collection(db, "pgphs_ru_reqisterd_users");
      const q = query(usersRef, where("phone", "==", formData.phone));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return setIsRegisterdMess(
          "Registration has been done using this number."
        );
      }

      try {
        const docRef = await addDoc(usersRef, {
          ...formData,
          regAt: new Date().toISOString(),
          payment: {
            ...formData.payment,
            status: "verifying",
            transactionId: trxId,
            paidAt: new Date().toISOString(),
            paymentMethod: paymentMethod,
            isManual: true,
            paymentNumber: payNumber,
          },
        });

        if (docRef.id) {
          navigate(`/confirmation`);
          Swal.fire({
            title: "Payment Send. Wait for verify.",
            icon: "success",
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error during payment update:", error);
        setIsLoading(false);
        alert("Registration failed!. Contact support: \n 01612929275");
      } finally {
        setIsLoading(false);
      }
    };

    saveRegistration();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegistrationData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        photo: "Only image files are allowed",
      }));
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 2) {
      alert("Maximum 2MB image allowed!");
      return;
    }

    // ✅ Compress and upload
    try {
      const options = {
        maxSizeMB: 0.4, // max 200KB
        maxWidthOrHeight: 400, // resize max
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      // console.log("Original size:", file.size / 1024, "KB");
      // console.log("Compressed size:", compressedFile.size / 1024, "KB");

      setPreview(URL.createObjectURL(compressedFile));

      const body = new FormData();
      body.append("image", compressedFile);

      setPhotoUploading(true);

      const API_KEY = "bfb269ca176e774b90d6f9df3e7d7162";

      const saveImage = async () => {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${API_KEY}`,
          { method: "POST", body }
        );
        const data = await res.json();
        const photoUrl = data.data.url ?? data.data.display_url;

        setFormData((prev) => ({
          ...prev,
          photo: photoUrl,
        }));

        console.log("Uploaded image:", photoUrl);

        setPhotoUploading(false);
        return photoUrl;
      };

      toast.promise(saveImage(), {
        loading: "Photo Saving...",
        success: <b>Photo saved!</b>,
        error: <b>Could not save.</b>,
      });
    } catch (error) {
      console.error("Compression error:", error);
      setErrors((prev) => ({
        ...prev,
        photo: "Image compression failed",
      }));
    }
  };

  const instructions = [
    "শুধুমাত্র মুখের ছবি আপলোড করুন।",
    "পূর্ণদেহ বা বড় ছবি আপলোড করবেন না।",
    "ছবির আকার 2MB এর বেশি হতে পারবে না।",
    "ছবিটি ঝাপসা বা অস্পষ্ট হলে গ্রহণযোগ্য হবে না।",
    // "পরবর্তী পেজে ১,০০০ টাকা পেমেন্ট করে রেজিস্ট্রেশন সম্পন্ন করুন।",
    // "আপলোডের পর ছবিটি ক্রপ করে ঠিক আকারে সংরক্ষণ করুন।",
  ];

  const [copied, setCopied] = useState(false);
  const number = "01910179607";
  const handleCopy = async () => {
    await navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {photoUploading  && <LoadingOverlay text="Photo uploading..." />}
      {isLoading  && <LoadingOverlay text="Processing..." />}
      <div className="text-center">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          PGMPHS 1st Reunion 2026 Registration
        </h1>
        <p className="text-xs lg:text-base text-gray-600 dark:text-gray-400 mb-5 lg:mb-7">
          Please fill out the form below to register for the reunion event.
        </p>
      </div>
      <div className="grid lg:grid-cols-[1fr_400px] gap-5">
        {/* Left side form */}
        <div className="backdrop-blur-md mx-3  bg-[#FAFAFA] border-white/30 dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8">
          <form /* onSubmit={handleSubmit} */ className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-white  dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address <span> (Optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={11}
                className={`w-full px-4 py-3 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
              {isRegisterdMess && (
                <p className="mt-1 text-sm text-red-500">{isRegisterdMess}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="graduationYear"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                SSC Batch <span className="text-red-500">*</span>
              </label>

              <select
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.graduationYear ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Year</option>

                {Array.from(
                  { length: 2025 - 1975 + 1 },
                  (_, i) => 1975 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {errors.graduationYear && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.graduationYear}
                </p>
              )}
            </div>

            {/* occpesion */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Occupation <span className="text-red-500">*</span>
              </label>

              <select
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.occupation ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Select Occupation -- </option>
                <option value="student">Student</option>
                <option value="private job">Private Job</option>
                <option value="govt job">Government Job</option>
                <option value="business">Business / Entrepreneur</option>
                <option value="freelancer">Freelancer</option>
                <option value="homemaker">Homemaker</option>
                <option value="retired">Retired</option>
                <option value="unemployed">Unemployed</option>
                <option value="probashi">Probashi / Abroad Worker</option>
                <option value="other">Other</option>
              </select>

              {errors.occupation && (
                <p className="mt-1 text-sm text-red-500">{errors.occupation}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={1}
                className={`w-full px-4 py-3 bg-white border rounded-lg  dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* T-shirt */}
            <div>
              <label
                htmlFor="tShirtSize"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                T-Shirt Size <span className="text-red-500">*</span>
              </label>
              <select
                id="tShirtSize"
                name="tShirtSize"
                value={formData.tShirtSize}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.tShirtSize ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Select --</option>
                <option value="S">
                  S - Length: 27.5”, Chest: 38”, Sleeve Length: 8”
                </option>
                <option value="M">
                  M - Length: 28”, Chest: 41”, Sleeve Length: 8.5”
                </option>
                <option value="L">
                  L - Length: 29.5”, Chest: 42”, Sleeve Length: 9”
                </option>
                <option value="XL">
                  XL - Length: 30”, Chest: 44”, Sleeve Length: 9.5”
                </option>
                <option value="XXL">
                  2XL - Length: 31”, Chest: 46”, Sleeve Length: 10”
                </option>
                <option value="3XL">
                  3XL - Length: 32”, Chest: 48”, Sleeve Length: 11”
                </option>
                <option value="4XL">4XL</option>
              </select>
              {errors.tShirtSize && (
                <p className="mt-1 text-sm text-red-500">{errors.tShirtSize}</p>
              )}
            </div>

            {/* image */}
            <div className="w-full flex items-start gap-4">
              {/* Left: File Input */}
              <div className="flex-1">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Upload Photo <span className="text-red-500">*</span> ( (Max:
                  1MB, 400x400))
                </label>

                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={uploadImage}
                  className="w-full px-4 py-3 border rounded-lg cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent border-gray-300"
                />

                {errors.photo && (
                  <p className="mt-1 text-sm text-red-500">{errors.photo}</p>
                )}
              </div>

              {/* Right: Preview */}
              {preview && (
                <div className="w-32 h-32 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-gray-300">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
              )}
            </div>
            {/* Instruction for image */}
            <div className="w-full  my-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 rounded-lg shadow-sm text-gray-700">
              <h2 className="text-lg font-semibold mb-3 text-black dark:text-white">
                নির্দেশনা
              </h2>
              <div className="flex flex-col space-y-2">
                {instructions.map((text, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <FaCheckCircle className="text-green-500 mt-1" />
                    <p className="text-sm text-black dark:text-white">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            >
              Register & Pay Now (1000 tk)
            </button> */}
          </form>

          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700/50 rounded-lg shadow-inner flex justify-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Already Registered?
              <Link
                to={"/check-status"}
                className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200 underline underline-offset-4"
              >
                Check Status
              </Link>
            </p>
          </div>
        </div>
        {/* Right side summary */}
        <div>
          <div className="backdrop-blur-md mx-3 bg-blue-50 dark:bg-gray-800 rounded-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Summary
            </h2>
            <div className="space-y-4">
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium dark:text-gray-400">
                    Registration Fee:
                  </span>
                  <div className="text-right">
                    <span className="font-medium text-gray-900 dark:text-white block">
                      {1000} Tk
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900 text-2xl dark:text-white">
                    Total:
                  </span>
                  <div className="text-right">
                    <span className="text-amber-500 font-bold dark:text-primary-400 block">
                      {1000} Tk
                    </span>
                  </div>
                </div>
                {/* Payment */}
                <div className="bg-gray-50 dark:bg-gray-900 p-5 mt-3 rounded-xl">
                  <div className="space-y-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1  gap-4">
                      {/* Bkash onine payment */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bkash-auto")}
                        className={`relative px-5 py-3 border-2  transition-all duration-300 cursor-pointer w-full text-left focus:outline-none ${
                          paymentMethod === "bkash-auto"
                            ? "border-[#E2136E] bg-[#fdf2f7] dark:bg-[#E2136E]/10 "
                            : "border-gray-200 dark:border-gray-700 hover:border-[#E2136E]/50 bg-white dark:bg-gray-800"
                        }`}
                      >
                        {/* Selected Checkmark Badge */}
                        {paymentMethod === "bkash-auto" && (
                          <div className="absolute top-7 left-3 bg-[#E2136E] text-white rounded-full p-0.5 shadow-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}

                        <div className="flex flex-col ml-7">
                          <span
                            className={`font-semibold text-lg ${
                              paymentMethod === "bkash-auto"
                                ? "text-[#E2136E]"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            bKash Gateway
                          </span>

                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded uppercase ${
                                paymentMethod === "bkash-auto"
                                  ? "bg-[#E2136E] text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                              }`}
                            >
                              Instant
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Automatic Verification
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Bkash manual payment */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bkash-manual")}
                        className={`relative px-5 py-3 border-2 transition-all duration-300 cursor-pointer w-full text-left focus:outline-none ${
                          paymentMethod === "bkash-manual"
                            ? "border-[#E2136E] bg-[#fdf2f7] dark:bg-[#E2136E]/10"
                            : "border-gray-200 dark:border-gray-700 hover:border-[#E2136E]/50 bg-white dark:bg-gray-800"
                        }`}
                      >
                        {/* Selected Checkmark Badge */}
                        {paymentMethod === "bkash-manual" && (
                          <div className="absolute top-7 left-3 bg-[#E2136E] text-white rounded-full p-0.5 shadow-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}

                        <div className="flex flex-col ml-7">
                          <span
                            className={`font-semibold text-lg ${
                              paymentMethod === "bkash-manual"
                                ? "text-[#E2136E]"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            bKash Manual
                          </span>

                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded ${
                                paymentMethod === "bkash-manual"
                                  ? "bg-[#E2136E] text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                              }`}
                            >
                              SEND MONEY
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Require Trx ID
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

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
                          disabled={photoUploading}
                          className="w-full max-w-sm bg-[#E2136E] hover:bg-[#c40f5f] text-white font-bold py-3 px-4 rounded shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          onClick={() => handleBkashAuto()}
                        >
                          {/* <span>Proceed to bKash</span> */}
                          {!isLoading && <span>Proceed to Payment</span>}
                          {/* The Spinner */}
                          {isLoading && <Spinner className="size-5" />}
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

                  {paymentMethod === "bkash-manual" && (
                    <div className="space-y-4 my-6">
                      <div className="max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-[#e2136e] px-4 py-2 text-white flex justify-between items-center ">
                          <h3 className="font-bold text-lg">Send Money</h3>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">
                            Personal
                          </span>
                        </div>

                        <div className="p-5 ">
                          {/* <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            আপনার bKash অ্যাপ থেকে নিচের নাম্বারে{" "}
                            <strong>Send Money</strong> করুন। এরপর ট্রানজ্যাকশন
                            আইডি (TxnID) ফর্মটিতে দিন।
                          </p> */}

                          <div className="flex flex-col  gap-5 items-center">
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
                          Your bKash Number{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="bkashNumber"
                          value={bkashNumber}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 11) value = value.slice(0, 11);
                            setBkashNumber(value);
                            // if (errors.bkashNumber) {
                            //   setErrors((prev) => ({
                            //     ...prev,
                            //     bkashNumber: "",
                            //   }));
                            // }
                          }}
                          placeholder="01XXXXXXXXX"
                          maxLength={11}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                            `}
                        />
                        {/* {errors.bkashNumber && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.bkashNumber}
                          </p>
                        )} */}
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
                            // if (errors.bkashTrxId) {
                            //   setErrors((prev) => ({
                            //     ...prev,
                            //     bkashTrxId: "",
                            //   }));
                            // }
                          }}
                          placeholder="Enter Transaction ID"
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white `}
                        />
                        {/* {errors.bkashTrxId && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.bkashTrxId}
                          </p>
                        )} */}
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bkash-auto" || (
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        disabled={photoUploading}
                        onClick={() => handleSubmit()}
                        className="flex-1 group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isLoading ? (
                          <Spinner className="size-5" />
                        ) : (
                          `Send Payment`
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
