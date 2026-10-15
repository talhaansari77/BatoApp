import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface HairFollicleProps extends SvgProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function HairFollicle({
  size = 24,
  strokeWidth = 1.7,
  color = 'currentColor',
  ...props
}: HairFollicleProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M12 3c-2.5 2.5 2.5 5 0 8v4" />
      <Path d="M12 15c-1.5 1.5-2.5 3-2.5 4a2.5 2.5 0 0 0 5 0c0-1-1-2.5-2.5-4Z" />
      <Path d="M3 12c2-1 4-1 6 0m6 0c2-1 4-1 6 0" />
    </Svg>
  );
}