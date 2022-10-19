import { NextRouter, useRouter } from "next/router";

import Navbar from "./Navbar";
import NavigateHome from "../misc/NavigateHome";
import React from "react";
import Wrapper from "./Wrapper";

const routesWithoutNavbar = ["/login"];

const useRenderNavbar = (router: NextRouter) => {
  // TODO: Fix once we have a login page -> may cause bug
  const { asPath } = router;

  const shouldExcludeNavbar = routesWithoutNavbar.includes(asPath);

  return {
    shouldShowNavbar: !shouldExcludeNavbar,
  };
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { shouldShowNavbar } = useRenderNavbar(router);

  return (
    <div className="h-full w-full bg-neutral-200">
      {shouldShowNavbar && <Navbar />}
      <NavigateHome router={router} show={router.asPath !== "/"} />
      <Wrapper>{children}</Wrapper>
    </div>
  );
};

export default AppLayout;
