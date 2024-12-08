"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

type UserMenuProps = {
  user: User;
};

function UserMenu({ user }: UserMenuProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-medium">
            <div>
              <p>{user.name}</p>
              <p className="text-xs text-secondary-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5">
            <Button
              variant="destructive"
              onClick={() => signOut()}
              size={"sm"}
              className="font-medium"
            >
              Sign out
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserMenu;
