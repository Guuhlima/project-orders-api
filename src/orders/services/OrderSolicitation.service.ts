import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { CreateOrderSolicitationDTO } from '../types/OrderSolicitation.types';
import { MercadoPagoService } from '../integrations/mercado-pago.service';
import { OrdersGateway } from '../gateway/orders.gateway';

@Injectable()
export class OrderSolicitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async create(data: CreateOrderSolicitationDTO) {
    const normalizedAmount =
      data.paymaent === 'mercado_pago'
        ? this.normalizeAmount(data.valor as number | string | undefined)
        : undefined;

    const order = await this.prisma.orders.create({
      data: {
        telefone: data.telefone,
        pedido: data.pedido,
        nome: data.nome,
        observacoes: data.observacoes || '',
        paymaent: data.paymaent,
        createdAt: new Date(),
      },
    });

    this.ordersGateway.emitNewOrder(order);

    if (data.paymaent === 'balcao') {
      return { order };
    }

    const preference = await this.mercadoPagoService.createCheckoutPreference({
      orderId: order.id,
      title: data.pedido,
      unitPrice: normalizedAmount!,
      payerName: data.nome,
    });

    return {
      order,
      payment: {
        provider: 'mercado_pago',
        type: 'checkout_pro',
        preferenceId: preference.id,
        checkoutUrl: preference.init_point,
        sandboxCheckoutUrl: preference.sandbox_init_point,
      },
    };
  }

  async findAll() {
    const order = await this.prisma.orders.findMany();

    return { order };
  }

  private normalizeAmount(value: number | string | undefined): number {
    if (value === undefined || value === null) {
      throw new BadRequestException(
        'Para pagamento mercado_pago, envie o campo valor.',
      );
    }

    const parsed =
      typeof value === 'number'
        ? value
        : Number(value.replace(',', '.').trim());

    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new BadRequestException(
        'Para pagamento mercado_pago, o campo valor deve ser um numero maior que 0.',
      );
    }

    return Number(parsed.toFixed(2));
  }
}
