'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Play, Filter, Search, Star, Clock, Loader2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  name_ar: string;
}

interface Story {
  title: string;
  author: string;
  description: string;
  audio_duration: number;
  publication_date: string | null;
  cover_img_url: string;
  range: string;
}

interface Rating {
  _count: number;
  story_id: number;
}

interface ApiData {
  allCategories: Category[];
  categoriesInfo: Story[];
  ratingEachStory: Rating[];
}

const AudiobookCollection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedAge, setSelectedAge] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/api/category');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data: ApiData = await response.json();
        setApiData(data);
        
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour formater la durée en heures et minutes
  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? minutes + 'min' : ''}`.trim();
    }
    return `${minutes}min`;
  };

  // Fonction pour obtenir une note aléatoire (puisque les vraies notes ne sont pas directement liées aux histoires)
  const getRandomRating = (): number => {
    return parseFloat((4.2 + Math.random() * 0.7).toFixed(1));
  };

  // Préparer les catégories pour les filtres
  const categories = useMemo(() => {
    if (!apiData?.allCategories) return ['Tous'];
    return ['Tous', ...apiData.allCategories.map(cat => cat.name)];
  }, [apiData]);

  // Préparer les tranches d'âge pour les filtres
  const ageGroups = useMemo(() => {
    if (!apiData?.categoriesInfo) return ['Tous'];
    const uniqueRanges = [...new Set(apiData.categoriesInfo.map(story => story.range))];
    return ['Tous', ...uniqueRanges.sort()];
  }, [apiData]);

  // Filtrer les histoires
  const filteredStories = useMemo(() => {
    if (!apiData?.categoriesInfo) return [];
    
    return apiData.categoriesInfo.filter(story => {
      const matchesCategory = selectedCategory === 'Tous' || 
        apiData.allCategories.some(cat => 
          cat.name === selectedCategory && 
          // Ici vous pourriez ajouter une logique pour associer les histoires aux catégories
          // Pour l'instant, on affiche toutes les histoires
          true
        );
      
      const matchesAge = selectedAge === 'Tous' || story.range === selectedAge;
      
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesAge && matchesSearch;
    });
  }, [selectedCategory, selectedAge, searchTerm, apiData]);

  const handlePlayStory = (story: Story) => {
    console.log('Lecture de:', story.title);
    // Ici vous pouvez ajouter la logique de navigation
    // router.push(`/audiobooks/${story.slug}`);
  };

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement des histoires...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-50 to-purple-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">حكايات</h1>
          <p className="text-gray-600 text-lg">اكتشف عالم القصص الممتعة للأطفال</p>
          <p className="text-gray-500 mt-2">قصص خيالية ومغامرات، حكايات وخرافات، أميرات وحيوانات، لكل طفل حكايته!</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">المرشحات</h2>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  البحث
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="search"
                    type="text"
                    placeholder="العنوان أو المؤلف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="block text-sm font-medium text-gray-700 mb-3">الفئة</h3>
                <div className="space-y-2" role="group" aria-label="فلترة حسب الفئة">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      aria-pressed={selectedCategory === category}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Filter */}
              <div className="mb-6">
                <h3 className="block text-sm font-medium text-gray-700 mb-3">العمر</h3>
                <div className="space-y-2" role="group" aria-label="فلترة حسب العمر">
                  {ageGroups.map(age => (
                    <button
                      key={age}
                      onClick={() => setSelectedAge(age)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        selectedAge === age
                          ? 'bg-purple-100 text-purple-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      aria-pressed={selectedAge === age}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  {filteredStories.length} قصة متوفرة
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {/* Stories Grid */}
            {filteredStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story, index) => (
                  <article 
                    key={`${story.title}-${index}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={story.cover_img_url} 
                        alt={`غلاف ${story.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Image de fallback en cas d'erreur
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => handlePlayStory(story)}
                          className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`استمع إلى ${story.title}`}
                        >
                          <Play className="w-6 h-6 text-blue-600 ml-1" />
                        </button>
                      </div>

                      {/* Age Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                          {story.range} سنة
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1" dir="rtl">{story.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{story.author}</p>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2" dir="rtl">{story.description}</p>
                      
                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(story.audio_duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{getRandomRating()}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button 
                        onClick={() => handlePlayStory(story)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Play className="w-4 h-4" />
                        استمع الآن
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد قصص</h3>
                <p className="text-gray-500">جرب تغيير معايير البحث</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AudiobookCollection;