import { FormEvent, useState } from "react";

import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

type CreateGroupFormPropTypes = {
  toggleView: () => void;
};

type GroupFormInputType = {
  title: string;
  maxMembersAllowed: number;
};

enum GroupFormInputs {
  title = "title",
  maxMembersAllowed = "maxMemberAllowed",
}

const defaultForm: GroupFormInputType = {
  title: "",
  maxMembersAllowed: 10,
};

const CreateGroupForm = ({ toggleView }: CreateGroupFormPropTypes) => {
  const groupMutation = trpc.group.createNewGroup.useMutation();

  const [formState, setFormState] = useState<GroupFormInputType>({
    ...defaultForm,
  });

  const router = useRouter();

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputChanged: GroupFormInputs
  ) => {
    if (inputChanged === GroupFormInputs.title) {
      setFormState({ ...formState, title: e.target.value });
    } else if (inputChanged === GroupFormInputs.maxMembersAllowed) {
      setFormState({
        ...formState,
        maxMembersAllowed: parseInt(e.target.value),
      });
    }
  };

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    const submit = async () => {
      await groupMutation.mutateAsync(formState, {
        onSuccess: (group) => {
          router.push(`/groups/${group.slug}`);
        },
      });
    };
    const reset = () => {
      return;
    };

    e.preventDefault();
    await submit();
    reset();
  };

  return (
    <form
      onSubmit={handleFormSubmission}
      className="sm:3/5 flex w-4/5 max-w-md flex-col items-center justify-center py-10 text-xl"
    >
      <div className="flex w-full flex-col py-4">
        <label className="pb-1">Group Name</label>
        <input
          onChange={(e) => handleFormChange(e, GroupFormInputs.title)}
          className="rounded-md px-3 py-1"
          type="text"
          name=""
          id=""
        />
      </div>
      <div className="flex w-full flex-col py-4">
        <label className="pb-1">
          Maximum Members Allowed:{" "}
          <span className=" font-bold text-blue-600">
            {formState.maxMembersAllowed}
          </span>
        </label>
        <input
          onChange={(e) =>
            handleFormChange(e, GroupFormInputs.maxMembersAllowed)
          }
          className="cursor-pointer rounded-md px-3 py-1"
          min={2}
          max={10}
          value={formState.maxMembersAllowed}
          type="range"
          name=""
          id=""
        />
      </div>
      <div className="flex w-full justify-evenly py-4">
        <button
          onClick={toggleView}
          className=" font-base mr-2 flex-grow rounded-md bg-neutral-800 px-3 py-1 text-neutral-200"
        >
          Cancel
        </button>
        <button className="font-base ml-2 flex-grow rounded-md bg-blue-600 px-3 py-1 text-neutral-200">
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateGroupForm;
