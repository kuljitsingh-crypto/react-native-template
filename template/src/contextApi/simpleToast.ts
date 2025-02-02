import React, {useContext} from 'react';

export const SimpleToastType = {
  info: 'info',
  success: 'success',
  error: 'error',
  default: 'default',
} as const;

export const SimpleToastPosition = {
  top: 'top',
  bottom: 'bottom',
  side: 'side',
  // left: 'left',
  // right: 'right',
} as const;

export type SimpleToastTypeValues =
  (typeof SimpleToastType)[keyof typeof SimpleToastType];

export type SimpleToastPositionValues =
  (typeof SimpleToastPosition)[keyof typeof SimpleToastPosition];

export type SimpleToastModalType = {
  type: SimpleToastTypeValues;
  title?: string;
  desc?: string;
  isOpen: boolean;
  showCloseButton: boolean;
  position?: SimpleToastPositionValues;
};

type SimpleToastContextType = {
  hideModal: () => void;
  showModal: (option: SimpleToastModalType) => void;
  autoHideModal: (timeout?: number) => void;
};

export const SimpleToastContext = React.createContext(
  {} as SimpleToastContextType,
);

export const useSimpleToastContext = () => {
  const context = useContext(SimpleToastContext);
  return context;
};
