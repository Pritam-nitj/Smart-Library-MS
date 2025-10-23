"use client";

import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock3, RefreshCw, Search } from "lucide-react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const FAQSection: React.FC = () => {
  const faqs: { icon: IconType; question: string; answer: string }[] = [
    {
      icon: BookOpen,
      question: "How can I issue a book?",
      answer:
        "Log into your account, head to the dashboard, search the title, and select 'Issue Book'. If copies are available, it's instant.",
    },
    {
      icon: Clock3,
      question: "What happens if I return a book late?",
      answer:
        "A small per-day late fee is applied after the due date. You can track and pay fines securely from your account.",
    },
    {
      icon: RefreshCw,
      question: "Can I renew a borrowed book?",
      answer:
        "Yes. You can renew once as long as there isn't an active request for that copy from another member.",
    },
  ];

  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [query, faqs]);

  return (
    <section id="faq" className="relative py-20 mb-12 flex flex-col items-center overflow-hidden">
      {/* Enhanced decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-15%] h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[15%] bottom-[-5%] h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute left-[15%] top-[40%] h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      </div>

      <div className="text-center mb-12 space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-2">
          <span>❓</span>
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
          Quick answers about our Smart Library system to help you get started.
        </p>
      </div>

      <Card className="max-w-4xl w-[92%] md:w-[85%] backdrop-blur-md bg-card/95 shadow-2xl border-2">
        <CardHeader className="pb-6">
          <CardDescription className="text-base md:text-lg">
            Find answers to common questions below
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enhanced Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions (issue, renew, fine, ...)"
              className="pl-11 pr-4 h-12 border-2 focus:border-primary transition-all"
            />
          </div>

          {/* Enhanced Accordion */}
          <Accordion type="single" collapsible className="rounded-xl border-2 bg-background/50">
            {filteredFaqs.map(({ icon: Icon, question, answer }, idx) => (
              <AccordionItem
                key={idx}
                value={question}
                className="group px-3 transition-all data-[state=open]:bg-primary/5 border-b last:border-b-0"
              >
                <AccordionTrigger className="group relative gap-3 px-3 md:px-4 py-5 hover:bg-muted/40 rounded-lg transition-all">
                  {/* Enhanced left accent when open */}
                  <span className="pointer-events-none absolute left-0 top-1/2 h-8 -translate-y-1/2 rounded-r-full bg-primary opacity-0 transition-all duration-300 group-data-[state=open]:opacity-100 group-data-[state=open]:w-1.5" />
                  
                  <span className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-data-[state=open]:bg-primary/20 transition-all">
                      <Icon className="size-5 text-primary transition-all duration-300 group-data-[state=open]:scale-110 group-data-[state=open]:rotate-6" />
                    </div>
                    <span className="text-base md:text-lg font-semibold tracking-tight text-left">
                      {question}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-4 md:px-6 pb-5 pt-2">
                  <div className="pl-11 text-base leading-relaxed">
                    {answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-lg font-medium">No results found.</p>
                <p className="text-sm mt-1">Try a different keyword.</p>
              </div>
            )}
          </Accordion>

          {/* Enhanced CTA */}
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border-2 bg-gradient-to-br from-primary/5 to-transparent p-6 text-center md:flex-row md:text-left shadow-lg hover:shadow-xl transition-all">
            <div className="space-y-1">
              <p className="font-bold text-lg">Still have questions?</p>
              <p className="text-sm text-muted-foreground">
                We&apos;re here to help you get the most out of our library system.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button variant="outline" asChild className="shadow-sm hover:shadow-md transition-all">
                <a href="#">Contact Support</a>
              </Button>
              <Button asChild className="shadow-md hover:shadow-lg transition-all">
                <a href="#features">Explore Features</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FAQSection;
