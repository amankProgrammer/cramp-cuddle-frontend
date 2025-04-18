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

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Load Google Font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@400;700&display=swap';
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
    <div className="min-h-screen flex flex-col">
      {/* Decorative animations */}
      <Animations />

      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-violet-500 text-center">CrampCuddle</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      <nav className="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] py-2">
        <div className="container mx-auto">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`p-3 flex flex-col items-center ${activeTab === 'home' ? 'text-violet-500' : 'text-gray-500'}`}
            >
              <House size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`p-3 flex flex-col items-center ${activeTab === 'music' ? 'text-violet-500' : 'text-gray-500'}`}
            >
              <Music size={20} />
              <span className="text-xs mt-1">Music</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`p-3 flex flex-col items-center ${activeTab === 'gallery' ? 'text-violet-500' : 'text-gray-500'}`}
            >
              <Image size={20} />
              <span className="text-xs mt-1">Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`p-3 flex flex-col items-center ${activeTab === 'memories' ? 'text-violet-500' : 'text-gray-500'}`}
            >
              <Heart size={20} />
              <span className="text-xs mt-1">Memories</span>
            </button>
            <button
              onClick={() => setActiveTab('diary')}
              className={`p-3 flex flex-col items-center ${activeTab === 'diary' ? 'text-violet-500' : 'text-gray-500'}`}
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
