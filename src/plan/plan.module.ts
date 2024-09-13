import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Beneficio } from './entities/plan-beneficio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Beneficio])],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
