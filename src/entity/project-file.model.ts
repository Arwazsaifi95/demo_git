import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./project.model";
@Entity()
export class ProjectFile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({default:false})
  isFavourite!: boolean;

  @Column({default:false})
  isShared!: boolean;

  @Column()
  projectId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Project, (project) => project.projectFile)
  @JoinColumn({ name: "projectId" })
  project!: Project;
}
