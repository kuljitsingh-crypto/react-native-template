import {
  Animated,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  container,
  headerText,
  normalFont,
  toastZIndex,
} from '../styles/appDefaultStyle';
import {colors} from '../constants';
import {InlineTextButton} from './Button';
import Icon from './Icon';
import {
  SimpleToastContext,
  SimpleToastModalType,
  SimpleToastPosition,
  SimpleToastPositionValues,
  SimpleToastType,
  SimpleToastTypeValues,
  useDeviceDimensions,
  useSimpleToastContext,
} from '../contextApi';

const DEFAULT_TOAST_HIDE_OUT_TIME = 5000; //5000 milliseconds
const MODAL_WIDTH = '90%'; // remaining % is used to move the toast left or right
const Y_OFFSET = 80; // for top or bottom, in px
const X_OFFSET = (100 - parseInt(MODAL_WIDTH)) / 100; // for left or right, in %

type InlineSimpleToastProps = {
  type?: SimpleToastTypeValues;
  isOpen?: boolean;
  title?: string;
  desc?: string;
  infoColor?: string;
  successColor?: string;
  errorColor?: string;
  showCloseButton: boolean;
  position?: SimpleToastPositionValues;
};
type SimpleToastProps = {
  type?: SimpleToastTypeValues;
  isOpen: boolean;
  title: string;
  desc: string;
  showCloseButton?: boolean;
  autoHideTimeout?: number;
  position?: SimpleToastPositionValues;
};
type SimpleToastProviderProps = {
  children: React.JSX.Element;
  infoColor?: string;
  successColor?: string;
  errorColor?: string;
};

const defaultModalState = {
  type: SimpleToastType.default,
  title: '',
  desc: '',
  isOpen: false,
  showCloseButton: false,
  position: SimpleToastPosition.top,
};

const useModal = () => {
  const [modal, setModal] = useState<SimpleToastModalType>(defaultModalState);
  const timeoutId = useRef<null | any>(null);
  const clearPrevTimeoutId = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };
  const autoHideModal = (timeout = DEFAULT_TOAST_HIDE_OUT_TIME) => {
    clearPrevTimeoutId();
    timeoutId.current = setTimeout(hideModal, timeout);
  };

  const hideModal = () => {
    setModal(arg => ({
      ...arg,
      isOpen: false,
    }));
  };

  const showModal = (option: SimpleToastModalType) => {
    const {title, desc, isOpen, showCloseButton, type, position} = option;
    const titleMaybe = typeof title === 'string' && title ? {title} : {};
    const descMaybe = typeof desc === 'string' && desc ? {desc} : {};
    const typeMaybe = SimpleToastType.hasOwnProperty(type)
      ? {type}
      : {type: SimpleToastType.default};
    const positionMaybe =
      position && SimpleToastPosition.hasOwnProperty(position)
        ? {position}
        : {position: SimpleToastPosition.top};

    clearPrevTimeoutId();
    setModal(arg => ({
      ...arg,
      ...titleMaybe,
      ...descMaybe,
      ...typeMaybe,
      ...positionMaybe,
      isOpen: !!isOpen,
      showCloseButton: !!showCloseButton,
    }));
  };

  return {modal, showModal, hideModal, autoHideModal};
};

