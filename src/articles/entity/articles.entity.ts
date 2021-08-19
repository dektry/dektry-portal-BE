import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
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

  @ManyToMany(() => PositionEntity, (position) => position.read, {
    eager: true,
  })
  read_positions: PositionEntity[];

  @ManyToMany(() => PositionEntity, (position) => position.edit, {
    eager: true,
  })
  edit_positions: PositionEntity[];

  // @ManyToMany(() => PositionEntity, (position) => position.create, {
  //   eager: true,
  // })
  // create_positions: PositionEntity[];
}
