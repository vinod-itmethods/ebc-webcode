import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (isHovering || !scrollContainerRef.current) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const container = scrollContainerRef.current;
        if (!container) return prev;
        
        const newPosition = prev + 1;
        // Reset to 0 when reaching halfway (seamless loop)
        if (newPosition > container.scrollWidth / 2) {
          return 0;
        }
        return newPosition;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isHovering]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-slate-50/40 to-white">
      <div className="container max-w-7xl mx-auto px-4">
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

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            scrollBehavior: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={`testimonial-${index}`}
              className="flex-shrink-0 w-96 bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              style={{
                borderLeft: "4px solid hsl(45 82% 52%)",
              }}
            >
              <p className="text-foreground/90 leading-relaxed mb-6 text-lg">
                "{testimonial.quote}"
              </p>
              <p className="text-sm text-primary font-semibold">
                {testimonial.role}
              </p>
            </div>
          ))}
        </div>

        {/* Hint text */}
        <p className="text-center text-xs text-foreground/50 mt-6">
          Hover to pause • Swipe to scroll
        </p>
      </div>
    </section>
  );
}
