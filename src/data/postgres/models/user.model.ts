// src/data/postgress/models/user.model.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  surname: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 20, unique: true })
  cellphone: string;

  @Column({ length: 255 })
  password: string;

  @Column({ default: true })
  status: boolean;
}
