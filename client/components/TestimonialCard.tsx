import { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg p-5 lg:p-6 shadow-sm">
      <p className="text-base lg:text-lg text-foreground/90 leading-relaxed mb-4 italic">
        "{testimonial.quote}"
      </p>
      <p className="text-xs lg:text-sm text-primary font-semibold">
        {testimonial.role}
      </p>
    </div>
  );
}
