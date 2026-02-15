import React from "react";
import Svg, { Rect, Path, Defs, ClipPath } from "react-native-svg";

interface FlashlightBatteryIconProps {
  width?: number;
  height?: number;
  chargePercent: number;
  active: boolean;
  activeColor: string;
  inactiveColor: string;
}

export function FlashlightBatteryIcon({
  width = 32,
  height = 16,
  chargePercent,
  active,
  activeColor,
  inactiveColor,
}: FlashlightBatteryIconProps) {
  const fill = Math.max(0, Math.min(100, chargePercent));
  const strokeColor = active ? activeColor : inactiveColor;
  const fillColor = active ? activeColor : inactiveColor;
  const fillOpacity = active ? 0.85 : 0.45;
  const strokeW = 1.4;

  const bodyLeft = 1;
  const bodyRight = 23;
  const bodyTop = 3;
  const bodyBottom = 13;
  const bodyWidth = bodyRight - bodyLeft;
  const bodyHeight = bodyBottom - bodyTop;
  const bodyR = 2;

  const fillPadding = 1.5;
  const innerLeft = bodyLeft + fillPadding;
  const innerTop = bodyTop + fillPadding;
  const innerWidth = bodyWidth - fillPadding * 2;
  const innerHeight = bodyHeight - fillPadding * 2;
  const filledWidth = (innerWidth * fill) / 100;

  return (
    <Svg width={width} height={height} viewBox="0 0 32 16" fill="none">
      <Defs>
        <ClipPath id="bodyClip">
          <Rect
            x={innerLeft}
            y={innerTop}
            width={innerWidth}
            height={innerHeight}
            rx={1}
          />
        </ClipPath>
      </Defs>

      <Rect
        x={bodyLeft}
        y={bodyTop}
        width={bodyWidth}
        height={bodyHeight}
        rx={bodyR}
        stroke={strokeColor}
        strokeWidth={strokeW}
        fill="none"
      />

      <Rect
        x={innerLeft}
        y={innerTop}
        width={filledWidth}
        height={innerHeight}
        rx={1}
        fill={fillColor}
        opacity={fillOpacity}
        clipPath="url(#bodyClip)"
      />

      <Path
        d={`M${bodyRight} 5.5 L27 4 L27 12 L${bodyRight} 10.5`}
        stroke={strokeColor}
        strokeWidth={strokeW}
        fill={active ? fillColor : "none"}
        opacity={active ? 0.5 : 1}
        strokeLinejoin="round"
      />

      <Path
        d="M27 4 L30 2.5"
        stroke={strokeColor}
        strokeWidth={strokeW}
        strokeLinecap="round"
        opacity={active ? 1 : 0.5}
      />
      <Path
        d="M27 12 L30 13.5"
        stroke={strokeColor}
        strokeWidth={strokeW}
        strokeLinecap="round"
        opacity={active ? 1 : 0.5}
      />

      {active ? (
        <Path
          d="M30.5 1 L31 0.5"
          stroke={activeColor}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
      ) : null}
      {active ? (
        <Path
          d="M30.5 15 L31 15.5"
          stroke={activeColor}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
      ) : null}
    </Svg>
  );
}
