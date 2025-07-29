import { ICatalogModel, ICatalogView, IEventEmitter, Product, IBasketModel } from '../../types/index';
import { ModalView } from '../views/ModalView';
import { CardPreviewView } from '../views/CardPreviewView';

export class CatalogPresenter {
  private model: ICatalogModel;
  private view: ICatalogView;
  private modal: ModalView;
  private events: IEventEmitter;
  private cardPreviewView: CardPreviewView;
  private basketModel: IBasketModel;

  constructor(
    model: ICatalogModel,
    view: ICatalogView,
    events: IEventEmitter,
    modal: ModalView,
    cardPreviewView: CardPreviewView,
    basketModel: IBasketModel
  ) {
    this.model = model;
    this.view = view;
    this.events = events;
    this.modal = modal;
    this.cardPreviewView = cardPreviewView;
    this.basketModel = basketModel;

    this.view.onAddToBasket = this.handleAddToBasket.bind(this);
    this.view.onRemoveFromBasket = this.handleRemoveFromBasket.bind(this);

    this.events.on('basketChanged', () => {
      this.updateButtons();
    });

    this.events.on('card:click', async (data: { productId: string }) => {
      const { productId } = data;
      try {
        const products = await this.model.getProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
          this.cardPreviewView.onAddToBasket = this.handleAddToBasket.bind(this);
          this.cardPreviewView.onRemoveFromBasket = this.handleRemoveFromBasket.bind(this);

          const basketItems = this.basketModel.getItems().map(item => item.product);
          const previewCard = this.cardPreviewView.render(product, basketItems);

          this.modal.setContent(previewCard);
          this.modal.open();
        }
      } catch (error) {
        console.error('Ошибка при показе превью:', error);
      }
    });
  }

  async loadProduct(): Promise<void> {
    try {
      const products = await this.model.getProducts();
      this.view.render(products);
      this.updateButtons();
    } catch (error: unknown) {
      console.error('Ошибка загрузки продуктов:', error);
    }
  }

  handleAddToBasket(productId: string): void {
    this.model.getProducts().then(products => {
      const product = products.find(p => p.id === productId);
      if (product) {
        this.events.emit('basket:add', { product });
      }
    }).catch(error => {
      console.error('Ошибка добавления в корзину:', error);
    });
  }

  handleRemoveFromBasket(productId: string): void {
    this.events.emit('basket:remove', { productId });
  }

  updateButtons(): void {
    const basketItems = this.basketModel.getItems();
    this.view.updateButtons(basketItems);
  }
}
