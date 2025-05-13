import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GifCard from "@/components/GifCard";
import PreviewModal from "@/components/PreviewModal";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/use-favorites";
import { Link } from "wouter";
import { GiphyGif } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Heart, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

const Favorites = () => {
  const { favorites, isLoading, isError, toggleFavorite } = useFavorites();
  const [selectedGif, setSelectedGif] = useState<GiphyGif | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const handleGifSelect = (gif: GiphyGif) => {
    setSelectedGif(gif);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  // Convert favorite to GiphyGif format for display in cards
  const favoriteToGif = (favorite: any): GiphyGif => {
    return {
      id: favorite.gifId,
      title: favorite.gifTitle || "",
      images: {
        original: {
          url: favorite.gifUrl,
          width: "0",
          height: "0",
          size: "0",
        },
        fixed_height: {
          url: favorite.thumbnailUrl,
          width: "0",
          height: "0",
        },
        fixed_width: {
          url: favorite.thumbnailUrl,
          width: "0",
          height: "0",
        },
        preview_gif: {
          url: favorite.thumbnailUrl,
        },
      },
      source_tld: "",
      source: "",
      import_datetime: "",
      embed_url: "",
      url: favorite.gifUrl,
    };
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

  return (
    <div className="min-h-screen bg-light dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="mr-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Heart className="text-primary h-5 w-5 mr-2" />
            My Favorite GIFs
          </h2>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mt-4">Loading your favorites...</h2>
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <AlertCircle className="text-destructive mx-auto h-14 w-14 mb-3" />
            <h2 className="text-xl font-medium text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">We couldn't load your favorite GIFs. Please try again later.</p>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && !isError && favorites.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Heart className="mx-auto h-14 w-14 mb-3 text-gray-300 dark:text-gray-600" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No favorites yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't saved any GIFs to your favorites.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-blue-600 text-white">
                Search for GIFs
              </Button>
            </Link>
          </div>
        )}
        
        {/* Favorites grid */}
        {!isLoading && !isError && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite) => {
              const gif = favoriteToGif(favorite);
              return (
                <GifCard
                  key={favorite.id}
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
                  isFavorite={true}
                />
              );
            })}
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
        
        <Footer />
      </div>
    </div>
  );
};

export default Favorites;