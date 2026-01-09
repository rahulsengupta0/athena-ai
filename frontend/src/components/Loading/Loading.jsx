import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />

      {/* Text */}
      <p className="text-sm text-gray-500 font-medium">Loading</p>
    </div>
  );
};

export default Loading;
