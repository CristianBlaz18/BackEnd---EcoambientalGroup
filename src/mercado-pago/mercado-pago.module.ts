import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import * as mercadopagoLib from 'mercadopago';
import { MercadoPagoController } from './mercado-pago.controller';
const mercadopago = mercadopagoLib;
@Module({
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
})
export class MercadoPagoModule {
  constructor() {
    // mercadopago.configure({
    //   access_token: 'TEST-178170114659036-120511-886324257984bdd7caca32081bd07137-1577868181',
    // });
  }
}
