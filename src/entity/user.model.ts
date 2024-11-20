import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Folder } from "./folder.model";
import { Project } from "./project.model";
@Entity()
export class User {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v4()' })
  id!: string;
  @Column()
  email!: string;
  @Column()
  password!: string;
  @Column()
  locations!: string;
  @Column()
  username!: string;
  @Column({default:''})
  profileImage!: string;

  @OneToMany(() => Folder, folder => folder.user)
  folder!: Folder[];

  @OneToMany(() => Project, project => project.user)
  project!: Project[];
}
