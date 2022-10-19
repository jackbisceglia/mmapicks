import type { GetServerSideProps, NextPage } from "next";
import { Group, Invite } from "@prisma/client";

import Head from "next/head";
import PageTitle from "../components/typography/PageTitle";
import React from "react";
import SuspendContent from "../components/misc/SuspendContent";
import authenticateUserServerSide from "../utils/ssr/authenticateUserServerSide";
import { router } from "../server/trpc/trpc";
import { trpc } from "../utils/trpc";
import useHeadContents from "../utils/hooks/useHeadContents";
import { useRouter } from "next/router";

const formatMemberCount = (numMembers: number) => {
  if (numMembers === 1) {
    return "1 member";
  } else {
    return `${numMembers} members`;
  }
};

const JoinGroupCard = ({
  invite,
  joinGroupHandler,
}: {
  invite: Invite & {
    Group: Group;
  };
  joinGroupHandler: (invitedId: string, groupId: string) => void;
}) => {
  return (
    <div className="my-1 flex w-full items-center justify-between rounded-md bg-neutral-400 p-2">
      <div>
        <h3 className="text-lg">{invite.Group.title}</h3>
        <p>{formatMemberCount(invite.Group.numMembers)}</p>
      </div>

      <button
        onClick={() => joinGroupHandler(invite.id, invite.groupId)}
        className="font-base h-min rounded-md bg-neutral-800 px-4 py-1 text-neutral-200"
      >
        Join
      </button>
    </div>
  );
};
const JoinGroupColumn = ({
  children,
  title,
  isLoading = false,
}: {
  children?: React.ReactNode;
  title: string;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex flex-grow flex-col items-center rounded-md bg-neutral-300 p-2">
      <h3 className="py-3 text-xl font-medium underline">{title}</h3>
      <SuspendContent isLoading={isLoading}>{children}</SuspendContent>
    </div>
  );
};

const MyInvitesColumn = () => {
  const { data: invites, isLoading } = trpc.self.getInvites.useQuery();
  const joinGroupMutation = trpc.group.acceptUserInvite.useMutation();
  const router = useRouter();

  const handleAcceptInvite = async (inviteId: string, groupId: string) => {
    joinGroupMutation.mutateAsync(
      { inviteId, groupId },
      {
        onSuccess: (group) => {
          router.push(`${router.basePath}/groups/${group.slug}`, {});
        },
      }
    );
  };

  const InviteList = invites?.map((invite) => (
    <JoinGroupCard
      joinGroupHandler={handleAcceptInvite}
      key={invite.id}
      invite={invite}
    />
  ));

  return (
    <JoinGroupColumn title="My Invites" isLoading={isLoading}>
      {invites?.length ? InviteList : <p>No Invites Currently</p>}
    </JoinGroupColumn>
  );
};

const PublicGroupsColumn = () => {
  return (
    <JoinGroupColumn title="Public Groups">
      <h1>No Public Groups Yet</h1>
    </JoinGroupColumn>
  );
};

const JoinPage: NextPage = () => {
  const { headTitle, headDescription } = useHeadContents();

  // getUserInvites
  // getPublicGroups

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center pt-14 pb-7">
        <PageTitle className="pb-4">Join Groups</PageTitle>
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <MyInvitesColumn />
          <PublicGroupsColumn />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) =>
  authenticateUserServerSide(ctx);

export default JoinPage;
