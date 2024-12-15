import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ListRenderItem,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItemInfo,
  Pressable,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  ViewToken,
  Animated,
  Easing,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {container} from '../styles/appDefaultStyle';
import {InlineTextButton} from './Button';
import {combineStyles} from '../utill';
import Icon from './Icon';

const AnimatedFlatList = FlatList
  ? Animated.createAnimatedComponent(FlatList)
  : ScrollView;

type SimpleSliderProps<T> = {
  renderItem: ListRenderItem<T>;
  items: T[];
  itemWidth: number | number[];
  showArrowBtn?: boolean;
  showIndicator?: boolean;
  indicatorStyles?: ViewStyle | TextStyle;
  activeIndicatorStyles?: ViewStyle | TextStyle;
  inactiveTabStyles?: ViewStyle | TextStyle;
  infiniteScroll?: boolean;
};

type AnimatedSliderProps<T> = SimpleSliderProps<T> & {
  elementPositions: {start: number; end: number}[];
  attachContainerRef: (el: View | null) => void;
  getItemRef: (index: number) => View | null;
  attachItemRef: (
    index: number,
    itemWidth: number | number[],
  ) => (el: View | null) => void;
};

const useItemPositions = () => {
  const refs = useRef<(View | null)[]>([]);
  const viewContainerRef = useRef<View | null>(null);
  const positions = useRef<{start: number; end: number}[]>([]);

  const measureLayout =
    (index: number) =>
    (x: number, y: number, width: number, height: number) => {
      positions.current[index] = {
        start: Math.ceil(x),
        end: Math.ceil(x + width),
      };
    };

  // Instead of dynamically calculating the element dimension, which burden the application
  // taking the prediefined dimensions as props
  // const onItemLayout = (index: number) => (e: LayoutChangeEvent) => {
  //   const el = refs.current[index];
  //   if (viewContainerRef.current && el) {
  //     el.measureLayout(
  //       viewContainerRef.current as View,
  //       measureLayout(index),
  //       () => console.warn(`Failed to measure item ${index}:`),
  //     );
  //   }
  // };

  const getItemRef = (index: number) => {
    return refs.current[index];
  };

  const attachContainerRef = (el: View | null) => {
    viewContainerRef.current = el;
  };

  const attachItemRef =
    (index: number, itemWidth: number | number[]) => (el: View | null) => {
      refs.current[index] = el;
      const width = Array.isArray(itemWidth) ? itemWidth[index] : itemWidth;
      const prevIndex = Math.max(0, index - 1);
      const start = prevIndex === index ? 0 : positions.current[prevIndex].end;
      measureLayout(index)(start, 0, width, 0);
    };

  return {
    attachContainerRef,
    attachItemRef,
    getItemRef,
    positions: positions.current,
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

const AnimatedSlider = <T,>(props: AnimatedSliderProps<T>) => {
  const {
    elementPositions: positions,
    items,
    showArrowBtn = true,
    showIndicator = true,
    indicatorStyles,
    activeIndicatorStyles,
    itemWidth,
    inactiveTabStyles,
    infiniteScroll,
    renderItem,
    attachContainerRef,
    getItemRef,
    attachItemRef,
  } = props;
  const originalItemsLength = items.length;
  const [activeIndex, setActiveIndex] = useState(infiniteScroll ? 1 : 0);
  const scrollX = useRef(new Animated.Value(0));
  const flatListRef = useRef<FlatList | null>(null);
  const containerWidth = useRef(0);
  const isScrollFromBtn = useRef(false);
  const visiableIndex = useRef(infiniteScroll ? 1 : 0);
  const updatedItems = useMemo(
    () =>
      infiniteScroll
        ? [items[originalItemsLength - 1], ...items, items[0], items[1]]
        : items,
    [infiniteScroll, items],
  );
  const startIndex = infiniteScroll ? 1 : 0;
  const updatedItemsLength = updatedItems.length;
  const lastUpdatedItemIndex = infiniteScroll
    ? updatedItemsLength - 2
    : updatedItemsLength - 1;
  const hideIndexsForIndicator = infiniteScroll
    ? [0, lastUpdatedItemIndex, lastUpdatedItemIndex + 1]
    : [];

  const renderItemWrapper: ListRenderItem<T> | null | undefined = useCallback(
    (item: ListRenderItemInfo<T>) => {
      const inactive =
        item.index !== activeIndex &&
        (infiniteScroll
          ? !(
              (item.index === 0 && activeIndex === originalItemsLength) ||
              (item.index === lastUpdatedItemIndex && activeIndex === 1)
            )
          : true);

      return (
        <View
          ref={attachItemRef(item.index, itemWidth)}
          style={combineStyles(
            {
              style: styles.inactiveTab,
              applyIf: inactive,
            },
            {
              style: inactiveTabStyles,
              applyIf: !!(inactiveTabStyles && inactive),
            },
            // {transform: [{translateX: scrollX.current}]},
          )}>
          {renderItem(item)}
        </View>
      );
    },
    [activeIndex],
  );

  const calculateActiveIndex = (contentOffset: {x: number; y: number}) => {
    let i = 0,
      itemsLength = positions.length;
    const {x} = contentOffset;
    if (x > 0) {
      for (; i < itemsLength; i++) {
        const {start, end} = positions[i];
        if (x > start && x <= end) {
          break;
        }
      }
    }

    return i;
  };

  const setContainerWidth = (e: LayoutChangeEvent) => {
    containerWidth.current = e.nativeEvent.layout.width;
  };

  const getIndex = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    offsetMultipler = 0.5,
    includeInfiniteScroll = false,
  ) => {
    const endX = e.nativeEvent.contentOffset.x;
    const center = containerWidth.current * offsetMultipler;
    const finalXOffset = endX + center;
    let index = calculateActiveIndex({
      ...e.nativeEvent.contentOffset,
      x: finalXOffset,
    });
    // if (includeInfiniteScroll) {
    //   if (index === 0) {
    //     index = originalItemsLength;
    //   } else if (index === lastUpdatedItemIndex) {
    //     index = 1;
    //   }
    // }
    return index;
  };

  const getItemWidthByIndex = (index: number) =>
    Array.isArray(itemWidth) ? itemWidth[index] : itemWidth;

  const scrollToOffset = (index: number, animateScroll = false) => {
    const width = getItemWidthByIndex(index);
    flatListRef.current?.scrollToOffset({
      offset: width,
      animated: animateScroll,
    });
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = getIndex(e, 0.25, infiniteScroll);
    console.log('scroll end', e.nativeEvent.contentOffset, index);
    const animateScroll = infiniteScroll
      ? index !== 1 && index !== originalItemsLength
      : true;
    updateIndex(index, animateScroll);
  };

  const updateIndex = (index: number, animateScroll = true) => {
    visiableIndex.current = index;
    const offset = index * getItemWidthByIndex(index);
    console.log('here', index, offset);
    // Animated.timing(scrollX.current, {
    //   toValue: 600,
    //   duration: 100,
    //   useNativeDriver: true,
    //   easing: Easing.ease,
    // }).start(({finished}) => {
    //   console.log(finished, scrollX.current);
    // });
    flatListRef.current?.scrollToIndex({
      index,
      animated: animateScroll,
    });
    // flatListRef.current?.scrollToOffset({offset, animated: animateScroll});
    setActiveIndex(index);
  };
  const moveToNextItem = () => {
    isScrollFromBtn.current = true;
    const i = Math.min(activeIndex + 1, lastUpdatedItemIndex);
    updateIndex(i);
  };

  const moveToPrevItem = () => {
    isScrollFromBtn.current = true;
    const i = Math.max(0, activeIndex - 1);
    updateIndex(i);
  };
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isScrollFromBtn.current) {
      return;
    }
    const index = getIndex(e, 0.25, infiniteScroll);
    setActiveIndex(index);
  };
  const onTouch = (e: GestureResponderEvent) => {
    isScrollFromBtn.current = false;
  };

  const onIndexChnage = (index: number) => {
    isScrollFromBtn.current = true;
    updateIndex(index);
  };
  const onViewableItemsChanged = ({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken<T>[];
    changed: ViewToken<T>[];
  }) => {
    if (!infiniteScroll) return undefined;
    console.log(visiableIndex.current, viewableItems, changed);
    if (
      visiableIndex.current === 0 ||
      visiableIndex.current === lastUpdatedItemIndex
    ) {
      const index = visiableIndex.current === 0 ? originalItemsLength : 1;
      updateIndex(index, false);
    }
    // if (isFirstTimeScrolled.current) {
    //   const scrollViewableItem = viewableItems.find(
    //     item =>
    //       (item.index === 0 || item.index === lastUpdatedItemIndex) &&
    //       item.isViewable,
    //   );
    //   console.log(scrollViewableItem);
    //   if (scrollViewableItem) {

    //     isFirstTimeScrolled.current = false;
    //   }
    // }
  };

  useEffect(() => {
    scrollToOffset(startIndex, false);
  }, []);

  return (
    <View style={styles.listWrapperContainer}>
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
        ref={attachContainerRef}
        style={styles.listContainer}
        onLayout={setContainerWidth}>
        <AnimatedFlatList
          ref={flatListRef}
          horizontal={true}
          data={updatedItems}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={0}
          renderItem={renderItemWrapper}
          keyExtractor={(_, index) => index.toString()}
          onTouchStart={onTouch}
          onMomentumScrollEnd={handleScrollEnd}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX.current}}}],
            {listener: handleScroll, useNativeDriver: false},
          )}
          // onScroll={handleScroll}
          // pagingEnabled={true}
          scrollEventThrottle={1}
          onViewableItemsChanged={
            infiniteScroll ? onViewableItemsChanged : undefined
          }

          // getItemLayout={getItemLayout}
        />
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
      {showIndicator ? (
        <ScrollIndicater
          items={updatedItems}
          activeIndex={activeIndex}
          setActiveIndex={onIndexChnage}
          activeIndicatorStyles={activeIndicatorStyles}
          indicatorStyles={indicatorStyles}
          hideIndexs={hideIndexsForIndicator}
        />
      ) : null}
    </View>
  );
};

