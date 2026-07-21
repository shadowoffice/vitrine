"use client";

import { useEffect, useState } from "react";

import { showcaseSlides } from "@/lib/site-content";

export function ProductShowcaseSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = showcaseSlides.length;
  const activeSlide = showcaseSlides[activeIndex] ?? showcaseSlides[0];

  useEffect(() => {
    if (slideCount <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 6200);

    return () => window.clearInterval(interval);
  }, [slideCount]);

  const progress = slideCount > 0 ? ((activeIndex + 1) / slideCount) * 100 : 0;

  if (!activeSlide) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slideCount) % slideCount);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slideCount);
  };

  return (
    <section className="product-slider" aria-label="Démonstration des modules ProJD">
      <div className="slider-copy" aria-live="polite">
        <p className="eyebrow">{activeSlide.kicker}</p>
        <h3>{activeSlide.title}</h3>
        <p>{activeSlide.text}</p>
        <div className="slider-tags" aria-label="Points clés">
          {activeSlide.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="slider-controls">
          <button type="button" onClick={goToPrevious} aria-label="Module précédent">
            ‹
          </button>
          <button type="button" onClick={goToNext} aria-label="Module suivant">
            ›
          </button>
        </div>
      </div>

      <div className={`slider-screen slider-screen-${activeSlide.key}`} aria-hidden="true">
        <div className="screen-toolbar">
          <span>ProJD</span>
          <strong>{activeSlide.kicker}</strong>
        </div>
        <div className="screen-body">
          <div className="screen-metric">
            <span>{activeSlide.metricLabel}</span>
            <strong>{activeSlide.metric}</strong>
          </div>
          <div className="screen-chart">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="screen-list">
            {activeSlide.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="slider-progress">
          <span style={{ width: `${progress}%` }}></span>
        </div>
      </div>

      <div className="slider-tabs" role="tablist" aria-label="Choisir un module">
        {showcaseSlides.map((slide, index) => (
          <button
            aria-selected={index === activeIndex}
            key={slide.key}
            onClick={() => setActiveIndex(index)}
            role="tab"
            type="button"
          >
            {slide.kicker}
          </button>
        ))}
      </div>
    </section>
  );
}
