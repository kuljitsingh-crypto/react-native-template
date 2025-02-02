import React, {useState} from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native';
import {colors} from '../constants';
import {combineStyles} from '../utill';

type InlineTextButtonProps = Omit<PressableProps, 'style'> & {
  style?: Record<string, unknown>;
};
export const InlineTextButton = (props: InlineTextButtonProps) => {
  const {style, children, disabled, onPressIn, onPressOut, onPress, ...rest} =
    props;
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = (e: GestureResponderEvent) => {
    setIsPressed(true);
    if (typeof onPressIn === 'function') {
      onPressIn(e);
    }
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    setIsPressed(false);
    if (typeof onPressOut === 'function') {
      onPressOut(e);
    }
  };
  const handlePress = (e: GestureResponderEvent) => {
    if (typeof onPress === 'function') {
      onPress(e);
    }
  };
  const buttonStyle = combineStyles(
    inlineButtonStyle.button,
    {
      style: style as any,
      applyIf: !!style,
    },
    {
      style: {opacity: 0.6, backgroundColor: colors.buttonBgTransparentColor},
      applyIf: isPressed,
    },

    {
      style: {opacity: 0.3},
      applyIf: !!disabled,
    },
  );

  return (
    <Pressable
      style={buttonStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...rest}>
      {children}
    </Pressable>
  );
};

const inlineButtonStyle = StyleSheet.create({
  button: {
    opacity: 1,
  },
});

type PrimaryButtonProps = Omit<PressableProps, 'style'> & {
  style?: Record<string, unknown>;
  inProgress?: boolean;
};
export const PrimaryButton = (props: PrimaryButtonProps) => {
  const {
    style,
    children,
    onPressIn,
    onPressOut,
    onPress,
    inProgress = false,
    disabled,
    ...rest
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = (e: GestureResponderEvent) => {
    setIsPressed(true);
    if (typeof onPressIn === 'function') {
      onPressIn(e);
    }
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    setIsPressed(false);
    if (typeof onPressOut === 'function') {
      onPressOut(e);
    }
  };
  const handlePress = (e: GestureResponderEvent) => {
    if (disabled || inProgress) {
      return;
    }
    if (typeof onPress === 'function') {
      onPress(e);
    }
  };
  const buttonStyle = combineStyles(
    primaryButtonStyle.button,
    {
      style: style as any,
      applyIf: !!style,
    },
    {
      style: {opacity: 0.6, backgroundColor: colors.buttonBgTransparentColor},
      applyIf: !!(isPressed || disabled),
    },
  );

  return (
    <Pressable
      style={buttonStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      {...rest}>
      {inProgress ? (
        <ActivityIndicator size={'large'} color={colors.white} />
      ) : (
        children
      )}
    </Pressable>
  );
};

const primaryButtonStyle = StyleSheet.create({
  button: {
    width: '100%',
    opacity: 1,
    backgroundColor: colors.primary,
    color: colors.white,
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 12,
  },
});

type SecondaryButtonProps = Omit<PressableProps, 'style'> & {
  style?: Record<string, unknown>;
  inProgress?: boolean;
};
export const SecondaryButton = (props: SecondaryButtonProps) => {
  const {
    style,
    children,
    onPressIn,
    onPressOut,
    onPress,
    inProgress = false,
    disabled,
    ...rest
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const handlePressIn = (e: GestureResponderEvent) => {
    setIsPressed(true);
    if (typeof onPressIn === 'function') {
      onPressIn(e);
    }
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    setIsPressed(false);
    if (typeof onPressOut === 'function') {
      onPressOut(e);
    }
  };
  const handlePress = (e: GestureResponderEvent) => {
    if (disabled || inProgress) {
      return;
    }
    if (typeof onPress === 'function') {
      onPress(e);
    }
  };
  const buttonStyle = combineStyles(
    secondaryButtonStyle.button,
    {
      style: style as any,
      applyIf: !!style,
    },
    {style: {opacity: 0.3}, applyIf: !!(isPressed || disabled)},
  );

  return (
    <Pressable
      style={buttonStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      {...rest}>
      {inProgress ? (
        <ActivityIndicator size={'large'} color={colors.primaryDark} />
      ) : (
        children
      )}
    </Pressable>
  );
};

const secondaryButtonStyle = StyleSheet.create({
  button: {
    width: '100%',
    opacity: 1,
    backgroundColor: colors.white,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 12,
  },
});
