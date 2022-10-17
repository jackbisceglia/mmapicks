import Head from "next/head";
import { NextPage } from "next";
import useHeadContents from "../../utils/hooks/useHeadContents";
import { useRouter } from "next/router";

const GroupPage: NextPage = () => {
  const { headTitle, headDescription } = useHeadContents();
  const router = useRouter();

  const { group_slug } = router.query;

  const group_title = group_slug
    ? (group_slug as string)
        .split("-")
        .map(
          (part_of_slug) =>
            part_of_slug.slice(0, 1).toUpperCase() + part_of_slug.slice(1)
        )
        .join(" ")
    : "No Such Group Found";

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full w-full flex-col items-center justify-center py-14">
        <h1 className="text-4xl font-bold text-neutral-800">{group_title}</h1>
      </div>
    </>
  );
};

export default GroupPage;
