import Link from "next/link";
import { trpc } from "../../utils/trpc";

const InviteToGroupButton = ({
  isOwnerOfGroup,
  groupSlug,
  disabled,
  className,
}: {
  isOwnerOfGroup: boolean;
  groupSlug: string;
  disabled: boolean;
  className?: string;
}) => {
  if (!isOwnerOfGroup) {
    return null;
  }
  return (
    <Link href={`/groups/${groupSlug}/invite`}>
      <button
        disabled={disabled}
        className={`${
          className ?? ""
        } font-base rounded-md bg-neutral-800 px-3 py-1  text-xs  text-neutral-200 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed  disabled:bg-neutral-400 `}
      >
        Invite Friends
      </button>
    </Link>
  );
};

const LeaveGroupButton = ({
  className = "",
  groupId,
}: {
  className?: string;
  groupId: string;
}) => {
  const utils = trpc.useContext();
  const leaveGroupMutation = trpc.group.leaveGroup.useMutation();

  const leaveGroup = () => {
    leaveGroupMutation.mutateAsync(
      { groupId },
      {
        onSuccess: () => {
          utils.group.getAllSelfGroups.invalidate();
        },
      }
    );
  };
  return (
    <button
      onClick={leaveGroup}
      className={`${className} font-base rounded-md bg-red-600 px-3 py-1  text-xs text-neutral-200 transition-all duration-200 ease-in-out hover:bg-red-700  disabled:cursor-not-allowed `}
    >
      Leave Group
    </button>
  );
};

export { InviteToGroupButton, LeaveGroupButton };
