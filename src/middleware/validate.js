import { StatusCodes } from "http-status-codes";

const validateRequiredFields = (fields = []) => {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
};

export default validateRequiredFields;
