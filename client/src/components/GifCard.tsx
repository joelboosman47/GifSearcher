import { useState } from "react";
import { GiphyGif } from "@/lib/types";
import { Copy, Download, ZoomIn } from "lucide-react";

interface GifCardProps {
  gif: GiphyGif;
  onClick: () => void;
  onCopy: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
  onPreview: (e: React.MouseEvent) => void;
}

const GifCard = ({ gif, onClick, onCopy, onDownload, onPreview }: GifCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className="relative group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="w-full h-48 bg-gray-200 animate-pulse absolute inset-0"></div>
      )}
      <img 
        src={gif.images.fixed_height.url} 
        alt={gif.title || "GIF"}
        className={`w-full h-48 object-cover object-center ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
      
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
            className="bg-white text-dark hover:bg-gray-100 transition-colors rounded-full p-2 flex items-center justify-center" 
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
