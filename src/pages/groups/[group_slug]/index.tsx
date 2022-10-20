import { EventCard, MemberCard } from "../../../components/groups/Cards";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { Group, Membership, User } from "@prisma/client";

import Head from "next/head";
import InviteToGroupButton from "../../../components/groups/InviteToGroupButton";
import NotAuthorizedView from "../../../components/misc/NotAuthorized";
import PageTitle from "../../../components/typography/PageTitle";
import SuspendContent from "../../../components/misc/SuspendContent";
import authenticateUserServerSide from "../../../utils/ssr/authenticateUserServerSide";
import { trpc } from "../../../utils/trpc";
import useHeadContents from "../../../utils/hooks/useHeadContents";

const GroupPageContent = ({
  group,
  isOwnerOfGroup,
}: {
  group: Group & {
    Membership: (Membership & {
      User: User;
    })[];
  };
  isOwnerOfGroup: boolean;
}) => {
  const { data: events, isLoading } = trpc.event.getUpcomingEvents.useQuery();

  const groupAtCapacity = group.numMembers >= 10;

  const EventList = events?.map((event) => (
    <EventCard key={event.id} event={event} />
  ));

  const MemberList = group.Membership.map(({ User }, idx) => (
    <MemberCard key={User.id} rank={idx + 1} user={User} />
  ));

  return (
    <SuspendContent isLoading={isLoading}>
      <div className="flex h-full w-full flex-col items-center justify-center pt-14 leading-none">
        <PageTitle>{group.title}</PageTitle>
        <InviteToGroupButton
          className="mt-3"
          groupSlug={group.slug}
          isOwnerOfGroup={isOwnerOfGroup}
          disabled={groupAtCapacity}
        />
        <div className="flex h-full w-full max-w-2xl flex-col-reverse items-center justify-center gap-0 py-2 leading-none sm:flex-row sm:items-start sm:gap-4 ">
          {/* left */}
          {group.numMembers > 1 && (
            <div className="flex h-full w-full flex-col items-start justify-center leading-none sm:w-44">
              <h3 className=" font-regular py-4 text-xl text-neutral-800 sm:text-2xl">
                Rankings
              </h3>
              {MemberList}
            </div>
          )}
          {/* right */}
          <div className="flex h-full w-full flex-grow flex-col items-start justify-center leading-none sm:w-min">
            <h3 className=" font-regular py-4 text-xl text-neutral-800 sm:text-2xl">
              Upcoming Events
            </h3>
            {EventList}
          </div>
        </div>
      </div>
    </SuspendContent>
  );
};

const GroupPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ isOwnerOfGroup, isMemberOfGroup, group }) => {
  const { headTitle, headDescription } = useHeadContents();
  console.log("group", group);
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
        <NotAuthorizedView message="You are not a member of this group." />
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
        Membership: {
          include: {
            User: true,
          },
        },
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
