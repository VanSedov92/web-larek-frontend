import { IOrderModel, OrderData } from '../../types/index';

export class OrderModel implements IOrderModel {
  constructor(private apiUrl: string) {}

  async submit(order: OrderData): Promise<void> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке заказа');
    }
  }
}
