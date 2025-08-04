import { IOrderContactView, ContactFormData } from '../../types';

export class OrderContactView implements IOrderContactView {
  public onFieldChange: (field: keyof ContactFormData, value: string) => void = () => {};
  public onNext: () => void;

  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  constructor() {
    const email = document.querySelector<HTMLInputElement>('#contact-email');
    const phone = document.querySelector<HTMLInputElement>('#contact-phone');
    const submit = document.querySelector<HTMLButtonElement>('#contact-submit');
    const errorBox = document.querySelector<HTMLElement>('#contact-errors');

    if (!email || !phone || !submit || !errorBox) {
      throw new Error('Не найдены элементы формы контакта');
    }

    this.emailInput = email;
    this.phoneInput = phone;
    this.submitButton = submit;
    this.errorContainer = errorBox;

    this.emailInput.addEventListener('input', () => {
      this.onFieldChange('email', this.emailInput.value.trim());
    });

    this.phoneInput.addEventListener('input', () => {
      this.onFieldChange('phone', this.phoneInput.value.trim());
    });
  }

  render(): void {
  }

  cleanErrors(): void {
    this.errorContainer.innerHTML = '';
  }

  showErrors(errors: string[]): void {
    this.cleanErrors();
    errors.forEach((err) => {
      const item = document.createElement('div');
      item.textContent = err;
      this.errorContainer.appendChild(item);
    });
  }

  setSubmitEnabled(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  getFormData(): ContactFormData {
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    };
  }
}
