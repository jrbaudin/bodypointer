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
import { useSharedValue, useAnimatedProps } from "react-native-reanimated";
import Svg from "react-native-svg";
import { Worklets } from "react-native-worklets-core";
import { defaultPose } from "@/data";
import { Pose } from "@/types";
import { BodyPointMap } from "@/components/BodyPointMap/BodyPointMap";

const objectDetect = (frame: any) => {
  "worklet";
  const plugin = VisionCameraProxy.initFrameProcessorPlugin(
    "poseDetection",
    {}
  );
  if (!plugin) return null;
  return plugin.call(frame);
};

export default function App() {
  const pose = useSharedValue(defaultPose);
  const [facing, setFacing] = useState<"back" | "front">("front");
  const { hasPermission, requestPermission } = useCameraPermission();

  const device = useCameraDevice(facing);
  const dimensions = useWindowDimensions();

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

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
  const leftHeel = useAnimatedProps(() => ({
    cx: pose?.value?.leftHeelPosition?.x ?? 0,
    cy: pose?.value?.leftHeelPosition?.y ?? 0,
  }));
  const rightHeel = useAnimatedProps(() => ({
    cx: pose?.value?.rightHeelPosition?.x ?? 0,
    cy: pose?.value?.rightHeelPosition?.y ?? 0,
  }));
  const leftEye = useAnimatedProps(() => ({
    cx: pose?.value?.leftEyePosition?.x ?? 0,
    cy: pose?.value?.leftEyePosition?.y ?? 0,
  }));
  const rightEye = useAnimatedProps(() => ({
    cx: pose?.value?.rightEyePosition?.x ?? 0,
    cy: pose?.value?.rightEyePosition?.y ?? 0,
  }));

  /**
   * Due to some unclear issues with setting the shared value not
   * being propagated all the way this allows the shared value
   * to be set through this worklet JS bridge.
   *
   * Not the best but makes it work in this first iteration.
   */
  const onPoseDetected = Worklets.createRunOnJS((updatedPose: Pose) => {
    pose.value = updatedPose;
  });

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const poseObject: any = objectDetect(frame);
    if (!poseObject) return null;
    /**
     * The dimensions of the viewport and the frame will be
     * in different orientation (landscape vs portrait)
     * so please note the scaling factors are flipped to
     * address this.
     */
    const xScale = dimensions.width / frame.height;
    const yScale = dimensions.height / frame.width;

    /**
     * This allows fine-tuning the Y positioning
     * due to mismatch in the coordinates from
     * the frame processor and screen drawing.
     */
    const yOffset = 35;

    const adjustedPose: any = {};

    Object.keys(poseObject).forEach((key) => {
      const originalPoint = poseObject[key];
      /**
       * Hacky temp solution: Rotate coordinates
       */
      const rotatedX = originalPoint.y;
      const rotatedY = frame.width - originalPoint.x;
      /**
       * Hacky temp solution: Flip X and Y axes
       */
      const flippedX = dimensions.width - rotatedX * xScale;
      const flippedY = dimensions.height - rotatedY * yScale - yOffset;

      adjustedPose[key] = {
        x: flippedX,
        y: flippedY,
      };
    });

    onPoseDetected(adjustedPose);
  }, []);

  if (!device) {
    /**
     * Camera permissions are still loading.
     */
    return <View />;
  }

  if (!hasPermission) {
    /**
     * Camera permissions are not granted yet.
     */
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
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
            <BodyPointMap
              points={[
                { pointData: leftShoulder, side: "left" },
                { pointData: rightShoulder, side: "right" },
                { pointData: leftElbow, side: "left" },
                { pointData: rightElbow, side: "right" },
                { pointData: leftHip, side: "left" },
                { pointData: rightHip, side: "right" },
                { pointData: leftKnee, side: "left" },
                { pointData: rightKnee, side: "right" },
                { pointData: leftAnkle, side: "left" },
                { pointData: rightAnkle, side: "right" },
                { pointData: leftHeel, side: "left" },
                { pointData: rightHeel, side: "right" },
                { pointData: leftWrist, side: "left" },
                { pointData: rightWrist, side: "right" },
                { pointData: rightEye, side: "right" },
                { pointData: leftEye, side: "left" },
              ]}
            />
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
