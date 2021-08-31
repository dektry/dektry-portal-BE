import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity';
import { ProjectEntity } from '../entity/project.entity';

@Entity({ name: 'projects_history' })
export class ProjectHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  from: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  to: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  userId: UserEntity;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'projectId' })
  projectId: ProjectEntity;
}
