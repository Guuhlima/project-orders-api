import { Module } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';

//ORDERS
import { OrderSolicitationController } from 'src/orders/controller/OrderSoclitation.controller';
import { OrderSolicitationService } from 'src/orders/services/OrderSolicitation.service'; 
import { MercadoPagoService } from 'src/orders/integrations/mercado-pago.service'; 

//AUTH
import { AuthController } from 'src/auth/controller/auth.controller';
import { AuthService } from 'src/auth/services/auth.service';

@Module({
  imports: [],
  controllers: [OrderSolicitationController, AuthController],
  providers: [OrderSolicitationService, PrismaService, MercadoPagoService, AuthService],
})
export class AppModule {}
