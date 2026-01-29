import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RequestPartnerAccess() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-20 lg:py-28">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Request partner access</h1>
              <p className="text-lg text-foreground/70">Become a technology partner in the Executive Briefing Council</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Are you a customer?</h2>
              <p className="text-foreground/70">If you'd like to request an executive briefing for your organization, please submit a briefing request instead.</p>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/request-briefing">Submit a briefing request</Link>
              </Button>
            </div>

            <div className="bg-white border border-border rounded-lg p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Partner Information</h2>
              <p className="text-foreground/70">Coming soon - Partner access request form will be available here. Please contact <a href="mailto:partners@itmethods.com" className="text-primary hover:underline font-medium">partners@itmethods.com</a> in the meantime to inquire about partnership opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
