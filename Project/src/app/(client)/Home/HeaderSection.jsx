"use client"; 
import { BookOpen, Star, Users, Award, Play } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeaderSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [visibleElements, setVisibleElements] = useState({
        testimonial1: false,
        testimonial2: false,
        stats: false,
        decorative: false
    });

    // Images pour la transition
    const images = [
        "/images/bar/freepik_assistant.png",
        "/images/bar/Fille2.jpg",
        "/images/bar/garcon.jpg",
        "/images/bar/Fille3.jpg"
    ];

    // Animation de transition des images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Observer pour les animations au scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const elementId = entry.target.getAttribute('data-animate');
                        if (elementId) {
                            setTimeout(() => {
                                setVisibleElements(prev => ({
                                    ...prev,
                                    [elementId]: true
                                }));
                            }, parseInt(entry.target.getAttribute('data-delay') || 0));
                        }
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
        );

        // Observer tous les éléments animés
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex relative overflow-hidden">
            {/* Particules flottantes d'arrière-plan */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-30 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Left Section - Text Content */}
            <div className="w-1/2 p-12 flex flex-col justify-center relative z-10">
                <div className="max-w-lg">
                    {/* Main Heading avec animation */}
                    <h1 className="text-5xl font-bold text-slate-800 leading-tight mb-6 animate-slide-in-left">
                        Réveillez la 
                        <span className="text-blue-600 block animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                            beauté et l'éclat
                        </span>
                        <span className="text-blue-600 animate-slide-in-left" style={{animationDelay: '0.4s'}}>
                            de vos connaissances
                        </span>
                    </h1>
                    
                    {/* Subtitle avec animation */}
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                        Nous vous proposons diverses méthodes de révision de la tête 
                        aux pieds en utilisant les meilleurs outils, une technologie 
                        avancée et un prix abordable
                    </p>
                    
                    {/* Buttons avec animation */}
                    <div className="flex items-center gap-6 mb-12 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                        <button className="bg-slate-800 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                            Réserver Maintenant
                        </button>
                        <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                                <Play className="w-5 h-5 text-blue-600 ml-1" />
                            </div>
                            <span className="font-medium">Regarder Vidéo</span>
                        </button>
                    </div>
                    
                    {/* Stats Icons Row avec animation décalée */}
                    <div 
                        className={`flex items-center gap-8 transition-all duration-1000 transform ${
                            visibleElements.stats ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                        data-animate="stats"
                        data-delay="0"
                    >
                        {[
                            { icon: BookOpen, number: "15+", label: "Spécialisés", delay: "0s" },
                            { icon: Star, number: "25+", label: "Professionnels", delay: "0.2s" },
                            { icon: Award, number: "100%", label: "Naturel", delay: "0.4s" }
                        ].map((stat, index) => (
                            <div 
                                key={index}
                                className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
                                style={{animationDelay: stat.delay}}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <stat.icon className="w-8 h-8 text-blue-900" />
                                </div>
                                <div className="text-2xl font-bold text-slate-800">{stat.number}</div>
                                <div className="text-gray-500 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Right Section - Testimonials */}
            <div className="w-1/2 relative flex items-center justify-center z-10">
                
                {/* Premier témoignage */}
                <div 
                    className={`absolute top-20 right-8 bg-white rounded-xl p-6 shadow-xl max-w-md transition-all duration-1000 transform ${
                        visibleElements.testimonial1 
                            ? 'translate-x-0 opacity-100 rotate-0' 
                            : 'translate-x-8 opacity-0 rotate-3'
                    } hover:scale-105 hover:shadow-2xl`}
                    data-animate="testimonial1"
                    data-delay="200"
                >
                    <div className="text-3xl font-bold text-blue-600 mb-2">"</div>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                        J'ai un programme régulier pour réviser avec VotreEducation, ils m'offrent 
                        le meilleur service et méthode pour maintenir la beauté et la santé de 
                        mes connaissances
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">S</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-600">Sophie Princeton</p>
                    </div>
                </div>
                
                {/* Deuxième témoignage */}
                <div 
                    className={`absolute bottom-12 left-24 bg-white rounded-xl p-6 shadow-xl max-w-xs transition-all duration-1000 transform ${
                        visibleElements.testimonial2 
                            ? 'translate-x-0 opacity-100 rotate-0' 
                            : 'translate-x-(-8) opacity-0 rotate-(-3)'
                    } hover:scale-105 hover:shadow-2xl`}
                    data-animate="testimonial2"
                    data-delay="600"
                >
                    <div className="text-3xl font-bold text-blue-600 mb-2">"</div>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                        Depuis quelques années, j'avais du mal à trouver le bon endroit 
                        pour réviser mes sujets complexes, jusqu'à ce que je trouve 
                        VotreEducation pour enrichir mes connaissances
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">T</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-600">Tamara Jules</p>
                    </div>
                </div>
                
                {/* Éléments décoratifs animés */}
                <div 
                    className={`transition-all duration-1000 ${
                        visibleElements.decorative ? 'opacity-100' : 'opacity-0'
                    }`}
                    data-animate="decorative"
                    data-delay="1000"
                >
                    <div className="absolute top-16 left-16 w-6 h-6 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-8 h-8 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full animate-bounce"></div>
                    <div className="absolute top-1/2 left-4 w-4 h-4 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full animate-ping"></div>
                </div>
            </div>

            {/* Image centrale avec transition */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                <div className="relative w-96 h-96 rounded-3xl overflow-hidden  shadow-2xl ">
                    {images.map((image, index) => (
                        <img 
                            key={index}
                            src={image} 
                            alt={`Éducation ${index + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform ${
                                currentImageIndex === index 
                                    ? 'opacity-100 scale-100' 
                                    : 'opacity-0 scale-110'
                            }`}
                        />
                    ))}
                    
                    {/* Overlay avec gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                    
                    {/* Indicateurs de navigation */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentImageIndex === index 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }

                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out forwards;
                    opacity: 0;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }

                .animate-float {
                    animation: float linear infinite;
                }
            `}</style>
        </div>
    );
}