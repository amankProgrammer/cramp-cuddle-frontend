import { useState } from 'react';
import { ImageOff } from 'lucide-react';

// Use Vite's glob import to get all image files from the memories directory
const imageFiles = import.meta.glob('../assets/memories/*.(png|jpg|jpeg|gif|webp)', { eager: true });

interface MemoryImage {
  id: string;
  src: string;
  title: string;
  date: string;
  rotation: number;
}

const Memories = () => {
  const [selectedImage, setSelectedImage] = useState<MemoryImage | null>(null);
  const [images] = useState<MemoryImage[]>(() => {
    return Object.entries(imageFiles).map(([path, module], index) => {
      const fileName = path.split('/').pop() || 'Unknown';
      const title = fileName.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '').replace(/_/g, ' ');
      const randomDate = new Date();
      randomDate.setMonth(randomDate.getMonth() - Math.floor(Math.random() * 24));
      const rotation = Math.random() * 16 - 8;

      return {
        id: `memory-${index}`,
        src: (module as any).default,
        title: title,
        date: randomDate.toISOString(),
        rotation: rotation,
      };
    });
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderContent = () => {
    if (selectedImage) {
      return (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
          <div
            className="relative bg-white shadow-2xl max-w-2xl w-full rounded-lg overflow-hidden"
            style={{
              transform: `scale(0.95) perspective(800px) rotateY(4deg)`,
              transition: 'transform 0.5s ease',
            }}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-white/80 text-black rounded-full hover:bg-white transition-colors shadow-md"
                aria-label="Close memory view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-2">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full object-contain max-h-[70vh] rounded"
              />
            </div>

            <div className="bg-white p-6">
              <h3 className="font-bold text-xl mb-1">{selectedImage.title}</h3>
              <p className="text-gray-500">{formatDate(selectedImage.date)}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-violet-700">Memories</h2>
          <p className="text-gray-500 text-sm mt-1">
            A nostalgic collection of special moments
          </p>
        </div>

        {images.length === 0 ? (
          <div className="py-12 text-center">
            <ImageOff size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No memories found</p>
            <p className="text-gray-400 text-sm">
              Add image files to src/assets/memories/ folder to display them here
            </p>
          </div>
        ) : (
          <div className="overflow-hidden py-4">
            <div className="flex flex-wrap justify-center">
              {images.map((image: MemoryImage) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className="memory-card cursor-pointer m-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                  style={{
                    transform: `rotate(${image.rotation}deg)`,

                  }}
                >
                  <div className="bg-white p-3 shadow-md rounded">
                    <div className="w-48 h-48 overflow-hidden mb-3">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center pb-1">
                      <p className="font-handwriting text-sm font-medium text-gray-800 truncate">{image.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(image.date)}</p>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

export default Memories;
