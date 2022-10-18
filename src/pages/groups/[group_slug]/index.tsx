import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import { EventCard } from "../../../components/groups/Cards";
import { Group } from "@prisma/client";
import Head from "next/head";
import NotAuthorizedView from "../../../components/misc/NotAuthorized";
import PageTitle from "../../../components/typography/PageTitle";
import SuspendContent from "../../../components/misc/SuspendContent";
import authenticateUserServerSide from "../../../utils/ssr/authenticateUserServerSide";
import { trpc } from "../../../utils/trpc";
import useHeadContents from "../../../utils/hooks/useHeadContents";

const InviteToGroupButton = ({
  isOwnerOfGroup,
  disabled,
}: {
  isOwnerOfGroup: boolean;
  disabled: boolean;
}) => {
  if (!isOwnerOfGroup) {
    return null;
  }
  return (
    <button
      disabled={disabled}
      className="font-base my-3 rounded-md bg-neutral-800 px-3  py-1 text-xs text-neutral-200 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      Invite Friends
    </button>
  );
};

const GroupPageContent = ({
  group,
  isOwnerOfGroup,
}: {
  group: Group;
  isOwnerOfGroup: boolean;
}) => {
  const { data: events, isLoading } = trpc.event.getUpcomingEvents.useQuery();

  const groupAtCapacity = group.numMembers >= 10;

  const EventList = events?.map((event) => (
    <EventCard key={event.id} event={event} />
  ));

  return (
    <SuspendContent isLoading={isLoading}>
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center py-14 leading-none">
        <div className="flex w-full flex-col items-center justify-center">
          <PageTitle>{group.title}</PageTitle>
          <InviteToGroupButton
            isOwnerOfGroup={isOwnerOfGroup}
            disabled={groupAtCapacity}
          />
          <h3 className=" font-regular py-4 text-xl text-neutral-800 sm:text-2xl">
            Upcoming Events
          </h3>
        </div>
        {EventList}
      </div>
    </SuspendContent>
  );
};

const GroupPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ isOwnerOfGroup, isMemberOfGroup, group }) => {
  const { headTitle, headDescription } = useHeadContents();

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isMemberOfGroup ? (
        <GroupPageContent group={group} isOwnerOfGroup={isOwnerOfGroup} />
      ) : (
        <NotAuthorizedView message="You are not a member of this group" />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) =>
  authenticateUserServerSide(ctx, async (auth) => {
    let { group_slug } = ctx.query;

    if (!group_slug) {
      return {
        props: {
          authorizedToRoom: false,
        },
      };
    }

    if (group_slug instanceof Array) {
      group_slug = group_slug[0];
    }

    const slug_as_string = group_slug as string;

    const group = await prisma?.group.findUnique({
      where: { slug: slug_as_string },
      include: {
        Membership: true,
      },
    });

    return {
      props: {
        isMemberOfGroup:
          group &&
          group?.Membership.reduce(
            (acc, curr) => acc || curr.userId === auth.user?.id,
            false
          ),
        isOwnerOfGroup: group?.ownerId === auth.user?.id,
        group: group && {
          ...group,
          createdAt: JSON.stringify(group.createdAt),
        },
      },
    };
  });

export default GroupPage;
