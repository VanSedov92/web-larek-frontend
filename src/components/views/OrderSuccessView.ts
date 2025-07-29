import { IOrderSuccessView } from '../../types/index';

export class OrderSuccessView implements IOrderSuccessView {
  private container: HTMLElement;
  private template: HTMLTemplateElement;
  private closeButton: HTMLButtonElement;
  private titleElement: HTMLElement;
  private descriptionElement: HTMLElement;

  private onCloseCallback: () => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;
    const template = document.getElementById('success');
    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error('Template #success not found');
    }
    this.template = template;

    this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
    this.titleElement = this.container.querySelector('.order-success__title') as HTMLElement;
    this.descriptionElement = this.container.querySelector('.order-success__description') as HTMLElement;

    this.closeButton.addEventListener('click', () => {
      this.onCloseCallback();
    });
  }

  render(): void {
    this.container.innerHTML = '';
    
    const content = this.template.content.cloneNode(true) as DocumentFragment;
    this.container.appendChild(content);

    this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
    this.titleElement = this.container.querySelector('.order-success__title') as HTMLElement;
    this.descriptionElement = this.container.querySelector('.order-success__description') as HTMLElement;

    this.closeButton.addEventListener('click', () => {
      this.onCloseCallback();
    });
  }

  setTitle(text: string): void {
  this.titleElement.textContent = text;
  }
  

  setDescription(text: string): void {
    this.descriptionElement.textContent = text;
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }
}
