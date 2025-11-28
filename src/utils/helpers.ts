export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};


export const getBDTime = () => {
  const now = new Date();

  // UTC + 6 hours
  const bdTime = new Date(now.getTime() + 6 * 60 * 60 * 1000);

  return bdTime.toISOString().replace("Z", "+06:00");
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
