import schemas from './schemas';
import { AppRequestHandler } from './utils/types';

export const schemaQueryValidator = (path: string): AppRequestHandler => {
  const schema = schemas[path];

  if (!schema) {
    throw new Error(`Schema not found for path: ${path}`);
  }

  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return res.status(422).json(error);
    }

    req.validatedQuery = value;

    return next();
  };
};

