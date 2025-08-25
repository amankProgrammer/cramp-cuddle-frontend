import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

// Use Vite's glob import to get all images from the DIY directory
const diyImages = import.meta.glob('../assets/diy/*.{jpg,jpeg,png,gif,webp}', { eager: true });

const DIYImages = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageTitle, setImageTitle] = useState<string>('DIY Project');

  // Function to select a random image
  const selectRandomImage = () => {
    const imageEntries = Object.entries(diyImages);
    
    if (imageEntries.length === 0) {
      setCurrentImage(null);
      setImageTitle('No DIY images found');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * imageEntries.length);
    const [path, module] = imageEntries[randomIndex];
    
    // Extract filename from path
    const fileName = path.split('/').pop() || 'DIY Project';
    
    // Remove file extension and replace underscores with spaces
    const nameWithoutExt = fileName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    const title = nameWithoutExt.replace(/_/g, ' ');
    
    setCurrentImage((module as any).default);
    setImageTitle(title);
  };

  // Select a random image on component mount
  useEffect(() => {
    selectRandomImage();
  }, []);

  return (
    <div className="card bg-gradient-to-r from-violet-100 to-pink-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-violet-700">Inspiration</h2>
        <button 
          onClick={selectRandomImage}
          className="p-2 rounded-full hover:bg-violet-100 text-violet-600 transition-colors"
          title="Show another DIY idea"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      
      {currentImage ? (
        <div 
          className="rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex justify-center items-center max-h-96 overflow-hidden">
            <img 
              src={currentImage} 
              alt={imageTitle} 
              className="w-full object-contain max-h-96 transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="p-3 text-center bg-gradient-to-r from-violet-100 to-pink-100">
            <h3 className="font-medium text-violet-700 transition-colors duration-300">{imageTitle}</h3>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-violet-50 rounded-lg transform transition-all duration-300 hover:shadow-lg">
          <p className="text-violet-700 mb-2">No DIY images found</p>
          <p className="text-sm text-violet-600">
            Add your DIY project images to the src/assets/diy directory
          </p>
        </div>
      )}
    </div>
  );
};

export default DIYImages;