export type BookingInput = {
  car: string;
  startDate: string;
  endDate: string;
  customer: {
    name: string;
    email: string;
    phoneNo: string;
  };
  amount: {
    tax: number;
    discount: number;
    rent: number;
    total: number;
  };
  daysOfRent: number;
  rentPerDay: number;
  additionalNotes?: string;
};
