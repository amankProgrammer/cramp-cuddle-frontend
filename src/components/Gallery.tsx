import { useState } from 'react';
import { ImageOff } from 'lucide-react';

// Use Vite's glob import to get all image files from the images directory
const imageFiles = import.meta.glob('../assets/images/*.(png|jpg|jpeg|gif|webp)', { eager: true });

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  date: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images] = useState<GalleryImage[]>(() => {
    // Process image files to create gallery images
    return Object.entries(imageFiles).map(([path, module], index) => {
      // Extract filename from path
      const fileName = path.split('/').pop() || 'Unknown';

      // Remove file extension for title
      const title = fileName.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '').replace(/_/g, ' ');

      return {
        id: `img-${index}`,
        src: (module as any).default,
        title: title,
        date: new Date().toISOString() // Default date as current time
      };
    });
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render different UI based on current state
  const renderContent = () => {
    if (selectedImage) {
      return (
        <div className="bg-black fixed inset-0 z-10 flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={() => setSelectedImage(null)}
              className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close fullscreen view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="max-h-[80vh] max-w-full">
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>

          <div className="mt-4 text-white">
            <h3 className="font-medium text-lg">{selectedImage.title}</h3>
            <p className="text-sm opacity-80">{formatDate(selectedImage.date)}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-violet-700">Your Gallery</h2>
          <p className="text-gray-500 text-sm mt-1">
            Images from your assets/images directory
          </p>
        </div>

        {images.length === 0 ? (
          <div className="py-12 text-center">
            <ImageOff size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No images found in the directory</p>
            <p className="text-gray-400 text-sm">
              Add image files to src/assets/images/ folder to display them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map(image => (
              <div
                key={image.id}
                className="aspect-square relative group overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium truncate">{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

export default Gallery;
