import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
@Entity({ name: 'careersLevels' })
export class CareerLevelEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
