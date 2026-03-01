import { Body, Controller, Post, Get } from '@nestjs/common';
import { OrderSolicitationService } from '../services/OrderSolicitation.service';
import { CreateOrderSolicitationDTO } from '../types/OrderSolicitation.types';

@Controller('order-solicitation')
export class OrderSolicitationController {
  constructor(private readonly service: OrderSolicitationService) {}

  @Post()
  async create(@Body() body: CreateOrderSolicitationDTO) {
    const result = await this.service.create(body);
    return { message: 'Pedido criado com sucesso', ...result };
  }

  @Get()
  async findAll() {
    const result = await this.service.findAll();
    return { message: 'Pedidos encontrados com sucesso', ...result };
  }
}
