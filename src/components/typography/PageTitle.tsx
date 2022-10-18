import React from "react";

const PageTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h1
      className={`text-3xl font-bold text-neutral-800 sm:text-4xl ${className}`}
    >
      {children}
    </h1>
  );
};

export default PageTitle;
