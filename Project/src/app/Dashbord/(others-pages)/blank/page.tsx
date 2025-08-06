'use client';

import React, { useState } from 'react';
import { Play, Edit, Trash2, Plus, Eye, Users, BookOpen, Clock, Star } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

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
  status: 'published' | 'draft' | 'archived';
  views: number;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedBooks, setSelectedBooks] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

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
      slug: "le-petit-prince",
      status: "published",
      views: 15420,
      createdAt: "2024-01-15"
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
      slug: "alice-au-pays-des-merveilles",
      status: "published",
      views: 12350,
      createdAt: "2024-01-10"
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
      slug: "les-trois-petits-cochons",
      status: "draft",
      views: 0,
      createdAt: "2024-01-20"
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
      slug: "harry-potter-ecole-sorciers",
      status: "published",
      views: 25680,
      createdAt: "2024-01-05"
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
      slug: "la-belle-et-la-bete",
      status: "archived",
      views: 8920,
      createdAt: "2023-12-28"
    }
  ];

  const handleSelectBook = (bookId: number) => {
    const newSelection = new Set(selectedBooks);
    if (newSelection.has(bookId)) {
      newSelection.delete(bookId);
    } else {
      newSelection.add(bookId);
    }
    setSelectedBooks(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedBooks.size === audiobooks.length) {
      setSelectedBooks(new Set());
    } else {
      setSelectedBooks(new Set(audiobooks.map(book => book.id)));
    }
  };

  const handleEditBook = (book: Audiobook) => {
    console.log('Editing:', book.title);
  };

  const handleDeleteBook = (bookId: number) => {
    console.log('Deleting book:', bookId);
  };

  const handleBulkDelete = () => {
    console.log('Bulk deleting:', Array.from(selectedBooks));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'draft':
        return theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
      default:
        return theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`py-6 px-6 transition-colors duration-300 border-b ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Administration - Whisperies
              </h1>
              <p className={`mt-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Gérez votre bibliothèque d'audiobooks
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4" />
                Ajouter un livre
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl p-6 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total des livres
                </p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {audiobooks.length}
                </p>
              </div>
              <BookOpen className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className={`rounded-xl p-6 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Publiés
                </p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {audiobooks.filter(book => book.status === 'published').length}
                </p>
              </div>
              <Eye className={`w-8 h-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          <div className={`rounded-xl p-6 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Brouillons
                </p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {audiobooks.filter(book => book.status === 'draft').length}
                </p>
              </div>
              <Edit className={`w-8 h-8 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
          </div>

          <div className={`rounded-xl p-6 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total des vues
                </p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {audiobooks.reduce((total, book) => total + book.views, 0).toLocaleString()}
                </p>
              </div>
              <Users className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={`rounded-xl p-4 mb-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBooks.size === audiobooks.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Tout sélectionner
                </span>
              </label>
              {selectedBooks.size > 0 && (
                <span className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {selectedBooks.size} livre{selectedBooks.size > 1 ? 's' : ''} sélectionné{selectedBooks.size > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {selectedBooks.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer la sélection
              </button>
            )}
          </div>
        </div>

        {/* Books Table */}
        <div className={`rounded-xl overflow-hidden transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className="w-12 p-4"></th>
                  <th className={`text-left p-4 font-medium transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Livre
                  </th>
                  <th className={`text-left p-4 font-medium transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Catégorie
                  </th>
                  <th className={`text-left p-4 font-medium transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Statut
                  </th>
                  <th className={`text-left p-4 font-medium transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Vues
                  </th>
                  <th className={`text-left p-4 font-medium transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Date
                  </th>
                  <th className="w-32 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {audiobooks.map((book, index) => (
                  <tr key={book.id} className={`transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 border-gray-700' 
                      : 'hover:bg-gray-50 border-gray-200'
                  } ${index !== audiobooks.length - 1 ? 'border-b' : ''}`}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedBooks.has(book.id)}
                        onChange={() => handleSelectBook(book.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.image}
                          alt={`Couverture de ${book.title}`}
                          className="w-12 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className={`font-medium transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {book.title}
                          </h3>
                          <p className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {book.author}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className={`text-xs transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                {book.duration}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className={`text-xs transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                {book.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {book.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                        {getStatusText(book.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {book.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(book.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBook(book)}
                          className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          aria-label={`Modifier ${book.title}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                          }`}
                          aria-label={`Supprimer ${book.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;