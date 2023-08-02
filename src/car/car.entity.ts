import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  model: string;

  @Column({ type: 'varchar', nullable: false })
  brand: string;

  @Column({ type: 'boolean', default: true })
  accidents: boolean;

  @Column({ type: 'int', nullable: true })
  year: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
