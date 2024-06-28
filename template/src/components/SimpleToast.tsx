import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { container, headerText, normalFont } from "../styles/appDefaultStyle";
import { colors } from "../constants";
import { InlineTextButton } from "./Button";
import Icon from "./Icon";

export const ToastType = {
  info: "info",
  success: "success",
  error: "error",
  default: "default",
} as const;
type ToastTypeValue = (typeof ToastType)[keyof typeof ToastType];
type ModalType = {
  type: ToastTypeValue;
  title?: string;
  desc?: string;
  isOpen: boolean;
  showCloseButton: boolean;
};
type ContextType = {
  updateModal: (arg: { title?: string; desc?: string }) => void;
  toggleModal: (isModalOpen: boolean) => void;
  initiateModal: (option: ModalType) => void;
};
type InlineSimpleToastProps = {
  type?: ToastTypeValue;
  isOpen?: boolean;
  title?: string;
  desc?: string;
  infoColor?: string;
  successColor?: string;
  errorColor?: string;
  showCloseButton: boolean;
};
type SimpleToastProps = {
  type?: ToastTypeValue;
  isOpen: boolean;
  title: string;
  desc: string;
  showCloseButton?: boolean;
  autoHideTimeout?: number;
};
type SimpleToastProviderProps = {
  children: React.JSX.Element;
  infoColor?: string;
  successColor?: string;
  errorColor?: string;
};

const useModal = () => {
  const [modal, setModal] = useState<ModalType>({
    type: ToastType.default,
    title: "",
    desc: "",
    isOpen: false,
    showCloseButton: false,
  });

  const updateModal = (arg: { title?: string; desc?: string }) => {
    const { title, desc } = arg;
    const titleMaybe = typeof title === "string" && title ? { title } : {};
    const descMaybe = typeof desc === "string" && desc ? { desc } : {};
    setModal((arg) => ({ ...arg, ...titleMaybe, ...descMaybe }));
  };

  const toggleModal = (isModalOpen: boolean) => {
    setModal((arg) => ({ ...arg, isOpen: isModalOpen }));
  };

  const initiateModal = (option: ModalType) => {
    const { title, desc, isOpen, showCloseButton, type } = option;
    const titleMaybe = typeof title === "string" && title ? { title } : {};
    const descMaybe = typeof desc === "string" && desc ? { desc } : {};
    const typeMaybe = ToastType.hasOwnProperty(type)
      ? { type }
      : { type: ToastType.default };
    setModal((arg) => ({
      ...arg,
      ...titleMaybe,
      ...descMaybe,
      ...typeMaybe,
      isOpen: !!isOpen,
      showCloseButton: !!showCloseButton,
    }));
  };

  return { modal, updateModal, toggleModal, initiateModal };
};
const SimpleToastContext = React.createContext({} as ContextType);
const useSimpleToastContext = () => {
  const context = useContext(SimpleToastContext);
  return context;
};

const InlineSimpleToast = (props: InlineSimpleToastProps) => {
  const {
    isOpen,
    title,
    desc,
    showCloseButton,
    type = ToastType.default,
    infoColor,
    successColor,
    errorColor,
  } = props;
  const { toggleModal } = useSimpleToastContext();

  const handleClose = () => {
    toggleModal(false);
  };

  const typeColor =
    (type === ToastType.info
      ? infoColor
      : type === ToastType.success
      ? successColor
      : type === ToastType.error
      ? errorColor
      : colors.black) || colors.black;

  const textColor = { color: typeColor };

  return isOpen ? (
    <View style={styles.modalContainer}>
      <View style={styles.modelContent}>
        {title ? (
          <Text style={[styles.modalTitle, textColor]}>{title}</Text>
        ) : null}
        {desc ? (
          <Text style={[styles.modalDesc, textColor]}>{desc}</Text>
        ) : null}
      </View>
      {showCloseButton ? (
        <InlineTextButton onPress={handleClose}>
          <Icon name='close' iconType='ant' />
        </InlineTextButton>
      ) : null}
    </View>
  ) : null;
};

export const SimpleToastProvider = (props: SimpleToastProviderProps) => {
  const { children, infoColor, successColor, errorColor } = props;
  const { modal, toggleModal, initiateModal, updateModal } = useModal();
  return (
    <SimpleToastContext.Provider
      value={{ updateModal, initiateModal, toggleModal }}>
      <View style={styles.root}>
        <InlineSimpleToast
          title={modal.title}
          desc={modal.desc}
          isOpen={modal.isOpen}
          type={modal.type}
          showCloseButton={modal.showCloseButton}
          infoColor={infoColor}
          successColor={successColor}
          errorColor={errorColor}
        />
        {children}
      </View>
    </SimpleToastContext.Provider>
  );
};

export const SimpleToast = (props: SimpleToastProps) => {
  const {
    isOpen,
    title,
    desc,
    showCloseButton,
    type = ToastType.default,
    autoHideTimeout = 5000,
  } = props;
  const { initiateModal, toggleModal } = useSimpleToastContext();

  const handleClose = () => {
    if (showCloseButton) return;
    setTimeout(() => {
      toggleModal(false);
    }, autoHideTimeout);
  };

  useEffect(() => {
    if (isOpen) {
      initiateModal({
        title,
        desc,
        isOpen,
        type,
        showCloseButton: !!showCloseButton,
      });
      handleClose();
    }
  }, [isOpen]);

  return null;
};

export const useToast = (options?: { autoHideTimeout?: number }) => {
  const { autoHideTimeout = 5000 } = options || {};
  const { initiateModal, toggleModal } = useSimpleToastContext();
  const hide = () => {
    toggleModal(false);
  };
  const show = (
    option: Omit<ModalType, "showCloseButton" | "isOpen" | "type"> & {
      type?: ToastTypeValue;
    }
  ) => {
    const { title, desc, type } = option;
    initiateModal({
      title,
      desc,
      type: type || ToastType.default,
      isOpen: true,
      showCloseButton: false,
    });
    setTimeout(hide, autoHideTimeout);
  };

  return { show, hide };
};

const styles = StyleSheet.create({
  root: {
    ...container,
    padding: 0,
    position: "relative",
  },

  modalContainer: {
    position: "absolute",
    backgroundColor: colors.white,
    flexDirection: "row",
    padding: 16,
    width: "90%",
    zIndex: 2,
    top: 36,
    right: 5,
    borderRadius: 6,
    elevation: 16,
    shadowColor: colors.black,
    alignItems: "flex-start",
  },
  modelContent: {
    flexGrow: 1,
  },
  modalTitle: {
    ...headerText,
    textTransform: "capitalize",
  },
  modalDesc: {
    ...normalFont,
    color: colors.black,
  },
});
