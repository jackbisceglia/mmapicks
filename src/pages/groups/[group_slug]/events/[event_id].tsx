import Head from "next/head";
import { NextPage } from "next";
import useHeadContents from "../../../../utils/hooks/useHeadContents";

const EventPage: NextPage = () => {
  const { headTitle, headDescription } = useHeadContents();
  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default EventPage;
