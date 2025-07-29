import { IFormValidator } from '../types/index';

export class FormValidator implements IFormValidator {
  private formElement: HTMLFormElement;

  constructor(formElement: HTMLFormElement) {
    this.formElement = formElement;
  }

  validate(): boolean {
    let isValid = true;
    const inputs = Array.from(this.formElement.querySelectorAll('input'));

    inputs.forEach(input => {
      const errorSpan = this.getErrorElement(input);
      if (!input.checkValidity()) {
        isValid = false;
        if (errorSpan) {
          errorSpan.textContent = input.validationMessage;
        }
      } else {
        if (errorSpan) {
          errorSpan.textContent = '';
        }
      }
    });

    return isValid;
  }

  cleanErrors(): void {
    const errorSpans = Array.from(this.formElement.querySelectorAll('.form__errors'));
    errorSpans.forEach(span => {
      span.textContent = '';
    });
  }

  getFormData(): Record<string, string> {
  const data: Record<string, string> = {};
  const inputs = Array.from(this.formElement.querySelectorAll<HTMLInputElement>('input[name]'));

  inputs.forEach(input => {
    data[input.name] = input.value;
  });

  return data;
}

  private getErrorElement(input: HTMLInputElement): HTMLElement | null {
    return this.formElement.querySelector('.form__errors');
  }
}
