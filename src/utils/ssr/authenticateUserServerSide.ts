import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

// Checks auth status. If user is not authenticated, redirects to login page
// Optional getPropsCallback, which is invoked and can return extra props to be passed to the page
const authenticateUserServerSide = async (
  ctx: GetServerSidePropsContext,
  getPropsCallback: (
    session: Session
  ) => Promise<{ props: Record<string, unknown> }> = async () => ({ props: {} })
) => {
  const auth = await getServerAuthSession(ctx);
  if (!auth?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { props: nonSessionProps } = await getPropsCallback(auth);

  return {
    props: {
      self: auth.user,
      ...nonSessionProps,
    },
  };
};

export default authenticateUserServerSide;
