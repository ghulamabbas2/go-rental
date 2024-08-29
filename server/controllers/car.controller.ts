import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Car from "../models/car.model";
import { CarFilters, CarInput, DateFilters } from "../types/car.types";
import APIFilters from "../utils/apiFilters";
import { NotFoundError } from "../utils/errorHandler";

export const getAllCars = catchAsyncErrors(
  async (
    page: number,
    filters: CarFilters,
    query: string,
    location: string,
    dateFilters: DateFilters
  ) => {
    const resPerPage = 3;
    const apiFilters = new APIFilters(Car).search(query).filters(filters);

    if (location) {
      const locationResult = await apiFilters.searchByLocation(location);
      apiFilters.model = locationResult.model;
    }

    if (dateFilters) {
      const availabilityResult = await apiFilters.availabilityFilter(
        dateFilters
      );
      apiFilters.model = availabilityResult.model;
    }

    let cars = await apiFilters.model;
    const totalCount = cars.length;

    apiFilters.pagination(page, resPerPage);
    cars = await apiFilters.model.clone();

    return { cars, pagination: { totalCount, resPerPage } };
  }
);

export const createCar = catchAsyncErrors(async (carInput: CarInput) => {
  const newCar = await Car.create(carInput);
  return newCar;
});

export const getCarById = catchAsyncErrors(async (carId: string) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new NotFoundError("Car not found");
  }

  return car;
});

export const updateCar = catchAsyncErrors(
  async (carId: string, carInput: CarInput) => {
    const car = await Car.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    await car.set(carInput).save();

    return true;
  }
);

export const deleteCar = catchAsyncErrors(async (carId: string) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new Error("Car not found");
  }

  await car?.deleteOne();

  return true;
});
