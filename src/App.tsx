import { useEffect, useState } from 'react';
import './index.css';
import { Heart, House, Image, Music, Book } from 'lucide-react';
import ComfortMessages from './components/ComfortMessages';
import SelfCare from './components/SelfCare';
import RelaxationTimer from './components/RelaxationTimer';
import MusicPlayer from './components/MusicPlayer';
import Gallery from './components/Gallery';
import Memories from './components/Memories';
import Animations from './components/Animations';
import Diary from './components/Diary';
import DIYImages from './components/DIYImages';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Load Google Font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Great+Vibes&family=Cormorant+Garamond:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <ComfortMessages />
            <DIYImages />
            <RelaxationTimer />
            <SelfCare />
          </div>
        );
      case 'music':
        return <MusicPlayer />;
      case 'gallery':
        return <Gallery />;
      case 'memories':
        return <Memories />;
      case 'diary':
        return <Diary />;
      default:
        return <ComfortMessages />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-violet-100 to-pink-100">
      {/* Decorative animations */}
      <Animations />

      <header className="py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 to-pink-200/50 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl font-great-vibes text-rose-600 text-center drop-shadow-sm">CrampCuddle</h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-rose-200/20 to-pink-200/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {renderContent()}
      </main>
      
      <nav className="bg-rose-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] py-2 ">
        <div className="container mx-auto">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`p-3 flex flex-col items-center ${activeTab === 'home' ? 'text-rose-300' : 'text-violet-800'}`}
            >
              <House size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`p-3 flex flex-col items-center ${activeTab === 'music' ? 'text-rose-300' : 'text-violet-800'}`}
            >
              <Music size={20} />
              <span className="text-xs mt-1">Music</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`p-3 flex flex-col items-center ${activeTab === 'gallery' ? 'text-rose-300' : 'text-violet-800'}`}
            >
              <Image size={20} />
              <span className="text-xs mt-1">Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`p-3 flex flex-col items-center ${activeTab === 'memories' ? 'text-rose-300' : 'text-violet-800'}`}
            >
              <Heart size={20} />
              <span className="text-xs mt-1">Memories</span>
            </button>
            <button
              onClick={() => setActiveTab('diary')}
              className={`p-3 flex flex-col items-center ${activeTab === 'diary' ? 'text-rose-300' : 'text-violet-800'}`}
            >
              <Book size={20} />
              <span className="text-xs mt-1">Diary</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default App;
