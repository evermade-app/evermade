import React from "react";

interface LoadingDashedSpinnerProps {
  message?: string;
  subMessage?: string;
  className?: string;
}

const LoadingDashedSpinner: React.FC<LoadingDashedSpinnerProps> = ({
  message = "Loading...",
  subMessage = "Your adventure is about to begin",
  className = "",
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto" />
      <h2 className="text-zinc-900 dark:text-white mt-4">{message}</h2>
      <p className="text-zinc-600 dark:text-zinc-400">{subMessage}</p>
    </div>
  );
};

export default LoadingDashedSpinner;
