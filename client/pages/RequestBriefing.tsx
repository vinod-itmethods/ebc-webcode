import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function RequestBriefing() {
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
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Request a Briefing</h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Tell us about your organization's technology strategy and priorities. We'll work with you to design a briefing tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-20 lg:py-28">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-slate-50 border border-border/30 rounded-lg p-12 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Request Form Coming Soon</h2>
              <p className="text-foreground/70">
                The interactive briefing request form is being developed. This form will guide you through:
              </p>
            </div>
            
            <ul className="text-left space-y-3 text-foreground/70 max-w-sm mx-auto">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Your organization's technology priorities</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Current strategic decisions under evaluation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Preferred locations and format</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Technology perspectives you want included</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Your contact information</span>
              </li>
            </ul>

            <p className="text-sm text-foreground/60 pt-4">
              In the meantime, contact us directly to discuss your briefing needs.
            </p>
            
            <Button
              variant="outline"
              className="border-border hover:bg-slate-100"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
