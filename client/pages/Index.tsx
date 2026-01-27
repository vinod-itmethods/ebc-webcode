import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Users, CheckCircle2, MapPin } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO SECTION */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-slate-50/50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-100/20 rounded-full blur-3xl -z-10"></div>
        </div>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Executive Briefings for Enterprise Technology Leaders
            </h1>
            <p className="text-lg lg:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Confidential, curated briefings designed to help IT and business executives navigate complex decisions across AI, DevOps, and modern infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-lg"
              >
                <Link to="/request-briefing">Request a Briefing</Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-primary hover:text-primary/80 font-semibold"
                asChild
              >
                <a href="#how">How It Works</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT THIS IS SECTION */}
      <section id="what" className="py-20 lg:py-28 bg-white border-t border-border/30">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">What This Is</h2>
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
      <section className="py-20 lg:py-28 bg-slate-50/50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">Who It's For</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Enterprise Leaders */}
            <div className="bg-white rounded-lg p-8 border border-border/30 hover:border-border transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Enterprise Leaders</h3>
              <p className="text-foreground/70 leading-relaxed">
                CIOs, CTOs, CDOs, and senior business and IT leaders responsible for enterprise-wide technology strategy.
              </p>
            </div>

            {/* Active Decision Makers */}
            <div className="bg-white rounded-lg p-8 border border-border/30 hover:border-border transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Active Decision Makers</h3>
              <p className="text-foreground/70 leading-relaxed">
                Organizations currently evaluating AI initiatives, DevOps modernization, platform architecture, or infrastructure strategy.
              </p>
            </div>

            {/* Executive Teams */}
            <div className="bg-white rounded-lg p-8 border border-border/30 hover:border-border transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Executive Teams</h3>
              <p className="text-foreground/70 leading-relaxed">
                Cross-functional leadership teams seeking alignment across technology, operations, and business priorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW THE BRIEFING WORKS SECTION */}
      <section id="how" className="py-20 lg:py-28 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">How the Briefing Works</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start pb-8 lg:pb-12 border-b border-border/30 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-semibold">
                  1
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-foreground mb-3">Pre-Brief Alignment</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  We work with participating organizations to understand priorities, challenges, and the decisions under consideration.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start pb-8 lg:pb-12 border-b border-border/30 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-semibold">
                  2
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-foreground mb-3">Curated Agenda</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Each briefing is customized based on the specific topics and outcomes the executive team wants to explore.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start pb-8 lg:pb-12 border-b border-border/30 last:border-b-0">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-semibold">
                  3
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-foreground mb-3">Multi-Partner Perspectives</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Briefings may include perspectives from multiple technology partners selected for relevance. This enables leaders to compare approaches, surface trade-offs, and ask direct questions across providers in a single forum.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full text-white font-semibold">
                  4
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-foreground mb-3">Outcome Focus</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Sessions conclude with clear takeaways, options, and next-step considerations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY PARTNERS SECTION */}
      <section className="py-20 lg:py-28 bg-slate-50/50 border-t border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">Technology Partners</h2>
          
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-foreground/70 text-center leading-relaxed mb-4">
              Briefings may include perspectives from a broad range of leading technology providers, selected based on relevance to the topics under discussion.
            </p>
            <p className="text-lg text-foreground/70 text-center leading-relaxed">
              This is not a vendor showcase. Technology perspectives are included to support informed discussion and provide context for real-world decision-making across the enterprise technology landscape.
            </p>
          </div>

          {/* Logo Carousel */}
          <div className="bg-white rounded-lg border border-border/30 p-8 lg:p-12">
            <div className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap opacity-60 hover:opacity-100 transition-opacity">
              {/* Placeholder logos */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-center h-16 w-32 bg-slate-100 rounded text-slate-400 text-sm font-medium">
                  Partner Logo
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-foreground/50 mt-6">
              Technology partner logos and perspectives to be announced
            </p>
          </div>
        </div>
      </section>

      {/* LOCATIONS SECTION */}
      <section id="locations" className="py-20 lg:py-28 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">Where Briefings Take Place</h2>
          
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-foreground/70 text-center leading-relaxed">
              Executive briefings are hosted in select locations and may be conducted in person or in private settings aligned to major industry moments.
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {['New York', 'San Francisco', 'London', 'Toronto', 'Austin'].map((location) => (
              <div key={location} className="bg-slate-50 rounded-lg border border-border/30 p-6 text-center hover:bg-slate-100 transition-colors">
                <div className="flex justify-center mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground">{location}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              asChild
              variant="ghost"
              className="text-primary hover:text-primary/80 font-semibold"
            >
              <Link to="/request-briefing">Request a briefing in your city <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* REQUEST A BRIEFING CTA SECTION */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 to-slate-50 border-t border-border/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Ready to Schedule a Briefing?</h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tell us about your organization's priorities and the strategic decisions you're evaluating. We'll work with you to design a briefing tailored to your needs.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-lg"
          >
            <Link to="/request-briefing">Start Your Briefing Request</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
