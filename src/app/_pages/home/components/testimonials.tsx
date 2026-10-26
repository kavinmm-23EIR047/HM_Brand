"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Star,
  ExternalLink,
  PenLine,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=hm+brand+agarbatti+coimbatore#lrd=0x3ba85943940a4a09:0x4047f1c565b08b5b,1,,,,";

const GOOGLE_WRITE_REVIEW_URL =
  "https://www.google.com/search?q=hm+brand+agarbatti+coimbatore#lrd=0x3ba85943940a4a09:0x4047f1c565b08b5b,3,,,,";

const REVIEWS = [
  {
    name: "Thenmoli",
    badge: "Local Guide · 26 reviews",
    time: "4 months ago",
    rating: 5,
    text: "I randomly picked up HM Agarbattis at a supermarket, and I am so glad I did! The fragrance is absolutely wonderful, and they have a fantastic variety of scents to choose from.",
    initials: "TH",
    color: "bg-[#2563EB]",
  },
  {
    name: "Skandha Priya",
    badge: "4 reviews",
    time: "5 months ago",
    rating: 5,
    text: "This is my second bulk purchase with HM brand. I bought champa, kesar loban, javadu flavoured agarbattis. Their camphor is pure and good which led me to do a second purchase. Kesar loban is a must try product.",
    initials: "SK",
    color: "bg-[#DC2626]",
  },
  {
    name: "Aravindan KP",
    badge: "5 reviews",
    time: "4 months ago",
    rating: 5,
    text: "Very good fragrance and makes the whole house feel like a temple. Gives very much positive vibration.",
    initials: "AR",
    color: "bg-[#16A34A]",
  },
  {
    name: "Venkataramani K",
    badge: "3 reviews · 1 photo",
    time: "5 months ago",
    rating: 5,
    text: "Their products are so good and it creates a heavenly atmosphere at home. Affordable too. Best aroma!",
    initials: "VK",
    color: "bg-[#F59E0B]",
  },
  {
    name: "Shreevishnu Ponraj",
    badge: "8 reviews",
    time: "2 years ago",
    rating: 5,
    text: "The only brand that gives a 10-in-1 pack. The fragrance was very nice.",
    initials: "SH",
    color: "bg-[#9333EA]",
  },
];

function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="Google"
      role="img"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GoogleStars({ size = 17 }: { size?: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={1.5}
          className="fill-[#FBBC05] text-[#FBBC05]"
        />
      ))}
    </div>
  );
}

