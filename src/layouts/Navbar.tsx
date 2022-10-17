import Link from "next/link";
import { signOut } from "next-auth/react";

const Navbar = () => {
  return (
    <nav className=" flex h-14 w-full items-center justify-between bg-neutral-400 px-8 sm:px-16 md:px-20">
      {/* left */}
      <Link href="/">
        <h3 className="cursor-pointer text-2xl font-bold text-neutral-800 ">
          MMAPicks
        </h3>
      </Link>
      {/* TODO: FIX LATER */}
      <div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className=" font-base rounded-md bg-neutral-800 px-3 py-1 text-neutral-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
