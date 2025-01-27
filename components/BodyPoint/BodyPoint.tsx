import Animated from "react-native-reanimated";
import { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  pointData: Partial<{
    cx: number;
    cy: number;
  }>;
  side: "left" | "right";
};
export const BodyPoint = ({ pointData, side }: Props) => {
  return (
    <AnimatedCircle
      animatedProps={pointData}
      r="10"
      stroke={side === "left" ? "red" : "blue"}
      strokeWidth="1.5"
      fill={side === "left" ? "blue" : "red"}
    />
  );
};
