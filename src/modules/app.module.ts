import { Module } from '@nestjs/common';
import { OrderSolicitationController } from '../controller/OrderSoclitation.controller';
import { PrismaService } from '../lib/prisma';
import { OrderSolicitationService } from '../services/OrderSolicitation.service';

@Module({
  imports: [],
  controllers: [OrderSolicitationController],
  providers: [OrderSolicitationService, PrismaService],
})
export class AppModule {}
