import React from 'react';
import {Text} from 'react-native';
import {useIntl} from '../hooks';

type FormatMessageProps = {
  id: string;
  values?: Record<string, any>;
  style?: Record<string, unknown>;
};
export function FormatedMessage(props: FormatMessageProps) {
  const {id, values, style} = props;
  const {formatMessage} = useIntl();
  if (!id) {
    return null;
  }
  const message = formatMessage(id, values);
  const textStyle = style ? [style] : [];
  return <Text style={textStyle}>{message}</Text>;
}