const SimpleSlider2 = <T,>(props: SimpleSliderProps<T>) => {
  const {
    items,
    showArrowBtn,
    showIndicator,
    indicatorStyles,
    activeIndicatorStyles,
    itemWidth,
    inactiveTabStyles,
    infiniteScroll,
    renderItem,
  } = props;
  const {attachContainerRef, attachItemRef, getItemRef, positions} =
    useItemPositions();

  if (Array.isArray(itemWidth) && itemWidth.length !== items.length) {
    throw new Error(
      'For array like itemwidth,it must have same length as items',
    );
  }

  return (
    <View style={styles.rootContainer}>
      <AnimatedSlider
        renderItem={renderItem}
        attachContainerRef={attachContainerRef}
        getItemRef={getItemRef}
        attachItemRef={attachItemRef}
        itemWidth={itemWidth}
        items={items}
        elementPositions={positions}
        showArrowBtn={showArrowBtn}
        showIndicator={showIndicator}
        indicatorStyles={indicatorStyles}
        activeIndicatorStyles={activeIndicatorStyles}
        inactiveTabStyles={inactiveTabStyles}
        infiniteScroll={infiniteScroll}
      />
    </View>
  );
};

export default SimpleSlider2;
const styles = StyleSheet.create({
  rootContainer: {
    ...container,
    backgroundColor: 'yellow',
    height: 500,

    // flex: 1,
    // overflow: 'hidden',
    // flexDirection: 'row',
  },
  listWrapperContainer: {
    flex: 1,
    position: 'relative',
  },
  listContainer: {
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
  inactiveTab: {
    marginTop: 4,
    transform: [{scaleY: 0.75}],
    opacity: 0.65,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
