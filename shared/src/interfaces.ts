export const CarStatus = ["Draft", "Active"];
export const CarBrand = [
  "Audi",
  "BMW",
  "Ford",
  "Honda",
  "Hyundai",
  "Nissan",
  "Toyota",
];
export const CarCategories = ["Sedan", "Convertible", "SUV", "Hatchback"];
export const CarFuelTypes = ["Petrol", "Diesel"];
export const CarTransmissions = ["Automatic", "Manual"];
export const CarDoors = [2, 4];
export const CarSeats = [2, 4, 5, 7, 8, 9, 10];

export const BookingPaymentMethods = ["card", "cash"];
export const BookingPaymentStatus = ["paid", "pending"];

export const UserRoles = ["user", "admin"];

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNo: string;
  role?: string[];
  avatar?: {
    url: string;
    public_id: string;
  };
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  createdAt: string;
  updatedAt: string;
  getResetPasswordToken(): string;
}

export interface ICar {
  id: string;
  name: string;
  description: string;
  status: string;
  rentPerDay: number;
  address: string;
  images: {
    url: string;
    public_id: string;
  }[];
  reviews: string[];
  brand: string;
  year: number;
  transmission: string;
  doors: number;
  seats: number;
  milleage: number;
  power: number;
  fuelType: string;
  category: string;
  ratings: {
    value: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IBooking {
  id: string;
  user: IUser;
  car: ICar;
  startDate: Date;
  endDate: Date;
  customer: {
    name: string;
    email: string;
    phoneNo: string;
  };
  amount: {
    rent: number;
    discount: number;
    tax: number;
    total: number;
  };
  daysOfRent: number;
  rentPerDay: number;
  paymentInfo: {
    id: string;
    status: string;
    method: string;
  };
  additionalNotes: string;
  createdAt: string;
  updatedAt: string;
}
