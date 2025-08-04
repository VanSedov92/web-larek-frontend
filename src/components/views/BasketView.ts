import {
  BasketItem,
  IBasketView,
  ICardBasketView,
  ICardBasketViewConstructor,
} from '../../types/index';

export class BasketView implements IBasketView {
  private container: HTMLElement;
  private basketList: HTMLElement;
  private checkoutButton: HTMLButtonElement;
  private CardBasketViewClass: ICardBasketViewConstructor;

  public onRemoveItem: (productId: string) => void = () => {};
  public onCheckout: () => void = () => {};

  constructor(container: HTMLElement, CardBasketViewClass: ICardBasketViewConstructor) {
    this.container = container;
    this.CardBasketViewClass = CardBasketViewClass;

    this.basketList = this.container.querySelector('.basket__list')!;
    this.checkoutButton = this.container.querySelector('.basket__button')!;

    this.checkoutButton.addEventListener('click', () => {
      this.onCheckout();
    });
  }

  render(items: BasketItem[]): void {
    this.basketList.textContent = '';

    items.forEach((item, index) => {
      const cardView = new this.CardBasketViewClass();

      cardView.onRemove = (productId: string) => {
        this.onRemoveItem(productId);
      };

      const cardElement = cardView.render(item.product);

      const indexSpan = cardElement.querySelector('.basket__item-index');
      if (indexSpan) {
        indexSpan.textContent = (index + 1).toString();
      }
      this.basketList.appendChild(cardElement);
    });
  }
}
