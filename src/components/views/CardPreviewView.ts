import { Product, ICardPreviewView } from "../../types/index";

export class CardPreviewView implements ICardPreviewView {
  private template: HTMLTemplateElement;
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;

    const templateElement = document.getElementById('card-preview');
    if (!(templateElement instanceof HTMLTemplateElement)) {
      throw new Error('Шаблон превью не найден');
    }
    this.template = templateElement;
  }

  render(data: Product, basketItems: Product[] = []): HTMLElement {
    const card = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const image = card.querySelector<HTMLImageElement>('.card__image')!;
    image.src = `${this.apiBaseUrl}${data.image}`;
    image.alt = data.title;

    const category = card.querySelector('.card__category')!;
    category.textContent = data.category;

    const title = card.querySelector('.card__title')!;
    title.textContent = data.title;

    const text = card.querySelector('.card__text');
    if (text) {
      text.textContent = data.description || '';
    }

    const price = card.querySelector('.card__price')!;
    price.textContent = `${data.price} синапсов`;

    const btn = card.querySelector<HTMLButtonElement>('.card__button')!;
    btn.dataset.id = data.id;

    const isInBasket = basketItems.some(item => item.id === data.id);

    if (isInBasket) {
      btn.textContent = 'Удалить из корзины';
      btn.onclick = () => {
        this.onRemoveFromBasket?.(data.id);
      };
    } else {
      btn.textContent = 'Добавить в корзину';
      btn.onclick = () => {
        this.onAddToBasket?.(data.id);
      };
    }

    return card;
  }

  onAddToBasket?: (productId: string) => void;
  onRemoveFromBasket?: (productId: string) => void;
}
