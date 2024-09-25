import {
  createCar,
  deleteCar,
  deleteCarImage,
  getAllCars,
  getCarById,
  updateCar,
} from "../../controllers/car.controller";
import { CarFilters, CarInput, DateFilters } from "../../types/car.types";

export const carResolvers = {
  Query: {
    getAllCars: async (
      _: any,
      {
        page = 1,
        filters,
        query,
        location,
        dateFilters,
      }: {
        page: number;
        filters: CarFilters;
        query: string;
        location: string;
        dateFilters: DateFilters;
      }
    ) => getAllCars(page, filters, query, location, dateFilters),
    getCarById: async (_: any, { carId }: { carId: string }) =>
      getCarById(carId),
  },
  Mutation: {
    createCar: async (_: any, { carInput }: { carInput: CarInput }) => {
      return createCar(carInput);
    },
    updateCar: async (
      _: any,
      { carId, carInput }: { carId: string; carInput: CarInput }
    ) => {
      return updateCar(carId, carInput);
    },
    deleteCarImage: async (
      _: any,
      { carId, imageId }: { carId: string; imageId: string }
    ) => deleteCarImage(carId, imageId),
    deleteCar: async (_: any, { carId }: { carId: string }) => deleteCar(carId),
  },
};
