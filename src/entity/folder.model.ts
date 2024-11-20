import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.model";
import { FolderFile } from "./folder-file.model";

@Entity()
class Folder {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  userId!: string;

  @Column({default:false})
  isFavourite!: boolean;

  @Column({default:false})
  isShared!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.folder)
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToMany(() => FolderFile, (folderFile) => folderFile.folder)
  folderFile!: FolderFile[];
}

export { Folder };
