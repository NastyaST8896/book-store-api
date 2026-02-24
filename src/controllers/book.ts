import { Response } from 'express';
import { bookRepository } from '../db/repositories/repository';
import { Book } from '../db/entities/book';

import { Media } from '../db/entities/media';
import { Between } from 'typeorm';
import { AppDataSource } from '../config/database';

const createBook = async (req, res: Response) => {
  const { title, author, releaseDate, genre, price, rating } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'Image is required' });
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
  book.genre = genre;
  book.price = price;
  book.rating = rating;
  book.media = media;

  await bookRepository.save(book);

  return res.status(201).json(book);
};

const getBooks = async (req, res: Response) => {
  let page = req.query.page || 1;
  const limit = req.query.limit || 4;

  const filterBy = req.query.filter || 'id';



  const where: any = {};

  where.price = Between(
    req.query.minPrice || 0,
    req.query.maxPrice || Infinity
  );

  const skip = (page - 1) * limit;

  const genres = await bookRepository.find({
    select: ['genre']
  });

  const noRepeatGenres = genres.map((item) => {
    return item.genre;
  })

  console.log(noRepeatGenres);

  const [books, total] = await bookRepository.findAndCount({
    relations: {
      media: true,
    },
    skip,
    take: limit,
    order: {
      [filterBy]: 'asc',
    },
    where,
  });

  const result = books.map((book: Book) => ({
    ...book,
    media: book.media.filePath
  }));

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({ books: result, totalPages });

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