import { StatusCodes } from "http-status-codes";

const joiValidate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.details.map((item) => item.message).join(", "),
      });
    }

    req[property] = value;
    next();
  };
};

export default joiValidate;
