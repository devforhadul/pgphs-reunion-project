export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format currency in BDT
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export const getBDTime = () => {
  const now = new Date();

  // UTC + 6 hours
  const bdTime = new Date(now.getTime() + 6 * 60 * 60 * 1000);

  return bdTime.toISOString().replace("Z", "+06:00");
};