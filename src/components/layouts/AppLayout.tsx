import Navbar from "./Navbar";
import React from "react";
import Wrapper from "./Wrapper";
import { useRouter } from "next/router";

const routesWithoutNavbar = ["/login"];

const useRenderNavbar = () => {
  // TODO: Fix once we have a login page -> may cause bug
  const { asPath } = useRouter();

  const shouldExcludeNavbar = routesWithoutNavbar.includes(asPath);

  return {
    shouldShowNavbar: !shouldExcludeNavbar,
  };
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { shouldShowNavbar } = useRenderNavbar();

  return (
    <div className="h-full w-full bg-neutral-200">
      {shouldShowNavbar && <Navbar />}
      <Wrapper>{children}</Wrapper>
    </div>
  );
};

export default AppLayout;
