import { bookRepository, genreRepository, ratingRepository } from '../db/repositories/repository';
import { Book } from '../db/entities/book';
import { Genre } from '../db/entities/genre';

import { Media } from '../db/entities/media';
import { Between, In, Not } from 'typeorm';
import { AppRequestHandler } from '../utils/types';

const createBook: AppRequestHandler = async (req, res) => {
  const { title, author, releaseDate, genres, price, rating } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'Image is required' });
  }

  let dbGenres: Genre[] = [];
  let dbNewGenres: Genre[] = [];

  if (genres) {
    const arrayGenres = genres.split(', ');

    dbGenres = await genreRepository.find({
      where: { name: In(arrayGenres) },
    })

    const dbNameGenres = dbGenres.map((genre) => {
      return genre.name
    })

    const newGenres = arrayGenres.filter((genre) => {
      return !dbNameGenres.includes(genre)
    })

    const addGenres = newGenres.map((name: string) => {
      const genre = new Genre();
      genre.name = name;
      return genre;
    });

    await genreRepository.save(addGenres);

    dbNewGenres = await genreRepository.find({
      where: { name: In(newGenres) }
    })
  }


  const media = new Media();
  media.originalName = file.originalname;
  media.uploadName = file.filename;
  media.filePath = file.path;
  media.mimeType = file.mimetype;
  media.size = file.size;

  const book = new Book();
  book.title = title;
  book.author = author;
  book.releaseDate = releaseDate;
  book.price = price;
  book.rating = rating;
  book.media = media;
  book.genres = [...dbGenres, ...dbNewGenres]

  await bookRepository.save(book);

  return res.status(201).json(book);
};

const getBooks: AppRequestHandler = async (req, res) => {
  const page = req.validatedQuery.page || 1;
  const limit = req.validatedQuery.limit || 8;
  const sortBy = req.validatedQuery.sortBy || 'id';
  const genres = req.validatedQuery.genres;

  const where: any = {};

  where.price = Between(
    req.validatedQuery.minPrice || 0,
    req.validatedQuery.maxPrice || Infinity
  );

  const range = await bookRepository
    .createQueryBuilder('books')
    .select('MIN(books.price)', 'minPrice')
    .addSelect('MAX(books.price)', 'maxPrice')
    .getRawOne();

  const skip = (page - 1) * limit;

  const allGenres = await genreRepository.find();

  if (genres?.length) {
    where.genres = {
      name: In(genres),
    }
  }

  const [books, total] = await bookRepository.findAndCount({
    relations: {
      media: true,
      booksRating: true,
    },
    skip,
    take: limit,
    where,
    order: {
      [sortBy]: 'asc',
    },
  });

  const getAverageRating = (booksRating) => {

    if (booksRating.length) {
      const rating = booksRating
        .map((item) => {
          return item.rating
        });

      const ratingFinal = rating.reduce((accum, item) => accum + item, 0) / rating.length;
      return ratingFinal.toFixed(1);
    } else {
      return '0.0';
    }
  }
  // const booksRating = await ratingRepository.find({
  //   where: { bookId: +req.params.id }
  // });

  // let ratingBook: string;

  // if(bookRating.length) {
  //   const rating = bookRating
  //   .map((item) => {
  //     return item.rating
  //   });

  //   const ratingFinal = rating.reduce((accum, item) => accum + item, 0) / rating.length;
  //   ratingBook = ratingFinal.toFixed(1);
  // } else {
  //   ratingBook = '0.0';
  // }

  const result = books.map((book: Book) => ({
    ...book,
    media: book.media.filePath,
    booksRating: getAverageRating(book.booksRating) 
  }));

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    books: result,
    totalPages,
    genres: allGenres,
    maxPrice: +range.maxPrice,
    minPrice: +range.minPrice,
  });

  // const books = await bookRepository.find();
  //
  //
  // const likedBookIds = await AppDataSource
  //   .createQueryBuilder()
  //   .select('like.bookId', 'bookId')
  //   .from('user_book_likes', 'like')
  //   .where('like.userId = :userId', { userId: null })
  //   .getRawMany()
  //   .then(rows => rows.map(row => row.bookId));
  //
  // const likedSet = new Set(likedBookIds);
  //
  // res.status(200).json({
  //   b: books.map(book => ({
  //     ...book,
  //     liked: likedSet.has(book.id)
  //   }))
  // });
};

const getBook: AppRequestHandler = async (req, res) => {
  const book = await bookRepository.findOne({
    relations: { media: true },
    where: { id: +req.params.id }
  });

  const bookRating = await ratingRepository.find({
    where: { bookId: +req.params.id }
  });

  let ratingBook: string;

  if (bookRating.length) {
    const rating = bookRating
      .map((item) => {
        return item.rating
      });

    const ratingFinal = rating.reduce((accum, item) => accum + item, 0) / rating.length;
    ratingBook = ratingFinal.toFixed(1);
  } else {
    ratingBook = '0.0';
  }

  const recommendedBooks = await bookRepository.find({
    relations: { media: true },
    where: { id: Not(+req.params.id) },
    take: 4
  });

  const result = recommendedBooks.map((book: Book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    price: book.price,
    rating: book.rating,
    media: book.media.filePath
  }));

  res.status(200).json({
    id: book.id,
    title: book.title,
    author: book.author,
    price: book.price,
    rating: ratingBook,
    media: book.media.filePath,
    description: book.description,
    recommended: result,
  });
};

// const getRecommendedBooks: AppRequestHandler = async (req, res) => {

//   const recommendedBooks = await bookRepository.find({
//     relations: { media: true },
//     where: { id: Not(+req.params.id) },
//     take: 4
//   });

//   const result = recommendedBooks.map((book: Book) => ({
//     id: book.id,
//     title: book.title,
//     author: book.author,
//     price: book.price,
//     rating: book.rating,
//     media: book.media.filePath
//   }));

//   res.status(200).json({ result });
// };
export default { createBook, getBooks, getBook };