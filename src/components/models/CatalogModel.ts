import { ICatalogModel, Product } from '../../types/index';
import { EventEmitter } from '../base/events';

export class CatalogModel extends EventEmitter implements ICatalogModel {
  private products: Product[] = [];

  constructor(private apiUrl: string) {
    super();
  }

  async getProducts(): Promise<Product[]> {
    if (this.products.length > 0) {
      return this.products;
    }

    console.log('Загружаем продукты с:', this.apiUrl);
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      console.error('Сервер вернул ошибку:', response.status);
      throw new Error('Ошибка загрузки продуктов');
    }

    const data = await response.json();
    console.log(data);
    console.log(data.items);

    
    this.products = data.items ?? data;
    this.emit('productsLoaded', this.products);

    return this.products;
  }
}
