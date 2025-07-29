import { IOrderAddressView, OrderData } from '../../types/index';

export class OrderAddressView implements IOrderAddressView {
  private container: HTMLElement;
  private form: HTMLFormElement;
  private addressInput: HTMLInputElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private submitButton: HTMLButtonElement;
  private errorsContainer: HTMLElement;

  public onSubmitOrder: (order: OrderData) => void = () => {};

  private selectedPaymentMethod: 'online' | 'offline' | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.form = this.container.querySelector('form[name="order"]') as HTMLFormElement;
    this.addressInput = this.form.querySelector('input[name="address"]') as HTMLInputElement;
    this.paymentButtons = this.form.querySelectorAll('.order__buttons button');
    this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsContainer = this.form.querySelector('.form__errors') as HTMLElement;

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectPaymentMethod(button);
      });
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate() && this.selectedPaymentMethod) {
        this.onSubmitOrder({
          paymentMethod: this.selectedPaymentMethod,
          address: this.addressInput.value.trim(),
          email: '',
          phone: '',
        });
      }
    });

    this.form.addEventListener('input', () => {
      this.cleanErrors();
      this.updateButtonState();
    });

    this.updateButtonState();
  }

  render(): void {
    this.form.reset();
    this.selectedPaymentMethod = null;
    this.cleanErrors();
    this.updateButtonState();
    this.paymentButtons.forEach(btn => btn.classList.remove('button_active'));
  }

  getFormData(): Record<string, string> {
    return {
      paymentMethod: this.selectedPaymentMethod ?? '',
      address: this.addressInput.value.trim(),
    };
  }

  validate(): boolean {
    this.cleanErrors();
    const errors: string[] = [];

    if (!this.selectedPaymentMethod) {
      errors.push('Выберите способ оплаты');
    }
    if (!this.addressInput.value.trim()) {
      errors.push('Введите адрес доставки');
    }

    if (errors.length > 0) {
      this.errorsContainer.textContent = errors.join('. ');
      return false;
    }
    return true;
  }

  cleanErrors(): void {
    this.errorsContainer.textContent = '';
  }

  private selectPaymentMethod(button: HTMLButtonElement): void {
    this.selectedPaymentMethod = button.name === 'card' ? 'online' : 'offline';

    this.paymentButtons.forEach(btn => btn.classList.remove('button_active'));
    button.classList.add('button_active');

    this.updateButtonState();
  }

  private updateButtonState(): void {
    this.submitButton.disabled = !this.addressInput.value.trim() || !this.selectedPaymentMethod;
  }
}
