import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { GroupCard, SelfGroupCard } from "../components/groups/Cards";

import CreateGroupForm from "../components/groups/CreateGroupForm";
import Head from "next/head";
import { User } from "@prisma/client";
import authenticateUserServerSide from "../utils/ssr/authenticateUserServerSide";
import { trpc } from "../utils/trpc";
import useHeadContents from "../utils/hooks/useHeadContents";
import { useState } from "react";

type GroupViewPropTypes = {
  self: User;
  toggleView: () => void;
};

const GroupView = ({ self, toggleView }: GroupViewPropTypes) => {
  // TODO: Add loading spinner
  const { data: groups } = trpc.group.getAllSelfGroups.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="flex w-full items-start justify-between py-6">
        <h3 className=" text-2xl font-semibold text-neutral-800">
          Your Groups
        </h3>
        <button
          onClick={toggleView}
          className=" font-base rounded-md bg-neutral-800 px-3 py-1 text-neutral-200"
        >
          +
        </button>
      </div>
      <SelfGroupCard self={self} />
      {groups?.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </>
  );
};

const HomePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ self }) => {
  const { headTitle, headDescription } = useHeadContents();
  const [creatingGroup, setCreatingGroup] = useState(false);

  const toggleView = () => setCreatingGroup(!creatingGroup);

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center py-14">
        <h1 className="text-4xl font-bold text-neutral-800">
          {/* Welcome, {getFirstNameFromName(self.name)} */}
          {/* Welcome, {self.name} */}
          Welcome, Test User
        </h1>
        {creatingGroup ? (
          <CreateGroupForm toggleView={toggleView} />
        ) : (
          <GroupView toggleView={toggleView} self={self} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  authenticateUserServerSide(ctx);

export default HomePage;
