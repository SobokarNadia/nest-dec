import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarController } from './car.controller';
import { Car } from './car.entity';
import { CarService } from './car.service';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  providers: [CarService],
  controllers: [CarController],
  exports: [],
})
export class CarModule {}
