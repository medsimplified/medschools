declare module "razorpay" {
  interface RazorpayConstructorOptions {
    key_id: string;
    key_secret: string;
  }

  interface RazorpayOrderNotes {
    [key: string]: unknown;
  }

  interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    status: string;
    receipt?: string;
    notes?: RazorpayOrderNotes;
  }

  interface RazorpayOrderCreateParams {
    amount: number;
    currency: string;
    receipt?: string;
    payment_capture?: number;
    notes?: RazorpayOrderNotes;
  }

  interface RazorpayOrdersApi {
    create(params: RazorpayOrderCreateParams): Promise<RazorpayOrder>;
    fetch(orderId: string): Promise<RazorpayOrder>;
  }

  export default class Razorpay {
    constructor(options: RazorpayConstructorOptions);
    orders: RazorpayOrdersApi;
  }
}
