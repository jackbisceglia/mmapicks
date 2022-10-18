import Spinner from "./Spinner";

const SuspendContent = ({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) => {
  if (isLoading) {
    return <Spinner />;
  }

  return <>{children}</>;
};

export default SuspendContent;
