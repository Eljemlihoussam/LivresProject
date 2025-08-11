'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Play, Filter, Search, Star, Clock, Loader2, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext'; // Ajustez le chemin selon votre structure

interface Category {
  id: number;
  name: string;
  name_ar: string;
}

interface Story {
  id: number; 
  title: string;
  author: string;
  description: string;
  audio_duration: number;
  publication_date: string | null;
  cover_img_url: string;
  range: string;
  story_id: number;
  category_id?: number;
  type?: string;
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

  // Utiliser le ThemeContext au lieu de l'état local
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

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

  // Fonction pour obtenir une note aléatoire
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
      // Filtrage par catégorie
      const matchesCategory = selectedCategory === 'Tous' || 
        apiData.allCategories.some(cat => {
          if (cat.name === selectedCategory) {
            return story.category_id === cat.id || 
                   story.type === cat.name || 
                   story.title.toLowerCase().includes(cat.name.toLowerCase());
          }
          return false;
        });
      
      const matchesAge = selectedAge === 'Tous' || story.range === selectedAge;
      
      const matchesSearch = searchTerm === '' || 
                           story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           story.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesAge && matchesSearch;
    });
  }, [selectedCategory, selectedAge, searchTerm, apiData]);

  // Fonction pour rediriger vers la page de détail
  const handlePlayStory = (story: Story) => {
    console.log('Navigation vers la page de détail pour:', story.title, 'ID:', story.id);
    window.location.href = `/audiobook/${story.story_id}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chargement des histoires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Erreur de chargement</h3>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <header className={darkMode ? 'bg-gray-800 py-8 px-6' : 'bg-gradient-to-r from-blue-50 to-purple-50 py-8 px-6'}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>حكايات</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>اكتشف عالم القصص الممتعة للأطفال</p>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>قصص خيالية ومغامرات، حكايات وخرافات، أميرات وحيوانات، لكل طفل حكايته!</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="w-80 flex-shrink-0">
            <div className={`rounded-2xl shadow-lg border p-6 sticky top-8 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>المرشحات</h2>
              </div>
              
              <div className="mb-6">
                <label htmlFor="search" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>الفئة</h3>
                <div className="space-y-2" role="group" aria-label="فلترة حسب الفئة">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        selectedCategory === category
                          ? darkMode 
                            ? 'bg-blue-900 text-blue-200 font-medium'
                            : 'bg-blue-100 text-blue-800 font-medium'
                          : darkMode 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      aria-pressed={selectedCategory === category}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>العمر</h3>
                <div className="space-y-2" role="group" aria-label="فلترة حسب العمر">
                  {ageGroups.map(age => (
                    <button
                      key={age}
                      onClick={() => setSelectedAge(age)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        selectedAge === age
                          ? darkMode 
                            ? 'bg-purple-900 text-purple-200 font-medium'
                            : 'bg-purple-100 text-purple-800 font-medium'
                          : darkMode 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      aria-pressed={selectedAge === age}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filteredStories.length} قصة متوفرة
                </p>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            {filteredStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story, index) => (
                  <article 
                    key={`${story.title}-${index}`}
                    className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border group ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={story.cover_img_url} 
                        alt={`غلاف ${story.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => handlePlayStory(story)}
                          className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`استمع إلى ${story.title}`}
                        >
                          <Play className="w-6 h-6 text-blue-600 ml-1" />
                        </button>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                          {story.range} سنة
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className={`font-bold text-lg mb-1 line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`} dir="rtl">
                        {story.title}
                      </h3>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {story.author}
                      </p>
                      <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} dir="rtl">
                        {story.description}
                      </p>
                      
                      <div className={`flex items-center justify-between text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(story.audio_duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{getRandomRating()}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handlePlayStory(story)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Play className="w-4 h-4" />
                        استمع الآن
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className={`mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  لا توجد قصص
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  جرب تغيير معايير البحث
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AudiobookCollection;