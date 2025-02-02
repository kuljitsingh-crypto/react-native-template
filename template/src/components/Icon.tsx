import React from 'react';
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';
import type {PropsWithChildren} from 'react';
import {colors} from '../constants';

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
      return <AntDesign name={name as any} size={size} color={color} />;
    case iconTypes.entypo:
      return <Entypo name={name as any} size={size} color={color} />;
    case iconTypes.evil:
      return <EvilIcons name={name as any} size={size} color={color} />;
    case iconTypes.feather:
      return <Feather name={name as any} size={size} color={color} />;
    case iconTypes.fontAwesome:
      return <FontAwesome name={name as any} size={size} color={color} />;
    case iconTypes.fontAwesome5:
      return <FontAwesome5 name={name as any} size={size} color={color} />;
    case iconTypes.fontAwesome6:
      return <FontAwesome6 name={name as any} size={size} color={color} />;
    case iconTypes.fontIsto:
      return <Fontisto name={name as any} size={size} color={color} />;
    case iconTypes.foundation:
      return <Foundation name={name as any} size={size} color={color} />;
    case iconTypes.ionicons:
      return <Ionicons name={name as any} size={size} color={color} />;
    case iconTypes.materialCommunity:
      return (
        <MaterialCommunityIcons name={name as any} size={size} color={color} />
      );
    case iconTypes.material:
      return <MaterialIcons name={name as any} size={size} color={color} />;
    case iconTypes.octicons:
      return <Octicons name={name as any} size={size} color={color} />;
    case iconTypes.simpleLine:
      return <SimpleLineIcons name={name as any} size={size} color={color} />;
    case iconTypes.zocial:
      return <Zocial name={name as any} size={size} color={color} />;
    default:
      return null;
  }
};
// to get icon name go to https://icons.expo.fyi/Index
// search your icon and copy the name from there and paste when using this component

export default Icon;
