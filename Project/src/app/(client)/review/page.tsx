"use client";
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const ReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const reviews = [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Directrice Marketing",
      company: "TechCorp",
      rating: 4,
      text: "Une expérience exceptionnelle ! L'équipe a dépassé toutes nos attentes. Le service client est remarquable et les résultats parlent d'eux-mêmes.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5cc?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Alexandre Dubois",
      role: "CEO",
      company: "InnovateLab",
      rating: 5,
      text: "Professionnalisme et créactivité au rendez-vous. Nous avons vu une amélioration de 300% de notre ROI grâce à leur expertise.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Marie Leroy",
      role: "Fondatrice",
      company: "StartupVision",
      rating: 4,
      text: "L'accompagnement a été parfait du début à la fin. Une équipe réactive, compétente et à l'écoute de nos besoins spécifiques.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Thomas Bernard",
      role: "CTO",
      company: "DevSolutions",
      rating: 5,
      text: "Innovation et excellence technique. Ils ont transformé notre vision en réalité avec une approche moderne et efficace.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Camille Rousseau",
      role: "Responsable Produit",
      company: "DigitalFlow",
      rating: 5,
      text: "Résultats au-delà de nos espérances. Une collaboration fluide et des livrables de qualité exceptionnelle. Je recommande vivement !",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const goToReview = (index) => {
    setCurrentReview(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="relative py-16 bg-white">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-50 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-50 rounded-full opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Témoignages clients
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de nos services
          </p>
        </div>

        {/* Reviews Container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Review Card */}
            <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 transition-all duration-500 hover:shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 shadow-md">
                    <img
                      src={reviews[currentReview].avatar}
                      alt={reviews[currentReview].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Quote className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Stars */}
                  <div className="flex justify-center md:justify-start mb-4">
                    {renderStars(reviews[currentReview].rating)}
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed mb-4 font-medium">
                    "{reviews[currentReview].text}"
                  </blockquote>

                  {/* Author Info */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {reviews[currentReview].name}
                    </h4>
                    <p className="text-gray-600">
                      {reviews[currentReview].role} • {reviews[currentReview].company}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevReview}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextReview}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 gap-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReview
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-gray-600 font-medium">Clients satisfaits</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <p className="text-gray-600 font-medium">Note moyenne</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                98%
              </div>
              <p className="text-gray-600 font-medium">Recommandations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;