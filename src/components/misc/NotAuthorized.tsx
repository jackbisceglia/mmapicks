import PageTitle from "../typography/PageTitle";

const NotAuthorizedView = ({ message }: { message: string }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center py-14 text-center">
      <PageTitle>{message}</PageTitle>
    </div>
  );
};

export default NotAuthorizedView;
