export class CreateOrderSolicitationDTO {
  name: string;
  telefone: string;
  pedido: string;
  observacoes?: string;
  paymaent: 'balcao' | 'mercado_pago';
  valor?: number | string;
}
