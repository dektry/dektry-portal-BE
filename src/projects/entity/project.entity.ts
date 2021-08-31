import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'projects' })
export class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column('uuid', { array: true })
  managers: string[];

  @Column('uuid', { array: true })
  users: string[];

  @Column({ default: false })
  isArchive: boolean;
}
