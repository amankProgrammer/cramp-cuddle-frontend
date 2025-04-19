import { useState, useEffect, useRef } from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

// Use Vite's glob import to get all audio files from the music directory
const audioFiles = import.meta.glob('../assets/music/*.{mp3,ogg,wav}', { eager: true });

interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
}

const MusicPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showSoundCloud, setShowSoundCloud] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState('bollywood');

  // Move soundCloudPlaylists outside of return statement
  const soundCloudPlaylists = {
    bollywood: {
      url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1702546110&color=%23ff5500&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
      title: "Top 50 Bollywood Songs",
      creator: "ViralTones",
      creatorUrl: "https://soundcloud.com/itslovesmusic"
    },
    lofi: {
      url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1566994832&color=%23ff5500&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
      title: "Lofi Beats",
      creator: "Lofi Girl",
      creatorUrl: "https://soundcloud.com/lofigirl"
    },
    meditation: {
      url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1566994832&color=%23ff5500&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
      title: "Meditation & Relaxation",
      creator: "Calm Music",
      creatorUrl: "https://soundcloud.com/calm-music"
    }
  };

  // Update the SoundCloud player section
  return (
    <div className="space-y-6">
      <div className="card">
        const [tracks, setTracks] = useState<Track[]>([]);
        const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
        const [isPlaying, setIsPlaying] = useState(false);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration, setDuration] = useState(0);
        const [volume, setVolume] = useState(0.7);
        const [isMuted, setIsMuted] = useState(false);
  
        const audioRef = useRef<HTMLAudioElement | null>(null);
  
        // Process audio files from the music directory on component mount
        useEffect(() => {
          const processedTracks: Track[] = Object.entries(audioFiles).map(([path, module], index) => {
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
              src: (module as any).default
            };
          });
  
          setTracks(processedTracks);
        }, []);
  
        // Initialize audio element
        useEffect(() => {
          const audio = new Audio();
          audio.volume = volume;
          audioRef.current = audio;
  
          // Update time display during playback
          const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
          };
  
          // Move to next track when current one ends
          const handleEnded = () => {
            handleNext();
          };
  
          // Set track duration when metadata is loaded
          const handleMetadata = () => {
            setDuration(audio.duration);
          };
  
          audio.addEventListener('timeupdate', handleTimeUpdate);
          audio.addEventListener('ended', handleEnded);
          audio.addEventListener('loadedmetadata', handleMetadata);
  
          return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', handleMetadata);
            audio.pause();
            audio.src = '';
          };
        }, []);
  
        // Load and play track when currentTrackIndex changes
        useEffect(() => {
          if (tracks.length === 0 || !audioRef.current) return;
  
          const track = tracks[currentTrackIndex];
          audioRef.current.src = track.src;
          audioRef.current.load();
  
          if (isPlaying) {
            audioRef.current.play().catch(() => {
              // Simple error handling
              console.log("Couldn't play automatically. Click play to start.");
              setIsPlaying(false);
            });
          }
        }, [currentTrackIndex, tracks]);
  
        // Handle play/pause toggling
        useEffect(() => {
          if (!audioRef.current) return;
  
          if (isPlaying) {
            audioRef.current.play().catch(() => {
              console.log("Playback failed. Try clicking play again.");
              setIsPlaying(false);
            });
          } else {
            audioRef.current.pause();
          }
        }, [isPlaying]);
  
        // Update volume
        useEffect(() => {
          if (!audioRef.current) return;
          audioRef.current.volume = isMuted ? 0 : volume;
        }, [volume, isMuted]);
  
        // Play/pause toggle
        const handlePlayPause = () => {
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
  
        // Format time for display (mm:ss)
        const formatTime = (seconds: number) => {
          if (isNaN(seconds)) return "0:00";
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };
  
        // Add this state near the other state declarations
        const [showSoundCloud, setShowSoundCloud] = useState(false);
  
        // Add this button and iframe before the tracks.length === 0 check
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-violet-700">Relaxing Music</h2>
                <button
                  onClick={() => setShowSoundCloud(!showSoundCloud)}
                  className="text-sm text-violet-600 hover:text-violet-800"
                >
                  {showSoundCloud ? 'Show Local Player' : 'Show SoundCloud Player'}
                </button>
              </div>
        
              {showSoundCloud ? (
                <div className="rounded-lg overflow-hidden">
                  <div className="mb-4 flex gap-2">
                    {Object.entries(soundCloudPlaylists).map(([key, playlist]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPlaylist(key)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          selectedPlaylist === key
                            ? 'bg-violet-500 text-white'
                            : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                        }`}
                      >
                        {playlist.title}
                      </button>
                    ))}
                  </div>
                  <iframe
                    width="100%"
                    height="450"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={soundCloudPlaylists[selectedPlaylist].url}
                  ></iframe>
                  <div className="text-xs text-gray-400 mt-2 break-words">
                    <a
                      href={soundCloudPlaylists[selectedPlaylist].creatorUrl}
                      title={soundCloudPlaylists[selectedPlaylist].creator}
                      target="_blank"
                      className="hover:text-violet-500"
                    >
                      {soundCloudPlaylists[selectedPlaylist].creator}
                    </a>
                    {' · '}
                    <span>{soundCloudPlaylists[selectedPlaylist].title}</span>
                  </div>
                </div>
              ) : (
                // Existing player content
                tracks.length === 0 ? (
                  <div className="text-center p-8 bg-violet-50 rounded-lg">
                    <p className="text-violet-700 mb-2">No music files found</p>
                    <p className="text-sm text-violet-600">
                      Add your MP3, OGG, or WAV files to the src/assets/music directory
                    </p>
                  ) : (
                    <div className="flex flex-col items-center">
                      {/* Track info */}
                      <div className="mb-6 text-center">
                        <div className="w-56 h-56 rounded-full bg-gradient-to-r from-violet-200 to-pink-200 flex items-center justify-center mb-4">
                          <div className={`w-48 h-48 rounded-full bg-white flex items-center justify-center transition-all ${isPlaying ? 'animate-pulse' : ''}`}>
                            <div className="text-center p-4">
                              <h3 className="font-semibold text-violet-700 text-lg mb-1 truncate max-w-36">
                                {tracks[currentTrackIndex]?.title || "Unknown"}
                              </h3>
                              <p className="text-sm text-violet-600 truncate max-w-36">
                                {tracks[currentTrackIndex]?.artist || "Unknown Artist"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
            
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-violet-100 rounded-full mb-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-400 to-pink-400"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                      </div>
            
                      {/* Time display */}
                      <div className="w-full flex justify-between text-xs text-gray-500 mb-4">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
            
                      {/* Playback controls */}
                      <div className="flex items-center space-x-6 mb-4">
                        <button
                          onClick={handlePrevious}
                          className="text-violet-600 hover:text-violet-800 transition-colors"
                        >
                          <SkipBack size={24} />
                        </button>
            
                        <button
                          onClick={handlePlayPause}
                          className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-violet-500 to-pink-500 shadow-lg hover:shadow-xl transition-all"
                        >
                          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                        </button>
            
                        <button
                          onClick={handleNext}
                          className="text-violet-600 hover:text-violet-800 transition-colors"
                        >
                          <SkipForward size={24} />
                        </button>
                      </div>
            
                      {/* Volume control */}
                      <div className="flex items-center space-x-2 w-full">
                        <button
                          onClick={handleMuteToggle}
                          className="text-violet-600"
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
                          className="w-full h-2 bg-violet-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
              {/* Playlist */}
              {tracks.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-violet-700 mb-4">Playlist</h2>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {tracks.map((track, index) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          setCurrentTrackIndex(index);
                          setIsPlaying(true);
                        }}
                        className={`w-full p-3 rounded-lg flex items-center transition-all ${
                          currentTrackIndex === index
                            ? 'bg-violet-100 text-violet-700'
                            : 'hover:bg-violet-50 text-gray-700'
                        }`}
                      >
                        <div className="w-8 flex-shrink-0 flex items-center justify-center">
                          {currentTrackIndex === index && isPlaying ? (
                            <div className="flex space-x-0.5">
                              {[1, 2, 3].map(i => (
                                <div
                                  key={i}
                                  className="w-1 bg-violet-500 rounded-full animate-pulse"
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
  
                        <div className="ml-3 text-left overflow-hidden">
                          <p className="font-medium truncate">{track.title}</p>
                          <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
  
              {tracks.length === 0 && (
                <div className="bg-violet-50 p-4 rounded-lg text-center">
                  <p className="text-violet-700 font-medium mb-2">How to add music:</p>
                  <ol className="list-decimal list-inside text-sm text-violet-600 text-left space-y-1">
                    <li>Create MP3, OGG, or WAV audio files</li>
                    <li>Name files with format: <span className="font-mono bg-violet-100 px-1 rounded">artist_-_title.mp3</span></li>
                    <li>Add these files to <span className="font-mono bg-violet-100 px-1 rounded">src/assets/music/</span> folder</li>
                    <li>Refresh the page to see your music automatically appear</li>
                  </ol>
                </div>
              )}
            </div>
          );
        };

        export default MusicPlayer;
