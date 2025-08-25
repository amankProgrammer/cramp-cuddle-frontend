import { useState, useEffect, useRef } from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, Film, Music, Maximize, List, Tv } from 'lucide-react';

// Use Vite's glob import to get all audio files from the music directory
const audioFiles = import.meta.glob('../assets/music/*.{mp3,ogg,wav}', { eager: true });
// Use Vite's glob import to get all video files
const videoFiles = import.meta.glob('../assets/videos/*.{mp4,webm,mov}', { eager: true });

interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
  type: 'audio' | 'video';
}

const MusicPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio');
  const [activePlaylist, setActivePlaylist] = useState<'audio' | 'video' | 'all'>('all');
  const [bassIntensity, setBassIntensity] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Get current media reference based on type
  const getCurrentMediaRef = () => {
    return mediaType === 'audio' ? audioRef.current : videoRef.current;
  };

  // Process media files from the directories on component mount
  useEffect(() => {
    // Process audio files
    const processedAudioTracks: Track[] = Object.entries(audioFiles).map(([path, module], index) => {
      // Extract filename from path
      const fileName = path.split('/').pop() || 'Unknown';

      // Remove file extension
      const nameWithoutExt = fileName.replace(/\.(mp3|ogg|wav)$/, '');

      // Extract artist and title from filename (format: artist_-_title.mp3)
      // or use filename as title if format doesn't match
      let artist = 'Unknown Artist';
      let title = nameWithoutExt;

      const match = nameWithoutExt.match(/(.+?)_-_(.+)/);
      if (match) {
        artist = match[1].replace(/_/g, ' ');
        title = match[2].replace(/_/g, ' ');
      }

      return {
        id: index + 1,
        title: title,
        artist: artist,
        src: (module as any).default,
        type: 'audio' as const
      };
    });

    // Process video files
    const processedVideoTracks: Track[] = Object.entries(videoFiles).map(([path, module], index) => {
      // Extract filename from path
      const fileName = path.split('/').pop() || 'Unknown';

      // Remove file extension
      const nameWithoutExt = fileName.replace(/\.(mp4|webm|mov)$/, '');

      // Extract artist and title from filename (format: artist_-_title.mp4)
      // or use filename as title if format doesn't match
      let artist = 'Unknown Artist';
      let title = nameWithoutExt;

      const match = nameWithoutExt.match(/(.+?)_-_(.+)/);
      if (match) {
        artist = match[1].replace(/_/g, ' ');
        title = match[2].replace(/_/g, ' ');
      }

      return {
        id: processedAudioTracks.length + index + 1,
        title: title,
        artist: artist,
        src: (module as any).default,
        type: 'video' as const
      };
    });

    // Combine audio and video tracks
    setTracks([...processedAudioTracks, ...processedVideoTracks]);
  }, []);

  // Initialize media elements
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    // Update time display during playback for audio
    const handleAudioTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      simulateBassIntensity();
    };

    // Move to next track when current audio ends
    const handleAudioEnded = () => {
      handleNext();
    };

    // Set track duration when audio metadata is loaded
    const handleAudioMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleAudioTimeUpdate);
    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('loadedmetadata', handleAudioMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.removeEventListener('loadedmetadata', handleAudioMetadata);
      audio.pause();
      audio.src = '';
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Simulate bass intensity for speaker animation
  const simulateBassIntensity = () => {
    if (!isPlaying) {
      setBassIntensity(0);
      return;
    }
    
    // Generate a random value that changes over time to simulate bass
    const newIntensity = Math.random() * 0.5 + (Math.sin(Date.now() / 500) + 1) / 2 * 0.5;
    setBassIntensity(newIntensity);
    
    // Continue the animation
    animationFrameRef.current = requestAnimationFrame(simulateBassIntensity);
  };

  // Stop all media playback
  const stopAllMedia = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Update media type and handle media switching
  const handleMediaTypeChange = (newType: 'audio' | 'video') => {
    stopAllMedia();
    setIsPlaying(false);
    setMediaType(newType);
  };

  // Load and play track when currentTrackIndex changes
  useEffect(() => {
    if (tracks.length === 0) return;

    const track = tracks[currentTrackIndex];
    
    // Stop all media before switching tracks
    stopAllMedia();
    
    // Set media type based on current track
    setMediaType(track.type);
    
    // Handle audio playback
    if (track.type === 'audio' && audioRef.current) {
      videoRef.current?.pause(); // Ensure video is stopped
      audioRef.current.src = track.src;
      audioRef.current.load();

      if (isPlaying) {
        audioRef.current.play().catch(() => {
          console.log("Couldn't play audio automatically. Click play to start.");
          setIsPlaying(false);
        });
      }
    }
    
    // Handle video playback
    if (track.type === 'video' && videoRef.current) {
      audioRef.current?.pause(); // Ensure audio is stopped
      videoRef.current.src = track.src;
      videoRef.current.load();
      
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          console.log("Couldn't play video automatically. Click play to start.");
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, tracks]);

  // Handle play/pause toggling
  const handlePlayPause = () => {
    const mediaElement = getCurrentMediaRef();
    if (!mediaElement) return;

    if (!isPlaying) {
      // Stop the other media type before playing
      if (mediaType === 'audio' && videoRef.current) {
        videoRef.current.pause();
      } else if (mediaType === 'video' && audioRef.current) {
        audioRef.current.pause();
      }
      mediaElement.play().catch(() => {
        console.log("Playback failed. Try clicking play again.");
        setIsPlaying(false);
      });
    } else {
      mediaElement.pause();
    }
    setIsPlaying(!isPlaying);
  };

  // Skip to previous track
  const handlePrevious = () => {
    setCurrentTrackIndex(prev =>
      prev === 0 ? tracks.length - 1 : prev - 1
    );
  };

  // Skip to next track
  const handleNext = () => {
    setCurrentTrackIndex(prev =>
      prev === tracks.length - 1 ? 0 : prev + 1
    );
  };

  // Toggle mute
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Toggle fullscreen for video
  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit full-screen mode: ${err.message}`);
      });
    } else {
      videoRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  // Format time for display (mm:ss)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Filter tracks by media type
  const filterTracksByType = (type: 'audio' | 'video') => {
    return tracks.filter(track => track.type === type);
  };

  // Get filtered tracks based on active playlist
  const getFilteredTracks = () => {
    if (activePlaylist === 'all') return tracks;
    return tracks.filter(track => track.type === activePlaylist);
  };
  
  // Get current track
  const currentTrack = tracks[currentTrackIndex];
  
  // Animated Speaker component for theater effect
  const AnimatedSpeaker = ({ side, bassIntensity }: { side: 'left' | 'right', bassIntensity: number }) => {
    // Calculate animation values based on bass intensity
    const wooferScale = 1 + bassIntensity * 0.15;
    const midScale = 1 + bassIntensity * 0.1;
    const tweeterScale = 1 + bassIntensity * 0.05;
    
    return (
      <div className={`hidden md:block w-32 h-full ${side === 'left' ? 'mr-4' : 'ml-4'}`}>
        <div className="h-full flex flex-col justify-between py-4">
          {/* Woofer (large speaker) */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg h-1/3 w-full flex items-center justify-center p-2 shadow-lg border border-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-30"></div>
            <div 
              className="bg-gradient-to-b from-gray-600 to-gray-800 rounded-full flex items-center justify-center relative"
              style={{ 
                width: '80%', 
                height: '80%',
                transform: `scale(${wooferScale})`,
                transition: 'transform 50ms ease-in-out'
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-500 to-transparent opacity-10"></div>
              <div 
                className="bg-gradient-to-b from-gray-900 to-black rounded-full w-3/4 h-3/4 flex items-center justify-center relative"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-gray-800 to-transparent opacity-20"></div>
                <div className="bg-black rounded-full w-1/2 h-1/2 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 to-transparent opacity-30"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mid-range speaker */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg h-1/3 w-full flex items-center justify-center p-2 shadow-lg border border-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-30"></div>
            <div 
              className="bg-gradient-to-b from-gray-600 to-gray-800 rounded-full flex items-center justify-center relative"
              style={{ 
                width: '70%', 
                height: '70%',
                transform: `scale(${midScale})`,
                transition: 'transform 50ms ease-in-out'
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-500 to-transparent opacity-10"></div>
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-full w-3/4 h-3/4 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-gray-800 to-transparent opacity-20"></div>
              </div>
            </div>
          </div>
          
          {/* Tweeter (small speaker) */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg h-1/3 w-full flex items-center justify-center p-2 shadow-lg border border-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-30"></div>
            <div 
              className="bg-gradient-to-b from-gray-600 to-gray-800 rounded-full flex items-center justify-center relative"
              style={{ 
                width: '60%', 
                height: '60%',
                transform: `scale(${tweeterScale})`,
                transition: 'transform 50ms ease-in-out'
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-500 to-transparent opacity-10"></div>
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-full w-2/3 h-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="card bg-gray-900 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Home Theater</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleMediaTypeChange('audio')} 
              className={`p-2 rounded-md ${mediaType === 'audio' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              title="Switch to Audio"
            >
              <Music size={20} />
            </button>
            <button 
              onClick={() => handleMediaTypeChange('video')} 
              className={`p-2 rounded-md ${mediaType === 'video' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              title="Switch to Video"
            >
              <Film size={20} />
            </button>
          </div>
        </div>

        {tracks.length === 0 ? (
          <div className="text-center p-8 bg-violet-50 rounded-lg">
            <p className="text-violet-700 mb-2">No media files found</p>
            <p className="text-sm text-violet-600">
              Add your MP3, OGG, WAV files to the src/assets/music directory<br />
              Add your MP4, WEBM, MOV files to the src/assets/videos directory
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Theater room effect with increased width */}
            <div className="w-full max-w-6xl mx-auto p-4 bg-gradient-to-b from-gray-800 to-black rounded-t-lg border-b-4 border-red-800">
              <div className="text-center mb-2">
                <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Now Playing</span>
              </div>
            </div>
            
            {/* Video player with speakers - increased size */}
            <div className="flex justify-center items-center bg-black p-4 w-full max-w-6xl mx-auto">
              <AnimatedSpeaker side="left" bassIntensity={bassIntensity} />
              
              <div className="relative w-full overflow-hidden rounded-lg bg-black border-2 border-gray-800 shadow-2xl">
                {/* Increased aspect ratio container */}
                <div className="relative pt-[62.5%] bg-black"> {/* 16:10 aspect ratio for larger height */}
                  {mediaType === 'video' ? (
                    <video 
                      ref={videoRef} 
                      className="absolute top-0 left-0 w-full h-full object-contain bg-black" 
                      playsInline 
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                        <div className={`w-40 h-40 rounded-full bg-gray-900 flex items-center justify-center transition-all ${isPlaying ? 'animate-pulse' : ''}`}>
                          <div className="text-center p-4">
                            <h3 className="font-semibold text-white text-lg mb-1 truncate max-w-36">
                              {currentTrack?.title || "Unknown"}
                            </h3>
                            <p className="text-sm text-gray-400 truncate max-w-36">
                              {currentTrack?.artist || "Unknown Artist"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {mediaType === 'video' && (
                    <button
                      onClick={toggleFullScreen}
                      className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                      title="Toggle fullscreen"
                    >
                      <Maximize size={24} />
                    </button>
                  )}
                </div>
              </div>
              
              <AnimatedSpeaker side="right" bassIntensity={bassIntensity} />
            </div>
            
            {/* Theater floor effect - matched width */}
            <div className="w-full max-w-6xl mx-auto p-2 bg-gradient-to-t from-gray-900 to-gray-800 rounded-b-lg">
              <div className="flex justify-center space-x-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i} 
                    className="w-12 h-1.5 bg-red-800 rounded-full opacity-70"
                    style={{
                      animation: isPlaying ? `floorLightPulse 1.5s ease-in-out ${i * 0.3}s infinite` : 'none'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Progress bar and controls - keep existing code but update colors */}
            <div className="mt-6 w-full">
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-700 rounded-full mb-2 overflow-hidden">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>

              {/* Time display */}
              <div className="w-full flex justify-between text-xs text-gray-400 mb-4">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Playback controls */}
              <div className="flex items-center space-x-6 mb-4 justify-center">
                <button
                  onClick={handlePrevious}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <SkipBack size={24} />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>

                <button
                  onClick={handleNext}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <SkipForward size={24} />
                </button>
              </div>

              {/* Volume control */}
              <div className="flex items-center space-x-2 w-full">
                <button
                  onClick={handleMuteToggle}
                  className="text-gray-300"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (isMuted && newVolume > 0) {
                      setIsMuted(false);
                    }
                  }}
                  className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update playlist section to match dark theme */}
      {tracks.length > 0 && (
        <div className="card bg-gradient-to-r from-rose-200 to-pink-200 text-white">
          {/* Keep existing playlist code but update colors to match dark theme */}
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${mediaType === 'video' ? 'text-white' : 'text-violet-700'}`}>Media Library</h2>
            <div className="text-sm text-gray-500">
              {filterTracksByType('audio').length} Audio · {filterTracksByType('video').length} Video
            </div>
          </div>
          
          {/* Playlist type tabs */}
          <div className="flex border-b mb-4 ${mediaType === 'video' ? 'border-gray-700' : 'border-gray-200'}">
            <button
              onClick={() => setActivePlaylist('all')}
              className={`py-2 px-4 font-medium ${activePlaylist === 'all' 
                ? (mediaType === 'video' ? 'text-white border-b-2 border-red-500' : 'text-violet-700 border-b-2 border-violet-500') 
                : (mediaType === 'video' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
            >
              <List size={16} className="inline mr-1" /> All Media
            </button>
            <button
              onClick={() => setActivePlaylist('audio')}
              className={`py-2 px-4 font-medium ${activePlaylist === 'audio' 
                ? (mediaType === 'video' ? 'text-white border-b-2 border-red-500' : 'text-violet-700 border-b-2 border-violet-500') 
                : (mediaType === 'video' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
            >
              <Music size={16} className="inline mr-1" /> Music
            </button>
            <button
              onClick={() => setActivePlaylist('video')}
              className={`py-2 px-4 font-medium ${activePlaylist === 'video' 
                ? (mediaType === 'video' ? 'text-white border-b-2 border-red-500' : 'text-violet-700 border-b-2 border-violet-500') 
                : (mediaType === 'video' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
            >
              <Tv size={16} className="inline mr-1" /> Videos
            </button>
          </div>
          
          {/* Filtered playlist */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getFilteredTracks().map((track, index) => {
              const actualIndex = tracks.findIndex(t => t.id === track.id);
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(actualIndex);
                    setIsPlaying(true);
                  }}
                  className={`w-full p-3 rounded-lg flex items-center transition-all ${mediaType === 'video' 
                    ? (currentTrackIndex === actualIndex ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300') 
                    : (currentTrackIndex === actualIndex ? 'bg-violet-100 text-violet-700' : 'hover:bg-violet-50 text-gray-700')}`}
                >
                  <div className="w-8 flex-shrink-0 flex items-center justify-center">
                    {currentTrackIndex === actualIndex && isPlaying ? (
                      <div className="flex space-x-0.5">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className={`w-1 ${mediaType === 'video' ? 'bg-red-500' : 'bg-violet-500'} rounded-full animate-pulse`}
                            style={{
                              height: `${8 + (i * 3)}px`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>

                  <div className="ml-3 text-left overflow-hidden flex-grow">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className={`text-xs ${mediaType === 'video' ? 'text-gray-400' : 'text-gray-500'} truncate`}>{track.artist}</p>
                  </div>
                  
                  <div className="ml-2 flex-shrink-0">
                    {track.type === 'audio' ? (
                      <Music size={16} className={mediaType === 'video' ? 'text-gray-500' : 'text-gray-400'} />
                    ) : (
                      <Film size={16} className={mediaType === 'video' ? 'text-gray-500' : 'text-gray-400'} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tracks.length === 0 && (
        <div className="bg-violet-50 p-4 rounded-lg text-center">
          <p className="text-violet-700 font-medium mb-2">How to add media files:</p>
          <ol className="list-decimal list-inside text-sm text-violet-600 text-left space-y-1">
            <li>For audio: Create MP3, OGG, or WAV audio files</li>
            <li>For video: Create MP4, WEBM, or MOV video files</li>
            <li>Name files with format: <span className="font-mono bg-violet-100 px-1 rounded">artist_-_title.mp3</span></li>
            <li>Add audio files to <span className="font-mono bg-violet-100 px-1 rounded">src/assets/music/</span> folder</li>
            <li>Add video files to <span className="font-mono bg-violet-100 px-1 rounded">src/assets/videos/</span> folder</li>
            <li>Refresh the page to see your media automatically appear</li>
          </ol>
        </div>
      )}
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes floorLightPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes ambientPulse {
          0%, 100% { opacity: 0.3; width: 100%; }
          50% { opacity: 0.6; width: 95%; }
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
