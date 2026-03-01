export class CreateOrderSolicitationDTO {
  nome: string;
  telefone: string;
  pedido: string;
  observacoes?: string;
  paymaent: 'balcao' | 'mercado_pago';
  valor?: number | string;
}

export class OrderSolicitationDTO extends CreateOrderSolicitationDTO {
  id: string;
}