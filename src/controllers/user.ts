import { AppRequestHandler } from '../utils/types';
import { AppError } from '../utils/app-error';
import { mediaRepository } from '../db/repositories/repository';
import { userRepository } from '../db/repositories/repository';
import bcrypt from 'bcryptjs';
import { validatePassword } from '../utils/validations';
import fs from 'node:fs';
import path from 'node:path';

const getUser: AppRequestHandler = async (req, res) => {
  const user = await userRepository.findOne({
    where: { email: req.user.email },
    relations: ['media']
  });

  if (!user) {
    throw new AppError('Something went wrong', 500);
  }

  res.status(200).json({
    fullName: user.fullName,
    email: user.email,
    avatar: user.media?.filePath || null
  });
};

const changeUserName: AppRequestHandler = async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    throw new AppError('Name is missing', 400);
  }

  const user = await userRepository.findOne({
    where: { email: req.user.email }
  });

  user.fullName = fullName;

  await userRepository.save(user);

  res.status(200).json({ fullName: user.fullName, email: user.email });
};

const changeUserPassword: AppRequestHandler = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new AppError('Passwords is missing', 400);
  }

  const user = await userRepository.findOne({
    where: { email: req.user.email }
  });

  const isPasswordsMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordsMatch) {
    throw new AppError('Incorrect password or email', 400);
  }

  validatePassword(newPassword);

  user.password = await bcrypt.hash(newPassword, 10);

  await userRepository.save(user);

  res.status(200).json({ status: 'ok' });
};

const changeUserAvatar: AppRequestHandler = async (req, res) => {
  const avatar = req.file;

  if (!avatar) {
    throw new AppError('No file uploaded', 400);
  }

  const newAvatar = mediaRepository.create({
    originalName: avatar.originalname,
    uploadName: avatar.filename,
    filePath: avatar.path,
    mimeType: avatar.mimetype,
    size: avatar.size,
  });

  await mediaRepository.save(newAvatar);

  const user = await userRepository.findOne({ where: { email: req.user.email }, relations: ['media'] });


  const prevMediaId = user.media?.id;
  const prevMediaName = user.media?.uploadName;

  user.media = newAvatar;

  await userRepository.save(user);

  if(prevMediaId) {
    await mediaRepository.delete(prevMediaId);

    const filePath = path.join(__dirname, '../../uploads/', prevMediaName);

    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).send('Файл не найден');
        }
        return res.status(500).send('Ошибка при удалении файла');
      }
    });
  }

  res.status(200).json({ avatar: user.media.filePath });
};

export default {
  changeUserName,
  changeUserPassword,
  changeUserAvatar,
  getUser
};