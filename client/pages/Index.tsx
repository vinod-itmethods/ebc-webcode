import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Users, CheckCircle2, MapPin } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO SECTION */}
      <section className="relative py-24 lg:py-40 overflow-hidden bg-white">
        {/* Subtle radial gradient - soft glow behind headline */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: 'radial-gradient(circle at center top, #fff7d6 0%, rgba(249, 231, 168, 0.45) 35%, rgba(255, 255, 255, 0) 70%)'
        }}></div>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-[1.15]">
              <span className="block">Executive briefings for</span>
              <span className="block">enterprise technology leaders</span>
            </h1>
            <p className="text-lg lg:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              <span className="block">Confidential, curated briefings designed to help IT</span>
              <span className="block">and business executives navigate complex decisions</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="font-semibold px-8 rounded-lg"
              >
                <Link to="/request-briefing">Request a briefing</Link>
              </Button>
              <Button
                variant="secondary-outline"
                size="lg"
                className="font-semibold"
                asChild
              >
                <a href="#how">How it works</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
      {/* OUR PROGRAM SECTION */}
      <section id="what" className="py-20 lg:py-28 bg-gradient-to-b from-white via-blue-50/40 to-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Our program</h2>
              <div className="space-y-6 text-lg text-foreground/70 leading-relaxed">
                <p>
                  This Executive Briefing Council is a structured forum where enterprise technology and business leaders engage in focused discussions around strategic technology decisions.
                </p>
                <p>
                  Unlike single-provider executive briefings, sessions are designed to incorporate perspectives from across the technology ecosystem. This allows executive teams to explore options, compare approaches, and understand trade-offs before committing to direction across areas such as AI adoption, DevOps transformation, platform modernization, and operating model change.
                </p>
                <p>
                  Briefings are curated around each organization's priorities and facilitated to support productive, outcome-oriented dialogue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR SECTION */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-blue-50/60 via-teal-50/30 to-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">Who it's for</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Enterprise Leaders */}
            <div className="bg-white rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 icon-neutral-bg">
                <Briefcase className="w-6 h-6 icon-neutral" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Enterprise leaders</h3>
              <p className="text-foreground/70 leading-relaxed">
                CIOs, CTOs, CDOs, and senior business and IT leaders responsible for enterprise-wide technology strategy.
              </p>
            </div>

            {/* Active Decision Makers */}
            <div className="bg-white rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 icon-neutral-bg">
                <CheckCircle2 className="w-6 h-6 icon-neutral" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Active decision makers</h3>
              <p className="text-foreground/70 leading-relaxed">
                Organizations currently evaluating AI initiatives, DevOps modernization, platform architecture, or infrastructure strategy.
              </p>
            </div>

            {/* Executive Teams */}
            <div className="bg-white rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 icon-neutral-bg">
                <Users className="w-6 h-6 icon-neutral" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Executive teams</h3>
              <p className="text-foreground/70 leading-relaxed">
                Cross-functional leadership teams seeking alignment across technology, operations, and business priorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW THE BRIEFING WORKS SECTION */}
      <section id="how" className="py-20 lg:py-28 bg-gradient-to-b from-white via-purple-50/30 to-blue-50/40">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">How the briefing works</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start pb-8 lg:pb-12 border-b border-border/10 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold bg-[hsl(217_13%_46%)]">
                  1
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-foreground mb-3">Pre-brief alignment</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  We work with participating organizations to understand priorities, challenges, and the decisions under consideration.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start pb-8 lg:pb-12 border-b border-border/10 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold bg-[hsl(217_13%_46%)]">
                  2
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-foreground mb-3">Curated agenda</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Each briefing is customized based on the specific topics and outcomes the executive team wants to explore.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start pb-8 lg:pb-12 border-b border-border/10 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold bg-[hsl(217_13%_46%)]">
                  3
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-foreground mb-3">Multi-partner perspectives</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Briefings may include perspectives from multiple technology partners selected for relevance. This enables leaders to compare approaches, surface trade-offs, and ask direct questions across providers in a single forum.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold bg-[hsl(217_13%_46%)]">
                  4
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-foreground mb-3">Outcome focus</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Sessions conclude with clear takeaways, options, and next-step considerations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY PARTNERS SECTION */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-emerald-50/30 to-cyan-50/40">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">Technology partners</h2>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Partner Philosophy */}
            <div className="space-y-6 bg-white rounded-lg p-8 hover:shadow-md transition-shadow">
              <h3 className="text-xl lg:text-2xl font-semibold text-foreground">Our Partner Approach</h3>
              <p className="text-lg text-foreground/70 leading-relaxed">
                The Executive Briefing Council is not a vendor showcase. Instead, we partner with technology leaders across the industry to support informed, strategic dialogue. Partners are selected based on relevance to your organization's priorities, expertise in their domains, their ability to discuss ecosystem trade-offs, and their commitment to confidentiality.
              </p>
            </div>

            {/* Partner Categories */}
            <div className="space-y-6">
              <h3 className="text-xl lg:text-2xl font-semibold text-foreground">Areas of Partnership</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Cloud & Infrastructure", description: "Cloud providers and infrastructure platforms", tint: "warm" },
                  { title: "AI & Machine Learning", description: "AI platforms and ML operations", tint: "cool" },
                  { title: "DevOps & Continuous Delivery", description: "CI/CD platforms and automation", tint: "warm" },
                  { title: "Platform & Architecture", description: "Platform engineering and microservices", tint: "cool" },
                  { title: "Security & Compliance", description: "Security and governance solutions", tint: "warm" },
                  { title: "Data & Analytics", description: "Data platforms and analytics", tint: "cool" },
                ].map((category, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-6 hover:shadow-md transition-shadow ${
                      category.tint === "warm"
                        ? "bg-[hsl(45_82%_52%/4%)]"
                        : "bg-[hsl(217_13%_46%/4%)]"
                    }`}
                  >
                    <h4 className="font-semibold text-foreground mb-2">{category.title}</h4>
                    <p className="text-foreground/70 text-sm">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* View all partners CTA */}
            <div className="text-center">
              <Button
                asChild
                variant="secondary-outline"
              >
                <Link to="/partners">View all technology partners</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS SECTION */}
      <section id="locations" className="py-20 lg:py-28 bg-gradient-to-b from-cyan-50/30 via-white to-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">Where briefings take place</h2>
          
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-foreground/70 text-center leading-relaxed">
              Executive briefings are hosted in select locations and may be conducted in person or in private settings aligned to major industry moments.
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
            {['New York', 'San Francisco', 'London', 'Toronto', 'Austin', 'Dublin'].map((location) => (
              <div key={location} className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3">
                  <MapPin className="w-5 h-5 icon-secondary" strokeWidth={1.5} />
                </div>
                <p className="font-semibold text-foreground">{location}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              asChild
              variant="secondary-outline"
              className="font-semibold"
            >
              <Link to="/request-briefing">Request a briefing in your city<ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* REQUEST A BRIEFING CTA SECTION */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Ready to schedule a briefing?</h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tell us about your organization's priorities and the strategic decisions you're evaluating. We'll work with you to design a briefing tailored to your needs.
          </p>
          <Button
            asChild
            size="lg"
            className="font-semibold px-8 rounded-lg"
          >
            <Link to="/request-briefing">Start your briefing request</Link>
          </Button>
        </div>
      </section>
      </div>

      <Footer />
    </div>
  );
}
