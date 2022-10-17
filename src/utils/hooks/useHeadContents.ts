import pageDescriptions from "../content/pageDescriptions";
import { useRouter } from "next/router";

// TODO: FIX - NOT WORKING
const useHeadContents = () => {
  const transformPathname = () => {
    const words = pathname.split("/");
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };
  const { pathname } = useRouter();

  const headPrefix = "MMA Picks";
  const headTitle = pathname !== "/" ? transformPathname() : "Home";

  return {
    headTitle: `${headPrefix} - ${headTitle}`,
    headDescription: pageDescriptions[pathname],
  };
};

export default useHeadContents;
