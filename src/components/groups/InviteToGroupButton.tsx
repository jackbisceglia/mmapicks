import Link from "next/link";
import { useRouter } from "next/router";

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
  const router = useRouter();
  if (!isOwnerOfGroup) {
    return null;
  }
  console.log(router.asPath);
  return (
    <Link href={`/groups/${groupSlug}/invite`}>
      <button
        disabled={disabled}
        className={`${
          className ?? ""
        } font-base rounded-md bg-neutral-800 px-3  py-1 text-xs text-neutral-200 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400`}
      >
        Invite Friends
      </button>
    </Link>
  );
};

export default InviteToGroupButton;
