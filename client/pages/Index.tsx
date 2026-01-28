import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Users, CheckCircle2, MapPin, Cloud, Lightbulb, GitBranch, Shield, Database, Box, X } from "lucide-react";
import PartnerCarousel from "@/components/PartnerCarousel";
import { useState } from "react";

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO SECTION */}
      <section className="relative py-24 lg:py-40 overflow-hidden" style={{
        background: `
          linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.12) 30%, rgba(168, 85, 247, 0.10) 60%, rgba(20, 184, 166, 0.10) 100%),
          linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)
        `
      }}>

        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-[1.15]">
              <span className="block">Executive briefings for</span>
              <span className="block">enterprise technology leaders</span>
            </h1>
            <p className="text-lg lg:text-xl text-foreground/85 max-w-3xl mx-auto leading-relaxed">
              <span className="block">Confidential, curated briefings that help AI, DevOps, and IT leaders</span>
              <span className="block">navigate complex technology decisions beyond a single vendor's perspective</span>
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
              <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                <p>
                  The Executive Briefing Council is a structured forum designed for enterprise technology and business leaders navigating high-impact decisions across AI, DevOps, cloud, and platform engineering.
                </p>
                <p>
                  Each briefing is curated to the customer's priorities and brings together perspectives from across our vetted technology ecosystem. This gives executive teams the ability to engage with vendors of their choosing, compare strategies, understand trade-offs, and evaluate multiple approaches before committing to a direction.
                </p>
                <p>
                  Sessions are confidential, outcome-driven, and facilitated to support clear decision-making around topics such as AI adoption, DevOps transformation, platform modernization, and operating model evolution.
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
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: 'rgb(59, 130, 246, 0.12)' }}>
                <Briefcase className="w-6 h-6" style={{ color: 'rgb(59, 130, 246)' }} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Enterprise leaders</h3>
              <p className="text-foreground/70 leading-relaxed">
                CIOs, CTOs, CDOs, and senior business and IT leaders responsible for enterprise-wide technology strategy.
              </p>
            </div>

            {/* Active Decision Makers */}
            <div className="bg-white rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: 'rgb(168, 85, 247, 0.12)' }}>
                <CheckCircle2 className="w-6 h-6" style={{ color: 'rgb(168, 85, 247)' }} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Active decision makers</h3>
              <p className="text-foreground/70 leading-relaxed">
                Organizations currently evaluating AI initiatives, DevOps modernization, platform architecture, or infrastructure strategy.
              </p>
            </div>

            {/* Executive Teams */}
            <div className="bg-white rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: 'rgb(20, 184, 166, 0.12)' }}>
                <Users className="w-6 h-6" style={{ color: 'rgb(20, 184, 166)' }} strokeWidth={1.5} />
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
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">Participating technology providers</h2>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Partner Philosophy */}
            <div className="space-y-6 text-lg text-foreground/70 leading-relaxed">
              <p>
                The Executive Briefing Council is not a vendor showcase or a partner-led program. Instead, we provide access to a curated set of technology vendors across the industry, enabling informed, strategic dialogue.
              </p>
              <p>
                Vendors are selected based on relevance to your organization's priorities, depth of domain expertise, ability to discuss ecosystem trade-offs, and commitment to confidentiality. Executive teams engage only with the vendors most aligned to their specific needs and objectives.
              </p>
            </div>

            {/* Partner Categories */}
            <div className="space-y-6">
              <h3 className="text-xl lg:text-2xl font-semibold text-foreground">Areas of Coverage</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    id: "cloud",
                    title: "Cloud & Infrastructure",
                    description: "Cloud providers and infrastructure platforms",
                    details: "We work with leading cloud providers and infrastructure platforms that enable organizations to modernize their data centers, migrate workloads, and scale operations efficiently.",
                    icon: Cloud
                  },
                  {
                    id: "ai",
                    title: "AI & Machine Learning",
                    description: "AI platforms and ML operations",
                    details: "From large language models to specialized ML operations, we connect leaders with vendors who are advancing AI adoption, responsible AI practices, and production ML infrastructure.",
                    icon: Lightbulb
                  },
                  {
                    id: "devops",
                    title: "DevOps & Continuous Delivery",
                    description: "CI/CD platforms and automation",
                    details: "We partner with CI/CD platforms, deployment automation tools, and observability solutions that help teams ship faster and with greater confidence.",
                    icon: GitBranch
                  },
                  {
                    id: "platform",
                    title: "Platform & Architecture",
                    description: "Platform engineering and microservices",
                    details: "Organizations modernizing their architecture benefit from perspectives on platform engineering, microservices patterns, service mesh, and API strategies.",
                    icon: Box
                  },
                  {
                    id: "security",
                    title: "Security & Compliance",
                    description: "Security and governance solutions",
                    details: "Security, compliance, and governance vendors help executives understand threat landscapes, vendor risk management, and regulatory compliance strategies.",
                    icon: Shield
                  },
                  {
                    id: "data",
                    title: "Data & Analytics",
                    description: "Data platforms and analytics",
                    details: "From data warehouses to real-time analytics and business intelligence, we connect leaders with vendors advancing data strategy and analytics maturity.",
                    icon: Database
                  },
                ].map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="text-left bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
                      style={{
                        border: "1px solid",
                        borderColor: "rgba(59, 130, 246, 0.15)",
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(168, 85, 247, 0.02) 50%, rgba(20, 184, 166, 0.02) 100%), white"
                          : "white"
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <IconComponent className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2 text-sm">{category.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{category.description}</p>
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-slate-600 text-sm leading-relaxed">{category.details}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Partner Carousel */}
            <div>
              <PartnerCarousel />
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
            {[
              { name: 'New York', image: 'https://images.pexels.com/photos/8218/pexels-photo.jpg' },
              { name: 'San Francisco', image: 'https://images.pexels.com/photos/10784419/pexels-photo-10784419.jpeg' },
              { name: 'London', image: 'https://images.pexels.com/photos/16129257/pexels-photo-16129257.jpeg' },
              { name: 'Toronto', image: 'https://images.pexels.com/photos/13081827/pexels-photo-13081827.jpeg' },
              { name: 'Austin', image: 'https://images.pexels.com/photos/15525604/pexels-photo-15525604.jpeg' },
              { name: 'Dublin', image: 'https://images.pexels.com/photos/6245462/pexels-photo-6245462.jpeg' }
            ].map((location) => (
              <div key={location.name} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4 text-center">
                  <p className="font-semibold text-foreground">{location.name}</p>
                </div>
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
