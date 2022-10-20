import { NextRouter, useRouter } from "next/router";

import Navbar from "./Navbar";
import NavigateHome from "../misc/NavigateBack";
import React from "react";
import Wrapper from "./Wrapper";

const routesWithoutNavbar = ["/login"];

const routesWithtoutBackButton = ["/", "/login"];

const useConditionalRender = (router: NextRouter) => {
  // TODO: Fix once we have a login page -> may cause bug
  const { asPath } = router;

  return {
    shouldShowNavbar: !routesWithoutNavbar.includes(asPath),
    shouldShowBackButton: !routesWithtoutBackButton.includes(asPath),
  };
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { shouldShowNavbar, shouldShowBackButton } =
    useConditionalRender(router);

  return (
    <div className="h-full w-full bg-neutral-200">
      {shouldShowNavbar && <Navbar />}
      {shouldShowBackButton && <NavigateHome router={router} />}
      <Wrapper>{children}</Wrapper>
    </div>
  );
};

export default AppLayout;
