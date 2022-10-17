import Head from "next/head";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import useHeadContents from "../utils/hooks/useHeadContents";

enum AuthOptions {
  Discord = "Discord",
  Google = "Google",
  GitHub = "GitHub",
}

const nextAuthSignInOptions = {
  callbackUrl: "/",
};

const AuthLoginButton = ({ authOption }: { authOption: AuthOptions }) => {
  const disableAuthOption = (authOption: AuthOptions) => {
    return [AuthOptions.Discord, AuthOptions.Google].includes(authOption);
  };

  return (
    <button
      onClick={() => signIn(authOption, { ...nextAuthSignInOptions })}
      disabled={disableAuthOption(authOption)}
      className="font-base mx-2 rounded-md bg-neutral-800 px-5 py-1 text-lg text-neutral-200 transition-all duration-200 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {authOption}
    </button>
  );
};

const LoginPage: NextPage = () => {
  const { headTitle, headDescription } = useHeadContents();
  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full w-full flex-col items-center justify-center py-24">
        <h1 className="pb-12 text-4xl font-bold text-neutral-800">
          Welcome to MMA Picks!
        </h1>
        <h3 className="text-2xl font-bold text-neutral-800">
          Login To Get Started:
        </h3>
        <div className="py-6">
          <AuthLoginButton authOption={AuthOptions.Discord} />
          <AuthLoginButton authOption={AuthOptions.GitHub} />
          <AuthLoginButton authOption={AuthOptions.Google} />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
