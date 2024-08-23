import mongoose from "mongoose";

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
