// src/data/postgress/models/pin.model.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("pin")
export class Pin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 6 })
  code: string;
}
