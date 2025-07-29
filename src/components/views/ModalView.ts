export class ModalView {
  private modal: HTMLElement;
  private closeButton: HTMLElement;
  private modalContent: HTMLElement;

  constructor(modalId: string) {
    const modalElement = document.querySelector(`#${modalId}`) as HTMLElement | null;
    if (!modalElement) {
      throw new Error(`${modalId} не найдено`);
    }
    this.modal = modalElement;

    const closeBtn = this.modal.querySelector('.modal__close') as HTMLElement | null;
    if (!closeBtn) {
      throw new Error('Кнопка закрытия модального окна не найдена');
    }
    this.closeButton = closeBtn;

    const content = this.modal.querySelector('.modal__content') as HTMLElement | null;
    if (!content) {
      throw new Error('Контейнер для содержимого модального окна не найден');
    }
    this.modalContent = content;

    this.closeButton.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.close();
      }
    });
  }

  open(): void {
    this.modal.classList.add('modal_active');
  }

  close(): void {
    this.clearContent();
    this.modal.classList.remove('modal_active');
  }

  setContent(content: HTMLElement): void {
    this.clearContent();
    this.modalContent.appendChild(content);
  }

  private clearContent(): void {
    this.modalContent.replaceChildren();
  }
}
