import { Product, ICardBasketView } from "../../types/index";

export class CardBasketView implements ICardBasketView {
  private template: HTMLTemplateElement;
  private handleRemove!: (productId: string) => void;

  constructor(onRemove: (productId: string) => void) {
    const templateElement = document.getElementById('card-basket');
    if (!(templateElement instanceof HTMLTemplateElement)) {
      throw new Error('Шаблон карточки корзины не найден');
    }
    this.template = templateElement;
    this.handleRemove = onRemove;
  }

  onRemove(productId: string): void {
    this.handleRemove(productId);
  }

  render(data: Product): HTMLElement {
    const card = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const image = card.querySelector<HTMLImageElement>('.card__image')!;
    image.src = data.image;
    image.alt = data.title;

    const category = card.querySelector('.card__category')!;
    category.textContent = data.category;

    const title = card.querySelector('.card__title')!;
    title.textContent = data.title;

    const price = card.querySelector('.card__price')!;
    price.textContent = `${data.price} синапсов`;

    const btn = card.querySelector<HTMLButtonElement>('.card__button')!;
    btn.dataset.id = data.id;

    btn.addEventListener('click', () => {
      this.onRemove(data.id);
    });

    return card;
  }
}
