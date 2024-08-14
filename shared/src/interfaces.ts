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
