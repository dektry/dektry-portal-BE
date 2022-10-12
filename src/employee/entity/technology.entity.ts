import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { EmployeeProjectEntity } from './employeeProject.entity';

@Entity({ name: 'technologies' })
export class TechnologyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name: string;

  @ManyToMany(
    () => EmployeeProjectEntity,
    (technology) => technology.technologies,
  )
  @JoinColumn({ name: 'project_id' })
  projects: EmployeeProjectEntity[];
}
