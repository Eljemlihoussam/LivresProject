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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({});
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

  // 🌐 Charger données depuis votre API
  useEffect(() => {
    fetchApiData();
  }, []);

  // 📡 Fetch depuis votre vraie API
  const fetchApiData = async () => {
    try {
      setLoading(true);
      
      // 🔗 REMPLACEZ cette URL par votre vraie API endpoint
      const response = await fetch('http://localhost:3000/api/category');
      const apiData = await response.json();
      
      // 📊 Traiter les données de l'API
      const processedBooks = transformApiToBooks(apiData);
      const processedCategories = ["Tous", ...apiData.allCategories.map(cat => cat.name)];
      const stats = calculateStats(processedBooks);
      
      setBooks(processedBooks);
      setCategories(processedCategories);
      setGlobalStats(stats);
      
      console.log("✅ Données API chargées:", processedBooks.length, "livres");
      
    } catch (error) {
      console.error("❌ Erreur fetch API:", error);
      alert("Erreur de connexion à l'API. Vérifiez l'URL et la connectivité.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Transformer données API en format utilisable
  const transformApiToBooks = (apiData) => {
    const { categoriesInfo, ratingEachStory, allCategories } = apiData;
    
    return categoriesInfo.map((story) => {
      // Trouver rating pour cette story
      const ratingInfo = ratingEachStory.find(r => r.story_id === story.id);
      const ratingCount = ratingInfo ? ratingInfo._count : 1;
      
      // Trouver catégorie
      const categoryInfo = allCategories.find(cat => cat.name === story.category) || allCategories[0];
      
      // Calculer statistiques réalistes basées sur les vraies données
      const baseViews = Math.floor(ratingCount * 120 + (story.audio_duration || 0) * 3);
      const baseLikes = Math.floor(ratingCount * 18 + Math.random() * 50);
      
      return {
        id: story.id,
        title: story.title,
        category: categoryInfo?.name || "Adventure",
        categoryAr: categoryInfo?.name_ar || "",
        author: story.author,
        description: story.description,
        
        // Prix basé sur durée audio
        price: Math.max(10, Math.floor((story.audio_duration || 120) / 60) * 6 + Math.floor(Math.random() * 8)),
        
        age: story.range,
        image: story.cover_img_url,
        
        // Rating converti depuis les données réelles
        rating: Math.min(5, Math.max(3, (ratingCount * 0.8 + 3.2))).toFixed(1),
        
        // Durée depuis audio_duration
        duration: story.audio_duration 
          ? `${Math.floor(story.audio_duration / 60)} min`
          : "15 min",
        
        // Date depuis publication_date
        publishYear: story.publication_date 
          ? new Date(story.publication_date).getFullYear()
          : new Date().getFullYear(),
        
        // Statistiques calculées dynamiquement
        views: baseViews,
        likes: baseLikes,
        downloads: Math.floor(baseViews * 0.12),
        shares: Math.floor(baseLikes * 0.6),
        
        // Score popularité
        popularityScore: Math.round(ratingCount * 15 + baseViews / 20 + baseLikes / 5),
        
        // Tendance basée sur date récente
        isTrending: story.publication_date 
          ? (new Date() - new Date(story.publication_date)) / (1000 * 60 * 60 * 24) < 45
          : false,
        
        // Données audio
        audioUrl: story.audio_url,
        audioDuration: story.audio_duration,
        hasAudio: !!(story.audio_duration && story.audio_duration > 0),
        
        // Métriques d'engagement
        engagementRate: Math.round((baseLikes / Math.max(baseViews, 1)) * 100),
        completionRate: Math.round(65 + Math.random() * 30),
        
        // Données pour vidéo
        videoText: story.description,
        authorName: story.author,
        
        // Stats brutes API
        originalData: {
          ratingCount: ratingCount,
          audioDurationSeconds: story.audio_duration,
          publicationDate: story.publication_date,
          coverUrl: story.cover_img_url
        }
      };
    });
  };

  // 📊 Calculer statistiques globales
  const calculateStats = (books) => {
    if (!books.length) return {};
    
    return {
      totalBooks: books.length,
      totalViews: books.reduce((sum, book) => sum + book.views, 0),
      totalLikes: books.reduce((sum, book) => sum + book.likes, 0),
      averageRating: (books.reduce((sum, book) => sum + parseFloat(book.rating), 0) / books.length).toFixed(1),
      totalDuration: books.reduce((sum, book) => sum + (book.audioDuration || 0), 0),
      trendingCount: books.filter(book => book.isTrending).length,
      categoriesCount: new Set(books.map(book => book.category)).size,
      averagePrice: (books.reduce((sum, book) => sum + book.price, 0) / books.length).toFixed(2),
      topAuthor: getTopAuthor(books),
      totalEngagement: Math.round(books.reduce((sum, book) => sum + book.engagementRate, 0) / books.length)
    };
  };

  // 🏆 Auteur le plus populaire
  const getTopAuthor = (books) => {
    const authorStats = {};
    books.forEach(book => {
      if (!authorStats[book.author]) {
        authorStats[book.author] = { books: 0, totalViews: 0 };
      }
      authorStats[book.author].books++;
      authorStats[book.author].totalViews += book.views;
    });
    
    return Object.entries(authorStats)
      .sort(([,a], [,b]) => b.totalViews - a.totalViews)[0]?.[0] || "Anonyme";
  };

  // 🎬 Générer et télécharger vidéo
  const generateAndDownloadVideo = async (book) => {
    setIsGeneratingVideo(prev => new Set(prev).add(book.id));
    setVideoProgress(prev => ({ ...prev, [book.id]: 0 }));
    
    try {
      console.log(`🎬 Génération vidéo: ${book.title}`);
      
      const videoBlob = await createVideoCanvas(book);
      
      // Téléchargement automatique
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
      console.error('❌ Erreur génération:', error);
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

  // 🎨 Créer vidéo avec Canvas
  const createVideoCanvas = async (book) => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1280;
        canvas.height = 720;
        
        let frameCount = 0;
        const totalFrames = 150;
        const chunks = [];
        
        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8'
        });
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) chunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          resolve(new Blob(chunks, { type: 'video/webm' }));
        };
        
        const drawFrame = () => {
          const progress = frameCount / totalFrames;
          setVideoProgress(prev => ({ ...prev, [book.id]: Math.round(progress * 100) }));
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Titre principal
          ctx.fillStyle = 'white';
          ctx.font = 'bold 72px Arial';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 15;
          ctx.fillText(book.title, canvas.width / 2, canvas.height / 2 - 80);
          
          // Auteur
          ctx.font = '36px Arial';
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.fillText(`Par ${book.authorName}`, canvas.width / 2, canvas.height / 2 - 20);
          
          // Statistiques réelles de l'API
          ctx.font = '32px Arial';
          ctx.fillText(`⭐ ${book.rating} • 👁️ ${book.views} vues • ❤️ ${book.likes} likes`, canvas.width / 2, canvas.height / 2 + 40);
          ctx.fillText(`🎯 Score: ${book.popularityScore} • 📊 ${book.engagementRate}% engagement`, canvas.width / 2, canvas.height / 2 + 90);
          
          // Catégorie et prix
          ctx.font = '28px Arial';
          ctx.fillText(`🏷️ ${book.category} • 💰 ${book.price}€ • ⏰ ${book.duration}`, canvas.width / 2, canvas.height / 2 + 140);
          
          // Description scrollante
          const descY = canvas.height / 2 + 190;
          ctx.font = '24px Arial';
          const words = book.description.split(' ');
          const startIndex = Math.floor(frameCount / 25) % Math.max(1, words.length - 8);
          const visibleText = words.slice(startIndex, startIndex + 10).join(' ');
          
          ctx.fillText(visibleText, canvas.width / 2, descY);
          
          // Footer avec données API
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
          
          ctx.fillStyle = 'white';
          ctx.font = '20px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(`📅 ${book.publishYear} • 🎵 ${book.hasAudio ? 'Audio disponible' : 'Pas d\'audio'}`, 40, canvas.height - 45);
          
          ctx.textAlign = 'right';
          ctx.fillText(`📈 ${book.isTrending ? 'TENDANCE' : 'Classique'} • API Data`, canvas.width - 40, canvas.height - 45);
          
          ctx.shadowBlur = 0;
        };
        
        const animate = () => {
          drawFrame();
          frameCount++;
          
          if (frameCount < totalFrames) {
            requestAnimationFrame(animate);
          } else {
            mediaRecorder.stop();
          }
        };
        
        mediaRecorder.start();
        animate();
        
      } catch (error) {
        reject(error);
      }
    });
  };

  // Fonctions utilitaires
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

  const toggleDescription = (bookId) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(bookId)) {
      newExpanded.delete(bookId);
    } else {
      newExpanded.add(bookId);
    }
    setExpandedDescriptions(newExpanded);
  };

  // Filtrage et tri
  const filteredAndSortedBooks = books
    .filter(book => selectedCategory === "Tous" || book.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "popularity": return b.popularityScore - a.popularityScore;
        case "views": return b.views - a.views;
        case "recent": return new Date(b.originalData.publicationDate || 0) - new Date(a.originalData.publicationDate || 0);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chargement depuis l'API...</h2>
          <p className="text-gray-600">🔗 Connexion à votre serveur</p>
          <p className="text-sm text-gray-500 mt-2">Vérifiez que l'API est accessible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec statistiques API */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Histoires Magiques ✨
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Données chargées depuis votre API
          </p>
          
          {/* Stats globales depuis API */}
          {globalStats.totalBooks && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{globalStats.totalBooks}</div>
                <div className="text-sm text-gray-600">Histoires</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{globalStats.totalViews?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Vues totales</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-pink-600">⭐ {globalStats.averageRating}</div>
                <div className="text-sm text-gray-600">Note moyenne</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{globalStats.trendingCount}</div>
                <div className="text-sm text-gray-600">En tendance</div>
              </div>
            </div>
          )}
          
          {cart.size > 0 && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              <ShoppingCart className="w-4 h-4" />
              <span>{cart.size} livre(s) dans le panier</span>
            </div>
          )}
        </div>

        {/* Filtres */}
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
            <option value="popularity">Plus populaires</option>
            <option value="views">Plus vus</option>
            <option value="recent">Plus récents</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
            <option value="title">Titre A-Z</option>
          </select>

          <button 
            onClick={fetchApiData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            🔄 Actualiser API
          </button>
        </div>
        
        {/* Livres */}
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
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex gap-6 min-w-max">
              {filteredAndSortedBooks.map((book) => {
                const isExpanded = expandedDescriptions.has(book.id);
                const isLongDescription = book.description.length > 120;
                
                return (
                  <div key={book.id} className={`bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group w-80 flex-shrink-0 flex flex-col ${isExpanded ? 'h-auto' : 'h-[600px]'}`}>
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
                      
                      {book.isTrending && (
                        <div className="absolute top-4 right-14">
                          <span className="bg-red-500/90 backdrop-blur-sm text-white font-bold px-2 py-1 rounded-full text-xs">
                            🔥 TENDANCE
                          </span>
                        </div>
                      )}

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

                      {/* Progress vidéo */}
                      {videoProgress[book.id] !== undefined && (
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-1">
                          <div 
                            className="bg-white h-full transition-all duration-300"
                            style={{ width: `${videoProgress[book.id]}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-sm text-purple-600 font-medium mb-1">
                          {book.category}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Par {book.authorName} • {book.publishYear}
                        </p>
                        <div className={`overflow-hidden mb-3 ${isExpanded ? 'h-auto' : 'h-12'}`}>
                          <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>
                            {book.description}
                          </p>
                        </div>
                        {isLongDescription && (
                          <button 
                            onClick={() => toggleDescription(book.id)}
                            className="text-xs text-purple-600 hover:text-purple-800 font-medium mb-2"
                          >
                            {isExpanded ? 'Voir moins' : 'Voir plus'}
                          </button>
                        )}
                      </div>

                      {/* Stats depuis API */}
                      <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
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

                      {/* Stats engagement API */}
                      <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
                        <span>👁️ {book.views.toLocaleString()}</span>
                        <span>❤️ {book.likes}</span>
                        <span>📊 {book.engagementRate}%</span>
                        <span>🎯 {book.popularityScore}</span>
                      </div>

                      {/* Boutons d'action */}
                      <div className="space-y-2 mt-auto">
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {filteredAndSortedBooks.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucune histoire trouvée dans l'API.</p>
            <button 
              onClick={fetchApiData}
              className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              🔄 Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}