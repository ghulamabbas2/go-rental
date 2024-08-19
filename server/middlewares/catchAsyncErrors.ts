import { NotFoundError } from "../utils/errorHandler";

export default (controllerFunction: Function) =>
  (...args: any[]) =>
    Promise.resolve(controllerFunction(...args)).catch((error) => {
      // hanlde error

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
