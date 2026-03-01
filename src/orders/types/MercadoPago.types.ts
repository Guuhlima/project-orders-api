export class CreateCheckoutPreferenceInput {
  orderId: string;
  title: string;
  unitPrice: number;
  payerName: string;
};

export class MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
};
