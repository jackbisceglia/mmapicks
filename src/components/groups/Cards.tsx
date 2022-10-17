import { Group, User } from "@prisma/client";

import Link from "next/link";
import { slugify } from "../../utils/slugify";

// TODO: needs to exist on group object or user object or member object
const xp_count = 100;

// TODO: needs to exist on group object or user object or member object
const num_events = 32;

type GroupCardPropTypes = {
  group: Group;
};

type SelfGroupCardPropTypes = {
  self: User;
};

type PickCardPropTypes = {
  content: {
    title: string;
    num_events: number;
    num_members: number;
    xp_count: number;
  };
  cardHref: string;
};

const PickCard = ({ content, cardHref }: PickCardPropTypes) => {
  return (
    <Link href={cardHref}>
      <div className="mb-6 flex w-full cursor-pointer items-center justify-center rounded-md bg-neutral-400 py-3 px-4 transition-all duration-100 hover:bg-neutral-500">
        {/* LEFT SIDE */}
        <div className="flex w-max flex-grow flex-col justify-start">
          <h3 className="pb-1 text-2xl font-semibold text-neutral-800">
            {content.title}
          </h3>
          <p>{content.num_events} Events Picked</p>
          <p>{content.num_members} Members</p>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex h-max w-fit justify-start">
          <div className=" w-auto rounded-md bg-blue-600 px-1 py-1">{`${xp_count} XP`}</div>
        </div>
      </div>
    </Link>
  );
};

const GroupCard = ({ group }: GroupCardPropTypes) => {
  const cardHref = `/groups/${slugify(group.title)}`;
  return (
    <PickCard
      content={{ ...group, num_events, xp_count }}
      cardHref={cardHref}
    />
  );
};

const SelfGroupCard = ({ self }: SelfGroupCardPropTypes) => {
  console.log(self);
  const cardHref = `/users/${self.username}`;
  const selfGroupCardContent = {
    title: "Me",
    num_events: num_events,
    num_members: 1,
    xp_count: xp_count,
  };
  return <PickCard content={selfGroupCardContent} cardHref={cardHref} />;
};

export { GroupCard, SelfGroupCard };
