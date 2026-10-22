export interface ModalInterface {
  openModal: () => void
  closeModal: () => void
}

export type RelaunchAction = 'replace' | 'duplicate'

export type simpleSqlOperator =
  | 'est égal à'
  | "n'est pas égal à"
  | 'est inférieur à'
  | 'est inférieur ou égal à'
  | 'est supérieur à'
  | 'est supérieur ou égal à'
  | 'correspond au motif'
  | 'ne correspond pas au motif'
  | 'commence par'
  | 'ne commence pas par'
  | 'contient'
  | 'ne contient pas'
  | 'finit par'
  | 'ne finit pas par'
  | 'est dans la liste'
  | "n'est pas dans la liste"
  | 'est vide'
  | "n'est pas vide"
  | 'est nul'
  | "n'est pas nul"