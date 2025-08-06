"use client";
import { useState, useEffect } from "react";
import HeaderSection from "./Home/HeaderSection";
import ChildrenBooksCards from './cards/cards';
import LastReview from './review/page';

export default function Home() {
  const [visibleSections, setVisibleSections] = useState({
    cards: false,
    review: false
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section');
            setVisibleSections(prev => ({
              ...prev,
              [sectionName]: true
            }));
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <HeaderSection />
      
      <div 
        data-section="cards"
        className={`transform transition-all duration-1000 ${
          visibleSections.cards 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-10 opacity-0'
        }`}
      >
        <ChildrenBooksCards />
      </div>
      
      <div 
        data-section="review"
        className={`transform transition-all duration-1000 ${
          visibleSections.review 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-10 opacity-0'
        }`}
      >
        <LastReview />
      </div>
    </div>
  );
}