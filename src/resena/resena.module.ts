import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { Resena } from './entities/resena.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Resena])],
  controllers: [ResenaController],
  providers: [ResenaService],
})
export class ResenaModule {}
