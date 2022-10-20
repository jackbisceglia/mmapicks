import { ChangeEvent, FormEvent, useState } from "react";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { Group, Membership, User } from "@prisma/client";

import Head from "next/head";
import NotAuthorizedView from "../../../components/misc/NotAuthorized";
import PageTitle from "../../../components/typography/PageTitle";
import authenticateUserServerSide from "../../../utils/ssr/authenticateUserServerSide";
import { trpc } from "../../../utils/trpc";
import useHeadContents from "../../../utils/hooks/useHeadContents";

const InvitePageContent = ({
  group,
}: {
  group: Group & {
    Membership: (Membership & {
      User: User;
    })[];
  };
}) => {
  const [statusMessage, setStatusMessage] = useState<{
    msg: string;
    color: string;
  }>({
    msg: "",
    color: "",
  });
  const [userQuery, setUserQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const createGroupInviteMutation = trpc.group.createGroupInvite.useMutation();

  const { data: usersFromQuery, isLoading } =
    trpc.user.getRelevantUsers.useQuery("", {
      onSuccess: () => {
        setSelectedUsers([]);
      },
    });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuery(e.target.value);
  };

  const getUserById = (id: string) => {
    for (const user of usersFromQuery ?? []) {
      if (user.id === id) {
        return user;
      }
    }
    return undefined;
  };

  const handleUserSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const addUserToChecked = () => {
      const user = getUserById(target.value);

      if (!user) return;

      setSelectedUsers((prev) => [...prev, user]);
    };
    const removeUserFromChecked = () => {
      setSelectedUsers((prev) =>
        prev.filter((user) => user.id !== target.value)
      );
    };

    const target = e.target;
    if (target.checked) {
      addUserToChecked();
    } else {
      removeUserFromChecked();
    }
  };

  const includeUserInQuery = (user: User) => {
    if (userQuery === "") return false;

    const userAlreadyInGroup =
      group.Membership.filter((u) => {
        return u.User.id === user.id;
      }).length > 0;

    if (userAlreadyInGroup) {
      return false;
    }

    return user?.username?.toLowerCase().includes(userQuery.toLowerCase());
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createGroupInviteMutation.mutate(
      {
        groupId: group.id,
        userIds: selectedUsers.map((user) => user.id),
      },
      {
        onSuccess: (data) => {
          console.log("data: ", data);
          setSelectedUsers([]);
          setUserQuery("");
          if (!data.length) {
            setStatusMessage({ msg: "Error sending invites", color: "red" });
          } else {
            setStatusMessage({ msg: "Invites sent!", color: "emerald" });
          }
          setTimeout(() => {
            setStatusMessage({ msg: "", color: "" });
          }, 5000);
        },
      }
    );
  };

  const RelevantUserList = usersFromQuery
    ?.filter(includeUserInQuery)
    ?.map((user) => (
      <div
        key={user.id}
        className={` my-2 flex w-full  justify-between rounded-md  border-neutral-400 bg-neutral-300 px-4 text-2xl transition-all duration-200 hover:pl-7`}
      >
        <label
          // htmlFor={user?.username ?? ""}
          className="h-full w-full self-stretch py-2"
        >
          <input
            checked={selectedUsers.filter((u) => u.id === user.id).length > 0}
            onChange={handleUserSelect}
            // name={user?.username ?? ""}
            type="checkbox"
            value={user.id}
            className="mx-3 w-fit"
          />
          {user.username}
        </label>
      </div>
    ));

  const SelectedUsersString = selectedUsers.map((u) => u.username).join(", ");
  return (
    <>
      <PageTitle className="pb-2 text-center">Add Members</PageTitle>

      <h3 className="py-2 text-2xl font-medium underline">{group.title}</h3>
      <form
        onSubmit={handleFormSubmit}
        className=" ${visibility.display} opacity-${visibility.opacity} w-full max-w-md flex-col items-center justify-center  text-xl transition-all duration-150 ease-in-out"
      >
        <div className="flex w-full flex-col py-2">
          <label className="pb-1 text-lg">Search by username:</label>
          <input
            onChange={handleInput}
            value={userQuery}
            className="w-full rounded-md px-3 py-2 text-xl"
            type="text"
            name=""
            id=""
          />
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col py-1">
            {RelevantUserList?.length ? (
              RelevantUserList
            ) : (
              <p>{userQuery !== "" && "No users found"}</p>
            )}
          </div>
        )}
        <p className="py-4">
          Selected: <span className="font-bold">{SelectedUsersString}</span>{" "}
        </p>
        <button className=" font-base my-2 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400">
          Submit
        </button>
        <p className={`text-${statusMessage.color}-700`}>
          {statusMessage?.msg}
        </p>
      </form>
    </>
  );
};

const InvitePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ isOwnerOfGroup, group }) => {
  const { headTitle, headDescription } = useHeadContents();

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center pt-14 pb-7">
        {isOwnerOfGroup ? (
          <InvitePageContent group={group} />
        ) : (
          <NotAuthorizedView message="You aren't authorized to invite users to this group." />
        )}
      </div>
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
        isOwnerOfGroup: group?.ownerId === auth.user?.id,
        group: group && {
          ...group,
          createdAt: JSON.stringify(group.createdAt),
        },
      },
    };
  });

export default InvitePage;
