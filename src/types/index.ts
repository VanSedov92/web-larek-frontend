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

export interface AddressFormData {
  paymentMethod: 'online' | 'offline';
  address: string;
}

export interface ContactFormData {
  email: string;
  phone: string;
}

export type OrderData = ContactFormData & AddressFormData;

export interface IOrderContactModel extends IEventEmitter {
  setData(data: ContactFormData): void;
  getData(): ContactFormData;
  getErrors(): string[];
  isValid(): boolean;
  setField<K extends keyof ContactFormData>(field: K, value: ContactFormData[K]): void;
}

export interface IOrderAddressModel extends IEventEmitter {
  setField<K extends keyof AddressFormData>(field: K, value: AddressFormData[K]): void;
  getData(): AddressFormData;
  getErrors(): string[];
  isValid(): boolean;
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

export interface ICardBasketViewConstructor {
  new (): ICardBasketView;
}

export interface IBaseFormView<T extends Record<string, any> = Record<string, string>>  {
  getFormData(): T;
  cleanErrors(): void;
}

export interface IOrderContactView extends IBaseFormView<ContactFormData> {
  onNext: () => void;
  showErrors(errors: string[]): void;
  setSubmitEnabled(enabled: boolean): void;
  onFieldChange: (field: keyof ContactFormData, value: string) => void;
}

export interface IOrderAddressView {
  render(): void;
  update(data: {
    address: string;
    paymentMethod: 'online' | 'offline' | null;
    errors: string[];
    isSubmitEnabled: boolean;
  }): void;
  getFormData(): AddressFormData;
  onSubmitOrder: (order: AddressFormData) => void;
  onAddressChange: (address: string) => void;
  onPaymentMethodChange: (method: 'online' | 'offline') => void;
  cleanErrors(): void;
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