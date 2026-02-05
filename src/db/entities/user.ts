import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  fullName: string

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string
}