"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

function FAQ() {
  const faqs = [
    {
      question: "What is Gian?",
      answer:
        "Gian is an AI-powered course creation platform that helps educators and content creators build professional courses in minutes. It uses advanced AI to structure and generate comprehensive course content based on your input.",
    },
    {
      question: "How does the course generation work?",
      answer:
        "Simply enter your main course topic and key subtopics. Our AI will analyze your inputs and generate structured course content, complete with lessons, examples, and exercises. The process is quick, intuitive, and produces high-quality educational material.",
    },
    {
      question: "What's included in the free plan?",
      answer:
        "The free plan includes 10 course generation credits and access to basic AI features. This allows you to try out the platform and see how it can benefit your teaching or content creation process.",
    },
    {
      question: "Can I customize the generated content?",
      answer:
        "Yes! All generated content is fully editable. You can modify, add, or remove any part of the course to match your teaching style and requirements. The AI-generated content serves as a comprehensive starting point.",
    },
    {
      question: "What makes Gian different from other course creation tools?",
      answer:
        "Gian combines the power of advanced AI with an intuitive user interface to make course creation effortless. Our platform not only saves time but also ensures educational best practices are followed in course structure and content.",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-secondary-foreground/60 font-semibold">
          Everything you need to know about Gian
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm px-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-secondary-foreground/80 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </motion.div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