const InlineSimpleToast = (props: InlineSimpleToastProps) => {
  const {
    isOpen,
    title,
    desc,
    showCloseButton,
    type = SimpleToastType.default,
    infoColor,
    successColor,
    errorColor,
    position,
  } = props;
  const {hideModal} = useSimpleToastContext();
  const dimensions = useDeviceDimensions();
  const [showToast, setShowToast] = useState(false);
  const layoutDimension = useRef<LayoutRectangle | null>(null);
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const containerRef = useRef<View | null>(null);

  const handleClose = () => {
    hideModal();
  };

  const onAnimationEnd = (result: Animated.EndResult) => {
    if (!result.finished) {
      translateXAnim.stopAnimation();
      translateYAnim.stopAnimation();
    }
    if (!isOpen && result.finished) {
      translateXAnim.setValue(0);
      translateYAnim.setValue(0);
      setShowToast(false);
    }
  };

  const startAnimation = ({x, y}: {x: number; y: number}) => {
    Animated.parallel([
      Animated.spring(translateXAnim, {
        toValue: x,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: y,
        useNativeDriver: true,
      }),
    ]).start(onAnimationEnd);
  };

  const getToastPos = () => {
    const {height = 0} = layoutDimension.current || {};
    const screenWidth = dimensions.width;
    const screenHeight = dimensions.height;
    const minYOffset = Math.min(Math.max(0, screenHeight - height), Y_OFFSET);
    const xOffset = screenWidth * X_OFFSET;
    const pos = {x: xOffset, y: Y_OFFSET};
    switch (position) {
      case 'bottom':
        pos.y = Math.max(0, screenHeight - height - minYOffset);
        break;
      case 'side':
        pos.x = xOffset;
        break;
      default:
        pos.y = minYOffset;
        break;
    }
    return pos;
  };

  const initializePos = () => {
    const posPromise = new Promise<{x: number; y: number}>(
      (resolve, reject) => {
        let pos = null;
        if (showToast) {
          if (containerRef.current) {
            containerRef.current.measure((x, y, width, height) => {
              layoutDimension.current =
                layoutDimension.current ?? ({} as LayoutRectangle);
              layoutDimension.current.height = height;
              layoutDimension.current.width = width;
              layoutDimension.current.x = x;
              layoutDimension.current.y = y;

              pos = getToastPos();
              resolve(pos);
            });
          } else {
            pos = getToastPos();
            resolve(pos);
          }
        } else {
          pos = {x: dimensions.width * X_OFFSET, y: dimensions.height};
          if (position === 'side') {
            pos.x = 0;
            pos.y = Y_OFFSET;
          } else if (position === 'top') {
            pos.y = 0;
          }
          resolve(pos);
        }
      },
    );

    return posPromise.then(pos => {
      translateYAnim.setValue(pos.y);
      translateXAnim.setValue(pos.x);
      return pos;
    });
  };

  const showToastCb = () => {
    const pos = getToastPos();
    setShowToast(true);
    startAnimation(pos);
  };

  const hideToast = () => {
    const pos = {x: dimensions.width * X_OFFSET, y: dimensions.height};
    const {width = 0, height = 0} = layoutDimension.current || {};
    if (position === 'side') {
      pos.x = -width;
      pos.y = Y_OFFSET;
    } else if (position === 'top') {
      pos.y = -(height + Y_OFFSET);
    }
    startAnimation(pos);
  };

  const onContainerDimessionChange = (e: LayoutChangeEvent) => {
    layoutDimension.current = e.nativeEvent.layout;
    if (isOpen && !showToast) {
      initializePos().then(showToastCb);
    }
  };

  const typeColor =
    (type === SimpleToastType.info
      ? infoColor
      : type === SimpleToastType.success
      ? successColor
      : type === SimpleToastType.error
      ? errorColor
      : colors.black) || colors.black;

  const textColor = {color: typeColor};
  const containerStyle = [
    styles.modalContainer,
    ...(showToast ? [styles.openModalContainer] : []),
    {transform: [{translateX: translateXAnim}, {translateY: translateYAnim}]},
  ];

  useEffect(() => {
    if (isOpen) {
      initializePos();
    } else {
      hideToast();
    }
  }, [isOpen, position]);

  return (
    <Animated.View
      style={containerStyle}
      onLayout={onContainerDimessionChange}
      ref={containerRef}>
      {isOpen || showToast ? (
        <React.Fragment>
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
              <Icon name="close" iconType="ant" />
            </InlineTextButton>
          ) : null}
        </React.Fragment>
      ) : null}
    </Animated.View>
  );
};

export const SimpleToastProvider = (props: SimpleToastProviderProps) => {
  const {children, infoColor, successColor, errorColor} = props;
  const {modal, showModal, hideModal, autoHideModal} = useModal();

  return (
    <SimpleToastContext.Provider value={{showModal, hideModal, autoHideModal}}>
      <View style={styles.root}>
        {children}
        <InlineSimpleToast
          title={modal.title}
          desc={modal.desc}
          isOpen={modal.isOpen}
          type={modal.type}
          position={modal.position}
          showCloseButton={modal.showCloseButton}
          infoColor={infoColor}
          successColor={successColor}
          errorColor={errorColor}
        />
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
    type = SimpleToastType.default,
    autoHideTimeout = DEFAULT_TOAST_HIDE_OUT_TIME,
    position,
  } = props;
  const {showModal, hideModal, autoHideModal} = useSimpleToastContext();

  const handleClose = () => {
    if (showCloseButton) return;
    autoHideModal(autoHideTimeout);
  };

  useEffect(() => {
    if (isOpen) {
      showModal({
        title,
        desc,
        isOpen,
        type,
        position,
        showCloseButton: !!showCloseButton,
      });
      handleClose();
    } else {
      hideModal();
    }
  }, [isOpen]);

  return null;
};

export const useSimpleToast = (options?: {autoHideTimeout?: number}) => {
  const {autoHideTimeout = DEFAULT_TOAST_HIDE_OUT_TIME} = options || {};
  const {showModal, autoHideModal, hideModal} = useSimpleToastContext();

  const hide = () => {
    hideModal();
  };
  const show = (
    option: Omit<
      SimpleToastModalType,
      'showCloseButton' | 'isOpen' | 'type'
    > & {
      type?: SimpleToastTypeValues;
    },
  ) => {
    const {title, desc, type, position} = option;
    showModal({
      title,
      desc,
      type: type || SimpleToastType.default,
      isOpen: true,
      showCloseButton: false,
      position,
    });
    autoHideModal(autoHideTimeout);
  };

  return {show, hide};
};

const styles = StyleSheet.create({
  rootWrapper: {
    ...container,
    padding: 0,
  },
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
    width: MODAL_WIDTH,
    zIndex: -1,
    opacity: 0,
    pointerEvents: 'none',
    top: 0,
    left: 0,
    transform: [{translateX: 0}, {translateY: 0}],
    borderRadius: 6,
    elevation: 16,
    shadowColor: colors.black,
    alignItems: 'flex-start',
  },
  openModalContainer: {
    zIndex: toastZIndex,
    opacity: 1,
    pointerEvents: 'auto',
  },
  modelContent: {
    flexGrow: 1,
  },
  modalTitle: {
    ...headerText,
    fontSize: 18,
    lineHeight: 32,
    textTransform: 'capitalize',
  },
  modalDesc: {
    ...normalFont,
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
  },
});
