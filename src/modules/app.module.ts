import { Module } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';

//ORDERS
import { OrderSolicitationController } from 'src/orders/controller/OrderSoclitation.controller';
import { OrderSolicitationService } from 'src/orders/services/OrderSolicitation.service'; 
import { MercadoPagoService } from 'src/orders/integrations/mercado-pago.service'; 
import { OrdersGateway } from 'src/orders/gateway/orders.gateway';

//AUTH
import { AuthController } from 'src/auth/controller/auth.controller';
import { AuthService } from 'src/auth/services/auth.service';

//PRODUCTS
import { ProductsService } from 'src/products/services/products.service';
import { ProductsController } from 'src/products/controller/products.controller';

@Module({
  imports: [],
  controllers: [OrderSolicitationController, AuthController, ProductsController],
  providers: [
    OrderSolicitationService, 
    PrismaService, 
    MercadoPagoService, 
    AuthService, 
    OrdersGateway,
    OrderSolicitationService,
    PrismaService,
    MercadoPagoService,
    OrdersGateway,
    AuthService,
    ProductsService,
  ],
})
export class AppModule {}
