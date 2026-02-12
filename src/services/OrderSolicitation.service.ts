import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma';
import { CreateOrderSolicitationDTO } from '../types/OrderSolicitation.types';

@Injectable()
export class OrderSolicitationService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateOrderSolicitationDTO) {
        return this.prisma.orders.create({
            data: {
                telefone: data.telefone,
                pedido: data.pedido,
                observacoes: data.observacoes || '',
                paymaent: data.paymaent,
            }
        })
    }
}