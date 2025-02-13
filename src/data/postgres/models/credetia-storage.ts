// src/data/postgress/models/credential-storage.model.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { SecurityBox } from "./security-box.model";
import { Pin } from "./pin.model";

@Entity("credential_storage")
export class CredentialStorage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  account: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ length: 20, nullable: true })
  code_1: string;

  @Column({ length: 20, nullable: true })
  code_2: string;

  @ManyToOne(() => SecurityBox, (securityBox) => securityBox.credentialStorages)
  securityBox: SecurityBox;

  @ManyToOne(() => Pin, (pin) => pin.credentialStorages)
  @JoinColumn({name : "pin_id"})
  pin: Pin;
}
