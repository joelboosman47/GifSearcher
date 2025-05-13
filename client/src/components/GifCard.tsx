import { useState } from "react";
import { GiphyGif } from "@/lib/types";
import { Copy, Download, Heart, ZoomIn } from "lucide-react";

interface GifCardProps {
  gif: GiphyGif;
  onClick: () => void;
  onCopy: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
  onPreview: (e: React.MouseEvent) => void;
  onFavorite?: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
}

const GifCard = ({ 
  gif, 
  onClick, 
  onCopy, 
  onDownload, 
  onPreview, 
  onFavorite, 
  isFavorite = false 
}: GifCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(e);
    }
  };

  return (
    <div 
      className="relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse absolute inset-0"></div>
      )}
      <img 
        src={gif.images.fixed_height.url} 
        alt={gif.title || "GIF"}
        className={`w-full h-48 object-cover object-center ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Favorite button that's always visible */}
      {onFavorite && (
        <button
          className={`absolute top-2 left-2 rounded-full p-2 z-10 transition-colors ${
            isFavorite 
              ? 'bg-primary text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 opacity-70 hover:opacity-100'
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={handleFavorite}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} 
          />
        </button>
      )}
      
      {/* Hover actions overlay (desktop) */}
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <div className="flex justify-between items-start">
          <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
            via GIPHY
          </span>
          <button 
            className="text-white hover:text-primary transition-colors" 
            title="Preview GIF"
            onClick={onPreview}
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            className="bg-white dark:bg-gray-700 text-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-full p-2 flex items-center justify-center" 
            title="Copy to clipboard"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4" />
          </button>
          <button 
            className="bg-secondary text-white hover:bg-green-600 transition-colors rounded-full p-2 flex items-center justify-center" 
            title="Download GIF"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GifCard;
