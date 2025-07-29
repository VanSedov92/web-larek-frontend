import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { CatalogView } from './components/views/CatalogView';
import { CardMainView } from './components/views/CardMainView';
import { CatalogPresenter } from './components/presenters/CatalogPresenter';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { ModalView } from './components/views/ModalView';
import { CardPreviewView } from './components/views/CardPreviewView';
import { BasketPresenter } from './components/presenters/BasketPresenter';
import { BasketModel } from './components/models/BasketModel';
import { Product } from './types';

const events = new EventEmitter();
const modalView = new ModalView('modal-container');
const cardPreviewView = new CardPreviewView(CDN_URL);
const catalogModel = new CatalogModel(`${API_URL}/product`);
const catalogView = new CatalogView(
  document.querySelector('.gallery')!,
  new CardMainView(),
  events
);

const basketModel = new BasketModel();

const catalogPresenter = new CatalogPresenter(
  catalogModel,
  catalogView,
  events,
  modalView,
  cardPreviewView,
  basketModel
);

catalogPresenter.loadProduct();

const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket')!;

const basketPresenter = new BasketPresenter(
  basketModel,
  modalView,
  events,
  basketTemplate
);

const basketButton = document.querySelector('.header__basket')!;
basketButton.addEventListener('click', () => {
  basketPresenter.openBasket();
});

events.on('basket:add', (data: { product: Product }) => {
  basketModel.addItem(data.product);
});

events.on('basket:remove', (data: { productId: string}) => {
  basketModel.removeItem(data.productId);
});
