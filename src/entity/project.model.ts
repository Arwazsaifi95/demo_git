import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.model";
import { ProjectFile } from "./project-file.model";

@Entity()
class Project {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v4()' })
  id!: string;

  @Column()
  title!: string;

  @Column()
  image!: string;

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

  @ManyToOne(() => User, (user) => user.project)
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToMany(() => ProjectFile, projectFile => projectFile.project)
  projectFile!: ProjectFile[];
}

export { Project };
