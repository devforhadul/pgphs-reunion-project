export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  graduationYear: string;
  address: string;
  registrationDate: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
  isManual?: boolean;
}

export interface RegistrationData {
  id?: string;
  reg_id?: string;
  fullName: string;
  email?: string;
  phone: string;
  graduationYear: string;
  occupation: string;
  address: string;
  tShirtSize: string;
  photo: string;
  payment: {
    status: "completed" | "pending" | "failed" | "verifying";
    transactionId: null | string;
    amount: 1000;
    paidAt: null | string;
    paymentMethod: string;
    isManual?: boolean | null;
    paymentNumber: string;
  };
}

export interface PaymentData {
  amount: number;
  paymentMethod: string;
}
