import { useEffect, useRef } from "react";
import { partners } from "@/data/partners";

interface PartnerCarouselProps {
  selectedCategory?: string | null;
}

export default function PartnerCarousel({ selectedCategory }: PartnerCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter partners based on selected category
  const filteredPartners = selectedCategory
    ? partners.filter(partner => partner.categories.includes(selectedCategory as any))
    : partners;

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    let animationFrameId: number;

    const scroll = () => {
      scrollPosition += 1;
      
      // Reset to start when reaching the end
      if (scrollPosition > scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="mb-8">
      <div
        ref={scrollContainerRef}
        className="flex gap-8 overflow-hidden"
        style={{
          scrollBehavior: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Render partners twice to create seamless loop */}
        {[...filteredPartners, ...filteredPartners].map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: "240px", height: "120px" }}
          >
            <img
              src={partner.logo}
              alt={partner.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              className="opacity-60 hover:opacity-100 transition-opacity"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
