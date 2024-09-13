import { Module } from '@nestjs/common';
import { EntregableService } from './entregable.service';
import { EntregableController } from './entregable.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entregable } from './entities/entregable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entregable])],
  controllers: [EntregableController],
  providers: [EntregableService],
})
export class EntregableModule {}
