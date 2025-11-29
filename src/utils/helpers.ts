import type { RegistrationData } from "@/types";

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function maskPhoneNumber(phone: string) {
  if (phone.length !== 11) {
    return "Invalid phone number";
  }

  const first3 = phone.slice(0, 3); // প্রথম ৩ সংখ্যা
  const last3 = phone.slice(-3); // শেষ ৩ সংখ্যা
  const masked = "x".repeat(5); // মাঝের ৫টি x

  return first3 + masked + last3;
}

export const formatISOToDateTime = (iso: string): string => {
  const date = new Date(iso);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // month 0-indexed
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const strHours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year} ${strHours}:${minutes} ${ampm}`;
};

export const sortRegistrationsByLatest = (
  data: RegistrationData[]
): RegistrationData[] => {
  return [...data].sort((a, b) => {
    const dateA =
      a.payment.status === "completed" && a.payment.paidAt
        ? new Date(a.payment.paidAt)
        : a.regAt
        ? new Date(a.regAt)
        : new Date(0); // fallback, very old date

    const dateB =
      b.payment.status === "completed" && b.payment.paidAt
        ? new Date(b.payment.paidAt)
        : b.regAt
        ? new Date(b.regAt)
        : new Date(0);

    return dateB.getTime() - dateA.getTime(); // latest first
  });
};
