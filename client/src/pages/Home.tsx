import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import GifGrid from "@/components/GifGrid";
import { GiphyResponse } from "@/lib/types";

const LIMIT = 9;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  
  const queryKey = searchTerm 
    ? [`/api/gifs/search?q=${searchTerm}&limit=${LIMIT}&offset=${offset}`]
    : [`/api/gifs/trending?limit=${LIMIT}&offset=${offset}`];
  
  const { data, isLoading, isError, refetch } = useQuery<GiphyResponse>({
    queryKey,
    enabled: true,
  });

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setOffset(0);
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + LIMIT);
  };

  const handleRetry = () => {
    refetch();
  };

  const gifs = data?.data || [];
  const hasMore = data?.pagination ? offset + LIMIT < data.pagination.total_count : false;

  return (
    <div>
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      <GifGrid 
        gifs={gifs}
        hasMore={hasMore}
        isLoading={isLoading}
        isError={isError}
        searchTerm={searchTerm}
        onLoadMore={handleLoadMore}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default Home;
