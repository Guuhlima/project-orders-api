import { Module } from '@nestjs/common';
import { OrderSolicitationController } from '../controller/OrderSoclitation.controller';
import { PrismaService } from '../lib/prisma';
import { OrderSolicitationService } from '../services/OrderSolicitation.service';
import { MercadoPagoService } from '../integrations/mercado-pago.service';

@Module({
  imports: [],
  controllers: [OrderSolicitationController],
  providers: [OrderSolicitationService, PrismaService, MercadoPagoService],
})
export class AppModule {}
