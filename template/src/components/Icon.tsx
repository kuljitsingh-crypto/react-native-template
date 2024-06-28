import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwsomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import OctIcon from 'react-native-vector-icons/Octicons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import type {PropsWithChildren} from 'react';
import {colors} from '../utill/colors';

const iconTypes = {
  ant: 'ant',
  entypo: 'entypo',
  evil: 'evil',
  feather: 'feather',
  fontAwesome: 'fontawesome',
  fontAwesome5: 'fontawesome5',
  fontAwesome6: 'fontawesome6',
  fontIsto: 'font-isto',
  foundation: 'foundation',
  ionicons: 'ionicons',
  materialCommunity: 'material-community',
  material: 'material',
  octicons: 'octicons',
  simpleLine: 'simple-line',
  zocial: 'zocial',
} as const;

type IconsProps = PropsWithChildren<{
  iconType: (typeof iconTypes)[keyof typeof iconTypes];
  name: string;
  size?: number;
  color?: string;
}>;

const Icon = (props: IconsProps) => {
  const {iconType, name, size = 24, color = colors.black} = props;
  switch (iconType) {
    case iconTypes.ant:
      return <AntIcon name={name} size={size} color={color} />;
    case iconTypes.entypo:
      return <EntypoIcon name={name} size={size} color={color} />;
    case iconTypes.evil:
      return <EvilIcon name={name} size={size} color={color} />;
    case iconTypes.feather:
      return <FeatherIcon name={name} size={size} color={color} />;
    case iconTypes.fontAwesome:
      return <FontAwsomeIcon name={name} size={size} color={color} />;
    case iconTypes.fontAwesome5:
      return <FontAwesome5Icon name={name} size={size} color={color} />;
    case iconTypes.fontAwesome6:
      return <FontAwesome6Icon name={name} size={size} color={color} />;
    case iconTypes.fontIsto:
      return <FontistoIcon name={name} size={size} color={color} />;
    case iconTypes.foundation:
      return <FoundationIcon name={name} size={size} color={color} />;
    case iconTypes.ionicons:
      return <IoniconsIcon name={name} size={size} color={color} />;
    case iconTypes.materialCommunity:
      return <MaterialCommunityIcon name={name} size={size} color={color} />;
    case iconTypes.material:
      return <MaterialIcon name={name} size={size} color={color} />;
    case iconTypes.octicons:
      return <OctIcon name={name} size={size} color={color} />;
    case iconTypes.simpleLine:
      return <SimpleLineIcon name={name} size={size} color={color} />;
    case iconTypes.zocial:
      return <ZocialIcon name={name} size={size} color={color} />;
    default:
      return null;
  }
};
// to get icon name go to https://oblador.github.io/react-native-vector-icons/
// search your icon and copy the name from there and paste when using this component

export default Icon;