// 5 cloned sets for a seamless infinite loop buffer:
// Set 0: 0..4
// Set 1: 5..9
// Set 2: 10..14 (base set, starting center is 12 -> Review 2 / Aravindan KP)
// Set 3: 15..19
// Set 4: 20..24
const SET_COUNT = 5;
const REVIEWS_COUNT = REVIEWS.length;
const BASE_SET_INDEX = 2;
const INITIAL_INDEX = BASE_SET_INDEX * REVIEWS_COUNT + 2; // 12 (Aravindan KP)
const ALL_CARDS = Array.from({ length: SET_COUNT }, () => REVIEWS).flat();

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [withTransition, setWithTransition] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const startTimeRef = useRef(0);
  const wasDraggingRef = useRef(false);

  const [dimensions, setDimensions] = useState({
    containerWidth: 0,
    cardWidth: 320,
    gap: 24,
  });

  const updateDimensions = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const firstCard = trackRef.current.children[0] as HTMLElement | undefined;
    if (!firstCard) return;

    // Use offsetWidth to get the true unscaled layout width of the card
    const cardWidth = firstCard.offsetWidth || 320;

    const style = window.getComputedStyle(trackRef.current);
    const gap = parseFloat(style.columnGap || style.gap) || 24;

    setDimensions({ containerWidth, cardWidth, gap });
  }, []);

  useEffect(() => {
    setMounted(true);
    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  // Re-enable CSS transition after an invisible boundary reset
  useEffect(() => {
    if (!withTransition) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setWithTransition(true);
        });
        rafRef.current = raf2;
      });
      return () => {
        cancelAnimationFrame(raf1);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [withTransition]);

  // Seamless invisible jump when reaching the outer buffer sets
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;

    if (currentIndex >= (BASE_SET_INDEX + 1) * REVIEWS_COUNT) {
      const shift =
        Math.floor((currentIndex - BASE_SET_INDEX * REVIEWS_COUNT) / REVIEWS_COUNT) *
        REVIEWS_COUNT;
      const normalized = currentIndex - shift;
      setWithTransition(false);
      setCurrentIndex(normalized);
    } else if (currentIndex < BASE_SET_INDEX * REVIEWS_COUNT) {
      const shift =
        Math.ceil((BASE_SET_INDEX * REVIEWS_COUNT - currentIndex) / REVIEWS_COUNT) *
        REVIEWS_COUNT;
      const normalized = currentIndex + shift;
      setWithTransition(false);
      setCurrentIndex(normalized);
    }
  };

  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pauseTemporarily = useCallback((ms = 4500) => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, ms);
  }, []);

  // Autoslide effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setWithTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = useCallback(() => {
    pauseTemporarily(4500);
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, [pauseTemporarily]);

  const handlePrevious = useCallback(() => {
    pauseTemporarily(4500);
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, [pauseTemporarily]);

  const handleDotClick = useCallback(
    (targetReviewIndex: number) => {
      pauseTemporarily(4500);
      const currentReviewIndex =
        ((currentIndex % REVIEWS_COUNT) + REVIEWS_COUNT) % REVIEWS_COUNT;
      let diff = targetReviewIndex - currentReviewIndex;
      if (diff > 2) diff -= REVIEWS_COUNT;
      if (diff < -2) diff += REVIEWS_COUNT;
      if (diff !== 0) {
        setWithTransition(true);
        setCurrentIndex((prev) => prev + diff);
      }
    },
    [currentIndex, pauseTemporarily]
  );

  const handleCardClick = useCallback(
    (cardIndex: number) => {
      if (cardIndex === currentIndex) return;
      pauseTemporarily(4500);
      setWithTransition(true);
      setCurrentIndex(cardIndex);
    },
    [currentIndex, pauseTemporarily]
  );

  // Drag / Swipe handlers with vertical scroll discrimination
  const onDragStart = (clientX: number, clientY?: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startYRef.current = clientY ?? 0;
    startTimeRef.current = Date.now();
    wasDraggingRef.current = false;
    isHorizontalSwipe.current = null;
    setDragOffset(0);
  };

  const onDragMove = (clientX: number, clientY?: number) => {
    if (!isDraggingRef.current) return;

    if (clientY !== undefined && isHorizontalSwipe.current === null) {
      const deltaX = Math.abs(clientX - startXRef.current);
      const deltaY = Math.abs(clientY - startYRef.current);
      if (deltaX > 8 || deltaY > 8) {
        isHorizontalSwipe.current = deltaX >= deltaY;
      }
    }

    if (isHorizontalSwipe.current === false) return;

    const delta = clientX - startXRef.current;
    if (Math.abs(delta) > 5) {
      wasDraggingRef.current = true;
    }
    setDragOffset(delta);
  };

  const onDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (isHorizontalSwipe.current !== false) {
      const elapsed = Date.now() - startTimeRef.current;
      const threshold = Math.max(dimensions.cardWidth * 0.18, 40);
      const isQuickFlick = elapsed < 280 && Math.abs(dragOffset) > 20;

      if (dragOffset < -threshold || (isQuickFlick && dragOffset < 0)) {
        handleNext();
      } else if (dragOffset > threshold || (isQuickFlick && dragOffset > 0)) {
        handlePrevious();
      }
    }

    setDragOffset(0);
    isHorizontalSwipe.current = null;

    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 120);
  };

  const activeReviewIndex =
    ((currentIndex % REVIEWS_COUNT) + REVIEWS_COUNT) % REVIEWS_COUNT;

  const baseOffset =
    dimensions.containerWidth > 0
      ? (dimensions.containerWidth - dimensions.cardWidth) / 2
      : 0;
  const cardStep = dimensions.cardWidth + dimensions.gap;
  const translateX = baseOffset - currentIndex * cardStep + dragOffset;

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FAF7F2] py-12 sm:py-14 lg:py-16"
      aria-label="Customer testimonials"
    >
      {/* Subtle background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#7E1D2D]/[0.025] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FBBC05]/[0.04] blur-3xl"
      />

      {/* Full-width content */}
      <div className="relative mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* ================= HEADER ================= */}
        <div className="relative mb-8 text-center sm:mb-10 lg:mb-12">
          {/* Google badge */}
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm">
            <GoogleLogo size={21} />

            <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-neutral-700 sm:text-xs">
              Google Reviews
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-brand text-2xl font-bold uppercase leading-tight tracking-wide text-[#7E1D2D] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[52px]">
            What Our Customers Say
          </h2>

          {/* Rating */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <GoogleStars size={20} />

            <span className="text-base font-bold text-neutral-900 sm:text-lg">
              5.0
            </span>

            <span className="hidden h-5 w-px bg-neutral-300 sm:block" />

            <span className="text-xs text-neutral-500 sm:text-sm md:text-base">
              Verified Google Reviews
            </span>
          </div>

          <p className="mt-2.5 text-sm text-neutral-500 sm:text-base">
            Real experiences from our happy customers
          </p>

          {/* Review actions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 lg:justify-end">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#7E1D2D] px-4 py-2.5 text-sm font-semibold text-[#7E1D2D] transition-colors duration-200 hover:bg-[#7E1D2D]/5 active:scale-[0.98]"
            >
              <ExternalLink size={16} />
              <span>View All Reviews</span>
            </a>

            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#7E1D2D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#681724] active:scale-[0.98]"
            >
              <PenLine size={16} />
              <span>Write a Review</span>
            </a>
          </div>
        </div>

        {/* ================= REVIEW CAROUSEL ================= */}
        <div className="relative">
          {/* Desktop Floating Side Previous Button */}
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous review"
            className="hidden lg:flex absolute left-0 top-1/2 z-20 h-10 w-10 -translate-x-1/4 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-100 bg-white text-[#7E1D2D] shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#7E1D2D] hover:text-white sm:left-1 sm:h-12 sm:w-12 lg:left-2"
          >
            <ChevronLeft size={25} strokeWidth={2} />
          </button>

          {/* Desktop Floating Side Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next review"
            className="hidden lg:flex absolute right-0 top-1/2 z-20 h-10 w-10 translate-x-1/4 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-100 bg-white text-[#7E1D2D] shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#7E1D2D] hover:text-white sm:right-1 sm:h-12 sm:w-12 lg:right-2"
          >
            <ChevronRight size={25} strokeWidth={2} />
          </button>

          {/* Infinite Carousel Container */}
          <div
            ref={containerRef}
            onMouseEnter={() => {
              if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                setIsPaused(true);
              }
            }}
            onMouseLeave={() => {
              if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                setIsPaused(false);
              }
            }}
            className={`relative overflow-hidden w-full ${
              mounted ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            <div
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
              onTouchStart={(e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={onDragEnd}
              onMouseDown={(e) => onDragStart(e.clientX)}
              onMouseMove={(e) => {
                if (isDraggingRef.current) onDragMove(e.clientX);
              }}
              onMouseUp={onDragEnd}
              onMouseLeave={() => {
                if (isDraggingRef.current) onDragEnd();
              }}
              className="flex items-stretch gap-4 sm:gap-5 lg:gap-6 xl:gap-7 py-8 cursor-grab active:cursor-grabbing select-none"
              style={{
                transform: `translateX(${translateX}px)`,
                transition:
                  withTransition && !isDraggingRef.current
                    ? "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)"
                    : "none",
                willChange: "transform",
              }}
            >
              {ALL_CARDS.map((review, index) => {
                const isActive = index === currentIndex;

                return (
                  <div
                    key={`${review.name}-${index}`}
                    onClick={() => {
                      if (wasDraggingRef.current) return;
                      handleCardClick(index);
                    }}
                    className={[
                      "group relative flex shrink-0 cursor-pointer flex-col",
                      "w-[84vw] max-w-[340px] sm:w-[320px] md:w-[340px] lg:w-[290px] xl:w-[320px] 2xl:w-[340px]",
                      "min-h-[330px] sm:min-h-[340px] lg:min-h-[350px]",
                      "rounded-2xl border bg-white p-5 sm:p-6 lg:p-6 xl:p-7",
                      "transition-[transform,opacity,box-shadow,border-color] duration-300 ease-out",
                      isActive
                        ? "z-10 scale-100 border-[#7E1D2D]/20 opacity-100 shadow-[0_18px_50px_rgba(60,30,20,0.12)]"
                        : "scale-[0.95] sm:scale-[0.96] border-neutral-100 opacity-75 hover:opacity-95 shadow-[0_8px_25px_rgba(0,0,0,0.035)]",
                    ].join(" ")}
                    style={{
                      transformOrigin: "center center",
                    }}
                  >
                    {/* Top accent */}
                    <div
                      className={[
                        "absolute left-6 right-6 top-0 h-[3px] rounded-b-full transition-opacity duration-300",
                        isActive
                          ? "bg-[#7E1D2D] opacity-100"
                          : "bg-[#7E1D2D]/20 opacity-70",
                      ].join(" ")}
                    />

                    {/* Quote icon */}
                    <div className="mb-4 flex items-center justify-between">
                      <Quote
                        size={isActive ? 34 : 28}
                        strokeWidth={0}
                        className="fill-[#7E1D2D]/15 text-[#7E1D2D]/15"
                      />

                      <GoogleLogo size={isActive ? 24 : 21} />
                    </div>

                    {/* Review content */}
                    <div className="flex-1">
                      <p
                        className={[
                          "font-normal leading-relaxed text-neutral-700",
                          isActive
                            ? "text-[15px] sm:text-base lg:text-[17px]"
                            : "text-sm sm:text-[15px]",
                        ].join(" ")}
                      >
                        {review.text}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="my-5 h-px w-full bg-neutral-200" />

                    {/* Reviewer */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={[
                            review.color,
                            "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
                            isActive ? "h-12 w-12 text-base" : "h-10 w-10 text-sm",
                          ].join(" ")}
                        >
                          {review.initials}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold capitalize text-neutral-900">
                            {review.name}
                          </h3>

                          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-500 sm:text-xs">
                            {review.badge}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <GoogleStars size={isActive ? 15 : 13} />

                        <span className="whitespace-nowrap text-[10px] text-neutral-500 sm:text-xs">
                          {review.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= PAGINATION & MOBILE ARROWS ================= */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous review"
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#7E1D2D] shadow-xs active:scale-95 transition-all"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2">
            {REVIEWS.map((review, index) => {
              const isDotActive = activeReviewIndex === index;
              return (
                <button
                  key={review.name}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to review ${index + 1}`}
                  aria-current={isDotActive ? "true" : undefined}
                  className={[
                    "h-2.5 rounded-full transition-all duration-300",
                    isDotActive
                      ? "w-8 bg-[#7E1D2D]"
                      : "w-2.5 bg-neutral-300 hover:bg-neutral-400",
                  ].join(" ")}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next review"
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#7E1D2D] shadow-xs active:scale-95 transition-all"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="mt-9 overflow-hidden rounded-2xl border border-[#7E1D2D]/10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.035)] sm:mt-11">
          <div className="flex flex-col items-center justify-center gap-4 px-5 py-6 text-center sm:px-8 lg:flex-row lg:gap-8 lg:py-6">
            {/* CTA message */}
            <div className="flex items-center gap-4">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7E1D2D]/5 text-[#7E1D2D] sm:flex">
                <Quote size={23} />
              </div>

              <div className="text-center lg:text-left">
                <h3 className="font-brand text-lg font-bold text-[#7E1D2D] sm:text-xl">
                  Loved our products?
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-neutral-500 sm:text-base">
                  Help others discover us by sharing your experience on Google.
                </p>
              </div>
            </div>

            {/* Google review button */}
            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#7E1D2D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#681724] hover:shadow-md active:scale-[0.98] sm:w-auto sm:px-6"
            >
              <GoogleLogo size={23} />

              <span>Share Your Experience on Google</span>

              <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
