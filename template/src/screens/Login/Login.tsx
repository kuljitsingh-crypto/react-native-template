import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {container} from '../../styles/appDefaultStyle';
import {FormatedMessage, NamedLink, SimpleSlider} from '../../components';
import {useIntl} from '../../hooks';
import InfiniteScroll from './testx';
import SimpleSlider3 from '../../components/SimpleSlider3';

const Login = () => {
  const {formatMessage} = useIntl();
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6]);

  const buffer = [...items];
  for (let i = 0; i < 2; i++) {
    buffer.unshift(items[items.length - 1 - i]); // Add items to the start
    buffer.push(items[i]); // Add items to the end
  }

  console.log(buffer);

  // useEffect(() => {
  //   setInterval(() => {
  //     setItems(items => [...items, items.length + 1]);
  //   }, 10000);
  // }, []);

  const data = [
    {id: '1', title: 'Item 1'},
    {id: '2', title: 'Item 2'},
    {id: '3', title: 'Item 3'},
  ];

  const SCREEN_WIDTH = Dimensions.get('window').width;

  const renderItem = ({item}: {item: any}) => (
    <View style={{width: SCREEN_WIDTH, height: 200, padding: 20}}>
      <View style={{backgroundColor: 'gray', flex: 1}}>
        <Text>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View
      style={{
        ...container,
        paddingTop: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}>
      <NamedLink name="home">{formatMessage('Login.goHome')}</NamedLink>
      <View style={{height: 500, width: '100%'}}>
        {/* <SimpleSlider3
          showArrowBtn={true}
          items={items}
          renderItem={item => (
            <View
              style={{
                height: 500,
                padding: 8,
              }}>
              <View
                style={{
                  width: 300,
                  backgroundColor: 'gray',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'black',
                }}>
                <Text style={{color: 'white', fontSize: 48}}>{item.item}</Text>
              </View>
            </View>
          )}
          itemWidth={316}
          infiniteScroll={true}
        /> */}
        <InfiniteScroll />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
