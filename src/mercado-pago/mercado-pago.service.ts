import { Injectable } from '@nestjs/common';

@Injectable()
export class MercadoPagoService {
  // async crearPago() {
  //   try {
  //     const client = new MercadoPagoConfig({
  //       accessToken:
  //         'TEST-6490782267585649-121211-d82dff7571f6ba8368235536165ec786-1588539021',
  //       options: { timeout: 5000 },
  //     });
  //     const preference = new Preference(client);
  //     const result = await preference.create({
  //       body: {
  //         items: [
  //           {
  //             id: '1',
  //             title: 'Curso de prueba',
  //             quantity: 1,
  //             unit_price: 100,
  //           },
  //         ],
  //         notification_url:
  //           'https://9d27-179-6-45-50.ngrok-free.app/api/v1/mercado-pago/webhook',
  //       },
  //     });
  //     //console.log("DataPay");
  //     //console.log(result);
  //     //para compras reales se debe quitar sandbox
  //     const initPointUrl = result.init_point;
  //     const id = result.id;
  //     return { link_pago: initPointUrl, id: id };
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Error al crear pago ' + error.message);
  //   }
  // }
  // async receiveWebhook(payment1, res) {
  //   try {
  //     const client = new MercadoPagoConfig({
  //       accessToken:
  //         'TEST-6490782267585649-121211-d82dff7571f6ba8368235536165ec786-1588539021',
  //     });
  //     const payment = new Payment(client);
  //     console.log('Query');
  //     console.log(payment1);
  //     if (payment1.type === 'payment') {
  //       const data = await payment.get({
  //         id: payment1['data.id'],
  //       });
  //       const webhookData = {
  //         status: data.status,
  //         status_detail: data.status_detail,
  //       };
  //       console.log('WebhookData');
  //       console.log(webhookData);
  //       // return {
  //       //   status: data.status,
  //       //   status_detail: data.status_detail,
  //       // };
  //     }
  //     res.sendStatus(204);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: 'Something goes wrong' });
  //   }
  // }
}
