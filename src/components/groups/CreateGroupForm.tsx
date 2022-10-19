import { FormEvent, useEffect, useRef, useState } from "react";

import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

type CreateGroupFormPropTypes = {
  toggleView: () => void;
  show: boolean;
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

type toggleViewStyleProps = {
  display: string;
  opacity: number;
};

const defaultHiddenState = {
  display: "none",
  opacity: 0,
};

const defaultVisibleState = {
  display: "flex",
  opacity: 100,
};

const CreateGroupForm = ({ toggleView, show }: CreateGroupFormPropTypes) => {
  const groupMutation = trpc.group.createNewGroup.useMutation();
  const [visibility, setVisibility] = useState<toggleViewStyleProps>({
    ...defaultHiddenState,
  });
  useEffect(() => {
    console.log("effect run");
    setTimeout(() => {
      setVisibility({ ...defaultVisibleState });
    }, 1);

    return () => {
      console.log("effect cleanup run");
      setVisibility({ ...defaultHiddenState });
    };
  }, []);

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
      if (formState.title.length < 3) {
        return;
      }
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
      className={` sm:3/5 ${visibility.display} opacity-${visibility.opacity} w-4/5 max-w-md flex-col items-center justify-center py-10 text-xl transition-all duration-150 ease-in-out`}
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
          className=" font-base mr-2 flex-grow rounded-md bg-neutral-800 px-3 py-1 text-neutral-200 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          Cancel
        </button>
        <button className="font-base ml-2 flex-grow rounded-md bg-blue-600 px-3 py-1 text-neutral-200 transition-all duration-200 ease-in-out hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-neutral-400">
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateGroupForm;
