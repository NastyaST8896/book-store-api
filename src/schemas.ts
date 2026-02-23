import Joi, { ObjectSchema } from 'joi';

const getBooks = Joi.object().keys({
  page: Joi.number().integer(),
  limit: Joi.number().integer(),
  filter: Joi.string(),
  maxPrice: Joi.number().integer(),
  minPrice: Joi.number().integer(),
  genres: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().custom((value) => {
      return value.split(',').map((item) => item.trim());
    })
  )
});

export default {
  'get-books': getBooks,
} as { [key: string]: ObjectSchema };