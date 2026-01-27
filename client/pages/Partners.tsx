import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Partners() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Technology Partners</h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Executive Briefings bring perspectives from a broad range of leading technology providers, selected for relevance to each organization's strategic priorities.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 lg:py-28">
        <div className="container max-w-4xl mx-auto px-4 space-y-12">
          {/* Philosophy */}
          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Our Partner Approach</h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              The Executive Briefing Council is not a vendor showcase or sales platform. Instead, we partner with technology leaders across the industry to support informed, strategic dialogue.
            </p>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Partners are selected based on:
            </p>
            <ul className="space-y-3 text-lg text-foreground/70">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>Relevance:</strong> Direct alignment with the topics and decisions your organization is evaluating</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>Expertise:</strong> Deep technical and strategic knowledge in their domains</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>Ecosystem Perspective:</strong> Ability to discuss trade-offs and alternative approaches, not just their own solutions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span><strong>Confidentiality Commitment:</strong> Strict adherence to confidentiality agreements protecting your organization's strategic priorities</span>
              </li>
            </ul>
          </div>

          {/* Partner Categories */}
          <div className="space-y-6 border-t border-border/30 pt-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Areas of Partnership</h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Depending on your briefing's focus, we engage partners across a range of technology domains:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Cloud & Infrastructure", description: "Cloud providers, infrastructure platforms, and modernization services" },
                { title: "AI & Machine Learning", description: "AI platforms, ML operations, and intelligent automation technologies" },
                { title: "DevOps & Continuous Delivery", description: "CI/CD platforms, observability tools, and automation frameworks" },
                { title: "Platform & Architecture", description: "Platform engineering, microservices, and architecture technologies" },
                { title: "Security & Compliance", description: "Security platforms, governance, and risk management solutions" },
                { title: "Data & Analytics", description: "Data platforms, analytics solutions, and data governance tools" },
              ].map((category, index) => (
                <div key={index} className="bg-slate-50/50 rounded-lg border border-border/30 p-6">
                  <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
                  <p className="text-foreground/70 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-border/30 pt-12 text-center space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Ready for a Briefing?</h2>
            <p className="text-lg text-foreground/70">
              When you request a briefing, we'll discuss your priorities and select the most relevant partners to participate.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-lg"
            >
              <Link to="/request-briefing">Request a Briefing</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
