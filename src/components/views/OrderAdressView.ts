import { IOrderAddressView, AddressFormData } from '../../types/index';

export class OrderAddressView implements IOrderAddressView {
  private container: HTMLElement;
  private form: HTMLFormElement;
  private addressInput: HTMLInputElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private submitButton: HTMLButtonElement;
  private errorsContainer: HTMLElement;

  public onSubmitOrder: (order: AddressFormData) => void = () => {};
  public onAddressChange: (address: string) => void = () => {};
  public onPaymentMethodChange: (method: 'online' | 'offline') => void = () => {};
  public onFieldChange: (field: keyof AddressFormData, value: string) => void = () => {};

  private selectedPaymentMethod: 'online' | 'offline' | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.form = this.container.querySelector('form[name="order"]') as HTMLFormElement;
    this.addressInput = this.form.querySelector('input[name="address"]') as HTMLInputElement;
    this.paymentButtons = this.form.querySelectorAll('.order__buttons button');
    this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsContainer = this.form.querySelector('.form__errors') as HTMLElement;

    this.addressInput.addEventListener('input', () => {
      this.onAddressChange(this.addressInput.value.trim());
    });

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const method = button.name === 'card' ? 'online' : 'offline';
        this.onFieldChange('paymentMethod', method);
      });
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = this.getFormData();
      this.onSubmitOrder(data);
    });

    this.addressInput.addEventListener('input', () => {
      this.onFieldChange('address', this.addressInput.value.trim());
    });

  }

  render(): void {
    this.form.reset();
    this.selectedPaymentMethod = null;
    this.cleanErrors();
    this.submitButton.disabled = true;
  }

  update(data: {
    address: string;
    paymentMethod: 'online' | 'offline' | null;
    errors: string[];
    isSubmitEnabled: boolean;
  }): void {
    this.addressInput.value = data.address;
    this.selectedPaymentMethod = data.paymentMethod;

    this.paymentButtons.forEach(btn => {
      btn.classList.toggle(
        'button_active',
        (btn.name === 'card' && data.paymentMethod === 'online') ||
        (btn.name !== 'card' && data.paymentMethod === 'offline')
      );
    });

    this.errorsContainer.textContent = data.errors.join('. ');
    this.submitButton.disabled = !data.isSubmitEnabled;
  }

  getFormData(): AddressFormData {
    const paymentMethod = this.selectedPaymentMethod;
    const address = this.addressInput.value.trim();
    if (!paymentMethod) {
      throw new Error('Способ оплаты не выбран');
    }
    return { paymentMethod, address};
  }

  setSubmitEnabled(isEnabled: boolean): void {
    this.submitButton.disabled = !isEnabled;
  }

  showErrors(errors: string[]): void {
    this.errorsContainer.textContent = errors.join('. ');
  }

  cleanErrors(): void {
    this.errorsContainer.textContent = '';
  }
}
