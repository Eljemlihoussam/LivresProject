"use client";

import { Heart, Star, Clock, BookOpen, ShoppingCart, Filter, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function ChildrenBooksCards() {
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("rating");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(new Set());
  const [videoProgress, setVideoProgress] = useState({});
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 🌐 Récupérer données externes réelles
  useEffect(() => {
    fetchRealExternalData();
  }, []);

  // 📡 Fetch REAL external data sans CORS issues
  const fetchRealExternalData = async () => {
    try {
      setLoading(true);
      
      // 📚 JSONPlaceholder pour contenu
      const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
      const posts = await postsResponse.json();
      
      // 👥 Users pour auteurs
      const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users?_limit=8');
      const users = await usersResponse.json();
      
      // 📸 Images CORS-free depuis Picsum
      const imageBaseUrl = 'https://picsum.photos/400/300?random=';
      
      // 🎵 Audio files libres (sans CORS)
      const freeAudioUrls = [
        'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
        'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
        'https://actions.google.com/sounds/v1/cartoon/pop.ogg',
        'https://actions.google.com/sounds/v1/foley/glass_ping.ogg',
        'https://actions.google.com/sounds/v1/cartoon/voice_wiggle.ogg'
      ];
      
      const categories = [
        "Conte classique", "Aventure fantastique", "Conte traditionnel",
        "Magie et aventure", "Conte de fées", "Histoire moderne",
        "Science-fiction", "Animaux parlants"
      ];
      
      const ageRanges = ["3-6 ans", "6-10 ans", "7-12 ans", "4-8 ans", "5-9 ans", "9-14 ans"];
      const durations = ["15 min", "20 min", "25 min", "30 min", "35 min", "45 min"];
      
      // 🏗️ Construire données finales
      const processedBooks = posts.map((post, index) => {
        const user = users[index] || users[0];
        
        return {
          id: post.id,
          title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
          category: categories[index % categories.length],
          price: Math.floor(Math.random() * 15) + 10,
          age: ageRanges[index % ageRanges.length],
          image: `${imageBaseUrl}${index + 1}`,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1),
          duration: durations[index % durations.length],
          description: post.body.substring(0, 100) + "...",
          // 🎯 MEDIA DATA RÉELLE
          audioUrl: freeAudioUrls[index % freeAudioUrls.length],
          videoText: post.body,
          authorName: user.name,
          authorEmail: user.email,
          publishYear: 2020 + (index % 5),
          // Données additionnelles
          likes: Math.floor(Math.random() * 1000) + 100,
          views: Math.floor(Math.random() * 5000) + 500
        };
      });
      
      setBooks(processedBooks);
      console.log("✅ Données externes chargées:", processedBooks);
      
    } catch (error) {
      console.error("❌ Erreur:", error);
      setBooks(getFallbackBooks());
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Fallback data
  const getFallbackBooks = () => [
    {
      id: 1, title: "Le Petit Prince", category: "Conte classique", price: 15,
      age: "6-10 ans", image: "https://picsum.photos/400/300?random=1", rating: 4.9,
      duration: "30 min", description: "Histoire d'un petit prince voyageur...",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      videoText: "Il était une fois un petit prince...", authorName: "Antoine de Saint-Exupéry"
    }
  ];

  // 🎬 FUNCTION PRINCIPALE - Generate Video SANS CORS
  const generateAndDownloadVideo = async (book) => {
    setIsGeneratingVideo(prev => new Set(prev).add(book.id));
    setVideoProgress(prev => ({ ...prev, [book.id]: 0 }));
    
    try {
      console.log(`🎬 Démarrage génération: ${book.title}`);
      
      // 🎥 Créer vidéo avec Canvas (SANS external image loading)
      const videoBlob = await createVideoWithoutCORS(book);
      
      // 📥 Téléchargement automatique
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_video.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`✅ Vidéo "${book.title}" téléchargée!`);
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setIsGeneratingVideo(prev => {
        const newSet = new Set(prev);
        newSet.delete(book.id);
        return newSet;
      });
      setVideoProgress(prev => {
        const newProg = { ...prev };
        delete newProg[book.id];
        return newProg;
      });
    }
  };

  // 🎨 Créer vidéo SANS CORS (Canvas only)
  const createVideoWithoutCORS = async (book) => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1280;
        canvas.height = 720;
        
        // 🎨 Gradient backgrounds selon catégorie
        const getGradient = (category) => {
          const gradients = {
            "Conte classique": ['#667eea', '#764ba2'],
            "Aventure fantastique": ['#f093fb', '#f5576c'], 
            "Conte traditionnel": ['#4facfe', '#00f2fe'],
            "Magie et aventure": ['#43e97b', '#38f9d7'],
            "Conte de fées": ['#fa709a', '#fee140'],
            "Histoire moderne": ['#a8edea', '#fed6e3']
          };
          return gradients[category] || ['#667eea', '#764ba2'];
        };
        
        const [color1, color2] = getGradient(book.category);
        
        // 🎞️ Animation frames
        let frameCount = 0;
        const totalFrames = 120; // 4 seconds à 30fps
        const chunks = [];
        
        // MediaRecorder setup
        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8'
        });
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };
        
        // 🎨 Draw frame function
        const drawFrame = () => {
          const progress = frameCount / totalFrames;
          setVideoProgress(prev => ({ ...prev, [book.id]: Math.round(progress * 100) }));
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 🌈 Animated gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          const wave = Math.sin(frameCount * 0.05) * 0.3 + 0.7;
          gradient.addColorStop(0, color1 + Math.floor(wave * 255).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, color2);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // ✨ Particules animées
          for (let i = 0; i < 20; i++) {
            const x = (Math.sin(frameCount * 0.02 + i) * 200) + canvas.width / 2;
            const y = (Math.cos(frameCount * 0.03 + i) * 100) + canvas.height / 2;
            const size = Math.sin(frameCount * 0.1 + i) * 3 + 5;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(frameCount * 0.05 + i) * 0.1})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // 📖 Titre principal avec animation
          const titleY = canvas.height / 2 - 100 + Math.sin(frameCount * 0.03) * 10;
          ctx.fillStyle = 'white';
          ctx.font = 'bold 64px Arial';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 20;
          ctx.fillText(book.title, canvas.width / 2, titleY);
          
          // 👤 Auteur
          ctx.font = '32px Arial';
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.fillText(`Par ${book.authorName}`, canvas.width / 2, titleY + 60);
          
          // 🏷️ Catégorie avec background
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillRect(canvas.width / 2 - 150, titleY + 80, 300, 40);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 24px Arial';
          ctx.fillText(book.category, canvas.width / 2, titleY + 105);
          
          // 📝 Texte de l'histoire (scrolling)
          const textY = canvas.height / 2 + 50;
          ctx.font = '24px Arial';
          ctx.fillStyle = 'rgba(255,255,255,0.95)';
          
          const words = book.videoText.split(' ');
          const maxWidth = canvas.width - 200;
          const startIndex = Math.floor(frameCount / 30) % Math.max(1, words.length - 10);
          const visibleText = words.slice(startIndex, startIndex + 15).join(' ');
          
          const lines = wrapText(ctx, visibleText, maxWidth);
          lines.slice(0, 4).forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, textY + (i * 35));
          });
          
          // 📊 Info bar bottom
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
          
          ctx.fillStyle = 'white';
          ctx.font = '20px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(`⭐ ${book.rating} • ${book.duration} • ${book.age}`, 40, canvas.height - 45);
          
          ctx.textAlign = 'right';
          ctx.fillText(`💰 ${book.price}€ • 👁️ ${book.views} vues`, canvas.width - 40, canvas.height - 45);
          
          // 🎬 Watermark
          ctx.textAlign = 'center';
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.fillText('Histoires Magiques ✨ - Généré automatiquement', canvas.width / 2, canvas.height - 15);
          
          ctx.shadowBlur = 0;
        };
        
        // 🚀 Animation loop
        const animate = () => {
          drawFrame();
          frameCount++;
          
          if (frameCount < totalFrames) {
            requestAnimationFrame(animate);
          } else {
            mediaRecorder.stop();
          }
        };
        
        // ▶️ Start recording
        mediaRecorder.start();
        animate();
        
      } catch (error) {
        reject(error);
      }
    });
  };

  // 📝 Helper pour text wrapping
  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    return lines;
  };

  // 📥 Generate text-based video file
  const generateTextVideo = async (book) => {
    const content = `
🎬 VIDÉO GÉNÉRÉE AUTOMATIQUEMENT
=====================================

📖 TITRE: ${book.title}
👤 AUTEUR: ${book.authorName}
🏷️ CATÉGORIE: ${book.category}
⭐ NOTE: ${book.rating}/5
⏰ DURÉE: ${book.duration}
👶 ÂGE: ${book.age}
💰 PRIX: ${book.price}€

📝 HISTOIRE:
${book.videoText}

🎵 AUDIO: ${book.audioUrl}
📸 IMAGE: ${book.image}

📊 STATISTIQUES:
- 👁️ Vues: ${book.views}
- ❤️ Likes: ${book.likes}
- 📅 Année: ${book.publishYear}

✨ Généré par Histoires Magiques
📅 ${new Date().toLocaleString()}
=====================================
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    return blob;
  };

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (id) => {
    const newCart = new Set(cart);
    newCart.add(id);
    setCart(newCart);
  };

  // Scroll functions
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const categories = ["Tous", ...new Set(books.map(book => book.category))];

  const filteredAndSortedBooks = books
    .filter(book => selectedCategory === "Tous" || book.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "title": return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [filteredAndSortedBooks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chargement des histoires...</h2>
          <p className="text-gray-600">📡 Récupération données JSONPlaceholder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Histoires Magiques ✨
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Générateur de vidéos automatique avec données externes
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500 mb-6">
            <span>📡 JSONPlaceholder</span>
            <span>📸 Picsum Photos</span>
            <span>🎵 Audio libre</span>
          </div>
          
          {cart.size > 0 && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              <ShoppingCart className="w-4 h-4" />
              <span>{cart.size} livre(s) dans le panier</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="rating">Mieux notés</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
            <option value="title">Titre A-Z</option>
          </select>

          <button 
            onClick={fetchRealExternalData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            🔄 Recharger données
          </button>
        </div>
        
        {/* Books container */}
        <div className="relative">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
              canScrollLeft ? 'bg-white text-gray-700 hover:bg-gray-50' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-6 h-6 mx-auto" />
          </button>

          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
              canScrollRight ? 'bg-white text-gray-700 hover:bg-gray-50' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-6 h-6 mx-auto" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-6 px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-6 min-w-max">
              {filteredAndSortedBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group min-w-80 flex-shrink-0">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 font-bold px-3 py-1 rounded-full text-sm">
                        {book.price}€
                      </span>
                    </div>

                    <div className="absolute top-4 right-14">
                      <span className="bg-green-500/90 backdrop-blur-sm text-white font-bold px-2 py-1 rounded-full text-xs">
                        📡 LIVE
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleFavorite(book.id)}
                        className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 ${favorites.has(book.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                        />
                      </button>
                    </div>

                    {/* Video Progress */}
                    {videoProgress[book.id] !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-1">
                        <div 
                          className="bg-white h-full transition-all duration-300"
                          style={{ width: `${videoProgress[book.id]}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-purple-600 font-medium mb-1">
                        {book.category}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Par {book.authorName} • {book.publishYear}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {book.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{book.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{book.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{book.age}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <button 
                        onClick={() => addToCart(book.id)}
                        disabled={cart.has(book.id)}
                        className={`w-full font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                          cart.has(book.id)
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        }`}
                      >
                        {cart.has(book.id) ? '✓ Dans le panier' : 'Ajouter au panier'}
                      </button>
                      
                      <button 
                        onClick={() => generateAndDownloadVideo(book)}
                        disabled={isGeneratingVideo.has(book.id)}
                        className={`w-full font-medium py-2 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                          isGeneratingVideo.has(book.id)
                            ? 'bg-orange-400 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                        }`}
                      >
                        {isGeneratingVideo.has(book.id) 
                          ? `⏳ ${videoProgress[book.id] || 0}%` 
                          : '🎬 Générer Vidéo'
                        }
                      </button>
                      
                      <button 
                        onClick={() => {
                          const blob = generateTextVideo(book);
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_data.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger données
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredAndSortedBooks.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucun livre trouvé pour cette catégorie.</p>
          </div>
        )}

        

        
      </div>
    </div>
  );
}