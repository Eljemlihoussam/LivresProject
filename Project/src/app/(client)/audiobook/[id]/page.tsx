
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  BookOpen, 
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
  AlertCircle,
  MoreVertical,
  Download,
  Share2,
  Heart,
  Rewind,
  FastForward,
  Shuffle,
  Repeat,
  List,
  Settings,
  Moon,
  Sun,
  Maximize,
  Minimize,
  Clock,
  User,
  Headphones,
  Waves
} from 'lucide-react';

interface Story {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_img_url: string;
  range?: string; // Optionnel si pas dans votre API
}

interface Chapter {
  id: number;
  story_id: number;
  title: string;
  content: string;
  audio_url: string;
  image_url?: string; // Optionnel si pas toujours présent
  createdAt?: string; // Optionnel
  updatedAt?: string; // Optionnel
}

// Composant pour les animaux réalistes avec mouvements aléatoires
const RealisticAnimal = ({ type, index }: { type: 'elephant' | 'monkey' | 'bird' | 'rabbit' | 'fox' | 'deer', index: number }) => {
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(Math.random() * 360);
  
  const [animalPath] = useState(() => {
    const path = [];
    for (let i = 0; i < 8; i++) {
      path.push({
        x: Math.random() * 85 + 5,
        y: Math.random() * 75 + 10,
      });
    }
    return path;
  });

  const [pathIndex, setPathIndex] = useState(Math.floor(Math.random() * animalPath.length));

  useEffect(() => {
    const moveAnimal = () => {
      setPathIndex(prev => (prev + 1) % animalPath.length);
      setDirection(prev => prev + (Math.random() - 0.5) * 60);
    };

    const timeout = setTimeout(() => {
      const interval = setInterval(moveAnimal, 2500 + (index * 300) + Math.random() * 1000);
      return () => clearInterval(interval);
    }, index * 800 + Math.random() * 1000);

    return () => clearTimeout(timeout);
  }, [index, animalPath.length]);

  useEffect(() => {
    setCurrentPosition(animalPath[pathIndex]);
  }, [pathIndex, animalPath]);

  const getRealisticAnimalSVG = () => {
    switch (type) {
      case 'elephant':
        return (
          <svg viewBox="0 0 160 140" className="w-full h-full drop-shadow-2xl">
            <defs>
              <radialGradient id={`elephant-gradient-${index}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgba(156, 163, 175, 0.9)" />
                <stop offset="70%" stopColor="rgba(107, 114, 128, 0.8)" />
                <stop offset="100%" stopColor="rgba(75, 85, 99, 0.7)" />
              </radialGradient>
            </defs>
            <ellipse cx="80" cy="90" rx="45" ry="30" fill={`url(#elephant-gradient-${index})`} />
            <ellipse cx="80" cy="60" rx="35" ry="28" fill="rgba(156, 163, 175, 0.9)" />
            <path d="M 60 75 Q 45 85 40 100 Q 35 115 45 125 Q 50 130 55 125" 
                  stroke="rgba(107, 114, 128, 0.9)" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round" />
            <ellipse cx="55" cy="55" rx="18" ry="25" fill="rgba(139, 144, 161, 0.8)" transform="rotate(-20 55 55)" />
            <ellipse cx="105" cy="55" rx="18" ry="25" fill="rgba(139, 144, 161, 0.8)" transform="rotate(20 105 55)" />
            <circle cx="70" cy="52" r="4" fill="rgba(0, 0, 0, 0.8)" />
            <circle cx="90" cy="52" r="4" fill="rgba(0, 0, 0, 0.8)" />
            <ellipse cx="55" cy="115" rx="8" ry="15" fill="rgba(107, 114, 128, 0.9)" />
            <ellipse cx="75" cy="115" rx="8" ry="15" fill="rgba(107, 114, 128, 0.9)" />
            <ellipse cx="85" cy="115" rx="8" ry="15" fill="rgba(107, 114, 128, 0.9)" />
            <ellipse cx="105" cy="115" rx="8" ry="15" fill="rgba(107, 114, 128, 0.9)" />
          </svg>
        );
        
      case 'monkey':
        return (
          <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-2xl">
            <defs>
              <radialGradient id={`monkey-gradient-${index}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="rgba(180, 83, 9, 0.9)" />
                <stop offset="70%" stopColor="rgba(146, 64, 14, 0.8)" />
                <stop offset="100%" stopColor="rgba(120, 53, 15, 0.7)" />
              </radialGradient>
            </defs>
            <ellipse cx="60" cy="85" rx="25" ry="30" fill={`url(#monkey-gradient-${index})`} />
            <ellipse cx="35" cy="75" rx="8" ry="25" fill="rgba(180, 83, 9, 0.8)" transform="rotate(-30 35 75)" />
            <ellipse cx="85" cy="75" rx="8" ry="25" fill="rgba(180, 83, 9, 0.8)" transform="rotate(30 85 75)" />
            <circle cx="60" cy="45" r="22" fill={`url(#monkey-gradient-${index})`} />
            <ellipse cx="60" cy="55" rx="12" ry="8" fill="rgba(222, 184, 135, 0.9)" />
            <circle cx="42" cy="38" r="8" fill="rgba(146, 64, 14, 0.8)" />
            <circle cx="78" cy="38" r="8" fill="rgba(146, 64, 14, 0.8)" />
            <circle cx="52" cy="42" r="4" fill="rgba(255, 255, 255, 0.9)" />
            <circle cx="68" cy="42" r="4" fill="rgba(255, 255, 255, 0.9)" />
            <circle cx="52" cy="42" r="2" fill="rgba(0, 0, 0, 0.9)" />
            <circle cx="68" cy="42" r="2" fill="rgba(0, 0, 0, 0.9)" />
            <path d="M 85 90 Q 100 95 110 85 Q 115 75 105 65" 
                  stroke="rgba(180, 83, 9, 0.8)" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeLinecap="round" />
          </svg>
        );
        
      case 'bird':
        return (
          <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-2xl">
            <ellipse cx="50" cy="50" rx="20" ry="15" fill="rgba(59, 130, 246, 0.9)" />
            <circle cx="30" cy="40" r="12" fill="rgba(59, 130, 246, 0.9)" />
            <polygon points="15,40 25,37 25,43" fill="rgba(251, 146, 60, 0.9)" />
            <circle cx="26" cy="37" r="3" fill="rgba(255, 255, 255, 0.9)" />
            <circle cx="26" cy="37" r="2" fill="rgba(0, 0, 0, 0.9)" />
            <ellipse cx="45" cy="45" rx="15" ry="8" fill="rgba(34, 197, 94, 0.8)" transform="rotate(-20 45 45)">
              <animateTransform 
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                values="-20 45 45;-5 45 45;-20 45 45"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="55" cy="45" rx="15" ry="8" fill="rgba(34, 197, 94, 0.8)" transform="rotate(20 55 45)">
              <animateTransform 
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                values="20 55 45;5 55 45;20 55 45"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="70" cy="55" rx="12" ry="6" fill="rgba(16, 185, 129, 0.8)" />
            <line x1="45" y1="62" x2="45" y2="70" stroke="rgba(251, 146, 60, 0.9)" strokeWidth="2" />
            <line x1="55" y1="62" x2="55" y2="70" stroke="rgba(251, 146, 60, 0.9)" strokeWidth="2" />
          </svg>
        );
        
      case 'rabbit':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
            <ellipse cx="50" cy="75" rx="20" ry="25" fill="rgba(255, 255, 255, 0.95)" />
            <circle cx="50" cy="45" r="18" fill="rgba(255, 255, 255, 0.95)" />
            <ellipse cx="42" cy="25" rx="4" ry="15" fill="rgba(255, 255, 255, 0.9)" />
            <ellipse cx="58" cy="25" rx="4" ry="15" fill="rgba(255, 255, 255, 0.9)" />
            <ellipse cx="42" cy="25" rx="2" ry="12" fill="rgba(255, 192, 203, 0.7)" />
            <ellipse cx="58" cy="25" rx="2" ry="12" fill="rgba(255, 192, 203, 0.7)" />
            <circle cx="45" cy="42" r="3" fill="rgba(0, 0, 0, 0.8)" />
            <circle cx="55" cy="42" r="3" fill="rgba(0, 0, 0, 0.8)" />
            <polygon points="48,48 52,48 50,50" fill="rgba(255, 192, 203, 0.8)" />
            <circle cx="70" cy="70" r="6" fill="rgba(255, 255, 255, 0.9)" />
          </svg>
        );
        
      case 'fox':
        return (
          <svg viewBox="0 0 130 100" className="w-full h-full drop-shadow-2xl">
            <ellipse cx="65" cy="70" rx="30" ry="18" fill="rgba(251, 146, 60, 0.9)" />
            <ellipse cx="65" cy="45" rx="20" ry="18" fill="rgba(251, 146, 60, 0.9)" />
            <ellipse cx="65" cy="52" rx="8" ry="6" fill="rgba(255, 255, 255, 0.9)" />
            <polygon points="50,32 55,20 62,32" fill="rgba(251, 146, 60, 0.9)" />
            <polygon points="68,32 75,20 80,32" fill="rgba(251, 146, 60, 0.9)" />
            <circle cx="58" cy="42" r="3" fill="rgba(255, 255, 255, 0.9)" />
            <circle cx="72" cy="42" r="3" fill="rgba(255, 255, 255, 0.9)" />
            <ellipse cx="100" cy="75" rx="20" ry="10" fill="rgba(251, 146, 60, 0.8)" />
            <ellipse cx="105" cy="70" rx="15" ry="8" fill="rgba(255, 255, 255, 0.6)" />
          </svg>
        );
        
      case 'deer':
        return (
          <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-2xl">
            <ellipse cx="60" cy="85" rx="25" ry="30" fill="rgba(180, 83, 9, 0.9)" />
            <ellipse cx="60" cy="35" rx="12" ry="18" fill="rgba(180, 83, 9, 0.9)" />
            <path d="M 52 20 L 48 10 M 52 20 L 56 12 M 52 20 L 50 8" 
                  stroke="rgba(120, 53, 15, 0.9)" strokeWidth="3" strokeLinecap="round" />
            <path d="M 68 20 L 72 10 M 68 20 L 64 12 M 68 20 L 70 8" 
                  stroke="rgba(120, 53, 15, 0.9)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="56" cy="32" r="2" fill="rgba(0, 0, 0, 0.9)" />
            <circle cx="64" cy="32" r="2" fill="rgba(0, 0, 0, 0.9)" />
            <rect x="48" y="110" width="4" height="25" fill="rgba(120, 53, 15, 0.8)" rx="2" />
            <rect x="72" y="110" width="4" height="25" fill="rgba(120, 53, 15, 0.8)" rx="2" />
          </svg>
        );
    }
  };

  return (
    <div
      className="fixed pointer-events-none z-10 transition-all duration-[2.5s] ease-in-out"
      style={{
        left: `${currentPosition.x}%`,
        top: `${currentPosition.y}%`,
        width: '120px',
        height: '120px',
        transform: `translate(-50%, -50%) rotate(${direction}deg)`,
        opacity: 0.6,
      }}
    >
      <div className="relative w-full h-full animate-bounce" style={{ 
        animationDuration: `${2 + Math.sin(index) * 0.5}s`,
        animationDelay: `${index * 0.2}s`
      }}>
        {getRealisticAnimalSVG()}
      </div>
    </div>
  );
};

// Composant pour les étoiles scintillantes
const TwinklingStar = ({ index }: { index: number }) => {
  const [opacity, setOpacity] = useState(Math.random());
  const [position] = useState({
    x: Math.random() * 100,
    y: Math.random() * 60
  });

  useEffect(() => {
    const twinkle = () => {
      setOpacity(Math.random() * 0.8 + 0.2);
    };

    const interval = setInterval(twinkle, 2000 + index * 500);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div
      className="fixed pointer-events-none z-5 transition-opacity duration-1000"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        opacity: opacity,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path
          d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
          fill="rgba(255, 255, 255, 0.8)"
        />
      </svg>
    </div>
  );
};

const AudiobookPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // États principaux
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showText, setShowText] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showChapterList, setShowChapterList] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [buffered, setBuffered] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  // Génération des animaux
  const [decorativeAnimals] = useState(() => {
    const animals: Array<{ type: 'elephant' | 'monkey' | 'bird' | 'rabbit' | 'fox' | 'deer' }> = [];
    const types: Array<'elephant' | 'monkey' | 'bird' | 'rabbit' | 'fox' | 'deer'> = ['elephant', 'monkey', 'bird', 'rabbit', 'fox', 'deer'];
    
    for (let i = 0; i < 12; i++) {
      animals.push({
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
    return animals;
  });

 const fetchStoryData = async (storyId: number = 33) => {
  try {
    setLoading(true);
    setError(null);

    console.log('Chargement des données pour story_id:', storyId); // Pour debug

    // Récupération des données de l'histoire ET des chapitres en une seule requête
    const response = await fetch(`/api/story_chapter?story_id=${storyId}`);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des données: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Données reçues:', data); // Pour debug
    
    // Vérification de la structure de réponse
    if (!data.success || !data.story || !data.chapters) {
      throw new Error('Structure de données invalide');
    }

    // Mise à jour des états avec les données reçues
    setStory({
      id: data.story.id,
      title: data.story.title,
      author: data.story.author,
      description: data.story.description,
      cover_img_url: data.story.cover_img_url,
      range: "3-8 سنوات" // Vous pouvez ajouter ce champ à votre API si nécessaire
    });

    // Transformation des chapitres pour correspondre à l'interface Chapter
    const transformedChapters = data.chapters.map((chapter: any, index: number) => ({
      id: chapter.id,
      story_id: chapter.story_id,
      title: chapter.title,
      content: chapter.content,
      audio_url: chapter.audio_url,
      image_url: chapter.image_url || data.story.cover_img_url, // Utiliser l'image du chapitre ou celle de l'histoire
      createdAt: new Date().toISOString(), // Vous pouvez ajouter ces champs à votre API
      updatedAt: new Date().toISOString()
    }));

    setChapters(transformedChapters);

    // Réinitialiser l'index si nécessaire
    if (transformedChapters.length > 0) {
      setCurrentChapterIndex(0);
    }

    console.log('Données traitées avec succès:', { story: data.story, chaptersCount: transformedChapters.length }); // Pour debug

  } catch (err) {
    console.error('Erreur lors du chargement des données:', err);
    setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    
    // Données de fallback en cas d'erreur (optionnel)
    // Vous pouvez garder votre fallback existant ou le supprimer
  } finally {
    setLoading(false);
  }
};

  // Fonction de retry
  const retryFetch = () => {
    fetchStoryData();
  };

  // Effect pour charger les données au montage
 useEffect(() => {
  // Récupérer l'ID de l'histoire depuis le chemin de l'URL
  // Format: /audiobook/58 ou /audiobook/33
  const pathParts = window.location.pathname.split('/');
  let storyId = 33; // ID par défaut
  
  // Rechercher "audiobook" dans le chemin et prendre l'élément suivant
  const audiobookIndex = pathParts.findIndex(part => part === 'audiobook');
  if (audiobookIndex !== -1 && pathParts[audiobookIndex + 1]) {
    const pathId = pathParts[audiobookIndex + 1];
    // Vérifier que c'est un nombre valide
    if (!isNaN(Number(pathId)) && Number(pathId) > 0) {
      storyId = parseInt(pathId);
    }
  }
  
  console.log('Chemin URL:', window.location.pathname);
  console.log('Story ID récupéré:', storyId);
  
  fetchStoryData(storyId);
}, []);

  const currentChapter = chapters[currentChapterIndex];

  // Fonctions utilitaires
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fonctions de contrôle audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    } else if (isLooping) {
      setCurrentChapterIndex(0);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const shareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title || 'قصة صوتية',
        text: story?.description || 'استمع إلى هذه القصة الرائعة',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  // Effect pour la gestion audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentChapterIndex < chapters.length - 1) {
        handleNextChapter();
      } else if (isLooping) {
        setCurrentChapterIndex(0);
        setTimeout(() => audio.play(), 100);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    audio.volume = volume;
    audio.playbackRate = playbackRate;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentChapterIndex, chapters.length, isLooping, volume, playbackRate]);

  // Écran d'erreur
  if (error && !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {decorativeAnimals.slice(0, 5).map((animal, index) => (
          <RealisticAnimal key={`error-${index}`} type={animal.type} index={index} />
        ))}
        
        {[...Array(8)].map((_, i) => (
          <TwinklingStar key={`error-star-${i}`} index={i} />
        ))}
        
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 max-w-md w-full mx-4 relative z-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">خطأ في التحميل</h3>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={retryFetch}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-medium hover:scale-105 transition-all duration-200"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {decorativeAnimals.slice(0, 5).map((animal, index) => (
          <RealisticAnimal key={`loading-${index}`} type={animal.type} index={index} />
        ))}
        
        {[...Array(8)].map((_, i) => (
          <TwinklingStar key={`loading-star-${i}`} index={i} />
        ))}
        
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 max-w-md w-full mx-4 relative z-20">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-slate-900"></div>
                <Headphones className="absolute inset-4 w-12 h-12 text-violet-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">جاري التحميل...</h3>
            <div className="w-full bg-white/10 rounded-full h-3 mb-4">
              <div className="bg-gradient-to-r from-violet-400 to-purple-400 h-3 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-white/70">تحضير قصتك المفضلة</p>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Background Animals and Stars */}
      {decorativeAnimals.map((animal, index) => (
        <RealisticAnimal key={index} type={animal.type} index={index} />
      ))}
      
      {[...Array(15)].map((_, i) => (
        <TwinklingStar key={i} index={i} />
      ))}

      {/* Header */}
      <header className="relative z-30 p-6 flex items-center justify-between">
        <button 
          onClick={() => window.history.back()}
          className={`p-3 rounded-2xl backdrop-blur-xl border transition-all duration-200 hover:scale-110 ${
            darkMode 
              ? 'bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/70' 
              : 'bg-white/50 border-white/50 text-slate-700 hover:bg-white/70'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`} dir="rtl">
            {story.title}
          </h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {story.author}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Suppression de button dark et light mode par ce que deja exister dans navbar pour centraliser */}
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-2xl backdrop-blur-xl border transition-all duration-200 hover:scale-110 ${
              darkMode 
                ? 'bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/70' 
                : 'bg-white/50 border-white/50 text-slate-700 hover:bg-white/70'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button> */}
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="relative z-20 mx-6 mb-4">
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-yellow-200 text-sm">
                  تعذر تحميل بعض البيانات. يتم عرض البيانات المحفوظة مؤقتاً.
                </p>
                <button
                  onClick={retryFetch}
                  className="text-yellow-300 hover:text-yellow-100 text-xs underline mt-1"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentChapter?.audio_url}
        preload="metadata"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 relative z-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Player Card avec Glass Morphism */}
          <div className={`rounded-3xl border backdrop-blur-2xl p-8 ${
            darkMode 
              ? 'bg-slate-900/50 border-slate-700/50' 
              : 'bg-white/50 border-white/50'
          } shadow-2xl relative overflow-hidden`}>
            
            {/* Décorations internes du player avec thème d'animaux */}
            <div className="absolute top-4 right-4 opacity-20">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <path d="M20 8 C25 8, 28 12, 28 16 C28 20, 25 24, 20 32 C15 24, 12 20, 12 16 C12 12, 15 8, 20 8 Z" fill="currentColor" />
                <circle cx="20" cy="16" r="4" fill="rgba(255,255,255,0.5)" />
              </svg>
            </div>
            
            <div className="absolute bottom-4 left-4 opacity-20">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <ellipse cx="20" cy="30" rx="12" ry="6" fill="currentColor" />
                <ellipse cx="20" cy="20" rx="8" ry="10" fill="currentColor" />
                <circle cx="20" cy="12" r="6" fill="currentColor" />
                <circle cx="17" cy="10" r="1" fill="rgba(255,255,255,0.8)" />
                <circle cx="23" cy="10" r="1" fill="rgba(255,255,255,0.8)" />
              </svg>
            </div>

            {/* Cover Image avec Animation */}
            <div className="relative mb-8 z-10">
              <div className="relative w-full h-80 rounded-2xl overflow-hidden group">
                <img
                  src={currentChapter?.image_url || story.cover_img_url}
                  alt={currentChapter?.title || story.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isPlaying ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Visualizer Animation amélioré */}
                {isPlaying && (
                  <div className="absolute bottom-4 left-4 flex items-end gap-1">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`bg-white/80 rounded-full animate-pulse ${
                          i % 4 === 0 ? 'w-1 h-8' : 
                          i % 4 === 1 ? 'w-1 h-6' : 
                          i % 4 === 2 ? 'w-1 h-10' : 'w-1 h-4'
                        }`}
                        style={{ 
                          animationDelay: `${i * 0.05}s`,
                          animationDuration: `${0.5 + Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Indicateur de buffer */}
                {isBuffering && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-xl rounded-full p-4">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-full backdrop-blur-xl transition-all duration-200 hover:scale-110 ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={shareStory}
                    className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-xl transition-all duration-200 hover:scale-110"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={togglePlayPause}
                    className="bg-white/20 backdrop-blur-xl rounded-full p-8 hover:bg-white/30 transition-all duration-200 hover:scale-110"
                  >
                    {isPlaying ? (
                      <Pause className="w-12 h-12 text-white" />
                    ) : (
                      <Play className="w-12 h-12 text-white ml-2" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Chapter Info */}
            <div className="text-center mb-8 relative z-10">
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`} dir="rtl">
                {currentChapter?.title || `الفصل ${currentChapterIndex + 1}`}
              </h2>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                الفصل {currentChapterIndex + 1} من {chapters.length}
              </p>
            </div>

            {/* Progress Bar Enhanced */}
            <div className="mb-8 relative z-10">
              <div className="relative">
                <div className={`w-full h-3 rounded-full ${
                  darkMode ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                  {/* Buffer indicator */}
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      darkMode ? 'bg-slate-600' : 'bg-slate-300'
                    }`}
                    style={{ width: `${buffered}%` }}
                  />
                  {/* Progress indicator */}
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 absolute top-0 left-0"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                />
              </div>
              <div className={`flex justify-between text-sm mt-2 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Enhanced */}
            <div className="flex items-center justify-center gap-6 mb-8 relative z-10">
              <button
                onClick={() => setIsShuffling(!isShuffling)}
                className={`p-3 rounded-2xl transition-all duration-200 hover:scale-110 ${
                  isShuffling 
                    ? 'bg-violet-500 text-white' 
                    : darkMode
                      ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={handlePreviousChapter}
                disabled={currentChapterIndex === 0}
                className={`p-4 rounded-2xl transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
                  darkMode
                    ? 'bg-slate-800/50 text-white hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={() => skipTime(-10)}
                className={`p-4 rounded-2xl transition-all duration-200 hover:scale-110 ${
                  darkMode
                    ? 'bg-slate-800/50 text-white hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Rewind className="w-6 h-6" />
              </button>

              <button
                onClick={togglePlayPause}
                disabled={isBuffering}
                className="p-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-2xl transition-all duration-200 hover:scale-110 hover:shadow-violet-500/25 disabled:opacity-70"
              >
                {isBuffering ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button
                onClick={() => skipTime(10)}
                className={`p-4 rounded-2xl transition-all duration-200 hover:scale-110 ${
                  darkMode
                    ? 'bg-slate-800/50 text-white hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FastForward className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIndex === chapters.length - 1 && !isLooping}
                className={`p-4 rounded-2xl transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
                  darkMode
                    ? 'bg-slate-800/50 text-white hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-3 rounded-2xl transition-all duration-200 hover:scale-110 ${
                  isLooping 
                    ? 'bg-violet-500 text-white' 
                    : darkMode
                      ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control Enhanced */}
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-2xl transition-all duration-200 hover:scale-110 ${
                  darkMode
                    ? 'bg-slate-800/50 text-white hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              
              <div className="flex-1 relative">
                <div className={`w-full h-2 rounded-full ${
                  darkMode ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                />
              </div>
              
              <span className={`text-sm font-medium min-w-[3rem] text-center ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Playback Rate Indicator */}
            {playbackRate !== 1 && (
              <div className="flex justify-center mb-4 relative z-10">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-slate-800/50 text-violet-400' : 'bg-violet-100 text-violet-600'
                }`}>
                  السرعة: {playbackRate}x
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 relative z-10">
              <button
                onClick={() => setShowText(!showText)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
                  showText 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg' 
                    : darkMode
                      ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                النص
              </button>

              <button
                onClick={() => setShowChapterList(!showChapterList)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105 ${
                  showChapterList 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg' 
                    : darkMode
                      ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <List className="w-5 h-5" />
                الفصول
              </button>
            </div>
          </div>

          {/* Content Panel */}
          <div className="space-y-6">
            {/* Chapter List */}
            {showChapterList && (
              <div className={`rounded-3xl border backdrop-blur-2xl p-6 ${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white/50 border-white/50'
              } shadow-xl transform transition-all duration-500 relative overflow-hidden`}>
                
                {/* Décorations internes avec thème animal */}
                <div className="absolute top-4 left-4 opacity-10">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <rect x="4" y="6" width="24" height="2" fill="currentColor" rx="1" />
                    <rect x="4" y="12" width="20" height="2" fill="currentColor" rx="1" />
                    <rect x="4" y="18" width="18" height="2" fill="currentColor" rx="1" />
                    <rect x="4" y="24" width="22" height="2" fill="currentColor" rx="1" />
                    <circle cx="28" cy="7" r="2" fill="currentColor" opacity="0.5" />
                    <circle cx="26" cy="13" r="2" fill="currentColor" opacity="0.5" />
                    <circle cx="24" cy="19" r="2" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    فصول القصة
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {chapters.length} فصل
                  </span>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        setCurrentChapterIndex(index);
                        setCurrentTime(0);
                        if (isPlaying && audioRef.current) {
                          setTimeout(() => audioRef.current?.play(), 100);
                        }
                      }}
                      className={`w-full p-4 rounded-2xl text-right transition-all duration-200 hover:scale-[1.02] group ${
                        index === currentChapterIndex
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                          : darkMode
                            ? 'bg-slate-800/30 hover:bg-slate-800/60 text-slate-300'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {chapter.title || `الفصل ${index + 1}`}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              index === currentChapterIndex 
                                ? 'bg-white/20 text-white' 
                                : darkMode 
                                  ? 'bg-slate-700 text-slate-400'
                                  : 'bg-slate-200 text-slate-500'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                          {chapter.content && (
                            <p className={`text-sm opacity-75 line-clamp-2 ${
                              index === currentChapterIndex 
                                ? 'text-white/80' 
                                : darkMode 
                                  ? 'text-slate-400'
                                  : 'text-slate-500'
                            }`}>
                              {chapter.content.substring(0, 100)}...
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 mr-4">
                          {index === currentChapterIndex && (
                            <div className="flex items-center gap-1">
                              {isPlaying ? (
                                <Waves className="w-5 h-5 text-white animate-pulse" />
                              ) : (
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              )}
                            </div>
                          )}
                          <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                            index === currentChapterIndex 
                              ? 'text-white' 
                              : darkMode 
                                ? 'text-slate-400'
                                : 'text-slate-400'
                          }`} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Text Panel */}
            {showText && (
              <div className={`rounded-3xl border backdrop-blur-2xl p-6 ${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-700/50' 
                  : 'bg-white/50 border-white/50'
              } shadow-xl transform transition-all duration-500 relative overflow-hidden`}>
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    نص القصة
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPlaybackRate(playbackRate === 2 ? 0.5 : playbackRate + 0.25)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {playbackRate}x
                    </button>
                  </div>
                </div>
                
                <div className={`max-h-96 overflow-y-auto custom-scrollbar leading-relaxed text-lg ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`} dir="rtl">
                  {currentChapter?.content || 'لا يوجد نص متاح لهذا الفصل.'}
                </div>
              </div>
            )}

            {/* Story Info */}
            <div className={`rounded-3xl border backdrop-blur-2xl p-6 ${
              darkMode 
                ? 'bg-slate-900/50 border-slate-700/50' 
                : 'bg-white/50 border-white/50'
            } shadow-xl`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden">
                  <img
                    src={story.cover_img_url}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1" dir="rtl">
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {story.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    بواسطة {story.author}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                    darkMode ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-600'
                  }`}>
                    {story.range}
                  </span>
                </div>
              </div>
              
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} dir="rtl">
                {story.description}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AudiobookPlayer;