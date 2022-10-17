import { slugify, unslugify } from "../slugify";

import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

// TODO: for future use, we should make this more extensible for
// actual SSR uses. Currently, we rely on this to return all of our
// SSR props, but in the event that we want other SSR props, we have to handle this as well.

// For now, we just return the user object

const authorizeUserServerSide = async (ctx: GetServerSidePropsContext) => {
  const auth = await getServerAuthSession(ctx);
  if (!auth?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // TODO: may have to make this more generic
  const pageUserSlug = ctx.query?.user_slug;
  const authorizedAsSelf = slugify(auth?.user?.name ?? "") === pageUserSlug;
  return {
    props: {
      self: auth.user,
      authorizedAsSelf: authorizedAsSelf,
    },
  };
};

export default authorizeUserServerSide;
