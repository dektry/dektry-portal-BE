import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
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

  @Column({ unique: true })
  name: string;
}
