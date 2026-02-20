import { RequestHandler } from "express";
import schemas from "./schemas";

const schemaValidator = (path: string, useJoiError = true): RequestHandler => {
  const schema = schemas[path];

  if (!schema) {
    throw new Error(`Schema not found for path: ${path}`);
  }

  return (req, res, next) => {

     const { error, value } = schema.validate(req.query);

     if(error) {
      return res.status(422).json(error)
     }

    return next();
  }
}

export default schemaValidator;