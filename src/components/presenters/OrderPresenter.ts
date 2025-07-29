import { IOrderModel, IOrderView, IEventEmitter, OrderData, IOrderPresenter } from '../../types/index';

export class OrderPresenter implements IOrderPresenter {
  private model: IOrderModel;
  private view: IOrderView;
  private events: IEventEmitter;

  constructor(model: IOrderModel, view: IOrderView, events: IEventEmitter) {
    this.model = model;
    this.view = view;
    this.events = events;

    this.view.onSubmitOrder = this.submitOrder.bind(this);
  }

  async submitOrder(order: OrderData): Promise<void> {
    try {
      await this.model.submit(order);
      this.events.emit('order:success', order);
    } catch (error) {
      this.events.emit('order:error', error);
    }
  }
}
