import { bookRepository, genreRepository } from '../db/repositories/repository';
import { Book } from '../db/entities/book';
import { Genre } from '../db/entities/genre';

import { Media } from '../db/entities/media';
import { Between, In } from 'typeorm';
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
  const filterBy = req.validatedQuery.filter || 'id';
  const genres = req.validatedQuery.genres;

  const where: any = {};

  where.price = Between(
    req.validatedQuery.minPrice || 0,
    req.validatedQuery.maxPrice || Infinity
  );
  console.log('=========');

  const maxPrice = await bookRepository.maximum('price');
  const minPrice = await bookRepository.minimum('price');

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
    },
    skip,
    take: limit,
    where,
    order: {
      [filterBy]: 'asc',
    },
  });

  const result = books.map((book: Book) => ({
    ...book,
    media: book.media.filePath
  }));

  const totalPages = Math.ceil(total / limit);

  console.log('=========++++');
  return res.status(200).json({ 
    books: result, 
    totalPages, 
    genres: allGenres,
    maxPrice,
    minPrice,
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

export default { createBook, getBooks };