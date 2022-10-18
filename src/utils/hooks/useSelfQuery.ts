import { trpc } from "../trpc";

const useSelfQuery = () => {
  const { data, isLoading, error, refetch } = trpc.self.getSelf.useQuery();

  return { self: data, isLoading, error, refetch };
};

export default useSelfQuery;
