import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Car from "../models/car.model";
import { CarFilters, CarInput, DateFilters } from "../types/car.types";
import APIFilters from "../utils/apiFilters";
import {
  deleteImageFromCloudinary,
  uploadMultipleImages,
} from "../utils/cloudinary";
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
    const apiFilters = new APIFilters(Car)
      .search(query)
      .filters(filters)
      .populate("reviews");

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
  let uploadedImagesUrls: { url: String; public_id: string }[] = [];

  try {
    uploadedImagesUrls = await uploadMultipleImages(
      carInput.images,
      "gorental/cars"
    );

    const newCar = await Car.create({
      ...carInput,
      images: uploadedImagesUrls,
    });

    return newCar;
  } catch (error) {
    // if there is an error with the images, delete the images from cloudinary
    if (uploadedImagesUrls.length > 0) {
      const deletePromises = uploadedImagesUrls.map((url) => {
        return deleteImageFromCloudinary(url.public_id);
      });

      await Promise.all(deletePromises);
    }
    throw error;
  }
});

export const getCarById = catchAsyncErrors(async (carId: string) => {
  const car = await Car.findById(carId).populate({
    path: "reviews",
    populate: {
      path: "user",
      model: "User",
    },
  });

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

    let uploadedImagesUrls: { url: String; public_id: string }[] = [];

    if (carInput?.images?.length > 0) {
      uploadedImagesUrls = await uploadMultipleImages(
        carInput.images,
        "gorental/cars"
      );
    }

    await car
      .set({
        ...carInput,
        images:
          uploadedImagesUrls.length > 0
            ? [...car.images, ...uploadedImagesUrls]
            : car.images,
      })
      .save();

    return true;
  }
);

export const deleteCarImage = catchAsyncErrors(
  async (carId: string, imageId: string) => {
    const car = await Car.findById(carId);

    if (!car) {
      throw new Error("Car not found");
    }

    const isDeleted = await deleteImageFromCloudinary(imageId);

    if (isDeleted) {
      await Car.findByIdAndUpdate(carId, {
        $pull: {
          images: {
            public_id: imageId,
          },
        },
      });

      return true;
    } else {
      throw new Error("Image not deleted.");
    }
  }
);

export const deleteCar = catchAsyncErrors(async (carId: string) => {
  const car = await Car.findById(carId);

  if (!car) {
    throw new Error("Car not found");
  }

  if (car?.images?.length > 0) {
    car?.images.forEach(async (image) => {
      await deleteImageFromCloudinary(image.public_id);
    });
  }

  await car?.deleteOne();

  return true;
});
