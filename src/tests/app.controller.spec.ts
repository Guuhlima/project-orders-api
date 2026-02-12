import { Test, TestingModule } from '@nestjs/testing';
import { OrderSolicitationController } from '../controller/OrderSoclitation.controller';
import { OrderSolicitationService } from '../services/OrderSolicitation.service';
import { CreateOrderSolicitationDTO } from '../types/OrderSolicitation.types';

describe('OrderSolicitationController', () => {
  let controller: OrderSolicitationController;
  let service: jest.Mocked<OrderSolicitationService>;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderSolicitationController],
      providers: [
        {
          provide: OrderSolicitationService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = app.get<OrderSolicitationController>(OrderSolicitationController);
    service = app.get(OrderSolicitationService);
  });

  describe('create', () => {
    it('should create an order', async () => {
      const body: CreateOrderSolicitationDTO = {
        name: 'Joao',
        telefone: '(11)99999-0000',
        pedido: '1 hamburguer',
        observacoes: 'sem cebola',
        paymaent: 'balcao',
      };

      const createdOrder = { id: 'id-1', ...body };
      service.create.mockResolvedValue(createdOrder as never);

      const result = await controller.create(body);

      expect(service.create).toHaveBeenCalledWith(body);
      expect(result).toEqual({
        message: 'Pedido criado com sucesso',
        order: createdOrder,
      });
    });
  });
});
