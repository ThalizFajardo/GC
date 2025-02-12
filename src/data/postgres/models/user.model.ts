// src/data/postgress/models/user.model.ts
import { Entity, BaseEntity,BeforeInsert, PrimaryGeneratedColumn, Column } from "typeorm";
import { encriptAdapter } from "../../../config";

@Entity("users")
export class User extends BaseEntity {
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

  @Column({ length: 255 })
  pin: string;

  @Column({ default: true })
  status: boolean;

  @BeforeInsert()
  encryptedPassword() {
    this.password = encriptAdapter.hash(this.password)
  }
}
