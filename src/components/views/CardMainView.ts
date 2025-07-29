import { Product, ICardMainView } from '../../types/index';
import { CDN_URL } from '../../utils/constants';

export class CardMainView implements ICardMainView {
  private template: HTMLTemplateElement;

  constructor() {
    const template = document.querySelector('#card-catalog');
    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error('Не найден шаблон');
    }

    this.template = template;
  }

  render(product: Product): HTMLElement {
    const fragment = this.template.content.cloneNode(true) as DocumentFragment;
    const card = fragment.querySelector('.card') as HTMLElement;

    if (!card) {
      throw new Error('В шаблоне не найд');
    }

    const title = card.querySelector('.card__title');
    const category = card.querySelector('.card__category');
    const price = card.querySelector('.card__price');
    const image = card.querySelector('.card__image') as HTMLImageElement;

    if (title) title.textContent = product.title;
    if (category) category.textContent = product.category;
    if (price) price.textContent = `${product.price} синапсов`;
    if (image) image.src = `${CDN_URL}/${product.image}`;

    return card;
  }
}
