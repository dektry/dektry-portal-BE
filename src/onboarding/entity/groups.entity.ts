import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TemplatesEntity } from './templates.entity';

@Entity({ name: 'onBoardingGroups' })
export class GroupsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  name: string;

  @OneToMany(() => TemplatesEntity, (template) => template.group)
  @JoinColumn()
  template: TemplatesEntity[];
}
