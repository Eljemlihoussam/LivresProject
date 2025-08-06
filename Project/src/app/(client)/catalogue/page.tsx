'use client';

import React, { useState, useMemo } from 'react';
import { Play, Filter, Search, Star, Clock } from 'lucide-react';

interface Audiobook {
  id: number;
  title: string;
  author: string;
  duration: string;
  age: string;
  category: string;
  rating: number;
  image: string;
  language: string;
  description: string;
  slug: string;
}

const AudiobookCollection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedAge, setSelectedAge] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const audiobooks: Audiobook[] = [
    {
      id: 1,
      title: "Le Petit Prince",
      author: "Antoine de Saint-Exupéry",
      duration: "2h 15min",
      age: "6-10 ans",
      category: "Classique",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      language: "Français",
      description: "L'histoire intemporelle d'un petit prince voyageant entre les planètes.",
      slug: "le-petit-prince"
    },
    {
      id: 2,
      title: "Alice au Pays des Merveilles",
      author: "Lewis Carroll",
      duration: "3h 30min",
      age: "8-12 ans",
      category: "Fantastique",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      language: "Français",
      description: "Suivez Alice dans son incroyable aventure au pays des merveilles.",
      slug: "alice-au-pays-des-merveilles"
    },
    {
      id: 3,
      title: "Les Trois Petits Cochons",
      author: "Conte traditionnel",
      duration: "45min",
      age: "3-6 ans",
      category: "Conte",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      language: "Français",
      description: "Le célèbre conte des trois petits cochons et du grand méchant loup.",
      slug: "les-trois-petits-cochons"
    },
    {
      id: 4,
      title: "Harry Potter à l'École des Sorciers",
      author: "J.K. Rowling",
      duration: "8h 45min",
      age: "10-15 ans",
      category: "Fantastique",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
      language: "Français",
      description: "Découvrez le monde magique de Harry Potter et Poudlard.",
      slug: "harry-potter-ecole-sorciers"
    },
    {
      id: 5,
      title: "La Belle et la Bête",
      author: "Jeanne-Marie Leprince de Beaumont",
      duration: "1h 20min",
      age: "5-9 ans",
      category: "Conte",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1602722053020-af31042989d5?w=300&h=400&fit=crop",
      language: "Français",
      description: "L'histoire d'amour entre Belle et la Bête enchantée.",
      slug: "la-belle-et-la-bete"
    },
    {
      id: 6,
      title: "Le Livre de la Jungle",
      author: "Rudyard Kipling",
      duration: "4h 10min",
      age: "7-11 ans",
      category: "Aventure",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop",
      language: "Français",
      description: "Les aventures de Mowgli dans la jungle avec Baloo et Bagheera.",
      slug: "le-livre-de-la-jungle"
    },
    {
      id: 7,
      title: "Cendrillon",
      author: "Charles Perrault",
      duration: "1h 15min",
      age: "4-8 ans",
      category: "Conte",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      language: "Français",
      description: "L'histoire magique de Cendrillon et de sa pantoufle de verre.",
      slug: "cendrillon"
    },
    {
      id: 8,
      title: "Robinson Crusoé",
      author: "Daniel Defoe",
      duration: "6h 30min",
      age: "9-13 ans",
      category: "Aventure",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
      language: "Français",
      description: "Les aventures de Robinson sur son île déserte.",
      slug: "robinson-crusoe"
    }
  ];

  const categories = ['Tous', 'Conte', 'Fantastique', 'Aventure', 'Classique'];
  const ageGroups = ['Tous', '3-6 ans', '5-9 ans', '6-10 ans', '7-11 ans', '8-12 ans', '9-13 ans', '10-15 ans'];

  // Memoized filtered books for performance
  const filteredBooks = useMemo(() => {
    return audiobooks.filter(book => {
      const matchesCategory = selectedCategory === 'Tous' || book.category === selectedCategory;
      const matchesAge = selectedAge === 'Tous' || book.age === selectedAge;
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesAge && matchesSearch;
    });
  }, [selectedCategory, selectedAge, searchTerm, audiobooks]);

  const handlePlayBook = (book: Audiobook) => {
    // Navigation vers la page de lecture
    // router.push(`/audiobooks/${book.slug}`);
    console.log('Playing:', book.title);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-50 to-purple-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Whisperies</h1>
          <p className="text-gray-600 text-lg">Plongez au cœur de nos histoires pour enfants</p>
          <p className="text-gray-500 mt-2">Fantastique ou pirate, conte ou fable, princesse ou animaux, à chacun son histoire !</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Filtres</h2>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="search"
                    type="text"
                    placeholder="Titre ou auteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="block text-sm font-medium text-gray-700 mb-3">Catégorie</h3>
                <div className="space-y-2" role="group" aria-label="Filtres par catégorie">
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
                <h3 className="block text-sm font-medium text-gray-700 mb-3">Âge</h3>
                <div className="space-y-2" role="group" aria-label="Filtres par âge">
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
                  {filteredBooks.length} livre{filteredBooks.length > 1 ? 's' : ''} trouvé{filteredBooks.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {/* Books Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map(book => (
                  <article 
                    key={book.id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={book.image} 
                        alt={`Couverture de ${book.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => handlePlayBook(book)}
                          className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`Écouter ${book.title}`}
                        >
                          <Play className="w-6 h-6 text-blue-600 ml-1" />
                        </button>
                      </div>

                      {/* Age Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                          {book.age}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
                          {book.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{book.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{book.description}</p>
                      
                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{book.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{book.rating}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button 
                        onClick={() => handlePlayBook(book)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Play className="w-4 h-4" />
                        Écouter maintenant
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
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun livre trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AudiobookCollection;