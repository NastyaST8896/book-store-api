import {
  bookRepository,
  genreRepository,
  ratingRepository
} from '../db/repositories/repository';
import { Book } from '../db/entities/book';
import { Genre } from '../db/entities/genre';

import { Media } from '../db/entities/media';
import { Between, ILike, In, Not } from 'typeorm';
import { AppRequestHandler } from '../utils/types';
import { BooksRating } from '../db/entities/books-rating';

const getAverageRating = (booksRating: BooksRating[]): string => {

  if (booksRating.length) {
    const rating = booksRating
      .map((item) => {
        return item.rating;
      });

    const ratingFinal = rating
      .reduce(
        (accum: number, item: number) => accum + item, 0
      ) / rating.length;
    return ratingFinal.toFixed(1);
  } else {
    return '0.0';
  }
};

const createBook: AppRequestHandler = async (req, res) => {
  const {
    title,
    author,
    releaseDate,
    genres,
    price,
    availableCount
  } = req.body;
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
    });

    const dbNameGenres = dbGenres.map((genre) => {
      return genre.name;
    });

    const newGenres = arrayGenres.filter((genre: string) => {
      return !dbNameGenres.includes(genre);
    });

    const addGenres = newGenres.map((name: string) => {
      const genre = new Genre();
      genre.name = name;
      return genre;
    });

    await genreRepository.save(addGenres);

    dbNewGenres = await genreRepository.find({
      where: { name: In(newGenres) }
    });
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
  book.rating = 0.0;
  book.media = media;
  book.genres = [...dbGenres, ...dbNewGenres];
  book.availableCount = availableCount;

  await bookRepository.save(book);

  return res.status(201).json(book);
};

const getBooks: AppRequestHandler = async (req, res) => {
  const page = req.validatedQuery?.page || 1;
  const limit = req.validatedQuery?.limit || 8;
  const sortBy = req.validatedQuery?.sortBy || 'id';
  const genres = req.validatedQuery?.genres;
  const searchValue = req.validatedQuery?.searchValue;

  const where: any[] = [];

  const commonWhereOptions = {
    price: Between(
      req.validatedQuery?.minPrice || 0,
      req.validatedQuery?.maxPrice || Infinity
    ),
    genres: {
      id: (genres?.length && In(genres)),
    }
  };

  if (Array.isArray(searchValue)) {

    searchValue.map((item: string) => (
      where.push({
        title: ILike(`%${item}%`),
        ...commonWhereOptions
      })
    ));

    searchValue.map((item: string) => (
      where.push({
        author: ILike(`%${item}%`),
        ...commonWhereOptions
      })
    ));
  } else {
    where.push(commonWhereOptions);
  }

  const skip = (page - 1) * limit;

  const [books, total] = await bookRepository.findAndCount({
    where,
    relations: {
      media: true,
      booksRating: true,
    },
    skip,
    take: limit,
    order: {
      [sortBy]: 'asc',
    },
  });

  const result = books.map((book: Book) => {

    return {
      ...book,
      media: `${process.env.BASE_URL + book.media.filePath}`,
      booksRating: getAverageRating(book.booksRating),
    };
  });

  const totalPages = Math.ceil(total / limit);

  const nextPage = (totalPages: number, page: number): number | null => {
    const next = page + 1;

    if (next > totalPages) {
      return null;
    }

    return next;
  };

  const prevPage = (page: number): number | null => {
    const next = page - 1;

    if (next <= 0) {
      return null;
    }

    return next;
  };

  return res.json({
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
  // res.json({
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
  };
  return res.json(data);
};

const getMaxPrice: AppRequestHandler = async (_, res) => {
  const price = await bookRepository
    .createQueryBuilder('books')
    .select('MAX(books.price)', 'max')
    .getRawOne();
  const data = {
    data: { maxPrice: price.max }
  };
  return res.json(data);
};


const getBook: AppRequestHandler = async (req, res) => {
  const book = await bookRepository.findOne({
    relations: { media: true, booksRating: true },
    where: { id: +req.params.id }
  });

  if (!book) {
    throw new Error('Book not found');
  }

  let currentUserRating: number | null = 0;

  if (req.query.userId) {
    const userRating = await ratingRepository.findOne({
      where: {
        userId: +req.query.userId,
        bookId: book.id,
      }
    });

    currentUserRating = userRating?.rating || null;
  }

  res.json({
    data: {
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        booksRating: book.rating.toFixed(1),
        media: `${process.env.BASE_URL + book.media.filePath}`,
        description: book.description,
        userRating: currentUserRating,
        availableCount: book.availableCount
      },
    }
  });
};

const getRecommendedBooks: AppRequestHandler = async (req, res) => {
  
   const recommendedBooks = await bookRepository
    .createQueryBuilder('book')
    .leftJoinAndSelect("book.media", "Media")
    .where({ id: Not(+req.params.id) })
    .orderBy('RANDOM()')
    .limit(4)
    .getMany();

  const result = recommendedBooks.map((book: Book) => {

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      booksRating: book.rating.toFixed(1),
      media: `${process.env.BASE_URL + book.media.filePath}`,
      availableCount: book.availableCount,
    };
  });

   res.json({
    data: {
      recommended: result,
    }
  });
};

const setBookRating: AppRequestHandler = async (req, res) => {
  const book = await bookRepository.findOne({
    where: { id: +req.body.bookId }
  });

  if (!book) {
    throw new Error(`Book width id: ${req.body.bookId} not found`);
  }

  if (!req.user) {
    throw new Error('User not found');
  }

  const bookRating = new BooksRating();
  bookRating.bookId = book.id;
  bookRating.userId = req.user.id;
  bookRating.rating = req.body.rating;

  await ratingRepository.save(bookRating);

  const ratingBook = await ratingRepository.find({
    where: { bookId: +req.body.bookId }
  });

  await bookRepository.update(
    { id: +req.body.bookId },
    { rating: +getAverageRating(ratingBook) });

  return res.json({
    data: {
      booksRating: getAverageRating(ratingBook),
      userRating: req.body.rating,
    }
  });
};
export default {
  createBook,
  getBooks,
  getBook,
  getRecommendedBooks,
  getAllGenres,
  getMaxPrice,
  setBookRating
};