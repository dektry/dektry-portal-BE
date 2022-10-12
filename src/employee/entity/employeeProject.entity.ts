import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { TechnologyEntity } from './technology.entity';

@Entity({ name: 'employee_projects' })
export class EmployeeProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  duration: string;

  @Column({ default: '' })
  role: string;

  @Column({ default: '' })
  team_size: string;

  @Column({ default: '' })
  description: string;

  @Column('text', { array: true })
  responsibilities: string[];

  @ManyToMany(() => TechnologyEntity, (technology) => technology.projects, {
    eager: true,
  })
  @JoinColumn({ name: 'technology_id' })
  technologies: TechnologyEntity[];

  @ManyToOne(() => EmployeeEntity, (employee) => employee.project, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;
}
