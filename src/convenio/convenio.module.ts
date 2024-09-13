import { Module } from '@nestjs/common';
import { ConvenioService } from './convenio.service';
import { ConvenioController } from './convenio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convenio } from './entities/convenio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Convenio])],
  controllers: [ConvenioController],
  providers: [ConvenioService],
})
export class ConvenioModule {}
