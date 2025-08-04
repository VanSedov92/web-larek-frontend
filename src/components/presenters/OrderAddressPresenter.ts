import { OrderAddressModel } from '../models/OrderAddressModel';
import { OrderAddressView } from '../views/OrderAdressView';
import { AddressFormData } from '../../types/index';

export class OrderAddressPresenter {
  constructor(
    private model: OrderAddressModel,
    private view: OrderAddressView,
    private onNextStep: () => void,
  ) {
    this.view.onFieldChange = this.handleFieldChange.bind(this); 

    this.model.on('changed', () => {
      this.view.showErrors(this.model.getErrors());
      this.view.setSubmitEnabled(this.model.isValid());
    });
  }

  handleFieldChange(field: keyof AddressFormData, value: string) {
    this.model.setField(field, value);
  }
  
  handleSubmit() {
    if (this.model.isValid()) {
      this.onNextStep();
    } else {
      this.view.showErrors(this.model.getErrors());
    }
  }

  start() {
    this.view.render();
  }
}

