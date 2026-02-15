import React from "react";
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from "react-native-svg";

interface TorchIconProps {
  size?: number;
  lit: boolean;
  color: string;
  glowColor?: string;
}

export function TorchIcon({ size = 20, lit, color, glowColor }: TorchIconProps) {
  const w = size;
  const h = size;

  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" fill="none">
      {lit ? (
        <Defs>
          <RadialGradient id="glow" cx="20" cy="6" r="8" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={glowColor || "#FF9500"} stopOpacity="0.6" />
            <Stop offset="1" stopColor={glowColor || "#FF9500"} stopOpacity="0" />
          </RadialGradient>
        </Defs>
      ) : null}
      {lit ? <Circle cx="20" cy="6" r="7" fill="url(#glow)" /> : null}
      <Path
        d="M3 14 L7 12 L7 16 Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11.5 L15 10 L15 18 L7 16.5 Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <Path
        d="M15 10 L17 8.5 C18 7.5 20 6 20 6"
        stroke={lit ? (glowColor || "#FF9500") : color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M15 18 L17 19.5 C18 20.5 20 22 20 22"
        stroke={lit ? (glowColor || "#FF9500") : color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {lit ? (
        <>
          <Circle cx="20" cy="6" r="2.5" fill={glowColor || "#FF9500"} opacity="0.9" />
          <Circle cx="21" cy="4" r="1.5" fill={glowColor || "#FF9500"} opacity="0.5" />
        </>
      ) : null}
    </Svg>
  );
}
