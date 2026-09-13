import Lottie from "lottie-react";

export default function AnimatedIcon({
  animation,
  size = 48,
  loop = true,
}) {
  return (
    <Lottie
      animationData={animation}
      loop={loop}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}