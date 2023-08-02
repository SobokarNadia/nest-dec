import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Car } from '../car/car.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToMany(() => Car, (car) => car.user, { cascade: true })
  cars: Car[];
}
