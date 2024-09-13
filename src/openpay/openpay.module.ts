import { Module } from '@nestjs/common';
import { OpenpayService } from './openpay.service';
import { OpenpayController } from './openpay.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Openpay} from './entities/openpay.entity';
import { CompraCertificadoModule } from 'src/compra-certificado/compra-certificado.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  
  imports: [TypeOrmModule.forFeature([Openpay]),CompraCertificadoModule,HttpModule],
  controllers: [OpenpayController],
  providers: [OpenpayService],
})
export class OpenpayModule {}
