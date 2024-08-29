import mongoose from "mongoose";
import geocoder from "./geoCoder";
import { DateFilters } from "../types/car.types";
import Booking from "../models/booking.model";

class APIFilters {
  model: any;

  constructor(model: any) {
    this.model = model;
  }

  search(query: string) {
    const searchById = {
      _id: query,
    };

    const searchByKeyword = {
      name: {
        $regex: query,
        $options: "i",
      },
    };

    const searchQuery = query
      ? mongoose.isValidObjectId(query)
        ? searchById
        : searchByKeyword
      : {};

    this.model = this.model.find({ ...searchQuery });
    return this;
  }

  async searchByLocation(locationQuery?: string) {
    let searchQuery = {};

    if (locationQuery) {
      const loc = await geocoder.geocode(locationQuery);

      const { latitude, longitude } = loc[0];
      const { city, administrativeLevels, streetName, zipcode } = loc[0];
      const { level1long, level1short } = administrativeLevels;

      if (streetName || zipcode) {
        const radius = 10;

        searchQuery = {
          location: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], radius / 6378.1],
            },
          },
        };
      } else if (city) {
        searchQuery = {
          "location.city": city,
        };
      } else if (level1long || level1short) {
        searchQuery = {
          $or: [
            { "location.state": level1long },
            { "location.stateCode": level1short },
          ],
        };
      }
    }

    this.model = this.model.find(searchQuery);
    return this;
  }

  async availabilityFilter(dateFilters?: DateFilters) {
    const { startDate, endDate } = dateFilters || {
      startDate: "",
      endDate: "",
    };

    const bookedCarsIDs = await Booking.aggregate([
      {
        $match: {
          $or: [
            // Condition 1: Booking overlaps with search range
            {
              startDate: { $lte: new Date(endDate) },
              endDate: { $gte: new Date(startDate) },
            },
            // Condition 2: Booking completely covers with search range
            {
              startDate: { $lte: new Date(startDate) },
              endDate: { $gte: new Date(endDate) },
            },
            // Condition 3: Booking is completely within search range
            {
              startDate: { $gte: new Date(startDate) },
              endDate: { $lte: new Date(endDate) },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          bookedCars: { $addToSet: "$car" },
        },
      },
    ]);

    let bookedCarIds = [];
    if (bookedCarsIDs.length > 0) {
      bookedCarIds = bookedCarsIDs[0].bookedCars;
    }

    this.model = this.model.find({ _id: { $nin: bookedCarIds } });
    return this;
  }

  filters(filters: any) {
    const filtersCopy = { ...filters };

    let filtersStr = JSON.stringify(filtersCopy);
    filtersStr = filtersStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.model = this.model.find(JSON.parse(filtersStr));
    return this;
  }

  pagination(page: string | number, resPerPage: number) {
    const currentPage = Number(page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.model = this.model.limit(resPerPage).skip(skip);
    return this;
  }

  populate(field: string) {
    this.model = this.model.populate(field);
    return this;
  }
}

export default APIFilters;
