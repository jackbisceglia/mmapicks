import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import Head from "next/head";
import authorizeUserServerSide from "../../utils/ssr/authorizeUserServerSide";
import useHeadContents from "../../utils/hooks/useHeadContents";

const SelfPicksPage = () => {
  return <h1>MY OWN PICKS</h1>;
};
const PublicUserPicksPage = () => {
  return <h1>OTHER USER PICKS</h1>;
};

const UserPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ self, authorizedAsSelf }) => {
  const { headTitle, headDescription } = useHeadContents();

  const handlePicksPageAccess = () => {
    if (authorizedAsSelf) {
      return <SelfPicksPage />;
    } else {
      return <PublicUserPicksPage />;
    }
  };

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {handlePicksPageAccess()}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  authorizeUserServerSide(ctx);

export default UserPage;
