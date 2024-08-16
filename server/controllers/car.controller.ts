import Car from "../models/car.model";
import { CarFilters, CarInput } from "../types/car.types";
import APIFilters from "../utils/apiFilters";

export const getAllCars = async (
  page: number,
  filters: CarFilters,
  query: string
) => {
  const resPerPage = 3;
  const apiFilters = new APIFilters(Car).search(query).filters(filters);

  let cars = await apiFilters.model;
  const totalCount = cars.length;

  apiFilters.pagination(page, resPerPage);
  cars = await apiFilters.model.clone();

  return { cars, pagination: { totalCount, resPerPage } };
};

export const createCar = async (carInput: CarInput) => {
  const newCar = await Car.create(carInput);
  return newCar;
};

export const getCarById = async (carId: string) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new Error("Car not found");
  }

  return car;
};

export const updateCar = async (carId: string, carInput: CarInput) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new Error("Car not found");
  }

  await car.set(carInput).save();

  return true;
};

export const deleteCar = async (carId: string) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new Error("Car not found");
  }

  await car?.deleteOne();

  return true;
};
