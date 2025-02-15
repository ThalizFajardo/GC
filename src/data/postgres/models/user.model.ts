// src/data/postgress/models/user.model.ts
import {
  Entity,
  BaseEntity,
  BeforeInsert,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from "typeorm";
import { SecurityBox } from "./security-box.model";
import { Pin } from "./pin.model";
import { encriptAdapter } from "../../../config";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100, type: "varchar" })
  name: string;

  @Column({ length: 100, type: "varchar" })
  surname: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 20, unique: true })
  cellphone: string;

  @Column({ length: 255, type: "varchar" })
  password: string;

  @Column({ default: true, type: "boolean" })
  status: boolean;

  @OneToMany(() => SecurityBox, (securityBox) => securityBox.user)
  securityBoxes: SecurityBox[];

  @OneToOne(() => Pin, (pin) => pin.user)
  pin: Pin;

  @BeforeInsert()
  encryptedPassword() {
    this.password = encriptAdapter.hash(this.password);
  }
}
