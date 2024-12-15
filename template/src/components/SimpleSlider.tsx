import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {combineStyles} from '../utill';
import {InlineTextButton} from './Button';
import Icon from './Icon';

const DRAG_LEFT_MAX_THREHOLD = 20; // 20 px
const DRAG_RIGHT_MAX_THREHOLD = 20; // 20 px
type SimpleSlider<T> = {
  items: T[];
  itemWidth: number | number[];
  infiniteScroll?: boolean;
  showArrowBtn?: boolean;
  renderItem: (item: {item: T; index: number}) => React.ReactElement | null;
};

// const useTranslate = ({
//   itemsValue,
//   totalItems,
//   initalValue = 0,
//   onUpdateIndex,
// }: {
//   itemsValue: number | number[];
//   totalItems: number;
//   initalValue?: number;
//   onUpdateIndex: (index: number) => void;
// }) => {
//   const totalTranslated = useRef(initalValue);
//   const prevTranslated = useRef(initalValue);
//   const maxValue = useRef(initalValue);
//   const containerWidth = useRef(initalValue);
//   const activeIndex = useRef(0);

//   const getItemWidth = (index: number) => {
//     return Array.isArray(itemsValue) ? itemsValue[index] : itemsValue;
//   };

//   const positions = useMemo(() => {
//     const pos: {start: number; end: number}[] = [];
//     for (let i = 0; i < totalItems; i++) {
//       const prevIndex = Math.max(0, i - 1);
//       const start = prevIndex === i ? 0 : pos[prevIndex].end;
//       const itemWidth = -1 * getItemWidth(i);
//       pos[i] = {start: start, end: start + itemWidth};
//     }
//     return pos;
//   }, [totalItems]);

//   const calculateActiveIndex = (x: number) => {
//     let i = 0,
//       itemsLength = positions.length;
//     if (x < 0) {
//       for (; i < itemsLength; i++) {
//         const {start, end} = positions[i];
//         if (start > x && end <= x) {
//           break;
//         }
//       }
//     }
//     if (i === itemsLength) {
//       i = itemsLength - 1;
//     }
//     return i;
//   };

//   const getIndex = (
//     x: number,
//     offsetMultipler = 0.5,
//     includeInfiniteScroll = false,
//   ) => {
//     const endX = x;
//     const center = containerWidth.current * offsetMultipler;
//     const finalXOffset = endX - center;
//     let index = calculateActiveIndex(finalXOffset);
//     // if (includeInfiniteScroll) {
//     //   if (index === 0) {
//     //     index = originalItemsLength;
//     //   } else if (index === lastUpdatedItemIndex) {
//     //     index = 1;
//     //   }
//     // }
//     activeIndex.current = index;
//     return index;
//   };

//   const updateTranslate = (dx: number) => {
//     let maxWidth = maxValue.current - DRAG_RIGHT_MAX_THREHOLD;
//     const prevTotalTranslated = totalTranslated.current;
//     totalTranslated.current += dx - prevTranslated.current;
//     if (totalTranslated.current > DRAG_LEFT_MAX_THREHOLD) {
//       dx =
//         -1 * prevTotalTranslated +
//         prevTranslated.current +
//         DRAG_LEFT_MAX_THREHOLD;
//       totalTranslated.current = DRAG_LEFT_MAX_THREHOLD;
//     } else if (totalTranslated.current < maxWidth) {
//       dx = -1 * prevTotalTranslated + prevTranslated.current + maxWidth;
//       totalTranslated.current = maxWidth;
//     }
//     const index = getIndex(totalTranslated.current, 0.4);
//     prevTranslated.current = dx;
//     return {dx, index};
//   };

//   const resetPrevTranslate = () => {
//     prevTranslated.current = 0;
//   };

//   const setTranslate = (value: number) => {
//     totalTranslated.current = value;
//   };

//   const setTranslateMaxValue = (value: number, sliderWidth: number) => {
//     maxValue.current = -1 * value;
//     containerWidth.current = sliderWidth;
//   };

//   const getTranslateValue = () => {
//     return {
//       curntTranslate: totalTranslated.current,
//       prevTranslate: prevTranslated.current,
//     };
//   };

