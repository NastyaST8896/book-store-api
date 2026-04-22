import Joi, { ObjectSchema } from 'joi';

const getBooks = Joi.object().keys({
  page: Joi.number().integer(),
  limit: Joi.number().integer(),
  sortBy: Joi.string().custom((value) => {

    switch (value) {
      case '1':
        return 'price'
      case '2':
        return 'title'
      case '3':
        return 'author'
      case '4':
        return 'rating'
      case '5':
        return 'releaseDate'
    }
  }),
  maxPrice: Joi.number(),
  minPrice: Joi.number(),
  genres: Joi.alternatives().try(
    Joi.string().custom((value) => {
      return value.split(',')
        .map((item: string) => Number(item.trim()));
    })
  ),
  searchValue: Joi.alternatives().try(
    Joi.string().custom((value) => {
      return value.split(' ')
        .map((item: string) => item.trim())
        .filter((item: string) => item !== '')
    })
  ),
});

const setBookRating = Joi.object().keys({
  bookId: Joi.number(),
  rating: Joi.number(),
});

const getBookComments = Joi.object().keys({
  page: Joi.number().integer(),
  limit: Joi.number().integer(),
});

export default {
  'get-books': getBooks,
  'set-rating': setBookRating,
  'get-book-comments': getBookComments
} as { [key: string]: ObjectSchema };