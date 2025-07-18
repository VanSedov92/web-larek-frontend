export interface IEventEmitter {
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface ApiListResponse<T> {
  total: number;
  items: T[];
}

export interface Product {
  id: string;
  category: string;
  title: string;
  description?: string;
  price: number;
  image: string;
}

export interface BasketItem {
  product: Product;
  quantity: number;
}

export interface OrderData {
  paymentMethod: 'online' | 'offline';
  address: string;
  email: string;
  phone: string;
}

export interface ICatalogModel {
  getProducts(): Promise<Product[]>;
}

export interface IBasketModel {
  getItems(): BasketItem[];
  addItem(product: Product): void;
  removeItem(productId: string): void;
  clear(): void;
}

export interface IOrderModel {
  submit(order: OrderData): Promise<void>;
}


export interface IView<T = void> {
  render(data: T): void;
}

export interface ICatalogView extends IView<Product[]> {
  onAddToBasket: (productId: string) => void;
}

export interface IBasketView extends IView<BasketItem[]> {
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export interface IOrderView extends IView<OrderData | undefined> {
  onSubmitOrder: (order: OrderData) => void;
}

export interface ICatalogPresenter {
  loadProduct(): Promise<void>;
  handleAddToBasket(productId: string): void;
}

export interface IBasketPresenter {
  addItem(productId: string): void;
  removeItem(productId: string): void;
  checkout(): void;
}

export interface IOrderPresenter {
  submitOrder(order: OrderData): Promise<void>;
}

export interface IModal {
  open(content: HTMLElement): void;
  close(): void;
}

export interface IFormValidator {
  validate(): boolean;
  cleanErrors(): void;
  getFormData(): Record<string, string>;
}