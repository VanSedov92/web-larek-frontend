import { BasketItem, IBasketView, ICardBasketView } from '../../types/index';

export class BasketView implements IBasketView {
  private container: HTMLElement;
  private template: HTMLTemplateElement;
  private basketList: HTMLElement;
  private checkoutButton: HTMLButtonElement;

  public onRemoveItem: (productId: string) => void = () => {};
  public onCheckout: () => void = () => {};

  constructor(container: HTMLElement, templateId: string) {
    this.container = container;

    const templateElement = document.getElementById(templateId);
    if (!(templateElement instanceof HTMLTemplateElement)) {
      throw new Error('Шаблон корзины не найден');
    }
    this.template = templateElement;

    const basketContent = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.container.appendChild(basketContent);

    this.basketList = this.container.querySelector('.basket__list')!;
    this.checkoutButton = this.container.querySelector('.basket__button')!;

    this.checkoutButton.addEventListener('click', () => {
      this.onCheckout();
    });
  }

  render(items: BasketItem[]): void {
    this.basketList.textContent = '';

    items.forEach((item, index) => {
      const card = this.createBasketItem(item, index + 1);
      this.basketList.appendChild(card);
    });
  }

  private createBasketItem(item: BasketItem, index: number): HTMLElement {
    const template = document.getElementById('card-basket');
    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error('Шаблон карточки корзины не найден');
    }

    const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const indexSpan = card.querySelector('.basket__item-index')!;
    indexSpan.textContent = index.toString();

    const titleSpan = card.querySelector('.card__title')!;
    titleSpan.textContent = item.product.title;

    const priceSpan = card.querySelector('.card__price')!;
    priceSpan.textContent = `${item.product.price} синапсов`;

    const btnDelete = card.querySelector('.basket__item-delete')!;
    btnDelete.addEventListener('click', () => {
      this.onRemoveItem(item.product.id);
    });

    return card;
  }
}
