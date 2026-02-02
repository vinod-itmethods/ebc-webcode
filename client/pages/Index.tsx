import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Users, CheckCircle2, MapPin, Cloud, Lightbulb, GitBranch, Shield, Database, Box, X } from "lucide-react";
import PartnerCarousel from "@/components/PartnerCarousel";
import TestimonialCarousel from "@/components/TestimonialCarousel";
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
              One-day executive briefings for enterprise technology leaders
            </h1>
            <p className="text-lg lg:text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              An in-person session that brings multiple technology perspectives together to help IT leaders build AI, DevOps, and platform strategy. No sales pitches.
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
      <section id="what" className="py-16 lg:py-20 bg-gradient-to-b from-white via-blue-50/40 to-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">Our program</h2>
            <div className="space-y-6 text-lg text-foreground/90 leading-relaxed">
              <p>
                The Executive Briefing Council delivers one-day, in-person executive briefings designed to help enterprise technology and business leaders build and validate IT strategy across AI, DevOps, cloud, and platform engineering.
              </p>
              <p>
                Each briefing is customized to the customer's priorities and brings together multiple technology providers in a single session. Executive teams engage directly with the providers they choose, allowing them to compare approaches, understand trade-offs, and evaluate options before committing to strategic direction. This is not a sales forum, but a structured environment for informed decision-making.
              </p>
              <p>
                Sessions are confidential, outcome-driven, and professionally facilitated, with a focus on helping leadership teams align on technology strategy, operating model decisions, and next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR - Personas with Images (moved from below) */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-blue-50/40 to-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-16">Who it's for</h2>

          <div className="space-y-12">
            {/* Enterprise Leaders - Image Left */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="rounded-lg overflow-hidden shadow-md h-80 md:h-96">
                <img
                  src="https://images.pexels.com/photos/5717626/pexels-photo-5717626.jpeg"
                  alt="Professional businesswoman in a modern office"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Enterprise leaders</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  CIOs, CTOs, CDOs, and senior business and IT leaders responsible for enterprise-wide technology strategy.
                </p>
              </div>
            </div>

            {/* Active Decision Makers - Image Right */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Active decision makers</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Organizations currently evaluating AI initiatives, DevOps modernization, platform architecture, or infrastructure strategy.
                </p>
              </div>
              <div className="order-1 md:order-2 rounded-lg overflow-hidden shadow-md h-80 md:h-96">
                <img
                  src="https://images.pexels.com/photos/5257005/pexels-photo-5257005.jpeg"
                  alt="Diverse team collaborating in a business meeting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Executive Teams - Image Left */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="rounded-lg overflow-hidden shadow-md h-80 md:h-96">
                <img
                  src="https://images.pexels.com/photos/7433824/pexels-photo-7433824.jpeg"
                  alt="Diverse professionals in a strategy meeting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Executive teams</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Cross-functional leadership teams seeking alignment across technology, operations, and business priorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <TestimonialCarousel />

      {/* Program Image - After Testimonials */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="container mx-auto px-4 max-w-2xl lg:max-w-3xl">
          <img
            src="https://images.pexels.com/photos/6949496/pexels-photo-6949496.jpeg"
            alt="Multicultural business executives and professionals discussing strategies in a conference room"
            className="w-full rounded-2xl shadow-lg object-cover aspect-video"
          />
        </div>
      </section>

      {/* HOW THE BRIEFING WORKS SECTION */}
      <section id="how" className="py-16 lg:py-20 bg-gradient-to-b from-white via-purple-50/30 to-blue-50/40">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-16">How the briefing works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1: Choose Your Focus */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-border/10 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-full font-bold mb-6 mx-auto border-2" style={{ borderColor: "hsl(193 45% 45%)", color: "hsl(193 45% 45%)" }}>
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4 text-center">Choose your focus</h3>
              <p className="text-foreground/80 leading-relaxed text-center">
                Select the topics you want to explore, such as AI strategy, DevOps, platform architecture, or operating model decisions.
              </p>
            </div>

            {/* Step 2: Select Technology Perspectives */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-border/10 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-full font-bold mb-6 mx-auto border-2" style={{ borderColor: "hsl(193 45% 45%)", color: "hsl(193 45% 45%)" }}>
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4 text-center">Select technology perspectives</h3>
              <p className="text-foreground/80 leading-relaxed text-center">
                Identify the technology partners and perspectives you want included, based on relevance to your current decisions.
              </p>
            </div>

            {/* Step 3: Set the Session Details */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-border/10 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-full font-bold mb-6 mx-auto border-2" style={{ borderColor: "hsl(193 45% 45%)", color: "hsl(193 45% 45%)" }}>
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4 text-center">Set the session details</h3>
              <p className="text-foreground/80 leading-relaxed text-center">
                Confirm your preferred location, format, and attendees for a single, in-person executive session.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12 flex justify-center">
            <Button
              asChild
              className="px-6 py-2 font-medium rounded-lg"
            >
              <Link to="/partners">
                Select your technology providers
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY PARTNERS SECTION */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-emerald-50/30 to-cyan-50/40">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">Participating technology providers</h2>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Partner Philosophy */}
            <div className="space-y-6 text-lg text-foreground/90 leading-relaxed">
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
                <Link to="/partners">View all technology providers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS SECTION */}
      <section id="locations" className="py-16 lg:py-20 bg-gradient-to-b from-cyan-50/30 via-white to-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">Where briefings take place</h2>
          
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-foreground/90 text-center leading-relaxed">
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
      <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Ready to schedule a briefing?</h2>
          <p className="text-lg text-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
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
