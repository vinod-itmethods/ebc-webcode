import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";

interface AccessRequestForm {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyWebsite?: string;
  description: string;
  expertise: string[];
}

export default function RequestPartnerAccess() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<AccessRequestForm>({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    companyWebsite: "",
    description: "",
    expertise: [],
  });

  const expertiseOptions = [
    "Cloud & Infrastructure",
    "AI & Machine Learning",
    "DevOps & Continuous Delivery",
    "Platform & Architecture",
    "Security & Compliance",
    "Data & Analytics",
    "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExpertiseToggle = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(area)
        ? prev.expertise.filter((item) => item !== area)
        : [...prev.expertise, area],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.companyName || !formData.contactName || !formData.contactEmail || !formData.description) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (formData.expertise.length === 0) {
      setError("Please select at least one area of expertise.");
      setLoading(false);
      return;
    }

    try {
      // Send to API
      const response = await fetch("/api/partner-access-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setSubmitted(true);
    } catch (err) {
      setError("There was an error submitting your request. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Request received</h1>
          <p className="text-lg text-foreground/70 mb-8">
            Thank you for your interest in joining the Executive Briefing Council. We've received your partner access request and will review it shortly.
          </p>
          <p className="text-foreground/60 mb-8">
            We'll be in touch within 1-2 business days with next steps. In the meantime, if you have any questions, feel free to reach out to <span className="font-medium">partners@itmethods.com</span>.
          </p>
          <Button
            asChild
            className="font-semibold px-8 rounded-lg"
          >
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white flex flex-col items-center justify-center p-4 py-12">
      {/* Back Link */}
      <div className="absolute top-4 left-4">
        <Link
          to="/portal"
          className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>

      {/* Hero Header */}
      <div className="w-full max-w-2xl text-center mb-12 mt-8">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Become a partner</h1>
        <p className="text-lg text-foreground/70">
          Interested in joining the Executive Briefing Council? Submit your partner access request below.
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-border p-8 space-y-8">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-foreground mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Your company name"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Company Website */}
            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-semibold text-foreground mb-2">
                Company Website
              </label>
              <Input
                id="companyWebsite"
                name="companyWebsite"
                type="url"
                placeholder="https://example.com"
                value={formData.companyWebsite}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-semibold text-foreground mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="contactName"
                name="contactName"
                type="text"
                placeholder="Your full name"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-semibold text-foreground mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="your@company.com"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-semibold text-foreground mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            {/* Areas of Expertise */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Areas of Expertise <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {expertiseOptions.map((area) => (
                  <label key={area} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.expertise.includes(area)}
                      onChange={() => handleExpertiseToggle(area)}
                      className="w-4 h-4 rounded border-border bg-white cursor-pointer"
                    />
                    <span className="text-sm text-foreground">{area}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-foreground mb-2">
                Tell us about your company and why you're interested <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Share details about your company, your value proposition, and why you believe you'd be a good fit for the Executive Briefing Council..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full min-h-32"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold rounded-lg py-2.5"
            >
              {loading ? "Submitting..." : "Submit partner access request"}
            </Button>
          </form>

          {/* Info Box */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Our team reviews all partner requests carefully to ensure alignment with the Executive Briefing Council's standards for expertise and integrity. We'll get back to you within 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
