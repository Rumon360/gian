import { auth } from "@/auth";
import React from "react";
import Navbar from "./navbar";

async function Header() {
  const session = await auth();
  const isAuthenticated = !!session;
  const user = session?.user || null;

  return (
    <header className="w-full sticky top-6 z-50 px-4 md:px-6">
      <Navbar user={user} isAuthenticated={isAuthenticated} />
    </header>
  );
}

export default Header;
