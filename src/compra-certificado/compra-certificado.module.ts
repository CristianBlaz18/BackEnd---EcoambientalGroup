import { Module } from '@nestjs/common';
import { CompraCertificadoService } from './compra-certificado.service';
import { CompraCertificadoController } from './compra-certificado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompraCertificado } from './entities/compra-certificado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompraCertificado])],
  controllers: [CompraCertificadoController],
  providers: [CompraCertificadoService],
  exports:[CompraCertificadoService]
})
export class CompraCertificadoModule {}