//   const translateByIndex = (translate: number) => {
//     const index = getIndex(translate, 0.4);
//     const width = -1 * getItemWidth(index) * index;
//     const animatedTranslate = Math.min(0, Math.max(width, maxValue.current));
//     let toValue = width - translate;
//     toValue = Math.abs(animatedTranslate) ? toValue : Math.min(0, toValue);
//     onUpdateIndex(index);
//     return {translateValue: animatedTranslate, animatedValue: toValue};
//   };

//   const animateTranslate = ({
//     animatedValue,
//     animateTranslate = true,
//     shouldCallAnimationFinishCb = true,
//     onAnimationFinish,
//   }: {
//     animatedValue: Animated.Value;
//     animateTranslate?: boolean;
//     shouldCallAnimationFinishCb?: boolean;
//     onAnimationFinish?: (params: {finished: boolean}) => void;
//   }) => {
//     const translate = getTranslateValue().curntTranslate;
//     let animatedTranslate = 0,
//       shouldAnimate = false,
//       toValue = 0;
//     if (translate > 0) {
//       animatedTranslate = 0;
//       toValue = 0;
//       shouldAnimate = true;
//     } else if (translate <= maxValue.current) {
//       toValue = 0;
//       animatedTranslate = maxValue.current;
//       shouldAnimate = true;
//     } else {
//       const {animatedValue, translateValue} = translateByIndex(translate);
//       animatedTranslate = translateValue;
//       toValue = animatedValue;
//       shouldAnimate = true;
//     }
//     if (!shouldAnimate) return shouldAnimate;
//     const isAnimationFinishCallbackCallable =
//       shouldCallAnimationFinishCb && typeof onAnimationFinish === 'function';

//     if (animateTranslate) {
//       setTranslate(animatedTranslate);
//       Animated.spring(
//         animatedValue, // Auto-multiplexed
//         {toValue, useNativeDriver: true}, // Back to zero
//       ).start(args => {
//         if (isAnimationFinishCallbackCallable) {
//           onAnimationFinish(args);
//         }
//       });
//     } else if (!animateTranslate && isAnimationFinishCallbackCallable) {
//       onAnimationFinish({finished: true});
//     }
//     return shouldAnimate;
//   };

//   const srcollByIndex = ({
//     index,
//     animatedValue,
//     animateTranslate = true,
//     shouldCallAnimationFinishCb = true,
//     onAnimationFinish,
//   }: {
//     index: number;
//     animatedValue: Animated.Value;
//     animateTranslate?: boolean;
//     shouldCallAnimationFinishCb?: boolean;
//     onAnimationFinish?: (params: {finished: boolean}) => void;
//   }) => {
//     const width = -1 * getItemWidth(index) * index;
//     const prevWidth =
//       -1 * getItemWidth(activeIndex.current) * activeIndex.current;
//     const translate = Math.min(0, Math.max(width, maxValue.current));
//     const prevTranslate = Math.min(0, Math.max(prevWidth, maxValue.current));
//     let toValue = translate;
//     toValue = Math.abs(translate) ? toValue : 0;
//     activeIndex.current = index;
//     prevTranslated.current = totalTranslated.current;
//     totalTranslated.current = translate;
//     const isAnimationFinishCallbackCallable =
//       shouldCallAnimationFinishCb && typeof onAnimationFinish === 'function';
//     console.log(toValue, index);
//     if (animateTranslate) {
//       Animated.spring(
//         animatedValue, // Auto-multiplexed
//         {toValue, useNativeDriver: true}, // Back to zero
//       ).start(args => {
//         // if (isAnimationFinishCallbackCallable) {
//         //   onAnimationFinish(args);
//         // }
//       });
//     } else if (!animateTranslate && isAnimationFinishCallbackCallable) {
//       onAnimationFinish({finished: true});
//     }
//     onUpdateIndex(index);
//   };

//   return {
//     resetPrevTranslate,
//     setTranslate,
//     updateTranslate,
//     getTranslateValue,
//     animateTranslate,
//     setTranslateMaxValue,
//     srcollByIndex,
//   };
// };

const useInfiniteScrollItems = <T,>(items: T[]) => {
  items = useMemo(() => {
    return [
      items[items.length - 2],
      items[items.length - 1],
      ...items,
      items[0],
      items[1],
    ];
  }, [items]);
  return items;
};

