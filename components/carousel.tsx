"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode[];
  gap?: string;
  className?: string;
  showArrows?: boolean;
}

export function Carousel({ children, gap = "gap-4", className = "", showArrows = true }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, clientWidth } = containerRef.current;
        const index = Math.round(scrollLeft / clientWidth);
        setActiveIndex(index);
      }
    };
    containerRef.current?.addEventListener("scroll", handleScroll);
    return () => containerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (index: number) => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      containerRef.current.scrollTo({ left: clientWidth * index, behavior: "smooth" });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className={`flex overflow-x-auto snap-x snap-mandatory hide-scrollbar ${gap}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children.map((child, index) => (
          <div key={index} className="snap-start shrink-0 flex-none w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)]">
            {child}
          </div>
        ))}
      </div>

      {showArrows && children.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            className="w-10 h-10 rounded-full bg-sacredCream border border-antiqueGold flex items-center justify-center text-earthBrown hover:bg-saffron hover:text-sacredCream hover:border-saffron transition shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-2">
            {children.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex ? "bg-saffron w-6" : "bg-antiqueGold/40 hover:bg-saffron/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => scrollTo(Math.min(children.length - 1, activeIndex + 1))}
            className="w-10 h-10 rounded-full bg-sacredCream border border-antiqueGold flex items-center justify-center text-earthBrown hover:bg-saffron hover:text-sacredCream hover:border-saffron transition shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
