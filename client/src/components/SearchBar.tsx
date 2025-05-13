import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const TRENDING_TAGS = ["#trending", "#funny", "#reactions", "#memes", "#animals"];

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleTagClick = (tag: string) => {
    const query = tag.replace("#", "");
    setSearchTerm(query);
    onSearch(query);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative mb-8">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <Search className="text-gray-400 mx-3 h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          className="flex-1 py-3 px-2 text-gray-700 dark:text-gray-200 focus:outline-none border-0 outline-none focus:ring-0 ring-0 shadow-none bg-white dark:bg-gray-800"
          placeholder="Search for GIFs..."
          value={searchTerm}
          onChange={handleSearchInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          style={{ color: "#333" }}
        />
        {searchTerm && (
          <button
            className="text-gray-400 mx-3 hover:text-gray-600 transition-colors"
            onClick={handleClearSearch}
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {TRENDING_TAGS.map((tag) => (
          <button
            key={tag}
            className="bg-white dark:bg-gray-800 py-1 px-3 rounded-full text-xs shadow hover:shadow-md transition-shadow text-gray-700 dark:text-gray-300"
            onClick={() => handleTagClick(tag)}
            disabled={isLoading}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
