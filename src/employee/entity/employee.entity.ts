import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'employee' })
export class EmployeeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  pfId: number;

  @Column({ nullable: true })
  pfUpdatedAt: string;

  @Column({ length: 255, nullable: true })
  fullName: string;

  @Column({ length: 255, nullable: true })
  position: string;

  @Column({ length: 255, nullable: true })
  level: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ length: 40, nullable: true })
  timezone: string;

  @Column({ type: 'json', nullable: true })
  languages: string;

  @Column({ type: 'json', nullable: true })
  formalEducation: string;

  // The date from which the employee's work experience is calculated
  @Column({ type: 'timestamp', nullable: true })
  startingPoint: string;

  @Column({ type: 'json', nullable: true })
  interests: string;
}
