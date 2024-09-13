import { Module } from '@nestjs/common';
import { ForoService } from './foro.service';
import { ForoController } from './foro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foro } from './entities/foro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foro]),],
  controllers: [ForoController],
  providers: [ForoService],
})
export class ForoModule {}
