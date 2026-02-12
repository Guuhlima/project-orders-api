import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateCheckoutPreferenceInput, MercadoPagoPreferenceResponse } from 'src/types/MercadoPago.types';

@Injectable()
export class MercadoPagoService {
  private readonly baseUrl = process.env.MERCADO_PAGO_API_URL!;
  private readonly accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN!;

  async createCheckoutPreference(
    input: CreateCheckoutPreferenceInput,
  ): Promise<MercadoPagoPreferenceResponse> {
    if (!this.accessToken) {
      throw new InternalServerErrorException(
        'MERCADO_PAGO_ACCESS_TOKEN nao configurado.',
      );
    }

    const successUrl = process.env.MERCADO_PAGO_SUCCESS_URL;
    const pendingUrl = process.env.MERCADO_PAGO_PENDING_URL;
    const failureUrl = process.env.MERCADO_PAGO_FAILURE_URL;

    const backUrls = {
      ...(successUrl ? { success: successUrl } : {}),
      ...(pendingUrl ? { pending: pendingUrl } : {}),
      ...(failureUrl ? { failure: failureUrl } : {}),
    };

    const payload = {
      items: [
        {
          id: input.orderId,
          title: input.title,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: input.unitPrice,
        },
      ],
      external_reference: input.orderId,
      notification_url: process.env.MERCADO_PAGO_WEBHOOK_URL,
      ...(Object.keys(backUrls).length > 0 ? { back_urls: backUrls } : {}),
      ...(successUrl ? { auto_return: 'approved' } : {}),
      payer: {
        name: input.payerName,
      },
    };

    const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': randomUUID(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const rawBody = await response.text();
      throw new BadGatewayException(
        `Falha ao criar pagamento no Mercado Pago (${response.status}): ${rawBody}`,
      );
    }

    return (await response.json()) as MercadoPagoPreferenceResponse;
  }
}
