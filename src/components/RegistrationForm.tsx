import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RegistrationData } from "../types";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase.init";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { FaCheckCircle } from "react-icons/fa";

export const RegistrationForm = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  // const [uploading, setUploading] = useState(false);
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

  /*   const handleSubmit = async (e: React.FormEvent) => {
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

  // Submit Form function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterd) {
      return alert(
        "This number already Registrad. Check status using your number."
      );
    }

    if (!validate() || !formData.phone) return;

    setIsSubmitting(true);

    const saveRegistration = async () => {
      const usersRef = collection(db, "pgphs_ru_reqisterd_users");
      const q = query(usersRef, where("phone", "==", formData.phone));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return setIsRegisterdMess(
          "Registration has been done using this number."
        );
      }

      const docRef = await addDoc(usersRef, {
        ...formData,
        regAt: new Date().toISOString(),
      });

      return docRef.id;
    };  

    toast
      .promise(saveRegistration(), {
        loading: "Registration processing...",
        success: "Registration successful! payment now.",
        error: (err) => err.message,
      })
      .then((docId) => {
        navigate(`/cart/${docId}`);
      })
      .finally(() => setIsSubmitting(false));


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

      console.log("Original size:", file.size / 1024, "KB");
      console.log("Compressed size:", compressedFile.size / 1024, "KB");

      setPreview(URL.createObjectURL(compressedFile));

      const body = new FormData();
      body.append("image", compressedFile);

      setIsSubmitting(true);

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

        setIsSubmitting(false);
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
    "পরবর্তী পেজে ১,০০০ টাকা পেমেন্ট করে রেজিস্ট্রেশন সম্পন্ন করুন।",
    // "আপলোডের পর ছবিটি ক্রপ করে ঠিক আকারে সংরক্ষণ করুন।",
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          PGPHS 1st Reunion Registration
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please fill out the form below to register for the reunion event.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`w-full px-4 py-4 border rounded-lg  dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
              className={`w-full px-4 py-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
              className={`w-full px-4 py-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
              className={`w-full px-4 py-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.graduationYear ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Year</option>

              {Array.from({ length: 2025 - 1975 + 1 }, (_, i) => 1975 + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
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
              className={`w-full px-4 py-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
              className={`w-full px-4 py-4 border rounded-lg  dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
              className={`w-full px-4 py-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
              <option value="4XL">
                4XL
              </option>
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
                className="w-full px-4 py-2 border rounded-lg cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent border-gray-300"
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
          <div className="w-full  my-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700">
            <h2 className="text-lg font-semibold mb-3">নির্দেশনা</h2>
            <div className="flex flex-col space-y-2">
              {instructions.map((text, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <p className="text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            Register & Pay Now (1000 tk)
          </button>
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
    </div>
  );
};
