import { BodyPoint } from "../BodyPoint/BodyPoint";

type Props = {
  points: {
    pointData: Partial<{
      cx: number;
      cy: number;
    }>;
    side: "left" | "right";
  }[];
};

export const BodyPointMap = ({ points }: Props) => {
  return points.map((point, index) => (
    <BodyPoint
      side={point.side}
      pointData={point.pointData}
      key={`${point.side}_${index}`}
    />
  ));
};
