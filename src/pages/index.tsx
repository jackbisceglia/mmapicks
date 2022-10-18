import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { GroupCard, SelfGroupCard } from "../components/groups/Cards";

import CreateGroupForm from "../components/groups/CreateGroupForm";
import Head from "next/head";
import JacksEpicImage from "../components/misc/JacksEpicImage";
import PageTitle from "../components/typography/PageTitle";
import Spinner from "../components/misc/Spinner";
import SuspendContent from "../components/misc/SuspendContent";
import { User } from "@prisma/client";
import authenticateUserServerSide from "../utils/ssr/authenticateUserServerSide";
import { trpc } from "../utils/trpc";
import useHeadContents from "../utils/hooks/useHeadContents";
import useSelfQuery from "../utils/hooks/useSelfQuery";
import { useState } from "react";

type GroupViewPropTypes = {
  self: User;
  toggleView: () => void;
};

const GroupView = ({ self, toggleView }: GroupViewPropTypes) => {
  const { data: groups, isLoading } = trpc.group.getAllSelfGroups.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const GroupList = groups?.map((group) => (
    <GroupCard key={group.id} group={group} />
  ));

  return (
    <>
      <div className="flex w-full items-center justify-center">
        {self.image && (
          <JacksEpicImage
            src={self.image}
            alt={`${self.username} Profil Picture`}
            className="h-14 w-14 select-none sm:h-20 sm:w-20"
          />
        )}
        <PageTitle className="pl-4">@{self.username}</PageTitle>
      </div>
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
      {isLoading ? <Spinner /> : GroupList}
    </>
  );
};

const HomePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({}) => {
  const { headTitle, headDescription } = useHeadContents();
  const [creatingGroup, setCreatingGroup] = useState(false);

  const toggleView = () => setCreatingGroup(!creatingGroup);

  const { self, isLoading } = useSelfQuery();

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center py-14">
        <SuspendContent isLoading={isLoading}>
          {creatingGroup ? (
            <CreateGroupForm toggleView={toggleView} />
          ) : (
            self && <GroupView self={self} toggleView={toggleView} />
          )}
        </SuspendContent>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  authenticateUserServerSide(ctx);

export default HomePage;
