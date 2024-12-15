import {ImageStyle, TextStyle, ViewStyle} from 'react-native';

type NativeStyle = ViewStyle | TextStyle | ImageStyle | null | undefined;
type CompositeStyle = {style: NativeStyle; applyIf: boolean};
type CombineStyles = (NativeStyle | CompositeStyle)[];

const isCompositeStyle = (style: CompositeStyle | null | undefined) => {
  return !!(style && typeof style.applyIf === 'boolean' && style.style);
};
export const combineStyles = (...styles: CombineStyles) => {
  const combinedStyles = styles.reduce((acc, style) => {
    const compositeStyle = style as CompositeStyle;
    if (
      isCompositeStyle(compositeStyle) &&
      compositeStyle.applyIf &&
      compositeStyle.style
    ) {
      Object.assign(acc, compositeStyle.style);
    } else if (style) {
      Object.assign(acc, style);
    }
    return acc;
  }, {} as Record<string, any>);
  return combinedStyles;
};
