import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { NextRouter } from "next/router";

const NavigateBack = ({ router }: { router: NextRouter }) => {
  // " font-base  rounded-md bg-neutral-800 px-3 py-1 text-neutral-100 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
  return (
    <button
      onClick={() => router.back()}
      className="font-base absolute top-[4.35rem] left-[0.75rem] rounded-md bg-neutral-800 py-1 px-4 text-neutral-100 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      <ArrowUturnLeftIcon className="h-5 w-5" />
    </button>
  );
};
export default NavigateBack;
