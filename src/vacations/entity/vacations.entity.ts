import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'vacations' })
export class VacationsEntity extends BaseEntity {}
