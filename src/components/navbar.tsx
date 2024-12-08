"use client";

import Link from "next/link";
import Logo from "./ui/logo";
import SignInButton from "./sign-in-button";
import UserMenu from "./user-menu";
import ModeToggle from "./mode-toggle";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { User } from "next-auth";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

function Navbar({
  user,
  isAuthenticated,
}: {
  user: User | null;
  isAuthenticated: boolean;
}) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const linkStyle =
    "px-3 py-2 relative before:absolute before:inset-0 before:rounded-md before:bg-primary/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity text-sm transition-colors";

  const mobileNavItems = (
    <nav className="flex flex-col space-y-4">
      <Link href="/gallery" className={cn(linkStyle)} prefetch={false}>
        Gallery
      </Link>
      {isAuthenticated && (
        <>
          <Link href="/create" className={cn(linkStyle)} prefetch={false}>
            Create
          </Link>
          <Link href="/settings" className={cn(linkStyle)} prefetch={false}>
            Settings
          </Link>
        </>
      )}
    </nav>
  );

  return (
    <motion.div
      variants={{
        visible: { y: 0, filter: "blur(0px)" },
        hidden: { y: "-150%", filter: "blur(5px)" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-full border border-border/60 [background-image:url(/bg-wrap.webp)] dark:[background-image:linear-gradient(rgba(3,7,18,0.8),rgba(3,7,18,0.8)),url(/wrap-two.webp)] bg-center bg-cover bg-no-repeat overflow-hidden shadow bg-primary/10 backdrop-blur-xl rounded-full mt-4 max-w-screen-md mx-auto flex justify-between h-16 px-4 md:px-6 shrink-0 items-center"
      >
        <Logo />
        <div className="flex items-center gap-4 text-sm font-medium">
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/gallery" className={cn(linkStyle)} prefetch={false}>
              Gallery
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/create" className={cn(linkStyle)} prefetch={false}>
                  Create
                </Link>
                <Link
                  href="/settings"
                  className={cn(linkStyle)}
                  prefetch={false}
                >
                  Settings
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {isAuthenticated && user ? (
              <div className="translate-y-0.5">
                <UserMenu user={user} />
              </div>
            ) : (
              <SignInButton />
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="md:hidden">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="mt-8">{mobileNavItems}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Navbar;
