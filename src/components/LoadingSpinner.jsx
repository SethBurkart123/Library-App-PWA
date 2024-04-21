import { RotatingLines } from "react-loader-spinner";

export default function LoadingSpinner({ width }) {
  return (
    <RotatingLines
      strokeColor="white"
      strokeWidth="5"
      animationDuration="0.75"
      width={width}
      visible={true}
    />
  );
}