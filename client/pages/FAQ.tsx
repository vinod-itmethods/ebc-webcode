import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      id: "who-can-request",
      question: "Who can request a briefing?",
      answer:
        "Executive briefings are designed for senior leaders—CIOs, CTOs, CDOs, heads of engineering, platform, and infrastructure—and cross-functional executive teams making strategic decisions about enterprise technology. Organizations should have clear strategic objectives around AI, DevOps, platform modernization, or infrastructure decisions.",
    },
    {
      id: "how-structured",
      question: "How are briefings structured?",
      answer:
        "Each briefing begins with a pre-alignment session to understand your organization's priorities and challenges. We then design a customized agenda focused on the specific topics and outcomes you want to explore. Briefings typically include presentations and discussions across multiple perspectives, concluding with clear takeaways and next-step considerations. Duration and format are tailored to your needs.",
    },
    {
      id: "partners-selected",
      question: "How are technology partners selected?",
      answer:
        "Technology partners are selected based on their relevance to the specific topics under discussion and your organization's stated interests. We work with partners across the technology ecosystem—cloud providers, infrastructure platforms, DevOps tools, AI/ML providers, and others—to ensure you have access to the broadest perspectives on your decision areas.",
    },
    {
      id: "confidentiality",
      question: "What are confidentiality expectations?",
      answer:
        "All briefing sessions are confidential. Discussions, strategic insights, and participant information remain private. We do not share details about your organization's technology evaluations, strategic priorities, or decision-making processes with other parties. Technology partners participate under strict confidentiality agreements.",
    },
    {
      id: "location-format",
      question: "What location and format options are available?",
      answer:
        "Executive briefings are hosted in select locations (New York, San Francisco, London, Toronto, and Austin) and may be conducted in person or in private virtual settings. We can also accommodate briefings aligned to major industry events and conferences. Contact us to discuss options that work best for your organization.",
    },
    {
      id: "prepare-briefing",
      question: "How should we prepare for a briefing?",
      answer:
        "During the pre-alignment session, we'll gather information about your organization's specific challenges, strategic priorities, and decision criteria. This helps us design the most relevant agenda. Bring key stakeholders who are involved in the decisions under consideration, and be prepared to discuss your priorities, constraints, and timeline for decision-making.",
    },
    {
      id: "cost",
      question: "How much does this event cost?",
      answer:
        "These are no cost sessions for organisations that are confirmed for a briefing. Travel, accommodation and meals are all included.",
    },
    {
      id: "follow-up",
      question: "What happens after the briefing?",
      answer:
        "You'll receive a summary of key takeaways, the trade-offs discussed, and options to consider as you move forward with your decisions. Technology partners are available for follow-up conversations if you want to dive deeper into specific topics or tools.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-white to-blue-50/40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Frequently asked questions</h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Learn more about how the Executive Briefing Council works and how to participate.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 lg:py-28">
        <div className="container max-w-4xl mx-auto px-4">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-slate-50/50 rounded-lg px-6 hover:shadow-sm transition-shadow"
              >
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 text-base leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50/40 via-blue-50/30 to-white">
        <div className="container max-w-2xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            Still have questions?
          </h2>
          <p className="text-foreground/70">
            Contact us to discuss how an Executive Briefing Council can support your organization's strategic decisions.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
