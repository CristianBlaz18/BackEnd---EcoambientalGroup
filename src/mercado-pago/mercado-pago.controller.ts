import { Controller } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  // @Post('pago')
  // crearPago() {
  //   return this.mercadoPagoService.crearPago();
  // }

  // @Post('webhook')
  // receiveWebhook(@Query() payment1,@Res() res){
  //   return this.mercadoPagoService.receiveWebhook(payment1,res)
  // }
}
