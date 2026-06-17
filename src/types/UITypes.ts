export interface ModalInterface {
  openModal: () => void
  closeModal: () => void
}

export type RelaunchAction = 'replace' | 'duplicate'