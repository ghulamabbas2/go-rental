import {
  createCar,
  deleteCar,
  getAllCars,
  getCarById,
  updateCar,
} from "../../controllers/car.controller";
import { CarFilters, CarInput } from "../../types/car.types";

export const carResolvers = {
  Query: {
    getAllCars: async (
      _: any,
      {
        page = 1,
        filters,
        query,
      }: { page: number; filters: CarFilters; query: string }
    ) => await getAllCars(page, filters, query),
    getCarById: async (_: any, { carId }: { carId: string }) =>
      await getCarById(carId),
  },
  Mutation: {
    createCar: async (_: any, { carInput }: { carInput: CarInput }) => {
      return await createCar(carInput);
    },
    updateCar: async (
      _: any,
      { carId, carInput }: { carId: string; carInput: CarInput }
    ) => {
      return await updateCar(carId, carInput);
    },
    deleteCar: async (_: any, { carId }: { carId: string }) =>
      await deleteCar(carId),
  },
};
