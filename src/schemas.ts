import Joi, { ObjectSchema } from 'joi';

const getBooks = Joi.object().keys({
  page: Joi.number().integer(),
  limit: Joi.number().integer(),
  sortBy: Joi.string().custom((value) => {

    switch (value) {
      case '1':
        return 'price'
        break;
      case '2':
        return 'title'
        break;
      case '3':
        return 'author'
        break;
      case '4':
        return 'rating'
        break;
      case '5':
        return 'releaseDate'
        break;
    }
  }),
  maxPrice: Joi.number(),
  minPrice: Joi.number(),
  genres: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().custom((value) => {
      return value.split(',')
        .map((item: string) => item.trim())
        .map((item: string) => Number(item));
    })
  )
});

export default {
  'get-books': getBooks,
} as { [key: string]: ObjectSchema };