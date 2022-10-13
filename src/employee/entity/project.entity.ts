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

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  duration: string;

  @Column({ nullable: false })
  role: string;

  @Column({ nullable: false })
  team_size: string;

  @Column({ nullable: false })
  description: string;

  @Column('text', { array: true })
  responsibilities: string[];

  @ManyToMany(() => TechnologyEntity, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  technologies: TechnologyEntity[];

  @ManyToOne(() => EmployeeEntity, (employee) => employee.projects, {
    orphanedRowAction: 'delete',
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee' })
  employee: EmployeeEntity;
}
