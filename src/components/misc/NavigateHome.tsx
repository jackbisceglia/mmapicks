import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { NextRouter } from "next/router";

const NavigateHome = ({
  show,
  router,
}: {
  show: boolean;
  router: NextRouter;
}) => {
  if (!show) return null;
  // " font-base  rounded-md bg-neutral-800 px-3 py-1 text-neutral-100 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
  return (
    <button
      onClick={() => router.back()}
      className="font-base absolute top-20 left-8 rounded-md bg-neutral-800 px-4 py-1 text-neutral-100 transition-all duration-200 ease-in-out hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      <ArrowUturnLeftIcon className="h-6 w-6" />
    </button>
  );
};
export default NavigateHome;
