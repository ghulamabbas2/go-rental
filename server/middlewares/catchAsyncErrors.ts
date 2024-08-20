import { NotFoundError } from "../utils/errorHandler";

export default (controllerFunction: Function) =>
  (...args: any[]) =>
    Promise.resolve(controllerFunction(...args)).catch((error) => {
      if (error?.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
        throw new Error(message);
      }

      if (error.name === "CastError") {
        const message = `Resource not found. Invalid: ${error.path}`;
        throw new NotFoundError(message);
      }

      if (error.name === "ValidationError") {
        const message = Object.values(error.errors).map(
          (value: any) => value.message
        );
        const combinedErrorMessage = message.join(", ");
        throw new Error(combinedErrorMessage);
      }

      throw error;
    });
