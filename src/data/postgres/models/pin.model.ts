// src/data/postgress/models/pin.model.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { CredentialStorage } from "./credetia-storage";
import { User } from "./user.model";

@Entity("pin")
export class Pin extends BaseEntity{
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  code: string;

  @OneToMany(
    () => CredentialStorage,
    (CredentialStorage) => CredentialStorage.pin
  )
  CredentialStorages: CredentialStorage[];

  @OneToOne(() => User, (user) => user.pin)
  @JoinColumn({ name: "user_id" })
  user: User;
}
