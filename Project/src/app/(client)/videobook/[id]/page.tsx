'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSearchParams, useParams, usePathname } from 'next/navigation';

const VideoStoryPlayer = () => {
  const { theme } = useTheme();
  const [storyData, setStoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [storyId, setStoryId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  // Récupérer l'ID depuis l'URL
  const searchParams = useSearchParams();
  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    // Différentes façons de récupérer l'ID selon la structure de votre URL
    let id = null;
    
    // Méthode 1: Depuis les paramètres d'URL (?story_id=33)
    if (searchParams.get('story_id')) {
      id = searchParams.get('story_id');
    }
    // Méthode 2: Depuis les paramètres de route (/story/[id])
    else if (params?.id) {
      id = params.id;
    }
    // Méthode 3: Depuis le pathname (/story/33)
    else {
      const pathSegments = pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && !isNaN(lastSegment)) {
        id = lastSegment;
      }
    }
    
    if (id) {
      setStoryId(parseInt(id));
    } else {
      setError('ID de l\'histoire non trouvé dans l\'URL');
      setIsLoading(false);
    }
  }, [searchParams, params, pathname]);

  // Couleurs basées sur le thème
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDark 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const subtextClass = isDark ? 'text-gray-300' : 'text-gray-600';

  // Récupérer les données de l'API
  useEffect(() => {
    if (!storyId) return;

    const fetchStoryData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/story_chapter?story_id=${storyId}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setStoryData(data);
          setError(null);
        } else {
          throw new Error('Données invalides reçues de l\'API');
        }
      } catch (err) {
        setError(err.message);
        console.error('Erreur API:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryData();
  }, [storyId]);

  // Générer le chemin de la vidéo locale basé sur l'ID de l'histoire
  const getVideoPath = () => {
    // La vidéo est dans public/videos/ avec le format: story-{id}.mp4
    return `/videos/story-${storyId}.mp4`;
  };

  // Calculer la durée totale approximative (somme des chapitres)
  const getTotalDuration = () => {
    if (!storyData?.chapters) return "غير محدد";
    // Estimation: 2-3 minutes par chapitre
    const estimatedMinutes = storyData.chapters.length * 2.5;
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = Math.round(estimatedMinutes % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return `${minutes} دقيقة`;
  };

  // Créer le résumé complet de l'histoire
  const getFullStoryContent = () => {
    if (!storyData?.chapters) return "";
    return storyData.chapters.map(chapter => chapter.content).join('\n\n');
  };

  // Télécharger la vidéo
  const downloadVideo = () => {
    if (!storyData?.story || isDownloading) return;
    
    setIsDownloading(true);
    
    // Simulation du téléchargement (remplacez par votre logique réelle)
    setTimeout(() => {
      const videoPath = getVideoPath();
      const filename = `${storyData.story.title}.mp4`;
      
      const a = document.createElement('a');
      a.href = videoPath;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setIsDownloading(false);
      setDownloadComplete(true);
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    }, 2000);
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
          </div>
          <div className={`text-2xl font-bold mb-4 ${textClass}`}>تحميل الفيديو</div>
          <div className={`text-sm ${subtextClass}`}>جاري تحضير المحتوى...</div>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <div className={`${cardClass} border rounded-3xl p-8 text-center max-w-md mx-auto`}>
          <div className="text-6xl mb-4">⚠️</div>
          <div className={`text-2xl font-bold mb-4 ${textClass}`}>خطأ في التحميل</div>
          <div className={`text-sm ${subtextClass} mb-6`}>{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const videoPath = getVideoPath();

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Debug info - À supprimer en production */}
        <div className="fixed top-4 right-4 z-50 bg-black/70 text-white p-3 rounded-lg text-sm shadow-lg">
          <div>Thème détecté: <strong>{theme}</strong></div>
          <div>Mode sombre: <strong>{isDark ? 'Activé' : 'Désactivé'}</strong></div>
          <div>HTML class: <strong>{typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</strong></div>
          <div>LocalStorage: <strong>{typeof window !== 'undefined' ? localStorage.getItem('theme') || 'null' : 'N/A'}</strong></div>
        </div>

        {/* Hero Section */}
        <div className={`${cardClass} border rounded-3xl overflow-hidden shadow-2xl mb-8 transition-colors duration-300`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
            {storyData.story.cover_img_url && (
              <div className="absolute inset-0 opacity-10">
                <img 
                  src={storyData.story.cover_img_url} 
                  alt="Story Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="relative p-10 text-center" dir="rtl">
              
              <h1 className={`text-5xl lg:text-6xl font-bold mb-6 ${textClass} leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
                {storyData.story.title}
              </h1>
              
              <p className={`text-2xl mb-8 ${subtextClass} leading-relaxed`}>
                {storyData.story.description}
              </p>
              
              {/* Story Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} text-center`}>
                  <div className="text-3xl mb-2">✍️</div>
                  <div className={`text-lg font-bold ${textClass}`}>{storyData.story.author}</div>
                  <div className={`text-sm ${subtextClass}`}>المؤلف</div>
                </div>
                
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} text-center`}>
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className={`text-lg font-bold ${textClass}`}>{getTotalDuration()}</div>
                  <div className={`text-sm ${subtextClass}`}>المدة التقديرية</div>
                </div>
                
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} text-center`}>
                  <div className="text-3xl mb-2">🎬</div>
                  <div className={`text-lg font-bold ${textClass}`}>HD</div>
                  <div className={`text-sm ${subtextClass}`}>الجودة</div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl mb-8">
                <h3 className={`font-bold text-xl mb-4 ${textClass}`}>🎬 مميزات الفيديو:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" dir="rtl">
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-lg">✅</span>
                    <span className={subtextClass}>قصة كاملة في فيديو واحد</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-lg">✅</span>
                    <span className={subtextClass}>جودة عالية HD</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-lg">✅</span>
                    <span className={subtextClass}>محتوى تفاعلي</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-lg">✅</span>
                    <span className={subtextClass}>قابل للتحميل</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <div className={`${cardClass} border rounded-3xl p-10 mb-8 shadow-2xl transition-colors duration-300`}>
          <h3 className={`text-3xl font-bold mb-8 text-center ${textClass} flex items-center justify-center gap-4`}>
            <span>🎥</span>
            مشاهدة القصة كاملة
          </h3>
          
          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 bg-black">
            {!videoError ? (
              <video 
                src={videoPath} 
                controls 
                className="w-full h-auto max-h-[600px]"
                preload="metadata"
                poster={storyData.story.cover_img_url || undefined}
                onError={(e) => {
                  console.error('Erreur de chargement vidéo:', videoPath);
                  setVideoError(true);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-800 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <div className="text-xl mb-2">فيديو غير متاح</div>
                  <div className="text-sm text-gray-300 mb-4">
                    تأكد من وجود الملف: {videoPath}
                  </div>
                  <button
                    onClick={() => setVideoError(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              </div>
            )}
            
            {/* Video Overlay Info */}
            {!videoError && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                🎬 {storyData.story.title} • {getTotalDuration()}
              </div>
            )}
          </div>
          
          {/* Action Buttons - VERSION AMÉLIORÉE */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {/* Bouton de téléchargement amélioré */}
            <div className="relative">
              <button
                onClick={downloadVideo}
                disabled={isDownloading}
                className={`group flex items-center gap-3 px-8 py-4 text-white rounded-2xl font-bold transition-all duration-500 shadow-lg overflow-hidden ${
                  downloadComplete 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : isDownloading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                } ${isDownloading ? 'scale-100' : 'hover:scale-105'}`}
              >
                {/* Barre de progression pendant le téléchargement */}
                {isDownloading && (
                  <div className="absolute bottom-0 left-0 h-1 bg-green-300 transition-all duration-2000 ease-linear animate-progress"></div>
                )}
                
                {/* Icône changeante selon l'état */}
                <div className="relative z-10 flex items-center">
                  {downloadComplete ? (
                    <span className="text-2xl transition-all duration-300 animate-checkmark">✅</span>
                  ) : isDownloading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce">⬇️</span>
                  )}
                </div>
                
                {/* Texte changeant selon l'état */}
                <span className="relative z-10 transition-all duration-300">
                  {downloadComplete ? 'تم التحميل!' : isDownloading ? 'جاري التحميل...' : 'تحميل الفيديو'}
                </span>
                
                {/* Effet de lumière au survol */}
                <div className="absolute inset-0 flex justify-center overflow-hidden">
                  <div className="absolute w-12 h-40 bg-white/30 -top-10 -left-4 transform rotate-12 transition-all duration-700 group-hover:translate-x-48 group-hover:translate-y-20 group-hover:opacity-0"></div>
                </div>
              </button>
              
              {/* Effet de particules après téléchargement */}
              {downloadComplete && (
                <div className="absolute inset-0 flex justify-center items-start pointer-events-none z-20">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-0 animate-confetti"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        left: `${Math.random() * 100}%`,
                        transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`,
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Bouton d'actualisation amélioré */}
            <button
              onClick={() => window.location.reload()}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              {/* Effet de lumière */}
              <div className="absolute inset-0 flex justify-center overflow-hidden">
                <div className="absolute w-12 h-40 bg-white/30 -top-10 -left-4 transform rotate-12 transition-all duration-700 group-hover:translate-x-48 group-hover:translate-y-20 group-hover:opacity-0"></div>
              </div>
              
              <span className="text-2xl group-hover:rotate-180 transition-transform duration-700">🔄</span>
              إعادة تحميل
            </button>

            {/* Bouton de retour amélioré */}
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              {/* Effet de lumière */}
              <div className="absolute inset-0 flex justify-center overflow-hidden">
                <div className="absolute w-12 h-40 bg-white/30 -top-10 -left-4 transform rotate-12 transition-all duration-700 group-hover:translate-x-48 group-hover:translate-y-20 group-hover:opacity-0"></div>
              </div>
              
              <span className="text-2xl group-hover:-translate-x-1 transition-transform duration-300">↩️</span>
              العودة
            </button>
          </div>
          
          {/* Video Info */}
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 p-8 rounded-2xl">
            <h4 className={`font-bold text-xl mb-4 ${textClass} flex items-center justify-center gap-3`}>
              <span>📋</span>
              معلومات الفيديو
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" dir="rtl">
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">🆔</span>
                <span className={textClass}>معرف القصة: {storyId}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">📹</span>
                <span className={textClass}>ملف الفيديو: story-{storyId}.mp4</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">👤</span>
                <span className={textClass}>المؤلف: {storyData.story.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-500 text-xl">📚</span>
                <span className={textClass}>عدد الفصول الأصلي: {storyData.totalChapters}</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          @keyframes checkmark {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          @keyframes confetti {
            0% { 
              opacity: 1;
              transform: translateY(0) rotate(0deg);
            }
            100% { 
              opacity: 0;
              transform: translateY(50px) rotate(360deg);
            }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-progress {
            animation: progress 2s linear forwards;
          }
          .animate-checkmark {
            animation: checkmark 0.5s ease-out;
          }
          .animate-confetti {
            animation: confetti 1s ease-out forwards;
          }
          .animate-bounce {
            animation: bounce 0.5s ease-in-out infinite;
          }
        `}</style>
        
      </div>
    </div>
  );
};

export default VideoStoryPlayer;