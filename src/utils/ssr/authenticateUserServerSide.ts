import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

// TODO: for future use, we should make this more extensible for
// actual SSR uses. Currently, we rely on this to return all of our
// SSR props, but in the event that we want other SSR props, we have to handle this as well.

// For now, we just return the user object

const authenticateUserServerSide = async (ctx: GetServerSidePropsContext) => {
  const auth = await getServerAuthSession(ctx);
  if (!auth?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      self: auth.user,
    },
  };
};

export default authenticateUserServerSide;
