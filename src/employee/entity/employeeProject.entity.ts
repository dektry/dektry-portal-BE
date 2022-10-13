import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  JoinTable,
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

  @ManyToMany(() => TechnologyEntity, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  technologies: TechnologyEntity[];

  @ManyToOne(() => EmployeeEntity, (employee) => employee.project, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee' })
  employee: EmployeeEntity;
}
