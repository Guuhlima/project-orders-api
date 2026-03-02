import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/orders',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  emitNewOrder(order: unknown) {
    this.server.emit('order.created', order);
  }
}
