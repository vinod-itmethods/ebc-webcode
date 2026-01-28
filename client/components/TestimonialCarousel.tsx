import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Getting multiple perspectives in one confidential session helped us pressure-test our plan and align on the right path forward—without getting anchored to a single vendor narrative.",
    role: "VP Engineering, Financial Services",
  },
  {
    quote: "We walked in with competing opinions. Hearing different approaches side by side clarified the trade-offs and accelerated alignment across security, platform, and delivery teams.",
    role: "Director, Platform Engineering, Healthcare",
  },
  {
    quote: "The biggest value was speed. We compared architectures and operating models across providers in a single forum and left with a clearer sequence for modernization.",
    role: "Head of Cloud & Infrastructure, Manufacturing",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/40 to-white">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Quote Icon */}
        <div className="flex justify-center mb-12">
          <Quote className="w-16 h-16 text-slate-200" strokeWidth={1.5} />
        </div>

        {/* Headline and Subhead */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            What leaders say after a briefing
          </h2>
          <p className="text-lg text-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Hearing multiple perspectives helps teams align faster, reduce risk, and choose a path that fits their operating reality.
          </p>
        </div>

        {/* Testimonial Card with Navigation */}
        <div className="flex items-center justify-between gap-6 lg:gap-8">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-foreground"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>

          {/* Testimonial */}
          <div className="flex-1 bg-white rounded-xl p-8 lg:p-10 shadow-sm" style={{ borderLeft: "4px solid hsl(45 82% 52%)" }}>
            <p className="text-lg lg:text-xl text-foreground/90 leading-relaxed mb-6">
              "{currentTestimonial.quote}"
            </p>
            <p className="text-sm lg:text-base text-primary font-semibold">
              {currentTestimonial.role}
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-foreground"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
