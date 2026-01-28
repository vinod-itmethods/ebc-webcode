import { useState } from "react";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import TestimonialCard from "./TestimonialCard";
import TestimonialControls from "./TestimonialControls";

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
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/40 to-white">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Quote Icon */}
        <div className="flex justify-center mb-8">
          <Quote className="w-12 h-12 text-slate-200" strokeWidth={1.5} />
        </div>

        {/* Headline and Subhead */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            What leaders say after a briefing
          </h2>
          <p className="text-base lg:text-lg text-foreground/90 leading-relaxed">
            Hearing multiple perspectives helps teams align faster, reduce risk, and choose a path that fits their operating reality.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="mb-8">
          <TestimonialCard testimonial={currentTestimonial} />
        </div>

        {/* Controls */}
        <TestimonialControls
          currentIndex={currentIndex}
          totalCount={testimonials.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onDotClick={setCurrentIndex}
        />
      </div>
    </section>
  );
}
