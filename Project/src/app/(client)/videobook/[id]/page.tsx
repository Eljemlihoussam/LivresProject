'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  ChevronLeft,
  Heart,
  Rewind,
  FastForward,
  Share2,
  Maximize2,
  Minimize2,
  Settings,
  List,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  Video,
  Download
} from 'lucide-react';

// Types pour les segments de contenu vidéo
interface ContentSegment {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  type: 'paragraph' | 'dialogue' | 'description' | 'title';
}

interface Chapter {
  id: number;
  story_id: number;
  title: string;
  content: string;
  audio_url: string; // Sera utilisé comme video_url
  video_url?: string; // URL vidéo si différente
  image_url?: string;
  duration?: number;
  contentSegments?: ContentSegment[];
}

interface Story {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_img_url: string;
}

interface APIResponse {
  success: boolean;
  story: Story;
  totalChapters: number;
  chapters: Chapter[];
}

const StoryVideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  // États principaux
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentSegment, setCurrentSegment] = useState<ContentSegment | null>(null);
  const [fontSize, setFontSize] = useState<number>(18);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buffered, setBuffered] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [showChapterList, setShowChapterList] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  // États pour la synchronisation
  const [segmentProgress, setSegmentProgress] = useState<number>(0);
  const [upcomingSegment, setUpcomingSegment] = useState<ContentSegment | null>(null);

  // Récupérer l'ID depuis l'URL
  const getStoryIdFromUrl = (): number => {
    const pathParts = window.location.pathname.split('/');
    const audiobookIndex = pathParts.findIndex(part => part === 'audiobook');
    const storyId = audiobookIndex !== -1 && pathParts[audiobookIndex + 1] 
      ? parseInt(pathParts[audiobookIndex + 1]) 
      : 33; // Default fallback
    return isNaN(storyId) ? 33 : storyId;
  };

  // Générer des segments de contenu basés sur les phrases
  const generateContentSegments = (content: string, totalDuration: number): ContentSegment[] => {
    // Diviser le contenu en phrases
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length === 0) return [];
    
    // Calculer la durée moyenne par segment
    const avgDurationPerSegment = totalDuration / sentences.length;
    let currentTime = 0;
    
    return sentences.map((sentence, index) => {
      const text = sentence.trim();
      // Estimer la durée basée sur la longueur du texte (plus intelligent)
      const wordsCount = text.split(' ').length;
      const estimatedDuration = Math.max(3, Math.min(10, wordsCount * 0.4)); // Entre 3 et 10 secondes
      
      const startTime = currentTime;
      const endTime = currentTime + estimatedDuration;
      currentTime = endTime + 0.5; // Petite pause entre segments
      
      // Déterminer le type de segment
      let type: 'paragraph' | 'dialogue' | 'description' | 'title' = 'description';
      if (index === 0) type = 'title';
      else if (text.includes('"') || text.includes('«') || text.includes('»')) type = 'dialogue';
      else type = 'paragraph';
      
      return {
        id: index + 1,
        startTime,
        endTime,
        text,
        type
      };
    });
  };

  // Charger les données depuis l'API
  const fetchStoryData = async () => {
  const storyId = getStoryIdFromUrl();
  try {
    setLoading(true);
    setError(null);

    console.log(`Fetching story data for ID: ${storyId}`);
    const response = await fetch(`http://localhost:3000/api/story_chapter?story_id=${storyId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: APIResponse = await response.json();
    console.log('API Response:', data);
    
    if (!data.success || !data.story || !data.chapters || data.chapters.length === 0) {
      throw new Error('Données invalides ou histoire non trouvée');
    }

    setStory(data.story);

    // Transformer les chapitres ET tester les URLs
   const transformedChapters = data.chapters.map((chapter, index) => {
  // Utiliser directement audio_url puisque ce sont des fichiers audio
  const audioUrl = chapter.audio_url;
        // Tester l'URL si elle existe
        if (audioUrl) {
          console.log(`Test de l'URL pour le chapitre ${index + 1}:`, audioUrl);
 console.log(`URL du chapitre ${index + 1}:`, audioUrl);
          if (!audioUrl) {
            console.warn(`URL invalide pour le chapitre ${index + 1}:`, audioUrl);
          }
        }
        
        const estimatedDuration = Math.max(60, chapter.content.length * 0.1);
        const contentSegments = generateContentSegments(
          chapter.content, 
          chapter.duration || estimatedDuration
        );

        return {
          ...chapter,
         audio_url: audioUrl,
          duration: chapter.duration || estimatedDuration,
          contentSegments
        };
      })
    ;

    setChapters(transformedChapters);
    setCurrentChapterIndex(0);

  } catch (err) {
    console.error('Failed to load story data:', err);
    setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement');
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchStoryData();
  }, []);

  const currentChapter = chapters[currentChapterIndex];

  // Synchronisation du texte avec la vidéo
  useEffect(() => {
    if (!currentChapter?.contentSegments) return;

    // Trouver le segment actuel
    const activeSegment = currentChapter.contentSegments.find(
      seg => currentTime >= seg.startTime && currentTime < seg.endTime
    );

    // Trouver le segment suivant
    const nextSegment = currentChapter.contentSegments.find(
      seg => seg.startTime > currentTime
    );

    if (activeSegment && activeSegment.id !== currentSegment?.id) {
      setCurrentSegment(activeSegment);
      
      // Auto-scroll vers le segment actuel
      if (textContainerRef.current) {
        const segmentElement = textContainerRef.current.querySelector(`[data-segment-id="${activeSegment.id}"]`);
        if (segmentElement) {
          segmentElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    }

    setUpcomingSegment(nextSegment || null);

    // Calculer le progrès dans le segment actuel
    if (activeSegment) {
      const segmentDuration = activeSegment.endTime - activeSegment.startTime;
      const segmentElapsed = currentTime - activeSegment.startTime;
      setSegmentProgress(Math.max(0, Math.min(1, segmentElapsed / segmentDuration)));
    }

  }, [currentTime, currentChapter, currentSegment?.id]);

  // Formater le temps
  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Contrôles vidéo
 
const togglePlayPause = async () => {
  if (!videoRef.current) return;
  
  const audio = videoRef.current;
  
  try {
    if (audio.paused) {
      console.log('Tentative de lecture...');
      await audio.play();
      setIsPlaying(true);
      setError(null);
      console.log('Lecture démarrée');
    } else {
      audio.pause();
      setIsPlaying(false);
      console.log('Lecture en pause');
    }
  } catch (error) {
    console.error('Erreur de lecture:', error);
    setError('Impossible de lire le fichier audio.');
    setIsPlaying(false);
  }
  
  resetControlsTimeout();
};

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
    resetControlsTimeout();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
    resetControlsTimeout();
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
    resetControlsTimeout();
  };

  const goToSegment = (segmentId: number) => {
    if (!currentChapter?.contentSegments) return;
    
    const segment = currentChapter.contentSegments.find(s => s.id === segmentId);
    if (segment && videoRef.current) {
      videoRef.current.currentTime = segment.startTime;
      setCurrentTime(segment.startTime);
    }
    resetControlsTimeout();
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentTime(0);
      resetControlsTimeout();
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentTime(0);
      resetControlsTimeout();
    }
  };

  const shareContent = () => {
    const shareData = {
      title: story?.title || 'قصة مرئية',
      text: `${story?.title} - ${currentChapter?.title}\n${story?.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('تم نسخ معلومات القصة!');
    }
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerContainerRef.current?.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
    resetControlsTimeout();
  };

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setControlsTimeout(setTimeout(() => setShowControls(false), 4000));
  };

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  // Effets pour gérer les événements vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentChapter) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      if (!isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };
    
    const handleLoadStart = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentChapterIndex < chapters.length - 1 && autoPlay) {
        setTimeout(() => handleNextChapter(), 2000);
      }
    };
    
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercentage = (bufferedEnd / duration) * 100;
        setBuffered(bufferedPercentage);
      }
    };

    
const handleError = (e: any) => {
  console.error('Audio error:', e);
  const error = e.target.error;
  let errorMessage = 'خطأ في تحميل الصوت';
  
  if (error) {
    switch (error.code) {
      case error.MEDIA_ERR_NETWORK:
        errorMessage = 'خطأ في الشبكة';
        break;
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage = 'تنسيق الملف غير مدعوم';
        break;
      default:
        errorMessage = 'خطأ في تشغيل الصوت';
    }
  }
  
  setError(errorMessage);
  setIsBuffering(false);
};

    // Événements vidéo
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('durationchange', updateDuration);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('error', handleError);

    // Configuration vidéo
    const media = video; // C'est maintenant un élément audio
media.volume = volume;
media.muted = isMuted;
media.playbackRate = playbackSpeed;

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('durationchange', updateDuration);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('error', handleError);
    };
  }, [currentChapter, volume, isMuted, playbackSpeed, currentChapterIndex, autoPlay]);

  // Initialiser le timeout des contrôles
  useEffect(() => {
    resetControlsTimeout();
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Changer de chapitre automatiquement
  useEffect(() => {
    if (videoRef.current && currentChapter) {
      videoRef.current.load(); // Recharger la vidéo
      setCurrentTime(0);
      if (isPlaying) {
        // Petite pause pour laisser la vidéo se charger
        setTimeout(() => {
          videoRef.current?.play().catch(console.error);
        }, 500);
      }
    }
  }, [currentChapterIndex]);

  // Affichage des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-violet-500" />
          <h2 className="text-2xl font-bold text-white mb-2">جاري تحميل القصة...</h2>
          <p className="text-slate-300">تحضير المحتوى المرئي والنصي</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
          <h2 className="text-2xl font-bold mb-4 text-white">خطأ في التحميل</h2>
          <p className="mb-6 text-slate-300 leading-relaxed">{error}</p>
          <button
            onClick={fetchStoryData}
            className="px-6 py-3 rounded-lg font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!story || !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-slate-500" />
          <h2 className="text-xl text-white">لا توجد بيانات للعرض</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900" onMouseMove={handleMouseMove}>
      {/* En-tête */}
      <header className="sticky top-0 z-20 p-4 flex items-center justify-between backdrop-blur-md bg-slate-900/95 border-b border-slate-800">
        <button 
          onClick={() => window.history.back()}
          className="p-2 rounded-full text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center flex-1 px-4">
          <h1 className="text-lg font-bold truncate text-white">
            {story.title}
          </h1>
          <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
            <Video className="w-4 h-4" />
            {story.author} • الفصل {currentChapterIndex + 1} من {chapters.length}
            {duration > 0 && (
              <>
                <Clock className="w-4 h-4 ml-2" />
                {formatTime(currentTime)} / {formatTime(duration)}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChapterList(!showChapterList)}
            className="p-2 text-white hover:bg-slate-800 rounded-full transition-colors"
            title="قائمة الفصول"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-white hover:bg-slate-800'}`}
            title="إضافة للمفضلة"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={shareContent}
            className="p-2 text-white hover:bg-slate-800 rounded-full transition-colors"
            title="مشاركة"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Zone du lecteur vidéo principal */}
        <div className="flex-1">
          <div 
            ref={playerContainerRef}
            className="relative bg-black group"
            style={{ aspectRatio: isFullscreen ? 'auto' : '16/9' }}
          >
            {/* Vidéo principale */}
            
