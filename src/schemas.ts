import Joi, { ObjectSchema } from 'joi';

const getBooks = Joi.object().keys({
  page: Joi.number().integer(),
  limit: Joi.number().integer(),
  sortBy: Joi.string().custom((value) => {

    switch (value) {
      case 'Price':
        return 'price'
        break;
      case 'Name':
        return 'title'
        break;
      case 'Author name':
        return 'author'
        break;
      case 'Rating':
        return 'rating'
        break;
      case 'Date of issue':
        return 'releaseDate'
        break;
    }
  }),
  maxPrice: Joi.number(),
  minPrice: Joi.number(),
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