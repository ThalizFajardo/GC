import { User } from "./user.model";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { CredentialStorage } from "./credetia-storage"; 

export enum securityBoxStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}



@Entity()
export class SecurityBox extends BaseEntity {
  favorite: boolean;

  @Column({ length: 20, type: "varchar" })
  icon: string;

  @Column({
      type: "enum",
      enum: securityBoxStatus,
      default: securityBoxStatus.ACTIVE,
  })
  status: securityBoxStatus;

  @ManyToOne(() => User, (user) => user.securityBoxes)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(
      () => CredentialStorage,
      (credentialStorage) => credentialStorage.securityBox
  )
  credentialStorages: CredentialStorage[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
