import { Event, Group, User } from "@prisma/client";
import { InviteToGroupButton, LeaveGroupButton } from "./InviteToGroupButton";

import Link from "next/link";
import { useRouter } from "next/router";

// TODO: needs to exist on group object or user object or member object
const xp_count = 100;

// TODO: needs to exist on group object or user object or member object
const num_events = 32;

type GroupCardPropTypes = {
  group: Group;
  isOwner: boolean;
};

type SelfGroupCardPropTypes = {
  self: User;
};

type PickCardPropTypes = {
  content: {
    title: string;
    num_events: number;
    numMembers: number;
    xp_count: number;
  };
  cardHref: string;
  PropsButton?: () => JSX.Element;
};

type EventCardPropTypes = {
  event: Event;
};

type MemberCardPropTypes = {
  user: User;
  rank: number;
};

const formatDate = (d: Date) => new Intl.DateTimeFormat("en-US").format(d);

const EventCard = ({ event }: EventCardPropTypes) => {
  const { asPath } = useRouter();
  return (
    <Link href={`${asPath}/events/${event.id}`}>
      <div className="mb-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md  border-neutral-400 bg-neutral-300 py-4 px-4 transition-all duration-200 hover:pl-7">
        {/* LEFT SIDE */}
        <div className="flex w-max flex-grow flex-col justify-start">
          <h3 className="pb-0 text-2xl font-semibold text-neutral-800">
            {event.title}
          </h3>
          <p>{formatDate(event.date)}</p>
          <p className=" py-1 text-lg font-medium text-red-700">
            {event.mainEvent}
          </p>
          <p className="py-0 text-sm">{event.location}</p>
          <p className="py-0 text-sm">{event.venue}</p>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex h-max w-fit justify-start">
          {/* <div className=" w-auto rounded-md bg-blue-700 px-1 py-1">test</div> */}
        </div>
      </div>
    </Link>
  );
};

const MemberCard = ({ user, rank }: MemberCardPropTypes) => {
  return (
    <Link href={`/users/${user.username}`}>
      <div className=" mb-2 flex w-full cursor-pointer items-center justify-center gap-2  rounded-md border-neutral-400 bg-neutral-300 py-2 px-4 underline-offset-8 transition-all duration-200 hover:pl-5 hover:underline">
        {/* LEFT SIDE */}
        <div className="flex w-max flex-grow flex-col justify-start">
          <h3 className=" break-all pb-0 text-lg font-normal text-neutral-800">
            <span>{rank}.</span> @{user.username}
          </h3>
        </div>
        {/* RIGHT SIDE */}
      </div>
    </Link>
  );
};

const PickCard = ({ content, cardHref, PropsButton }: PickCardPropTypes) => {
  return (
    <div className="mb-6 flex w-full  items-center justify-center  rounded-md border-2 border-neutral-400 bg-neutral-300 py-4 px-4 transition-all duration-200 hover:pl-7">
      {/* LEFT SIDE */}
      <div className="flex w-max flex-grow flex-col justify-start">
        <Link href={cardHref}>
          <h3 className=" w-fit cursor-pointer py-1 text-2xl font-semibold text-neutral-800 hover:underline">
            {content.title}
          </h3>
        </Link>
        <p>{content.num_events} Events Picked</p>
        <p>{content.numMembers} Members</p>
      </div>
      {/* RIGHT SIDE */}
      <div className="flex h-full w-auto flex-col items-start justify-end self-stretch  ">
        {PropsButton && <PropsButton />}
        {/* Punt on XP FOR NOW */}
        {/* <div className=" w-auto rounded-md bg-blue-600 px-1 py-1">{`${xp_count} XP`}</div> */}
      </div>
    </div>
  );
};

const GroupCard = ({ group, isOwner }: GroupCardPropTypes) => {
  const cardHref = `/groups/${group.slug}`;

  const HomePageInviteToGroupButton = () => {
    if (isOwner) {
      return (
        <InviteToGroupButton
          isOwnerOfGroup={isOwner}
          disabled={false}
          groupSlug={group.slug}
          // className="mb-2"
        />
      );
    } else {
      return <LeaveGroupButton groupId={group.id} />;
    }
  };

  return (
    <PickCard
      content={{ ...group, num_events, xp_count }}
      cardHref={cardHref}
      PropsButton={HomePageInviteToGroupButton}
    />
  );
};

const SelfGroupCard = ({ self }: SelfGroupCardPropTypes) => {
  const cardHref = `/users/${self.username}`;
  const selfGroupCardContent = {
    title: "Me",
    num_events: num_events,
    numMembers: 1,
    xp_count: xp_count,
  };
  return <PickCard content={selfGroupCardContent} cardHref={cardHref} />;
};

export { GroupCard, SelfGroupCard, EventCard, MemberCard };
