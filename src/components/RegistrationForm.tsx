import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { RegistrationData, User } from "../types";
import { generateId } from "../utils/helpers";

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const { addUser } = useApp();
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    phone: "",
    graduationYear: "",
    occupation: "",
    address: "",
    photo: null,
  });
  console.log(formData);
  
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.graduationYear.trim()) {
      newErrors.graduationYear = "Graduation year is required";
    } else if (!/^\d{4}$/.test(formData.graduationYear)) {
      newErrors.graduationYear = "Please enter a valid year (YYYY)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: generateId(),
        ...formData,
        registrationDate: new Date().toISOString(),
      };

      addUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setIsSubmitting(false);
      navigate("/cart");
    }, 500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegistrationData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
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
                className={`w-full px-4 py-2 border rounded-lg  dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="graduationYear"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Graduation Year <span className="text-red-500">*</span>
            </label>

            <select
              id="graduationYear"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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

            {/* <input
              type="text"
              id="graduationYear"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              maxLength={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.graduationYear ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="2020"
            />
            {errors.graduationYear && (
              <p className="mt-1 text-sm text-red-500">
                {errors.graduationYear}
              </p>
            )} */}
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
    className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
      errors.occupation ? "border-red-500" : "border-gray-300"
    }`}
  >
    <option value="">Select Occupation</option>
    <option value="private job">Private Job</option>
    <option value="gov job">Gov Job</option>
    <option value="business">Business</option>
    <option value="probashi">Probashi</option>
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
              className={`w-full px-4 py-2 border rounded-lg  dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
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
                Upload Photo <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, photo: file });
                    setPreview(URL.createObjectURL(file)); // preview image
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent border-gray-300"
              />

              {errors.photo && (
                <p className="mt-1 text-sm text-red-500">{errors.photo}</p>
              )}
            </div>

            {/* Right: Preview */}
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Continue to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};
