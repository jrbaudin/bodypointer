import { useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  useCameraDevice,
  Camera,
  useFrameProcessor,
  useCameraPermission,
  VisionCameraProxy,
} from "react-native-vision-camera";
import Animated, {
  useSharedValue,
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import Svg, { Line, Circle } from "react-native-svg";
import { Worklets } from "react-native-worklets-core";

type Pose = {
  leftShoulderPosition: { x: number; y: number };
  rightShoulderPosition: { x: number; y: number };
  leftElbowPosition: { x: number; y: number };
  rightElbowPosition: { x: number; y: number };
  leftWristPosition: { x: number; y: number };
  rightWristPosition: { x: number; y: number };
  leftHipPosition: { x: number; y: number };
  rightHipPosition: { x: number; y: number };
  leftKneePosition: { x: number; y: number };
  rightKneePosition: { x: number; y: number };
  leftAnklePosition: { x: number; y: number };
  rightAnklePosition: { x: number; y: number };
  leftPinkyPosition: { x: number; y: number };
  rightPinkyPosition: { x: number; y: number };
  leftIndexPosition: { x: number; y: number };
  rightIndexPosition: { x: number; y: number };
  leftThumbPosition: { x: number; y: number };
  rightThumbPosition: { x: number; y: number };
  leftHeelPosition: { x: number; y: number };
  rightHeelPosition: { x: number; y: number };
  nosePosition: { x: number; y: number };
  leftFootIndexPosition: { x: number; y: number };
  rightFootIndexPosition: { x: number; y: number };
  leftEyeInnerPosition: { x: number; y: number };
  rightEyeInnerPosition: { x: number; y: number };
  leftEyePosition: { x: number; y: number };
  rightEyePosition: { x: number; y: number };
  leftEyeOuterPosition: { x: number; y: number };
  rightEyeOuterPosition: { x: number; y: number };
  leftEarPosition: { x: number; y: number };
  rightEarPosition: { x: number; y: number };
  leftMouthPosition: { x: number; y: number };
  rightMouthPosition: { x: number; y: number };
};

/* const AnimatedLine = Animated.createAnimatedComponent(Line); */
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const objectDetect = (frame: any, facing: "back" | "front") => {
  "worklet";
  const plugin = VisionCameraProxy.initFrameProcessorPlugin(
    "poseDetection",
    {}
  );
  if (!plugin) return null;
  return plugin.call(frame);
};

const defaultPose: Pose = {
  leftShoulderPosition: { x: 0, y: 0 },
  rightShoulderPosition: { x: 0, y: 0 },
  leftElbowPosition: { x: 0, y: 0 },
  rightElbowPosition: { x: 0, y: 0 },
  leftWristPosition: { x: 0, y: 0 },
  rightWristPosition: { x: 0, y: 0 },
  leftHipPosition: { x: 0, y: 0 },
  rightHipPosition: { x: 0, y: 0 },
  leftKneePosition: { x: 0, y: 0 },
  rightKneePosition: { x: 0, y: 0 },
  leftAnklePosition: { x: 0, y: 0 },
  rightAnklePosition: { x: 0, y: 0 },
  leftPinkyPosition: { x: 0, y: 0 },
  rightPinkyPosition: { x: 0, y: 0 },
  leftIndexPosition: { x: 0, y: 0 },
  rightIndexPosition: { x: 0, y: 0 },
  leftThumbPosition: { x: 0, y: 0 },
  rightThumbPosition: { x: 0, y: 0 },
  leftHeelPosition: { x: 0, y: 0 },
  rightHeelPosition: { x: 0, y: 0 },
  nosePosition: { x: 0, y: 0 },
  leftFootIndexPosition: { x: 0, y: 0 },
  rightFootIndexPosition: { x: 0, y: 0 },
  leftEyeInnerPosition: { x: 0, y: 0 },
  rightEyeInnerPosition: { x: 0, y: 0 },
  leftEyePosition: { x: 0, y: 0 },
  rightEyePosition: { x: 0, y: 0 },
  leftEyeOuterPosition: { x: 0, y: 0 },
  rightEyeOuterPosition: { x: 0, y: 0 },
  leftEarPosition: { x: 0, y: 0 },
  rightEarPosition: { x: 0, y: 0 },
  leftMouthPosition: { x: 0, y: 0 },
  rightMouthPosition: { x: 0, y: 0 },
};

export default function App() {
  const pose = useSharedValue(defaultPose);
  const [facing, setFacing] = useState<"back" | "front">("front");
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(facing);

  const leftShoulder = useAnimatedProps(() => ({
    cx: pose?.value?.leftShoulderPosition?.x ?? 0,
    cy: pose?.value?.leftShoulderPosition?.y ?? 0,
  }));
  const rightShoulder = useAnimatedProps(() => ({
    cx: pose?.value?.rightShoulderPosition?.x ?? 0,
    cy: pose?.value?.rightShoulderPosition?.y ?? 0,
  }));

  const leftElbow = useAnimatedProps(() => ({
    cx: pose?.value?.leftElbowPosition?.x ?? 0,
    cy: pose?.value?.leftElbowPosition?.y ?? 0,
  }));

  const rightElbow = useAnimatedProps(() => ({
    cx: pose?.value?.rightElbowPosition?.x ?? 0,
    cy: pose?.value?.rightElbowPosition?.y ?? 0,
  }));

  const leftWrist = useAnimatedProps(() => ({
    cx: pose?.value?.leftWristPosition?.x ?? 0,
    cy: pose?.value?.leftWristPosition?.y ?? 0,
  }));

  const rightWrist = useAnimatedProps(() => ({
    cx: pose?.value?.rightWristPosition?.x ?? 0,
    cy: pose?.value?.rightWristPosition?.y ?? 0,
  }));

  const leftHip = useAnimatedProps(() => ({
    cx: pose?.value?.leftHipPosition?.x ?? 0,
    cy: pose?.value?.leftHipPosition?.y ?? 0,
  }));

  const rightHip = useAnimatedProps(() => ({
    cx: pose?.value?.rightHipPosition?.x ?? 0,
    cy: pose?.value?.rightHipPosition?.y ?? 0,
  }));

  const leftKnee = useAnimatedProps(() => ({
    cx: pose?.value?.leftKneePosition?.x ?? 0,
    cy: pose?.value?.leftKneePosition?.y ?? 0,
  }));

  const rightKnee = useAnimatedProps(() => ({
    cx: pose?.value?.rightKneePosition?.x ?? 0,
    cy: pose?.value?.rightKneePosition?.y ?? 0,
  }));

  const leftAnkle = useAnimatedProps(() => ({
    cx: pose?.value?.leftAnklePosition?.x ?? 0,
    cy: pose?.value?.leftAnklePosition?.y ?? 0,
  }));

  const rightAnkle = useAnimatedProps(() => ({
    cx: pose?.value?.rightAnklePosition?.x ?? 0,
    cy: pose?.value?.rightAnklePosition?.y ?? 0,
  }));

  const leftPinky = useAnimatedProps(() => ({
    cx: pose?.value?.leftPinkyPosition?.x ?? 0,
    cy: pose?.value?.leftPinkyPosition?.y ?? 0,
  }));

  const rightPinky = useAnimatedProps(() => ({
    cx: pose?.value?.rightPinkyPosition?.x ?? 0,
    cy: pose?.value?.rightPinkyPosition?.y ?? 0,
  }));

  const leftIndex = useAnimatedProps(() => ({
    cx: pose?.value?.leftIndexPosition?.x ?? 0,
    cy: pose?.value?.leftIndexPosition?.y ?? 0,
  }));

  const rightIndex = useAnimatedProps(() => ({
    cx: pose?.value?.rightIndexPosition?.x ?? 0,
    cy: pose?.value?.rightIndexPosition?.y ?? 0,
  }));

  const leftThumb = useAnimatedProps(() => ({
    cx: pose?.value?.leftThumbPosition?.x ?? 0,
    cy: pose?.value?.leftThumbPosition?.y ?? 0,
  }));

  const rightThumb = useAnimatedProps(() => ({
    cx: pose?.value?.rightThumbPosition?.x ?? 0,
    cy: pose?.value?.rightThumbPosition?.y ?? 0,
  }));

  const leftHeel = useAnimatedProps(() => ({
    cx: pose?.value?.leftHeelPosition?.x ?? 0,
    cy: pose?.value?.leftHeelPosition?.y ?? 0,
  }));

  const rightHeel = useAnimatedProps(() => ({
    cx: pose?.value?.rightHeelPosition?.x ?? 0,
    cy: pose?.value?.rightHeelPosition?.y ?? 0,
  }));

  const nose = useAnimatedProps(() => ({
    cx: pose?.value?.nosePosition?.x ?? 0,
    cy: pose?.value?.nosePosition?.y ?? 0,
  }));

  const leftFootIndex = useAnimatedProps(() => ({
    cx: pose?.value?.leftFootIndexPosition?.x ?? 0,
    cy: pose?.value?.leftFootIndexPosition?.y ?? 0,
  }));

  const rightFootIndex = useAnimatedProps(() => ({
    cx: pose?.value?.rightFootIndexPosition?.x ?? 0,
    cy: pose?.value?.rightFootIndexPosition?.y ?? 0,
  }));

  const leftEyeInner = useAnimatedProps(() => ({
    cx: pose?.value?.leftEyeInnerPosition?.x ?? 0,
    cy: pose?.value?.leftEyeInnerPosition?.y ?? 0,
  }));

  const rightEyeInner = useAnimatedProps(() => ({
    cx: pose?.value?.rightEyeInnerPosition?.x ?? 0,
    cy: pose?.value?.rightEyeInnerPosition?.y ?? 0,
  }));

  const leftEye = useAnimatedProps(() => ({
    cx: pose?.value?.leftEyePosition?.x ?? 0,
    cy: pose?.value?.leftEyePosition?.y ?? 0,
  }));

  const rightEye = useAnimatedProps(() => ({
    cx: pose?.value?.rightEyePosition?.x ?? 0,
    cy: pose?.value?.rightEyePosition?.y ?? 0,
  }));

  const leftEyeOuter = useAnimatedProps(() => ({
    cx: pose?.value?.leftEyeOuterPosition?.x ?? 0,
    cy: pose?.value?.leftEyeOuterPosition?.y ?? 0,
  }));

  const rightEyeOuter = useAnimatedProps(() => ({
    cx: pose?.value?.rightEyeOuterPosition?.x ?? 0,
    cy: pose?.value?.rightEyeOuterPosition?.y ?? 0,
  }));

  const leftEar = useAnimatedProps(() => ({
    cx: pose?.value?.leftEarPosition?.x ?? 0,
    cy: pose?.value?.leftEarPosition?.y ?? 0,
  }));

  const rightEar = useAnimatedProps(() => ({
    cx: pose?.value?.rightEarPosition?.x ?? 0,
    cy: pose?.value?.rightEarPosition?.y ?? 0,
  }));

  const leftMouth = useAnimatedProps(() => ({
    cx: pose?.value?.leftMouthPosition?.x ?? 0,
    cy: pose?.value?.leftMouthPosition?.y ?? 0,
  }));

  const rightMouth = useAnimatedProps(() => ({
    cx: pose?.value?.rightMouthPosition?.x ?? 0,
    cy: pose?.value?.rightMouthPosition?.y ?? 0,
  }));

  const dimensions = useWindowDimensions();

  const onPoseDetected = Worklets.createRunOnJS((updatedPose: Pose) => {
    pose.value = updatedPose;
  });

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const poseObject: any = objectDetect(frame, facing);
    if (!poseObject) return null;
    // Rotation and scaling factors
    const xScale = dimensions.width / frame.height; // 414 / 1080
    const yScale = dimensions.height / frame.width; // 896 / 1920

    // Adjust this offset to fine-tune Y positioning
    const yOffset = 35; // Adjust this value based on visual testing

    const adjustedPose: any = {};

    Object.keys(poseObject).forEach((key) => {
      const originalPoint = poseObject[key];

      // Rotate coordinates
      const rotatedX = originalPoint.y;
      const rotatedY = frame.width - originalPoint.x;

      // Flip X and Y axes
      const flippedX = dimensions.width - rotatedX * xScale;
      const flippedY = dimensions.height - rotatedY * yScale - yOffset;

      // Assign adjusted coordinates
      adjustedPose[key] = {
        x: flippedX,
        y: flippedY,
      };
    });

    onPoseDetected(adjustedPose);
  }, []);

  if (!device) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!hasPermission) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  return (
    <View style={styles.container}>
      {device ? (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            fps={15}
          />
          <Svg
            height={Dimensions.get("window").height}
            width={Dimensions.get("window").width}
            style={styles.linesContainer}
          >
            <AnimatedCircle
              animatedProps={leftShoulder}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightShoulder}
              r="10"
              stroke="blue"
              strokeWidth="1.5"
              fill="red"
            />
            <AnimatedCircle
              animatedProps={leftElbow}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightElbow}
              r="10"
              stroke="blue"
              strokeWidth="1.5"
              fill="red"
            />
            <AnimatedCircle
              animatedProps={leftHip}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightHip}
              r="10"
              stroke="blue"
              strokeWidth="1.5"
              fill="red"
            />
            <AnimatedCircle
              animatedProps={leftKnee}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightKnee}
              r="10"
              stroke="blue"
              strokeWidth="1.5"
              fill="red"
            />
            <AnimatedCircle
              animatedProps={leftAnkle}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightAnkle}
              r="10"
              stroke="blue"
              strokeWidth="1.5"
              fill="red"
            />
            <AnimatedCircle
              animatedProps={leftHeel}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightHeel}
              r="10"
              stroke="blue"
              strokeWidth="1.5"
              fill="red"
            />
            {/* <AnimatedCircle
              animatedProps={leftEye}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightEye}
              r="10"
              stroke="blue"
              strokeWidth="1.5"
              fill="red"
            /> */}
            <AnimatedCircle
              animatedProps={leftWrist}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightWrist}
              r="10"
              stroke="blue"
              strokeWidth="1.5"
              fill="red"
            />
            {/* <AnimatedCircle
              animatedProps={leftFootIndex}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightFootIndex}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            /> */}

            {/* <AnimatedCircle
              animatedProps={leftPinky}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightPinky}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={leftIndex}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightIndex}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={leftThumb}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightThumb}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            /> */}
            {/* <AnimatedCircle
              animatedProps={nose}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            /> */}

            {/* <AnimatedCircle
              animatedProps={leftEyeInner}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightEyeInner}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            /> */}

            {/* <AnimatedCircle
              animatedProps={leftEyeOuter}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightEyeOuter}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            /> */}
            {/* <AnimatedCircle
              animatedProps={leftEar}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightEar}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={leftMouth}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            />
            <AnimatedCircle
              animatedProps={rightMouth}
              r="10"
              stroke="red"
              strokeWidth="1.5"
              fill="blue"
            /> */}
          </Svg>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  linesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
});
