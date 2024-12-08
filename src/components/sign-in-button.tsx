"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

function SignInButton() {
  async function handleSignIn() {
    await signIn("google");
  }

  return (
    <Button variant={"default"} onClick={handleSignIn}>
      Sign In
    </Button>
  );
}

export default SignInButton;
