import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PositionEntity } from '../../users/entity/position.entity';

@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'timestamptz' })
  create_at: Date;

  @Column({ type: 'timestamptz' })
  update_at: Date;

  @ManyToMany(() => PositionEntity)
  @JoinTable()
  read_positions: PositionEntity[];

  @ManyToMany(() => PositionEntity)
  @JoinTable()
  edit_positions: PositionEntity[];
}
