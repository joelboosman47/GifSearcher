import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Favorite, FavoriteResponse, GiphyGif } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useFavorites() {
  const { toast } = useToast();
  
  // Fetch all favorites
  const { data, isLoading, isError } = useQuery<FavoriteResponse>({
    queryKey: ['/api/favorites'],
  });
  
  const favorites = data?.favorites || [];
  
  // Check if a GIF is favorited
  const isFavorite = (gifId: string): boolean => {
    return favorites.some(fav => fav.gifId === gifId);
  };
  
  // Add a GIF to favorites
  const addFavoriteMutation = useMutation({
    mutationFn: async (gif: GiphyGif) => {
      const favoriteData = {
        gifId: gif.id,
        gifUrl: gif.images.original.url,
        gifTitle: gif.title,
        thumbnailUrl: gif.images.fixed_height.url,
      };
      
      return await apiRequest(
        'POST',
        '/api/favorites', 
        favoriteData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Success",
        description: "GIF added to favorites",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add GIF to favorites",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
  
  // Remove a GIF from favorites
  const removeFavoriteMutation = useMutation({
    mutationFn: async (gifId: string) => {
      return await apiRequest(
        'DELETE',
        `/api/favorites/${gifId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Success",
        description: "GIF removed from favorites",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove GIF from favorites",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
  
  // Toggle favorite status
  const toggleFavorite = (gif: GiphyGif) => {
    if (isFavorite(gif.id)) {
      removeFavoriteMutation.mutate(gif.id);
    } else {
      addFavoriteMutation.mutate(gif);
    }
  };
  
  return {
    favorites,
    isLoading,
    isError,
    isFavorite,
    toggleFavorite,
    isToggling: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}