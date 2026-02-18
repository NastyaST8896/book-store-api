import { Response } from 'express';
import { AppRequest } from '../utils/types';
import { AppError } from '../utils/app-error';
import { mediaRepository } from '../db/repositories/repository';
import { userRepository } from '../db/repositories/repository';
import bcrypt from 'bcryptjs';
import { validatePassword } from '../utils/validations';

const getUser = async (req, res: Response) => {
  const user = await userRepository.findOne({
    where: { email: req.user.email },
    relations: ['media']
  });

  if (!user) {
    throw new AppError('Something went wrong', 500);
  }

  const avatar = await mediaRepository.findOne({
    where: {id: user.media.id}
  })

  res.status(200).json({
    fullName: user.fullName, 
    email: user.email, 
    avatar: avatar.filePath
  });
}

const changeUserName = async (req: AppRequest, res: Response) => {
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

const changeUserPassword = async (req: AppRequest, res: Response) => {
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

const changeUserAvatar = async (req, res) => {
  const avatar = req.file;

  if (!avatar) {
    throw new AppError("No file uploaded", 400);
  }

  const newAvatar = mediaRepository.create({
    originalName: avatar.originalname,
    uploadName: avatar.filename,
    filePath: avatar.path,
    mimeType: avatar.mimetype,
    size: avatar.size,
  })

  await mediaRepository.save(newAvatar);

  const user = await userRepository.update({
    email: req.user.email
  }, {
    media: newAvatar
  });

  console.log(user);

  res.status(200).json({ status: 'ok' });
};

  export default {
    changeUserName,
    changeUserPassword,
    changeUserAvatar,
    getUser
  };