<audio
  ref={videoRef}
  className="w-full h-full"
  preload="auto"
  playsInline
  controls={false}
>
  <source 
    src={currentChapter.audio_url} 
    type="audio/mpeg"
  />
  <p className="text-white text-center p-4">
    متصفحك لا يدعم تشغيل الصوت
  </p>
</audio>
<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
  <div className="absolute inset-0 opacity-30">
    <img
      src={currentChapter.image_url || story.cover_img_url}
      alt={currentChapter.title}
      className="w-full h-full object-cover"
    />
  </div>
  
  <div className="relative z-10 text-center">
    <div className="mb-8">
      <img
        src={currentChapter.image_url || story.cover_img_url}
        alt={currentChapter.title}
        className="w-48 h-48 rounded-full mx-auto shadow-2xl border-4 border-white/20"
      />
    </div>
    
    {isPlaying && (
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 bg-white rounded-full animate-pulse"
            style={{
              height: `${20 + Math.random() * 30}px`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    )}
    
    <h2 className="text-2xl font-bold text-white mb-2">
      {currentChapter.title}
    </h2>
    <p className="text-white/80">
      قصة صوتية • {formatTime(currentTime)} / {formatTime(duration)}
    </p>
  </div>
</div>


            {/* Sous-titres synchronisés */}
            {showSubtitles && currentSegment && (
              <div className="absolute bottom-20 left-4 right-4 text-center">
                <div className="inline-block bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg max-w-4xl">
                  <p 
                    className="text-lg leading-relaxed font-medium"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {currentSegment.text}
                  </p>
                  
                  {/* Barre de progression du sous-titre */}
                  <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 transition-all duration-300"
                      style={{ width: `${segmentProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Indicateur de buffering */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-3" />
                  <p className="text-white text-sm">جاري التحميل...</p>
                </div>
              </div>
            )}
            
            {/* Overlay de contrôles */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Contrôles supérieurs */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="flex gap-2">
                  {/* Contrôles des sous-titres */}
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`p-2 rounded-full text-white transition-colors ${
                      showSubtitles ? 'bg-violet-600' : 'bg-black/50 hover:bg-black/70'
                    }`}
                    title="تشغيل/إيقاف الترجمة"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  
                  {showSubtitles && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                        className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 text-sm transition-colors"
                        title="تصغير النص"
                      >
                        A-
                      </button>
                      <button
                        onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                        className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 text-sm transition-colors"
                        title="تكبير النص"
                      >
                        A+
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {/* Menu des paramètres */}
                  <div className="relative group">
                    <button className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 top-12 bg-slate-800 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto min-w-48">
                      <div className="text-white text-sm space-y-3">
                        <div>
                          <p className="text-xs text-slate-400 mb-2">سرعة التشغيل</p>
                          <div className="grid grid-cols-2 gap-1">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                              <button
                                key={speed}
                                onClick={() => setPlaybackSpeed(speed)}
                                className={`px-2 py-1 rounded text-xs transition-colors ${
                                  playbackSpeed === speed ? 'bg-violet-600 text-white' : 'hover:bg-slate-700'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={autoPlay}
                              onChange={(e) => setAutoPlay(e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-xs">التشغيل التلقائي</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    title="ملء الشاشة"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Bouton de lecture central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="p-6 bg-black/60 text-white rounded-full hover:bg-black/80 shadow-lg transition-all transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-12 h-12" />
                  ) : (
                    <Play className="w-12 h-12 pl-2" />
                  )}
                </button>
              </div>
              
              {/* Contrôles inférieurs */}
              <div className="absolute bottom-4 left-4 right-4 space-y-3">
                {/* Barre de progression avec marqueurs */}
                <div className="relative group">
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden group-hover:h-3 transition-all">
                    {/* Barre tamponnée */}
                    <div 
                      className="absolute h-full bg-white/50"
                      style={{ width: `${buffered}%` }}
                    />
                    {/* Barre de progression */}
                    <div 
                      className="absolute h-full bg-red-600 transition-all duration-200"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                    {/* Marqueurs de segments */}
                    {currentChapter.contentSegments?.map((segment, index) => (
                      <div
                        key={segment.id}
                        className="absolute top-0 w-0.5 h-full bg-violet-400/70 cursor-pointer hover:bg-violet-400 transition-colors z-10"
                        style={{ left: `${duration ? (segment.startTime / duration) * 100 : 0}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToSegment(segment.id);
                        }}
                        title={`${segment.text.substring(0, 50)}...`}
                      />
                    ))}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer"
                  />
                  
                  {/* Informations temps */}
                  <div className="flex justify-between text-xs text-white/90 mt-2">
                    <div className="flex items-center gap-3">
                      <span>{formatTime(currentTime)}</span>
                      {currentSegment && (
                        <span className="text-violet-300 bg-black/50 px-2 py-1 rounded">
                          {currentSegment.id}/{currentChapter.contentSegments?.length}
                        </span>
                      )}
                    </div>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                {/* Contrôles de navigation et volume */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePreviousChapter}
                      disabled={currentChapterIndex === 0}
                      className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30 transition-colors"
                      title="الفصل السابق"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => skipTime(-10)}
                      className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                      title="10 ثوان للخلف"
                    >
                      <Rewind className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => skipTime(10)}
                      className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                      title="10 ثوان للأمام"
                    >
                      <FastForward className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={handleNextChapter}
                      disabled={currentChapterIndex === chapters.length - 1}
                      className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30 transition-colors"
                      title="الفصل التالي"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Contrôle du volume */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleMute}
                      className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume * 100}
                      onChange={handleVolumeChange}
                      className="w-24 h-1"
                    />
                    <span className="text-xs text-white/70 w-8 text-center">
                      {Math.round(isMuted ? 0 : volume * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bouton play quand contrôles cachés */}
            {!showControls && !isPlaying && (
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 m-auto w-20 h-20 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-all transform hover:scale-105"
              >
                <Play className="w-10 h-10 text-white pl-2" />
              </button>
            )}
            
            {/* Indicateur de lecture */}
            {isPlaying && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 px-3 py-2 rounded-full text-white text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                مباشر
              </div>
            )}

            {/* Aperçu du segment suivant */}
            {upcomingSegment && showControls && (
              <div className="absolute bottom-32 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm max-w-xs">
                <p className="text-slate-300 text-xs mb-1">التالي:</p>
                <p className="line-clamp-2 text-xs">{upcomingSegment.text.substring(0, 80)}...</p>
                <p className="text-violet-300 text-xs mt-1">
                  في {formatTime(upcomingSegment.startTime - currentTime)}
                </p>
              </div>
            )}
          </div>
          
          {/* Informations sur la vidéo */}
          <div className="p-6 bg-slate-900">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {currentChapter.title} - الفصل {currentChapterIndex + 1}
                </h1>
                <div className="flex items-center gap-4 text-slate-400 text-sm flex-wrap">
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    فيديو
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(duration)}
                  </span>
                  <span>•</span>
                  <span>{story.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {currentChapter.contentSegments?.length} مقطع
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    isLiked ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'مُعجب به' : 'إعجاب'}</span>
                </button>
                
                <button
                  onClick={shareContent}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-full transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة</span>
                </button>

                {currentChapter.video_url && (
                  <a
                    href={currentChapter.video_url}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Description et contenu synchronisé */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    وصف القصة
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {story.description}
                  </p>
                  
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-white font-medium mb-2">محتوى هذا الفصل:</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {currentChapter.content.substring(0, 200)}...
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-slate-400">التقدم</p>
                      <p className="text-white font-medium">
                        {currentChapterIndex + 1} من {chapters.length} فصل
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">المقطع الحالي</p>
                      <p className="text-white font-medium">
                        {currentSegment?.id || 1} من {currentChapter.contentSegments?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">المدة الإجمالية</p>
                      <p className="text-white font-medium">
                        {formatTime(chapters.reduce((acc, ch) => acc + (ch.duration || 0), 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">نوع المحتوى</p>
                      <p className="text-white font-medium">قصة مرئية</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Panneau de navigation rapide */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">التنقل السريع</h3>
                
                {/* Navigation par segments */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">مقاطع هذا الفصل:</p>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {currentChapter.contentSegments?.slice(0, 8).map((segment) => (
                      <button
                        key={segment.id}
                        onClick={() => goToSegment(segment.id)}
                        className={`w-full text-left p-3 rounded text-xs transition-all ${
                          currentSegment?.id === segment.id 
                            ? 'bg-violet-600 text-white shadow-lg' 
                            : 'hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">مقطع {segment.id}</span>
                          <span className="text-xs opacity-70">
                            {formatTime(segment.startTime)}
                          </span>
                        </div>
                        <p className="line-clamp-2">
                          {segment.text.substring(0, 60)}...
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            segment.type === 'title' ? 'bg-amber-900/30 text-amber-300' :
                            segment.type === 'dialogue' ? 'bg-emerald-900/30 text-emerald-300' :
                            'bg-blue-900/30 text-blue-300'
                          }`}>
                            {segment.type === 'title' ? 'عنوان' : 
                             segment.type === 'dialogue' ? 'حوار' : 'وصف'}
                          </span>
                          {currentSegment?.id === segment.id && (
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {(currentChapter.contentSegments?.length || 0) > 8 && (
                    <button
                      onClick={() => setShowChapterList(true)}
                      className="w-full p-2 text-center text-sm text-violet-400 hover:text-violet-300 transition-colors border border-violet-400/30 rounded"
                    >
                      عرض جميع المقاطع ({currentChapter.contentSegments?.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Liste des chapitres et segments */}
        {showChapterList && (
          <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col max-h-screen">
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  فصول القصة
                </h3>
                <button
                  onClick={() => setShowChapterList(false)}
                  className="p-1 text-slate-400 hover:text-white lg:hidden"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-400">
                {chapters.length} فصل • {chapters.reduce((acc, ch) => acc + (ch.contentSegments?.length || 0), 0)} مقطع
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border-b border-slate-800">
                  {/* عنوان الفصل */}
                  <div
                    onClick={() => {
                      setCurrentChapterIndex(chapterIndex);
                      setCurrentTime(0);
                    }}
                    className={`p-4 cursor-pointer transition-colors ${
                      chapterIndex === currentChapterIndex 
                        ? 'bg-slate-800 border-r-4 border-red-600' 
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 relative">
                        <img
                          src={chapter.image_url || story.cover_img_url}
                          alt={chapter.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm mb-1 ${
                          chapterIndex === currentChapterIndex ? 'text-white' : 'text-slate-300'
                        }`}>
                          {chapter.title}
                        </h4>
                        <p className="text-xs text-slate-400 mb-1">
                          الفصل {chapterIndex + 1} • {formatTime(chapter.duration || 0)}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {chapter.content.substring(0, 80)}...
                        </p>
                      </div>
                      
                      {chapterIndex === currentChapterIndex && isPlaying && (
                        <div className="flex items-center gap-1 text-red-500">
                          <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" />
                          <div className="w-1 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Segments du chapitre actuel */}
                  {chapterIndex === currentChapterIndex && (
                    <div className="bg-slate-850">
                      {chapter.contentSegments?.map((segment) => (
                        <div
                          key={segment.id}
                          onClick={() => goToSegment(segment.id)}
                          className={`px-6 py-3 cursor-pointer border-l-2 transition-all ${
                            currentSegment?.id === segment.id
                              ? 'bg-violet-900/30 border-violet-500 text-white'
                              : upcomingSegment?.id === segment.id
                              ? 'bg-slate-700/20 border-slate-500 text-slate-200'
                              : 'border-transparent text-slate-400 hover:bg-slate-700/10 hover:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">
                                مقطع {segment.id}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                segment.type === 'title' ? 'bg-amber-900/30 text-amber-300' :
                                segment.type === 'dialogue' ? 'bg-emerald-900/30 text-emerald-300' :
                                'bg-blue-900/30 text-blue-300'
                              }`}>
                                {segment.type === 'title' ? 'ع' : segment.type === 'dialogue' ? 'ح' : 'و'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">
                                {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                              </span>
                              {currentSegment?.id === segment.id && (
                                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs line-clamp-3 leading-relaxed">
                            {segment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contrôles mobiles fixes */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 lg:hidden">
        {/* Informations du segment actuel */}
        {currentSegment && showSubtitles && (
          <div className="mb-3 p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex-1">
                <p className="text-slate-400">مقطع {currentSegment.id} من {currentChapter.contentSegments?.length}</p>
                <p className="text-white font-medium line-clamp-2 text-sm leading-relaxed">
                  {currentSegment.text}
                </p>
              </div>
            </div>
            
            {/* بار تقدم المقطع */}
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 transition-all duration-300"
                style={{ width: `${segmentProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* أزرار التحكم الرئيسية */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handlePreviousChapter}
            disabled={currentChapterIndex === 0}
            className="p-3 text-white disabled:opacity-30 hover:bg-slate-800 rounded-full transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => skipTime(-10)}
              className="p-2 text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <Rewind className="w-4 h-4" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 pl-1" />}
            </button>
            
            <button
              onClick={() => skipTime(10)}
              className="p-2 text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handleNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
            className="p-3 text-white disabled:opacity-30 hover:bg-slate-800 rounded-full transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        
        {/* شريط التقدم مع معالم المقاطع */}
        <div className="relative mb-3">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            {/* شريط التحميل */}
            <div 
              className="absolute h-full bg-slate-600"
              style={{ width: `${buffered}%` }}
            />
            {/* شريط التقدم */}
            <div 
              className="absolute h-full bg-red-600 transition-all duration-200"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
            {/* معالم المقاطع */}
            {currentChapter.contentSegments?.map((segment, index) => (
              <div
                key={segment.id}
                className="absolute top-0 w-0.5 h-full bg-violet-400/70 cursor-pointer"
                style={{ left: `${duration ? (segment.startTime / duration) * 100 : 0}%` }}
                onClick={() => goToSegment(segment.id)}
              />
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer"
          />
        </div>
        
        {/* معلومات الوقت وأزرار إضافية */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300">{formatTime(currentTime)}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-2 rounded transition-colors ${
                showSubtitles ? 'text-violet-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowChapterList(!showChapterList)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {showChapterList ? <ChevronDown className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
            
            <button
              onClick={shareContent}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* مؤشر السرعة والصوت */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="w-16 h-1"
            />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>السرعة: {playbackSpeed}x</span>
            <span>•</span>
            <span>فيديو</span>
          </div>
        </div>
      </div>

      {/* Style CSS personnalisé */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Barres de défilement personnalisées */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
        
        /* Styles pour les contrôles de portée */
        input[type="range"] {
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.2);
          height: 4px;
          border-radius: 2px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
        }
        
        input[type="range"]::-moz-range-track {
          background: rgba(255, 255, 255, 0.2);
          height: 4px;
          border-radius: 2px;
          border: none;
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        /* Transitions fluides */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        /* Focus pour accessibilité */
        button:focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }
        
        /* Améliorations pour mobile */
        @media (max-width: 768px) {
          .lg\\:hidden {
            display: none !important;
          }
          
          /* Padding pour éviter le chevauchement avec les contrôles fixes */
          body {
            padding-bottom: 200px;
          }
        }
        
        /* Optimisations de performance */
        .transform {
          transform: translateZ(0);
          will-change: transform;
        }
        
        /* Réduction de mouvement pour accessibilité */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-spin,
          .transition-all {
            animation: none;
            transition: none;
          }
        }
        
        /* Styles pour les sous-titres */
        .subtitle-container {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          border-radius: 8px;
          padding: 12px 24px;
          margin: 0 auto;
          max-width: 90%;
          text-align: center;
        }
        
        /* Animation de chargement */
        .loading-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        /* Amélioration du contraste pour la lisibilité */
        .high-contrast {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        /* Styles personnalisés pour les éléments vidéo */
        video {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        
        video::-webkit-media-controls {
          display: none !important;
        }
        
        video::-webkit-media-controls-panel {
          display: none !important;
        }
        
        /* Indicateurs de segments sur la barre de progression */
        .segment-marker {
          position: absolute;
          top: 0;
          width: 2px;
          height: 100%;
          background: rgba(139, 92, 246, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .segment-marker:hover {
          background: rgba(139, 92, 246, 1);
          width: 3px;
          transform: scaleY(1.2);
        }
        
        /* Styles pour les tooltips */
        .tooltip {
          position: relative;
        }
        
        .tooltip:hover::after {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
        }
        
        /* Amélioration de l'interface RTL pour l'arabe */
        .rtl {
          direction: rtl;
          text-align: right;
        }
        
        .rtl .flex {
          flex-direction: row-reverse;
        }
        
        /* États de chargement pour les vidéos */
        .video-loading {
          background: linear-gradient(45deg, #1e293b, #334155);
          background-size: 400% 400%;
          animation: gradientShift 3s ease infinite;
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        /* Responsive design avancé */
        @media (max-width: 640px) {
          .subtitle-container {
            padding: 8px 16px;
            font-size: 14px;
            bottom: 80px;
          }
          
          .video-controls {
            padding: 8px;
          }
          
          .chapter-info {
            font-size: 12px;
          }
        }
        
        /* Animations douces pour les changements d'état */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Styles pour les segments actifs */
        .segment-active {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
          border-left: 4px solid rgb(139, 92, 246);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
        }
        
        /* Amélioration des boutons */
        .btn-primary {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border: none;
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #b91c1c, #dc2626);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
        }
        
        .btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.3);
        }
      `}</style>
    </div>
  );
};

export default StoryVideoPlayer;