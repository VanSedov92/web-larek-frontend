import { EventEmitter } from '../base/events';
import { ContactFormData, IOrderContactModel } from '../../types';

export class OrderContactModel extends EventEmitter implements IOrderContactModel {
  setData(data: ContactFormData): void {
    throw new Error('Method not implemented.');
  }
  getData(): ContactFormData {
    throw new Error('Method not implemented.');
  }
  private data: ContactFormData = { email: '', phone: ''};
  private errors: string[] = [];

  getFormData(): ContactFormData {
    return this.data;
  }

  getErrors(): string[] {
    return this.errors;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  setField<K extends keyof ContactFormData>(field: K, value: ContactFormData[K]): void {
    this.data[field] = value;
    this.validate();
    this.emit('changed');
  }

  private validate(): void {
    const errors: string[] = [];

    if (!this.data.email.includes('@')) {
      errors.push('Некорректный email');
    }

    if (!/^\+?\d{10,15}$/.test(this.data.phone)) {
      errors.push('Некорректный номер телефона');
    }

    this.errors = errors;
  }
}
