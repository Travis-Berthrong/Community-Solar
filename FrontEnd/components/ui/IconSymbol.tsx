import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Symbols, { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle, Platform } from 'react-native';

const MAPPING = {
  // Existing mappings
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  
  // New mappings for map markers
  'rectangle.portrait.and.arrow.right': 'logout',
  'plus.circle.fill': 'add',
  'location.fill': 'location-on',
  'bolt.circle.fill': 'bolt',  // Using standard bolt icon
  'my-location': 'my-location'
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  if (Platform.OS === 'ios') {
    return (
      <Symbols
        name={name}
        size={size}
        color={color}
        weight={weight}
        style={style}
      />
    );
  }
  
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}