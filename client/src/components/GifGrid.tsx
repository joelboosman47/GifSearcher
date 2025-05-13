import { useState } from "react";
import { GiphyGif } from "@/lib/types";
import GifCard from "./GifCard";
import PreviewModal from "./PreviewModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/use-favorites";
import { AlertCircle, Search, SearchX, Loader2 } from "lucide-react";

interface GifGridProps {
  gifs: GiphyGif[];
  hasMore: boolean;
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onLoadMore: () => void;
  onRetry: () => void;
}

const GifGrid = ({ 
  gifs, 
  hasMore, 
  isLoading, 
  isError, 
  searchTerm, 
  onLoadMore, 
  onRetry 
}: GifGridProps) => {
  const [selectedGif, setSelectedGif] = useState<GiphyGif | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  const { isFavorite, toggleFavorite, isToggling } = useFavorites();

  const handleGifSelect = (gif: GiphyGif) => {
    setSelectedGif(gif);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleCopyGif = (gif: GiphyGif, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    navigator.clipboard.writeText(gif.images.original.url)
      .then(() => {
        toast({
          title: "Success",
          description: "GIF URL copied to clipboard!",
          duration: 2000,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy GIF URL",
          variant: "destructive",
          duration: 2000,
        });
      });
  };

  const handleDownloadGif = async (gif: GiphyGif, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    try {
      const response = await fetch(gif.images.original.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${gif.title || 'gif'}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "GIF downloaded successfully!",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download GIF",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Initial state - empty search
  if (!isLoading && !searchTerm && !isError && gifs.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="text-primary mx-auto h-16 w-16 mb-4" />
        <h2 className="text-xl font-medium text-gray-700 mb-2">Start searching for GIFs</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Type a keyword above to find the perfect GIF for your conversations
        </p>
      </div>
    );
  }

  // Loading state
  if (isLoading && gifs.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, index) => (
          <div 
            key={`loading-${index}`} 
            className="bg-gray-200 animate-pulse rounded-lg overflow-hidden h-48 relative"
          />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <AlertCircle className="text-destructive mx-auto h-14 w-14 mb-3" />
        <h2 className="text-xl font-medium text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">We couldn't load the GIFs. Please try again later.</p>
        <Button
          onClick={onRetry}
          className="bg-primary text-white hover:bg-blue-600 transition-colors"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // No results found
  if (!isLoading && searchTerm && gifs.length === 0) {
    return (
      <div className="text-center py-12">
        <SearchX className="text-gray-400 mx-auto h-14 w-14 mb-3" />
        <h2 className="text-xl font-medium text-gray-700 mb-2">No GIFs found</h2>
        <p className="text-gray-500 mb-4">Try a different search term or browse trending GIFs</p>
      </div>
    );
  }

  // Results
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gifs.map((gif) => (
          <GifCard
            key={gif.id}
            gif={gif}
            onClick={() => handleGifSelect(gif)}
            onCopy={(e) => handleCopyGif(gif, e)}
            onDownload={(e) => handleDownloadGif(gif, e)}
            onPreview={(e) => {
              e.stopPropagation();
              handleGifSelect(gif);
            }}
            onFavorite={(e) => {
              e.stopPropagation();
              toggleFavorite(gif);
            }}
            isFavorite={isFavorite(gif.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-white text-primary border border-primary px-6 py-2 hover:bg-primary hover:text-white transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More GIFs"
            )}
          </Button>
        </div>
      )}

      {selectedGif && (
        <PreviewModal
          gif={selectedGif}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          onCopy={() => handleCopyGif(selectedGif)}
          onDownload={() => handleDownloadGif(selectedGif)}
        />
      )}
    </>
  );
};

export default GifGrid;
