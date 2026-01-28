import { ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialControlsProps {
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

export default function TestimonialControls({
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  onDotClick,
}: TestimonialControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left Arrow */}
      <button
        onClick={onPrevious}
        className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-foreground"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Indicator Dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-6 h-2"
                : "bg-slate-300 hover:bg-slate-400 w-2 h-2"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={onNext}
        className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-foreground"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}
