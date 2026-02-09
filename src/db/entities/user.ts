import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh-token';
import jwt from 'jsonwebtoken';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  generateToken() {
    return jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
  }
}


