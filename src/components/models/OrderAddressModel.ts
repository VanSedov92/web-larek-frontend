import { EventEmitter } from '../base/events';
import { AddressFormData, IOrderAddressModel } from '../../types/index';

export class OrderAddressModel extends EventEmitter implements IOrderAddressModel{
  private data: AddressFormData = {
    paymentMethod: 'offline',
    address: '',
  };

  private errors: string[] = [];

  setField<K extends keyof AddressFormData>(field: K, value: AddressFormData[K]): void {
    this.data[field] = value;
    this.validate();
    this.emit('changed');
  }

  getData(): AddressFormData {
    return this.data;
  }

  getErrors(): string[] {
    return this.errors;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  private validate() {
    this.errors = [];

    if (!this.data.address || this.data.address.length < 5) {
      this.errors.push('Адрес слишком короткий');
    }

    if (!this.data.paymentMethod || (this.data.paymentMethod !== 'online' && this.data.paymentMethod !== 'offline')) {
      this.errors.push('Выберите способ оплаты');
    }
  }
}
