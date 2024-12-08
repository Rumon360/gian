"use client";

import { motion } from "motion/react";
import { Button } from "../ui/button";
import { getStripeURL } from "@/actions/stripe";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { Check } from "lucide-react";

function Pricing() {
  const { execute, isLoading } = useAction(undefined, getStripeURL, {
    onSuccess: (data) => {
      window.location.href = data.url as string;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function handleClick() {
    execute(undefined);
  }

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Pricing</h2>
        <p className="text-secondary-foreground/60 font-semibold max-w-lg">
          Choose the plan that&apos;s right for you
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative p-8 rounded-2xl border bg-background/50 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl" />
          <div className="relative">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <p className="text-muted-foreground mb-8">
              Perfect for trying out Gian
            </p>
            <div className="text-4xl font-bold mb-8">
              $0
              <span className="text-lg font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                10 Course Generation Credits
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                Basic AI Features
              </li>
            </ul>
            <Button className="w-full" variant="outline">
              Get Started
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative p-8 rounded-2xl border bg-background/50 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl" />
          <div className="absolute -top-3 right-4">
            <span className="px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              Popular
            </span>
          </div>
          <div className="relative">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-muted-foreground mb-8">
              For serious course creators
            </p>
            <div className="text-4xl font-bold mb-8">
              $20
              <span className="text-lg font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                Unlimited Course Generation
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                Advanced AI Features
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                Priority Support
              </li>
            </ul>
            <Button className="w-full" onClick={handleClick}>
              Upgrade to Pro
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Pricing;
