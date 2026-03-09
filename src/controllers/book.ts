import {
  bookRepository,
  genreRepository,
  ratingRepository, userRepository
} from '../db/repositories/repository';
import { Book } from '../db/entities/book';
import { Genre } from '../db/entities/genre';

import { Media } from '../db/entities/media';
import { Between, In, Not } from 'typeorm';
import { AppRequestHandler } from '../utils/types';
import { BooksRating } from '../db/entities/books-rating';

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

  where.price = Between(req.validatedQuery.minPrice || 0, req.validatedQuery.maxPrice || Infinity);

  const skip = (page - 1) * limit;

  if (genres?.length) {
    where.genres = {
      id: In(genres),
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

  const getAverageRating = (booksRating: BooksRating[]): string => {

    if (booksRating.length) {
      const rating = booksRating
        .map((item) => {
          return item.rating
        });

      const ratingFinal = rating
        .reduce(
          (accum: number, item: number) => accum + item, 0
        ) / rating.length;
      return ratingFinal.toFixed(1);
    } else {
      return '0.0';
    }
  }

  const result = books.map((book: Book) => ({
    ...book,
    media: book.media.filePath,
    booksRating: getAverageRating(book.booksRating)
  }));

  const totalPages = Math.ceil(total / limit);

  const nextPage = (totalPages: number, page: number): number => {
    const next = page + 1

    if (next > totalPages) {
      return null;
    }

    return next;
  }

  const prevPage = (page: number): number => {
    const next = page - 1

    if (next <= 0) {
      return null;
    }

    return next;
  }

  return res.status(200).json({
    data: {
      books: result,
    },
    meta: {
      pagination: {
        perPage: limit,
        currentPage: page,
        nextPage: nextPage(totalPages, page),
        prevPage: prevPage(page),
        totalPages,
        totalAmount: total
      }
      // maxPrice: +range.maxPrice,
    }
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

const getAllGenres: AppRequestHandler = async (_, res) => {
  const allGenres = await genreRepository.find();
  const data = {
    data: { allGenres }
  }
  return res.status(200).json(data);
};

const getMaxPrice: AppRequestHandler = async (_, res) => {
  const price = await bookRepository
    .createQueryBuilder('books')
    .select('MAX(books.price)', 'max')
    .getRawOne();
  const data = {
    data: { maxPrice: price.max }
  }
  return res.status(200).json(data);
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

    const ratingFinal = rating
      .reduce(
        (accum, item) => accum + item, 0) / rating.length;
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
    data: {
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        rating: ratingBook,
        media: book.media.filePath,
        description: book.description,
      },
      recommended: result,
    }
  });
};

const setBookRating = async (req, res) => {
  const book = await bookRepository.findOne({
    where: { id: +req.body.bookId }
  });

  const user = await userRepository.findOne({
    where: { id: +req.body.userId }
  })

  if(book && user) {
    const bookRating = new BooksRating();
    bookRating.bookId = book.id;
    bookRating.userId = user.id;
    bookRating.rating = req.body.rating;

    await ratingRepository.save(bookRating);

    return res.status(200).send();
  }
}
export default { createBook, getBooks, getBook, getAllGenres, getMaxPrice, setBookRating };