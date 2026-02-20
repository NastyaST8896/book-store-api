import { Response } from 'express';
import { bookRepository } from '../db/repositories/repository';
import { Book } from '../db/entities/book';

import { Media } from '../db/entities/media';
import { AppRequest } from '../utils/types';
import { Between, In, Or, Like } from 'typeorm';

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
  const limit = req.query.limit || 12;

  const filterBy = req.query.filter;

  const stringGenres = req.query.genres;

  const where: any = {};
  
  where.price = Between(
    req.query.minPrice 
    || 0, req.query.maxPrice 
    || Infinity);
  

  const skip = (page - 1) * limit;

  console.log('genres =>', stringGenres)



  const [books, total] = await bookRepository.findAndCount({
    skip,
    take: limit,
    order: {
      [filterBy]: 'asc',
    },
    where
  });

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({ books, totalPages });
};

export default { createBook, getBooks };