import { IOrderContactView } from '../../types/index';

export class OrderContactView implements IOrderContactView {
  private container: HTMLElement;
  private form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorSpan: HTMLElement;

  public onNext: () => void = () => {};

  constructor(container: HTMLElement, templateId: string) {
    this.container = container;

    const templateElement = document.getElementById(templateId);
    if (!(templateElement instanceof HTMLTemplateElement)) {
      throw new Error('Шаблон контактов не найден');
    }

    const formElement = templateElement.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    this.container.innerHTML = '';
    this.container.appendChild(formElement);

    this.form = formElement;
    this.emailInput = this.form.querySelector('input[name="email"]')!;
    this.phoneInput = this.form.querySelector('input[name="phone"]')!;
    this.submitButton = this.form.querySelector('button[type="submit"]')!;
    this.errorSpan = this.form.querySelector('.form__errors')!;

    this.submitButton.disabled = true;

    this.form.addEventListener('input', () => this.validate());

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      if (this.validate()) {
        this.onNext();
      }
    });
  }

  render(): void {
    this.form.reset();
    this.cleanErrors();
    this.submitButton.disabled = true;
  }

  getFormData(): Record<string, string> {
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    };
  }

  validate(): boolean {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();
    let valid = true;
    this.errorSpan.textContent = '';

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      valid = false;
      this.errorSpan.textContent += 'Введите корректный Email. ';
    }

    if (!phone || !/^[\d+ ()-]+$/.test(phone)) {
      valid = false;
      this.errorSpan.textContent += 'Введите корректный телефон. ';
    }

    this.submitButton.disabled = !valid;
    return valid;
  }

  cleanErrors(): void {
    this.errorSpan.textContent = '';
  }
}
