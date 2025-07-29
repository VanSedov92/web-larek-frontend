import { BasketItem, IEventEmitter, IBasketModel } from '../../types/index';
import { ModalView } from '../views/ModalView';

export class BasketPresenter {
  private model: IBasketModel;
  private modalView: ModalView;
  private events: IEventEmitter;
  private basketTemplate: HTMLTemplateElement;

  constructor(
    model: IBasketModel,
    modalView: ModalView,
    events: IEventEmitter,
    basketTemplate: HTMLTemplateElement
  ) {
    this.model = model;
    this.modalView = modalView;
    this.events = events;
    this.basketTemplate = basketTemplate;

    this.events.on('basket:remove', (productId: string) => {
      this.model.removeItem(productId);
      this.renderBasket();
      this.updateBasketCounter();
    });

    this.model.on('basketChanged', () => {
      this.renderBasket();
      this.updateBasketCounter();
    });
  }

  openBasket(): void {
    this.renderBasket();
    this.updateBasketCounter();
  }

  private renderBasket(): void {
    const basketItems = this.model.getItems();

    const basketContent = this.basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const listElement = basketContent.querySelector('.basket__list')!;
    const priceElement = basketContent.querySelector('.basket__price')!;
    const orderButton = basketContent.querySelector('.basket__button') as HTMLButtonElement;

    orderButton.disabled = basketItems.length === 0;

    while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }

    let totalPrice = 0;

    basketItems.forEach((item, index) => {
      const li = document.createElement('li');
      li.classList.add('basket__item', 'card', 'card_compact');

      const indexSpan = document.createElement('span');
      indexSpan.className = 'basket__item-index';
      indexSpan.textContent = String(index + 1);
      li.appendChild(indexSpan);

      const titleSpan = document.createElement('span');
      titleSpan.className = 'card__title';
      titleSpan.textContent = item.product.title;
      li.appendChild(titleSpan);

      const priceSpan = document.createElement('span');
      priceSpan.className = 'card__price';
      priceSpan.textContent = `${item.product.price * item.quantity} синапсов`;
      li.appendChild(priceSpan);

      const btnDelete = document.createElement('button');
      btnDelete.className = 'basket__item-delete';
      btnDelete.setAttribute('aria-label', 'удалить');
      btnDelete.dataset.id = item.product.id;
      li.appendChild(btnDelete);

      btnDelete.addEventListener('click', () => {
        this.events.emit('basket:remove', item.product.id);
      });

      listElement.appendChild(li);

      totalPrice += item.product.price * item.quantity;
    });

    priceElement.textContent = `${totalPrice} синапсов`;

    this.modalView.setContent(basketContent);
    this.modalView.open();

    orderButton.addEventListener('click', () => {
      this.openOrderForm();
    });
  }

  private updateBasketCounter(): void {
    const counter = document.querySelector('.header__basket-counter');
    if (!counter) return;

    const items = this.model.getItems();
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    counter.textContent = String(totalCount);
  }

  private openOrderForm(): void {
    const template = document.querySelector<HTMLTemplateElement>('#order');
    if (!template) return;

    const formElement = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    const addressInput = formElement.querySelector<HTMLInputElement>('input[name="address"]');
    const submitButton = formElement.querySelector<HTMLButtonElement>('button[type="submit"]');
    const errorSpan = formElement.querySelector<HTMLElement>('.form__errors');

    let selectedPayment: string | null = null;

    function validateForm() {
      const addressValid = !!addressInput?.value.trim();
      const paymentValid = !!selectedPayment;

      if (addressValid && paymentValid) {
        if (submitButton) submitButton.disabled = false;
        if (errorSpan) errorSpan.textContent = '';
      } else {
        if (submitButton) submitButton.disabled = true;
        if (errorSpan) errorSpan.textContent = 'Необходимо указать адрес и способ оплаты';
      }
    }

    const paymentButtons = formElement.querySelectorAll<HTMLButtonElement>('.order__buttons .button');
    paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        selectedPayment = button.name;

        paymentButtons.forEach((btn) => btn.classList.remove('button_active'));
        button.classList.add('button_active');
        validateForm();
      });
    });

    addressInput?.addEventListener('input', validateForm);

    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedPayment || !addressInput?.value.trim()) return;

      const address = addressInput.value.trim();
      const payment = selectedPayment;

      this.events.emit('order:submit', { payment, address });

      this.openContactsForm(payment, address);
    });

    this.modalView.setContent(formElement);
    this.modalView.open();
  }

  private openContactsForm(payment: string, address: string): void {
    const template = document.querySelector<HTMLTemplateElement>('#contacts');
    if (!template) return;

    const formElement = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    const emailInput = formElement.querySelector<HTMLInputElement>('input[name="email"]')!;
    const phoneInput = formElement.querySelector<HTMLInputElement>('input[name="phone"]')!;
    const submitButton = formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const errorSpan = formElement.querySelector<HTMLElement>('.form__errors')!;

    function validateForm() {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      const phoneValid = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(phoneInput.value.trim());

      if (emailValid && phoneValid) {
        submitButton.disabled = false;
        errorSpan.textContent = '';
      } else {
        submitButton.disabled = true;
        errorSpan.textContent = 'Введите корректные email и телефон';
      }
    }

    emailInput.addEventListener('input', validateForm);
    phoneInput.addEventListener('input', validateForm);

    formElement.addEventListener('submit', (e) => {
      e.preventDefault();

      this.events.emit('order:complete', {
        payment,
        address,
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
      });

      this.openSuccessWindow();
    });

    this.modalView.setContent(formElement);
    this.modalView.open();
  }

  private openSuccessWindow(): void {
    const template = document.querySelector<HTMLTemplateElement>('#success');
    if (!template) return;

    const successContent = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const closeBtn = successContent.querySelector('.order-success__close') as HTMLButtonElement;

    closeBtn.addEventListener('click', () => {
      this.modalView.close();
      this.model.clear();
      this.updateBasketCounter();
    });

    this.modalView.setContent(successContent);
    this.modalView.open();
  }
}
