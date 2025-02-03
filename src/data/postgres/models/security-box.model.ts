// src/data/postgress/models/security-box.model.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.model";

@Entity("security_box")
export class SecurityBox {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ default: true })
  favorite: boolean;

  @Column({ length: 20 })
  icon: string;

  @Column({ type: "enum", enum: ["ACTIVE", "DELETED"], default: "ACTIVE" })
  status: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
