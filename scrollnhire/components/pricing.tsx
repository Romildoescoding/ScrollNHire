import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full py-20 md:py-32 px-4 lg:px-8 bg-black dark:bg-white relative overflow-hidden"
    >
      {/* <div className="absolute inset-0 -z-10 h-full w-full "></div> */}

      <div className="w-full relative">
        <div className="self-stretch mb-12 px-4 sm:px-6 md:px-8 lg:px-0 w-full dark:border-zinc-200 border-zinc-800 flex justify-center items-center gap-6">
          <div className="w-full px-4 sm:px-6 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
            <div className="w-fit text-center flex justify-center flex-col text-background text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
              <span className=" leading-6 md:leading-10 lg:leading-normal">
                Pricing Plans
              </span>
              <h1 className="font-playfair italic leading-tight text-center">
                {`(early access)`}
              </h1>
            </div>

            {/* <div className="self-stretch text-center text-muted/60 text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
              Explore talent and projects in a smooth, scroll-first experience
              <br />
              that feels natural, fast, and actually enjoyable.
            </div> */}
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="monthly" className="w-full">
            {/* <div className="flex justify-center mb-8">
              <TabsList className="rounded-full p-1">
                <TabsTrigger value="monthly" className="rounded-full px-6">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="annually" className="rounded-full px-6">
                  Annually (Save 20%)
                </TabsTrigger>
              </TabsList>
            </div> */}
            <TabsContent value="monthly">
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                {[
                  {
                    type: "student",
                    name: "Student Plan",
                    price: "$0",
                    description:
                      "If you're a student tired of being reduced to a resume, this is your space.",
                    features: [
                      "Upload reels and showcase real work",
                      "Create and organize project portfolios",
                      "Get insights with reel analytics",
                      "Chat directly with employers",
                      "Join interviews without leaving the platform",
                      // "Smart profile recommendations",
                      // "Real-time updates on views and interactions",
                    ],
                    cta: "Begin the journey",
                  },
                  {
                    type: "employer",
                    name: "Recruiter Plan",
                    price: "$0",
                    description: "Start hiring, no cost.",
                    features: [
                      "Scroll through reels to discover real talent",
                      "View candidate profiles and projects",
                      "Limited chats with candidates",
                      // "Start conversations with candidates",
                      "Save and shortlist promising profiles",
                      "Basic searching and limited filters",
                      // "Explore a curated stream of talent",
                    ],
                    cta: "Start Hiring",
                    popular: true,
                  },
                  {
                    type: "employer",
                    name: "Pro Recruiter Plan",
                    price: "soon",
                    description: "Unlock the full hiring workflow.",
                    features: [
                      "Unlimited chats with candidates",
                      "Advanced filters with Semantic Search",
                      "Manage candidates with a full Kanban pipeline",
                      // "Boost visibility for your posts and opportunities",
                      // "Track engagement with detailed analytics",
                      "Priority access to top talent",
                      "Organize hiring with tags, notes, and workflows",
                    ],
                    cta: "Contact Sales",
                  },
                ].map((plan, i) => (
                  <motion.div
                    key={i}
                    // initial={{ opacity: 0, y: 20 }}
                    // whileInView={{ opacity: 1, y: 0 }}
                    // viewport={{ once: true }}
                    // transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card
                      className={`relative overflow-hidden h-full ${
                        plan.popular
                          ? "dark:border-zinc-600 border-zinc-200 shadow-lg"
                          : "dark:border-zinc-200 border-zinc-800 shadow-md"
                      } bg-gradient-to-b text-white dark:text-black bg-zinc-950 dark:bg-white from-background to-muted/10 backdrop-blur`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-background text-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                          Most Popular
                        </div>
                      )}
                      <CardContent className="p-6 py-0 lg:py-6 flex flex-col h-full">
                        <h3 className="text-3xl md:text-3xl font-semibold font-playfair italic leading-tight">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline mt-4">
                          {plan.price !== "soon" && (
                            <span className="text-xl md:text-2xl font-bold">
                              {plan.price}
                            </span>
                          )}
                          {plan.price === "soon" && (
                            <span className="text-xl md:text-2xl font-semibold">
                              Coming soon
                            </span>
                          )}
                          {plan.price !== "soon" && (
                            <span className="text-muted-foreground ml-1">
                              /month
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm lg:text-base mt-2">
                          {plan.description}
                        </p>
                        <ul className="space-y-3 my-6 flex-grow">
                          {plan.features.map((feature, j) => (
                            <li key={j} className="flex items-center">
                              <div className="min-w-fit mr-2 ">
                                <Check className="size-4 text-background" />
                              </div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={cn(
                            `w-full mt-auto rounded-full`,
                            plan.type === "student"
                              ? "bg-zinc-900 dark:bg-white text-white dark:text-black border dark:border-zinc-200 border-zinc-800"
                              : "bg-zinc-50 dark:bg-black text-black dark:text-white",
                          )}
                          disabled={plan.price === "soon"}
                          // variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.price !== "soon" ? plan.cta : "Coming Soon"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            {/* <TabsContent value="annually">
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                {[
                  {
                    name: "Starter",
                    price: "$23",
                    description: "Perfect for small teams and startups.",
                    features: [
                      "Up to 5 team members",
                      "Basic analytics",
                      "5GB storage",
                      "Email support",
                    ],
                    cta: "Start Free Trial",
                  },
                  {
                    name: "Professional",
                    price: "$63",
                    description: "Ideal for growing businesses.",
                    features: [
                      "Up to 20 team members",
                      "Advanced analytics",
                      "25GB storage",
                      "Priority email support",
                      "API access",
                    ],
                    cta: "Start Free Trial",
                    popular: true,
                  },
                  {
                    name: "Enterprise",
                    price: "$159",
                    description: "For large organizations with complex needs.",
                    features: [
                      "Unlimited team members",
                      "Custom analytics",
                      "Unlimited storage",
                      "24/7 phone & email support",
                      "Advanced API access",
                      "Custom integrations",
                    ],
                    cta: "Contact Sales",
                  },
                ].map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card
                      className={`relative overflow-hidden h-full ${
                        plan.popular
                          ? "border-primary shadow-lg"
                          : "border-border/40 shadow-md"
                      } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                          Most Popular
                        </div>
                      )}
                      <CardContent className="p-6 flex flex-col h-full">
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <div className="flex items-baseline mt-4">
                          <span className="text-4xl font-bold">
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            /month
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-2">
                          {plan.description}
                        </p>
                        <ul className="space-y-3 my-6 flex-grow">
                          {plan.features.map((feature, j) => (
                            <li key={j} className="flex items-center">
                              <Check className="mr-2 size-4 text-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full mt-auto rounded-full ${
                            plan.popular
                              ? "bg-primary hover:bg-primary/90"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
