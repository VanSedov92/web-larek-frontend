import { EventEmitter } from '../base/events';
import { IBasketModel, BasketItem, Product } from '../../types/index';

export class BasketModel extends EventEmitter implements IBasketModel {
  private items: BasketItem[] = [];

  getItems(): BasketItem[] {
    return this.items;
  }

  addItem(product: Product): void {
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.emit('basketChanged');
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.emit('basketChanged');
  }

  clear(): void {
    this.items = [];
    this.emit('basketChanged');
  }
}
