import { Product, ICatalogView, ICardMainView, IEventEmitter, BasketItem } from '../../types/index';

export class CatalogView implements ICatalogView {
  private container: HTMLElement;
  private cardView: ICardMainView;
  private events: IEventEmitter;
  onAddToBasket: (productId: string) => void;
  onRemoveFromBasket: (productId: string) => void;

  constructor(container: HTMLElement, cardView: ICardMainView, events: IEventEmitter) {
    this.container = container;
    this.cardView = cardView;
    this.events = events;
  }

  render(products: Product[]): void {
    this.container.textContent = '';
    products.forEach(product => {
      const card = this.cardView.render(product);
      card.addEventListener('click', (event) => {
        if (!(event.target as HTMLElement).closest('.card__button')) {
          this.events.emit('card:click', { productId: product.id });
        }
      });

      const addToBasketBtn = card.querySelector('.card__button');
      if (addToBasketBtn) {
        addToBasketBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          this.onAddToBasket(product.id);
        });
      }

      this.container.appendChild(card);
    });
  }
/*
  updateButtons(basketItems: BasketItem[]): void {
    const productIdsInBasket = basketItems.map(item => item.product.id);

    this.container.querySelectorAll('.card').forEach(card => {
      const btn = card.querySelector<HTMLButtonElement>('.card__button');
      const productId = btn?.dataset.id;

      if (!btn || !productId) return;

      if (productIdsInBasket.includes(productId)) {
        btn.textContent = 'Удалить из корзины';
        btn.onclick = () => {
          this.onRemoveFromBasket(productId);
        };
      } else {
        btn.textContent = 'Добавить в корзину';
        btn.onclick = () => {
          this.onAddToBasket(productId);
        };
      }
    });
  }

  */
}
