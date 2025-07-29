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
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface EventMap {
  'basket:add': Product;
  'basket:remove': string;
  'basketChanged': void;
  'card:click': string;
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

export interface IBasketModel extends IEventEmitter {
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
  render(products: Product[]): void;
  onAddToBasket?: (productId: string) => void;
  onRemoveFromBasket?: (productId: string) => void;
  updateButtons(basketItems: BasketItem[]): void;

}

export interface IBasketView extends IView<BasketItem[]> {
  onRemoveItem(productId: string): void;
  onCheckout: () => void;
}

export interface IOrderView extends IView<OrderData | undefined> {
  onSubmitOrder(order: OrderData): void;
}

export interface ICardView {
  render(data: Product, basketItems?: Product[]): HTMLElement;
}

export interface ICardMainView extends ICardView {}

export interface ICardPreviewView extends ICardView {
  render(product: Product, basketItems: Product[]): HTMLElement;
  onAddToBasket?: (productId: string) => void;
  onRemoveFromBasket?: (productId: string) => void;
}

export interface ICardBasketView extends ICardView {
  onRemove(productId: string): void;
}

export interface IBaseFormView extends IView<void> {
  getFormData(): Record<string, string>;
  validate(): boolean;
  cleanErrors(): void;
}

export interface IOrderContactView extends IBaseFormView {
  onNext: () => void;
}

export interface IOrderAddressView extends IBaseFormView {
  onSubmitOrder(order: OrderData): void;
}

export interface IOrderSuccessView extends IView<void> {}

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