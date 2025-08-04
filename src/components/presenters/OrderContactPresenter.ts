import { IOrderContactModel, IOrderContactView, ContactFormData } from '../../types';

export class OrderContactPresenter {
  constructor(
    private view: IOrderContactView,
    private model: IOrderContactModel
  ) {
    this.view.onFieldChange = this.handleFieldChange.bind(this);
    this.model.on('changed', this.handleModelChange.bind(this));

    this.handleModelChange();
  }

  private handleFieldChange(field: keyof ContactFormData, value: string) {
    this.model.setField(field, value);
  }

  private handleModelChange(): void {
    const errors = this.model.getErrors();

    if (errors.length > 0) {
      this.view.showErrors(errors);
    } else {
      this.view.cleanErrors();
    }

    this.view.setSubmitEnabled(this.model.isValid());
  }
}

