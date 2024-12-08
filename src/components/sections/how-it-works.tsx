"use client";

import { motion } from "motion/react";
import { BrainCircuit, Sparkles, BookOpen, Rocket } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Choose Your Topic",
      description: "Enter the main course title you want to create",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Add Subtopics",
      description: "List the key subtopics you want to cover in your course",
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: "AI Magic",
      description:
        "Our AI analyzes your inputs and generates comprehensive course content",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Ready to Teach",
      description: "Get your professionally structured course ready to share",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-secondary-foreground/60 font-semibold max-w-lg">
            Create professional courses in minutes using the power of AI. Just
            follow these simple steps:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, ease: "easeInOut" }}
              className="rounded-2xl relative bg-background/50 backdrop-blur-sm p-6"
            >
              <div className="bg-primary/10 p-3 w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center mb-4 mx-auto text-primary">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">{step.description}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
