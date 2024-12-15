import React, {useRef} from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.8; // Width of each item
const SPACER = (screenWidth - ITEM_WIDTH) / 2; // Padding for centering
const data = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; // Your dataset

const InfiniteCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const touchStartX = useRef(0);
  const animatedOffset = useRef(0); // To track the total offset

  const handleTouchStart = e => {
    touchStartX.current = e.nativeEvent.pageX;
  };

  const handleTouchMove = e => {
    const deltaX = e.nativeEvent.pageX - touchStartX.current;
    touchStartX.current = e.nativeEvent.pageX;

    animatedOffset.current += deltaX;
    scrollX.setValue(animatedOffset.current);
  };

  const handleTouchEnd = () => {
    // Snap to the nearest item
    const snapIndex = Math.round(animatedOffset.current / -ITEM_WIDTH);
    const snapToValue = snapIndex * -ITEM_WIDTH;

    Animated.spring(scrollX, {
      toValue: snapToValue,
      useNativeDriver: true,
    }).start(() => {
      animatedOffset.current = snapToValue; // Keep track of snapped offset
    });
  };

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderStart={handleTouchStart}
      onResponderMove={handleTouchMove}
      onResponderRelease={handleTouchEnd}>
      <View style={styles.carousel}>
        {data.map((item, index) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];
          console.log(inputRange);

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [ITEM_WIDTH, 0, -ITEM_WIDTH],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.item,
                {
                  transform: [{translateX}, {scale}],
                },
              ]}>
              <Text style={styles.text}>{item}</Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  item: {
    width: ITEM_WIDTH,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default InfiniteCarousel;