const useTouches = ({
  translateX,
  itemsWidth,
  totalItems,
  initialIndex,
  infiniteScroll,
  onUpdateIndex,
}: {
  translateX: Animated.Value;
  itemsWidth: number | number[];
  totalItems: number;
  initialIndex: number;
  infiniteScroll?: boolean;
  onUpdateIndex: (index: number) => void;
}) => {
  const dragged = useRef(0);
  const range = useRef({max: 0, min: 0});
  const containerWidth = useRef(0);
  const activeIndex = useRef(0);
  const isDragging = useRef(false);
  const lastIndex = totalItems - 1;

  const getItemWidth = (index: number) => {
    return Array.isArray(itemsWidth) ? itemsWidth[index] : itemsWidth;
  };

  const positions = useMemo(() => {
    const pos: {start: number; end: number}[] = [];
    for (let i = 0; i < totalItems; i++) {
      const prevIndex = Math.max(0, i - 1);
      const start = prevIndex === i ? 0 : pos[prevIndex].end;
      const itemWidth = -1 * getItemWidth(i);
      pos[i] = {start: start, end: start + itemWidth};
    }
    return pos;
  }, [totalItems]);

  const calculateActiveIndex = (x: number) => {
    let i = 0,
      itemsLength = positions.length;
    if (x < 0) {
      for (; i < itemsLength; i++) {
        const {start, end} = positions[i];
        if (start > x && end <= x) {
          break;
        }
      }
    }
    if (i === itemsLength) {
      i = itemsLength - 1;
    }
    return i;
  };

  const getIndex = (x: number, offsetMultipler = 0.5) => {
    const endX = x;
    const center = containerWidth.current * offsetMultipler;
    const finalXOffset = endX - center;
    const index = calculateActiveIndex(finalXOffset);

    activeIndex.current = index;
    return index;
  };

  const handleOnUpdateIndex = (index: number) => {
    // activeIndex.current = index;
    onUpdateIndex(index);
  };

  const correctTranslation = (
    translate: number,
    minOffset: number,
    maxOffset: number,
  ) => {
    if (translate >= range.current.min + minOffset) {
      translate = range.current.min + minOffset;
    } else if (translate <= range.current.max - maxOffset) {
      translate = range.current.max - maxOffset;
    }
    return translate;
  };

  const itemTranslateValueByIndex = (index: number) => {
    let translate = getItemWidth(index);
    if (Array.isArray(itemsWidth)) {
      translate -= getItemWidth(0);
      for (; index > 0; index--) {
        translate += getItemWidth(index);
      }
    } else {
      translate *= index;
    }
    translate *= -1;
    translate = correctTranslation(translate, 0, 0);
    return translate;
  };

  const correctIndexForScroll = (index: number) => {
    if (infiniteScroll) {
      if (index === 0) {
        index = totalItems - 4;
      } else if (index === 1) {
        index = totalItems - 3;
      } else if (index === lastIndex) {
        index = 3;
      } else if (index === lastIndex - 1) {
        index = 2;
      }
    }
    return index;
  };

  const onEndIndexSelect = (index: number) => (arg: any) => {
    if (!infiniteScroll) return;

    if (arg.finished) {
      if (index === 0) {
        index = totalItems - 4;
      } else if (index === 1) {
        index = totalItems - 3;
      } else if (index === lastIndex) {
        index = 3;
      } else if (index === lastIndex - 1) {
        index = 2;
      }
      srcollByIndex(index, false);
    }
  };

  const translateWithoutAnimation = (translate: number) => {
    translateX.setValue(translate);
  };

  const translateWithAnimation = (
    translate: number,
    onTranslationEnd?: (params: {finished: boolean}) => void,
  ) => {
    Animated.spring(
      translateX, // Auto-multiplexed
      {toValue: translate, useNativeDriver: true}, // Back to zero
    ).start(arg => {
      if (typeof onTranslationEnd === 'function') {
        onTranslationEnd(arg);
      }
    });
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    if (!isDragging.current) return;
    const pageX = e.nativeEvent.pageX;
    const dx = correctTranslation(
      pageX - dragged.current,
      DRAG_LEFT_MAX_THREHOLD,
      DRAG_RIGHT_MAX_THREHOLD,
    );
    translateWithoutAnimation(dx);
    const index = getIndex(dx, 0.4);
    handleOnUpdateIndex(correctIndexForScroll(index));
  };
  const handleTouchEnd = (e: GestureResponderEvent) => {
    isDragging.current = false;
    const pageX = e.nativeEvent.pageX;
    const dx = correctTranslation(
      pageX - dragged.current,
      DRAG_LEFT_MAX_THREHOLD,
      DRAG_RIGHT_MAX_THREHOLD,
    );
    const index = getIndex(dx, 0.4);
    const translate = itemTranslateValueByIndex(index);
    dragged.current = -1 * translate;
    translateWithAnimation(translate, onEndIndexSelect(index));
    handleOnUpdateIndex(correctIndexForScroll(index));
  };
  const handleTouchStart = (e: GestureResponderEvent) => {
    isDragging.current = true;
    const pageX = e.nativeEvent.pageX;
    dragged.current = dragged.current + pageX;
  };

  const setTouchRangeValue = (
    minTouchWidth: number,
    maxTouchWidth: number,
    sliderWidth: number,
  ) => {
    range.current = {max: -1 * maxTouchWidth, min: minTouchWidth};
    containerWidth.current = sliderWidth;
    srcollByIndex(initialIndex, false);
  };

  const srcollByIndex = (index: number, animateTranslate = true) => {
    if (index === activeIndex.current) return;
    const translate = itemTranslateValueByIndex(index);
    dragged.current = -1 * translate;
    activeIndex.current = index;
    if (animateTranslate) {
      translateWithAnimation(translate);
    } else {
      translateWithoutAnimation(translate);
    }
    handleOnUpdateIndex(index);
  };

  return {
    handleTouchEnd,
    handleTouchMove,
    handleTouchStart,
    setTouchRangeValue,
    srcollByIndex,
  };
};

