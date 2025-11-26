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
  reg_Id: string,
  fullName: string;
  email?: string;
  phone: string;
  graduationYear: string;
  occupation: string;
  address: string;
  photo: string;
  payment: {
    status: "completed" | "pending" | "failed";
    transactionId: null | string;
    amount: number;
    paidAt: null | string;
  };
}

export interface PaymentData {
  amount: number;
  paymentMethod: string;
}
