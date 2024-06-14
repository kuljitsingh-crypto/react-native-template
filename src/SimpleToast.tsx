import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Icon, InlineTextButton} from './components';
import {container, headerText, normalFont} from './styles/appDefaultStyle';
import {colors} from './utill';

type ModalType = {
  title?: string;
  desc?: string;
  isOpen: boolean;
  showCloseButton: boolean;
};
type ContextType = {
  updateModal: (arg: {title?: string; desc?: string}) => void;
  toggleModal: (isModalOpen: boolean) => void;
  initiateModal: (option: ModalType) => void;
};
type InlineSimpleToastProps = {
  isOpen?: boolean;
  title?: string;
  desc?: string;
  showCloseButton: boolean;
};
type SimpleToastProps = {
  isOpen: boolean;
  title: string;
  desc: string;
  showCloseButton?: boolean;
};
type SimpleToastProviderProps = {
  children: React.JSX.Element;
};

const useModal = () => {
  const [modal, setModal] = useState<ModalType>({
    title: '',
    desc: '',
    isOpen: false,
    showCloseButton: false,
  });

  const updateModal = (arg: {title?: string; desc?: string}) => {
    const {title, desc} = arg;
    const titleMaybe = typeof title === 'string' && title ? {title} : {};
    const descMaybe = typeof desc === 'string' && desc ? {desc} : {};
    setModal(arg => ({...arg, ...titleMaybe, ...descMaybe}));
  };

  const toggleModal = (isModalOpen: boolean) => {
    setModal(arg => ({...arg, isOpen: isModalOpen}));
  };

  const initiateModal = (option: ModalType) => {
    const {title, desc, isOpen, showCloseButton} = option;
    const titleMaybe = typeof title === 'string' && title ? {title} : {};
    const descMaybe = typeof desc === 'string' && desc ? {desc} : {};
    setModal(arg => ({
      ...arg,
      ...titleMaybe,
      ...descMaybe,
      isOpen: !!isOpen,
      showCloseButton: !!showCloseButton,
    }));
  };

  return {modal, updateModal, toggleModal, initiateModal};
};
const SimpleToastContext = React.createContext({} as ContextType);
const useSimpleToastContext = () => {
  const context = useContext(SimpleToastContext);
  return context;
};

const InlineSimpleToast = (props: InlineSimpleToastProps) => {
  const {isOpen, title, desc, showCloseButton} = props;
  const {toggleModal} = useSimpleToastContext();

  const handleClose = () => {
    toggleModal(false);
  };

  return isOpen ? (
    <View style={styles.modalContainer}>
      <View style={styles.modelContent}>
        {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
        {desc ? <Text style={styles.modalDesc}>{desc}</Text> : null}
      </View>
      {showCloseButton ? (
        <InlineTextButton onPress={handleClose}>
          <Icon name="close" iconType="ant" />
        </InlineTextButton>
      ) : null}
    </View>
  ) : null;
};

export const SimpleToastProvider = (props: SimpleToastProviderProps) => {
  const {children} = props;
  const {modal, toggleModal, initiateModal, updateModal} = useModal();
  return (
    <SimpleToastContext.Provider
      value={{updateModal, initiateModal, toggleModal}}>
      <View style={styles.root}>
        <InlineSimpleToast
          title={modal.title}
          desc={modal.desc}
          isOpen={modal.isOpen}
          showCloseButton={modal.showCloseButton}
        />
        {children}
      </View>
    </SimpleToastContext.Provider>
  );
};

export const SimpleToast = (props: SimpleToastProps) => {
  const {isOpen, title, desc, showCloseButton} = props;
  const {initiateModal, toggleModal} = useSimpleToastContext();

  const handleClose = () => {
    if (showCloseButton) return;
    setTimeout(() => {
      toggleModal(false);
    }, 5000);
  };

  useEffect(() => {
    if (isOpen) {
      initiateModal({title, desc, isOpen, showCloseButton: !!showCloseButton});
      handleClose();
    }
  }, [isOpen]);

  return null;
};

export const useToast = () => {
  const {initiateModal, toggleModal} = useSimpleToastContext();
  const hide = () => {
    toggleModal(false);
  };
  const show = (option: Omit<ModalType, 'showCloseButton' | 'isOpen'>) => {
    initiateModal({...option, isOpen: true, showCloseButton: false});
    setTimeout(hide, 5000);
  };

  return {show, hide};
};

const styles = StyleSheet.create({
  root: {
    ...container,
    padding: 0,
    position: 'relative',
  },

  modalContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
    flexDirection: 'row',
    padding: 16,
    width: '90%',
    zIndex: 2,
    top: 36,
    right: 5,
    borderRadius: 6,
    elevation: 16,
    shadowColor: colors.black,
    alignItems: 'flex-start',
  },
  modelContent: {
    flexGrow: 1,
  },
  modalTitle: {
    ...headerText,
    textTransform: 'capitalize',
  },
  modalDesc: {
    ...normalFont,
    color: colors.black,
  },
});
