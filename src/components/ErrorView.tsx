import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FormatedMessage} from './translation';
import {colors} from '../utill';
import {normalFont} from '../styles/appDefaultStyle';

type ErrorViewProps = {
  id?: string;
  values?: Record<string, unknown>;
  text?: string;
  children?: React.ReactNode;
  viewStyle?: Record<string, unknown>;
  textStyle?: Record<string, unknown>;
};
const ErrorView = (props: ErrorViewProps) => {
  const {
    id,
    textStyle: propsTextStyle,
    viewStyle: propsViewStyle,
    values,
    text,
    children,
  } = props;
  const hasValue =
    (id && typeof id === 'string') ||
    (text && typeof text === 'string') ||
    children;
  if (!hasValue) return null;

  const textStyle = [styles.text, ...(propsTextStyle ? [propsTextStyle] : [])];
  const viewStyle = [styles.view, ...(propsViewStyle ? [propsViewStyle] : [])];
  const formateMessageStyle = {
    ...styles.text,
    ...(propsTextStyle ? propsTextStyle : {}),
  };

  const content = text ? (
    <Text style={textStyle}>{text}</Text>
  ) : id ? (
    <FormatedMessage id={id} values={values} style={formateMessageStyle} />
  ) : (
    children
  );
  return <View style={viewStyle}>{content}</View>;
};

export default ErrorView;

const styles = StyleSheet.create({
  text: {
    ...normalFont,
    color: colors.matterColorErrorText,
  },
  view: {
    width: '100%',
    paddingVertical: 12,
    color: colors.matterColorErrorText,
  },
});
