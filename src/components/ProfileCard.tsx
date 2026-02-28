import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { RegistrationData } from "../types";
import { LoadingOverlay } from "./shared/LoadingOverlay";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.init";

interface ProfileCardProps {
  myUser: RegistrationData;
  // onUpdate: (data: RegistrationData) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ myUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>(myUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Sync formData with myUser if myUser changes externally
  useEffect(() => {
    setFormData(myUser);
  }, [myUser]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    // if (!file.type.startsWith("image/")) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     photo: "Only image files are allowed",
    //   }));
    //   return;
    // }

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

      // setPreview(URL.createObjectURL(compressedFile));

      const formData = new FormData();
      formData.append("image", compressedFile);

      setPhotoUploading(true);

      const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

      const saveImage = async () => {
        try {
          setPhotoUploading(true);
          const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${API_KEY}`,
            { method: "POST", body: formData },
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
        } catch (error) {
          console.error("Error uploading:", error);
        } finally {
          setPhotoUploading(false);
        }
      };

      saveImage();

      // toast.promise(saveImage(), {
      //   loading: "Photo Saving...",
      //   success: <b>Photo saved!</b>,
      //   error: <b>Could not save.</b>,
      // });
    } catch (error) {
      console.error("Compression error:", error);
      setPhotoUploading(false);
      // setErrors((prev) => ({
      //   ...prev,
      //   photo: "Image compression failed",
      // }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // onUpdate(formData);

    if (!formData || !formData.id) {
      toast.error("User ID not found!");
      return;
    }

    try {
      // ২. আইডিটি স্টোর করুন
      const userId = formData.id;

      // ৩. ডাটা কপি করুন এবং অবজেক্ট থেকে 'id' সরাসরি ডিলিট করে দিন
      // এতে কোনো নতুন ভেরিয়েবল তৈরি হবে না, তাই ESLint এরর আসবে না
      const dataToUpdate = { ...formData };
      delete dataToUpdate.id;

      // ৪. Firestore আপডেট
      const userDocRef = doc(db, "pgphs_ru_reqisterd_users", userId);

      await updateDoc(userDocRef, {
        ...dataToUpdate,
      });

      toast.success("User data updated successfully! 🎉");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update user data.");
    }

    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden transition-all duration-300 w-full max-w-4xl mx-auto">
      {photoUploading && <LoadingOverlay text="Photo uploading..." />}
      <div className="px-5 sm:px-10 py-8 relative">
        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center  gap-4 mb-10 pt-4">
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 sm:border-[6px] border-slate-50 shadow-md bg-slate-50 relative">
              <img
                src={isEditing ? formData.photo : myUser.photo}
                alt={myUser.fullName}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] flex flex-col items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <svg
                    className="w-5 h-5 text-white mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                  </svg>
                  <span className="text-white text-[9px] font-bold uppercase tracking-widest">
                    Update
                  </span>
                </button>
              )}
            </div>
            {isEditing && (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? "Edit Profile" : myUser.fullName}
            </h1>
            <p className="text-indigo-600 font-bold text-xs sm:text-sm tracking-wide">
              {myUser.reg_id || "N/A"}
            </p>
            {/* <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                Registration ID
              </span>
              <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold text-slate-500">
                {myUser.reg_id || "N/A"}
              </span>
            </div> */}
          </div>

          <button
            type="button"
            onClick={() =>
              isEditing ? setIsEditing(false) : setIsEditing(true)
            }
            className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-bold transition-all cursor-pointer text-xs active:scale-95 ${
              isEditing
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-50"
            }`}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Data Fields Section */}
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-4"
          >
            <DataField
              label="Full Name"
              name="fullName"
              value={isEditing ? formData.fullName : myUser.fullName}
              isEditing={isEditing}
              onChange={handleInputChange}
            />
            <DataField
              label="Email Address"
              name="email"
              type="email"
              value={(isEditing ? formData?.email : myUser?.email) ?? ""}
              isEditing={isEditing}
              onChange={handleInputChange}
            />
            <DataField
              label="Mobile Number"
              name="phone"
              readOnly={true}
              value={isEditing ? formData.phone : myUser.phone}
              isEditing={isEditing}
              onChange={handleInputChange}
            />
            <DataField
              label="Occupation"
              name="occupation"
              value={isEditing ? formData.occupation : myUser.occupation}
              isEditing={isEditing}
              onChange={handleInputChange}
            />

            {isEditing ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-0.5">
                  T-Shirt Size
                </label>
                <select
                  name="tShirtSize"
                  value={formData.tShirtSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-sm focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-semibold text-slate-700 transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">2XL</option>
                  <option value="3XL">3XL</option>
                  <option value="4XL">4XL</option>
                </select>
              </div>
            ) : (
              <DataField
                label="T-Shirt Size"
                value={myUser.tShirtSize || "N/A"}
                isEditing={false}
              />
            )}

            <DataField
              label="Graduation Year"
              name="graduationYear"
              value={
                isEditing ? formData.graduationYear : myUser.graduationYear
              }
              isEditing={isEditing}
              onChange={handleInputChange}
            />

            <div className="md:col-span-2">
              <DataField
                label="Address"
                name="address"
                value={isEditing ? formData.address : myUser.address}
                isEditing={isEditing}
                onChange={handleInputChange}
                isTextArea
              />
            </div>

            {!isEditing && (
              <div className="md:col-span-2 pt-6 mt-2 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-100">
                {/* <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Registration ID
                  </span>
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold text-slate-500">
                    {myUser.reg_id || "N/A"}
                  </span>
                </div> */}
                <div className="text-slate-400 text-[10px] font-bold  tracking-wider">
                  Registered at {formatDate(myUser.regAt)}
                </div>
              </div>
            )}

            {isEditing && (
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

interface DataFieldProps {
  label: string;
  name?: string;
  value: string;
  isEditing: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  type?: string;
  isTextArea?: boolean;
}

const DataField: React.FC<DataFieldProps> = ({
  label,
  name,
  value,

  isEditing,
  onChange,
  readOnly = false,
  type = "text",
  isTextArea = false,
}) => {
  const commonClasses =
    "w-full rounded-sm font-semibold transition-all text-sm";

  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-0.5">
        {label}
      </label>
      {isEditing ? (
        isTextArea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={2}
            className={`${commonClasses} px-3 py-2 bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none text-slate-700`}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className={`${commonClasses} px-3 py-2 bg-slate-50 border border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-700`}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )
      ) : (
        <div
          className={`${commonClasses} py-2.5 bg-transparent border-none text-slate-800 flex items-center min-h-[40px]`}
        >
          {value || (
            <span className="text-slate-300 font-normal">Not specified</span>
          )}
        </div>
      )}
    </div>
  );
};