const ScrollIndicater = <T,>({
  items,
  activeIndex,
  indicatorStyles,
  activeIndicatorStyles,
  hideIndexs,
  setActiveIndex,
}: {
  items: T[];
  activeIndex: number;
  indicatorStyles?: ViewStyle | TextStyle;
  activeIndicatorStyles?: ViewStyle | TextStyle;
  hideIndexs?: number[];
  setActiveIndex: (index: number) => void;
}) => {
  return (
    <View style={styles.indicatorWrapper}>
      {items.map((_, index) => {
        if (hideIndexs?.includes(index)) {
          return null;
        }
        const isSelected = index === activeIndex;
        const style = combineStyles(
          styles.indicator,
          indicatorStyles,
          {
            style: styles.activeIndicator,
            applyIf: isSelected,
          },
          {style: activeIndicatorStyles, applyIf: isSelected},
        );
        return (
          <InlineTextButton
            style={style}
            key={index}
            onPress={e => setActiveIndex(index)}></InlineTextButton>
        );
      })}
    </View>
  );
};

export default function SimpleSlider<T>(props: SimpleSlider<T>) {
  const {
    items: propItems,
    showArrowBtn,
    itemWidth,
    infiniteScroll,
    renderItem,
  } = props;
  const items = infiniteScroll ? useInfiniteScrollItems(propItems) : propItems;
  const itemsLength = items.length;
  const lastUpdatedItemIndex = infiniteScroll
    ? itemsLength - 2
    : itemsLength - 1;
  const hideIndexs = infiniteScroll
    ? [0, 1, itemsLength - 2, itemsLength - 1]
    : [];
  const initialIndex = infiniteScroll ? 2 : 0;
  const [interpolate, setInterpolate] = useState({start: 0, end: 1});
  const [activeIndex, setActiveIndex] = useState(0);
  const pan = useRef(new Animated.Value(0)).current;
  const translatex = useRef(0);
  const onUpdateIndex = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);
  const {
    handleTouchEnd,
    handleTouchMove,
    handleTouchStart,
    setTouchRangeValue,
    srcollByIndex,
  } = useTouches({
    translateX: pan,
    itemsWidth: itemWidth,
    totalItems: itemsLength,
    initialIndex,
    infiniteScroll,
    onUpdateIndex,
  });

  const moveToNextItem = () => {
    const i = Math.min(activeIndex + 1, lastUpdatedItemIndex);
    srcollByIndex(i);
  };

  const moveToPrevItem = () => {
    const i = Math.max(0, activeIndex - 1);
    srcollByIndex(i);
  };

  const getPanValue: Animated.ValueListenerCallback = ({value}) => {
    translatex.current = value;
  };

  const handleOnLayout = (event: LayoutChangeEvent) => {
    const totalWidth = Array.isArray(itemWidth)
      ? itemWidth.reduce((acc, width) => width + acc, 0)
      : itemsLength * itemWidth;
    const sliderWidth = event.nativeEvent.layout.width;
    const maxSliderWidth = totalWidth - sliderWidth;
    setInterpolate({
      start: -(maxSliderWidth + DRAG_RIGHT_MAX_THREHOLD),
      end: DRAG_LEFT_MAX_THREHOLD,
    });
    setTouchRangeValue(0, maxSliderWidth, sliderWidth);
  };

  const isInactiveSlider = (index: number) => {
    if (!infiniteScroll) return index !== activeIndex;
    if (index > 1 && index < lastUpdatedItemIndex) return index !== activeIndex;
    else if (
      (activeIndex === lastUpdatedItemIndex || activeIndex === 2) &&
      (index === 2 || index === lastUpdatedItemIndex)
    )
      return false;
    else if (
      (activeIndex === lastUpdatedItemIndex - 1 || activeIndex === 1) &&
      (index === 1 || index === lastUpdatedItemIndex - 1)
    )
      return false;
    else if (
      (activeIndex === lastUpdatedItemIndex - 2 || activeIndex === 0) &&
      (index === 0 || index === lastUpdatedItemIndex - 2)
    )
      return false;
    else if (
      (activeIndex === lastUpdatedItemIndex + 1 || activeIndex === 3) &&
      (index === 3 || index === lastUpdatedItemIndex + 1)
    )
      return false;

    return index !== activeIndex;
    // else if()
  };

  useEffect(() => {
    const id = pan.addListener(getPanValue);

    return () => {
      pan.removeListener(id);
    };
  }, []);

  // console.log(activeIndex);

  return (
    <View style={styles.scrollWrapper}>
      {showArrowBtn ? (
        <InlineTextButton
          onPress={moveToPrevItem}
          style={styles.directionLeftBtn}
          disabled={activeIndex === 0}>
          <Icon
            iconType="material"
            name="arrow-back-ios"
            size={24}
            color="black"
          />
        </InlineTextButton>
      ) : null}

      <View
        onLayout={handleOnLayout}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={[styles.slider]}>
        {items.map((item, index) => {
          const isInactiveIndex = isInactiveSlider(index);

          return (
            <Animated.View
              key={index}
              style={[
                {
                  transform: [
                    {
                      translateX: pan.interpolate({
                        inputRange: [interpolate.start, interpolate.end],
                        outputRange: [interpolate.start, interpolate.end],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}>
              <View
                style={combineStyles({
                  style: styles.inactiveTab,
                  applyIf: isInactiveIndex,
                })}>
                {renderItem({item: item, index: index})}
              </View>
            </Animated.View>
          );
        })}
      </View>
      {showArrowBtn ? (
        <InlineTextButton
          onPress={moveToNextItem}
          style={styles.directionRightBtn}
          disabled={activeIndex === lastUpdatedItemIndex}>
          <Icon
            iconType="material"
            name="arrow-forward-ios"
            size={24}
            color="black"
          />
        </InlineTextButton>
      ) : null}

      <ScrollIndicater
        activeIndex={activeIndex}
        setActiveIndex={srcollByIndex}
        items={items}
        hideIndexs={hideIndexs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  slider: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'red',
    flexDirection: 'row',
    // padding: 4,
    minHeight: '100%',
  },
  inactiveTab: {
    transform: [{scaleY: 0.85}],
    opacity: 0.65,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  indicatorWrapper: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 4,
  },
  indicator: {
    width: 18,
    height: 18,
    backgroundColor: 'red',
    borderRadius: 16,
  },
  activeIndicator: {
    backgroundColor: 'black',
  },
  directionRightBtn: {
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    padding: 8,
    paddingLeft: 12,
    paddingRight: 4,
    alignItems: 'center',
    right: -24,
  },
  directionLeftBtn: {
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    padding: 8,
    paddingLeft: 12,
    paddingRight: 4,
    alignItems: 'center',
    left: -24,
  },
});
