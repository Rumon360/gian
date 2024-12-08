"use client";

import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

function Hero() {
  async function handleSignIn() {
    await signIn("google");
  }

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-16 text-center">
      <h1 className="scroll-m-20 pb-8 text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent dark:text-foreground [background-image:url(/wrap-two.webp)] dark:bg-none bg-center bg-no-repeat bg-cover">
        Revolutionize Your Course Creation with the Power of AI – Build,
        Customize and Engage Like Never Before
      </h1>

      <h3 className="scroll-m-20 text-secondary-foreground/90 text-xl lg:text-2xl font-semibold tracking-tight">
        Gian&apos;s AI-driven platform takes the hassle out of course creation.
        From generating chapter content to curating relevant YouTube videos and
        interactive quizzes, you can now create high-quality courses in just a
        few clicks.
      </h3>

      <div className="mt-8 flex items-center gap-2 justify-center">
        <Button
          variant={"ghost"}
          className="text-lg hover:bg-primary/40 border border-primary/20 transition ease-in-out"
          size={"lg"}
        >
          How it works
        </Button>
        <Button className="text-lg" size={"lg"} onClick={handleSignIn}>
          Get Started
        </Button>
      </div>
    </div>
  );
}

export default Hero;
